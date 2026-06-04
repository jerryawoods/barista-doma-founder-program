"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Ready");
  const [transcript, setTranscript] = useState("");
  const [logs, setLogs] = useState(["Ready."]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [health, setHealth] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
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
          setStatus("Transcription complete");
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

  function copyTranscript() {
    if (!transcript) {
      log("Copy requested, but there is no transcript yet.");
      setError("There is no transcript to copy yet. Record and transcribe first.");
      return;
    }
    navigator.clipboard?.writeText(transcript).then(
      () => log("Transcript copied."),
      (err) => log(`Copy failed: ${err.message}`)
    );
  }

  return (
    <main className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Voice Diagnostic v3</p>
        <h1>Record voice. Transcribe it. Fill the field.</h1>
        <p>This is separate from v15. Its only job is to prove the real voice path for the Founder Program.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
      </section>

      <section className="card">
        <h2>1. Server Check</h2>
        <p className="small">Run this first after redeploying. It confirms whether Vercel can see the OpenAI key.</p>
        <button className="secondary" onClick={checkServer} type="button">Check Server / API Key</button>
      </section>

      <section className="card">
        <h2>2. Voice Capture</h2>
        <button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : startRecording} type="button">
          {recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}
        </button>
        {audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}
      </section>

      <section className="card">
        <h2>3. Transcript Field</h2>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Transcript will appear here." />
        <button className="secondary" onClick={copyTranscript} type="button">Copy Transcript</button>
      </section>

      <section className="card">
        <h2>Diagnostic Log</h2>
        <div className="log">{logs.join("\n")}</div>
      </section>
    </main>
  );
}
