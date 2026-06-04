export const runtime = "nodejs";
export const maxDuration = 60;

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

const recoveryMatrix = [
  {
    id: "fast-shot-thin-body",
    label: "Fast shot / low resistance / thin body",
    type: "technical",
    priority: 100,
    keywords: ["fast", "ran fast", "too fast", "thin", "watery", "gusher", "raced", "quick", "18 seconds", "short shot time", "low resistance"],
    diagnosis: "Likely low puck resistance, often caused by grind too coarse, uneven puck prep, channeling, or too little effective coffee resistance.",
    oneNextMove: "Keep the dose steady and move the grind one step finer. Watch for a slower, more syrupy flow before changing anything else.",
    guardrail: "For a fast shot, do not recommend a coarser grind as the primary move. The normal stabilizing move is finer grind while holding dose steady."
  },
  {
    id: "choked-shot",
    label: "Choked or stalled shot / high resistance",
    type: "technical",
    priority: 95,
    keywords: ["choked", "stalled", "barely", "no flow", "slow", "dripping", "blocked", "too slow", "over resistance"],
    diagnosis: "Likely too much resistance, often from grind too fine, overdosing, over-tamping, or an unevenly dense puck.",
    oneNextMove: "Keep the dose steady and move the grind one step coarser. Reset puck prep before changing multiple variables.",
    guardrail: "For a choked shot, do not recommend finer grind as the primary move."
  },
  {
    id: "sour-cup",
    label: "Sour / sharp cup",
    type: "technical",
    priority: 80,
    keywords: ["sour", "sharp", "acidic", "under", "tart", "lemon", "underextracted", "under extracted"],
    diagnosis: "Likely under-extraction or insufficient sweetness development.",
    oneNextMove: "Aim for slightly more extraction: grind a touch finer or extend yield modestly while keeping the workflow calm.",
    guardrail: "Keep the guidance modest and avoid changing dose, grind, yield, and temperature all at once."
  },
  {
    id: "bitter-cup",
    label: "Bitter / harsh cup",
    type: "technical",
    priority: 80,
    keywords: ["bitter", "harsh", "burnt", "ashy", "dry", "over", "overextracted", "over extracted"],
    diagnosis: "Likely over-extraction, roast intensity, temperature pressure, or too much late-shot bitterness in the cup.",
    oneNextMove: "Shorten the yield slightly or reduce extraction intensity before changing the whole recipe.",
    guardrail: "Avoid a full recipe reset unless the artisan is in private practice rather than a serving moment."
  },
  {
    id: "milk-too-foamy",
    label: "Milk too foamy / stiff",
    type: "technical",
    priority: 70,
    keywords: ["milk", "foamy", "foam", "stiff", "bubbles", "froth", "too much air", "latte art"],
    diagnosis: "Likely too much aeration or not enough polishing after adding air.",
    oneNextMove: "Add less air early, then keep the milk rolling and polishing until it looks glossy rather than bubbly.",
    guardrail: "Keep the milk advice practical and service-oriented."
  },
  {
    id: "channeling-messy-puck",
    label: "Channeling / messy puck",
    type: "technical",
    priority: 85,
    keywords: ["channel", "channeling", "spray", "messy puck", "crack", "uneven", "side", "sputter", "messy"],
    diagnosis: "Likely uneven distribution, puck fracture, or localized weak spots in the coffee bed.",
    oneNextMove: "Reset distribution and tamp level. Do not chase grind until puck prep is calm and repeatable.",
    guardrail: "Do not over-index on grind if the artisan reports spray, cracks, unevenness, or messy puck signs."
  },
  {
    id: "guest-time-pressure",
    label: "Guest waiting / time pressure",
    type: "occasion",
    priority: 60,
    keywords: ["guest", "guests", "waiting", "ten minutes", "in a hurry", "running late", "pressure", "nervous", "wife", "husband", "family", "before church", "serve", "serving"],
    diagnosis: "The technical issue is tied to occasion pressure. The recovery must preserve confidence and hospitality, not just optimize the shot.",
    oneNextMove: "Choose one stabilizing adjustment only. Serve a steady, hospitable cup instead of chasing a perfect reset.",
    guardrail: "Do not let the Advisor turn a serving moment into an extended private dial-in session."
  },
  {
    id: "machine-not-ready",
    label: "Machine readiness / warm-up",
    type: "technical",
    priority: 75,
    keywords: ["not ready", "cold", "warm up", "warming", "temperature", "temp", "steam", "purge", "not purged"],
    diagnosis: "The machine may not be in a stable ready state, which can affect flow, taste, and milk performance.",
    oneNextMove: "Pause for readiness: warm the group, purge appropriately, and let the machine stabilize before the next pull.",
    guardrail: "Prioritize machine readiness before fine taste interpretation if readiness is clearly missing."
  }
];

function scoreMatrixItem(text, item) {
  const lower = text.toLowerCase();
  return item.keywords.reduce((score, keyword) => lower.includes(keyword.toLowerCase()) ? score + 1 : score, 0);
}

