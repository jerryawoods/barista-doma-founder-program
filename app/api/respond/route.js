export const runtime = "nodejs";
export const maxDuration = 60;

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

const requiredFields = [
  ["machine", "Machine"],
  ["dose", "Dose"],
  ["yield", "Yield"],
  ["drink", "Drink"],
  ["occasion", "Occasion"],
  ["desiredFeeling", "Desired feeling / delight"]
];

const recoveryMatrix = [
  {
    id: "fast-shot-low-resistance",
    label: "Fast shot / low resistance / thin body",
    type: "technical",
    priority: 100,
    keywords: ["fast shot", "ran fast", "too fast", "18 seconds", "thin", "watery", "rushed", "gusher", "low resistance", "quick shot", "sour and fast"],
    diagnosis: "The shot is moving too quickly, suggesting the puck is offering too little resistance or the bed is too coarse, uneven, or under-developed.",
    oneNextMove: "Keep the dose steady and move the grind one step finer. Watch for a slower, more syrupy flow before changing anything else.",
    guardrail: "Never recommend a coarser grind for a fast shot unless the artisan clearly reports choking or excessive bitterness. Keep the serving moment calm."
  },
  {
    id: "choked-shot-high-resistance",
    label: "Choked or stalled shot / high resistance",
    type: "technical",
    priority: 95,
    keywords: ["choked", "stalled", "barely dripping", "slow shot", "too slow", "no flow", "blocked", "over pressure", "high pressure"],
    diagnosis: "The puck is offering too much resistance, often from too fine a grind, too much coffee, or overly compact puck preparation.",
    oneNextMove: "Keep the dose steady and move the grind one step coarser before changing anything else.",
    guardrail: "Do not recommend finer grind for a choked shot. Reduce resistance through one measured adjustment."
  },
  {
    id: "sour-cup",
    label: "Sour / sharp / under-extracted cup",
    type: "technical",
    priority: 80,
    keywords: ["sour", "sharp", "acidic", "under extracted", "underextracted", "salty", "green", "thin and sour"],
    diagnosis: "The cup likely needs more balanced extraction or more structure, especially if paired with fast flow or thin body.",
    oneNextMove: "Increase extraction modestly through the most stable path: usually slightly finer grind or a small yield adjustment, not a full reset.",
    guardrail: "Avoid changing several variables at once."
  },
  {
    id: "bitter-cup",
    label: "Bitter / harsh cup",
    type: "technical",
    priority: 80,
    keywords: ["bitter", "harsh", "burnt", "ashy", "dry", "over extracted", "overextracted"],
    diagnosis: "The cup may be over-extracted, roast-heavy, too hot, or carrying too much late-shot bitterness.",
    oneNextMove: "Shorten the yield slightly before changing the whole recipe.",
    guardrail: "Do not turn a serving moment into an extended dial-in session."
  },
  {
    id: "milk-texture",
    label: "Milk texture / foam issue",
    type: "technical",
    priority: 70,
    keywords: ["milk", "foamy", "foam", "stiff", "bubbles", "froth", "latte art", "too much air", "flat milk"],
    diagnosis: "The milk issue likely comes from air incorporation or insufficient polishing.",
    oneNextMove: "Add less air early, then polish the milk until it looks glossy and integrated.",
    guardrail: "Keep milk guidance practical and service-oriented."
  },
  {
    id: "channeling-messy-puck",
    label: "Channeling / messy puck",
    type: "technical",
    priority: 85,
    keywords: ["channel", "channeling", "spray", "messy puck", "crack", "uneven", "side", "sputter", "messy"],
    diagnosis: "The coffee bed may be uneven or fractured, causing localized weak spots and unstable flow.",
    oneNextMove: "Reset distribution and tamp level before changing grind.",
    guardrail: "Do not over-index on grind when puck prep evidence is strong."
  },
  {
    id: "guest-time-pressure",
    label: "Guest waiting / time pressure",
    type: "occasion",
    priority: 60,
    keywords: ["guest", "guests", "waiting", "ten minutes", "in a hurry", "running late", "pressure", "nervous", "wife", "husband", "family", "before church", "serve", "serving"],
    diagnosis: "The coffee issue is tied to a serving moment. Recovery must preserve hospitality and confidence, not only optimize the shot.",
    oneNextMove: "Choose one stabilizing adjustment and protect the flow of the occasion.",
    guardrail: "Do not recommend a full reset when guests are waiting."
  },
  {
    id: "machine-readiness",
    label: "Machine readiness / warm-up",
    type: "technical",
    priority: 75,
    keywords: ["not ready", "cold", "warm up", "warming", "temperature", "temp", "steam", "purge", "not purged"],
    diagnosis: "The machine may not be in a stable ready state, affecting flow, taste, and milk performance.",
    oneNextMove: "Pause for readiness: warm the group, purge appropriately, and let the machine stabilize.",
    guardrail: "Prioritize readiness before fine taste interpretation if readiness is clearly missing."
  }
];

