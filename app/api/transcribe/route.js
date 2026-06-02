import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Missing OPENAI_API_KEY environment variable." }, { status: 500 });
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio) {
      return Response.json({ error: "No audio file was received." }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      response_format: "json"
    });

    return Response.json({ text: transcription.text || "" });
  } catch (error) {
    console.error("Transcription error:", error);
    return Response.json({ error: error?.message || "Transcription failed." }, { status: 500 });
  }
}