function selectMatrixSignals(text) {
  const scored = recoveryMatrix
    .map((item) => ({ ...item, score: scoreMatrixItem(text, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => (b.score * b.priority) - (a.score * a.priority));

  if (!scored.length) {
    const fallback = {
      id: "general-occasion-advisory",
      label: "General occasion advisory",
      type: "general",
      score: 0,
      diagnosis: "No specific recovery issue was confidently detected. The Advisor should clarify the moment, stabilize the workflow, and guide one calm next move.",
      oneNextMove: "Ask what changed in the cup, then make only one adjustment at a time.",
      guardrail: "Do not invent technical certainty when the evidence is weak."
    };
    return { primary: fallback, secondary: null, all: [fallback] };
  }

  const primary = scored.find((item) => item.type === "technical") || scored[0];
  const secondary = scored.find((item) => item.id !== primary.id && item.type === "occasion")
    || scored.find((item) => item.id !== primary.id)
    || null;

  return {
    primary: trimSignal(primary),
    secondary: secondary ? trimSignal(secondary) : null,
    all: scored.slice(0, 4).map(trimSignal)
  };
}

function trimSignal(item) {
  return {
    id: item.id,
    label: item.label,
    type: item.type,
    score: item.score,
    diagnosis: item.diagnosis,
    oneNextMove: item.oneNextMove,
    guardrail: item.guardrail
  };
}

function buildPrompt({ transcript, context, matrixSignals }) {
  const secondaryBlock = matrixSignals.secondary ? `\nSecondary Matrix signal:\n${matrixSignals.secondary.label}\nSecondary diagnosis:\n${matrixSignals.secondary.diagnosis}\nSecondary one-next-move:\n${matrixSignals.secondary.oneNextMove}\nSecondary guardrail:\n${matrixSignals.secondary.guardrail}` : "\nSecondary Matrix signal: None confidently detected.";

  return `You are the Barista Doma Premium Advisor inside The Home Barista Occasion Simulator.

Your job is NOT to give a generic coffee answer. Your job is to synthesize structured context into refined, occasion-aware guidance for an artisan epicurean at home.

Core doctrine:
- The Recovery Matrix knows what can go wrong.
- The Premium Advisor helps the home barista recover the cup and preserve the occasion.
- You synthesize from structured context: Doma Profile, machine, grinder, house formula, occasion, live artisan comment, matrix signals, and eventually prior Doma Reports.
- Give one next move, not a long troubleshooting lecture.
- Respect the machine, the cup, the room, the guest, and the desired delight.
- Sound warm, calm, composed, premium, practical, and advisory.
- Do not sound like a help desk, chatbot, espresso forum, or machine manual.
- Do not overpromise. If uncertain, say "likely" and guide one safe next move.

Strict technical guardrails:
- If the primary signal is fast shot / low resistance, the main move is grind one step finer while keeping dose steady. Do not recommend coarser grind for a fast shot.
- If the primary signal is choked or stalled shot / high resistance, the main move is grind one step coarser while keeping dose steady.
- If a guest/time-pressure signal is present, do not recommend a full reset. Preserve the occasion through one stabilizing adjustment.
- The One Next Move section must contain one main action only. You may add one brief contingency, but do not list a menu of changes.

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

Primary Recovery Matrix signal:
${matrixSignals.primary.label}
Primary diagnosis:
${matrixSignals.primary.diagnosis}
Primary one-next-move:
${matrixSignals.primary.oneNextMove}
Primary guardrail:
${matrixSignals.primary.guardrail}
${secondaryBlock}

Write the Advisor response in this exact structure:

I heard:
[One sentence that reflects the artisan's actual situation and mentions specific context where available.]

Likely matrix match:
[Name Primary and Secondary if present. Explain them briefly in plain language.]

Advisor interpretation:
[Explain what this means in this occasion, connecting machine/cup/context/pressure.]

One next move:
[Give one clear main action. Include machine/dose/yield where useful.]

Occasion guidance:
[One or two sentences about preserving the moment, hospitality, rhythm, confidence, and/or delight.]

Advisor close:
[A short premium closing line.]

Keep the complete answer under 240 words.`;
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
    const matrixSignals = selectMatrixSignals(combinedText);
    const prompt = buildPrompt({ transcript, context, matrixSignals });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.32,
        max_output_tokens: 800
      })
    });

    const raw = await response.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = { raw }; }

    if (!response.ok) {
      return json({
        error: `OpenAI Advisor response failed with HTTP ${response.status}.`,
        detail: parsed?.error?.message || parsed?.raw || raw || "No response body returned.",
        matrixSignals,
        matrixMatch: matrixSignals.primary
      }, 500);
    }

    const advisorText = extractText(parsed);
    if (!advisorText) {
      return json({ error: "The Advisor response came back empty.", matrixSignals, matrixMatch: matrixSignals.primary, raw: parsed }, 500);
    }

    const matrixMatch = {
      ...matrixSignals.primary,
      label: matrixSignals.secondary ? `Primary: ${matrixSignals.primary.label} | Secondary: ${matrixSignals.secondary.label}` : matrixSignals.primary.label
    };

    return json({ advisorText, matrixSignals, matrixMatch });
  } catch (error) {
    return json({
      error: "The Premium Advisor response route crashed.",
      detail: error?.message || String(error)
    }, 500);
  }
}
