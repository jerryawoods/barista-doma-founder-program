export const runtime = "nodejs";
export const maxDuration = 60;

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

const recoveryMatrix = [
  {
    id: "fast-shot-thin-body",
    label: "Fast shot / thin body",
    keywords: ["fast", "ran fast", "too fast", "thin", "watery", "gusher", "raced", "quick"],
    diagnosis: "Likely low puck resistance, often caused by grind too coarse, uneven puck prep, channeling, or too little effective coffee resistance.",
    oneNextMove: "Keep dose steady and move the grind one step finer. Watch for a slower, more syrupy flow before changing anything else."
  },
  {
    id: "choked-shot",
    label: "Choked or stalled shot",
    keywords: ["choked", "stalled", "barely", "no flow", "slow", "dripping", "blocked"],
    diagnosis: "Likely too much resistance, often from grind too fine, overdosing, over-tamping, or an unevenly dense puck.",
    oneNextMove: "Keep the dose steady and move the grind one step coarser. Reset puck prep before changing multiple variables."
  },
  {
    id: "sour-cup",
    label: "Sour / sharp cup",
    keywords: ["sour", "sharp", "acidic", "under", "tart", "lemon"],
    diagnosis: "Likely under-extraction or insufficient sweetness development.",
    oneNextMove: "Aim for slightly more extraction: grind a touch finer or extend yield modestly while keeping the workflow calm."
  },
  {
    id: "bitter-cup",
    label: "Bitter / harsh cup",
    keywords: ["bitter", "harsh", "burnt", "ashy", "dry", "over"],
    diagnosis: "Likely over-extraction, roast intensity, temperature pressure, or too much late-shot bitterness in the cup.",
    oneNextMove: "Shorten the yield slightly or reduce extraction intensity before changing the whole recipe."
  },
  {
    id: "milk-too-foamy",
    label: "Milk too foamy / stiff",
    keywords: ["milk", "foamy", "foam", "stiff", "bubbles", "froth", "too much air"],
    diagnosis: "Likely too much aeration or not enough polishing after adding air.",
    oneNextMove: "Add less air early, then keep the milk rolling and polishing until it looks glossy rather than bubbly."
  },
  {
    id: "channeling-messy-puck",
    label: "Channeling / messy puck",
    keywords: ["channel", "channeling", "spray", "messy puck", "crack", "uneven", "side", "sputter"],
    diagnosis: "Likely uneven distribution, puck fracture, or localized weak spots in the coffee bed.",
    oneNextMove: "Reset distribution and tamp level. Do not chase grind until puck prep is calm and repeatable."
  },
  {
    id: "guest-time-pressure",
    label: "Guest waiting / time pressure",
    keywords: ["guest", "guests", "waiting", "ten minutes", "in a hurry", "running late", "pressure", "nervous", "wife", "husband", "family"],
    diagnosis: "The technical issue is now tied to occasion pressure. The recovery must preserve confidence and hospitality, not just optimize the shot.",
    oneNextMove: "Choose one stabilizing adjustment only. Serve a steady, hospitable cup instead of chasing a perfect reset."
  },
  {
    id: "machine-not-ready",
    label: "Machine readiness / warm-up",
    keywords: ["not ready", "cold", "warm up", "warming", "temperature", "temp", "steam", "purge"],
    diagnosis: "The machine may not be in a stable ready state, which can affect flow, taste, and milk performance.",
    oneNextMove: "Pause for readiness: warm the group, purge appropriately, and let the machine stabilize before the next pull."
  }
];

function scoreMatrixItem(text, item) {
  const lower = text.toLowerCase();
  return item.keywords.reduce((score, keyword) => lower.includes(keyword.toLowerCase()) ? score + 1 : score, 0);
}

