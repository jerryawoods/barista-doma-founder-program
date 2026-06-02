"use client";

import { useRef, useState } from "react";
import "./globals.css";

export default function Home() {
  const [status, setStatus] = useState("Ready");
  const [transcript, setTranscript] = useState("");
  const [logs, setLogs] = useState(["Ready."]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }

  async function startRecording() {
    setAudioUrl("");
    chunksRef.current = [];
    setTranscript("");
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

        const response = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await response.json();

        if (!response.ok) throw new Error(data?.error || `Transcription failed with HTTP ${response.status}`);

        setTranscript(data.text || "");
        setStatus("Transcription complete");
        log(`Transcription returned ${String(data.text || "").length} characters.`);
      };

      recorder.start();
    } catch (error) {
      setRecording(false);
      setStatus(`Error: ${error.message}`);
      log(`Start recording failed: ${error.name || "Error"} — ${error.message}`);
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
    } catch (error) {
      setStatus(`Stop error: ${error.message}`);
      log(`Stop failed: ${error.message}`);
    }
  }

  function copyTranscript() {
    navigator.clipboard?.writeText(transcript || "").then(
      () => log("Transcript copied."),
      (err) => log(`Copy failed: ${err.message}`)
    );
  }

  return (
    <main className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Voice Proof</p>
        <h1>Record voice. Transcribe it. Fill the field.</h1>
        <p>This is separate from v15. Its only job is to prove the real voice path for the Founder Program.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
      </section>

      <section className="card">
        <h2>Voice Capture</h2>
        <button className={recording ? "mic recording" : "mic"} onClick={recording ? stopRecording : startRecording} type="button">
          {recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}
        </button>
        {audioUrl ? <div className="playback"><p>Captured audio playback:</p><audio controls src={audioUrl}></audio></div> : null}
      </section>

      <section className="card">
        <h2>Target Field</h2>
        <p className="hint">In the real app, this transcript will flow into Doma Profile notes, Quick Pull notes, Captured Moment notes, or Doma Report fields.</p>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Transcript will appear here after recording." />
        <button className="secondary" onClick={copyTranscript} type="button">Copy Transcript</button>
      </section>

      <section className="card">
        <h2>Diagnostic Log</h2>
        <pre className="log">{logs.join("\n")}</pre>
      </section>

      <style jsx>{`
        .page{min-height:100vh;padding:14px;max-width:760px;margin:0 auto;background:radial-gradient(circle at top,#33263c 0,#15101b 44%,#09070b 100%)}
        .card{background:linear-gradient(180deg,#1c1722,#15111b);border:1px solid rgba(255,255,255,.13);border-radius:22px;padding:18px;margin:14px 0;box-shadow:0 18px 45px rgba(0,0,0,.32)}
        .eyebrow{color:#d6a55d;font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem;margin:0 0 8px}
        h1{font-size:1.65rem;line-height:1.08;margin:0 0 10px}
        h2{color:#d6a55d;font-size:1.08rem;margin:0 0 10px}
        p{color:#cbbda9;line-height:1.45}
        .statusBox{margin-top:14px;padding:12px;border:1px solid rgba(214,165,93,.35);background:rgba(214,165,93,.08);border-radius:16px;color:#fff8ef}
        .mic{width:100%;min-height:92px;border:0;border-radius:24px;padding:18px;background:linear-gradient(180deg,#ffe0a6,#d6a55d);color:#160f08;font-weight:900;font-size:1.18rem;box-shadow:0 15px 32px rgba(214,165,93,.28);touch-action:manipulation}
        .mic.recording{background:linear-gradient(180deg,#a9ffc2,#58d47b)}
        .secondary{width:100%;border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:14px;margin-top:10px;background:#2a2332;color:#fff8ef;font-weight:800}
        textarea{width:100%;min-height:180px;border-radius:18px;border:1px solid rgba(214,165,93,.35);background:#0b090e;color:#fff8ef;padding:14px;font-size:1.05rem;line-height:1.45;outline:none}
        audio{width:100%}.playback{margin-top:14px}.hint{font-size:.92rem}
        .log{white-space:pre-wrap;word-break:break-word;background:#0b090e;border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:12px;max-height:280px;overflow:auto;color:#d8cab7;font-size:.82rem}
        @media(max-width:480px){.page{padding:10px}.card{border-radius:18px;padding:15px}h1{font-size:1.38rem}.mic{min-height:96px}}
      `}</style>
    </main>
  );
}