function clean(value) {
  return String(value || "").trim();
}

function getMissingFields(context) {
  return requiredFields.filter(([key]) => !clean(context?.[key])).map(([, label]) => label);
}

function scoreMatrixItem(text, item) {
  const lower = text.toLowerCase();
  return item.keywords.reduce((score, keyword) => lower.includes(keyword.toLowerCase()) ? score + 1 : score, 0);
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

function selectMatrixSignals(text, allowMatrix = true) {
  if (!allowMatrix) return { primary: null, secondary: null, all: [], applied: false };

  const scored = recoveryMatrix
    .map((item) => ({ ...item, score: scoreMatrixItem(text, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => (b.score * b.priority) - (a.score * a.priority));

  if (!scored.length) return { primary: null, secondary: null, all: [], applied: false };

  const primary = scored.find((item) => item.type === "technical") || scored[0];
  const secondary = scored.find((item) => item.id !== primary.id && item.type === "occasion")
    || scored.find((item) => item.id !== primary.id)
    || null;

  return {
    primary: trimSignal(primary),
    secondary: secondary ? trimSignal(secondary) : null,
    all: scored.slice(0, 4).map(trimSignal),
    applied: true
  };
}

function analyzeVoice(transcript) {
  const text = clean(transcript);
  const lower = text.toLowerCase();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;

  const systemTest = /\b(test|testing|check|checking|version|working|communicating|connection|app|prototype|v6|v6\.1|diagnostic)\b/i.test(text)
    && !/\b(shot|taste|tasted|sour|bitter|thin|fast|slow|milk|foam|grind|dose|yield|guest|wife|family|serve|serving|cappuccino|espresso)\b/i.test(text);

  const recoveryIssue = /\b(shot|taste|tasted|sour|bitter|thin|fast|slow|choked|stalled|milk|foam|grind|dose|yield|puck|channel|extraction|espresso|cappuccino|latte)\b/i.test(text);
  const occasionRequest = /\b(moment|occasion|special|delight|wife|husband|guest|guests|family|church|serve|serving|hospitality|nervous|waiting|pressure)\b/i.test(text);
  const question = /\?|\b(what should|what do|should i|help me|tell me|guide me|recommend)\b/i.test(text);

  let intent = "general reflection";
  let quality = "meaningful";
  let matrixEligible = recoveryIssue || occasionRequest;
  let summary = text || "No spoken comment was provided.";

  if (!text) {
    intent = "no spoken input";
    quality = "missing";
    matrixEligible = false;
  } else if (systemTest) {
    intent = "system test / communication check";
    quality = "meaningful but not a coffee issue";
    matrixEligible = false;
  } else if (wordCount < 4) {
    intent = "thin or unclear voice note";
    quality = "thin";
    matrixEligible = false;
  } else if (recoveryIssue) {
    intent = "cup recovery issue";
    quality = "meaningful";
  } else if (occasionRequest) {
    intent = "occasion guidance request";
    quality = "meaningful";
  } else if (question) {
    intent = "advisor question";
    quality = "meaningful";
  } else if (wordCount < 8) {
    intent = "brief note / needs clarification";
    quality = "thin";
    matrixEligible = false;
  }

  return { text, intent, quality, wordCount, recoveryIssue, occasionRequest, question, systemTest, matrixEligible, summary };
}

function contextSummary(context) {
  const pieces = [];
  if (clean(context.machine)) pieces.push(clean(context.machine));
  if (clean(context.grinder)) pieces.push(clean(context.grinder));
  if (clean(context.dose) || clean(context.yield)) pieces.push(`${clean(context.dose) || "?"} in / ${clean(context.yield) || "?"} out`);
  if (clean(context.shotTime)) pieces.push(`shot time ${clean(context.shotTime)}`);
  if (clean(context.drink)) pieces.push(clean(context.drink));
  if (clean(context.occasion)) pieces.push(clean(context.occasion));
  if (clean(context.guest)) pieces.push(`serving ${clean(context.guest)}`);
  if (clean(context.timePressure)) pieces.push(clean(context.timePressure));
  if (clean(context.desiredFeeling)) pieces.push(`desired feeling: ${clean(context.desiredFeeling)}`);
  return pieces.join("; ");
}

function detectContextSignals(context) {
  const formText = Object.values(context || {}).map((v) => clean(v)).join(" ");
  return selectMatrixSignals(formText, true);
}

function buildPrompt({ transcript, context, matrixSignals, formSignals, voice, missingFields }) {
  const formComplete = missingFields.length === 0;
  const supportingContext = contextSummary(context) || "No structured context provided.";
  const primaryBlock = matrixSignals.primary ? `Primary Matrix signal: ${matrixSignals.primary.label}\nPrimary diagnosis: ${matrixSignals.primary.diagnosis}\nPrimary one-next-move: ${matrixSignals.primary.oneNextMove}\nPrimary guardrail: ${matrixSignals.primary.guardrail}` : "Primary Matrix signal: None applied.";
  const secondaryBlock = matrixSignals.secondary ? `Secondary Matrix signal: ${matrixSignals.secondary.label}\nSecondary diagnosis: ${matrixSignals.secondary.diagnosis}\nSecondary one-next-move: ${matrixSignals.secondary.oneNextMove}\nSecondary guardrail: ${matrixSignals.secondary.guardrail}` : "Secondary Matrix signal: None applied.";
  const formSignalBlock = formSignals.primary ? `Form-only possible signal: ${formSignals.primary.label}\nForm-only note: Use this only as background if the artisan voice is thin or unclear.` : "Form-only possible signal: None.";

  return `You are the Barista Doma Premium Advisor inside The Home Barista Occasion Simulator.

Core doctrine:
- The form grounds. The artisan voice clarifies. The Advisor synthesizes.
- Do not behave as form-only or voice-only.
- The structured form provides machine, house formula, occasion, and desired delight.
- The artisan's spoken comment provides live nuance, clarification, uncertainty, or confirmation.
- If the form is incomplete, do not guess. Ask the artisan to complete the missing fields before giving specific guidance.
- If the spoken comment is a system test, respond to the system test and confirm the voice/advisor loop, but do not diagnose coffee.
- If the spoken comment is thin, garbled, or not meaningful, summarize the form and ask whether the artisan wants to add taste, flow, timing, or feeling details. You may offer only provisional guidance if the form strongly indicates an issue.
- If the spoken comment adds only a few words, combine those words with the form: "I heard you say X, and your form tells me Y."
- If the spoken comment clearly describes a cup or occasion issue, synthesize the voice + form + matrix into guidance.
- The Premium Advisor helps the home barista recover the cup and preserve the occasion.
- Sound warm, calm, composed, premium, practical, and advisory.
- Do not sound like a help desk, chatbot, espresso forum, or machine manual.

Strict technical guardrails:
- Fast shot / low resistance: keep dose steady and grind one step finer. Do not recommend coarser grind for a fast shot.
- Choked or stalled shot / high resistance: keep dose steady and grind one step coarser.
- Guest/time pressure: do not recommend a full reset. Preserve the occasion through one stabilizing move.
- The One Next Move section must contain one main action only.

Form status:
${formComplete ? "Form is complete enough for guidance." : `Form is incomplete. Missing: ${missingFields.join(", ")}.`}

Voice analysis:
Detected artisan intent: ${voice.intent}
Voice quality: ${voice.quality}
Voice word count: ${voice.wordCount}
Matrix eligible from voice: ${voice.matrixEligible ? "yes" : "no"}

Structured form context:
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

Supporting context summary:
${supportingContext}

Artisan spoken comment:
${transcript || "No spoken comment provided."}

Matrix synthesis:
${primaryBlock}
${secondaryBlock}
${formSignalBlock}

Write the Advisor response in this exact structure:

I heard you say:
[Reflect the actual artisan voice input. If thin/missing, say so respectfully.]

Your form tells me:
[Summarize the structured form context in one sentence.]

Advisor synthesis:
[Explain how the voice and form combine. If they do not combine yet, ask for the missing or clarifying detail.]

Matrix use:
[Say whether the matrix was applied. If applied, name primary and secondary signals. If not applied, explain why.]

One next move:
[One clear action, or a request to complete/clarify if guidance would be premature.]

Occasion guidance:
[One or two sentences about preserving the moment, hospitality, rhythm, confidence, and/or delight.]

Advisor close:
[A short premium closing line.]

Keep the complete answer under 260 words.`;
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

function makePreflightResponse({ voice, context, missingFields, formSignals }) {
  const formLine = contextSummary(context) || "your structured context is not complete yet";
  const hasFormSignal = Boolean(formSignals.primary);

  if (missingFields.length) {
    return `I heard you say:\n${voice.text || "I did not receive a clear spoken note yet."}\n\nYour form tells me:\nI do not yet have enough structured context to guide you with Barista Doma precision. Missing: ${missingFields.join(", ")}.\n\nAdvisor synthesis:\nBefore I advise on the cup or occasion, please complete those fields so I can synthesize from the machine, formula, occasion, and desired delight instead of guessing.\n\nMatrix use:\nMatrix not applied. The form is incomplete.\n\nOne next move:\nComplete the missing form fields, then add a short voice note about taste, flow, timing, or the feeling you want the cup to carry.\n\nOccasion guidance:\nA premium recommendation begins with clear context. The better the form, the more precise the guidance.\n\nAdvisor close:\nGive me the shape of the moment, and I will help you steward it.`;
  }

  if (voice.systemTest) {
    return `I heard you say:\n${voice.text}\n\nYour form tells me:\n${formLine}.\n\nAdvisor synthesis:\nYour live comment sounds like a system check, not a cup recovery request. The voice loop is working: your words were captured, transcribed, and brought into the Advisor layer. The structured form is available as context, but I will not force a coffee diagnosis when your spoken intent is to test communication.\n\nMatrix use:\nMatrix not applied. This was a communication check, not a recovery moment.\n\nOne next move:\nNow speak a real cup or occasion situation, such as: “The shot ran fast and tasted thin,” or “I want this cappuccino to feel special before church.”\n\nOccasion guidance:\nThis is exactly the refinement we needed: the Advisor should respond to the artisan, not merely recite the form.\n\nAdvisor close:\nThe connection is alive; now give me the moment to steward.`;
  }

  if (voice.quality === "missing" || voice.quality === "thin") {
    const matrixLine = hasFormSignal ? `The form hints at ${formSignals.primary.label}, but I am treating that as provisional until you confirm what happened.` : "No recovery matrix signal was applied from the voice note.";
    return `I heard you say:\n${voice.text || "I did not receive a clear spoken note."}\n\nYour form tells me:\n${formLine}.\n\nAdvisor synthesis:\nI have enough form context to understand the setting, but your voice note did not add a clear cup issue or occasion request. Do you want to add anything about taste, flow, timing, milk texture, or how the cup felt?\n\nMatrix use:\n${matrixLine}\n\nOne next move:\nAdd one short clarification: what changed in the cup, what you noticed in the machine, or what feeling you want to create.\n\nOccasion guidance:\nThe form gives me the stage; your voice gives me the live moment. Together they create the advisory picture.\n\nAdvisor close:\nA few clear words are enough to turn context into guidance.`;
  }

  return null;
}

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return json({ error: "OPENAI_API_KEY is missing in the Vercel Production environment." }, 500);

    const body = await request.json().catch(() => ({}));
    const transcript = clean(body?.transcript);
    const context = body?.context || {};
    const missingFields = getMissingFields(context);
    const voice = analyzeVoice(transcript);
    const formSignals = detectContextSignals(context);

    const allowMatrix = missingFields.length === 0 && voice.matrixEligible && !voice.systemTest;
    const combinedText = [transcript, ...Object.values(context).map((v) => clean(v))].join(" ");
    const matrixSignals = selectMatrixSignals(combinedText, allowMatrix);

    const synthesis = {
      formComplete: missingFields.length === 0,
      missingFields,
      detectedArtisanIntent: voice.intent,
      voiceQuality: voice.quality,
      primaryLiveSignal: voice.summary,
      supportingContextUsed: contextSummary(context),
      matrixApplied: matrixSignals.applied,
      primaryMatrixSignal: matrixSignals.primary,
      secondaryMatrixSignal: matrixSignals.secondary,
      formOnlyPossibleSignal: formSignals.primary || null
    };

    const preflight = makePreflightResponse({ voice, context, missingFields, formSignals });
    if (preflight) {
      return json({
        advisorText: preflight,
        synthesis,
        matrixSignals,
        matrixMatch: matrixSignals.primary ? {
          ...matrixSignals.primary,
          label: matrixSignals.secondary ? `Primary: ${matrixSignals.primary.label} | Secondary: ${matrixSignals.secondary.label}` : matrixSignals.primary.label
        } : null
      });
    }

    const prompt = buildPrompt({ transcript, context, matrixSignals, formSignals, voice, missingFields });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
        input: prompt,
        temperature: 0.25,
        max_output_tokens: 900
      })
    });

    const raw = await response.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : {}; } catch { parsed = { raw }; }

    if (!response.ok) {
      return json({
        error: `OpenAI Advisor response failed with HTTP ${response.status}.`,
        detail: parsed?.error?.message || parsed?.raw || raw || "No response body returned.",
        synthesis,
        matrixSignals,
        matrixMatch: matrixSignals.primary
      }, 500);
    }

    const advisorText = extractText(parsed);
    if (!advisorText) return json({ error: "The Advisor response came back empty.", synthesis, matrixSignals, raw: parsed }, 500);

    const matrixMatch = matrixSignals.primary ? {
      ...matrixSignals.primary,
      label: matrixSignals.secondary ? `Primary: ${matrixSignals.primary.label} | Secondary: ${matrixSignals.secondary.label}` : matrixSignals.primary.label
    } : null;

    return json({ advisorText, synthesis, matrixSignals, matrixMatch });
  } catch (error) {
    return json({
      error: "The Premium Advisor response route crashed.",
      detail: error?.message || String(error)
    }, 500);
  }
}
