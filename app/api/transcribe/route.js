export const runtime = "nodejs";
export const maxDuration = 60;

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

export async function POST(request) {
  const startedAt = Date.now();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Transcription error: OPENAI_API_KEY is missing in Vercel Production environment.");
      return json({ error: "OPENAI_API_KEY is missing in the Vercel Production environment." }, 500);
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio || typeof audio === "string") {
      console.error("Transcription error: no audio file received.");
      return json({ error: "No audio file was received by /api/transcribe." }, 400);
    }

    const size = audio.size || 0;
    const type = audio.type || "unknown";
    const name = audio.name || "audio.webm";
    console.log(`Received audio: name=${name}, type=${type}, size=${size}`);

    if (!size) {
      return json({ error: "Audio file was received, but it was empty." }, 400);
    }

    const outbound = new FormData();
    outbound.append("file", audio, name);
    outbound.append("model", "whisper-1");
    outbound.append("response_format", "json");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    let openaiResponse;
    try {
      openaiResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: outbound,
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    const raw = await openaiResponse.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = { raw }; }

    if (!openaiResponse.ok) {
      console.error("OpenAI transcription failed:", openaiResponse.status, raw);
      return json({
        error: `OpenAI transcription failed with HTTP ${openaiResponse.status}.`,
        detail: parsed?.error?.message || parsed?.raw || raw || "No response body returned."
      }, 500);
    }

    const text = parsed?.text || "";
    console.log(`Transcription complete: chars=${text.length}, durationMs=${Date.now() - startedAt}`);
    return json({ text, chars: text.length, durationMs: Date.now() - startedAt });
  } catch (error) {
    console.error("Transcription route crashed:", error);
    return json({
      error: error?.name === "AbortError" ? "The transcription request timed out after 45 seconds." : "The transcription route crashed.",
      detail: error?.message || String(error)
    }, 500);
  }
}
