export const runtime = "nodejs";
export const maxDuration = 60;

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "OPENAI_API_KEY is missing in the Vercel Production environment." }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const input = String(body?.text || "").trim();
    const voice = String(body?.voice || "alloy").trim();

    if (!input) {
      return json({ error: "No Advisor text was provided for speech generation." }, 400);
    }

    if (input.length > 4000) {
      return json({ error: "Advisor text is too long for this diagnostic. Keep it under 4,000 characters." }, 400);
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice,
        input,
        instructions: "Speak as a premium home coffee advisor. Warm, calm, refined, confident, patient, and lightly conversational. Avoid robotic customer-support tone. Use a composed mentor-at-the-counter presence for artisan epicureans.",
        response_format: "mp3"
      })
    });

    if (!response.ok) {
      const raw = await response.text();
      let detail = raw;
      try { detail = JSON.parse(raw)?.error?.message || raw; } catch {}
      return json({ error: `OpenAI speech generation failed with HTTP ${response.status}.`, detail }, 500);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return json({
      error: "The Advisor Voice route crashed.",
      detail: error?.message || String(error)
    }, 500);
  }
}