function selectMatrixMatch(text) {
  const scored = recoveryMatrix
    .map((item) => ({ ...item, score: scoreMatrixItem(text, item) }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) {
    return {
      id: "general-occasion-advisory",
      label: "General occasion advisory",
      diagnosis: "No specific recovery issue was confidently detected. The Advisor should focus on clarifying the moment, stabilizing the workflow, and guiding one calm next move.",
      oneNextMove: "Ask what changed in the cup, then make only one adjustment at a time."
    };
  }
  return {
    id: best.id,
    label: best.label,
    diagnosis: best.diagnosis,
    oneNextMove: best.oneNextMove
  };
}

function buildPrompt({ transcript, context, matrixMatch }) {
  return `You are the Barista Doma Premium Advisor inside The Home Barista Occasion Simulator.

Your job is NOT to give a generic coffee answer. Your job is to synthesize structured context into refined, occasion-aware guidance for an artisan epicurean at home.

Core doctrine:
- The Recovery Matrix knows what can go wrong.
- The Premium Advisor helps the home barista recover the cup and preserve the occasion.
- Give one next move, not a long troubleshooting lecture.
- Respect the machine, the cup, the room, the guest, and the desired delight.
- Sound warm, calm, composed, premium, practical, and advisory.
- Do not sound like a help desk, chatbot, espresso forum, or machine manual.
- Do not overpromise. If uncertain, say "likely" and guide one safe next move.

Structured context:
Machine: ${context.machine || "Not provided"}
Grinder: ${context.grinder || "Not provided"}
Dose: ${context.dose || "Not provided"}
Yield: ${context.yield || "Not provided"}
Shot time: ${context.shotTime || "Not provided"}
Drink: ${context.drink || "Not provided"}
Recurrence / pattern: ${context.recurrence || "Not provided"}
Occasion: ${context.occasion || "Not provided"}
Who is being served: ${context.guest || "Not provided"}
Time pressure: ${context.timePressure || "Not provided"}
Desired feeling / delight: ${context.desiredFeeling || "Not provided"}

Artisan spoken comment:
${transcript || "No spoken comment provided."}

Likely Recovery Matrix match:
${matrixMatch.label}

Matrix diagnosis:
${matrixMatch.diagnosis}

Matrix one-next-move:
${matrixMatch.oneNextMove}

Write the Advisor response in this exact structure:

I heard:
[One sentence that reflects the artisan's actual situation and mentions specific context where available.]

Likely matrix match:
[Use the matrix label and explain it briefly in plain language.]

Advisor interpretation:
[Explain what this means in this occasion, connecting machine/cup/context/pressure.]

One next move:
[Give one clear action. If machine/dose/yield are available, include them.]

Occasion guidance:
[One or two sentences about preserving the moment, hospitality, rhythm, confidence, and/or delight.]

Advisor close:
[A short premium closing line.]

Keep the complete answer under 220 words.`;
}

function extractText(payload) {
  if (payload?.output_text) return payload.output_text;
  const parts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.text) parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json({ error: "OPENAI_API_KEY is missing in the Vercel Production environment." }, 500);
    }

    const body = await request.json().catch(() => ({}));
    const transcript = String(body?.transcript || "").trim();
    const context = body?.context || {};

    const combinedText = [transcript, ...Object.values(context).map((v) => String(v || ""))].join(" ");
    const matrixMatch = selectMatrixMatch(combinedText);
    const prompt = buildPrompt({ transcript, context, matrixMatch });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.45,
        max_output_tokens: 700
      })
    });

    const raw = await response.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = { raw }; }

    if (!response.ok) {
      return json({
        error: `OpenAI Advisor response failed with HTTP ${response.status}.`,
        detail: parsed?.error?.message || parsed?.raw || raw || "No response body returned.",
        matrixMatch
      }, 500);
    }

    const advisorText = extractText(parsed);
    if (!advisorText) {
      return json({ error: "The Advisor response came back empty.", matrixMatch, raw: parsed }, 500);
    }

    return json({ advisorText, matrixMatch });
  } catch (error) {
    return json({
      error: "The Premium Advisor response route crashed.",
      detail: error?.message || String(error)
    }, 500);
  }
}
