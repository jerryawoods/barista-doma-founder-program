"use client";

import { useRef, useState } from "react";

const advisorStarterText = `I hear that this is your second fast shot on the Breville, using your usual 18g dose and aiming for your house 36g yield. Since you are serving guests in ten minutes, do not chase a full reset. Keep the dose steady, move the grind one step finer, and shorten the next pull if the flow still races. Your aim now is not perfection; it is a steady, hospitable cup that preserves the moment.`;

const defaultContext = {
  machine: "Breville Barista Express",
  grinder: "Built-in grinder",
  dose: "18g",
  yield: "36g",
  shotTime: "About 18 seconds",
  drink: "Cappuccino",
  recurrence: "Second fast shot today",
  occasion: "Before-church coffee at home",
  guest: "My wife / family",
  timePressure: "Guests or family waiting in about ten minutes",
  desiredFeeling: "Steady, hospitable, warm, confident, and delightful"
};

export default function Home() {
  const [status, setStatus] = useState("Ready");
  const [transcript, setTranscript] = useState("");
  const [logs, setLogs] = useState(["Ready."]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);
  const [context, setContext] = useState(defaultContext);
  const [advisorText, setAdvisorText] = useState(advisorStarterText);
  const [matrixMatch, setMatrixMatch] = useState(null);
  const [advisorAudioUrl, setAdvisorAudioUrl] = useState("");
  const [advisorVoice, setAdvisorVoice] = useState("sage");
  const [advisorBusy, setAdvisorBusy] = useState(false);
  const [respondBusy, setRespondBusy] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }

  function updateContext(field, value) {
    setContext((prev) => ({ ...prev, [field]: value }));
  }

  async function checkServer() {
    setError("");
    setStatus("Checking server and API key…");
    log("Checking /api/health.");
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = await response.json();
      setHealth(data);
      if (!response.ok || !data.ok) throw new Error(data?.error || `Health check failed: ${response.status}`);
      const keyMessage = data.hasOpenAIKey ? "OPENAI_API_KEY is present." : "OPENAI_API_KEY is MISSING.";
      setStatus(`Server check complete. ${keyMessage}`);
      log(`Health: ok=${data.ok}, hasOpenAIKey=${data.hasOpenAIKey}, node=${data.node}`);
    } catch (err) {
      setError(err.message);
      setStatus("Server check failed");
      log(`Health check failed: ${err.message}`);
    }
  }

  async function startRecording() {
    setAudioUrl("");
    chunksRef.current = [];
    setTranscript("");
    setError("");
    setMatrixMatch(null);
    setStatus("Requesting microphone…");
    log("Requesting microphone access.");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("This browser does not expose microphone recording APIs.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"];
      let selectedType = "";
      if (typeof MediaRecorder !== "undefined") {
        selectedType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "";
      }
      const recorder = selectedType ? new MediaRecorder(stream, { mimeType: selectedType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstart = () => {
        setRecording(true);
        setStatus("Recording… speak now");
        log(`Recording started. MIME: ${recorder.mimeType || "browser default"}`);
      };
      recorder.onerror = (event) => {
        setStatus("Recording error");
        setError(event?.error?.message || "Unknown recorder error");
        log(`Recording error: ${event?.error?.message || "Unknown recorder error"}`);
      };
      recorder.onstop = async () => {
        setRecording(false);
        setStatus("Recording stopped. Preparing transcription…");
        log("Recording stopped.");
        try { streamRef.current?.getTracks()?.forEach((track) => track.stop()); } catch {}
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        log(`Audio blob created. Size: ${blob.size} bytes`);
        if (!blob.size) {
          setStatus("No audio was captured.");
          setError("The browser stopped recording, but the audio file was empty.");
          log("No audio chunks were captured.");
          return;
        }
        const localUrl = URL.createObjectURL(blob);
        setAudioUrl(localUrl);
        const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("mpeg") ? "mp3" : "webm";
        const file = new File([blob], `barista-doma-voice.${ext}`, { type: mimeType });
        const form = new FormData();
        form.append("audio", file);
        setStatus("Sending audio for transcription…");
        log("Sending audio to /api/transcribe.");
        try {
          const response = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            const message = [data?.error, data?.detail].filter(Boolean).join("\n");
            throw new Error(message || `Transcription failed with HTTP ${response.status}`);
          }
          setTranscript(data.text || "");
          setStatus("Transcription complete. Now generate Advisor response.");
          log(`Transcription returned ${String(data.text || "").length} characters.`);
        } catch (err) {
          setStatus("Transcription failed");
          setError(err.message || String(err));
          log(`Transcription failed: ${err.message || String(err)}`);
        }
      };
      recorder.start();
    } catch (err) {
      setRecording(false);
      setStatus(`Error: ${err.message}`);
      setError(err.message);
      log(`Start recording failed: ${err.name || "Error"} — ${err.message}`);
      try { streamRef.current?.getTracks()?.forEach((track) => track.stop()); } catch {}
    }
  }

  function stopRecording() {
    try {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
        setStatus("Stopping…");
        log("Stop requested.");
      }
    } catch (err) {
      setStatus(`Stop error: ${err.message}`);
      setError(err.message);
      log(`Stop failed: ${err.message}`);
    }
  }

  async function generateAdvisorResponse() {
    setError("");
    setRespondBusy(true);
    setAdvisorAudioUrl("");
    setStatus("Generating Premium Advisor response…");
    log("Sending transcript + structured context to /api/respond.");
    try {
      const response = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, context })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Advisor response failed with HTTP ${response.status}`);
      }
      setAdvisorText(data.advisorText || "");
      setMatrixMatch(data.matrixMatch || null);
      setStatus("Advisor response ready. You may now generate Advisor Voice.");
      log(`Advisor response returned ${String(data.advisorText || "").length} characters. Matrix: ${data.matrixMatch?.label || "None"}`);
    } catch (err) {
      setStatus("Advisor response failed");
      setError(err.message || String(err));
      log(`Advisor response failed: ${err.message || String(err)}`);
    } finally {
      setRespondBusy(false);
    }
  }

  async function generateAdvisorVoice() {
    setError("");
    setAdvisorBusy(true);
    setAdvisorAudioUrl("");
    setStatus("Generating Advisor Voice…");
    log("Sending Advisor response to /api/speak.");
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: advisorText, voice: advisorVoice })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Advisor Voice failed with HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAdvisorAudioUrl(url);
      setStatus("Advisor Voice ready");
      log(`Advisor Voice returned audio: ${blob.size} bytes.`);
    } catch (err) {
      setStatus("Advisor Voice failed");
      setError(err.message || String(err));
      log(`Advisor Voice failed: ${err.message || String(err)}`);
    } finally {
      setAdvisorBusy(false);
    }
  }

  function fillScenario() {
    setContext(defaultContext);
    setTranscript("The shot ran too fast and tasted thin. This is the second time it happened today. I am making this for my wife before church and I do not want to ruin the moment.");
    setStatus("Sample scenario loaded. Generate Advisor response when ready.");
    log("Loaded sample premium advisor scenario.");
  }

  return (
    <main className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Advisor Interaction Diagnostic v5</p>
        <h1>Speak the occasion in. Let the Advisor synthesize and speak back.</h1>
        <p>This proves the premium loop: voice capture, transcript, structured context, Recovery Matrix match, Advisor response, and Advisor Voice.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
      </section>

      <section className="card">
        <h2>1. Server Check</h2>
        <p className="small">Run this first. It confirms whether Vercel can see the OpenAI key.</p>
        <button className="secondary" onClick={checkServer} type="button">Check Server / API Key</button>
      </section>

      <section className="card">
        <h2>2. Structured Context</h2>
        <p className="small">This is the beginning of the moat: the Advisor synthesizes from machine, house formula, occasion, and live artisan comments.</p>
        <div className="grid">
          <Field label="Machine" value={context.machine} onChange={(v) => updateContext("machine", v)} />
          <Field label="Grinder" value={context.grinder} onChange={(v) => updateContext("grinder", v)} />
          <Field label="Dose" value={context.dose} onChange={(v) => updateContext("dose", v)} />
          <Field label="Yield" value={context.yield} onChange={(v) => updateContext("yield", v)} />
          <Field label="Shot time" value={context.shotTime} onChange={(v) => updateContext("shotTime", v)} />
          <Field label="Drink" value={context.drink} onChange={(v) => updateContext("drink", v)} />
          <Field label="Recurrence / pattern" value={context.recurrence} onChange={(v) => updateContext("recurrence", v)} />
          <Field label="Occasion" value={context.occasion} onChange={(v) => updateContext("occasion", v)} />
          <Field label="Who is being served" value={context.guest} onChange={(v) => updateContext("guest", v)} />
          <Field label="Time pressure" value={context.timePressure} onChange={(v) => updateContext("timePressure", v)} />
        </div>
        <label className="label" htmlFor="desiredFeeling">Desired feeling / delight</label>
        <input id="desiredFeeling" value={context.desiredFeeling} onChange={(e) => updateContext("desiredFeeling", e.target.value)} />
        <button className="secondary" onClick={fillScenario} type="button">Load Sample Fast Shot Scenario</button>
      </section>

      <section className="card">
        <h2>3. Artisan Voice Capture</h2>
        <p className="small">Speak what happened with the cup, machine, room, guest, or occasion.</p>
        <button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : startRecording} type="button">
          {recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}
        </button>
        {audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}
      </section>

      <section className="card">
        <h2>4. Artisan Transcript / Comment</h2>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Transcript will appear here. You can also type a scenario manually." />
      </section>

      <section className="card advisorCard">
        <h2>5. Premium Advisor Response</h2>
        <p className="small">This is not a generic AI answer. It uses structured context + a starter Recovery Matrix + Barista Doma Advisor rules.</p>
        <button className="primary" onClick={generateAdvisorResponse} disabled={respondBusy} type="button">
          {respondBusy ? "Generating…" : "Generate Advisor Response"}
        </button>
        {matrixMatch ? <div className="successBox"><strong>Likely Matrix Match:</strong> {matrixMatch.label}<br /><strong>Matrix One Next Move:</strong> {matrixMatch.oneNextMove}</div> : null}
        <label className="label" htmlFor="advisorText">Advisor response</label>
        <textarea id="advisorText" value={advisorText} onChange={(e) => setAdvisorText(e.target.value)} placeholder="Advisor response will appear here." />
      </section>

      <section className="card advisorCard">
        <h2>6. Advisor Voice</h2>
        <p className="small">Generate premium audio from the Advisor response.</p>
        <label className="label" htmlFor="advisorVoice">Advisor voice option</label>
        <select id="advisorVoice" value={advisorVoice} onChange={(e) => setAdvisorVoice(e.target.value)}>
          <option value="alloy">Alloy — balanced and clear</option>
          <option value="verse">Verse — expressive and warm</option>
          <option value="sage">Sage — calm and composed</option>
          <option value="coral">Coral — bright and friendly</option>
          <option value="ash">Ash — steady and grounded</option>
        </select>
        <button className="primary" onClick={generateAdvisorVoice} disabled={advisorBusy || !advisorText} type="button">
          {advisorBusy ? "Generating…" : "Generate Advisor Voice"}
        </button>
        {advisorAudioUrl ? <><h3>Advisor Audio Playback</h3><audio controls autoPlay src={advisorAudioUrl} /></> : null}
      </section>

      <section className="card principleCard">
        <h2>Product Principle Being Tested</h2>
        <p><strong>The Recovery Matrix knows what can go wrong.</strong></p>
        <p><strong>The Premium Advisor synthesizes structured context into refined, occasion-aware guidance.</strong></p>
      </section>

      <section className="card">
        <h2>Diagnostic Log</h2>
        <div className="log">{logs.join("\n")}</div>
      </section>
    </main>
  );
}

function Field({ label, value, onChange }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
