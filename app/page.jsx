"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const defaultProfile = {
  founderName: "Jerry",
  roleIdentity: "Home barista in training",
  machine: "Breville Barista Express",
  grinder: "Built-in grinder",
  beans: "House espresso beans",
  experienceLevel: "Developing confidence",
  preferredDrinks: "Cappuccino, espresso, milk drinks",
  houseDose: "18g",
  houseYield: "36g",
  houseShotTime: "About 25-30 seconds when dialed in",
  milkStyle: "Creamy microfoam for warmth and comfort"
};

const defaultOccasion = {
  occasionName: "Before-church coffee at home",
  drink: "Cappuccino",
  guest: "My wife / family",
  timePressure: "Guests or family waiting in about ten minutes",
  desiredFeeling: "Steady, hospitable, warm, confident, and delightful",
  recurrence: "Second fast shot today",
  currentShotTime: "About 18 seconds",
  momentIntent: "Serve a steady cup that preserves the morning and creates delight"
};

const advisorStarterText = `The form grounds. The artisan voice clarifies. The Advisor synthesizes. Capture a voice note or load a scenario, then generate an Advisor response.`;

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [status, setStatus] = useState("Ready");
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState(["Ready."]);
  const [profile, setProfile] = useState(defaultProfile);
  const [occasion, setOccasion] = useState(defaultOccasion);
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [advisorText, setAdvisorText] = useState(advisorStarterText);
  const [synthesis, setSynthesis] = useState(null);
  const [matrixMatch, setMatrixMatch] = useState(null);
  const [advisorVoice, setAdvisorVoice] = useState("sage");
  const [advisorAudioUrl, setAdvisorAudioUrl] = useState("");
  const [respondBusy, setRespondBusy] = useState(false);
  const [advisorBusy, setAdvisorBusy] = useState(false);
  const [reports, setReports] = useState([]);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("bd_profile_v7");
      const savedOccasion = localStorage.getItem("bd_occasion_v7");
      const savedReports = localStorage.getItem("bd_reports_v7");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedOccasion) setOccasion(JSON.parse(savedOccasion));
      if (savedReports) setReports(JSON.parse(savedReports));
    } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem("bd_profile_v7", JSON.stringify(profile)); } catch {} }, [profile]);
  useEffect(() => { try { localStorage.setItem("bd_occasion_v7", JSON.stringify(occasion)); } catch {} }, [occasion]);
  useEffect(() => { try { localStorage.setItem("bd_reports_v7", JSON.stringify(reports)); } catch {} }, [reports]);

  const context = useMemo(() => ({
    machine: profile.machine,
    grinder: profile.grinder,
    dose: profile.houseDose,
    yield: profile.houseYield,
    shotTime: occasion.currentShotTime,
    drink: occasion.drink,
    recurrence: occasion.recurrence,
    occasion: occasion.occasionName,
    guest: occasion.guest,
    timePressure: occasion.timePressure,
    desiredFeeling: occasion.desiredFeeling,
    beans: profile.beans,
    experienceLevel: profile.experienceLevel,
    milkStyle: profile.milkStyle,
    momentIntent: occasion.momentIntent
  }), [profile, occasion]);

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }
  function updateProfile(field, value) { setProfile((prev) => ({ ...prev, [field]: value })); }
  function updateOccasion(field, value) { setOccasion((prev) => ({ ...prev, [field]: value })); }

  async function checkServer() {
    setError(""); setStatus("Checking server and API key…"); log("Checking /api/health.");
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = await response.json();
      setHealth(data);
      if (!response.ok || !data.ok) throw new Error(data?.error || `Health check failed: ${response.status}`);
      setStatus(`Server check complete. ${data.hasOpenAIKey ? "OPENAI_API_KEY is present." : "OPENAI_API_KEY is MISSING."}`);
      log(`Health: ok=${data.ok}, hasOpenAIKey=${data.hasOpenAIKey}, node=${data.node}`);
    } catch (err) { setError(err.message); setStatus("Server check failed"); log(`Health check failed: ${err.message}`); }
  }

  async function startRecording() {
    setAudioUrl(""); chunksRef.current = []; setTranscript(""); setError(""); setMatrixMatch(null); setSynthesis(null);
    setStatus("Requesting microphone…"); log("Requesting microphone access.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/mpeg"];
      const selectedType = preferredTypes.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) || "";
      const recorder = selectedType ? new MediaRecorder(stream, { mimeType: selectedType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data?.size > 0) chunksRef.current.push(event.data); };
      recorder.onstart = () => { setRecording(true); setStatus("Recording… speak now"); log(`Recording started. MIME: ${recorder.mimeType || "browser default"}`); };
      recorder.onstop = async () => {
        setRecording(false); setStatus("Recording stopped. Preparing transcription…"); log("Recording stopped.");
        try { streamRef.current?.getTracks()?.forEach((track) => track.stop()); } catch {}
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        log(`Audio blob created. Size: ${blob.size} bytes`);
        if (!blob.size) throw new Error("The browser stopped recording, but the audio file was empty.");
        setAudioUrl(URL.createObjectURL(blob));
        const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("mpeg") ? "mp3" : "webm";
        const form = new FormData();
        form.append("audio", new File([blob], `barista-doma-voice.${ext}`, { type: mimeType }));
        setStatus("Sending audio for transcription…"); log("Sending audio to /api/transcribe.");
        const response = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Transcription failed with HTTP ${response.status}`);
        setTranscript(data.text || ""); setStatus("Transcription complete. Generate Advisor response next."); log(`Transcription returned ${String(data.text || "").length} characters.`);
      };
      recorder.start();
    } catch (err) { setRecording(false); setStatus(`Error: ${err.message}`); setError(err.message); log(`Recording failed: ${err.message}`); }
  }
  function stopRecording() {
    try { if (recorderRef.current && recorderRef.current.state !== "inactive") { recorderRef.current.stop(); setStatus("Stopping…"); log("Stop requested."); } }
    catch (err) { setError(err.message); log(`Stop failed: ${err.message}`); }
  }

  async function generateAdvisorResponse() {
    setError(""); setRespondBusy(true); setAdvisorAudioUrl(""); setStatus("Generating Premium Advisor response…"); log("Sending form + voice to /api/respond.");
    try {
      const response = await fetch("/api/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, context }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Advisor response failed with HTTP ${response.status}`);
      setAdvisorText(data.advisorText || ""); setMatrixMatch(data.matrixMatch || null); setSynthesis(data.synthesis || null);
      setStatus("Advisor response ready. Generate Advisor Voice or create Doma Report.");
      log(`Advisor response returned ${String(data.advisorText || "").length} chars. Intent: ${data.synthesis?.detectedArtisanIntent || "unknown"}.`);
      setActive("simulator");
    } catch (err) { setStatus("Advisor response failed"); setError(err.message || String(err)); log(`Advisor response failed: ${err.message || String(err)}`); }
    finally { setRespondBusy(false); }
  }

  async function generateAdvisorVoice() {
    setError(""); setAdvisorBusy(true); setAdvisorAudioUrl(""); setStatus("Generating Advisor Voice…"); log("Sending Advisor response to /api/speak.");
    try {
      const response = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: advisorText, voice: advisorVoice }) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Advisor Voice failed with HTTP ${response.status}`); }
      const blob = await response.blob(); setAdvisorAudioUrl(URL.createObjectURL(blob)); setStatus("Advisor Voice ready"); log(`Advisor Voice returned audio: ${blob.size} bytes.`);
    } catch (err) { setStatus("Advisor Voice failed"); setError(err.message || String(err)); log(`Advisor Voice failed: ${err.message || String(err)}`); }
    finally { setAdvisorBusy(false); }
  }

  function loadClearFastShot() {
    setProfile(defaultProfile); setOccasion(defaultOccasion);
    setTranscript("Good morning, Advisor. I need help with my family this morning. The shot ran too fast and tasted thin, and I do not want to ruin the moment before church.");
    setStatus("Sample Occasion loaded."); log("Loaded integrated sample Occasion."); setActive("simulator");
  }
  function createReport() {
    const report = {
      id: Date.now(), createdAt: new Date().toLocaleString(), title: occasion.occasionName || "Home Coffee Occasion",
      drink: occasion.drink, guest: occasion.guest, transcript, advisorText,
      synthesis, matrixMatch, context
    };
    setReports((prev) => [report, ...prev]); setStatus("Doma Report created."); log("Created Doma Report from current Occasion."); setActive("reports");
  }
  function clearReports() { setReports([]); log("Cleared local reports."); }

  return (
    <main className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Founder Program Prototype v7</p>
        <h1>Home Barista Occasion Simulator — Integrated Flow</h1>
        <p>This puts the experience together: onboarding, dashboard, Occasion setup, form + voice synthesis, Premium Advisor, Advisor Voice, and Doma Reports.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
        <div className="navBar">
          {["dashboard", "onboarding", "occasion", "simulator", "reports", "matrix"].map((tab) => (
            <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)} type="button">{tabLabel(tab)}</button>
          ))}
        </div>
      </section>

      {active === "dashboard" && <Dashboard checkServer={checkServer} loadClearFastShot={loadClearFastShot} setActive={setActive} profile={profile} occasion={occasion} reports={reports} health={health} />}
      {active === "onboarding" && <Onboarding profile={profile} updateProfile={updateProfile} setActive={setActive} />}
      {active === "occasion" && <OccasionSetup occasion={occasion} updateOccasion={updateOccasion} setActive={setActive} loadClearFastShot={loadClearFastShot} />}
      {active === "simulator" && <Simulator {...{ recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, createReport }} />}
      {active === "reports" && <Reports reports={reports} clearReports={clearReports} setActive={setActive} />}
      {active === "matrix" && <Matrix />}

      <section className="card principleCard">
        <h2>Product Principle</h2>
        <p><strong>The form grounds.</strong> The Doma Profile, Machine Passport, House Formula, and Occasion setup prevent generic answers.</p>
        <p><strong>The artisan voice clarifies.</strong> The live comment adds nuance, emotion, uncertainty, and situational detail.</p>
        <p><strong>The Advisor synthesizes.</strong> The Recovery Matrix grounds the diagnosis; the Premium Advisor preserves the occasion and speaks back with care, confidence, and delight.</p>
      </section>

      <section className="card"><h2>Diagnostic Log</h2><div className="log">{logs.join("\n")}</div></section>
    </main>
  );
}

function tabLabel(tab) { return ({ dashboard: "Dashboard", onboarding: "Onboarding", occasion: "Occasion", simulator: "Simulator", reports: "Doma Reports", matrix: "Recovery Matrix" })[tab]; }

function Dashboard({ checkServer, loadClearFastShot, setActive, profile, occasion, reports, health }) {
  return <section className="card"><h2>Founder Dashboard</h2><p className="small">A single front door for the Founder Program experience.</p><div className="tiles"><Tile title="Server" value={health?.hasOpenAIKey ? "Connected" : "Check needed"} /><Tile title="Machine" value={profile.machine || "Not set"} /><Tile title="House Formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} /><Tile title="Current Occasion" value={occasion.occasionName || "Not set"} /><Tile title="Saved Reports" value={String(reports.length)} /></div><div className="buttonRow"><button className="primary" onClick={checkServer}>Check Server / API Key</button><button className="secondary" onClick={() => setActive("onboarding")}>Open Doma Profile</button><button className="secondary" onClick={() => setActive("occasion")}>Set Up Occasion</button><button className="primary" onClick={loadClearFastShot}>Load Sample Full Flow</button><button className="secondary" onClick={() => setActive("simulator")}>Go to Simulator</button></div></section>;
}
function Tile({ title, value }) { return <div className="tile"><p>{title}</p><strong>{value}</strong></div>; }

function Onboarding({ profile, updateProfile, setActive }) {
  return <section className="card"><h2>Doma Profile / Machine Passport</h2><p className="small">This is the structured context that makes the Advisor different from a generic AI answer.</p><div className="grid"><Field label="Founder / artisan name" value={profile.founderName} onChange={(v) => updateProfile("founderName", v)} /><Field label="Role identity" value={profile.roleIdentity} onChange={(v) => updateProfile("roleIdentity", v)} /><Field label="Machine" value={profile.machine} onChange={(v) => updateProfile("machine", v)} /><Field label="Grinder" value={profile.grinder} onChange={(v) => updateProfile("grinder", v)} /><Field label="Beans" value={profile.beans} onChange={(v) => updateProfile("beans", v)} /><Field label="Experience level" value={profile.experienceLevel} onChange={(v) => updateProfile("experienceLevel", v)} /><Field label="House dose" value={profile.houseDose} onChange={(v) => updateProfile("houseDose", v)} /><Field label="House yield" value={profile.houseYield} onChange={(v) => updateProfile("houseYield", v)} /><Field label="House shot time" value={profile.houseShotTime} onChange={(v) => updateProfile("houseShotTime", v)} /><Field label="Preferred drinks" value={profile.preferredDrinks} onChange={(v) => updateProfile("preferredDrinks", v)} /></div><label className="label">Milk style / service preference</label><input value={profile.milkStyle} onChange={(e) => updateProfile("milkStyle", e.target.value)} /><button className="primary" onClick={() => setActive("occasion")}>Continue to Occasion Setup</button></section>;
}

function OccasionSetup({ occasion, updateOccasion, setActive, loadClearFastShot }) {
  return <section className="card"><h2>Occasion Setup</h2><p className="small">The product is not only about the cup. It prepares the barista for the moment.</p><div className="grid"><Field label="Occasion name" value={occasion.occasionName} onChange={(v) => updateOccasion("occasionName", v)} /><Field label="Drink" value={occasion.drink} onChange={(v) => updateOccasion("drink", v)} /><Field label="Who is being served" value={occasion.guest} onChange={(v) => updateOccasion("guest", v)} /><Field label="Time pressure" value={occasion.timePressure} onChange={(v) => updateOccasion("timePressure", v)} /><Field label="Current shot time" value={occasion.currentShotTime} onChange={(v) => updateOccasion("currentShotTime", v)} /><Field label="Recurrence / pattern" value={occasion.recurrence} onChange={(v) => updateOccasion("recurrence", v)} /></div><label className="label">Desired feeling / delight</label><input value={occasion.desiredFeeling} onChange={(e) => updateOccasion("desiredFeeling", e.target.value)} /><label className="label">Moment intent</label><textarea value={occasion.momentIntent} onChange={(e) => updateOccasion("momentIntent", e.target.value)} /><div className="buttonRow"><button className="secondary" onClick={loadClearFastShot}>Load Sample Before-Church Occasion</button><button className="primary" onClick={() => setActive("simulator")}>Begin Occasion Simulation</button></div></section>;
}

function Simulator(props) {
  const { recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, createReport } = props;
  return <><section className="card"><h2>Occasion Simulator</h2><p className="small">Speak what is happening with the cup, machine, room, guest, or occasion. The form grounds; your voice clarifies.</p><button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : startRecording}>{recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}</button>{audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}<label className="label">Artisan transcript / comment</label><textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Speak or type what happened." /><button className="primary" onClick={generateAdvisorResponse} disabled={respondBusy}>{respondBusy ? "Generating…" : "Generate Advisor Response"}</button></section><section className="card advisorCard"><h2>Premium Advisor Response</h2>{synthesis ? <SynthesisPanel synthesis={synthesis} /> : <div className="noteBox">Advisor Understanding will appear here.</div>}{matrixMatch ? <div className="successBox"><strong>Likely Matrix Match:</strong> {matrixMatch.label}<br /><strong>Matrix One Next Move:</strong> {matrixMatch.oneNextMove}</div> : <div className="noteBox"><strong>Matrix Match:</strong> None applied yet, or not appropriate for the artisan's intent.</div>}<label className="label">Advisor response</label><textarea value={advisorText} onChange={(e) => setAdvisorText(e.target.value)} /><label className="label">Advisor voice option</label><select value={advisorVoice} onChange={(e) => setAdvisorVoice(e.target.value)}><option value="alloy">Alloy — balanced and clear</option><option value="verse">Verse — expressive and warm</option><option value="sage">Sage — calm and composed</option><option value="coral">Coral — bright and friendly</option><option value="ash">Ash — steady and grounded</option></select><div className="buttonRow"><button className="primary" onClick={generateAdvisorVoice} disabled={advisorBusy || !advisorText}>{advisorBusy ? "Generating…" : "Generate Advisor Voice"}</button><button className="secondary" onClick={createReport} disabled={!advisorText || advisorText === advisorStarterText}>Create Doma Report</button></div>{advisorAudioUrl ? <><h3>Advisor Audio Playback</h3><audio controls autoPlay src={advisorAudioUrl} /></> : null}</section></>;
}

function Reports({ reports, clearReports, setActive }) {
  return <section className="card"><h2>Doma Reports / Refinement Records</h2><p className="small">This is where each Occasion becomes memory: what happened, what the Advisor understood, what was recommended, and what can be refined later.</p>{reports.length === 0 ? <div className="noteBox">No reports yet. Run the Simulator and create a Doma Report.</div> : reports.map((r) => <article className="report" key={r.id}><h3>{r.title}</h3><p className="small">{r.createdAt} • {r.drink} • Served to: {r.guest}</p><p><strong>Artisan said:</strong> {r.transcript || "No transcript captured."}</p><p><strong>Matrix:</strong> {r.matrixMatch?.label || "None"}</p><details><summary>Advisor response</summary><pre>{r.advisorText}</pre></details></article>)}<div className="buttonRow"><button className="primary" onClick={() => setActive("simulator")}>Create New Occasion Report</button><button className="secondary" onClick={clearReports}>Clear Local Reports</button></div></section>;
}

function Matrix() {
  const rows = [["Fast shot / low resistance", "Keep dose steady; grind one step finer; watch for slower, syrupy flow."], ["Guest waiting / time pressure", "Choose one stabilizing adjustment; preserve the occasion."], ["Thin body", "Check extraction strength, ratio, and milk texture for body."], ["System check / unclear voice", "Do not force recovery; confirm what the Advisor heard."], ["Incomplete form", "Ask the artisan to complete required context before guidance."]];
  return <section className="card"><h2>Recovery Matrix Knowledge Base</h2><p className="small">In the real product this becomes the ever-expanding knowledge base. The Premium Advisor sits above it and interprets the moment.</p><div className="matrixList">{rows.map(([issue, move]) => <div className="matrixItem" key={issue}><strong>{issue}</strong><p>{move}</p></div>)}</div></section>;
}

function SynthesisPanel({ synthesis }) {
  return <div className="synthesisBox"><h3>Advisor Understanding</h3><p><strong>Form complete:</strong> {String(synthesis.formComplete)}</p>{synthesis.missingFields?.length ? <p><strong>Missing fields:</strong> {synthesis.missingFields.join(", ")}</p> : null}<p><strong>Detected artisan intent:</strong> {synthesis.detectedArtisanIntent}</p><p><strong>Voice quality:</strong> {synthesis.voiceQuality}</p><p><strong>Primary live signal:</strong> {synthesis.primaryLiveSignal}</p><p><strong>Supporting context used:</strong> {synthesis.supportingContextUsed || "None"}</p><p><strong>Matrix applied:</strong> {String(synthesis.matrixApplied)}</p>{synthesis.primaryMatrixSignal ? <p><strong>Primary matrix signal:</strong> {synthesis.primaryMatrixSignal.label}</p> : null}{synthesis.secondaryMatrixSignal ? <p><strong>Secondary matrix signal:</strong> {synthesis.secondaryMatrixSignal.label}</p> : null}</div>;
}
function Field({ label, value, onChange }) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <div><label className="label" htmlFor={id}>{label}</label><input id={id} value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
