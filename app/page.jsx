"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const defaultProfile = {
  founderName: "Jerry",
  roleIdentity: "Home barista in training",
  machineType: "Espresso machine with built-in grinder",
  machine: "Breville Barista Express",
  espressoMachine: "Breville Barista Express",
  allInOneMachine: "",
  grinder: "Built-in grinder",
  grinderModel: "Built-in grinder",
  beans: "House espresso beans",
  roastLevel: "Medium",
  experienceLevel: "Developing confidence",
  advisorGuidanceLevel: "Building Consistency",
  advisorGuidanceNotes: "Help me improve consistency and recover faster.",
  preferredDrinks: "Cappuccino, espresso, milk drinks",
  houseDose: "18g",
  houseYield: "36g",
  houseShotTime: "About 25-30 seconds when dialed in",
  targetRatio: "1:2 espresso ratio",
  grinderSetting: "Current house setting",
  basketSize: "18g basket",
  portafilterSize: "54mm",
  waterSource: "Filtered water",
  warmupRoutine: "Warm machine and portafilter before the Occasion",
  tamper: "Spring-loaded tamper",
  tamperSize: "54mm",
  distributionTool: "WDT tool",
  wdtTool: "0.35mm needle WDT",
  puckScreen: "No puck screen",
  dosingFunnel: "Yes",
  puckPrepWorkflow: "Dose, WDT evenly, level bed, tamp level, wipe rim.",
  milkStyle: "Creamy microfoam for warmth and comfort",
  confirmedRecipe: "Not yet confirmed",
  lastDialInResult: "Working toward house formula",
  dialInAttemptDose: "18g",
  dialInAttemptYield: "36g",
  dialInAttemptTime: "20 sec",
  dialInAttemptGrind: "Current setting",
  dialInAttemptTaste: "Thin / needs more body",
  dialInAttemptFlow: "Runs fast",
  dialInAttemptPuckPrep: "WDT + level tamp",
  dialInAttemptAdvisorNote: "Keep dose and yield steady; adjust grind one step finer if fast.",
  quickShotVoiceNote: "",
  quickShotDose: "18g",
  quickShotYield: "36g",
  quickShotTime: "",
  quickShotGrind: "",
  quickShotLiked: "",
  quickShotLikedNotes: "",
  quickShotChange: "",
  quickShotServeAgain: "",
  quickShotFlavorNotes: "",
  dialInAttempts: [],
  dialInNotes: "Keep dose and yield steady before changing grind."
};

const machineTypeOptions = ["Espresso machine", "Espresso machine with built-in grinder", "All-in-one / automatic", "Superautomatic", "Filter / brewer", "Other"];
const espressoMachineOptions = ["Breville Barista Express", "Breville Barista Pro", "Breville Dual Boiler", "Meraki Gen 2", "Gaggia Classic Pro", "Rancilio Silvia", "Lelit Bianca", "Profitec Pro", "ECM", "Rocket", "La Marzocco Linea Mini", "Decent DE1", "Ascaso Steel", "Other espresso machine"];
const grinderOptions = ["Built-in grinder", "Baratza", "DF64 / DF83", "Niche Zero / Duo", "Eureka Mignon", "Fellow Opus / Ode", "Timemore", "Mazzer", "Weber", "Mahlkönig", "Other grinder"];
const allInOneOptions = ["Ninja Luxe Café / Ninja espresso system", "Jura", "DeLonghi", "Philips / Saeco", "Terra Kaffe", "Breville Oracle", "Breville Barista Touch", "Meraki all-in-one", "xBloom", "Other all-in-one"];
const roastLevelOptions = ["Light", "Medium-light", "Medium", "Medium-dark", "Dark", "Decaf", "Unknown"];
const experienceOptions = ["First-time / learning", "Developing confidence", "Comfortable but inconsistent", "Serious home barista", "Advanced enthusiast"];
const guidanceLevelOptions = ["New to the Machine", "Building Consistency", "Confident Home Barista", "Data-Minded Artisan"];
const guidanceLevelProfiles = {
  "New to the Machine": {
    promise: "Barista Doma will walk you through the machine in plain language, explain terms, protect setup readiness, and keep guidance calm and step-by-step.",
    expectedFluency: "You may need frequent Advisor support while learning dose, yield, timing, puck prep, and recovery basics.",
    nextLevel: "Building Consistency"
  },
  "Building Consistency": {
    promise: "Barista Doma will focus on repeatability: setup, house formula, puck prep, one-variable adjustments, and faster recovery.",
    expectedFluency: "You should complete the Occasion with some guidance, but fewer repeated corrections and a clearer dial-in record.",
    nextLevel: "Confident Home Barista"
  },
  "Confident Home Barista": {
    promise: "Barista Doma will give sharper diagnosis, less handholding, stronger fluency feedback, and more refined Occasion coaching.",
    expectedFluency: "You should complete most steps cleanly, ask for limited help, and recover with one calm adjustment.",
    nextLevel: "Data-Minded Artisan"
  },
  "Data-Minded Artisan": {
    promise: "Barista Doma will emphasize variables, charts, trends, exports, repeatability, and deeper performance evidence.",
    expectedFluency: "You should maintain complete records, use Advisor support selectively, and value detailed Doma Report analysis.",
    nextLevel: "Founder Benchmarks"
  }
};
const confirmedRecipeOptions = ["Confirmed house formula", "Close but still tuning", "Not yet confirmed", "Need Advisor help dialing in"];
const guestResonanceStatusOptions = ["Green — landed well", "Yellow — partially landed", "Red — missed the moment", "Blah", "Curious", "Warm", "Delighted", "Bodacious"];
const guidanceLevelTargets = {
  "New to the Machine": { supportMax: 6, recoveryMax: 4, correctionMax: 3, minimumStepCompletion: 0.6 },
  "Building Consistency": { supportMax: 4, recoveryMax: 2, correctionMax: 2, minimumStepCompletion: 0.75 },
  "Confident Home Barista": { supportMax: 2, recoveryMax: 1, correctionMax: 1, minimumStepCompletion: 0.9 },
  "Data-Minded Artisan": { supportMax: 1, recoveryMax: 1, correctionMax: 1, minimumStepCompletion: 0.95 }
};

const experienceToGuidanceLevel = {
  "First-time / learning": "New to the Machine",
  "Developing confidence": "Building Consistency",
  "Comfortable but inconsistent": "Building Consistency",
  "Serious home barista": "Confident Home Barista",
  "Advanced enthusiast": "Data-Minded Artisan"
};

const defaultOccasion = {
  occasionName: "Before-church coffee at home",
  drink: "Cappuccino",
  guest: "My wife / family",
  timePressure: "Guests or family waiting in about ten minutes",
  desiredFeeling: "Steady, hospitable, warm, confident, and delightful",
  recurrence: "Second fast shot today",
  currentShotTime: "About 18 seconds",
  momentIntent: "Serve a steady cup that preserves the morning and creates delight",
  suggestedTempo: "8–11 minutes"
};

const setupRequiredFields = [
  ["profile.machine", "Machine Passport: machine"],
  ["profile.grinder", "Machine Passport: grinder"],
  ["profile.houseDose", "House Formula: dose"],
  ["profile.houseYield", "House Formula: yield"],
  ["profile.houseShotTime", "House Formula: shot time"],
  ["occasion.occasionName", "Occasion setup: occasion name"],
  ["occasion.drink", "Occasion setup: drink or drink set"],
  ["occasion.guest", "Occasion setup: guest / who is served"],
  ["occasion.desiredFeeling", "Occasion setup: desired feeling / delight"],
  ["occasion.momentIntent", "Occasion setup: moment intent"]
];

function getByPath(root, path) {
  return path.split(".").reduce((obj, key) => obj?.[key], root);
}

function getSetupMissing(profile, occasion) {
  const root = { profile, occasion };
  return setupRequiredFields.filter(([path]) => !String(getByPath(root, path) || "").trim()).map(([, label]) => label);
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function reportTrendSummary(previous, currentScores, guestResonance) {
  if (!previous) return "First saved report in this browser. Future reports will show trend and confidence movement.";
  const prior = previous.sensoryScores || {};
  const keys = ["machineConfidence", "tasteClarity", "stagecraft", "recoveryConfidence"];
  const deltas = keys.map((k) => `${labelize(k)} ${Number(currentScores?.[k] || 0) - Number(prior?.[k] || 0) >= 0 ? "+" : ""}${Number(currentScores?.[k] || 0) - Number(prior?.[k] || 0)}`).join(" · ");
  return `Compared with prior local report: ${deltas}. Guest Resonance now ${guestResonance?.score || "not captured"}/5.`;
}


const founderOccasions = [
  {
    "id": "first-cup-diagnostic",
    "name": "The First Cup Diagnostic",
    "family": "Core Occasions",
    "tag": "Orientation",
    "purpose": "Establish the machine, grinder, dose, yield, taste, and confidence baseline before performing for others.",
    "drink": "Espresso baseline",
    "drinkChoices": "Espresso; Americano if tasting dilution is needed; small cappuccino if milk performance is being tested",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec target",
    "ratioGuidance": "Espresso baseline is roughly 1:2 dose-to-yield. Keep dose and yield stable so one variable can be read at a time.",
    "grindVessel": "Medium-fine espresso grind \u00b7 demitasse or clear shot glass",
    "suggestedTempo": "7\u201310 minutes",
    "desiredFeeling": "clear, calm, observant, confident",
    "artisanOpening": "This first cup is not about perfection. I am learning how this machine speaks today, and I am going to listen carefully.",
    "firstSipDirection": "Sip once while warm and name the first impression before adding milk or sugar.",
    "guestResonancePrompt": "What did the machine reveal first: flow, taste, aroma, texture, or confidence?",
    "advisorDirection": "Advisor should act like a diagnostic coach: slow the artisan down, protect one-variable discipline, and translate observations into one next move.",
    "recoveryWatchouts": "fast shot, choking/no-flow, sour, bitter, thin body, channeling, messy puck",
    "reportPrompt": "What did the first cup reveal about flow, taste, rhythm, and confidence?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: espresso beans, filtered water, optional milk only if testing milk performance",
        "Tools: scale, timer, tamper, towel, distribution tool, knock box",
        "Cup/glass/vessel: demitasse or clear shot glass",
        "Garnish or sensory accent: none; keep the diagnostic clean",
        "Machine readiness: fully warm machine, purge group, dry basket, confirmed grinder setting",
        "Counter/staging area: empty counter with only diagnostic tools",
        "Serving path: cup placed where flow can be watched",
        "Script readiness: say the diagnostic intention before pulling"
      ],
      "machineReadiness": [
        "fully warm machine, purge group, dry basket, confirmed grinder setting",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "espresso beans, filtered water, optional milk only if testing milk performance",
        "scale, timer, tamper, towel, distribution tool, knock box",
        "demitasse or clear shot glass",
        "none; keep the diagnostic clean"
      ],
      "serviceReadiness": [
        "empty counter with only diagnostic tools",
        "cup placed where flow can be watched",
        "say the diagnostic intention before pulling"
      ]
    },
    "steps": [
      {
        "title": "Set the diagnostic intention",
        "suggestedTempo": "30 sec",
        "action": "Say aloud that this is a baseline cup. Do not evaluate yourself; evaluate the machine/cup relationship.",
        "why": "It lowers pressure and prevents random changes.",
        "watch": "Avoid changing grind, dose, and yield all at once.",
        "advisor": "Start from the house formula and read what the machine gives you today.",
        "script": "I am starting with a clear baseline so I can understand the machine before I try to impress it."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage beans, water, scale, towel, tamper, cup, and knock box within reach. Remove anything not needed.",
        "why": "A clean station lets the artisan see the cup, not the clutter.",
        "watch": "Missing scale/towel causes rushed movement mid-shot.",
        "advisor": "Preparation begins with Mise en Place; the diagnostic starts before grinding.",
        "script": "The counter is set. I am giving the cup a clean place to begin."
      },
      {
        "title": "Confirm Machine Passport context",
        "suggestedTempo": "60 sec",
        "action": "Check machine, grinder, basket, dose, yield, and shot time target in the form.",
        "why": "The Advisor needs these fields to avoid generic advice.",
        "watch": "Do not start if machine or dose/yield are blank.",
        "advisor": "If the form is incomplete, complete it before asking for guidance.",
        "script": "I am giving the Advisor the machine context before I ask it to interpret the cup."
      },
      {
        "title": "Dose and prepare puck",
        "suggestedTempo": "90 sec",
        "action": "Weigh the dose, distribute evenly, tamp level, wipe rim, and lock in.",
        "why": "Puck prep is the first physical performance of the cup.",
        "watch": "Uneven distribution can mimic grind problems.",
        "advisor": "Keep dose steady so the next recommendation is trustworthy.",
        "script": "I am keeping the dose steady so I can learn from one variable at a time."
      },
      {
        "title": "Pull and observe flow",
        "suggestedTempo": "45 sec",
        "action": "Start the shot, watch first drops, flow speed, color, body, and total time.",
        "why": "Flow is the machine speaking before the taste confirms it.",
        "watch": "Few drops means choking; gushing means low resistance.",
        "advisor": "Observe before diagnosing. Use actual words: few drops, fast, spraying, blonding.",
        "script": "I am watching the flow and letting the machine show me where we are."
      },
      {
        "title": "Taste for direction",
        "suggestedTempo": "60 sec",
        "action": "Taste and choose first impression: sour, bitter, thin, balanced, harsh, sweet, flat.",
        "why": "Taste tells the Advisor whether the number problem matters in the cup.",
        "watch": "Do not invent flavor notes; name what is obvious.",
        "advisor": "One honest sensory word is more useful than a long guess.",
        "script": "This taste is information. I am not failing; I am learning the path."
      },
      {
        "title": "Use Recovery Matrix if needed",
        "suggestedTempo": "60 sec",
        "action": "If the cup chokes, runs fast, tastes sour, or feels thin, type the issue in natural language or select a Matrix issue.",
        "why": "The Matrix grounds the Advisor in known recovery paths.",
        "watch": "Do not accept opposite guidance; correct the Advisor if needed.",
        "advisor": "Few drops/no flow = reduce resistance; fast/gushing = increase resistance.",
        "script": "If something goes wrong, I will recover with one clear move rather than panic."
      },
      {
        "title": "Capture diagnostic Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Save machine, grinder, beans, dose, yield, time, taste, confidence, and one next move.",
        "why": "This becomes the first entry in the second coffee brain.",
        "watch": "Do not skip the report; the next cup needs memory.",
        "advisor": "Reports turn practice into progress.",
        "script": "I am saving what this cup taught me so the next cup can become more confident."
      }
    ]
  },
  {
    "id": "quiet-table",
    "name": "The Quiet Table",
    "family": "Core Occasions",
    "tag": "Soft connection",
    "purpose": "Serve a calm low-noise coffee moment for someone who needs presence more than performance.",
    "drink": "Cappuccino or cortado",
    "drinkChoices": "Cappuccino; cortado; brewed coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Cappuccino can be explained as roughly 1:1:1 espresso, steamed milk, and foam; cortado is closer to equal espresso and warm milk.",
    "grindVessel": "warm ceramic cup",
    "suggestedTempo": "8\u201311 minutes",
    "desiredFeeling": "soft, steady, gentle, cared for",
    "artisanOpening": "I made this one quietly, just to create a little room for you to settle.",
    "firstSipDirection": "Ask the guest to notice warmth and texture before analyzing flavor.",
    "guestResonancePrompt": "Did the guest feel comforted, settled, or less rushed?",
    "advisorDirection": "Advisor should protect quietness: fewer words, softer recovery, no technical lecture unless asked.",
    "recoveryWatchouts": "milk too foamy, rushed tempo, bitter cup, guest overwhelmed",
    "reportPrompt": "Did the cup lower the room noise and create a softer moment?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: espresso beans, milk or alt milk, filtered water",
        "Tools: scale, timer, tamper, milk pitcher, towel",
        "Cup/glass/vessel: warm ceramic cappuccino/cortado cup",
        "Garnish or sensory accent: optional cocoa dusting only if familiar",
        "Machine readiness: warm group, purge steam wand, pitcher ready",
        "Counter/staging area: quiet counter, no unnecessary clatter",
        "Serving path: serve at table or counter without forcing conversation",
        "Script readiness: short calm script ready"
      ],
      "machineReadiness": [
        "warm group, purge steam wand, pitcher ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "espresso beans, milk or alt milk, filtered water",
        "scale, timer, tamper, milk pitcher, towel",
        "warm ceramic cappuccino/cortado cup",
        "optional cocoa dusting only if familiar"
      ],
      "serviceReadiness": [
        "quiet counter, no unnecessary clatter",
        "serve at table or counter without forcing conversation",
        "short calm script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Quiet Table out loud and choose the desired feeling: soft, steady, gentle, cared for.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as soft connection and protect the human purpose before technique.",
        "script": "I made this one quietly, just to create a little room for you to settle."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Cappuccino; cortado; brewed coffee. Confirm dose/yield/time and ratio guidance: Cappuccino can be explained as roughly 1:1:1 espresso, steamed milk, and foam; cortado is closer to equal espresso and warm milk.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Cappuccino or cortado because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set warm ceramic cup.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Serve a calm low-noise coffee moment for someone who needs presence more than performance.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this one quietly, just to create a little room for you to settle."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Ask the guest to notice warmth and texture before analyzing flavor.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Ask the guest to notice warmth and texture before analyzing flavor."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the guest feel comforted, settled, or less rushed?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup lower the room noise and create a softer moment?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "three-pm-reset",
    "name": "The 3 PM Reset",
    "family": "Core Occasions",
    "tag": "Energy",
    "purpose": "Restore afternoon energy without heaviness or a second-morning intensity.",
    "drink": "Americano, iced coffee, or small cappuccino",
    "drinkChoices": "Americano; iced americano; espresso over tonic; small cappuccino",
    "dose": "18g",
    "yield": "36g espresso base; dilute to taste",
    "time": "25\u201332 sec espresso or quick iced build",
    "ratioGuidance": "Americano uses espresso plus water; iced variations should preserve brightness and avoid watery dilution.",
    "grindVessel": "glass or small mug",
    "suggestedTempo": "6\u20139 minutes",
    "desiredFeeling": "light, lifted, clean, capable",
    "artisanOpening": "I made this as a reset \u2014 light enough to keep moving, but with enough structure to wake the afternoon up.",
    "firstSipDirection": "Sip before stirring if iced; notice brightness first, finish second.",
    "guestResonancePrompt": "Did it feel more refreshing or more energizing?",
    "advisorDirection": "Advisor should avoid heavy ritual; recommend simple builds and clean flavors that do not drag the afternoon down.",
    "recoveryWatchouts": "watery iced drink, sour brightness, too much caffeine, melted ice",
    "reportPrompt": "Did the cup reset energy without heaviness?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: espresso beans, water, optional ice/citrus/sparkling water",
        "Tools: scale, timer, glass, spoon, towel",
        "Cup/glass/vessel: chilled glass or small mug",
        "Garnish or sensory accent: citrus peel or sparkling top if desired",
        "Machine readiness: machine warm, basket dry, water ready",
        "Counter/staging area: quick clean counter with ice/glass pre-staged",
        "Serving path: serve quickly before ice melts",
        "Script readiness: brief reset script ready"
      ],
      "machineReadiness": [
        "machine warm, basket dry, water ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "espresso beans, water, optional ice/citrus/sparkling water",
        "scale, timer, glass, spoon, towel",
        "chilled glass or small mug",
        "citrus peel or sparkling top if desired"
      ],
      "serviceReadiness": [
        "quick clean counter with ice/glass pre-staged",
        "serve quickly before ice melts",
        "brief reset script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The 3 PM Reset out loud and choose the desired feeling: light, lifted, clean, capable.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as energy and protect the human purpose before technique.",
        "script": "I made this as a reset \u2014 light enough to keep moving, but with enough structure to wake the afternoon up."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Americano; iced americano; espresso over tonic; small cappuccino. Confirm dose/yield/time and ratio guidance: Americano uses espresso plus water; iced variations should preserve brightness and avoid watery dilution.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Americano, iced coffee, or small cappuccino because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set glass or small mug.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Restore afternoon energy without heaviness or a second-morning intensity.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this as a reset \u2014 light enough to keep moving, but with enough structure to wake the afternoon up."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Sip before stirring if iced; notice brightness first, finish second.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Sip before stirring if iced; notice brightness first, finish second."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel more refreshing or more energizing?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup reset energy without heaviness?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "welcome-home-cup",
    "name": "The Welcome Home Cup",
    "family": "Core Occasions",
    "tag": "Homecoming",
    "purpose": "Make arrival feel received, warm, and cared for.",
    "drink": "Latte or cappuccino",
    "drinkChoices": "Latte; cappuccino; warm brewed coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Latte leans milkier and softer; cappuccino is 1:1:1 and feels more structured.",
    "grindVessel": "favorite home cup",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "welcoming, relieving, familiar",
    "artisanOpening": "Welcome home. I made this so the day can soften a little as you come in.",
    "firstSipDirection": "Invite aroma first; let them sit before judging taste.",
    "guestResonancePrompt": "Did the person feel received by the home?",
    "advisorDirection": "Advisor should keep the focus on arrival, not impressing; avoid risky experiments.",
    "recoveryWatchouts": "milk texture, too hot, delayed service, guest distracted",
    "reportPrompt": "Did the cup help the person feel home?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk, water, optional sugar preference",
        "Tools: scale, timer, pitcher, towel",
        "Cup/glass/vessel: familiar favorite cup",
        "Garnish or sensory accent: none or light cinnamon if preferred",
        "Machine readiness: machine warm before arrival if possible",
        "Counter/staging area: counter reset before guest enters",
        "Serving path: serve to their settling place",
        "Script readiness: welcoming line ready"
      ],
      "machineReadiness": [
        "machine warm before arrival if possible",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk, water, optional sugar preference",
        "scale, timer, pitcher, towel",
        "familiar favorite cup",
        "none or light cinnamon if preferred"
      ],
      "serviceReadiness": [
        "counter reset before guest enters",
        "serve to their settling place",
        "welcoming line ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Welcome Home Cup out loud and choose the desired feeling: welcoming, relieving, familiar.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as homecoming and protect the human purpose before technique.",
        "script": "Welcome home. I made this so the day can soften a little as you come in."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Latte; cappuccino; warm brewed coffee. Confirm dose/yield/time and ratio guidance: Latte leans milkier and softer; cappuccino is 1:1:1 and feels more structured.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Latte or cappuccino because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set favorite home cup.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Make arrival feel received, warm, and cared for.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "Welcome home. I made this so the day can soften a little as you come in."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Invite aroma first; let them sit before judging taste.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Invite aroma first; let them sit before judging taste."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the person feel received by the home?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup help the person feel home?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "morning-launch",
    "name": "The Morning Launch",
    "family": "Core Occasions",
    "tag": "Confidence",
    "purpose": "Start the day with rhythm, order, and confidence.",
    "drink": "Cappuccino, flat white, Americano, or espresso",
    "drinkChoices": "Cappuccino; flat white; Americano; espresso",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Choose milk ratio by desired feel: cappuccino 1:1:1; flat white more milk and less foam; Americano espresso plus water.",
    "grindVessel": "breakfast cup or travel mug",
    "suggestedTempo": "7\u201310 minutes",
    "desiredFeeling": "focused, steady, optimistic",
    "artisanOpening": "This cup is here to help us begin the day with steadiness instead of scramble.",
    "firstSipDirection": "Notice structure and finish; do not overanalyze when the day needs momentum.",
    "guestResonancePrompt": "Did it create momentum, steadiness, or too much intensity?",
    "advisorDirection": "Advisor should keep variables stable and protect the morning from over-tweaking.",
    "recoveryWatchouts": "fast shot, rushed routine, milk delay, too strong",
    "reportPrompt": "Did the cup create order for the day?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/water, travel lid if needed",
        "Tools: scale, timer, pitcher, towel",
        "Cup/glass/vessel: breakfast cup or travel mug",
        "Garnish or sensory accent: none; functional clarity",
        "Machine readiness: machine warm, workflow ready",
        "Counter/staging area: simple station, only essentials",
        "Serving path: serving path to breakfast/travel area",
        "Script readiness: morning launch phrase ready"
      ],
      "machineReadiness": [
        "machine warm, workflow ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/water, travel lid if needed",
        "scale, timer, pitcher, towel",
        "breakfast cup or travel mug",
        "none; functional clarity"
      ],
      "serviceReadiness": [
        "simple station, only essentials",
        "serving path to breakfast/travel area",
        "morning launch phrase ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Morning Launch out loud and choose the desired feeling: focused, steady, optimistic.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as confidence and protect the human purpose before technique.",
        "script": "This cup is here to help us begin the day with steadiness instead of scramble."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Cappuccino; flat white; Americano; espresso. Confirm dose/yield/time and ratio guidance: Choose milk ratio by desired feel: cappuccino 1:1:1; flat white more milk and less foam; Americano espresso plus water.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Cappuccino, flat white, Americano, or espresso because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set breakfast cup or travel mug.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Start the day with rhythm, order, and confidence.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "This cup is here to help us begin the day with steadiness instead of scramble."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Notice structure and finish; do not overanalyze when the day needs momentum.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Notice structure and finish; do not overanalyze when the day needs momentum."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it create momentum, steadiness, or too much intensity?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup create order for the day?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "listening-cup",
    "name": "The Listening Cup",
    "family": "Core Occasions",
    "tag": "Conversation",
    "purpose": "Create space for conversation rather than showing off coffee knowledge.",
    "drink": "Small milk drink or brewed coffee",
    "drinkChoices": "Cortado; cappuccino; pour-over; Americano",
    "dose": "18g espresso or 20g brew",
    "yield": "36g espresso or 300g brew",
    "time": "espresso 25\u201332 sec; brew 3\u20134 min",
    "ratioGuidance": "Select a drink that supports conversation and does not demand analysis.",
    "grindVessel": "two simple cups",
    "suggestedTempo": "8\u201313 minutes",
    "desiredFeeling": "open, attentive, safe",
    "artisanOpening": "I made this so we could have something warm between us while we talk.",
    "firstSipDirection": "Let the guest respond before explaining notes.",
    "guestResonancePrompt": "Did the cup help someone open up or settle in?",
    "advisorDirection": "Advisor should coach restraint: ask less, listen more, explain only if invited.",
    "recoveryWatchouts": "overexplaining, drink too intense, awkward silence, bitter cup",
    "reportPrompt": "Did the cup create low-pressure space?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: coffee, water, optional milk",
        "Tools: method tools, scale/timer, cups, towel",
        "Cup/glass/vessel: two table-friendly cups",
        "Garnish or sensory accent: none; avoid sensory distraction",
        "Machine readiness: machine or brewer ready before conversation begins",
        "Counter/staging area: table path clear",
        "Serving path: serve seated if possible",
        "Script readiness: short invitation script ready"
      ],
      "machineReadiness": [
        "machine or brewer ready before conversation begins",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "coffee, water, optional milk",
        "method tools, scale/timer, cups, towel",
        "two table-friendly cups",
        "none; avoid sensory distraction"
      ],
      "serviceReadiness": [
        "table path clear",
        "serve seated if possible",
        "short invitation script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Listening Cup out loud and choose the desired feeling: open, attentive, safe.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as conversation and protect the human purpose before technique.",
        "script": "I made this so we could have something warm between us while we talk."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Cortado; cappuccino; pour-over; Americano. Confirm dose/yield/time and ratio guidance: Select a drink that supports conversation and does not demand analysis.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Small milk drink or brewed coffee because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set two simple cups.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Create space for conversation rather than showing off coffee knowledge.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this so we could have something warm between us while we talk."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Let the guest respond before explaining notes.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Let the guest respond before explaining notes."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the cup help someone open up or settle in?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup create low-pressure space?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "apology-cup",
    "name": "The Apology Cup",
    "family": "Core Occasions",
    "tag": "Repair",
    "purpose": "Offer a humble cup that supports repair without replacing accountability.",
    "drink": "Gentle latte or warm cappuccino",
    "drinkChoices": "Latte; gentle cappuccino; warm brewed coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Use a familiar mild build; the coffee should not demand attention away from the apology.",
    "grindVessel": "simple warm cup",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "humble, sincere, safe",
    "artisanOpening": "I made this as a small gesture. The apology matters more than the coffee, but I wanted to bring care with it.",
    "firstSipDirection": "No forced first sip direction; allow them to receive it naturally.",
    "guestResonancePrompt": "Did the cup support repair or distract from it?",
    "advisorDirection": "Advisor should prevent performance energy; center sincerity and restraint.",
    "recoveryWatchouts": "overperforming, too much explanation, cup failure during emotional moment",
    "reportPrompt": "Did the cup carry care without asking for applause?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/water, simple cup",
        "Tools: scale, timer, pitcher, towel",
        "Cup/glass/vessel: plain warm cup",
        "Garnish or sensory accent: none",
        "Machine readiness: machine warm, lowest-risk recipe chosen",
        "Counter/staging area: counter quiet and uncluttered",
        "Serving path: serve gently, not ceremonially",
        "Script readiness: apology line ready"
      ],
      "machineReadiness": [
        "machine warm, lowest-risk recipe chosen",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/water, simple cup",
        "scale, timer, pitcher, towel",
        "plain warm cup",
        "none"
      ],
      "serviceReadiness": [
        "counter quiet and uncluttered",
        "serve gently, not ceremonially",
        "apology line ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Apology Cup out loud and choose the desired feeling: humble, sincere, safe.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as repair and protect the human purpose before technique.",
        "script": "I made this as a small gesture. The apology matters more than the coffee, but I wanted to bring care with it."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Latte; gentle cappuccino; warm brewed coffee. Confirm dose/yield/time and ratio guidance: Use a familiar mild build; the coffee should not demand attention away from the apology.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Gentle latte or warm cappuccino because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set simple warm cup.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Offer a humble cup that supports repair without replacing accountability.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this as a small gesture. The apology matters more than the coffee, but I wanted to bring care with it."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "No forced first sip direction; allow them to receive it naturally.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "No forced first sip direction; allow them to receive it naturally."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the cup support repair or distract from it?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup carry care without asking for applause?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "celebration-cup",
    "name": "The Celebration Cup",
    "family": "Core Occasions",
    "tag": "Joy",
    "purpose": "Mark good news with a cup that feels intentional and memorable.",
    "drink": "Signature cappuccino, espresso tonic, or dessert-style drink",
    "drinkChoices": "Signature cappuccino; espresso tonic; affogato-style espresso",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Build one stable espresso base and add one celebratory sensory element.",
    "grindVessel": "favorite cup or clear glass",
    "suggestedTempo": "9\u201313 minutes",
    "desiredFeeling": "joyful, bright, proud",
    "artisanOpening": "This cup is for the good news. I wanted the moment to have a little ceremony.",
    "firstSipDirection": "Invite them to notice the special visual or aroma first.",
    "guestResonancePrompt": "Did it feel like celebration, surprise, or too much?",
    "advisorDirection": "Advisor should encourage one elegant flourish, not a cluttered drink.",
    "recoveryWatchouts": "too sweet, garnish overdone, visual messy, time pressure",
    "reportPrompt": "Did the cup make the win feel marked?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk or tonic, optional garnish",
        "Tools: scale, timer, pitcher/glass, spoon, towel",
        "Cup/glass/vessel: clear glass or favorite cup",
        "Garnish or sensory accent: citrus, cocoa, berry, or small sweet accent",
        "Machine readiness: machine warm, recipe stable",
        "Counter/staging area: counter staged like a small ceremony",
        "Serving path: serve as a toast or marked pause",
        "Script readiness: celebration line ready"
      ],
      "machineReadiness": [
        "machine warm, recipe stable",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk or tonic, optional garnish",
        "scale, timer, pitcher/glass, spoon, towel",
        "clear glass or favorite cup",
        "citrus, cocoa, berry, or small sweet accent"
      ],
      "serviceReadiness": [
        "counter staged like a small ceremony",
        "serve as a toast or marked pause",
        "celebration line ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Celebration Cup out loud and choose the desired feeling: joyful, bright, proud.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as joy and protect the human purpose before technique.",
        "script": "This cup is for the good news. I wanted the moment to have a little ceremony."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Signature cappuccino; espresso tonic; affogato-style espresso. Confirm dose/yield/time and ratio guidance: Build one stable espresso base and add one celebratory sensory element.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Signature cappuccino, espresso tonic, or dessert-style drink because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set favorite cup or clear glass.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Mark good news with a cup that feels intentional and memorable.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "This cup is for the good news. I wanted the moment to have a little ceremony."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Invite them to notice the special visual or aroma first.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Invite them to notice the special visual or aroma first."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel like celebration, surprise, or too much?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup make the win feel marked?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "boss-coming-over",
    "name": "The Boss Is Coming Over",
    "family": "Core Occasions",
    "tag": "Polish",
    "purpose": "Serve with calm competence under social pressure.",
    "drink": "Polished cappuccino, flat white, espresso, or pour-over",
    "drinkChoices": "Cappuccino; flat white; espresso; pour-over",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Choose the most reliable drink, not the riskiest. Cappuccino 1:1:1 is understandable and polished when milk texture is reliable.",
    "grindVessel": "clean ceramic cup or service tray",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "composed, capable, polished",
    "artisanOpening": "I kept this one classic \u2014 balanced, warm, and straightforward.",
    "firstSipDirection": "One simple cue: notice balance and warmth.",
    "guestResonancePrompt": "Did the guest feel comfortable, impressed, or over-managed?",
    "advisorDirection": "Advisor should reduce anxiety, pick reliable options, and avoid overexplaining specialty language.",
    "recoveryWatchouts": "fast shot, milk foam error, overexplaining, pressure mistakes",
    "reportPrompt": "Did the artisan stay composed under pressure?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/water, best reliable cups",
        "Tools: scale, timer, pitcher, towel, tray",
        "Cup/glass/vessel: polished ceramic cup",
        "Garnish or sensory accent: none or restrained cocoa",
        "Machine readiness: machine fully warmed before guest arrives",
        "Counter/staging area: counter looks intentional and professional",
        "Serving path: serve cleanly without fuss",
        "Script readiness: classic confidence script ready"
      ],
      "machineReadiness": [
        "machine fully warmed before guest arrives",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/water, best reliable cups",
        "scale, timer, pitcher, towel, tray",
        "polished ceramic cup",
        "none or restrained cocoa"
      ],
      "serviceReadiness": [
        "counter looks intentional and professional",
        "serve cleanly without fuss",
        "classic confidence script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Boss Is Coming Over out loud and choose the desired feeling: composed, capable, polished.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as polish and protect the human purpose before technique.",
        "script": "I kept this one classic \u2014 balanced, warm, and straightforward."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Cappuccino; flat white; espresso; pour-over. Confirm dose/yield/time and ratio guidance: Choose the most reliable drink, not the riskiest. Cappuccino 1:1:1 is understandable and polished when milk texture is reliable.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Polished cappuccino, flat white, espresso, or pour-over because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set clean ceramic cup or service tray.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Serve with calm competence under social pressure.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I kept this one classic \u2014 balanced, warm, and straightforward."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "One simple cue: notice balance and warmth.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "One simple cue: notice balance and warmth."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the guest feel comfortable, impressed, or over-managed?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the artisan stay composed under pressure?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "friend-lift",
    "name": "The Friend Who Needs a Lift",
    "family": "Core Occasions",
    "tag": "Care",
    "purpose": "Encourage someone with comfort, warmth, and lightness.",
    "drink": "Comforting milk drink or gentle iced drink",
    "drinkChoices": "Latte; cappuccino; iced latte; warm brewed coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Choose softness over intensity; milk ratio can be adjusted toward comfort.",
    "grindVessel": "comfort cup or tall iced glass",
    "suggestedTempo": "7\u201311 minutes",
    "desiredFeeling": "encouraging, soft, steady",
    "artisanOpening": "I made this one soft and steady \u2014 just something to give you a little lift.",
    "firstSipDirection": "Invite them to notice sweetness or comfort first.",
    "guestResonancePrompt": "Did they feel comforted, encouraged, or unchanged?",
    "advisorDirection": "Advisor should help the artisan read mood and avoid making the drink too intense.",
    "recoveryWatchouts": "drink too strong, wrong temperature, guest low energy, milk texture",
    "reportPrompt": "Did the cup offer lift without pressure?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/alt milk, optional gentle sweetener",
        "Tools: scale, timer, pitcher, towel, glass/cup",
        "Cup/glass/vessel: comforting vessel",
        "Garnish or sensory accent: light sweetness or cinnamon only if appropriate",
        "Machine readiness: machine warm, milk ready",
        "Counter/staging area: soft uncluttered counter",
        "Serving path: serve near where friend is resting",
        "Script readiness: encouragement script ready"
      ],
      "machineReadiness": [
        "machine warm, milk ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/alt milk, optional gentle sweetener",
        "scale, timer, pitcher, towel, glass/cup",
        "comforting vessel",
        "light sweetness or cinnamon only if appropriate"
      ],
      "serviceReadiness": [
        "soft uncluttered counter",
        "serve near where friend is resting",
        "encouragement script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Friend Who Needs a Lift out loud and choose the desired feeling: encouraging, soft, steady.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as care and protect the human purpose before technique.",
        "script": "I made this one soft and steady \u2014 just something to give you a little lift."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Latte; cappuccino; iced latte; warm brewed coffee. Confirm dose/yield/time and ratio guidance: Choose softness over intensity; milk ratio can be adjusted toward comfort.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Comforting milk drink or gentle iced drink because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set comfort cup or tall iced glass.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Encourage someone with comfort, warmth, and lightness.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this one soft and steady \u2014 just something to give you a little lift."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Invite them to notice sweetness or comfort first.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Invite them to notice sweetness or comfort first."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did they feel comforted, encouraged, or unchanged?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup offer lift without pressure?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "date-night-counter",
    "name": "The Date-Night Counter",
    "family": "Core Occasions",
    "tag": "Intimacy",
    "purpose": "Create a polished counter moment with texture, beauty, and closeness.",
    "drink": "Dessert-style espresso drink or coffee mocktail",
    "drinkChoices": "Cortado; affogato-style espresso; cold foam espresso; coffee mocktail",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Keep drink small and sensory; one beautiful texture or temperature contrast is enough.",
    "grindVessel": "two small cups or coupe glasses",
    "suggestedTempo": "10\u201314 minutes",
    "desiredFeeling": "playful, intimate, polished",
    "artisanOpening": "I made this as a small counter dessert \u2014 just enough to slow us down for a few minutes.",
    "firstSipDirection": "Taste together; invite a shared reaction rather than a lecture.",
    "guestResonancePrompt": "Did it feel playful, intimate, comforting, or too much?",
    "advisorDirection": "Advisor should coach romance through restraint, pacing, and visual polish.",
    "recoveryWatchouts": "too sweet, messy counter, overexplaining, wrong temperature",
    "reportPrompt": "Did the cup create a shared pause?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/cream or sparkling element, optional small sweet accent",
        "Tools: scale, timer, two glasses/cups, spoon, towel",
        "Cup/glass/vessel: matched small vessels",
        "Garnish or sensory accent: chocolate, citrus, berry, or foam accent",
        "Machine readiness: machine warm, recipe reliable",
        "Counter/staging area: counter cleared like a small stage",
        "Serving path: serve side by side",
        "Script readiness: counter-dessert script ready"
      ],
      "machineReadiness": [
        "machine warm, recipe reliable",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/cream or sparkling element, optional small sweet accent",
        "scale, timer, two glasses/cups, spoon, towel",
        "matched small vessels",
        "chocolate, citrus, berry, or foam accent"
      ],
      "serviceReadiness": [
        "counter cleared like a small stage",
        "serve side by side",
        "counter-dessert script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Date-Night Counter out loud and choose the desired feeling: playful, intimate, polished.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as intimacy and protect the human purpose before technique.",
        "script": "I made this as a small counter dessert \u2014 just enough to slow us down for a few minutes."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Cortado; affogato-style espresso; cold foam espresso; coffee mocktail. Confirm dose/yield/time and ratio guidance: Keep drink small and sensory; one beautiful texture or temperature contrast is enough.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Dessert-style espresso drink or coffee mocktail because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set two small cups or coupe glasses.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Create a polished counter moment with texture, beauty, and closeness.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this as a small counter dessert \u2014 just enough to slow us down for a few minutes."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Taste together; invite a shared reaction rather than a lecture.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Taste together; invite a shared reaction rather than a lecture."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel playful, intimate, comforting, or too much?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup create a shared pause?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "parent-visit",
    "name": "The Parent Visit",
    "family": "Core Occasions",
    "tag": "Familiarity",
    "purpose": "Serve something recognizable with care and respect.",
    "drink": "Familiar coffee, latte, cappuccino, or brewed coffee",
    "drinkChoices": "Latte; cappuccino; Americano; brewed coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Meet preference first; use sugar/milk options without judgment.",
    "grindVessel": "familiar mug",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "familiar, respectful, cared for",
    "artisanOpening": "I made this close to what I think you will enjoy \u2014 warm, familiar, and easy.",
    "firstSipDirection": "Let them respond naturally; do not instruct unless they ask.",
    "guestResonancePrompt": "Did it feel familiar, too strong, surprisingly good, or comforting?",
    "advisorDirection": "Advisor should emphasize preference, not education. Capture learnings for future guest profile.",
    "recoveryWatchouts": "too strong, too unfamiliar, wrong milk/sugar, overexplaining",
    "reportPrompt": "What preference did we learn?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/sugar options, water",
        "Tools: scale, timer, pitcher, towel",
        "Cup/glass/vessel: familiar mug",
        "Garnish or sensory accent: none unless they like it",
        "Machine readiness: machine ready, reliable recipe",
        "Counter/staging area: service area with condiments available",
        "Serving path: serve where they are comfortable",
        "Script readiness: respectful preference script ready"
      ],
      "machineReadiness": [
        "machine ready, reliable recipe",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/sugar options, water",
        "scale, timer, pitcher, towel",
        "familiar mug",
        "none unless they like it"
      ],
      "serviceReadiness": [
        "service area with condiments available",
        "serve where they are comfortable",
        "respectful preference script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Parent Visit out loud and choose the desired feeling: familiar, respectful, cared for.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as familiarity and protect the human purpose before technique.",
        "script": "I made this close to what I think you will enjoy \u2014 warm, familiar, and easy."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Latte; cappuccino; Americano; brewed coffee. Confirm dose/yield/time and ratio guidance: Meet preference first; use sugar/milk options without judgment.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Familiar coffee, latte, cappuccino, or brewed coffee because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set familiar mug.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Serve something recognizable with care and respect.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I made this close to what I think you will enjoy \u2014 warm, familiar, and easy."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Let them respond naturally; do not instruct unless they ask.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Let them respond naturally; do not instruct unless they ask."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel familiar, too strong, surprisingly good, or comforting?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: What preference did we learn?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "neighbor-cup",
    "name": "The Neighbor Cup",
    "family": "Core Occasions",
    "tag": "Community",
    "purpose": "Build casual community with approachable hospitality.",
    "drink": "Simple latte, brewed coffee, iced coffee, or cappuccino",
    "drinkChoices": "Latte; cappuccino; brewed coffee; iced coffee",
    "dose": "18g",
    "yield": "36g",
    "time": "25\u201332 sec",
    "ratioGuidance": "Choose an easy-to-receive drink; avoid making the neighbor feel tested.",
    "grindVessel": "casual cup or to-go cup",
    "suggestedTempo": "6\u201310 minutes",
    "desiredFeeling": "approachable, friendly, easy",
    "artisanOpening": "I was making coffee and thought you might enjoy one too.",
    "firstSipDirection": "Invite a simple reaction, not a tasting exam.",
    "guestResonancePrompt": "Did it feel welcoming, surprising, curious, or too formal?",
    "advisorDirection": "Advisor should keep the tone low-pressure and community-oriented.",
    "recoveryWatchouts": "overperformance, too strong, awkward delivery, unknown preferences",
    "reportPrompt": "Did the cup open a small community connection?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, milk/water, optional extra cup",
        "Tools: scale, timer, pitcher, towel",
        "Cup/glass/vessel: casual cup or to-go vessel",
        "Garnish or sensory accent: none or simple cinnamon",
        "Machine readiness: machine ready while making own cup",
        "Counter/staging area: counter normal, not staged too formally",
        "Serving path: easy handoff path",
        "Script readiness: neighbor invitation script ready"
      ],
      "machineReadiness": [
        "machine ready while making own cup",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, milk/water, optional extra cup",
        "scale, timer, pitcher, towel",
        "casual cup or to-go vessel",
        "none or simple cinnamon"
      ],
      "serviceReadiness": [
        "counter normal, not staged too formally",
        "easy handoff path",
        "neighbor invitation script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Neighbor Cup out loud and choose the desired feeling: approachable, friendly, easy.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as community and protect the human purpose before technique.",
        "script": "I was making coffee and thought you might enjoy one too."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Latte; cappuccino; brewed coffee; iced coffee. Confirm dose/yield/time and ratio guidance: Choose an easy-to-receive drink; avoid making the neighbor feel tested.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Simple latte, brewed coffee, iced coffee, or cappuccino because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set casual cup or to-go cup.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Build casual community with approachable hospitality.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "I was making coffee and thought you might enjoy one too."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Invite a simple reaction, not a tasting exam.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Invite a simple reaction, not a tasting exam."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel welcoming, surprising, curious, or too formal?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup open a small community connection?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "sunday-slow-cup",
    "name": "The Sunday Slow Cup",
    "family": "Core Occasions",
    "tag": "Reflection",
    "purpose": "Create an unhurried reflective cup with pace and presence.",
    "drink": "Slow cappuccino, pour-over, Americano, or cortado",
    "drinkChoices": "Pour-over; cappuccino; Americano; cortado",
    "dose": "18g espresso or 22g brew",
    "yield": "36g espresso or 330g brew",
    "time": "espresso 25\u201332 sec; brew 3:30\u20134:30",
    "ratioGuidance": "Use the method that supports slowness; do not force espresso if brewed coffee better fits the moment.",
    "grindVessel": "favorite slow cup",
    "suggestedTempo": "10\u201316 minutes",
    "desiredFeeling": "peaceful, reflective, unhurried",
    "artisanOpening": "This one is meant to be slow \u2014 not rushed, just something to sit with.",
    "firstSipDirection": "Notice aroma first, then warmth, then finish.",
    "guestResonancePrompt": "Did it create peace, reflection, or distraction?",
    "advisorDirection": "Advisor should protect slow tempo and help the artisan avoid turning the moment into a task list.",
    "recoveryWatchouts": "rushing, over-tweaking, bitter brew, too much explanation",
    "reportPrompt": "Did the cup create reflective space?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: beans, water, optional milk",
        "Tools: method tools, scale, timer, towel",
        "Cup/glass/vessel: favorite slow vessel",
        "Garnish or sensory accent: none or subtle citrus peel",
        "Machine readiness: machine/brewer warmed without hurry",
        "Counter/staging area: counter calm and clean",
        "Serving path: serve where reflection will happen",
        "Script readiness: slow cup script ready"
      ],
      "machineReadiness": [
        "machine/brewer warmed without hurry",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "beans, water, optional milk",
        "method tools, scale, timer, towel",
        "favorite slow vessel",
        "none or subtle citrus peel"
      ],
      "serviceReadiness": [
        "counter calm and clean",
        "serve where reflection will happen",
        "slow cup script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Sunday Slow Cup out loud and choose the desired feeling: peaceful, reflective, unhurried.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as reflection and protect the human purpose before technique.",
        "script": "This one is meant to be slow \u2014 not rushed, just something to sit with."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Pour-over; cappuccino; Americano; cortado. Confirm dose/yield/time and ratio guidance: Use the method that supports slowness; do not force espresso if brewed coffee better fits the moment.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Slow cappuccino, pour-over, Americano, or cortado because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set favorite slow cup.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Create an unhurried reflective cup with pace and presence.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "This one is meant to be slow \u2014 not rushed, just something to sit with."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Notice aroma first, then warmth, then finish.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Notice aroma first, then warmth, then finish."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it create peace, reflection, or distraction?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: Did the cup create reflective space?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "founders-performance",
    "name": "The Founder\u2019s Performance",
    "family": "Core Occasions",
    "tag": "Complete Standard",
    "purpose": "Practice the complete Barista Doma standard across preparation, stagecraft, recovery, tasting, and report.",
    "drink": "Chosen signature or best house beverage",
    "drinkChoices": "Best house cappuccino; signature espresso tonic; selected founder drink",
    "dose": "18g baseline",
    "yield": "36g espresso base",
    "time": "25\u201332 sec espresso base",
    "ratioGuidance": "Use the selected drink formula and document every variable; this is the full performance rehearsal.",
    "grindVessel": "best vessel for chosen drink",
    "suggestedTempo": "12\u201318 minutes",
    "desiredFeeling": "prepared, composed, excellent",
    "artisanOpening": "This is my full Barista Doma performance \u2014 the machine makes the beverage, and I prepare the moment.",
    "firstSipDirection": "Give the correct first sip direction for the chosen drink.",
    "guestResonancePrompt": "Did the complete Occasion land: drink, service, taste, guest, tempo?",
    "advisorDirection": "Advisor should evaluate the full Occasion, not just the cup: readiness, voice, recovery, tasting, Guest Resonance, and report completeness.",
    "recoveryWatchouts": "any issue; use matrix, correction loop, tasting, report",
    "reportPrompt": "What improved and what becomes the next refinement?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: chosen drink ingredients, garnish, water, milk/tonic as needed",
        "Tools: full tool set, scale, timer, towel, report device",
        "Cup/glass/vessel: best vessel for chosen drink",
        "Garnish or sensory accent: chosen accent aligned to occasion",
        "Machine readiness: machine, grinder, and formula verified",
        "Counter/staging area: full station staged with serving path",
        "Serving path: serve with script and first sip direction",
        "Script readiness: complete performance script ready"
      ],
      "machineReadiness": [
        "machine, grinder, and formula verified",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "chosen drink ingredients, garnish, water, milk/tonic as needed",
        "full tool set, scale, timer, towel, report device",
        "best vessel for chosen drink",
        "chosen accent aligned to occasion"
      ],
      "serviceReadiness": [
        "full station staged with serving path",
        "serve with script and first sip direction",
        "complete performance script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the Occasion intention",
        "suggestedTempo": "30\u201345 sec",
        "action": "Say the purpose of The Founder\u2019s Performance out loud and choose the desired feeling: prepared, composed, excellent.",
        "why": "The Advisor uses the intention to keep guidance aligned to the moment.",
        "watch": "Do not start as a generic coffee task.",
        "advisor": "Frame this as complete standard and protect the human purpose before technique.",
        "script": "This is my full Barista Doma performance \u2014 the machine makes the beverage, and I prepare the moment."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage ingredients, tools, vessel, sensory accent, machine readiness, counter space, serving path, and script. Confirm nothing important is missing.",
        "why": "Preparation begins with Mise en Place; it is the first readiness act, not just ingredients.",
        "watch": "Missing vessel, towel, or script creates friction later.",
        "advisor": "Use the structured form so machine, drink choice, dose, yield, and guest context are visible.",
        "script": "I have the station ready so the cup can serve the moment."
      },
      {
        "title": "Select the drink and formula",
        "suggestedTempo": "60 sec",
        "action": "Choose from: Best house cappuccino; signature espresso tonic; selected founder drink. Confirm dose/yield/time and ratio guidance: Use the selected drink formula and document every variable; this is the full performance rehearsal.",
        "why": "The Advisor cannot give high-quality guidance if it does not know the selected drink and formula.",
        "watch": "Do not let the app assume cappuccino when the artisan chose another drink.",
        "advisor": "The selected drink must feed the Advisor, Recovery Matrix, and Doma Report.",
        "script": "I am choosing Chosen signature or best house beverage because it fits this occasion."
      },
      {
        "title": "Prepare machine and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Warm or chill the vessel as needed, confirm machine readiness, and set best vessel for chosen drink.",
        "why": "The vessel and machine condition shape temperature, texture, and confidence.",
        "watch": "Cold cups, wet baskets, or unready milk pitchers can sabotage the moment.",
        "advisor": "Check Machine Passport data before diagnosing any issue.",
        "script": "I am preparing the machine and vessel so the drink lands correctly."
      },
      {
        "title": "Build the beverage with occasion discipline",
        "suggestedTempo": "2\u20134 min",
        "action": "Prepare the drink using the selected formula. Keep changes minimal and tied to the Occasion purpose: Practice the complete Barista Doma standard across preparation, stagecraft, recovery, tasting, and report.",
        "why": "The drink build is part of the performance; the artisan\u2019s rhythm matters.",
        "watch": "If the shot chokes, runs fast, or tastes off, open the Matrix instead of guessing.",
        "advisor": "Give one next move only; preserve the Occasion.",
        "script": "I am building this cup with care, not just making coffee."
      },
      {
        "title": "Use the Artisan Stagecraft Script",
        "suggestedTempo": "30\u201345 sec",
        "action": "Serve the drink with the Occasion script. Keep words natural, brief, and guest-centered.",
        "why": "The script turns beverage service into stagecraft.",
        "watch": "Avoid overexplaining or making the guest feel tested.",
        "advisor": "Coach the artisan to say enough to guide the first sip, not dominate it.",
        "script": "This is my full Barista Doma performance \u2014 the machine makes the beverage, and I prepare the moment."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Give the correct first sip direction for the chosen drink.",
        "why": "The first sip teaches the guest how to receive the drink.",
        "watch": "Do not force tasting notes; invite attention.",
        "advisor": "The Advisor should tailor the sip direction to drink choice and guest readiness.",
        "script": "Give the correct first sip direction for the chosen drink."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the complete Occasion land: drink, service, taste, guest, tempo?",
        "why": "The Occasion is not complete when the drink is made; it is complete when it is received.",
        "watch": "Do not ask too many questions; capture the first honest reaction.",
        "advisor": "Use Guest Resonance in the report: reaction, first thing noticed, quote, serve again, next adjustment.",
        "script": "Tell me what you noticed first \u2014 aroma, texture, sweetness, temperature, or the feeling of it."
      },
      {
        "title": "Complete Doma Report",
        "suggestedTempo": "90 sec",
        "action": "Capture machine, grinder, beans, drink choice, dose, yield, shot time, sensory notes, recovery, tempo, Guest Resonance, and next adjustment. Report prompt: What improved and what becomes the next refinement?",
        "why": "The report makes Barista Doma the second coffee brain.",
        "watch": "Do not skip data that the Advisor needs next time.",
        "advisor": "Summarize trend/confidence and preserve the next move.",
        "script": "I am saving this Occasion so the next one can become more confident."
      }
    ]
  },
  {
    "id": "first-sip-flex",
    "name": "The First Sip Flex",
    "family": "Modern Sensory Occasions",
    "tag": "First-sip wow",
    "purpose": "For the guest who thinks they do not like serious coffee.",
    "drink": "Chilled espresso tonic with citrus + berry lift",
    "drinkChoices": "Chilled espresso tonic; espresso spritz; low-sugar berry citrus tonic",
    "dose": "18g espresso base",
    "yield": "36g espresso base over tonic",
    "time": "25\u201332 sec espresso; total build 8\u201311 min",
    "ratioGuidance": "Espresso tonic is not a latte ratio; build sparkling base first, leave headroom, float espresso for contrast.",
    "grindVessel": "chilled highball glass",
    "suggestedTempo": "8\u201311 minutes",
    "desiredFeeling": "bright, social, refreshing, not rushed",
    "artisanOpening": "I made this as a chilled espresso tonic with citrus, a little floral lift, and a bright berry finish. Try the first sip without stirring it \u2014 the top is lighter and sparkling, then the espresso comes through underneath.",
    "firstSipDirection": "Sip from the top before stirring so the sparkling citrus layer arrives first.",
    "guestResonancePrompt": "Did it feel more like coffee, soda, or a mocktail?",
    "advisorDirection": "Advisor should protect sparkle, visual layering, and guest surprise. It should not over-teach espresso extraction unless the shot fails.",
    "recoveryWatchouts": "flat tonic, bitter espresso float, muddled layers, guest confused",
    "reportPrompt": "Did the guest cross the bridge into serious coffee through delight?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: espresso, chilled tonic/sparkling water, ice, citrus peel or wheel, berry accent",
        "Tools: scale, espresso tools, chilled glass, bar spoon, towel",
        "Cup/glass/vessel: chilled highball or clear glass",
        "Garnish or sensory accent: citrus twist and one berry or berry syrup accent",
        "Machine readiness: machine hot and ready; glass cold; espresso pulled last",
        "Counter/staging area: clear counter with glass centered for visual build",
        "Serving path: serve immediately before carbonation fades",
        "Script readiness: first-sip unstirred script ready"
      ],
      "machineReadiness": [
        "machine hot and ready; glass cold; espresso pulled last",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "espresso, chilled tonic/sparkling water, ice, citrus peel or wheel, berry accent",
        "scale, espresso tools, chilled glass, bar spoon, towel",
        "chilled highball or clear glass",
        "citrus twist and one berry or berry syrup accent"
      ],
      "serviceReadiness": [
        "clear counter with glass centered for visual build",
        "serve immediately before carbonation fades",
        "first-sip unstirred script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the sensory intention",
        "suggestedTempo": "30 sec",
        "action": "Name the purpose of The First Sip Flex: For the guest who thinks they do not like serious coffee.",
        "why": "Next-Gen drinks need a clear reason or they can feel gimmicky.",
        "watch": "Avoid novelty without intention.",
        "advisor": "Advisor should protect sparkle, visual layering, and guest surprise. It should not over-teach espresso extraction unless the shot fails.",
        "script": "I made this as a chilled espresso tonic with citrus, a little floral lift, and a bright berry finish. Try the first sip without stirring it \u2014 the top is lighter and sparkling, then the espresso comes through underneath."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage all cold/sensory ingredients, tools, vessel, garnish, machine readiness, serving path, and script before brewing.",
        "why": "Cold and layered drinks punish missing pieces because ice, foam, and sparkle change quickly.",
        "watch": "Do not start espresso until glass, ice, and accent are ready.",
        "advisor": "Preparation begins with Mise en Place; stage the sensory elements first.",
        "script": "Everything is staged so the drink can be built cleanly."
      },
      {
        "title": "Confirm drink choice and build formula",
        "suggestedTempo": "60 sec",
        "action": "Select one build from: Chilled espresso tonic; espresso spritz; low-sugar berry citrus tonic. Use this guidance: Espresso tonic is not a latte ratio; build sparkling base first, leave headroom, float espresso for contrast.",
        "why": "The Advisor needs selected drink choice, not just the Occasion name.",
        "watch": "Do not assume the default if the artisan chooses a variant.",
        "advisor": "Feed selected drink, dose/yield, and build method into Advisor context.",
        "script": "I am choosing this build because it fits The First Sip Flex."
      },
      {
        "title": "Prepare base and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Prepare the vessel: chilled highball glass. Confirm machine and coffee base. Use 18g espresso base toward 36g espresso base over tonic where espresso is involved.",
        "why": "Temperature, vessel, and sequence shape perception.",
        "watch": "Warm espresso in warm glass can melt ice too fast; cold glass protects texture.",
        "advisor": "Coach sequence and readiness before taste correction.",
        "script": "I am preparing the base so the first sip has the right structure."
      },
      {
        "title": "Build the sensory structure",
        "suggestedTempo": "2\u20133 min",
        "action": "Build the drink deliberately: preserve layers, texture, temperature contrast, and aroma for Chilled espresso tonic with citrus + berry lift.",
        "why": "The drink experience comes from sequence, not ingredients alone.",
        "watch": "Stirring too early, over-sweetening, or losing foam/sparkle weakens the Occasion.",
        "advisor": "Explain each build action in practical terms if asked.",
        "script": "I am building the layers so the guest can experience the drink in order."
      },
      {
        "title": "Serve with Artisan Stagecraft Script",
        "suggestedTempo": "30 sec",
        "action": "Use the script exactly enough to guide curiosity, then stop talking.",
        "why": "Gen Z/Next-Gen guests often want an experience but not a lecture.",
        "watch": "Too much explanation can reduce delight.",
        "advisor": "Advisor should make the script short, social, and sensory.",
        "script": "I made this as a chilled espresso tonic with citrus, a little floral lift, and a bright berry finish. Try the first sip without stirring it \u2014 the top is lighter and sparkling, then the espresso comes through underneath."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Sip from the top before stirring so the sparkling citrus layer arrives first.",
        "why": "First sip direction prevents the guest from collapsing the drink too early.",
        "watch": "If they stir first, the intended contrast may disappear.",
        "advisor": "Coach the guest gently; do not control them.",
        "script": "Sip from the top before stirring so the sparkling citrus layer arrives first."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did it feel more like coffee, soda, or a mocktail?",
        "why": "Guest Resonance tells whether the drink crossed from interesting to delightful.",
        "watch": "Capture their words, not your hope.",
        "advisor": "Use reaction, first thing noticed, quote, and serve-again choice.",
        "script": "Did it feel more like coffee, soda, or a mocktail?"
      },
      {
        "title": "Doma Report and next adjustment",
        "suggestedTempo": "90 sec",
        "action": "Log drink variant, build sequence, sensory notes, Guest Resonance, timing, and next adjustment. Did the guest cross the bridge into serious coffee through delight?",
        "why": "These drinks are learning engines for younger and sensory-led guests.",
        "watch": "Do not lose the chosen variant or guest quote.",
        "advisor": "Connect flavor wheel, graphs, and report trend to future builds.",
        "script": "I am saving which version landed so I can make the next one better."
      }
    ]
  },
  {
    "id": "matcha-bridge",
    "name": "The Matcha Bridge",
    "family": "Modern Sensory Occasions",
    "tag": "Tea bridge",
    "purpose": "For matcha, tea, and caf\u00e9-drink lovers who may not identify as espresso people.",
    "drink": "Iced matcha latte with espresso float or espresso sidecar",
    "drinkChoices": "Iced matcha latte with espresso float; espresso sidecar; shaken matcha espresso",
    "dose": "18g espresso base; 2g matcha typical",
    "yield": "36g espresso; 6\u20138 oz matcha milk base",
    "time": "25\u201332 sec espresso; total build 8\u201312 min",
    "ratioGuidance": "Matcha base should be smooth before espresso enters; float gives layered tasting, sidecar gives guest control.",
    "grindVessel": "clear iced glass + optional sidecar cup",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "curious, round, layered, approachable",
    "artisanOpening": "I made this as a matcha-espresso bridge. The matcha gives it that soft green tea sweetness, and the espresso adds a deeper roasted note underneath. Sip it from the edge first, then stir it once and notice how the flavors become rounder.",
    "firstSipDirection": "Sip from the edge before stirring, then stir once to compare.",
    "guestResonancePrompt": "Did the espresso make it richer, or did you prefer the matcha before stirring?",
    "advisorDirection": "Advisor should help the artisan bridge categories and avoid coffee-snob language.",
    "recoveryWatchouts": "clumpy matcha, bitter espresso, layers mixing too early, too sweet",
    "reportPrompt": "Did matcha become a bridge into coffee?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: matcha, milk/alt milk, espresso, ice, optional light sweetener",
        "Tools: matcha whisk/shaker, espresso tools, glass, sidecar cup, spoon",
        "Cup/glass/vessel: clear iced glass plus optional small espresso sidecar",
        "Garnish or sensory accent: none or light matcha dusting",
        "Machine readiness: machine hot, matcha pre-sifted or smooth, ice ready",
        "Counter/staging area: separate matcha and espresso stations cleanly",
        "Serving path: present sidecar/float clearly",
        "Script readiness: bridge explanation ready"
      ],
      "machineReadiness": [
        "machine hot, matcha pre-sifted or smooth, ice ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "matcha, milk/alt milk, espresso, ice, optional light sweetener",
        "matcha whisk/shaker, espresso tools, glass, sidecar cup, spoon",
        "clear iced glass plus optional small espresso sidecar",
        "none or light matcha dusting"
      ],
      "serviceReadiness": [
        "separate matcha and espresso stations cleanly",
        "present sidecar/float clearly",
        "bridge explanation ready"
      ]
    },
    "steps": [
      {
        "title": "Set the sensory intention",
        "suggestedTempo": "30 sec",
        "action": "Name the purpose of The Matcha Bridge: For matcha, tea, and caf\u00e9-drink lovers who may not identify as espresso people.",
        "why": "Next-Gen drinks need a clear reason or they can feel gimmicky.",
        "watch": "Avoid novelty without intention.",
        "advisor": "Advisor should help the artisan bridge categories and avoid coffee-snob language.",
        "script": "I made this as a matcha-espresso bridge. The matcha gives it that soft green tea sweetness, and the espresso adds a deeper roasted note underneath. Sip it from the edge first, then stir it once and notice how the flavors become rounder."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage all cold/sensory ingredients, tools, vessel, garnish, machine readiness, serving path, and script before brewing.",
        "why": "Cold and layered drinks punish missing pieces because ice, foam, and sparkle change quickly.",
        "watch": "Do not start espresso until glass, ice, and accent are ready.",
        "advisor": "Preparation begins with Mise en Place; stage the sensory elements first.",
        "script": "Everything is staged so the drink can be built cleanly."
      },
      {
        "title": "Confirm drink choice and build formula",
        "suggestedTempo": "60 sec",
        "action": "Select one build from: Iced matcha latte with espresso float; espresso sidecar; shaken matcha espresso. Use this guidance: Matcha base should be smooth before espresso enters; float gives layered tasting, sidecar gives guest control.",
        "why": "The Advisor needs selected drink choice, not just the Occasion name.",
        "watch": "Do not assume the default if the artisan chooses a variant.",
        "advisor": "Feed selected drink, dose/yield, and build method into Advisor context.",
        "script": "I am choosing this build because it fits The Matcha Bridge."
      },
      {
        "title": "Prepare base and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Prepare the vessel: clear iced glass + optional sidecar cup. Confirm machine and coffee base. Use 18g espresso base; 2g matcha typical toward 36g espresso; 6\u20138 oz matcha milk base where espresso is involved.",
        "why": "Temperature, vessel, and sequence shape perception.",
        "watch": "Warm espresso in warm glass can melt ice too fast; cold glass protects texture.",
        "advisor": "Coach sequence and readiness before taste correction.",
        "script": "I am preparing the base so the first sip has the right structure."
      },
      {
        "title": "Build the sensory structure",
        "suggestedTempo": "2\u20133 min",
        "action": "Build the drink deliberately: preserve layers, texture, temperature contrast, and aroma for Iced matcha latte with espresso float or espresso sidecar.",
        "why": "The drink experience comes from sequence, not ingredients alone.",
        "watch": "Stirring too early, over-sweetening, or losing foam/sparkle weakens the Occasion.",
        "advisor": "Explain each build action in practical terms if asked.",
        "script": "I am building the layers so the guest can experience the drink in order."
      },
      {
        "title": "Serve with Artisan Stagecraft Script",
        "suggestedTempo": "30 sec",
        "action": "Use the script exactly enough to guide curiosity, then stop talking.",
        "why": "Gen Z/Next-Gen guests often want an experience but not a lecture.",
        "watch": "Too much explanation can reduce delight.",
        "advisor": "Advisor should make the script short, social, and sensory.",
        "script": "I made this as a matcha-espresso bridge. The matcha gives it that soft green tea sweetness, and the espresso adds a deeper roasted note underneath. Sip it from the edge first, then stir it once and notice how the flavors become rounder."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Sip from the edge before stirring, then stir once to compare.",
        "why": "First sip direction prevents the guest from collapsing the drink too early.",
        "watch": "If they stir first, the intended contrast may disappear.",
        "advisor": "Coach the guest gently; do not control them.",
        "script": "Sip from the edge before stirring, then stir once to compare."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the espresso make it richer, or did you prefer the matcha before stirring?",
        "why": "Guest Resonance tells whether the drink crossed from interesting to delightful.",
        "watch": "Capture their words, not your hope.",
        "advisor": "Use reaction, first thing noticed, quote, and serve-again choice.",
        "script": "Did the espresso make it richer, or did you prefer the matcha before stirring?"
      },
      {
        "title": "Doma Report and next adjustment",
        "suggestedTempo": "90 sec",
        "action": "Log drink variant, build sequence, sensory notes, Guest Resonance, timing, and next adjustment. Did matcha become a bridge into coffee?",
        "why": "These drinks are learning engines for younger and sensory-led guests.",
        "watch": "Do not lose the chosen variant or guest quote.",
        "advisor": "Connect flavor wheel, graphs, and report trend to future builds.",
        "script": "I am saving which version landed so I can make the next one better."
      }
    ]
  },
  {
    "id": "cold-foam-treat",
    "name": "The Cold Foam Little Treat",
    "family": "Modern Sensory Occasions",
    "tag": "Texture",
    "purpose": "A small indulgence with texture without becoming a sugar bomb.",
    "drink": "Iced latte or cold brew with lightly flavored cold foam",
    "drinkChoices": "Iced latte; cold brew with cold foam; espresso over milk with foam cap",
    "dose": "18g espresso base or 4\u20136 oz cold brew",
    "yield": "36g espresso or cold brew base",
    "time": "25\u201332 sec espresso; total build 7\u201310 min",
    "ratioGuidance": "Build coffee base first, foam separately, then cap lightly so first sip passes through texture.",
    "grindVessel": "clear iced glass",
    "suggestedTempo": "7\u201310 minutes",
    "desiredFeeling": "soft, creamy, restrained, delightful",
    "artisanOpening": "I made this one with a cold foam top so the first sip feels soft before the coffee opens up. You should get creaminess first, then sweetness, then the coffee underneath. Try it without the straw first.",
    "firstSipDirection": "Sip without straw first through the foam.",
    "guestResonancePrompt": "Did the texture change how you experienced the coffee?",
    "advisorDirection": "Advisor should control sweetness and make texture the star, not sugar.",
    "recoveryWatchouts": "foam collapsing, too sweet, coffee hidden, watery base",
    "reportPrompt": "Did texture create delight without heaviness?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: espresso/cold brew, milk/cream or alt milk, ice, tiny flavor accent",
        "Tools: frother/shaker, espresso tools, glass, spoon, towel",
        "Cup/glass/vessel: clear iced glass",
        "Garnish or sensory accent: light vanilla/citrus/cocoa accent only if restrained",
        "Machine readiness: machine ready or cold brew measured; foam tool ready",
        "Counter/staging area: cold ingredients staged and glass ready",
        "Serving path: serve immediately while foam sits on top",
        "Script readiness: texture-first script ready"
      ],
      "machineReadiness": [
        "machine ready or cold brew measured; foam tool ready",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "espresso/cold brew, milk/cream or alt milk, ice, tiny flavor accent",
        "frother/shaker, espresso tools, glass, spoon, towel",
        "clear iced glass",
        "light vanilla/citrus/cocoa accent only if restrained"
      ],
      "serviceReadiness": [
        "cold ingredients staged and glass ready",
        "serve immediately while foam sits on top",
        "texture-first script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the sensory intention",
        "suggestedTempo": "30 sec",
        "action": "Name the purpose of The Cold Foam Little Treat: A small indulgence with texture without becoming a sugar bomb.",
        "why": "Next-Gen drinks need a clear reason or they can feel gimmicky.",
        "watch": "Avoid novelty without intention.",
        "advisor": "Advisor should control sweetness and make texture the star, not sugar.",
        "script": "I made this one with a cold foam top so the first sip feels soft before the coffee opens up. You should get creaminess first, then sweetness, then the coffee underneath. Try it without the straw first."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage all cold/sensory ingredients, tools, vessel, garnish, machine readiness, serving path, and script before brewing.",
        "why": "Cold and layered drinks punish missing pieces because ice, foam, and sparkle change quickly.",
        "watch": "Do not start espresso until glass, ice, and accent are ready.",
        "advisor": "Preparation begins with Mise en Place; stage the sensory elements first.",
        "script": "Everything is staged so the drink can be built cleanly."
      },
      {
        "title": "Confirm drink choice and build formula",
        "suggestedTempo": "60 sec",
        "action": "Select one build from: Iced latte; cold brew with cold foam; espresso over milk with foam cap. Use this guidance: Build coffee base first, foam separately, then cap lightly so first sip passes through texture.",
        "why": "The Advisor needs selected drink choice, not just the Occasion name.",
        "watch": "Do not assume the default if the artisan chooses a variant.",
        "advisor": "Feed selected drink, dose/yield, and build method into Advisor context.",
        "script": "I am choosing this build because it fits The Cold Foam Little Treat."
      },
      {
        "title": "Prepare base and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Prepare the vessel: clear iced glass. Confirm machine and coffee base. Use 18g espresso base or 4\u20136 oz cold brew toward 36g espresso or cold brew base where espresso is involved.",
        "why": "Temperature, vessel, and sequence shape perception.",
        "watch": "Warm espresso in warm glass can melt ice too fast; cold glass protects texture.",
        "advisor": "Coach sequence and readiness before taste correction.",
        "script": "I am preparing the base so the first sip has the right structure."
      },
      {
        "title": "Build the sensory structure",
        "suggestedTempo": "2\u20133 min",
        "action": "Build the drink deliberately: preserve layers, texture, temperature contrast, and aroma for Iced latte or cold brew with lightly flavored cold foam.",
        "why": "The drink experience comes from sequence, not ingredients alone.",
        "watch": "Stirring too early, over-sweetening, or losing foam/sparkle weakens the Occasion.",
        "advisor": "Explain each build action in practical terms if asked.",
        "script": "I am building the layers so the guest can experience the drink in order."
      },
      {
        "title": "Serve with Artisan Stagecraft Script",
        "suggestedTempo": "30 sec",
        "action": "Use the script exactly enough to guide curiosity, then stop talking.",
        "why": "Gen Z/Next-Gen guests often want an experience but not a lecture.",
        "watch": "Too much explanation can reduce delight.",
        "advisor": "Advisor should make the script short, social, and sensory.",
        "script": "I made this one with a cold foam top so the first sip feels soft before the coffee opens up. You should get creaminess first, then sweetness, then the coffee underneath. Try it without the straw first."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Sip without straw first through the foam.",
        "why": "First sip direction prevents the guest from collapsing the drink too early.",
        "watch": "If they stir first, the intended contrast may disappear.",
        "advisor": "Coach the guest gently; do not control them.",
        "script": "Sip without straw first through the foam."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Did the texture change how you experienced the coffee?",
        "why": "Guest Resonance tells whether the drink crossed from interesting to delightful.",
        "watch": "Capture their words, not your hope.",
        "advisor": "Use reaction, first thing noticed, quote, and serve-again choice.",
        "script": "Did the texture change how you experienced the coffee?"
      },
      {
        "title": "Doma Report and next adjustment",
        "suggestedTempo": "90 sec",
        "action": "Log drink variant, build sequence, sensory notes, Guest Resonance, timing, and next adjustment. Did texture create delight without heaviness?",
        "why": "These drinks are learning engines for younger and sensory-led guests.",
        "watch": "Do not lose the chosen variant or guest quote.",
        "advisor": "Connect flavor wheel, graphs, and report trend to future builds.",
        "script": "I am saving which version landed so I can make the next one better."
      }
    ]
  },
  {
    "id": "zero-proof-social",
    "name": "The Zero-Proof Coffee Social",
    "family": "Modern Sensory Occasions",
    "tag": "Zero-proof",
    "purpose": "Evening gathering, party, sober-curious moment, or social alternative to alcohol.",
    "drink": "Coffee mocktail, espresso tonic, or cold brew spritz",
    "drinkChoices": "Espresso tonic; cold brew spritz; coffee mocktail",
    "dose": "18g espresso or 2\u20133 oz cold brew concentrate",
    "yield": "36g espresso or 3\u20134 oz coffee base",
    "time": "25\u201332 sec espresso; total build 8\u201312 min",
    "ratioGuidance": "Treat it like a zero-proof cocktail: glass, ice, sparkling lift, coffee base, garnish, first sip before stirring.",
    "grindVessel": "rocks glass, highball, or coupe",
    "suggestedTempo": "8\u201312 minutes",
    "desiredFeeling": "social, bright, elevated, adult, alcohol-free",
    "artisanOpening": "I made this like a zero-proof coffee cocktail \u2014 sparkling, bright, and meant to feel social without being heavy. Take the first sip before stirring so you get the lift on top.",
    "firstSipDirection": "Take the first sip before stirring so the lift stays on top.",
    "guestResonancePrompt": "Would this work for you instead of a cocktail?",
    "advisorDirection": "Advisor should protect social dignity and adult complexity without alcohol.",
    "recoveryWatchouts": "too bitter, too sweet, flat sparkle, garnish overdone",
    "reportPrompt": "Did the drink function socially, not just taste interesting?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: coffee base, ice, sparkling element, citrus/bitters-style accent if non-alcoholic",
        "Tools: glass, spoon, espresso/cold brew tools, towel",
        "Cup/glass/vessel: rocks glass/highball/coupe",
        "Garnish or sensory accent: citrus peel, herb, berry, or salt rim if intentional",
        "Machine readiness: coffee base ready; glass chilled; carbonation preserved",
        "Counter/staging area: bar-like clean station",
        "Serving path: serve as a social drink, not a science project",
        "Script readiness: zero-proof introduction ready"
      ],
      "machineReadiness": [
        "coffee base ready; glass chilled; carbonation preserved",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "coffee base, ice, sparkling element, citrus/bitters-style accent if non-alcoholic",
        "glass, spoon, espresso/cold brew tools, towel",
        "rocks glass/highball/coupe",
        "citrus peel, herb, berry, or salt rim if intentional"
      ],
      "serviceReadiness": [
        "bar-like clean station",
        "serve as a social drink, not a science project",
        "zero-proof introduction ready"
      ]
    },
    "steps": [
      {
        "title": "Set the zero-proof intention",
        "suggestedTempo": "30 sec",
        "action": "Name that this is a social drink, not a substitute apology for alcohol. It should feel adult, bright, and intentional.",
        "why": "The guest must understand it as a social beverage, not a compromise.",
        "watch": "Avoid childish sweetness or mocktail clutter.",
        "advisor": "Position the drink as hospitality with complexity and lift.",
        "script": "I made this like a zero-proof coffee cocktail \u2014 sparkling, bright, and meant to feel social without being heavy. Take the first sip before stirring so you get the lift on top."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage chilled glass, ice, sparkling element, coffee base, garnish, spoon, towel, and serving path.",
        "why": "Carbonation and temperature fade quickly, so readiness matters.",
        "watch": "Do not pull espresso before the glass and sparkling layer are ready.",
        "advisor": "Preparation begins with Mise en Place; preserve sparkle by staging first.",
        "script": "The glass is ready before the coffee arrives."
      },
      {
        "title": "Prepare glass and garnish first",
        "suggestedTempo": "60 sec",
        "action": "Chill the glass or fill with fresh ice. Cut/twist citrus or set herb/berry accent before adding liquid.",
        "why": "A prepared glass makes the final build calm and polished.",
        "watch": "Warm glass and late garnish flatten the social effect.",
        "advisor": "Coach the artisan to stage like a cocktail bar but speak like a host.",
        "script": "I am setting the glass first so the drink feels intentional."
      },
      {
        "title": "Build the sparkling layer",
        "suggestedTempo": "45 sec",
        "action": "Pour tonic/sparkling water slowly down the side over ice, leaving 1\u20132 inches of headroom for coffee. Do not stir yet.",
        "why": "Slow pouring preserves bubbles and creates a lighter top layer.",
        "watch": "Pouring aggressively kills carbonation and muddies the drink.",
        "advisor": "If the artisan says \u201cbuild the layer,\u201d explain carbonation, headroom, and no early stirring.",
        "script": "I am keeping the sparkle alive before the coffee joins it."
      },
      {
        "title": "Add the coffee element",
        "suggestedTempo": "45 sec",
        "action": "Pour espresso or cold brew gently over the back of a spoon or down the side to create contrast without collapsing the bubbles.",
        "why": "The coffee should enter as a layer or ribbon, not a heavy dump.",
        "watch": "If espresso is very bitter, reduce amount or add a softer coffee base next time.",
        "advisor": "Protect visual contrast and balance; do not overcorrect during service.",
        "script": "I am letting the coffee settle into the sparkling lift."
      },
      {
        "title": "Check balance quickly",
        "suggestedTempo": "30 sec",
        "action": "Smell and, if appropriate, taste with a straw/spoon from the side: bitter, bright, sweet, sparkling, refreshing.",
        "why": "A zero-proof drink needs balance before it gets handed over.",
        "watch": "Too bitter needs softer dilution; too sweet needs citrus/sparkle.",
        "advisor": "Recommend one small balancing move only if needed.",
        "script": "I am checking that it feels social, not heavy."
      },
      {
        "title": "Serve with stagecraft",
        "suggestedTempo": "30 sec",
        "action": "Deliver the drink immediately, before bubbles fade, and say the script.",
        "why": "The service language tells the guest how to receive the drink.",
        "watch": "Do not overexplain extraction; this is a social moment.",
        "advisor": "Keep the Advisor focused on social fit and first sip.",
        "script": "I made this like a zero-proof coffee cocktail \u2014 sparkling, bright, and meant to feel social without being heavy. Take the first sip before stirring so you get the lift on top."
      },
      {
        "title": "First sip and Guest Resonance",
        "suggestedTempo": "60 sec",
        "action": "Take the first sip before stirring so the lift stays on top. Then ask: Would this work for you instead of a cocktail?",
        "why": "The first sip determines whether the guest receives it as coffee, mocktail, or social ritual.",
        "watch": "Do not lead the answer; capture what they actually say.",
        "advisor": "Save the reaction in Guest Resonance and Doma Report.",
        "script": "Tell me whether this feels like it could replace a cocktail for you."
      },
      {
        "title": "Report the social result",
        "suggestedTempo": "90 sec",
        "action": "Save drink choice, coffee base, garnish, guest reaction, flavor notes, tempo, and whether to serve again.",
        "why": "This tells Barista Doma whether the social alternative landed.",
        "watch": "Do not only record taste; record social function.",
        "advisor": "Make the report part of the second coffee brain.",
        "script": "I am saving whether this worked as a social drink, not just a coffee drink."
      }
    ]
  },
  {
    "id": "afternoon-reset",
    "name": "The Afternoon Reset",
    "family": "Modern Sensory Occasions",
    "tag": "Refresh",
    "purpose": "Energy without heaviness for a later-day lift.",
    "drink": "Lighter iced coffee, citrus cold brew, or sparkling coffee refresher",
    "drinkChoices": "Citrus cold brew; iced Americano; sparkling coffee refresher",
    "dose": "18g espresso or 3\u20134 oz cold brew",
    "yield": "36g espresso diluted or cold brew base",
    "time": "espresso 25\u201332 sec; total 6\u20139 min",
    "ratioGuidance": "Use lighter dilution, colder temperature, and citrus/sparkle to avoid heaviness.",
    "grindVessel": "chilled glass",
    "suggestedTempo": "6\u20139 minutes",
    "desiredFeeling": "clean, light, refreshing, energizing",
    "artisanOpening": "I made this as an afternoon reset \u2014 bright, cold, and lighter than a latte. Try it before stirring; the citrus lifts first, then the coffee gives it a clean finish.",
    "firstSipDirection": "Sip before stirring to catch citrus lift.",
    "guestResonancePrompt": "Does this feel more refreshing or more energizing?",
    "advisorDirection": "Advisor should keep the cup light and avoid pushing milk-heavy builds unless requested.",
    "recoveryWatchouts": "too watery, too sour, not cold enough, too much caffeine",
    "reportPrompt": "Did the drink reset energy without heaviness?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: coffee base, ice, citrus, optional sparkling water",
        "Tools: glass, spoon, espresso/cold brew tools, towel",
        "Cup/glass/vessel: chilled glass",
        "Garnish or sensory accent: citrus peel/wheel",
        "Machine readiness: machine/cold brew ready; glass chilled",
        "Counter/staging area: quick clean cold-drink station",
        "Serving path: serve before dilution weakens cup",
        "Script readiness: afternoon reset line ready"
      ],
      "machineReadiness": [
        "machine/cold brew ready; glass chilled",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "coffee base, ice, citrus, optional sparkling water",
        "glass, spoon, espresso/cold brew tools, towel",
        "chilled glass",
        "citrus peel/wheel"
      ],
      "serviceReadiness": [
        "quick clean cold-drink station",
        "serve before dilution weakens cup",
        "afternoon reset line ready"
      ]
    },
    "steps": [
      {
        "title": "Set the sensory intention",
        "suggestedTempo": "30 sec",
        "action": "Name the purpose of The Afternoon Reset: Energy without heaviness for a later-day lift.",
        "why": "Next-Gen drinks need a clear reason or they can feel gimmicky.",
        "watch": "Avoid novelty without intention.",
        "advisor": "Advisor should keep the cup light and avoid pushing milk-heavy builds unless requested.",
        "script": "I made this as an afternoon reset \u2014 bright, cold, and lighter than a latte. Try it before stirring; the citrus lifts first, then the coffee gives it a clean finish."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage all cold/sensory ingredients, tools, vessel, garnish, machine readiness, serving path, and script before brewing.",
        "why": "Cold and layered drinks punish missing pieces because ice, foam, and sparkle change quickly.",
        "watch": "Do not start espresso until glass, ice, and accent are ready.",
        "advisor": "Preparation begins with Mise en Place; stage the sensory elements first.",
        "script": "Everything is staged so the drink can be built cleanly."
      },
      {
        "title": "Confirm drink choice and build formula",
        "suggestedTempo": "60 sec",
        "action": "Select one build from: Citrus cold brew; iced Americano; sparkling coffee refresher. Use this guidance: Use lighter dilution, colder temperature, and citrus/sparkle to avoid heaviness.",
        "why": "The Advisor needs selected drink choice, not just the Occasion name.",
        "watch": "Do not assume the default if the artisan chooses a variant.",
        "advisor": "Feed selected drink, dose/yield, and build method into Advisor context.",
        "script": "I am choosing this build because it fits The Afternoon Reset."
      },
      {
        "title": "Prepare base and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Prepare the vessel: chilled glass. Confirm machine and coffee base. Use 18g espresso or 3\u20134 oz cold brew toward 36g espresso diluted or cold brew base where espresso is involved.",
        "why": "Temperature, vessel, and sequence shape perception.",
        "watch": "Warm espresso in warm glass can melt ice too fast; cold glass protects texture.",
        "advisor": "Coach sequence and readiness before taste correction.",
        "script": "I am preparing the base so the first sip has the right structure."
      },
      {
        "title": "Build the sensory structure",
        "suggestedTempo": "2\u20133 min",
        "action": "Build the drink deliberately: preserve layers, texture, temperature contrast, and aroma for Lighter iced coffee, citrus cold brew, or sparkling coffee refresher.",
        "why": "The drink experience comes from sequence, not ingredients alone.",
        "watch": "Stirring too early, over-sweetening, or losing foam/sparkle weakens the Occasion.",
        "advisor": "Explain each build action in practical terms if asked.",
        "script": "I am building the layers so the guest can experience the drink in order."
      },
      {
        "title": "Serve with Artisan Stagecraft Script",
        "suggestedTempo": "30 sec",
        "action": "Use the script exactly enough to guide curiosity, then stop talking.",
        "why": "Gen Z/Next-Gen guests often want an experience but not a lecture.",
        "watch": "Too much explanation can reduce delight.",
        "advisor": "Advisor should make the script short, social, and sensory.",
        "script": "I made this as an afternoon reset \u2014 bright, cold, and lighter than a latte. Try it before stirring; the citrus lifts first, then the coffee gives it a clean finish."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Sip before stirring to catch citrus lift.",
        "why": "First sip direction prevents the guest from collapsing the drink too early.",
        "watch": "If they stir first, the intended contrast may disappear.",
        "advisor": "Coach the guest gently; do not control them.",
        "script": "Sip before stirring to catch citrus lift."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Does this feel more refreshing or more energizing?",
        "why": "Guest Resonance tells whether the drink crossed from interesting to delightful.",
        "watch": "Capture their words, not your hope.",
        "advisor": "Use reaction, first thing noticed, quote, and serve-again choice.",
        "script": "Does this feel more refreshing or more energizing?"
      },
      {
        "title": "Doma Report and next adjustment",
        "suggestedTempo": "90 sec",
        "action": "Log drink variant, build sequence, sensory notes, Guest Resonance, timing, and next adjustment. Did the drink reset energy without heaviness?",
        "why": "These drinks are learning engines for younger and sensory-led guests.",
        "watch": "Do not lose the chosen variant or guest quote.",
        "advisor": "Connect flavor wheel, graphs, and report trend to future builds.",
        "script": "I am saving which version landed so I can make the next one better."
      }
    ]
  },
  {
    "id": "flavor-layer-flight",
    "name": "The Flavor Layer Flight",
    "family": "Modern Sensory Occasions",
    "tag": "Group tasting",
    "purpose": "Three mini drinks from one coffee: creamy, sparkling, and soft/sweet.",
    "drink": "Three mini drinks from one coffee \u2014 creamy, sparkling, soft/sweet",
    "drinkChoices": "Mini creamy; mini sparkling; mini soft/sweet",
    "dose": "18g espresso split or brewed concentrate",
    "yield": "36g espresso split across three minis",
    "time": "25\u201332 sec espresso; total 12\u201316 min",
    "ratioGuidance": "One coffee becomes three expressions; keep pours small and sequence left-to-right.",
    "grindVessel": "three small glasses",
    "suggestedTempo": "12\u201316 minutes",
    "desiredFeeling": "playful, comparative, personal, surprising",
    "artisanOpening": "I made three small versions from the same coffee. One is creamy, one is sparkling, and one is soft and sweet on top. Taste them left to right and tell me which one feels most like you.",
    "firstSipDirection": "Taste left to right before choosing a favorite.",
    "guestResonancePrompt": "Which one felt most like you \u2014 refreshing, comforting, surprising, or most personal?",
    "advisorDirection": "Advisor should guide comparison and guest identity, not technical cupping jargon.",
    "recoveryWatchouts": "uneven portions, confusing order, too many explanations, weak coffee base",
    "reportPrompt": "Which layer taught us most about the guest?",
    "machineContextNeeded": [
      "machine",
      "grinder",
      "beans",
      "basket",
      "houseDose",
      "houseYield",
      "houseShotTime",
      "milk capability",
      "selected drink",
      "guest/time pressure"
    ],
    "preparation": {
      "miseEnPlace": [
        "Ingredients: coffee base, milk/foam, sparkling element, soft sweet accent, ice if needed",
        "Tools: three glasses, labels, spoon, espresso/cold brew tools, towel",
        "Cup/glass/vessel: three matching mini glasses",
        "Garnish or sensory accent: small labels or garnish differences",
        "Machine readiness: machine ready, coffee base strong enough to split",
        "Counter/staging area: left-to-right station setup",
        "Serving path: serve as a flight with simple sequence",
        "Script readiness: flight instruction script ready"
      ],
      "machineReadiness": [
        "machine ready, coffee base strong enough to split",
        "Confirm water level, heat, basket, portafilter lock-in, and grinder readiness before beginning.",
        "Use the Machine Passport and House Formula so the Advisor has context."
      ],
      "drinkBuildReadiness": [
        "coffee base, milk/foam, sparkling element, soft sweet accent, ice if needed",
        "three glasses, labels, spoon, espresso/cold brew tools, towel",
        "three matching mini glasses",
        "small labels or garnish differences"
      ],
      "serviceReadiness": [
        "left-to-right station setup",
        "serve as a flight with simple sequence",
        "flight instruction script ready"
      ]
    },
    "steps": [
      {
        "title": "Set the sensory intention",
        "suggestedTempo": "30 sec",
        "action": "Name the purpose of The Flavor Layer Flight: Three mini drinks from one coffee: creamy, sparkling, and soft/sweet.",
        "why": "Next-Gen drinks need a clear reason or they can feel gimmicky.",
        "watch": "Avoid novelty without intention.",
        "advisor": "Advisor should guide comparison and guest identity, not technical cupping jargon.",
        "script": "I made three small versions from the same coffee. One is creamy, one is sparkling, and one is soft and sweet on top. Taste them left to right and tell me which one feels most like you."
      },
      {
        "title": "Home Coffee Mise en Place",
        "suggestedTempo": "90 sec",
        "action": "Stage all cold/sensory ingredients, tools, vessel, garnish, machine readiness, serving path, and script before brewing.",
        "why": "Cold and layered drinks punish missing pieces because ice, foam, and sparkle change quickly.",
        "watch": "Do not start espresso until glass, ice, and accent are ready.",
        "advisor": "Preparation begins with Mise en Place; stage the sensory elements first.",
        "script": "Everything is staged so the drink can be built cleanly."
      },
      {
        "title": "Confirm drink choice and build formula",
        "suggestedTempo": "60 sec",
        "action": "Select one build from: Mini creamy; mini sparkling; mini soft/sweet. Use this guidance: One coffee becomes three expressions; keep pours small and sequence left-to-right.",
        "why": "The Advisor needs selected drink choice, not just the Occasion name.",
        "watch": "Do not assume the default if the artisan chooses a variant.",
        "advisor": "Feed selected drink, dose/yield, and build method into Advisor context.",
        "script": "I am choosing this build because it fits The Flavor Layer Flight."
      },
      {
        "title": "Prepare base and vessel",
        "suggestedTempo": "60\u201390 sec",
        "action": "Prepare the vessel: three small glasses. Confirm machine and coffee base. Use 18g espresso split or brewed concentrate toward 36g espresso split across three minis where espresso is involved.",
        "why": "Temperature, vessel, and sequence shape perception.",
        "watch": "Warm espresso in warm glass can melt ice too fast; cold glass protects texture.",
        "advisor": "Coach sequence and readiness before taste correction.",
        "script": "I am preparing the base so the first sip has the right structure."
      },
      {
        "title": "Build the sensory structure",
        "suggestedTempo": "2\u20133 min",
        "action": "Build the drink deliberately: preserve layers, texture, temperature contrast, and aroma for Three mini drinks from one coffee \u2014 creamy, sparkling, soft/sweet.",
        "why": "The drink experience comes from sequence, not ingredients alone.",
        "watch": "Stirring too early, over-sweetening, or losing foam/sparkle weakens the Occasion.",
        "advisor": "Explain each build action in practical terms if asked.",
        "script": "I am building the layers so the guest can experience the drink in order."
      },
      {
        "title": "Serve with Artisan Stagecraft Script",
        "suggestedTempo": "30 sec",
        "action": "Use the script exactly enough to guide curiosity, then stop talking.",
        "why": "Gen Z/Next-Gen guests often want an experience but not a lecture.",
        "watch": "Too much explanation can reduce delight.",
        "advisor": "Advisor should make the script short, social, and sensory.",
        "script": "I made three small versions from the same coffee. One is creamy, one is sparkling, and one is soft and sweet on top. Taste them left to right and tell me which one feels most like you."
      },
      {
        "title": "First Sip Direction",
        "suggestedTempo": "20\u201330 sec",
        "action": "Taste left to right before choosing a favorite.",
        "why": "First sip direction prevents the guest from collapsing the drink too early.",
        "watch": "If they stir first, the intended contrast may disappear.",
        "advisor": "Coach the guest gently; do not control them.",
        "script": "Taste left to right before choosing a favorite."
      },
      {
        "title": "Guest Resonance Check",
        "suggestedTempo": "45\u201360 sec",
        "action": "Which one felt most like you \u2014 refreshing, comforting, surprising, or most personal?",
        "why": "Guest Resonance tells whether the drink crossed from interesting to delightful.",
        "watch": "Capture their words, not your hope.",
        "advisor": "Use reaction, first thing noticed, quote, and serve-again choice.",
        "script": "Which one felt most like you \u2014 refreshing, comforting, surprising, or most personal?"
      },
      {
        "title": "Doma Report and next adjustment",
        "suggestedTempo": "90 sec",
        "action": "Log drink variant, build sequence, sensory notes, Guest Resonance, timing, and next adjustment. Which layer taught us most about the guest?",
        "why": "These drinks are learning engines for younger and sensory-led guests.",
        "watch": "Do not lose the chosen variant or guest quote.",
        "advisor": "Connect flavor wheel, graphs, and report trend to future builds.",
        "script": "I am saving which version landed so I can make the next one better."
      }
    ]
  }
];


const coreCertificationOccasions = founderOccasions.filter((item) => item.family === "Core Occasions");
const modernSensoryCertificationOccasions = founderOccasions.filter((item) => item.family === "Modern Sensory Occasions");
const totalOccasionPathwayCount = founderOccasions.length;
const coreCertificationPatchNames = [
  "First Cup Seal", "Quiet Table Patch", "3 PM Reset Mark", "Welcome Home Seal", "Morning Launch Patch",
  "Listening Cup Mark", "Repair Cup Seal", "Celebration Patch", "Guest-Ready Seal", "Lift Cup Mark",
  "Counter Connection Patch", "Parent Visit Seal", "Neighbor Cup Mark", "Sunday Slow Seal", "Founder's Performance Crest"
];
const modernSensoryPatchNames = [
  "First Sip Flex Seal", "Matcha Bridge Patch", "Cold Foam Treat Mark", "Zero-Proof Social Seal", "Afternoon Reset Patch", "Flavor Layer Flight Crest"
];

function slugifyName(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function reportOccasionKey(report = {}) {
  return report.occasionId || report.selectedOccasionId || report.occasionSnapshot?.occasionId || report.occasionSnapshot?.id || slugifyName(report.title || report.occasionSnapshot?.occasionName || "");
}

function buildCertificationProgress(reports = [], telemetryEvents = []) {
  const completedKeys = new Set((reports || []).map(reportOccasionKey).filter(Boolean));
  const completedCore = coreCertificationOccasions.filter((item) => completedKeys.has(item.id) || completedKeys.has(slugifyName(item.name)) || (reports || []).some((r) => String(r.title || "").toLowerCase() === item.name.toLowerCase()));
  const completedModernSensory = modernSensoryCertificationOccasions.filter((item) => completedKeys.has(item.id) || completedKeys.has(slugifyName(item.name)) || (reports || []).some((r) => String(r.title || "").toLowerCase() === item.name.toLowerCase()));
  const completedAll = founderOccasions.filter((item) => completedKeys.has(item.id) || completedKeys.has(slugifyName(item.name)) || (reports || []).some((r) => String(r.title || "").toLowerCase() === item.name.toLowerCase()));
  const corePercent = Math.round((completedCore.length / Math.max(1, coreCertificationOccasions.length)) * 100);
  const modernSensoryPercent = Math.round((completedModernSensory.length / Math.max(1, modernSensoryCertificationOccasions.length)) * 100);
  const fullPercent = Math.round((completedAll.length / Math.max(1, founderOccasions.length)) * 100);
  const reportCountByTitle = (reports || []).reduce((acc, r) => { const title = r.title || r.occasionSnapshot?.occasionName || "Unlabeled Occasion"; acc[title] = (acc[title] || 0) + 1; return acc; }, {});
  const latestCertificationEvent = (telemetryEvents || []).find((e) => /certificate|patch|occasion_completed/.test(e.type || ""));
  return {
    coreTotal: coreCertificationOccasions.length,
    modernSensoryTotal: modernSensoryCertificationOccasions.length,
    allTotal: totalOccasionPathwayCount,
    completedCore,
    completedModernSensory,
    completedAll,
    coreCompleted: completedCore.length,
    modernSensoryCompleted: completedModernSensory.length,
    allCompleted: completedAll.length,
    corePercent,
    modernSensoryPercent,
    fullPercent,
    coreCertificateUnlocked: completedCore.length >= coreCertificationOccasions.length,
    modernSensoryCertificateUnlocked: completedModernSensory.length >= modernSensoryCertificationOccasions.length,
    certificateUnlocked: completedCore.length >= coreCertificationOccasions.length,
    reportsCreated: (reports || []).length,
    reportCountByTitle,
    latestCertificationEvent
  };
}


const recoveryMatrixCatalog = [
  { category:"Espresso Flow & Resistance", issue:"Shot choking / barely dripping", symptoms:"Shot barely drips, pump strains, flow is slow or stops.", likelyCause:"Grind likely too fine, dose too high, puck too compact, basket overloaded, or screen restricted.", advisor:"Stop if needed. Go slightly coarser, confirm dose, distribute evenly, and avoid changing milk or recipe at the same time.", oneNextMove:"Keep the dose steady and move the grind one small step coarser.", stagecraft:"Do not turn the moment into a repair session; make one clean resistance adjustment.", solutionSteps:["Stop the shot if it is not producing usable liquid.","Confirm your dose is not above the basket's comfortable range.","Move the grind one small step coarser.","Distribute evenly, tamp level, and repeat the same yield target.","If serving someone, narrate calmly: 'This one is tight, so I’m giving the coffee a little more room to flow.'"] },
  { category:"Espresso Flow & Resistance", issue:"Shot runs too fast", symptoms:"Shot finishes quickly, watery stream, thin body, pale crema, short contact time.", likelyCause:"Grind likely too coarse, dose too low, stale beans, channeling, or weak puck resistance.", advisor:"Go finer one notch, confirm dose, improve distribution, and repeat the same ratio.", oneNextMove:"Keep the dose steady and move the grind one step finer. Watch for a slower, more syrupy flow before changing anything else.", stagecraft:"Do not let the machine rush your presence. Reset calmly and preserve the occasion.", solutionSteps:["Let the shot finish only if it is useful for tasting; otherwise stop and mark it as fast.","Confirm the dose was not low and the basket was dry before dosing.","Move the grind one small step finer; do not change dose, yield, and grind all at once.","Improve distribution, tamp level, and repeat the same yield target.","Tell the guest: 'This one opened too quickly, so next I’m giving the coffee bed a little more resistance.'"] },
  { category:"Espresso Flow & Resistance", issue:"No flow at all", symptoms:"Pump runs but nothing comes through, or only pressure builds.", likelyCause:"Machine may not be ready, water path blocked, grind far too fine, basket overloaded, or portafilter not seated well.", advisor:"Stop, remove portafilter carefully, clean basket, purge group, reduce resistance, and restart.", oneNextMove:"Stop and safely reset the puck path before pulling again.", stagecraft:"Safety and calm are part of premium service; do not force the machine.", solutionSteps:["Stop the pump and wait for pressure to release.","Remove the portafilter carefully over a towel or drip tray.","Clean the basket and group area; purge briefly.","Dose slightly lower or grind coarser if the puck is clearly too tight.","Restart with a simpler, controlled pull."] },
  { category:"Puck Preparation", issue:"Spraying / channeling", symptoms:"Sprays from bottomless portafilter, uneven streams, sour and bitter at once.", likelyCause:"Puck has cracks, uneven density, poor distribution, clumps, or unlevel tamp.", advisor:"Improve WDT/distribution, tamp level, check basket rim, and watch the first drops.", oneNextMove:"Reset distribution and tamp level before changing grind.", stagecraft:"A clean prep routine restores confidence before the next pull.", solutionSteps:["Dry the basket and dose consistently.","Break clumps and distribute evenly across the basket.","Tamp level with steady pressure.","Watch the first drops for even saturation.","Only change grind after the puck prep is stable."] },
  { category:"Puck Preparation", issue:"Uneven dual spout flow", symptoms:"One spout runs faster, split looks uneven, cup volumes differ.", likelyCause:"Puck distribution, tamp angle, or machine level may be off.", advisor:"Level the basket, distribute again, tamp level, check counter/machine level.", oneNextMove:"Level the prep and machine before changing recipe.", stagecraft:"Balance the instrument before blaming the coffee.", solutionSteps:["Confirm the machine is sitting level.","Distribute grounds evenly before tamping.","Tamp level and wipe the basket rim.","Pull again into two cups and compare.","If it persists, inspect basket and spout cleanliness."] },
  { category:"Taste & Extraction", issue:"Sour taste", symptoms:"Sharp, tart, green, hollow, salty, or underdeveloped flavor.", likelyCause:"Likely under-extracted: fast flow, low temperature, too coarse, too little yield, or very light roast.", advisor:"Extract a little more: finer grind or slightly longer yield. Change one variable.", oneNextMove:"Add extraction through one stable path: usually slightly finer grind or modestly longer yield.", stagecraft:"Correct toward balance without over-optimizing the guest moment.", solutionSteps:["Confirm the shot was not unusually fast.","Choose one change: slightly finer grind or slightly longer yield.","Keep dose steady.","Taste again before making another change.","If serving milk, build warmth and sweetness with texture while tracking the espresso issue."] },
  { category:"Taste & Extraction", issue:"Bitter / harsh taste", symptoms:"Bitter, burnt, dry, ashy, hollow finish, unpleasant late-shot harshness.", likelyCause:"Over-extracted, too fine, too long, too hot, or stale/over-roasted coffee.", advisor:"Try slightly coarser, shorten yield, or lower intensity. Keep dose stable.", oneNextMove:"Shorten the yield slightly before changing the whole recipe.", stagecraft:"Protect comfort; bitterness should not dominate the memory of the cup.", solutionSteps:["Confirm the bitterness is not just roast character.","Shorten the yield slightly or stop the shot earlier.","If the shot is also slow, grind one step coarser.","Keep dose steady.","Serve with milk only if it softens the cup rather than hiding a harsh base."] },
  { category:"Taste & Extraction", issue:"Watery / thin body", symptoms:"Thin, watery, weak, disappears under milk, little sweetness or body.", likelyCause:"Too much yield, stale coffee, fast extraction, weak ratio, or insufficient puck resistance.", advisor:"Tighten ratio, confirm dose, use fresher beans, and target fuller extraction.", oneNextMove:"Keep dose steady, slow the flow, and avoid increasing dilution.", stagecraft:"A cappuccino can still carry warmth when the milk is polished and the service is calm.", solutionSteps:["Confirm the dose and yield were accurate.","If the shot ran fast, grind one step finer.","Avoid adding extra water or milk to an already weak base.","Polish milk for texture if serving immediately.","Log bean age and flow time in the report."] },
  { category:"Taste & Extraction", issue:"Dry / astringent finish", symptoms:"Mouth-drying, harsh finish, chalky or papery aftertaste.", likelyCause:"Over-extraction, channeling, too much contact time, or roast issue.", advisor:"Improve puck prep first, then shorten yield or reduce extraction intensity.", oneNextMove:"Improve puck prep first, then shorten yield if dryness remains.", stagecraft:"A dry finish steals delight; soften the ending of the cup.", solutionSteps:["Check for channeling or uneven flow.","Improve distribution and tamp level.","Shorten yield slightly.","If still dry, consider coarser grind or lower temperature if available.","Serve with a note of warmth, not apology."] },
  { category:"Crema & Visuals", issue:"Crema disappears quickly", symptoms:"Crema fades quickly, cup looks flat, aroma muted.", likelyCause:"Beans may be old, roast may be light, or extraction may be weak.", advisor:"Check roast date, grind finer if fast, and focus on aroma and body.", oneNextMove:"Use freshness and flow as the first checks before chasing crema alone.", stagecraft:"Crema is visual, but delight is sensory and relational.", solutionSteps:["Check roast date and storage.","Confirm shot did not run fast.","Use a warmed cup.","Taste before judging the cup by appearance alone.","Record whether the cup still served the occasion."] },
  { category:"Puck Preparation", issue:"Puck sticks to screen", symptoms:"Puck sticks to group head, messy knock-out, basket looks overfilled.", likelyCause:"Overfilled basket, wet puck, pressure release behavior, or headspace issue.", advisor:"Reduce dose slightly, clean screen, and do not judge the cup by puck alone.", oneNextMove:"Check headspace and dose fit before assuming taste failed.", stagecraft:"Clean recovery protects confidence and flow.", solutionSteps:["Reduce dose slightly if the basket is visibly overfilled.","Purge and wipe the group screen.","Inspect basket size and puck clearance.","Taste the cup before blaming the puck.","Log it if it repeats."] },
  { category:"Puck Preparation", issue:"Messy soupy puck", symptoms:"Wet, soupy, fractured puck; hard to knock out cleanly.", likelyCause:"Can be normal depending on machine, basket, pressure release, and headspace.", advisor:"Check dose/headspace, but prioritize flow, taste, and repeatability.", oneNextMove:"Read the cup first, then the puck.", stagecraft:"Do not let messiness steal the occasion.", solutionSteps:["Do not panic over one wet puck.","Check whether the dose fits the basket.","Confirm flow and taste were acceptable.","Clean the basket and repeat calmly.","Only adjust if the issue repeats with poor taste."] },
  { category:"Machine & Hardware", issue:"Portafilter leaks", symptoms:"Water leaks around portafilter, messy rim, pressure loss.", likelyCause:"Dirty gasket, basket rim issue, not locked in, or worn group seal.", advisor:"Clean rim/gasket, lock firmly, inspect seal, and avoid overfilling.", oneNextMove:"Clean the rim and gasket before changing coffee variables.", stagecraft:"A clean seal is part of readiness.", solutionSteps:["Remove and clean the portafilter rim.","Wipe the group gasket.","Check basket is seated properly.","Lock in firmly without forcing.","If leaking continues, inspect gasket condition."] },
  { category:"Beans, Grinder & Water", issue:"Grinder clumping", symptoms:"Clumps in grounds, uneven bed, sudden channeling or spraying.", likelyCause:"Static, fine grind, oily beans, grinder retention, humidity.", advisor:"Use gentle WDT/distribution, clean grinder path, and dose consistently.", oneNextMove:"Break clumps and distribute before changing grind.", stagecraft:"Treat distribution as preparation for a smoother performance.", solutionSteps:["Dose consistently.","Use WDT or gentle distribution.","Tap or settle the bed carefully.","Clean grinder chute if clumping repeats.","Track bean type and humidity if relevant."] },
  { category:"Beans, Grinder & Water", issue:"Grind setting confusion", symptoms:"Lost setting, uncertain adjustment direction, repeated changes.", likelyCause:"Setting not recorded, stepped grinder limits, user anxiety, or changing beans.", advisor:"Make one small adjustment, write it down, and watch flow speed up or slow down.", oneNextMove:"Record the current setting, then make one measured change.", stagecraft:"Confidence comes from traceable movement, not frantic turning.", solutionSteps:["Write down the current setting.","Decide if the shot needs more or less resistance.","Fast shot: finer. Choked shot: coarser.","Change one notch only.","Record the result in the Doma Report."] },
  { category:"Beans, Grinder & Water", issue:"Beans too oily", symptoms:"Beans stick, grinder retention, bitter/heavy cup, messier workflow.", likelyCause:"Darker roast oils can clog grinders and influence extraction.", advisor:"Use fresher medium roast for learning; clean grinder more often.", oneNextMove:"Clean grinder path and consider a less oily bean for calibration.", stagecraft:"Use beans that help the artisan learn the machine, not fight it.", solutionSteps:["Inspect grinder chute for buildup.","Clean according to manufacturer guidance.","Use a cleaner medium roast when dialing fundamentals.","Avoid changing multiple recipe variables at once.","Log bean type in report."] },
  { category:"Beans, Grinder & Water", issue:"Beans too fresh", symptoms:"Foamy unstable crema, gassy flow, unpredictable extraction.", likelyCause:"Espresso beans can need rest after roast depending on roast and process.", advisor:"Let beans rest longer or expect variability; log roast date.", oneNextMove:"Rest the beans or treat the next pulls as calibration.", stagecraft:"Freshness is alive; respond with patience.", solutionSteps:["Check roast date.","If beans are very fresh, expect gas and variability.","Let beans rest if practical.","Dial with small steps only.","Record rest age in report."] },
  { category:"Machine Readiness", issue:"Machine not warmed up", symptoms:"Sourness, inconsistent first shot, weak steam, cold cups.", likelyCause:"Temperature instability, cold group, cold portafilter, or unheated cup.", advisor:"Warm machine and portafilter, flush briefly, and start again.", oneNextMove:"Pause for readiness before judging the shot.", stagecraft:"The instrument must be awake before it can perform.", solutionSteps:["Warm the machine fully.","Lock in and warm the portafilter.","Flush briefly as appropriate.","Pre-warm the cup.","Then pull the shot and judge taste."] },
  { category:"Machine Readiness", issue:"Forgot to purge", symptoms:"Sputter, stale water, odd first flow, workflow feels rushed.", likelyCause:"Old water/grounds can affect temperature and taste.", advisor:"Purge, wipe, reset, and narrate recovery calmly.", oneNextMove:"Purge and reset before continuing.", stagecraft:"Recovery is part of stagecraft; guests should feel steadiness.", solutionSteps:["Pause and purge appropriately.","Wipe the steam wand/group as needed.","Reset the counter and continue calmly.","Do not apologize excessively.","Log it as a workflow note if it repeats."] },
  { category:"Tools & Measurement", issue:"Forgot to tare scale", symptoms:"Measurement no longer trustworthy, unclear dose or yield.", likelyCause:"Workflow interruption or rushed setup.", advisor:"Restart measurement if possible. If not, record as observation-only cup.", oneNextMove:"Protect the data by restarting measurement when possible.", stagecraft:"A graceful reset is better than pretending bad data is good data.", solutionSteps:["Stop and tare if possible before dosing/pulling.","If the shot is already in progress, mark it as observation-only.","Do not use the result as a calibration anchor.","Serve if the cup is acceptable.","Log the workflow miss in the report."] },
  { category:"Tools & Measurement", issue:"Scale drift / bad reading", symptoms:"Weight jumps, lag, unstable surface, odd yield reading.", likelyCause:"Water, vibration, low battery, unstable counter, or scale limitations.", advisor:"Dry the scale, stabilize surface, re-tare, and continue if safe.", oneNextMove:"Stabilize the scale before changing recipe.", stagecraft:"Reliable measurement supports calm service.", solutionSteps:["Wipe and dry the scale.","Move to a stable surface.","Re-tare with cup in place.","Replace battery if needed.","Log unreliable measurement if it affects the report."] },
  { category:"Milk & Drink Build", issue:"Milk will not foam", symptoms:"Flat milk, no volume, no texture, weak body.", likelyCause:"Steam tip issue, milk type, milk temperature, or technique.", advisor:"Use cold milk, purge steam wand, place tip correctly, and listen for paper-tear sound.", oneNextMove:"Reset milk temperature and steam tip position.", stagecraft:"Texture is hospitality; give the drink softness.", solutionSteps:["Start with cold milk.","Purge steam wand before steaming.","Place tip just below surface and introduce air early.","Then bury tip slightly to polish.","Stop at appropriate temperature."] },
  { category:"Milk & Drink Build", issue:"Milk too foamy", symptoms:"Large bubbles, dry foam, separated cap, hard to pour.", likelyCause:"Too much air introduced too long or poor whirlpool integration.", advisor:"Add air only early, then submerge tip to texture and polish.", oneNextMove:"Add less air and polish longer.", stagecraft:"Glossy milk makes the cup feel cared for.", solutionSteps:["Introduce air only in the first few seconds.","Submerge tip slightly to create whirlpool.","Swirl and tap pitcher after steaming.","Pour sooner before separation.","Log milk texture if it repeats."] },
  { category:"Milk & Drink Build", issue:"Milk too flat", symptoms:"No microfoam, thin texture, poor latte art control.", likelyCause:"Not enough air or steam pressure issue.", advisor:"Add a little more air early, keep whirlpool, and stop at target temperature.", oneNextMove:"Add controlled air early, then polish.", stagecraft:"A little softness can transform the occasion.", solutionSteps:["Start with cold milk and clean wand.","Introduce a brief paper-tear sound early.","Build a whirlpool to integrate bubbles.","Stop before overheating.","Pour with calm rhythm."] },
  { category:"Milk & Drink Build", issue:"Milk overheated", symptoms:"Scalded taste, thin texture, pitcher too hot to hold.", likelyCause:"Steamed too long or no thermometer/hand cue missed.", advisor:"Stop earlier next time. If too hot, do not present it as perfect; make a smaller recovery drink.", oneNextMove:"Stop earlier and rebuild if the drink matters.", stagecraft:"Overheated milk can flatten delight; protect comfort.", solutionSteps:["Use hand temperature cue or thermometer.","Stop before the pitcher is too hot to touch comfortably.","If severely overheated, remake milk.","If serving under pressure, simplify the drink.","Log temperature learning."] },
  { category:"Milk & Drink Build", issue:"Latte art collapses", symptoms:"Milk sinks, design disappears, pour feels unstable.", likelyCause:"Milk texture too thick/thin, cup angle, pour speed, crema issue.", advisor:"Focus first on glossy paint-like milk, then simple heart, not complex art.", oneNextMove:"Simplify the pour and prioritize texture.", stagecraft:"Beauty comes from confidence, not complexity.", solutionSteps:["Polish milk until glossy.","Use a simple pour shape.","Pour with cup tilted and steady speed.","Accept a simple design for service moments.","Log milk texture and pour timing."] },
  { category:"Temperature & Serving", issue:"Drink too cold", symptoms:"Guest receives lukewarm drink, cup cools quickly.", likelyCause:"Cup/milk not warm, extraction delay, cold room, or machine temperature.", advisor:"Pre-warm cup, serve faster, and check milk temperature.", oneNextMove:"Warm the vessel and shorten the gap between build and service.", stagecraft:"Warmth is part of welcome.", solutionSteps:["Pre-warm the cup.","Prepare mise en place before pulling shot.","Steam milk at the right time.","Serve promptly.","Log if machine temperature seems low."] },
  { category:"Temperature & Serving", issue:"Drink too hot", symptoms:"Burning sip, flavor muted, guest waits too long.", likelyCause:"Milk overheated or cup overheated.", advisor:"Stop steaming earlier, let cup rest briefly before serving.", oneNextMove:"Reduce milk temperature next time.", stagecraft:"Comfort matters more than heat spectacle.", solutionSteps:["Stop steaming earlier.","Use target temperature range.","Let the drink settle briefly if too hot.","Warn guest if needed without making it awkward.","Log steaming cue."] },
  { category:"Water & Maintenance", issue:"Water tank empty / filter issue", symptoms:"Machine cannot perform consistently; pump sounds odd; no water or weak flow.", likelyCause:"Water tank empty, filter blocked, tank not seated, or maintenance overdue.", advisor:"Pause. Confirm water level, filter condition, and restart only when ready.", oneNextMove:"Restore water readiness before pulling again.", stagecraft:"Readiness is respect for the instrument and the guest.", solutionSteps:["Check water level.","Confirm tank is seated.","Inspect filter condition.","Prime or restart per machine instructions.","Do not serve from a struggling machine."] },
  { category:"Water & Maintenance", issue:"Machine asks for cleaning/descale", symptoms:"Warning light, off taste, inconsistent flow, maintenance prompt.", likelyCause:"Maintenance is due and can affect cup quality.", advisor:"Do not ignore. Follow machine prompt and log the maintenance moment.", oneNextMove:"Schedule or perform maintenance before serious service.", stagecraft:"Care for the machine is care for the occasion.", solutionSteps:["Read the machine prompt carefully.","Follow the manufacturer cleaning/descale process.","Flush and test afterward.","Do not use a maintenance-needed machine for an important occasion if avoidable.","Log maintenance date."] },
  { category:"Occasion Pressure", issue:"Guest is waiting / pressure rises", symptoms:"Rushed hands, anxiety, temptation to make many changes.", likelyCause:"The cup problem is now tied to time pressure and social expectation.", advisor:"Narrate calmly: 'I am going to reset this so I serve you the cup I intended.'", oneNextMove:"Choose one stabilizing adjustment only.", stagecraft:"The guest should experience care, not panic.", solutionSteps:["Pause and breathe before touching settings.","Choose one technical move only.","Use simple language to preserve confidence.","Serve a steady cup rather than chasing perfection.","Log what happened after the occasion."] },
  { category:"Occasion Pressure", issue:"Need complete restart", symptoms:"Multiple errors stacked; cup cannot be rescued; room needs calm.", likelyCause:"Too many variables failed at once or the workflow collapsed.", advisor:"Use Reset the Moment: clean, purge, confirm water, reset dose, and make one simpler cup.", oneNextMove:"Reset the station and simplify the drink.", stagecraft:"A graceful restart is premium behavior.", solutionSteps:["Clear the counter.","Purge and wipe machine surfaces.","Confirm water, beans, dose, and cup.","Choose the simplest drink path.","Tell the guest: 'I’m resetting this so the cup lands right.'"] }
];


const flavorWheelGroups = [
  { group: "Fruity", notes: ["berry", "citrus", "stone fruit", "apple", "dried fruit"] },
  { group: "Floral", notes: ["jasmine", "rose", "tea-like", "honey blossom"] },
  { group: "Sweet", notes: ["caramel", "brown sugar", "honey", "vanilla", "maple"] },
  { group: "Nutty / Cocoa", notes: ["almond", "hazelnut", "peanut", "cocoa", "dark chocolate"] },
  { group: "Spice", notes: ["cinnamon", "clove", "pepper", "baking spice"] },
  { group: "Roast", notes: ["toast", "smoke", "roasted", "molasses"] },
  { group: "Earth / Green", notes: ["earthy", "herbal", "grassy", "woody"] },
  { group: "Defects / Warning", notes: ["sour", "bitter", "ashy", "rubbery", "papery"] }
];

const defaultSensoryScores = {
  aroma: 6,
  sweetness: 5,
  acidity: 5,
  body: 5,
  balance: 5,
  finish: 5,
  delight: 6,
  guestResonance: 6,
  occasionTempo: 5,
  recoveryConfidence: 5,
  stagecraft: 6,
  machineConfidence: 6,
  tasteClarity: 5
};

const defaultGuestResonance = {
  score: 3,
  reaction: "delighted",
  firstThingNoticed: "texture",
  quote: "",
  wouldServeAgain: "adjust",
  nextAdjustment: "sweeter"
};

function flatFlavorNotes() {
  return flavorWheelGroups.flatMap((g) => g.notes.map((note) => ({ note, group: g.group })));
}

const advisorStarterText = `The form grounds. The artisan voice clarifies. The Advisor synthesizes. Capture a voice note or load a scenario, then generate an Advisor response.`;

function findOccasionById(id) {
  return founderOccasions.find((item) => item.id === id) || null;
}

function findOccasionByName(name) {
  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  return founderOccasions.find((item) => item.name.toLowerCase() === normalized) || null;
}

export default function Home() {
  const [active, setActive] = useState("home");
  const [selectedOccasionId, setSelectedOccasionId] = useState(founderOccasions[0].id);
  const [walkthroughOccasionId, setWalkthroughOccasionId] = useState(founderOccasions[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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
  const [correctionMode, setCorrectionMode] = useState(false);
  const [respondBusy, setRespondBusy] = useState(false);
  const [advisorBusy, setAdvisorBusy] = useState(false);
  const [reports, setReports] = useState([]);
  const [telemetryEvents, setTelemetryEvents] = useState([]);
  const [selectedFlavorNotes, setSelectedFlavorNotes] = useState(["caramel", "cocoa", "citrus"]);
  const [sensoryScores, setSensoryScores] = useState(defaultSensoryScores);
  const [tastingNote, setTastingNote] = useState("Creamy cappuccino impression with sweetness, body, and a touch of citrus brightness.");
  const [guestResonance, setGuestResonance] = useState(defaultGuestResonance);
  const [uploadAsset, setUploadAsset] = useState({ fileName: "", fileType: "", kind: "", notes: "", previewUrl: "" });
  const [advisorSupportCount, setAdvisorSupportCount] = useState(0);
  const [correctionCount, setCorrectionCount] = useState(0);
  const [recoverySupportCount, setRecoverySupportCount] = useState(0);
  const [stepTimings, setStepTimings] = useState({});
  const [occasionStartTime, setOccasionStartTime] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const advisorAudioRef = useRef(null);
  const handsFreeRecognitionRef = useRef(null);
  const handsFreeEnabledRef = useRef(false);
  const handsFreeCaptureRef = useRef(false);
  const handsFreeBufferRef = useRef("");
  const handsFreeTimerRef = useRef(null);
  const [handsFreeEnabled, setHandsFreeEnabled] = useState(false);
  const [handsFreeCaptureActive, setHandsFreeCaptureActive] = useState(false);
  const [handsFreeStatus, setHandsFreeStatus] = useState("ICY is off. Enable it inside any Occasion step, then say ‘Hey ICY’ or ‘Advisor’ when your hands are wet or occupied.");

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("bd_profile_v7");
      const savedOccasion = localStorage.getItem("bd_occasion_v7");
      const savedReports = localStorage.getItem("bd_reports_v7");
      const savedTelemetry = localStorage.getItem("bd_telemetry_v891");
      const savedFlavors = localStorage.getItem("bd_flavors_v77");
      const savedScores = localStorage.getItem("bd_scores_v77");
      const savedTastingNote = localStorage.getItem("bd_tasting_note_v77");
      const savedGuestResonance = localStorage.getItem("bd_guest_resonance_v78");
      const savedSelectedOccasionId = localStorage.getItem("bd_selected_occasion_v83");
      const savedWalkthroughOccasionId = localStorage.getItem("bd_walkthrough_occasion_v83");
      const parsedOccasion = savedOccasion ? JSON.parse(savedOccasion) : null;
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (parsedOccasion) setOccasion(parsedOccasion);
      const matchedFromOccasion = findOccasionByName(parsedOccasion?.occasionName);
      const initialSelected = (savedSelectedOccasionId && findOccasionById(savedSelectedOccasionId)) ? savedSelectedOccasionId : (matchedFromOccasion?.id || founderOccasions[0].id);
      const initialWalkthrough = (savedWalkthroughOccasionId && findOccasionById(savedWalkthroughOccasionId)) ? savedWalkthroughOccasionId : initialSelected;
      setSelectedOccasionId(initialSelected);
      setWalkthroughOccasionId(initialWalkthrough);
      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedTelemetry) setTelemetryEvents(JSON.parse(savedTelemetry));
      if (savedFlavors) setSelectedFlavorNotes(JSON.parse(savedFlavors));
      if (savedScores) setSensoryScores(JSON.parse(savedScores));
      if (savedTastingNote) setTastingNote(savedTastingNote);
      if (savedGuestResonance) setGuestResonance(JSON.parse(savedGuestResonance));
    } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem("bd_profile_v7", JSON.stringify(profile)); } catch {} }, [profile]);
  useEffect(() => { try { localStorage.setItem("bd_occasion_v7", JSON.stringify(occasion)); } catch {} }, [occasion]);
  useEffect(() => { try { localStorage.setItem("bd_reports_v7", JSON.stringify(reports)); } catch {} }, [reports]);
  useEffect(() => { try { localStorage.setItem("bd_telemetry_v891", JSON.stringify(telemetryEvents)); } catch {} }, [telemetryEvents]);
  useEffect(() => { try { localStorage.setItem("bd_selected_occasion_v83", selectedOccasionId); } catch {} }, [selectedOccasionId]);
  useEffect(() => { try { localStorage.setItem("bd_walkthrough_occasion_v83", walkthroughOccasionId); } catch {} }, [walkthroughOccasionId]);
  useEffect(() => { try { localStorage.setItem("bd_flavors_v77", JSON.stringify(selectedFlavorNotes)); } catch {} }, [selectedFlavorNotes]);
  useEffect(() => { try { localStorage.setItem("bd_scores_v77", JSON.stringify(sensoryScores)); } catch {} }, [sensoryScores]);
  useEffect(() => { try { localStorage.setItem("bd_tasting_note_v77", tastingNote); } catch {} }, [tastingNote]);
  useEffect(() => { handsFreeEnabledRef.current = handsFreeEnabled; }, [handsFreeEnabled]);
  useEffect(() => () => {
    try { handsFreeRecognitionRef.current?.stop?.(); } catch {}
    try { if (handsFreeTimerRef.current) clearTimeout(handsFreeTimerRef.current); } catch {}
  }, []);

  const context = useMemo(() => ({
    machineType: profile.machineType,
    machine: profile.machine,
    espressoMachine: profile.espressoMachine,
    allInOneMachine: profile.allInOneMachine,
    grinder: profile.grinder,
    grinderModel: profile.grinderModel,
    basketSize: profile.basketSize,
    portafilterSize: profile.portafilterSize,
    waterSource: profile.waterSource,
    warmupRoutine: profile.warmupRoutine,
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
    roastLevel: profile.roastLevel,
    targetRatio: profile.targetRatio,
    grinderSetting: profile.grinderSetting,
    experienceLevel: profile.experienceLevel,
    milkStyle: profile.milkStyle,
    advisorGuidanceLevel: profile.advisorGuidanceLevel,
    advisorGuidanceNotes: profile.advisorGuidanceNotes,
    tamper: profile.tamper,
    tamperSize: profile.tamperSize,
    distributionTool: profile.distributionTool,
    wdtTool: profile.wdtTool,
    puckScreen: profile.puckScreen,
    dosingFunnel: profile.dosingFunnel,
    puckPrepWorkflow: profile.puckPrepWorkflow,
    confirmedRecipe: profile.confirmedRecipe,
    lastDialInResult: profile.lastDialInResult,
    dialInAttempts: profile.dialInAttempts || [],
    dialInNotes: profile.dialInNotes,
    advisorSupportCount,
    correctionCount,
    recoverySupportCount,
    momentIntent: occasion.momentIntent,
    uploadedAsset: uploadAsset?.fileName ? { fileName: uploadAsset.fileName, fileType: uploadAsset.fileType, kind: uploadAsset.kind, notes: uploadAsset.notes } : null
  }), [profile, occasion, uploadAsset, advisorSupportCount, correctionCount, recoverySupportCount]);

  const selectedFounderOccasion = useMemo(() => founderOccasions.find((item) => item.id === selectedOccasionId) || founderOccasions[0], [selectedOccasionId]);
  const walkthroughFounderOccasion = useMemo(() => founderOccasions.find((item) => item.id === walkthroughOccasionId) || selectedFounderOccasion || founderOccasions[0], [walkthroughOccasionId, selectedFounderOccasion]);
  const setupMissing = useMemo(() => getSetupMissing(profile, occasion), [profile, occasion]);
  const setupComplete = setupMissing.length === 0;

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }
  function recordTelemetry(type, payload = {}) {
    const event = {
      id: Date.now() + Math.random(),
      type,
      createdAt: new Date().toLocaleString(),
      category: telemetryCategory(type),
      payload
    };
    setTelemetryEvents((prev) => [event, ...(prev || [])].slice(0, 200));
    return event;
  }
  function clearTelemetry() {
    setTelemetryEvents([]);
    log("Cleared local development telemetry.");
  }
  function updateProfile(field, value) { setProfile((prev) => ({ ...prev, [field]: typeof value === "function" ? value(prev[field], prev) : value })); }
  function updateProfilePatch(patch) { setProfile((prev) => ({ ...prev, ...patch })); }
  function updateOccasion(field, value) { setOccasion((prev) => ({ ...prev, [field]: value })); }
  function handleAdvisorUpload(file, kind = "photo/video") {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setUploadAsset((prev) => ({ ...prev, fileName: file.name, fileType: file.type || "unknown", kind, previewUrl }));
    setStatus("Advisor upload attached. Add notes or ask the Advisor to analyze it with the form and voice context.");
    log(`Attached Advisor upload: ${file.name} (${file.type || "unknown"})`);
    recordTelemetry("advisor_upload_attached", { fileName: file.name, fileType: file.type || "unknown", kind });
  }
  function requireSetupThen(nextActive) {
    const missing = getSetupMissing(profile, occasion);
    if (missing.length) {
      setError(`Setup must be completed before starting a live Advisor Session. Missing: ${missing.join(", ")}`);
      setStatus("Setup gate: complete Doma Profile, Machine Passport, House Formula, and Occasion setup first.");
      log(`Setup gate blocked session. Missing: ${missing.join(", ")}`);
      setActive("onboarding");
      return false;
    }
    setError("");
    setActive(nextActive);
    return true;
  }
  function openFounderOccasion(item) {
    setSelectedOccasionId(item.id);
    setWalkthroughOccasionId(item.id);
    try { localStorage.setItem("bd_selected_occasion_v83", item.id); localStorage.setItem("bd_walkthrough_occasion_v83", item.id); } catch {}
    setCurrentStepIndex(0);
    setStepTimings({});
    setOccasionStartTime(Date.now());
    setOccasion((prev) => ({
      ...prev,
      occasionName: item.name,
      drink: item.drink,
      desiredFeeling: item.desiredFeeling,
      momentIntent: item.purpose,
      recurrence: "Selected Occasion: " + item.name,
      currentShotTime: item.time,
      suggestedTempo: item.suggestedTempo || item.time
    }));
    setTranscript(item.artisanOpening || "");
    setActive("walkthrough");
    log(`Opened Occasion: ${item.name}`);
    recordTelemetry("occasion_started", { occasion: item.name, family: item.family, drink: item.drink, suggestedTempo: item.suggestedTempo || item.time });
  }

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

  async function startRecording(mode = "replace") {
    const appendMode = mode === "append";
    const existingTranscript = transcript;
    setAudioUrl(""); chunksRef.current = []; setError(""); setMatrixMatch(null); setSynthesis(null);
    if (!appendMode) setTranscript("");
    setStatus(appendMode ? "Requesting microphone for correction…" : "Requesting microphone…"); log(appendMode ? "Requesting microphone access for correction/additional detail." : "Requesting microphone access.");
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
        const newText = data.text || "";
        const combinedTranscript = appendMode ? `${existingTranscript.trim()}

Correction / added detail: ${newText}`.trim() : newText;
        setTranscript(combinedTranscript);
        const changedFields = applyVoiceTextToFields(newText, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry });
        setCorrectionMode(false);
        setStatus(changedFields.length ? `Voice captured and filled: ${changedFields.join(", ")}.` : (appendMode ? "Correction captured. Re-generate Advisor response." : "Transcription complete. Generate Advisor response next.")); log(`Transcription returned ${String(newText).length} characters${appendMode ? " as correction/additional detail" : ""}. Fields filled: ${changedFields.join(", ") || "none"}.`);
      };
      recorder.start();
    } catch (err) { setRecording(false); setStatus(`Error: ${err.message}`); setError(err.message); log(`Recording failed: ${err.message}`); }
  }
  function stopRecording() {
    try { if (recorderRef.current && recorderRef.current.state !== "inactive") { recorderRef.current.stop(); setStatus("Stopping…"); log("Stop requested."); } }
    catch (err) { setError(err.message); log(`Stop failed: ${err.message}`); }
  }
  function finalizeHandsFreeCapture() {
    const finalText = handsFreeBufferRef.current.trim();
    if (!finalText) {
      handsFreeCaptureRef.current = false;
      setHandsFreeCaptureActive(false);
      setHandsFreeStatus("ICY is listening for the next hands-free note. Say ‘Hey ICY’ or ‘Advisor’ again when you need me.");
      return;
    }
    const changedFields = applyVoiceTextToFields(finalText, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry });
    const fieldPhrase = changedFields.length ? changedFields.join(", ") : "your conversation note";
    setHandsFreeStatus(`Advisor recorded the conversation and placed: ${fieldPhrase}.`);
    setStatus(`Hands-free Advisor recorded and placed: ${fieldPhrase}.`);
    log(`Hands-free Advisor finalized. Fields: ${fieldPhrase}.`);
    recordTelemetry("hands_free_advisor_finalized", { fields: changedFields, transcriptLength: finalText.length });
    speakFastLocal(`I heard you. I placed ${fieldPhrase} in the form. Final note: ${finalText}`, { rate: 0.92 });
    handsFreeBufferRef.current = "";
    handsFreeCaptureRef.current = false;
    setHandsFreeCaptureActive(false);
  }

  function handleHandsFreeText(rawText) {
    const text = String(rawText || "").trim();
    if (!text) return;
    const wakeMatch = /\b(advisor|icy|icey|i\s*c)\b/i.test(text);
    if (wakeMatch && !handsFreeCaptureRef.current) {
      const afterWake = text.replace(/^.*?\b(advisor|icy|icey|i\s*c)\b[,.!?:;\s-]*/i, "").trim();
      setActive("simulator");
      handsFreeCaptureRef.current = true;
      setHandsFreeCaptureActive(true);
      handsFreeBufferRef.current = "";
      setHandsFreeStatus("ICY heard the wake word. Speak naturally; I will record, repeat back, and place details into the right fields.");
      setStatus("ICY is active. Speak naturally.");
      recordTelemetry("hands_free_advisor_wake_word", { source: "speech_recognition" });
      speakFastLocal("I'm here. What are we working on?", { rate: 1.02 });
      if (afterWake) setTimeout(() => handleHandsFreeText(afterWake), 900);
      return;
    }
    if (!handsFreeCaptureRef.current) {
      setHandsFreeStatus("Listening for wake word: say ‘Hey ICY’ or ‘Advisor’ when you need hands-free capture.");
      return;
    }
    const newBuffer = `${handsFreeBufferRef.current} ${text}`.trim();
    handsFreeBufferRef.current = newBuffer;
    setTranscript((prev) => `${prev ? `${prev}\n` : ""}Hands-free Advisor note: ${text}`);
    const changedFields = applyVoiceTextToFields(text, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry });
    setHandsFreeStatus(changedFields.length ? `Captured: ${text} · Placed ${changedFields.join(", ")}.` : `Captured comment: ${text}.`);
    setStatus(changedFields.length ? `Hands-free fields updated: ${changedFields.join(", ")}.` : "Hands-free comment captured.");
    recordTelemetry("hands_free_advisor_capture", { transcript: text, fields: changedFields });
    try { if (handsFreeTimerRef.current) clearTimeout(handsFreeTimerRef.current); } catch {}
    handsFreeTimerRef.current = setTimeout(finalizeHandsFreeCapture, 2600);
  }

  function startHandsFreeAdvisor() {
    setError("");
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) throw new Error("This browser does not expose hands-free speech recognition. Use Chrome on HTTPS for the best hands-free Advisor experience.");
      try { handsFreeRecognitionRef.current?.stop?.(); } catch {}
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onstart = () => {
        setHandsFreeEnabled(true);
        handsFreeEnabledRef.current = true;
        setHandsFreeStatus("ICY is listening. Say ‘Hey ICY’ or ‘Advisor’ when your hands are wet or occupied.");
        setStatus("Hands-free Advisor enabled.");
        log("Hands-free Advisor listening enabled.");
        recordTelemetry("hands_free_advisor_enabled", { mode: "wake_word" });
      };
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) handleHandsFreeText(event.results[i][0]?.transcript || "");
        }
      };
      recognition.onerror = (event) => {
        const message = event?.error ? `Hands-free Advisor recognition issue: ${event.error}` : "Hands-free Advisor recognition issue.";
        setHandsFreeStatus(message);
        log(message);
      };
      recognition.onend = () => {
        if (handsFreeEnabledRef.current) {
          try { recognition.start(); } catch {}
        } else {
          setHandsFreeStatus("Hands-free Advisor is off.");
        }
      };
      handsFreeRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setHandsFreeEnabled(false);
      handsFreeEnabledRef.current = false;
      setHandsFreeStatus(err.message || String(err));
      setError(err.message || String(err));
      log(`Hands-free Advisor failed: ${err.message || String(err)}`);
    }
  }

  function stopHandsFreeAdvisor() {
    handsFreeEnabledRef.current = false;
    setHandsFreeEnabled(false);
    handsFreeCaptureRef.current = false;
    setHandsFreeCaptureActive(false);
    handsFreeBufferRef.current = "";
    try { if (handsFreeTimerRef.current) clearTimeout(handsFreeTimerRef.current); } catch {}
    try { handsFreeRecognitionRef.current?.stop?.(); } catch {}
    setHandsFreeStatus("Hands-free Advisor is off. Enable it again when you want no-hands capture.");
    setStatus("Hands-free Advisor stopped.");
    log("Hands-free Advisor stopped.");
    recordTelemetry("hands_free_advisor_stopped", {});
  }

  function applyTranscriptToForms() {
    const changedFields = applyVoiceTextToFields(transcript, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry });
    if (changedFields.length) {
      setStatus(`Voice note applied to fields: ${changedFields.join(", ")}.`);
      log(`Voice-to-field applied manually: ${changedFields.join(", ")}.`);
    } else {
      setStatus("No dose, yield, time, grind, taste, or Guest Resonance fields were detected in the current transcript.");
    }
  }


  function stopAdvisorVoice() {
    try {
      stopFastLocalSpeech();
      if (advisorAudioRef.current) {
        advisorAudioRef.current.pause();
        advisorAudioRef.current.currentTime = 0;
      }
      setAdvisorAudioUrl("");
      setStatus("Advisor stopped. You can correct or add detail.");
      log("Advisor Voice playback stopped by artisan.");
    } catch (err) { log(`Stop Advisor failed: ${err.message}`); }
  }

  function beginCorrection() {
    stopAdvisorVoice();
    setCorrectionCount((count) => count + 1);
    setCorrectionMode(true);
    setStatus("Correction mode: speak what the Advisor misunderstood.");
    log("Correction mode started. Artisan can add a spoken correction.");
    setActive("simulator");
  }

  async function generateAdvisorResponse() {
    const missing = getSetupMissing(profile, occasion);
    if (missing.length) {
      setError(`Before the Advisor responds, complete the required setup: ${missing.join(", ")}`);
      setStatus("Advisor paused until setup is complete.");
      log(`Advisor setup gate blocked response. Missing: ${missing.join(", ")}`);
      setActive("onboarding");
      return;
    }
    setError(""); setRespondBusy(true); setAdvisorAudioUrl(""); setAdvisorSupportCount((count) => count + 1); setStatus("Assessing Matrix + generating Advisor response…"); log("Sending form + voice to /api/respond.");
    recordTelemetry("advisor_requested", { occasion: occasion.occasionName, helpMode: correctionMode ? "correction" : (matrixMatch ? "recovery" : "open_advisor"), transcriptLength: String(transcript || "").length, machine: profile.machine, houseFormula: `${profile.houseDose || "?"} → ${profile.houseYield || "?"}` });
    try {
      const response = await fetch("/api/respond", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcript, context }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error([data?.error, data?.detail].filter(Boolean).join("\n") || `Advisor response failed with HTTP ${response.status}`);
      setAdvisorText(data.advisorText || ""); setMatrixMatch(data.matrixMatch || null); setSynthesis(data.synthesis || null);
      setStatus("Advisor response ready. Generate Advisor Voice or create Doma Report.");
      log(`Advisor response returned ${String(data.advisorText || "").length} chars. Intent: ${data.synthesis?.detectedArtisanIntent || "unknown"}.`);
      recordTelemetry("advisor_response_ready", { intent: data.synthesis?.detectedArtisanIntent || "unknown", matrixApplied: Boolean(data.matrixMatch), matrixLabel: data.matrixMatch?.label || data.matrixMatch?.issue || "", responseLength: String(data.advisorText || "").length });
      setActive("simulator");
    } catch (err) { setStatus("Advisor response failed"); setError(err.message || String(err)); log(`Advisor response failed: ${err.message || String(err)}`); }
    finally { setRespondBusy(false); }
  }

  async function generateAdvisorVoice() {
    setError(""); setAdvisorBusy(true); setAdvisorAudioUrl(""); setStatus("Starting fast Advisor voice…"); log("Using fast browser speech for immediate Advisor voice.");
    try {
      const started = speakFastLocal(advisorText, { rate: 1.02, onEnd: () => setStatus("Advisor voice finished.") });
      if (!started) throw new Error("This browser did not expose local speech synthesis.");
      setAdvisorAudioUrl("__local_voice__");
      setStatus("Advisor voice speaking now.");
      recordTelemetry("advisor_voice_generated", { voice: advisorVoice, mode: "fast_browser_speech", responseLength: String(advisorText || "").length });
    } catch (err) { setStatus("Advisor Voice failed"); setError(err.message || String(err)); log(`Advisor Voice failed: ${err.message || String(err)}`); }
    finally { setAdvisorBusy(false); }
  }

  function loadClearFastShot() {
    setProfile(defaultProfile); setOccasion(defaultOccasion);
    setTranscript("Good morning, Advisor. I need help with my family this morning. The shot ran too fast and tasted thin, and I do not want to ruin the moment before church.");
    setStatus("Sample Occasion loaded."); log("Loaded integrated sample Occasion."); recordTelemetry("sample_advisor_flow_loaded", { occasion: defaultOccasion.occasionName, drink: defaultOccasion.drink }); setActive("simulator");
  }
  function createReport() {
    const timingMetrics = buildTimingMetrics(selectedFounderOccasion, stepTimings, occasionStartTime);
    const priorReport = reports[0] || null;
    const fluency = buildFluencyAssessment({ profile, selectedFounderOccasion, stepTimings, advisorSupportCount, correctionCount, recoverySupportCount: recoverySupportCount + (matrixMatch ? 1 : 0), guestResonance, sensoryScores, timingMetrics });
    const dialInReadiness = buildDialInReadiness(profile);
    const report = {
      id: Date.now(), createdAt: new Date().toLocaleString(), title: occasion.occasionName || "Home Coffee Occasion",
      occasionId: selectedFounderOccasion?.id || slugifyName(occasion.occasionName || "Home Coffee Occasion"),
      occasionFamily: selectedFounderOccasion?.family || "Custom Occasion",
      certificationEligible: selectedFounderOccasion?.family === "Core Occasions",
      drink: occasion.drink, guest: occasion.guest, transcript, advisorText,
      synthesis, matrixMatch, context, selectedFlavorNotes, sensoryScores, tastingNote, guestResonance, stepTimings, timingMetrics, uploadAsset: uploadAsset?.fileName ? { ...uploadAsset, previewUrl: "" } : null,
      fluency, dialInReadiness,
      supportCounts: { advisorSupportCount, correctionCount, recoverySupportCount: recoverySupportCount + (matrixMatch ? 1 : 0) },
      profileSnapshot: { ...profile },
      occasionSnapshot: { ...occasion },
      machineInfo: { machineType: profile.machineType, machine: profile.machine, espressoMachine: profile.espressoMachine, allInOneMachine: profile.allInOneMachine, grinder: profile.grinder, grinderModel: profile.grinderModel, beans: profile.beans, roastLevel: profile.roastLevel, basketSize: profile.basketSize, portafilterSize: profile.portafilterSize, waterSource: profile.waterSource, warmupRoutine: profile.warmupRoutine, experienceLevel: profile.experienceLevel, advisorGuidanceLevel: profile.advisorGuidanceLevel, tamper: profile.tamper, distributionTool: profile.distributionTool, wdtTool: profile.wdtTool, puckScreen: profile.puckScreen, puckPrepWorkflow: profile.puckPrepWorkflow, milkStyle: profile.milkStyle },
      dosingInfo: { dose: profile.houseDose, yield: profile.houseYield, houseShotTime: profile.houseShotTime, targetRatio: profile.targetRatio, grinderSetting: profile.grinderSetting, confirmedRecipe: profile.confirmedRecipe, lastDialInResult: profile.lastDialInResult, dialInNotes: profile.dialInNotes, dialInAttempts: profile.dialInAttempts || [], currentShotTime: occasion.currentShotTime, drink: occasion.drink },
      confidenceMetrics: { machineConfidence: sensoryScores.machineConfidence, tasteClarity: sensoryScores.tasteClarity, stagecraft: sensoryScores.stagecraft, recoveryConfidence: sensoryScores.recoveryConfidence, guestResonance: guestResonance.score, occasionTempo: timingMetrics.totalActualSeconds },
      telemetrySnapshot: buildTelemetrySummary(telemetryEvents),
      telemetryEvents: (telemetryEvents || []).slice(0, 12),
      trendSummary: reportTrendSummary(priorReport, sensoryScores, guestResonance)
    };
    setReports((prev) => [report, ...prev]);
    recordTelemetry("report_created", { title: report.title, occasionId: report.occasionId, score: fluency.score, observedZone: fluency.observedZone, guestResonance: guestResonance.score, telemetryGroups: buildTelemetrySummary(telemetryEvents).groups });
    recordTelemetry("occasion_completed", { title: report.title, occasionId: report.occasionId, family: report.occasionFamily, certificationEligible: report.certificationEligible, stepsCompleted: Object.keys(stepTimings || {}).length, totalSteps: selectedFounderOccasion?.steps?.length || 0 });
    setStatus("Doma Report created."); log("Created Doma Report from current Occasion."); setActive("reports");
  }

  function loadSampleReports() {
    const now = new Date();
    const sampleBase = [
      { title: "The First Cup Diagnostic", score: 68, observedZone: "Building Consistency", machine: 5, taste: 5, stage: 6, recovery: 6, resonance: 3, support: 4, recoverySupport: 2, seconds: 720, shot: "20 seconds", status: "Yellow — partially landed" },
      { title: "The Quiet Table", score: 78, observedZone: "Building Consistency", machine: 7, taste: 6, stage: 8, recovery: 7, resonance: 4, support: 2, recoverySupport: 1, seconds: 610, shot: "26 seconds", status: "Green — landed well" },
      { title: "The First Sip Flex", score: 86, observedZone: "Confident Home Barista", machine: 8, taste: 8, stage: 9, recovery: 8, resonance: 5, support: 1, recoverySupport: 0, seconds: 545, shot: "28 seconds", status: "Bodacious" }
    ];
    const samples = sampleBase.map((x, idx) => ({
      id: Date.now() + idx,
      createdAt: new Date(now.getTime() - (sampleBase.length - idx) * 86400000).toLocaleString(),
      title: x.title,
      drink: idx === 2 ? "Chilled espresso tonic with citrus + berry lift" : "Cappuccino",
      guest: idx === 2 ? "Friend / curious guest" : "Family",
      transcript: idx === 0 ? "The shot ran a little fast and tasted thin. I needed help knowing whether to adjust grind." : "The cup felt steadier and the guest noticed the texture and aroma.",
      advisorText: `Sample Advisor feedback: You selected ${profile.advisorGuidanceLevel || "Building Consistency"}. During this Occasion, Advisor support and Recovery use suggest ${x.observedZone}. Focus next on Mise en Place, puck prep, and one calm recovery move.`,
      matrixMatch: idx === 0 ? { label: "Fast shot / low resistance", issue: "Shot runs too fast" } : null,
      selectedFlavorNotes: idx === 2 ? ["citrus", "berry", "floral", "sparkling"] : ["caramel", "cocoa", "sweet"],
      sensoryScores: { ...defaultSensoryScores, machineConfidence: x.machine, tasteClarity: x.taste, stagecraft: x.stage, recoveryConfidence: x.recovery, guestResonance: x.resonance, occasionTempo: 8 },
      tastingNote: idx === 2 ? "Bright, sparkling, citrus-forward with a berry finish and strong guest curiosity." : "Warm, sweet, familiar, and improving in balance.",
      guestResonance: { ...defaultGuestResonance, score: x.resonance, status: x.status, reaction: x.resonance >= 5 ? "delighted" : "comforted", firstThingNoticed: idx === 2 ? "visual presentation" : "texture", quote: idx === 2 ? "I didn’t know coffee could feel like a mocktail." : "This feels smoother than last time.", wouldServeAgain: "yes", nextAdjustment: "brighter" },
      timingMetrics: { suggestedTotalTempo: "8–11 minutes", totalActualSeconds: x.seconds, improvementNote: idx ? "Tempo improved compared with the prior sample report." : "First sample baseline.", tempoReflection: "The goal is calm, repeatable readiness — not speed." },
      fluency: { score: x.score, selectedLevel: profile.advisorGuidanceLevel || "Building Consistency", observedZone: x.observedZone, advisorSupportCount: x.support, recoverySupportCount: x.recoverySupport, correctionCount: idx === 0 ? 1 : 0, stepCompletionPercent: idx === 0 ? 82 : 100, feedback: `You selected ${profile.advisorGuidanceLevel || "Building Consistency"}. During this Occasion, you used Advisor support ${x.support} time(s) and Recovery support ${x.recoverySupport} time(s). This places the sample presentation in the ${x.observedZone} zone. Repeat with attention to Mise en Place, puck prep, and one calm recovery move.` },
      dialInReadiness: { status: idx === 0 ? "Close but still tuning" : "Confirmed house formula", actualRecipe: `18g in / 36g out / ${x.shot}`, recommendation: idx === 0 ? "Complete one more dial-in attempt before treating this as a confirmed Occasion recipe." : "Recipe is ready for this sample Occasion." },
      machineInfo: { machineType: profile.machineType, machine: profile.machine || "Breville Barista Express", grinder: profile.grinder || "Built-in grinder", beans: profile.beans || "Founder sample beans", roastLevel: profile.roastLevel, tamper: profile.tamper, distributionTool: profile.distributionTool, wdtTool: profile.wdtTool, puckScreen: profile.puckScreen },
      dosingInfo: { dose: "18g", yield: "36g", houseShotTime: "26–30 seconds", currentShotTime: x.shot, targetRatio: "1:2", grinderSetting: profile.grinderSetting || "sample grind 6", confirmedRecipe: idx === 0 ? "Close but still tuning" : "Confirmed house formula" },
      confidenceMetrics: { machineConfidence: x.machine, tasteClarity: x.taste, stagecraft: x.stage, recoveryConfidence: x.recovery, guestResonance: x.resonance, occasionTempo: x.seconds },
      telemetrySnapshot: { total: 12 + idx, groups: { "Shot telemetry": 4 + idx, "Dial-In telemetry": 2, "Occasion telemetry": 2 + idx, "Advisor telemetry": 2, "Taste telemetry": 1, "Guest Resonance telemetry": 1 }, latestFocus: idx === 0 ? "Dial-in and recovery support" : "Guest Resonance and repeatability" },
      trendSummary: idx ? "Sample trend: support count fell and Guest Resonance improved." : "Sample baseline report for demonstration."
    }));
    setReports(samples);
    recordTelemetry("sample_reports_loaded", { reportCount: samples.length, groups: ["Shot telemetry", "Dial-In telemetry", "Occasion telemetry", "Advisor telemetry", "Taste telemetry", "Guest Resonance telemetry"] });
    setStatus("Loaded sample Doma Reports with synthetic performance data.");
    log("Loaded synthetic sample Doma Reports for founder demo.");
    setActive("reports");
  }

  function clearReports() { setReports([]); log("Cleared local reports."); }
  function printReport(report) {
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><title>Doma Report</title><style>body{font-family:Arial,sans-serif;padding:28px;line-height:1.45;color:#1c140f} h1{color:#3a2318} .box{border:1px solid #ddd;border-radius:12px;padding:14px;margin:12px 0} pre{white-space:pre-wrap;background:#f7f3ee;padding:12px;border-radius:10px}.printBarRow{display:grid;grid-template-columns:130px 1fr 50px;gap:10px;align-items:center;margin:8px 0}.printBarTrack{height:14px;border-radius:999px;background:#eee;overflow:hidden}.printBarFill{height:100%;background:#8b5a2b}.scoreHero{font-size:34px;font-weight:800;color:#3a2318}.chartNote{font-size:13px;color:#665}</style></head><body><h1>Doma Report — ${report.title}</h1><p>${report.createdAt}</p><div class=box><h2>Occasion Presentation Score</h2><div class=scoreHero>${report.fluency?.score ?? ""}/100</div><p><strong>Selected level:</strong> ${report.fluency?.selectedLevel || ""}<br/><strong>Observed zone:</strong> ${report.fluency?.observedZone || ""}<br/><strong>Advisor support:</strong> ${report.fluency?.advisorSupportCount ?? ""}<br/><strong>Recovery support:</strong> ${report.fluency?.recoverySupportCount ?? ""}<br/><strong>Corrections:</strong> ${report.fluency?.correctionCount ?? ""}<br/><strong>Step completion:</strong> ${report.fluency?.stepCompletionPercent ?? ""}%</p><p>${report.fluency?.feedback || ""}</p></div><div class=box><h2>Report Graphs / Category Bar Chart</h2>${printableBarsHtml(report)}<p class=chartNote>Printable chart snapshot. In the live app, this report also shows the spider/radar chart and cup-profile trend plot.</p></div><div class=box><h2>Machine + Formula</h2><p><strong>Machine:</strong> ${report.machineInfo?.machine || ""}<br/><strong>Grinder:</strong> ${report.machineInfo?.grinder || ""}<br/><strong>Beans:</strong> ${report.machineInfo?.beans || ""}<br/><strong>Dose → Yield:</strong> ${report.dosingInfo?.dose || ""} → ${report.dosingInfo?.yield || ""}<br/><strong>House shot time:</strong> ${report.dosingInfo?.houseShotTime || ""}<br/><strong>Current shot time:</strong> ${report.dosingInfo?.currentShotTime || ""}</p></div><div class=box><h2>Occasion</h2><p><strong>Drink:</strong> ${report.drink}<br/><strong>Served to:</strong> ${report.guest}<br/><strong>Matrix:</strong> ${report.matrixMatch?.label || "None"}</p><p><strong>Trend:</strong> ${report.trendSummary || ""}</p></div><div class=box><h2>Dial-In Readiness</h2><p><strong>Confirmed recipe:</strong> ${report.dialInReadiness?.status || report.dosingInfo?.confirmedRecipe || "Not captured"}<br/><strong>Actual recipe:</strong> ${report.dialInReadiness?.actualRecipe || "Not captured"}<br/><strong>Dial-in note:</strong> ${report.dialInReadiness?.recommendation || "Not captured"}</p></div><div class=box><h2>Confidence Metrics</h2><p>Machine Confidence: ${report.confidenceMetrics?.machineConfidence ?? ""}<br/>Taste Clarity: ${report.confidenceMetrics?.tasteClarity ?? ""}<br/>Stagecraft: ${report.confidenceMetrics?.stagecraft ?? ""}<br/>Recovery Confidence: ${report.confidenceMetrics?.recoveryConfidence ?? ""}<br/>Guest Resonance: ${report.confidenceMetrics?.guestResonance ?? ""}/5</p></div><div class=box><h2>Flavor + Sensory</h2><p>${(report.selectedFlavorNotes || []).join(", ")}</p><p>${report.tastingNote || ""}</p></div><div class=box><h2>Artisan Transcript</h2><pre>${report.transcript || ""}</pre></div><div class=box><h2>Advisor Response</h2><pre>${report.advisorText || ""}</pre></div><script>window.print()</script></body></html>`;
    w.document.write(html);
    w.document.close();
  }
  function exportReportsCSV() {
    const headers = ["Created", "Occasion", "Drink", "Guest", "Machine", "Grinder", "Beans", "Dose", "Yield", "House Shot Time", "Current Shot Time", "Matrix", "Machine Confidence", "Taste Clarity", "Stagecraft", "Recovery Confidence", "Guest Resonance", "Flavor Notes", "Actual Tempo Seconds", "Trend Summary", "Transcript", "Advisor Response"];
    const rows = reports.map((r) => [r.createdAt, r.title, r.drink, r.guest, r.machineInfo?.machine || r.context?.machine || "", r.machineInfo?.grinder || r.context?.grinder || "", r.machineInfo?.beans || r.context?.beans || "", r.dosingInfo?.dose || r.context?.dose || "", r.dosingInfo?.yield || r.context?.yield || "", r.dosingInfo?.houseShotTime || "", r.dosingInfo?.currentShotTime || r.context?.shotTime || "", r.matrixMatch?.label || "", r.confidenceMetrics?.machineConfidence ?? r.sensoryScores?.machineConfidence ?? "", r.confidenceMetrics?.tasteClarity ?? r.sensoryScores?.tasteClarity ?? "", r.confidenceMetrics?.stagecraft ?? r.sensoryScores?.stagecraft ?? "", r.confidenceMetrics?.recoveryConfidence ?? r.sensoryScores?.recoveryConfidence ?? "", r.guestResonance?.score ?? "", (r.selectedFlavorNotes || []).join("; "), r.timingMetrics?.totalActualSeconds ?? "", r.trendSummary || "", r.transcript || "", r.advisorText || ""]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `barista-doma-doma-reports-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    log("Exported Doma Reports CSV.");
  }
  function toggleFlavor(note) {
    setSelectedFlavorNotes((prev) => prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]);
  }
  function updateSensoryScore(field, value) {
    setSensoryScores((prev) => ({ ...prev, [field]: Number(value) }));
  }

  return (
    <main className="appShell">
      <aside className="sideNav">
        <div className="brandMark"><span>BD</span><div><strong>Barista Doma</strong><small>Founder Program v8.9.6</small></div></div>
        {["home", "dashboard", "quickshot", "onboarding", "dialin", "occasions", "certification", "walkthrough", "simulator", "tasting", "matrix", "reports"].map((tab) => (
          <button key={tab} className={active === tab ? "sideLink active" : "sideLink"} onClick={() => setActive(tab)} type="button">{tabIcon(tab)} {tabLabel(tab)}</button>
        ))}
        <PathwayMiniProgress reports={reports} />
      </aside>
      <div className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Founder Program Prototype v8.9.15</p>
        <h1>Home Barista Development Platform — Premium Home + Dashboard</h1>
        <p>Home prepares the artisan. Dashboard runs the work. Pull shots, dial in, ask Advisor, recover, taste, and report without losing the moment.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        <div className={handsFreeEnabled ? "successBox" : "noteBox"}>
          <strong>No-hands Advisor:</strong> {handsFreeStatus}
          <div className="buttonRow">
            <button className={handsFreeEnabled ? "danger" : "primary"} type="button" onClick={handsFreeEnabled ? stopHandsFreeAdvisor : startHandsFreeAdvisor}>{handsFreeEnabled ? "Stop No-Hands Advisor" : "Enable No-Hands Advisor"}</button>
            <button className="secondary" type="button" onClick={() => setActive("simulator")}>Open Advisor Capture</button>
          </div>
          <p className="small">After enabling, say <strong>“Advisor”</strong>. The Advisor responds, records the conversation, repeats the final note, and places dose, yield, time, grind, preference, tasting, or Guest Resonance details into the right fields.</p>
        </div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
        <div className="navBar">
          {["home", "dashboard", "quickshot", "onboarding", "dialin", "occasions", "certification", "walkthrough", "simulator", "tasting", "reports", "matrix"].map((tab) => (
            <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)} type="button">{tabLabel(tab)}</button>
          ))}
        </div>
      </section>

      {active === "home" && <HomeLanding setActive={setActive} profile={profile} occasion={occasion} reports={reports} setupMissing={setupMissing} />}
      {active === "dashboard" && <Dashboard checkServer={checkServer} loadClearFastShot={loadClearFastShot} setActive={setActive} profile={profile} occasion={occasion} reports={reports} health={health} setupMissing={setupMissing} requireSetupThen={requireSetupThen} telemetryEvents={telemetryEvents} clearTelemetry={clearTelemetry} />}
      {active === "certification" && <CertificationPathway reports={reports} setReports={setReports} telemetryEvents={telemetryEvents} setActive={setActive} recordTelemetry={recordTelemetry} profile={profile} />}
      {active === "quickshot" && <QuickShotLogPage profile={profile} updateProfile={updateProfile} setActive={setActive} recordTelemetry={recordTelemetry} />}
      {active === "onboarding" && <Onboarding profile={profile} updateProfile={updateProfile} updateProfilePatch={updateProfilePatch} setActive={setActive} />}
      {active === "dialin" && <DialInJournalPage profile={profile} updateProfile={updateProfile} setActive={setActive} />}
      {active === "occasion" && <OccasionSetup occasion={occasion} updateOccasion={updateOccasion} setActive={setActive} loadClearFastShot={loadClearFastShot} setupMissing={setupMissing} requireSetupThen={requireSetupThen} />}
      {active === "occasions" && <OccasionsLibrary founderOccasions={founderOccasions} openFounderOccasion={openFounderOccasion} selectedOccasionId={selectedOccasionId} setSelectedOccasionId={setSelectedOccasionId} />}
      {active === "walkthrough" && <OccasionWalkthrough occasionItem={walkthroughFounderOccasion} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} setActive={setActive} setTranscript={setTranscript} createReport={createReport} stepTimings={stepTimings} setStepTimings={setStepTimings} occasionStartTime={occasionStartTime} profile={profile} occasion={occasion} updateProfile={updateProfile} updateOccasion={updateOccasion} setGuestResonance={setGuestResonance} setTastingNote={setTastingNote} recordTelemetry={recordTelemetry} setStatus={setStatus} setAdvisorText={setAdvisorText} setMatrixMatch={setMatrixMatch} setSynthesis={setSynthesis} />}
      {active === "simulator" && <Simulator {...{ recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, advisorAudioRef, stopAdvisorVoice, beginCorrection, correctionMode, createReport, applyTranscriptToForms, uploadAsset, setUploadAsset, handleAdvisorUpload, sensoryScores, guestResonance, profile, occasion, reports, handsFreeEnabled, handsFreeCaptureActive, handsFreeStatus, startHandsFreeAdvisor, stopHandsFreeAdvisor }} />}
      {active === "tasting" && <TastingStudio selectedFlavorNotes={selectedFlavorNotes} toggleFlavor={toggleFlavor} sensoryScores={sensoryScores} updateSensoryScore={updateSensoryScore} tastingNote={tastingNote} setTastingNote={setTastingNote} guestResonance={guestResonance} setGuestResonance={setGuestResonance} setActive={setActive} createReport={createReport} />}
      {active === "reports" && <Reports reports={reports} clearReports={clearReports} setActive={setActive} printReport={printReport} exportReportsCSV={exportReportsCSV} loadSampleReports={loadSampleReports} telemetryEvents={telemetryEvents} />}
      {active === "matrix" && <Matrix setActive={setActive} setTranscript={setTranscript} updateOccasion={updateOccasion} recordTelemetry={recordTelemetry} />}

      <section className="card principleCard">
        <h2>Product Principle</h2>
        <p><strong>The form grounds.</strong> The Doma Profile, Machine Passport, House Formula, and Occasion setup prevent generic answers.</p>
        <p><strong>The artisan voice clarifies.</strong> The live comment adds nuance, emotion, uncertainty, and situational detail.</p><p><strong>The artisan can interrupt.</strong> If the Advisor misreads the cup, stop it, add a correction, and re-assess the moment.</p>
        <p><strong>The Advisor synthesizes.</strong> The Recovery Matrix grounds the diagnosis; the Premium Advisor preserves the occasion and speaks back with care, confidence, and delight.</p>
      </section>

      <section className="card"><h2>Diagnostic Log</h2><div className="log">{logs.join("\n")}</div></section>
      </div>
      <nav className="mobileBottomNav" aria-label="Mobile primary navigation">
        {["home", "dashboard", "quickshot", "simulator", "reports"].map((tab) => (
          <button key={tab} className={active === tab ? "mobileNavButton active" : "mobileNavButton"} onClick={() => setActive(tab)} type="button"><span>{tabIcon(tab)}</span><small>{tabLabel(tab)}</small></button>
        ))}
      </nav>
    </main>
  );
}

function tabLabel(tab) { return ({ home: "Home", dashboard: "Dashboard", quickshot: "Pull Shots", onboarding: "Onboarding", occasions: "21 Occasions", walkthrough: "Stagecraft Walkthrough", occasion: "Occasion Setup", dialin: "Dial-In Journal", simulator: "Advisor", tasting: "Tasting Studio", reports: "Doma Reports", certification: "Certification", matrix: "Recovery Library" })[tab]; }
function tabIcon(tab) { return ({ home: "🏠", dashboard: "📍", quickshot: "⚡", onboarding: "☕", occasions: "🎭", walkthrough: "📜", occasion: "🎭", dialin: "🧪", simulator: "🎙️", tasting: "🍯", reports: "📊", certification: "🏅", matrix: "🛠️" })[tab]; }



function PathwayMiniProgress({ reports }) {
  const progress = buildCertificationProgress(reports || [], []);
  return <div className="pathwayBox"><strong>Certification Pathways</strong><p>Core: {progress.coreCompleted}/{progress.coreTotal} · {progress.corePercent}%</p><div className="pathTrack"><span style={{ width: `${progress.corePercent}%` }} /></div><p>Modern Sensory: {progress.modernSensoryCompleted}/{progress.modernSensoryTotal} · {progress.modernSensoryPercent}%</p><div className="pathTrack modern"><span style={{ width: `${progress.modernSensoryPercent}%` }} /></div><small>21 total Occasions: 15 Core plus 6 Modern Sensory. The two certificate tracks unlock separately.</small></div>;
}

function CertificationProgressReport({ reports, telemetryEvents, setActive }) {
  const progress = buildCertificationProgress(reports || [], telemetryEvents || []);
  const nextCore = coreCertificationOccasions.find((item) => !progress.completedCore.some((done) => done.id === item.id));
  const nextModern = modernSensoryCertificationOccasions.find((item) => !progress.completedModernSensory.some((done) => done.id === item.id));
  return <section className="certMini card"><h3>Certification Progress Report</h3><p className="small">Barista Doma tracks two certificate pathways through Development Telemetry, Doma Reports, taste notes, Guest Resonance, and completed Occasion work.</p><div className="tiles"><Tile title="Core Practitioner" value={`${progress.coreCompleted}/${progress.coreTotal}`} /><Tile title="Core readiness" value={`${progress.corePercent}%`} /><Tile title="Modern Sensory" value={`${progress.modernSensoryCompleted}/${progress.modernSensoryTotal}`} /><Tile title="Total library" value={`${progress.allCompleted}/${progress.allTotal}`} /></div><div className="dualProgress"><div><strong>Certified Occasion Practitioner</strong><div className="certProgress"><span style={{ width: `${progress.corePercent}%` }} /></div></div><div><strong>Modern Sensory Occasion Practitioner</strong><div className="certProgress modern"><span style={{ width: `${progress.modernSensoryPercent}%` }} /></div></div></div><p className="small">Next Core Occasion: <strong>{nextCore ? nextCore.name : "Core certificate ready"}</strong></p><p className="small">Next Modern Sensory Occasion: <strong>{nextModern ? nextModern.name : "Modern Sensory certificate ready"}</strong></p><div className="buttonRow"><button className="secondary" onClick={() => setActive("certification")}>Open Certification Journey</button></div></section>;
}

function CertificationPathway({ reports, setReports, telemetryEvents, setActive, recordTelemetry, profile }) {
  const progress = buildCertificationProgress(reports || [], telemetryEvents || []);
  function recordOccasionCompletion(item) {
    const report = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toLocaleString(),
      title: item.name,
      occasionId: item.id,
      occasionFamily: item.family,
      certificationEligible: item.family === "Core Occasions",
      certificationTrack: item.family === "Modern Sensory Occasions" ? "Modern Sensory Occasion Practitioner" : "Certified Occasion Practitioner",
      drink: item.drink,
      guest: "Home coffee Occasion",
      transcript: "Certification completion evidence recorded from Certification Journey.",
      advisorText: "Completion path captured. Full production version will require all step telemetry, taste capture, Guest Resonance, and report evidence before final unlock.",
      selectedFlavorNotes: [],
      tastingNote: "Preference-first taste capture required for final certification evidence.",
      guestResonance: { score: 4, reaction: "captured", guestQuote: "Completion evidence captured", wouldServeAgain: "yes" },
      fluency: { score: 80, selectedLevel: profile?.advisorGuidanceLevel || "Building Consistency", observedZone: "Completion Evidence", stepCompletionPercent: 100, feedback: "Prototype completion evidence recorded for certification progress." },
      confidenceMetrics: { machineConfidence: 4, tasteClarity: 4, stagecraft: 4, recoveryConfidence: 4, guestResonance: 4, occasionTempo: 240 },
      machineInfo: { machine: profile?.machine || profile?.espressoMachine || profile?.allInOneMachine || "Machine not captured", grinder: profile?.grinder || "Grinder not captured", beans: profile?.beans || "Beans not captured" },
      dosingInfo: { dose: profile?.houseDose || "Not captured", yield: profile?.houseYield || "Not captured", houseShotTime: profile?.houseShotTime || "Not captured", grinderSetting: profile?.grinderSetting || "Not captured" },
      telemetrySnapshot: { track: item.family, completion: "recorded" },
      trendSummary: "Certification progress increased by one Occasion."
    };
    if (typeof setReports === "function") setReports((prev) => [report, ...(prev || []).filter((r) => (r.occasionId || slugifyName(r.title || "")) !== item.id)]);
    if (recordTelemetry) recordTelemetry("occasion_completion_evidence_recorded", { occasion: item.name, occasionId: item.id, track: item.family });
  }

  const artisanKey = String(profile?.name || "ARTISAN").replace(/[^A-Za-z0-9]/g, "").slice(0,6).toUpperCase() || "ARTISAN";
  const coreCertificateId = `BD-COP-${artisanKey}-${new Date().getFullYear()}-${String(progress.coreCompleted).padStart(2,"0")}`;
  const sensoryCertificateId = `BD-MSO-${artisanKey}-${new Date().getFullYear()}-${String(progress.modernSensoryCompleted).padStart(2,"0")}`;
  const missingCore = coreCertificationOccasions.filter((item) => !progress.completedCore.some((done) => done.id === item.id));
  const missingModern = modernSensoryCertificationOccasions.filter((item) => !progress.completedModernSensory.some((done) => done.id === item.id));
  const printCertificate = (track, certificateId, unlocked, percent) => {
    if (recordTelemetry) recordTelemetry("certificate_printed", { track, certificateId, progress: percent, unlocked });
    window.print();
  };
  return <section className="certPage"><section className="card heroPremium"><p className="eyebrow">Barista Doma Certification Pathways</p><h1>Two Occasion-centered certificates. One 21-Occasion development platform.</h1><p>Barista Doma certification is built around completing real home coffee Occasions, not merely reading lessons. The 15 Core Occasions lead to the Certified Occasion Practitioner certificate. The 6 Modern Sensory Occasions lead to a separate Modern Sensory Occasion Practitioner certificate.</p><div className="tiles"><Tile title="Core Practitioner" value={`${progress.coreCompleted}/${progress.coreTotal}`} /><Tile title="Modern Sensory" value={`${progress.modernSensoryCompleted}/${progress.modernSensoryTotal}`} /><Tile title="Total Occasion Library" value={`${progress.allCompleted}/${progress.allTotal}`} /><Tile title="Patches earned" value={`${progress.coreCompleted + progress.modernSensoryCompleted}`} /></div><div className="dualProgress"><div><strong>Certified Occasion Practitioner</strong><div className="certProgress large"><span style={{ width: `${progress.corePercent}%` }} /></div><small>{progress.corePercent}% complete</small></div><div><strong>Modern Sensory Occasion Practitioner</strong><div className="certProgress large modern"><span style={{ width: `${progress.modernSensoryPercent}%` }} /></div><small>{progress.modernSensoryPercent}% complete</small></div></div><div className="buttonRow"><button className="secondary" onClick={() => setActive("occasions")}>Open 21 Occasions</button><button className="secondary" onClick={() => setActive("reports")}>View Doma Reports</button><button className="secondary" onClick={() => setActive("dashboard")}>Back to Dashboard</button></div></section>

    <CertificationProgressReport reports={reports} telemetryEvents={telemetryEvents || []} setActive={setActive} />
    <section className="card"><h2>How certification is completed</h2><p className="small">Production rule: an Occasion patch unlocks after the artisan completes every step in the walkthrough, captures taste/preference, records Guest Resonance, and creates a Doma Report. For this founder prototype, use <strong>Record Completion Evidence</strong> on any locked patch so we can test the pathway, progress bars, reports, and certificate unlock behavior end to end.</p></section>

    <section className="card certTrack"><p className="eyebrow">Certificate Track 1</p><h2>Barista Doma Certified Occasion Practitioner</h2><p className="small">Earned by completing the 15 Core Home Barista Occasions with step completion evidence, a Doma Report, preference-first taste capture, Guest Resonance, and Development Telemetry.</p><div className={progress.coreCertificateUnlocked ? "successBox" : "noteBox"}><strong>{progress.coreCertificateUnlocked ? "Core certificate unlocked." : "Core certificate locked."}</strong><br/>{progress.coreCertificateUnlocked ? "All 15 Core Occasions have completion evidence in local Doma Reports." : `Complete ${missingCore.length} more Core Occasion${missingCore.length === 1 ? "" : "s"} to unlock this certificate.`}</div><div className="patchGrid">{coreCertificationOccasions.map((item, idx) => { const earned = progress.completedCore.some((done) => done.id === item.id); return <article className={earned ? "patch earned" : "patch locked"} key={item.id}><div className="patchMedal">{earned ? "★" : idx + 1}</div><h3>{coreCertificationPatchNames[idx] || `${item.name} Patch`}</h3><p>{item.name}</p><small>{earned ? "Earned — Doma Report found" : "Locked — complete the Occasion and create a report"}</small><div className="buttonRow"><button className="secondary" type="button" onClick={() => { setActive("occasions"); }}>Open Occasion</button>{!earned ? <button className="secondary green" type="button" onClick={() => recordOccasionCompletion(item)}>Record Completion Evidence</button> : null}</div></article>; })}</div></section>

    <section className="card certTrack"><p className="eyebrow">Certificate Track 2</p><h2>Barista Doma Certified Modern Sensory Occasion Practitioner</h2><p className="small">Earned by completing the 6 Modern Sensory Occasions — cold, contemporary, and sensory-forward service experiences. This is not labeled by generation inside the app; it is positioned as modern sensory fluency.</p><div className={progress.modernSensoryCertificateUnlocked ? "successBox" : "noteBox"}><strong>{progress.modernSensoryCertificateUnlocked ? "Modern Sensory certificate unlocked." : "Modern Sensory certificate locked."}</strong><br/>{progress.modernSensoryCertificateUnlocked ? "All 6 Modern Sensory Occasions have completion evidence in local Doma Reports." : `Complete ${missingModern.length} more Modern Sensory Occasion${missingModern.length === 1 ? "" : "s"} to unlock this certificate.`}</div><div className="patchGrid sensory">{modernSensoryCertificationOccasions.map((item, idx) => { const earned = progress.completedModernSensory.some((done) => done.id === item.id); return <article className={earned ? "patch earned sensory" : "patch locked sensory"} key={item.id}><div className="patchMedal">{earned ? "✦" : idx + 1}</div><h3>{modernSensoryPatchNames[idx] || `${item.name} Patch`}</h3><p>{item.name}</p><small>{earned ? "Earned — Doma Report found" : "Locked — complete the Occasion and create a report"}</small><div className="buttonRow"><button className="secondary" type="button" onClick={() => { setActive("occasions"); }}>Open Occasion</button>{!earned ? <button className="secondary green" type="button" onClick={() => recordOccasionCompletion(item)}>Record Completion Evidence</button> : null}</div></article>; })}</div></section>

    <section className="card"><h2>21-Occasion Library Progress</h2><p className="small">The complete library includes 15 Core Occasions plus 6 Modern Sensory cold drink / contemporary service Occasions. The app shows both certificate pathways without using generation labels.</p><div className="allOccasionList">{founderOccasions.map((item) => { const done = progress.completedAll.some((x) => x.id === item.id); return <div className={done ? "occasionLine done" : "occasionLine"} key={item.id}><span>{done ? "✓" : "○"}</span><strong>{item.name}</strong><small>{item.family}</small></div>; })}</div></section>

    <section className="certificatePreview card"><p className="eyebrow">Certificate Preview — Core Track</p><h2>Barista Doma Certified Occasion Practitioner</h2><p>Awarded to</p><h3>{profile?.name || "Founder Artisan"}</h3><p>For completing the Barista Doma Core Occasion Pathway, a guided home barista development course focused on machine fluency, dial-in discipline, taste development, recovery confidence, stagecraft, Guest Resonance, and the preparation of meaningful home coffee Occasions.</p><p><strong>Completion verified through Barista Doma Development Telemetry.</strong></p><p>Certificate ID: {coreCertificateId}</p><div className="buttonRow"><button className="primary" disabled={!progress.coreCertificateUnlocked} onClick={() => printCertificate("core", coreCertificateId, progress.coreCertificateUnlocked, progress.corePercent)}>Print Core Certificate</button></div>{!progress.coreCertificateUnlocked ? <p className="small">Printing unlocks after all 15 Core Occasion patches are earned.</p> : null}</section>

    <section className="certificatePreview card"><p className="eyebrow">Certificate Preview — Modern Sensory Track</p><h2>Barista Doma Certified Modern Sensory Occasion Practitioner</h2><p>Awarded to</p><h3>{profile?.name || "Founder Artisan"}</h3><p>For completing the Barista Doma Modern Sensory Occasion Pathway, a guided development course focused on contemporary service, cold drink fluency, sensory presentation, preference-first taste capture, Guest Resonance, and modern home coffee Occasions.</p><p><strong>Completion verified through Barista Doma Development Telemetry.</strong></p><p>Certificate ID: {sensoryCertificateId}</p><div className="buttonRow"><button className="primary" disabled={!progress.modernSensoryCertificateUnlocked} onClick={() => printCertificate("modern_sensory", sensoryCertificateId, progress.modernSensoryCertificateUnlocked, progress.modernSensoryPercent)}>Print Modern Sensory Certificate</button></div>{!progress.modernSensoryCertificateUnlocked ? <p className="small">Printing unlocks after all 6 Modern Sensory Occasion patches are earned.</p> : null}</section>
  </section>;
}

function HomeLanding({ setActive, profile, occasion, reports, setupMissing }) {
  const ready = !setupMissing?.length;
  return <section className="homePage">
    <section className="card heroPremium">
      <p className="eyebrow">Home / First Impression</p>
      <h2>Prepare the artisan before the Occasion begins.</h2>
      <p className="small">Home is the clean starting point: set up the Doma Profile, capture the Machine Passport, pull practice shots, and build a house formula. Then the Dashboard becomes the operating hub.</p>
      <div className="tiles">
        <Tile title="Setup" value={ready ? "Ready" : `${setupMissing.length} items left`} />
        <Tile title="Machine" value={profile.machine || "Not set"} />
        <Tile title="House formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} />
        <Tile title="Taste path" value="Preference first" />
        <Tile title="Reports" value={`${reports.length} saved`} />
      </div>
    </section>
    <section className="homeActionGrid">
      <button className="homeAction" type="button" onClick={() => setActive("onboarding")}><span>01</span><strong>Onboarding + Machine Passport</strong><small>Capture the machine, grinder, water, basket, puck-prep tools, and guidance level.</small></button>
      <button className="homeAction" type="button" onClick={() => setActive("quickshot")}><span>02</span><strong>Pull Some Shots</strong><small>Quickly log dose, yield, time, grind, whether you liked it, and what you would change.</small></button>
      <button className="homeAction" type="button" onClick={() => setActive("dialin")}><span>03</span><strong>Dial-In Journal</strong><small>Turn repeated attempts into a house formula and a second coffee brain.</small></button>
      <button className="homeAction" type="button" onClick={() => setActive("certification")}><span>04</span><strong>Certification Journey</strong><small>See the 15 Core Occasion pathway, earned patches, remaining requirements, and certificate readiness.</small></button>
        <button className="homeAction primaryAction" type="button" onClick={() => setActive("dashboard")}><span>05</span><strong>Go to Dashboard</strong><small>Start an Occasion, ask Advisor, recover, taste, review reports, and continue development.</small></button>
    </section>
    <section className="card principleCard">
      <h2>Preference-first taste development</h2>
      <p><strong>Do you like it?</strong> comes before forcing Q-grader language. If the artisan likes the cup, Barista Doma helps capture the dose, yield, time, grind, bean, and notes so they can make it again.</p>
      <p>The flavor wheel stays, but it becomes an exploration layer after the artisan records honest preference and recipe evidence.</p>
    </section>
  </section>;
}

function parseQuickShotNote(text) {
  const lower = String(text || "").toLowerCase();
  const pick = (patterns) => {
    for (const re of patterns) { const m = lower.match(re); if (m) return m[1]; }
    return "";
  };
  const dose = pick([/(\d+(?:\.\d+)?)\s*(?:g|grams?)\s*(?:in|dose)/, /dose\s*(?:was|is|:)?\s*(\d+(?:\.\d+)?)/]);
  const yld = pick([/(\d+(?:\.\d+)?)\s*(?:g|grams?)\s*(?:out|yield)/, /yield\s*(?:was|is|:)?\s*(\d+(?:\.\d+)?)/]);
  const time = pick([/(\d+(?:\.\d+)?)\s*(?:seconds?|sec)\b/, /time\s*(?:was|is|:)?\s*(\d+(?:\.\d+)?)/]);
  const grind = pick([/grind(?: setting)?\s*(?:was|is|:)?\s*([a-z0-9.\- ]{1,18})/]);
  const liked = lower.includes("did not like") || lower.includes("don't like") || lower.includes("didn't like") || lower.includes("not like") ? "No" : (lower.includes("somewhat") || lower.includes("kind of") ? "Somewhat" : (lower.includes("liked") || lower.includes("i like") || lower.includes("i loved") || lower.includes("good") ? "Yes" : ""));
  const serve = lower.includes("would not serve") || lower.includes("not serve") ? "No" : (lower.includes("maybe serve") ? "Maybe after adjustment" : (lower.includes("serve it") || lower.includes("would serve") ? "Yes" : ""));
  const descriptors = [];
  ["sweet","smooth","bright","thin","bitter","sour","sharp","creamy","heavy","light","chocolate","caramel","nutty","citrus","berry","floral","balanced","watery"].forEach((w) => { if (lower.includes(w)) descriptors.push(w); });
  return {
    dose: dose ? `${dose}g` : "",
    yield: yld ? `${yld}g` : "",
    time: time ? `${time} sec` : "",
    grind: grind ? grind.trim() : "",
    liked,
    serve,
    likedNotes: descriptors.length ? descriptors.join(", ") : "",
    change: lower.includes("more body") ? "More body" : lower.includes("sweeter") ? "Sweeter" : lower.includes("less bitter") ? "Less bitter" : lower.includes("less sour") ? "Less sour" : lower.includes("finer") ? "Finer grind" : lower.includes("coarser") ? "Coarser grind" : ""
  };
}

function QuickShotLogPage({ profile, updateProfile, setActive, recordTelemetry }) {
  const [listening, setListening] = useState(false);
  const [quickVoiceStatus, setQuickVoiceStatus] = useState("Ready to record a shot note.");
  const [quickAudioUrl, setQuickAudioUrl] = useState("");
  const quickRecorderRef = useRef(null);
  const quickChunksRef = useRef([]);
  const attempts = profile.dialInAttempts || [];
  function applyParsed(parsed) {
    if (parsed.dose) updateProfile("quickShotDose", parsed.dose);
    if (parsed.yield) updateProfile("quickShotYield", parsed.yield);
    if (parsed.time) updateProfile("quickShotTime", parsed.time);
    if (parsed.grind) updateProfile("quickShotGrind", parsed.grind);
    if (parsed.liked) updateProfile("quickShotLiked", parsed.liked);
    if (parsed.serve) updateProfile("quickShotServeAgain", parsed.serve);
    if (parsed.likedNotes) updateProfile("quickShotLikedNotes", parsed.likedNotes);
    if (parsed.change) updateProfile("quickShotChange", parsed.change);
    if (recordTelemetry) recordTelemetry("voice_quick_capture_parsed", { fields: Object.entries(parsed).filter(([,v]) => Boolean(v)).map(([k]) => k), source: "Pull Some Shots" });
  }
  function parseVoiceNote() { applyParsed(parseQuickShotNote(profile.quickShotVoiceNote)); }
  async function startQuickVoice() {
    if (listening) { stopQuickVoice(); return; }
    try {
      setQuickVoiceStatus("Requesting microphone for Shot Log…");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      quickChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      quickRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data?.size > 0) quickChunksRef.current.push(event.data); };
      recorder.onstart = () => { setListening(true); setQuickVoiceStatus("Recording shot note… speak dose, yield, time, grind, what you liked, and whether you would serve it."); };
      recorder.onstop = async () => {
        setListening(false);
        setQuickVoiceStatus("Recording stopped. Transcribing and filling fields…");
        try {
          stream.getTracks().forEach((track) => track.stop());
          const blob = new Blob(quickChunksRef.current, { type: recorder.mimeType || "audio/webm" });
          if (quickAudioUrl) URL.revokeObjectURL(quickAudioUrl);
          setQuickAudioUrl(URL.createObjectURL(blob));
          const form = new FormData();
          form.append("audio", blob, "quick-shot-note.webm");
          const response = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Transcription failed");
          const text = data.text || data.transcript || "";
          updateProfile("quickShotVoiceNote", text);
          const parsed = parseQuickShotNote(text);
          applyParsed(parsed);
          const fields = Object.entries(parsed).filter(([,v]) => Boolean(v)).map(([k]) => k);
          setQuickVoiceStatus(fields.length ? `Voice captured and filled: ${fields.join(", ")}.` : "Voice captured. No shot fields detected yet; edit or press Parse Spoken Note into Fields.");
          if (recordTelemetry) recordTelemetry("voice_shot_log_recorded", { transcriptLength: text.length, fields });
        } catch (err) {
          setQuickVoiceStatus(`Voice capture problem: ${err.message || String(err)}`);
        }
      };
      recorder.start();
    } catch (err) {
      setListening(false);
      setQuickVoiceStatus(`Microphone unavailable: ${err.message || String(err)}. Use HTTPS and allow microphone access.`);
    }
  }
  function stopQuickVoice() {
    try { if (quickRecorderRef.current && quickRecorderRef.current.state !== "inactive") quickRecorderRef.current.stop(); }
    catch (err) { setQuickVoiceStatus(`Stop problem: ${err.message || String(err)}`); }
  }
  function saveQuickShot() {
    const now = new Date().toLocaleString();
    const attempt = {
      id: Date.now(), kind: "Quick Shot Log", createdAt: now,
      beans: profile.beans || "House beans", dose: profile.quickShotDose, yield: profile.quickShotYield, shotTime: profile.quickShotTime,
      grind: profile.quickShotGrind, taste: `${profile.quickShotLiked || "Not marked"}${profile.quickShotLikedNotes ? ` — ${profile.quickShotLikedNotes}` : ""}`,
      flow: profile.quickShotVoiceNote || "Quick shot capture", puckPrep: profile.puckPrepWorkflow || "Not captured",
      advisorNote: `Preference-first log. Would serve: ${profile.quickShotServeAgain || "Not captured"}. Change next: ${profile.quickShotChange || "Not captured"}. Optional flavor notes: ${profile.quickShotFlavorNotes || "Not captured"}.`,
      telemetryGroup: "Shot telemetry",
      liked: profile.quickShotLiked, likedNotes: profile.quickShotLikedNotes, wouldServe: profile.quickShotServeAgain, changeNext: profile.quickShotChange, flavorNotes: profile.quickShotFlavorNotes
    };
    updateProfile("dialInAttempts", [attempt, ...attempts]);
    updateProfile("lastDialInResult", `Quick Shot saved: ${attempt.dose || "?"} → ${attempt.yield || "?"} / ${attempt.shotTime || "?"}. Liked: ${attempt.liked || "not marked"}.`);
    if (recordTelemetry) recordTelemetry("shot_logged", { dose: attempt.dose, yield: attempt.yield, shotTime: attempt.shotTime, grind: attempt.grind, liked: attempt.liked, wouldServe: attempt.wouldServe, likedNotes: attempt.likedNotes, flavorNotes: attempt.flavorNotes });
  }
  function setAsHouse(a) {
    updateProfile("houseDose", a.dose || profile.houseDose);
    updateProfile("houseYield", a.yield || profile.houseYield);
    updateProfile("houseShotTime", a.shotTime || profile.houseShotTime);
    updateProfile("grinderSetting", a.grind || profile.grinderSetting);
    updateProfile("confirmedRecipe", "Confirmed from Quick Shot preference log");
    updateProfile("lastDialInResult", `House Formula selected from Quick Shot: ${a.dose} → ${a.yield} / ${a.shotTime}.`);
    if (recordTelemetry) recordTelemetry("house_formula_set", { source: a.kind || "Quick Shot", dose: a.dose, yield: a.yield, shotTime: a.shotTime, grind: a.grind, preference: a.liked || a.taste });
  }
  return <section className="card quickShotPage">
    <p className="eyebrow">Pull Some Shots / Quick Capture</p>
    <h2>Log what you pulled, then decide if you liked it.</h2>
    <p className="small">This is not a full Occasion. It is the convenient shot notebook: voice or type the shot, capture the recipe, mark whether you liked it, and optionally add flavor-wheel notes.</p>
    <div className="noteBox"><strong>Say it naturally:</strong> “18 grams in, 36 grams out, 27 seconds, grind 8. I liked the sweetness and body. I would serve it.”</div>
    <div className="buttonRow"><button className={listening ? "danger" : "primary"} type="button" onClick={startQuickVoice}>{listening ? "🟢 Stop Recording" : "🎙️ Record Shot Log"}</button><button className="secondary" type="button" onClick={parseVoiceNote}>Parse Spoken Note into Fields</button><button className="secondary" type="button" onClick={() => setActive("simulator")}>Open Advisor Voice Capture</button></div><div className="statusBox"><strong>Voice Capture:</strong> {quickVoiceStatus}</div>{quickAudioUrl ? <audio controls src={quickAudioUrl} /> : null}
    <label className="label">Spoken / typed shot note</label>
    <textarea value={profile.quickShotVoiceNote || ""} onChange={(e) => updateProfile("quickShotVoiceNote", e.target.value)} placeholder="Speak or type: dose, yield, time, grind, whether you liked it, what you liked, what you would change, and whether you would serve it." />
    <div className="grid">
      <Field label="Dose in" value={profile.quickShotDose || ""} onChange={(v) => updateProfile("quickShotDose", v)} />
      <Field label="Yield out" value={profile.quickShotYield || ""} onChange={(v) => updateProfile("quickShotYield", v)} />
      <Field label="Shot time" value={profile.quickShotTime || ""} onChange={(v) => updateProfile("quickShotTime", v)} />
      <Field label="Grind setting" value={profile.quickShotGrind || ""} onChange={(v) => updateProfile("quickShotGrind", v)} />
    </div>
    <div className="grid">
      <SelectField label="Did you like it?" value={profile.quickShotLiked || ""} onChange={(v) => updateProfile("quickShotLiked", v)} options={["", "Yes", "Somewhat", "No"]} />
      <SelectField label="Would you serve it?" value={profile.quickShotServeAgain || ""} onChange={(v) => updateProfile("quickShotServeAgain", v)} options={["", "Yes", "Maybe after adjustment", "No"]} />
    </div>
    <label className="label">What did you like / notice?</label>
    <textarea value={profile.quickShotLikedNotes || ""} onChange={(e) => updateProfile("quickShotLikedNotes", e.target.value)} placeholder="Sweet, smooth, bright, heavy body, nice finish, good with milk, guest would like this…" />
    <label className="label">What would you change next time?</label>
    <input value={profile.quickShotChange || ""} onChange={(e) => updateProfile("quickShotChange", e.target.value)} placeholder="More body, sweeter, less bitter, longer/shorter yield, finer/coarser grind…" />
    <label className="label">Optional flavor-wheel notes</label>
    <input value={profile.quickShotFlavorNotes || ""} onChange={(e) => updateProfile("quickShotFlavorNotes", e.target.value)} placeholder="Optional: cocoa, caramel, citrus, berry, floral, nutty…" />
    <div className="buttonRow"><button className="primary" type="button" onClick={saveQuickShot}>Save Quick Shot Log</button><button className="secondary" type="button" onClick={() => setActive("dialin")}>Open Dial-In Journal</button><button className="secondary" type="button" onClick={() => setActive("dashboard")}>Go to Dashboard</button></div>
    {attempts.length ? <div className="attemptList"><h3>Recent shot records</h3>{attempts.slice(0,5).map((a) => <div className="noteBox" key={a.id}><strong>{a.kind || "Dial-In Attempt"} · {a.createdAt}</strong><br/>{a.beans} · {a.dose} in → {a.yield} out · {a.shotTime} · grind {a.grind}<br/><strong>Preference:</strong> {a.taste}<br/><strong>Next:</strong> {a.changeNext || a.advisorNote}<div className="buttonRow"><button className="secondary green" type="button" onClick={() => setAsHouse(a)}>Set as House Formula</button></div></div>)}</div> : <p className="small">No quick shot records yet.</p>}
  </section>;
}

function telemetryCategory(type) {
  if (/shot|house_formula|voice_quick_capture/.test(type)) return "Shot telemetry";
  if (/dial/i.test(type)) return "Dial-In telemetry";
  if (/occasion|step/.test(type)) return "Occasion telemetry";
  if (/advisor|upload|voice/.test(type)) return "Advisor telemetry";
  if (/recovery|matrix/.test(type)) return "Recovery telemetry";
  if (/taste|flavor/.test(type)) return "Taste telemetry";
  if (/guest|resonance/.test(type)) return "Guest Resonance telemetry";
  if (/report|sample/.test(type)) return "Report telemetry";
  return "Development telemetry";
}

function buildTelemetrySummary(events = []) {
  const groups = {};
  (events || []).forEach((event) => {
    const group = event.category || telemetryCategory(event.type || "");
    groups[group] = (groups[group] || 0) + 1;
  });
  const latestFocus = Object.entries(groups).sort((a,b) => b[1] - a[1])[0]?.[0] || "No telemetry yet";
  return { total: (events || []).length, groups, latestFocus };
}

function TelemetryPanel({ summary, events, clearTelemetry, compact = false }) {
  const groups = Object.entries(summary?.groups || {});
  return <section className={compact ? "telemetryPanel compact" : "telemetryPanel"}>
    <div>
      <p className="eyebrow">Development Telemetry</p>
      <h3>Signals that turn the app into a growth platform.</h3>
      <p className="small">Telemetry groups the artisan’s actions into shot, dial-in, taste, Occasion, Advisor, Recovery, report, and Guest Resonance signals. This is the vocabulary for personalization and future coaching — not surveillance.</p>
    </div>
    <div className="telemetryTiles">
      <Tile title="Signals captured" value={String(summary?.total || 0)} />
      <Tile title="Current focus" value={summary?.latestFocus || "No telemetry yet"} />
      <Tile title="Latest event" value={events?.[0]?.type ? events[0].type.replaceAll("_", " ") : "None yet"} />
    </div>
    {groups.length ? <div className="telemetryGroups">{groups.map(([group, count]) => <span className="telemetryPill" key={group}>{group}: {count}</span>)}</div> : <div className="noteBox"><strong>No telemetry yet.</strong><br/>Log a shot, set a house formula, use Advisor, choose a Recovery issue, or create a report to begin building the development record.</div>}
    {events?.length ? <details className="telemetryRecent"><summary>Recent telemetry events</summary>{events.slice(0, 8).map((event) => <div className="telemetryEvent" key={event.id}><strong>{event.type.replaceAll("_", " ")}</strong><br/><small>{event.createdAt} · {event.category}</small></div>)}</details> : null}
    {clearTelemetry ? <div className="buttonRow"><button className="secondary" type="button" onClick={clearTelemetry}>Clear Local Telemetry</button></div> : null}
  </section>;
}

function Dashboard({ checkServer, loadClearFastShot, setActive, profile, occasion, reports, health, setupMissing, requireSetupThen, telemetryEvents, clearTelemetry }) {
  const setupComplete = !setupMissing?.length;
  const telemetrySummary = buildTelemetrySummary(telemetryEvents || []);
  return <section className="card"><h2>Founder Dashboard</h2><p className="small">The operating hub: continue the current Occasion, pull shots, ask Advisor, recover, taste, and review progress. Home prepares the artisan; Dashboard runs the product experience.</p><div className="tiles"><Tile title="Server" value={health?.hasOpenAIKey ? "Connected" : "Check needed"} /><Tile title="Machine" value={profile.machine || "Not set"} /><Tile title="House Formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} /><Tile title="Current Occasion" value={occasion.occasionName || "Not set"} /><Tile title="Saved Reports" value={String(reports.length)} /></div>{setupComplete ? <div className="successBox"><strong>Setup Gate:</strong> Ready. Doma Profile, Machine Passport, House Formula, and Occasion setup are present.</div> : <div className="errorBox"><strong>Setup Gate:</strong> Complete these before starting a live session: {setupMissing.join(", ")}</div>}<div className="buttonRow"><button className="primary" onClick={checkServer}>Check Server / API Key</button><button className="secondary" onClick={() => setActive("onboarding")}>Open Doma Profile</button><button className="secondary" onClick={() => setActive("dialin")}>Open Dial-In Journal</button><button className="secondary" onClick={() => setActive("quickshot")}>Pull Some Shots</button><button className="secondary" onClick={() => setActive("occasions")}>Open 21 Occasions</button><button className="secondary" onClick={() => setActive("certification")}>Certification Progress</button><button className="primary" onClick={loadClearFastShot}>Load Sample Advisor Flow</button><button className="secondary" onClick={() => requireSetupThen("simulator")}>Go to Simulator</button><button className="primary" onClick={() => setActive("simulator")}>🎙️ Speak to Advisor / Record Voice</button><button className="secondary green" onClick={() => setActive("simulator")}>Upload Photo/Video for Advisor</button></div><TelemetryPanel summary={telemetrySummary} events={telemetryEvents || []} clearTelemetry={clearTelemetry} /></section>;
}
function Tile({ title, value }) { return <div className="tile"><p>{title}</p><strong>{value}</strong></div>; }

function Onboarding({ profile, updateProfile, updateProfilePatch, setActive }) {
  function handleExperienceLevel(value) {
    const mappedGuidance = experienceToGuidanceLevel[value] || profile.advisorGuidanceLevel || "Building Consistency";
    updateProfilePatch({
      experienceLevel: value,
      advisorGuidanceLevel: mappedGuidance,
      advisorGuidanceNotes: guidanceLevelProfiles[mappedGuidance]?.promise || ""
    });
  }
  function handleGuidanceLevel(value) {
    const level = guidanceLevelProfiles[value] ? value : "Building Consistency";
    updateProfilePatch({ advisorGuidanceLevel: level, advisorGuidanceNotes: guidanceLevelProfiles[level]?.promise || "" });
  }
  const effectiveGuidanceLevel = guidanceLevelProfiles[profile.advisorGuidanceLevel] ? profile.advisorGuidanceLevel : (experienceToGuidanceLevel[profile.experienceLevel] || "Building Consistency");
  const guidanceProfile = guidanceLevelProfiles[effectiveGuidanceLevel] || guidanceLevelProfiles["Building Consistency"];
  return <section className="card">
    <p className="eyebrow">Onboarding split into layers</p>
    <h2>Doma Profile + Machine Passport + Dial-In Profile</h2>
    <p className="small">Initial onboarding stays simple, while Machine Passport and Dial-In Profile capture the structured context the Advisor needs for better guidance.</p>
    <div className="setupStack">
      <div className="noteBox"><strong>1. Doma Profile</strong><br/>Who is the artisan, what are they trying to serve, and what confidence level are they bringing to the machine?</div>
      <div className="grid">
        <Field label="Founder / artisan name" value={profile.founderName} onChange={(v) => updateProfile("founderName", v)} />
        <Field label="Role identity" value={profile.roleIdentity} onChange={(v) => updateProfile("roleIdentity", v)} />
        <SelectField label="Experience level" value={profile.experienceLevel} onChange={handleExperienceLevel} options={experienceOptions} />
        <SelectField label="Advisor Guidance Level" value={effectiveGuidanceLevel} onChange={handleGuidanceLevel} options={guidanceLevelOptions} />
        <Field label="Preferred drinks" value={profile.preferredDrinks} onChange={(v) => updateProfile("preferredDrinks", v)} />
      </div>
      <div className="successBox"><strong>Experience selected: {profile.experienceLevel || "Not selected"}.</strong><br/><strong>Advisor service mode: {effectiveGuidanceLevel}.</strong><br/>{guidanceProfile.promise}<br/><br/><strong>What this level expects:</strong> {guidanceProfile.expectedFluency}<br/><br/><strong>How Barista Doma will use this:</strong> The Advisor will compare this selected level with actual Occasion performance: step completion, Advisor help count, Recovery support, corrections, Guest Resonance, and Dial-In Readiness. If the evidence suggests a different growth zone, the report will recommend the right practice level without shame.</div>
      <div className="noteBox"><strong>2. Machine Passport</strong><br/>Choose the machine category first, then identify the specific machine and grinder. This is where Ninja, Jura, DeLonghi, Oracle, Meraki, Breville, Decent, and other machine types belong.</div>
      <div className="grid">
        <SelectField label="Machine type" value={profile.machineType} onChange={(v) => updateProfile("machineType", v)} options={machineTypeOptions} />
        <SelectField label="Espresso machine" value={profile.espressoMachine} onChange={(v) => { updateProfile("espressoMachine", v); updateProfile("machine", v); }} options={espressoMachineOptions} />
        <SelectField label="All-in-one / automatic machine" value={profile.allInOneMachine} onChange={(v) => { updateProfile("allInOneMachine", v); if (v) updateProfile("machine", v); }} options={["", ...allInOneOptions]} />
        <Field label="Primary machine shown to Advisor" value={profile.machine} onChange={(v) => updateProfile("machine", v)} />
        <SelectField label="Grinder" value={profile.grinderModel || profile.grinder} onChange={(v) => { updateProfile("grinderModel", v); updateProfile("grinder", v); }} options={grinderOptions} />
        <Field label="Basket size" value={profile.basketSize} onChange={(v) => updateProfile("basketSize", v)} />
        <Field label="Portafilter size" value={profile.portafilterSize} onChange={(v) => updateProfile("portafilterSize", v)} />
        <Field label="Water source" value={profile.waterSource} onChange={(v) => updateProfile("waterSource", v)} />
      </div>
      <label className="label">Machine warm-up / behavior notes</label>
      <textarea value={profile.warmupRoutine} onChange={(e) => updateProfile("warmupRoutine", e.target.value)} placeholder="Example: warms up in 10 minutes, needs portafilter locked in, steam takes 30 seconds…" />
      <div className="noteBox"><strong>Puck Prep / Distribution Toolkit</strong><br/>Capture tamping, distribution, and WDT because channeling, choking, and uneven flow are often puck-prep issues, not only grind issues.</div>
      <div className="grid">
        <Field label="Tamper type / brand" value={profile.tamper} onChange={(v) => updateProfile("tamper", v)} />
        <Field label="Tamper size" value={profile.tamperSize} onChange={(v) => updateProfile("tamperSize", v)} />
        <Field label="Distribution tool" value={profile.distributionTool} onChange={(v) => updateProfile("distributionTool", v)} />
        <Field label="WDT tool / needle style" value={profile.wdtTool} onChange={(v) => updateProfile("wdtTool", v)} />
        <Field label="Puck screen use" value={profile.puckScreen} onChange={(v) => updateProfile("puckScreen", v)} />
        <Field label="Dosing funnel" value={profile.dosingFunnel} onChange={(v) => updateProfile("dosingFunnel", v)} />
      </div>
      <label className="label">Typical puck prep workflow</label>
      <textarea value={profile.puckPrepWorkflow} onChange={(e) => updateProfile("puckPrepWorkflow", e.target.value)} placeholder="Example: dose into funnel, WDT from bottom to top, tap level, tamp once level, add puck screen…" />
      <div className="noteBox"><strong>3. Dial-In Profile / House Formula</strong><br/>This is separate from onboarding. It captures how the machine is currently dialed in so the Advisor can interpret choking, fast shots, sourness, milk issues, and repeatability.</div>
      <div className="grid">
        <Field label="Beans" value={profile.beans} onChange={(v) => updateProfile("beans", v)} />
        <SelectField label="Roast level" value={profile.roastLevel} onChange={(v) => updateProfile("roastLevel", v)} options={roastLevelOptions} />
        <Field label="House dose" value={profile.houseDose} onChange={(v) => updateProfile("houseDose", v)} />
        <Field label="House yield" value={profile.houseYield} onChange={(v) => updateProfile("houseYield", v)} />
        <Field label="House shot time" value={profile.houseShotTime} onChange={(v) => updateProfile("houseShotTime", v)} />
        <Field label="Target ratio" value={profile.targetRatio} onChange={(v) => updateProfile("targetRatio", v)} />
        <Field label="Current grinder setting" value={profile.grinderSetting} onChange={(v) => updateProfile("grinderSetting", v)} />
        <SelectField label="Confirmed recipe / house formula status" value={profile.confirmedRecipe} onChange={(v) => updateProfile("confirmedRecipe", v)} options={confirmedRecipeOptions} />
        <Field label="Last dial-in result" value={profile.lastDialInResult} onChange={(v) => updateProfile("lastDialInResult", v)} />
        <Field label="Milk style / service preference" value={profile.milkStyle} onChange={(v) => updateProfile("milkStyle", v)} />
      </div>
      <label className="label">Dial-in notes</label>
      <textarea value={profile.dialInNotes} onChange={(e) => updateProfile("dialInNotes", e.target.value)} placeholder="Current behavior, last adjustment, what worked, what keeps recurring…" />
      <DialInJournal profile={profile} updateProfile={updateProfile} />
    </div>
    <div className="buttonRow"><button className="primary" onClick={() => setActive("occasions")}>Continue to 21 Occasions</button><button className="secondary" onClick={() => setActive("dialin")}>Open Dial-In Journal</button><button className="secondary" onClick={() => setActive("simulator")}>Go to Advisor Session</button></div>
  </section>;
}


function DialInJournalPage({ profile, updateProfile, setActive }) {
  return <section className="card">
    <p className="eyebrow">Dial-In Journal / House Formula</p>
    <h2>Record attempts, confirm the recipe, and build the second coffee brain.</h2>
    <p className="small">This is the dedicated place to record attempt 1, 2, 3, 4, or 5 while dialing in. Once an attempt works, set it as the House Formula so the Advisor can separate recipe problems from stagecraft problems.</p>
    <DialInJournal profile={profile} updateProfile={updateProfile} />
    <div className="buttonRow"><button className="primary" onClick={() => setActive("simulator")}>Use Journal in Advisor Session</button><button className="secondary" onClick={() => setActive("onboarding")}>Back to Machine Passport</button><button className="secondary" onClick={() => setActive("reports")}>View Doma Reports</button></div>
  </section>;
}

function DialInJournal({ profile, updateProfile }) {
  const attempts = Array.isArray(profile.dialInAttempts) ? profile.dialInAttempts : [];
  function saveAttempt() {
    const attempt = {
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
      beans: profile.beans,
      dose: profile.dialInAttemptDose || profile.houseDose,
      yield: profile.dialInAttemptYield || profile.houseYield,
      shotTime: profile.dialInAttemptTime,
      grind: profile.dialInAttemptGrind || profile.grinderSetting,
      taste: profile.dialInAttemptTaste,
      flow: profile.dialInAttemptFlow,
      puckPrep: profile.dialInAttemptPuckPrep || profile.puckPrepWorkflow,
      advisorNote: profile.dialInAttemptAdvisorNote,
      isHouse: false
    };
    updateProfile("dialInAttempts", [attempt, ...attempts].slice(0, 12));
    updateProfile("lastDialInResult", `Saved dial-in attempt: ${attempt.dose || "?"} in / ${attempt.yield || "?"} out / ${attempt.shotTime || "?"}`);
  }
  function setAsHouse(attempt) {
    updateProfile("houseDose", attempt.dose || profile.houseDose);
    updateProfile("houseYield", attempt.yield || profile.houseYield);
    updateProfile("houseShotTime", attempt.shotTime || profile.houseShotTime);
    updateProfile("grinderSetting", attempt.grind || profile.grinderSetting);
    updateProfile("confirmedRecipe", "Confirmed house formula");
    updateProfile("lastDialInResult", `House Formula confirmed from journal: ${attempt.dose || "?"} in / ${attempt.yield || "?"} out / ${attempt.shotTime || "?"} at grind ${attempt.grind || "?"}`);
    updateProfile("dialInAttempts", attempts.map((a) => ({ ...a, isHouse: a.id === attempt.id })));
  }
  return <section className="dialInJournal">
    <div className="successBox"><strong>Current House Formula</strong><br/>Dose → Yield: {profile.houseDose || "?"} → {profile.houseYield || "?"}<br/>Shot time: {profile.houseShotTime || "Not set"}<br/>Grind setting: {profile.grinderSetting || "Not set"}<br/>Recipe status: {profile.confirmedRecipe || "Not confirmed"}<br/>Last dial-in result: {profile.lastDialInResult || "No journal confirmation yet."}</div>
    <div className="noteBox"><strong>Dial-In Journal</strong><br/>Record each attempt so the Advisor can see whether the recipe is confirmed or still being developed. This is part of the second coffee brain.</div>
    <div className="grid">
      <Field label="Attempt dose" value={profile.dialInAttemptDose} onChange={(v) => updateProfile("dialInAttemptDose", v)} />
      <Field label="Attempt yield" value={profile.dialInAttemptYield} onChange={(v) => updateProfile("dialInAttemptYield", v)} />
      <Field label="Attempt shot time" value={profile.dialInAttemptTime} onChange={(v) => updateProfile("dialInAttemptTime", v)} />
      <Field label="Attempt grind setting" value={profile.dialInAttemptGrind} onChange={(v) => updateProfile("dialInAttemptGrind", v)} />
      <Field label="Taste result" value={profile.dialInAttemptTaste} onChange={(v) => updateProfile("dialInAttemptTaste", v)} />
      <Field label="Flow behavior" value={profile.dialInAttemptFlow} onChange={(v) => updateProfile("dialInAttemptFlow", v)} />
    </div>
    <label className="label">Puck prep notes for this attempt</label>
    <textarea value={profile.dialInAttemptPuckPrep || ""} onChange={(e) => updateProfile("dialInAttemptPuckPrep", e.target.value)} placeholder="WDT, distribution, tamp feel, puck screen, channeling, choking, spraying, or flow notes…" />
    <label className="label">Advisor feedback / next adjustment for this attempt</label>
    <textarea value={profile.dialInAttemptAdvisorNote || ""} onChange={(e) => updateProfile("dialInAttemptAdvisorNote", e.target.value)} placeholder="Example: 18g → 36g in 20 seconds tasted thin; Advisor suggested one step finer and repeat same yield." />
    <div className="buttonRow"><button className="primary" type="button" onClick={saveAttempt}>Save Dial-In Attempt</button></div>
    {attempts.length ? <div className="attemptList">{attempts.map((a) => <div className={a.isHouse ? "successBox" : "noteBox"} key={a.id}><strong>{a.isHouse ? "House Formula · " : ""}{a.createdAt}</strong><br/>{a.beans} · {a.dose} in → {a.yield} out · {a.shotTime} · grind {a.grind}<br/><strong>Taste:</strong> {a.taste}<br/><strong>Flow:</strong> {a.flow}<br/><strong>Puck prep:</strong> {a.puckPrep}<br/><strong>Advisor:</strong> {a.advisorNote}<div className="buttonRow"><button className="secondary green" type="button" onClick={() => setAsHouse(a)}>Set as House Formula</button></div></div>)}</div> : <p className="small">No dial-in attempts saved yet.</p>}
  </section>;
}

function SelectField({ label, value, onChange, options }) {
  function handleSelect(e) { onChange(e.currentTarget.value); }
  return <div><label className="label">{label}</label><select value={value || ""} onChange={handleSelect} onInput={handleSelect}>{options.map((option) => <option key={option || "blank"} value={option}>{option || "Select…"}</option>)}</select></div>;
}


function OccasionsLibrary({ founderOccasions, openFounderOccasion, selectedOccasionId, setSelectedOccasionId }) {
  const [query, setQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("All");
  const [quickPick, setQuickPick] = useState(selectedOccasionId || founderOccasions[0]?.id || "");
  useEffect(() => {
    if (selectedOccasionId && selectedOccasionId !== quickPick) setQuickPick(selectedOccasionId);
  }, [selectedOccasionId]);
  function handleQuickPick(value) {
    setQuickPick(value);
    if (setSelectedOccasionId) setSelectedOccasionId(value);
    try { localStorage.setItem("bd_selected_occasion_v83", value); } catch {}
  }
  const families = ["All", "Core Occasions", "Modern Sensory Occasions"];
  const filtered = founderOccasions.filter((item) => {
    const q = query.trim().toLowerCase();
    const familyName = item.family || "Core Occasions";
    const haystack = `${item.name} ${item.tag} ${item.family || "Core Occasions"} ${item.purpose} ${item.drink} ${item.desiredFeeling}`.toLowerCase();
    return (familyFilter === "All" || familyFilter === familyName) && (!q || haystack.includes(q));
  });
  const selected = founderOccasions.find((item) => item.id === quickPick) || founderOccasions[0];
  return <section className="occasionPage">
    <section className="card heroMini">
      <p className="eyebrow">21 Founder Occasions</p>
      <h2>Twenty-one stagecraft Occasions: 15 Core Occasions plus 6 Modern Sensory Occasions.</h2>
      <p className="small">Use the quick selector to jump directly into an Occasion on mobile, or browse the full card library below.</p>
      <div className="selectorPanel">
        <label className="label">Occasion quick-select menu</label>
        <div className="selectorRow"><select value={quickPick} onChange={(e) => handleQuickPick(e.target.value)}>{founderOccasions.map((item, i) => <option key={item.id} value={item.id}>{i + 1}. {item.name} — {item.drink}</option>)}</select><button className="primary" onClick={() => openFounderOccasion(selected)}>Open Selected Occasion</button></div>
        <div className="selectorRow"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find an occasion: matcha, guest, cold, apology, social…" /><select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)}>{families.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
      </div>
    </section>
    <div className="occasionGrid">
      {filtered.map((item, index) => <article className="occasionCard" key={item.id}>
        <div className="occasionTop"><span>Occasion {founderOccasions.findIndex((x)=>x.id===item.id) + 1}</span><em>{item.family || item.tag}</em></div>
        <h3>{item.name}</h3>
        <p>{item.purpose}</p>
        <div className="specs"><p><strong>Drink / drink set</strong><span>{item.drink}</span></p><p><strong>Drink choices</strong><span>{item.drinkChoices}</span></p><p><strong>Dose → Yield</strong><span>{item.dose} → {item.yield}</span></p><p><strong>Suggested Tempo</strong><span>{item.suggestedTempo || item.time}</span></p><p><strong>Ratio / Build</strong><span>{item.ratioGuidance || item.grindVessel}</span></p></div>
        <div className="scriptPreview"><strong>Artisan opening to guest</strong><p>{item.artisanOpening}</p></div>
        <div className="buttonRow"><button className="primary" onClick={() => openFounderOccasion(item)}>Open Occasion</button><button className="secondary" onClick={() => openFounderOccasion(item)}>Mark Complete</button></div>
      </article>)}
    </div>
  </section>;
}

function OccasionWalkthrough({ occasionItem, currentStepIndex, setCurrentStepIndex, setActive, setTranscript, createReport, stepTimings, setStepTimings, occasionStartTime, profile, occasion, updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry, setStatus, setAdvisorText, setMatrixMatch, setSynthesis }) {
  const steps = occasionItem.steps || [];
  const safeIndex = Math.min(Math.max(Number(currentStepIndex) || 0, 0), Math.max(steps.length - 1, 0));
  const current = steps[safeIndex] || steps[0];
  const [timerVisible, setTimerVisible] = useState(true);
  const [stepStart, setStepStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [stepReadBusy, setStepReadBusy] = useState(false);
  const [stepAudioUrl, setStepAudioUrl] = useState("");
  const stepAudioRef = useRef(null);
  const stepPanelRef = useRef(null);

  useEffect(() => {
    if (safeIndex !== currentStepIndex) setCurrentStepIndex(safeIndex);
  }, [safeIndex, currentStepIndex, setCurrentStepIndex]);

  useEffect(() => {
    setStepStart(null);
    setElapsed(0);
    if (stepPanelRef.current) stepPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [safeIndex, occasionItem?.id]);

  useEffect(() => {
    if (!stepStart) return;
    const id = setInterval(() => setElapsed(Math.max(0, Math.round((Date.now() - stepStart) / 1000))), 1000);
    return () => clearInterval(id);
  }, [stepStart]);

  function goToStep(index) {
    const next = Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0));
    setCurrentStepIndex(next);
  }

  function startStep() {
    setStepStart(Date.now());
    setElapsed(0);
  }

  function buildStepReadText(step = current) {
    return [
      `Barista Doma Occasion: ${occasionItem.name}.`,
      `Step ${safeIndex + 1} of ${steps.length}: ${step?.title || "Stagecraft step"}.`,
      step?.suggestedTempo ? `Suggested tempo: ${step.suggestedTempo}.` : "",
      step?.action ? `Action: ${step.action}` : "",
      step?.why ? `Why this matters: ${step.why}` : "",
      step?.watch ? `What to watch: ${step.watch}` : "",
      step?.advisor ? `Advisor guidance: ${step.advisor}` : "",
      step?.script ? `Artisan stagecraft script: ${step.script}` : ""
    ].filter(Boolean).join("\n");
  }

  async function readCurrentStep() {
    setStepReadBusy(true);
    setStepAudioUrl("");
    try {
      const started = speakFastLocal(buildStepReadText(current), { rate: 1.02 });
      if (!started) throw new Error("This browser did not expose local speech synthesis.");
      setStepAudioUrl("__local_voice__");
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setStepReadBusy(false);
    }
  }

  async function readFullOccasionScript() {
    setStepReadBusy(true);
    setStepAudioUrl("");
    try {
      const started = speakFastLocal(`Full Barista Doma stagecraft script for ${occasionItem.name}.\n\n${scriptText}`, { rate: 1.02 });
      if (!started) throw new Error("This browser did not expose local speech synthesis.");
      setStepAudioUrl("__local_voice__");
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setStepReadBusy(false);
    }
  }

  function stopStepReading() {
    stopFastLocalSpeech();
    if (stepAudioRef.current) {
      stepAudioRef.current.pause();
      stepAudioRef.current.currentTime = 0;
    }
    setStepAudioUrl("");
  }

  function completeStep() {
    const actualSeconds = stepStart ? Math.max(1, Math.round((Date.now() - stepStart) / 1000)) : (stepTimings[safeIndex]?.actualSeconds || Math.max(1, elapsed || 1));
    setStepTimings((prev) => ({ ...prev, [safeIndex]: { step: current?.title, suggestedTempo: current?.suggestedTempo || "60–90 sec", actualSeconds, completedAt: new Date().toISOString() } }));
    setStepStart(null);
    if (safeIndex < steps.length - 1) {
      setCurrentStepIndex(safeIndex + 1);
    } else {
      setActive("tasting");
    }
  }

  const scriptText = steps.map((step, idx) => `${idx + 1}. ${step.title}\nAction: ${step.action || ""}\nAdvisor: ${step.advisor}\nArtisan Script: ${step.script}`).join("\n\n");
  const timingMetrics = buildTimingMetrics(occasionItem, stepTimings, occasionStartTime);
  const [stepAdvisorEnabled, setStepAdvisorEnabled] = useState(false);
  const [stepAdvisorListening, setStepAdvisorListening] = useState(false);
  const [stepAdvisorTranscript, setStepAdvisorTranscript] = useState("");
  const [stepAdvisorReply, setStepAdvisorReply] = useState("Say “Advisor” while this step is open. I will answer in the context of this exact Occasion step.");
  const [stepAdvisorFields, setStepAdvisorFields] = useState([]);
  const [stepPlacementNotice, setStepPlacementNotice] = useState("No Advisor capture has been routed yet for this step.");
  const [stepCaptureLedger, setStepCaptureLedger] = useState([]);
  const [stepReview, setStepReview] = useState(null);
  const [stepReviewConfirmed, setStepReviewConfirmed] = useState(false);
  const [advisementOutcome, setAdvisementOutcome] = useState("");
  const [communityLearningNote, setCommunityLearningNote] = useState("");
  const [stepVoiceEnabled, setStepVoiceEnabled] = useState(true);
  const [stepVoicePaused, setStepVoicePaused] = useState(false);
  const [stepVoiceStatus, setStepVoiceStatus] = useState("Voice ready.");
  const [lastSpokenAdvisement, setLastSpokenAdvisement] = useState("");
  const stepRecognitionRef = useRef(null);
  const stepAdvisorEnabledRef = useRef(false);
  const stepAdvisorAwaitingInputRef = useRef(false);
  const stepAdvisorSuppressUntilRef = useRef(0);
  const stepAdvisorLastWakeAtRef = useRef(0);
  const stepAdvisorRestartTimerRef = useRef(null);
  const stepAdvisorSpeechFallbackRef = useRef(null);
  const stepAdvisorSpeakingRef = useRef(false);
  const stepAdvisorConversationPhaseRef = useRef("wake");
  const stepAdvisorPendingDecisionRef = useRef(null);
  const [stepAdvisorPhase, setStepAdvisorPhase] = useState("Wake word mode");
  const [stepAdvisorPendingDecision, setStepAdvisorPendingDecision] = useState(null);
  const [stepAdvisorManualInput, setStepAdvisorManualInput] = useState("");
  const [stepSpeechDebug, setStepSpeechDebug] = useState([]);
  const [stepTapToSpeakStatus, setStepTapToSpeakStatus] = useState("Tap-to-speak ready.");
  const [stepAudioRecordStatus, setStepAudioRecordStatus] = useState("Recorded audio path ready.");
  const [stepAudioRecording, setStepAudioRecording] = useState(false);
  const [pendingAudioTranscript, setPendingAudioTranscript] = useState("");
  const [editableAudioTranscript, setEditableAudioTranscript] = useState("");
  const [transcriptGateStatus, setTranscriptGateStatus] = useState("No transcript waiting for confirmation.");
  const [icySessionActive, setIcySessionActive] = useState(false);
  const [icySessionStatus, setIcySessionStatus] = useState("ICY session is off.");
  const [icySessionPhase, setIcySessionPhase] = useState("idle");
  const [icySessionLastTranscript, setIcySessionLastTranscript] = useState("");
  const icySessionActiveRef = useRef(false);
  const icySessionRecorderRef = useRef(null);
  const icySessionStreamRef = useRef(null);
  const icySessionChunksRef = useRef([]);
  const icySessionListenTimerRef = useRef(null);
  const stepAdvisorRestartCountRef = useRef(0);
  const stepTapRecognitionRef = useRef(null);
  const stepMediaRecorderRef = useRef(null);
  const stepAudioChunksRef = useRef([]);

  function pushStepSpeechDebug(message) {
    const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
    setStepSpeechDebug((prev) => [`${stamp} — ${message}`, ...prev].slice(0, 10));
  }

  function beginFreshStepAdvisementIssue(source = "voice") {
    // Start a new issue without leaving the Occasion/step. This prevents old guidance such as
    // "messy puck" from leaking into a new issue like "loaded fast" or "very bitter."
    stepAdvisorConversationPhaseRef.current = "awaiting_input";
    stepAdvisorAwaitingInputRef.current = true;
    stepAdvisorPendingDecisionRef.current = null;
    setStepAdvisorPendingDecision(null);
    setStepAdvisorPhase(`Fresh ${source} advisement issue`);
    setStepReview(null);
    setStepReviewConfirmed(false);
    setAdvisementOutcome("");
    setCommunityLearningNote("");
    setStepAdvisorFields([]);
    setStepPlacementNotice("Fresh ICY capture started for this step. No prior issue is being reused.");
  }

  function submitStepAdvisorManualInput() {
    const text = String(stepAdvisorManualInput || "").trim();
    if (!text) {
      setStatus?.("Type what you said to ICY, then press Send to ICY.");
      return;
    }
    pushStepSpeechDebug(`manual send: ${text}`);
    setStepAdvisorManualInput("");
    beginFreshStepAdvisementIssue("typed");
    handleStepAdvisorText(text);
  }

  function resetStepAdvisorCapture() {
    stepAdvisorConversationPhaseRef.current = "wake";
    stepAdvisorAwaitingInputRef.current = false;
    stepAdvisorPendingDecisionRef.current = null;
    setStepAdvisorPendingDecision(null);
    setStepAdvisorPhase("Wake word mode");
    setStepAdvisorTranscript("");
    setStepAdvisorReply("Fresh ICY capture cleared for this step. Say “Hey ICY” or type a new issue.");
    setStepAdvisorFields([]);
    setStepPlacementNotice("No ICY capture has been routed yet for this step.");
    setStepReview(null);
    setStepReviewConfirmed(false);
    setAdvisementOutcome("");
    setCommunityLearningNote("");
    setLastSpokenAdvisement("");
    setPendingAudioTranscript("");
    setEditableAudioTranscript("");
    setTranscriptGateStatus("No transcript waiting for confirmation.");
    setStepVoiceStatus("Voice ready.");
    pushStepSpeechDebug("manual reset: cleared current ICY capture for this step");
  }




  function clearIcySessionTimer() {
    try { if (icySessionListenTimerRef.current) clearTimeout(icySessionListenTimerRef.current); } catch {}
    icySessionListenTimerRef.current = null;
  }

  async function transcribeAudioBlobForIcy(blob, source = "session") {
    if (!blob || !blob.size) throw new Error("No audio was captured.");
    const form = new FormData();
    form.append("audio", blob, `icy-${source}-audio.webm`);
    const response = await fetch("/api/transcribe", { method: "POST", body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.detail || data?.error || `Transcription failed with HTTP ${response.status}`);
    return String(data?.text || "").trim();
  }

  async function startIcyNoHandsSession() {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) throw new Error("This browser does not support microphone recording. Use Type to ICY.");
      try { stepRecognitionRef.current?.stop?.(); } catch {}
      try { stepTapRecognitionRef.current?.stop?.(); } catch {}
      clearStepAdvisorRestartTimer();
      clearIcySessionTimer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      icySessionStreamRef.current = stream;
      icySessionActiveRef.current = true;
      setIcySessionActive(true);
      setIcySessionPhase("ready");
      setIcySessionStatus("ICY session started. I’ll stay with you on this step. Speak when the listening window opens.");
      setStepAdvisorPhase("ICY no-hands session active");
      stepAdvisorConversationPhaseRef.current = "awaiting_input";
      stepAdvisorAwaitingInputRef.current = true;
      pushStepSpeechDebug("no-hands session started");
      speakStepAdvisor("I’m here. I’ll stay with you on this step. Tell me what happens.", { resumeListening: false, updateDisplay: false, forceVoice: true });
      icySessionListenTimerRef.current = setTimeout(() => startIcySessionListeningWindow(), 1800);
    } catch (err) {
      icySessionActiveRef.current = false;
      setIcySessionActive(false);
      setIcySessionPhase("error");
      setIcySessionStatus(`Could not start ICY session: ${err.message || String(err)}`);
      pushStepSpeechDebug(`no-hands session start failed: ${err.message || String(err)}`);
    }
  }

  function stopIcyNoHandsSession() {
    icySessionActiveRef.current = false;
    setIcySessionActive(false);
    setIcySessionPhase("closed");
    clearIcySessionTimer();
    try { icySessionRecorderRef.current?.stop?.(); } catch {}
    try { icySessionStreamRef.current?.getTracks?.().forEach((track) => track.stop()); } catch {}
    icySessionRecorderRef.current = null;
    icySessionStreamRef.current = null;
    setIcySessionStatus("ICY session stopped. Advisement state remains on the step.");
    pushStepSpeechDebug("no-hands session stopped");
  }

  function startIcySessionListeningWindow() {
    if (!icySessionActiveRef.current) return;
    try {
      const stream = icySessionStreamRef.current;
      if (!stream) throw new Error("No active microphone stream. Restart ICY session.");
      const preferredType = MediaRecorder.isTypeSupported?.("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: preferredType });
      icySessionChunksRef.current = [];
      icySessionRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) icySessionChunksRef.current.push(event.data);
      };
      recorder.onstart = () => {
        setIcySessionPhase("listening");
        setIcySessionStatus("Listening now. Speak naturally. ICY will process the phrase automatically.");
        pushStepSpeechDebug("no-hands listening window started");
      };
      recorder.onerror = (event) => {
        const err = event?.error?.message || "recording error";
        setIcySessionStatus(`No-hands recording error: ${err}`);
        pushStepSpeechDebug(`no-hands recording error: ${err}`);
      };
      recorder.onstop = async () => {
        if (!icySessionActiveRef.current) return;
        const chunks = icySessionChunksRef.current || [];
        const blob = chunks.length ? new Blob(chunks, { type: chunks[0]?.type || "audio/webm" }) : null;
        if (!blob || !blob.size) {
          setIcySessionStatus("No speech captured. Listening again.");
          pushStepSpeechDebug("no-hands captured empty audio");
          icySessionListenTimerRef.current = setTimeout(() => startIcySessionListeningWindow(), 900);
          return;
        }
        try {
          setIcySessionPhase("transcribing");
          setIcySessionStatus(`Transcribing no-hands audio (${Math.round(blob.size / 1024)} KB)…`);
          const transcriptText = await transcribeAudioBlobForIcy(blob, "session");
          if (!transcriptText) {
            setIcySessionStatus("No transcript returned. Listening again.");
            pushStepSpeechDebug("no-hands transcript empty");
            icySessionListenTimerRef.current = setTimeout(() => startIcySessionListeningWindow(), 900);
            return;
          }
          setIcySessionLastTranscript(transcriptText);
          setIcySessionStatus(`Heard: ${transcriptText}`);
          pushStepSpeechDebug(`no-hands transcript: ${transcriptText}`);
          setIcySessionPhase("thinking");
          // In session mode, do not require transcript confirmation. The goal is hands-free flow.
          stepAdvisorAwaitingInputRef.current = true;
          await handleStepAdvisorText(transcriptText);
          if (icySessionActiveRef.current) {
            setIcySessionPhase("waiting");
            setIcySessionStatus("ICY responded. Listening will reopen for your next phrase.");
            icySessionListenTimerRef.current = setTimeout(() => startIcySessionListeningWindow(), 2800);
          }
        } catch (err) {
          setIcySessionPhase("error");
          setIcySessionStatus(`No-hands transcription/advisement failed: ${err.message || String(err)}. Listening again shortly.`);
          pushStepSpeechDebug(`no-hands failed: ${err.message || String(err)}`);
          if (icySessionActiveRef.current) icySessionListenTimerRef.current = setTimeout(() => startIcySessionListeningWindow(), 1800);
        }
      };
      recorder.start();
      // This is a practical listening window for prototype use. The artisan can speak a phrase without touching the phone.
      icySessionListenTimerRef.current = setTimeout(() => {
        try { if (recorder.state !== "inactive") recorder.stop(); } catch {}
      }, 6500);
    } catch (err) {
      setIcySessionPhase("error");
      setIcySessionStatus(`Could not open listening window: ${err.message || String(err)}`);
      pushStepSpeechDebug(`no-hands listening start failed: ${err.message || String(err)}`);
    }
  }

  async function startRecordedAudioToIcy() {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) throw new Error("This browser does not support microphone recording. Use Type to ICY.");
      // Stop browser speech recognition paths; this uses recorded audio + /api/transcribe instead.
      try { stepRecognitionRef.current?.stop?.(); } catch {}
      try { stepTapRecognitionRef.current?.stop?.(); } catch {}
      clearStepAdvisorRestartTimer();
      stepAdvisorEnabledRef.current = false;
      setStepAdvisorEnabled(false);
      setStepAdvisorListening(false);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = MediaRecorder.isTypeSupported?.("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: preferredType });
      stepAudioChunksRef.current = [];
      stepMediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) stepAudioChunksRef.current.push(event.data);
      };
      recorder.onstart = () => {
        setStepAudioRecording(true);
        setStepAudioRecordStatus("Recording. Say the full issue now, then tap Stop + Transcribe.");
        pushStepSpeechDebug("recorded-audio start");
      };
      recorder.onerror = (event) => {
        const err = event?.error?.message || "recording error";
        setStepAudioRecordStatus(`Recording error: ${err}`);
        pushStepSpeechDebug(`recorded-audio error: ${err}`);
      };
      recorder.onstop = () => {
        try { stream.getTracks().forEach((track) => track.stop()); } catch {}
        setStepAudioRecording(false);
      };
      recorder.start();
    } catch (err) {
      setStepAudioRecording(false);
      setStepAudioRecordStatus(err.message || String(err));
      pushStepSpeechDebug(`recorded-audio start failed: ${err.message || String(err)}`);
    }
  }

  async function stopRecordedAudioAndSendToIcy() {
    try {
      const recorder = stepMediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") {
        setStepAudioRecordStatus("No active recording found. Tap Record Audio to ICY first.");
        return;
      }
      setStepAudioRecordStatus("Stopping recording and preparing transcription…");
      const stopped = new Promise((resolve) => {
        const previous = recorder.onstop;
        recorder.onstop = (event) => {
          try { previous?.(event); } catch {}
          resolve();
        };
      });
      recorder.stop();
      await stopped;
      const chunks = stepAudioChunksRef.current || [];
      if (!chunks.length) {
        setStepAudioRecordStatus("Recording stopped, but no audio chunks were captured.");
        return;
      }
      const blob = new Blob(chunks, { type: chunks[0]?.type || "audio/webm" });
      if (!blob.size) {
        setStepAudioRecordStatus("Recording was empty. Try again and speak closer to the microphone.");
        return;
      }
      setStepAudioRecordStatus(`Transcribing recorded audio (${Math.round(blob.size / 1024)} KB)…`);
      pushStepSpeechDebug(`recorded-audio upload: ${blob.size} bytes`);
      const form = new FormData();
      form.append("audio", blob, "icy-step-audio.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.detail || data?.error || `Transcription failed with HTTP ${response.status}`);
      const transcriptText = String(data?.text || "").trim();
      if (!transcriptText) {
        setStepAudioRecordStatus("Transcription returned no text. Try again or use Type to ICY.");
        pushStepSpeechDebug("recorded-audio transcript empty");
        return;
      }
      setStepAudioRecordStatus(`Transcribed and waiting for confirmation: ${transcriptText}`);
      setPendingAudioTranscript(transcriptText);
      setEditableAudioTranscript(transcriptText);
      setTranscriptGateStatus("Transcript ready. Confirm, edit, re-record, or cancel before ICY advises.");
      pushStepSpeechDebug(`recorded-audio transcript waiting for confirmation: ${transcriptText}`);
    } catch (err) {
      setStepAudioRecording(false);
      setStepAudioRecordStatus(`Recorded audio path failed: ${err.message || String(err)}. Use Type to ICY if needed.`);
      pushStepSpeechDebug(`recorded-audio failed: ${err.message || String(err)}`);
    }
  }


  function useConfirmedAudioTranscript(textOverride = "") {
    const text = String(textOverride || editableAudioTranscript || pendingAudioTranscript || "").trim();
    if (!text) {
      setTranscriptGateStatus("No transcript to send. Record again or type directly to ICY.");
      return;
    }
    setTranscriptGateStatus(`Confirmed transcript sent to ICY: ${text}`);
    setStepAudioRecordStatus(`Using confirmed transcript: ${text}`);
    pushStepSpeechDebug(`confirmed recorded transcript: ${text}`);
    setPendingAudioTranscript("");
    setEditableAudioTranscript("");
    beginFreshStepAdvisementIssue("confirmed-recorded-audio");
    handleStepAdvisorText(text);
  }

  function cancelAudioTranscriptGate() {
    setPendingAudioTranscript("");
    setEditableAudioTranscript("");
    setTranscriptGateStatus("Transcript canceled. Record again, type to ICY, or continue the step.");
    setStepAudioRecordStatus("Recorded transcript canceled before sending to ICY.");
    pushStepSpeechDebug("recorded-audio transcript canceled");
  }

  function rerecordAudioTranscript() {
    setPendingAudioTranscript("");
    setEditableAudioTranscript("");
    setTranscriptGateStatus("Ready to re-record. Tap Record Audio to ICY.");
    setStepAudioRecordStatus("Ready to re-record.");
    pushStepSpeechDebug("recorded-audio transcript cleared for re-record");
  }

  function startTapToSpeakIcy() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) throw new Error("This browser does not expose speech recognition. Use Chrome on HTTPS, or use Type to ICY.");
      // Stop the continuous wake-word recognizer so it cannot abort-loop against one-shot capture.
      try { stepRecognitionRef.current?.stop?.(); } catch {}
      clearStepAdvisorRestartTimer();
      stepAdvisorEnabledRef.current = false;
      setStepAdvisorListening(false);

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      let finalPhrase = "";
      setStepTapToSpeakStatus("Tap-to-speak listening now. Say the full issue in one phrase.");
      pushStepSpeechDebug("tap-to-speak start requested");

      recognition.onstart = () => {
        setStepTapToSpeakStatus("Listening. Say the full issue now.");
        pushStepSpeechDebug("tap-to-speak recognition started");
      };
      recognition.onspeechstart = () => {
        setStepTapToSpeakStatus("Speech detected. Keep talking until the issue is complete.");
        pushStepSpeechDebug("tap-to-speak speech detected");
      };
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const phrase = event.results[i][0]?.transcript || "";
          const finalFlag = Boolean(event.results[i].isFinal);
          pushStepSpeechDebug(`${finalFlag ? "tap final" : "tap interim"} transcript: ${phrase}`);
          if (finalFlag) finalPhrase = phrase;
          else if (!finalPhrase) setStepTapToSpeakStatus(`Heard so far: ${phrase}`);
        }
      };
      recognition.onerror = (event) => {
        const err = event?.error || "unknown";
        setStepTapToSpeakStatus(`Tap-to-speak recognition issue: ${err}. Use Type to ICY if needed.`);
        pushStepSpeechDebug(`tap-to-speak error: ${err}`);
      };
      recognition.onend = () => {
        const phrase = String(finalPhrase || "").trim();
        pushStepSpeechDebug(`tap-to-speak ended; final="${phrase || "(none)"}"`);
        if (phrase) {
          setStepTapToSpeakStatus(`Captured: ${phrase}`);
          beginFreshStepAdvisementIssue("tap-to-speak");
          handleStepAdvisorText(phrase);
        } else {
          setStepTapToSpeakStatus("No final phrase captured. Try Tap to Speak again or use Type to ICY.");
        }
      };
      stepTapRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setStepTapToSpeakStatus(err.message || String(err));
      pushStepSpeechDebug(`tap-to-speak start failed: ${err.message || String(err)}`);
    }
  }

  function buildStepCaptureRouting(artisanText, changed = []) {
    const lower = String(artisanText || "").toLowerCase();
    const routes = [];
    const add = (label, detail) => { if (!routes.some((r) => r.label === label)) routes.push({ label, detail }); };
    if (changed.some((x) => /dose|yield|shot time|grind|preference|serve again|next adjustment/i.test(x))) add("Step Telemetry / Shot Pull fields", "Visible in this step panel and carried into the Doma Report telemetry snapshot.");
    if (changed.some((x) => /taste|tasting/i.test(x)) || /liked|taste|sweet|bitter|sour|bright|thin|smooth|body|watery|creamy/i.test(lower)) add("Taste Notes", "Visible in this step capture ledger and available for the Tasting Studio / Doma Report narrative.");
    if (/runny|watery|thin|fast|gush|few drops|no flow|bitter|sour|sharp|chok|stalled|problem|wrong|messy|puck|soupy|wet puck|fractured/i.test(lower)) add("Recovery / Issue Notes", "Visible here, sent to the Recovery context, and retained for the Doma Report if you create one.");
    if (changed.some((x) => /guest/i.test(x)) || /guest|served|liked it|loved it|reaction|resonance/i.test(lower)) add("Guest Resonance", "Visible in Guest Resonance context and included in the Doma Report when captured.");
    if (!routes.length) add("Step Notes", "Visible in this step capture ledger and included as Occasion context for the report.");
    return routes;
  }

  function isArtisanDecisionAcknowledgment(text) {
    const lower = String(text || "").toLowerCase().trim();
    return /\b(ok|okay|yes|yeah|yep|correct|right|that is right|sounds good|i will|i'll|i am going to|i'm going to|that's what|that is what|do that|try that|i’ll try|i will try|let's do|lets do|accepted|confirm)\b/.test(lower);
  }

  function isArtisanNoMore(text) {
    const lower = String(text || "").toLowerCase().trim();
    return /^(no|nope|nothing else|that is all|that's all|i'm good|im good|we're good|were good|all good|done|move on|next step)$/i.test(lower) || /\b(no nothing else|nothing else|that'?s all|all good|i'm good|im good|move on|next step)\b/i.test(lower);
  }

  function summarizeArtisanDecision(text, pending) {
    const raw = String(text || "").trim();
    if (!raw) return pending?.suggestedAction || "artisan accepted the recommended next move";
    if (/i will|i'll|i am going to|i'm going to|try|do that|let's do|lets do/i.test(raw)) return raw;
    return pending?.suggestedAction || raw;
  }

  function inferSuggestedActionFromGuidance(guidance, artisanText) {
    const lower = String(`${guidance || ""} ${artisanText || ""}`).toLowerCase();
    if (/one step finer|finer/.test(lower)) return "Keep the dose steady and try one small step finer, then taste again.";
    if (/one step coarser|coarser/.test(lower)) return "Keep the dose steady and try one small step coarser, then taste again.";
    if (/shorter yield|shorter/.test(lower)) return "Try a slightly shorter yield while keeping the dose steady.";
    if (/longer yield|extend|more yield/.test(lower)) return "Try a slightly longer yield while keeping the dose steady.";
    if (/puck|distribution|tamp|headspace|channel/.test(lower)) return "Check distribution, tamp level, and headspace before changing multiple variables.";
    if (/script|guest|serve|occasion|stagecraft/.test(lower)) return "Use the suggested stagecraft script and keep the first sip focused on the guest.";
    if (/like|liked|preference|acceptable|would serve/.test(lower)) return "Save this as a preference note and keep the recipe steady for the next comparison.";
    return "Use the contextual guidance from ICY as the next move, then taste and report back.";
  }

  function isTroubleshootingContinuation(text) {
    const lower = String(text || "").toLowerCase();
    return /already tried|i tried|we tried|tried that|did that|still|same problem|didn'?t work|did not work|nothing changed|no change|still bitter|still sour|still thin|still fast|still weak|not better|made it worse|same result/.test(lower);
  }

  function buildTroubleshootingContinuationGuidance(responseText, pending = {}) {
    const original = String(pending?.transcript || "").toLowerCase();
    const response = String(responseText || "").toLowerCase();
    const combined = `${original} ${response} ${pending?.guidance || ""}`.toLowerCase();
    const routeLabels = pending?.routingLabels?.length ? pending.routingLabels.join(" + ") : "Step Notes + Advisor Guidance + Doma Report context";
    let nextMove = "";
    let checklist = "";

    if (/bitter|harsh|dry|ashy/.test(combined)) {
      nextMove = "Since the first move did not solve the bitterness, do not keep changing randomly. Check whether the bitterness is dry/astringent or just roast bitterness. Next, compare the actual yield and time to your house formula. If it is dry and long, try a shorter yield. If it is still harsh at normal yield, try slightly coarser or lower temperature if your machine supports it.";
      checklist = "Tell me: was the finish dry and lingering, what was the yield, and did the time run longer than usual?";
    } else if (/fast|thin|watery|weak|ran fast|loaded fast|flow/.test(combined)) {
      nextMove = "Since the first move did not solve the fast/thin result, keep dose steady and check whether the flow was fast from the start or broke open after a few seconds. If it was fast from the start, go one small step finer if your machine allows it. If it broke open later, focus on distribution, tamp level, and channeling before changing several settings.";
      checklist = "Tell me: fast from the start or fast after blonding, what was shot time, and did it taste sour, hollow, or just light?";
    } else if (/puck|channel|spray|messy/.test(combined)) {
      nextMove = "Since the puck/flow issue repeated, move from visual inspection to cause isolation. Do not judge the puck alone. Check cup taste and flow behavior. If there was spraying or channeling, inspect distribution, tamp level, headspace, basket dose, and puck screen before changing grind.";
      checklist = "Tell me: did the cup taste bad, did you see spraying/channeling, and did the issue repeat twice?";
    } else if (/sour|sharp|acid/.test(combined)) {
      nextMove = "Since the first move did not solve sourness, check whether this is pleasant brightness or sharp under-extraction. If it is sharp and thin, you likely need more extraction: finer grind or slightly longer yield, depending on your machine controls. Change only one variable.";
      checklist = "Tell me: was it thin, what was the yield/time, and did sweetness improve or stay flat?";
    } else {
      nextMove = "Since you already tried the first suggestion and it did not resolve the issue, we should continue the advisement workflow instead of closing it. I need to isolate what changed, what stayed the same, and what the cup tasted like after the attempt.";
      checklist = "Tell me what you tried, what changed in the cup or flow, and whether the result improved, stayed the same, or got worse.";
    }

    return `Got it — you already tried the first suggestion and it did not resolve the issue. I will not close this advisement yet. I’m logging that as troubleshooting continuation under ${routeLabels}. ${nextMove} ${checklist}`;
  }

  function buildDecisionCloseoutText(decisionText, pending) {
    const chosen = summarizeArtisanDecision(decisionText, pending);
    const routeLabels = pending?.routingLabels?.length ? pending.routingLabels.join(" + ") : "Step Notes + Advisor Guidance + Doma Report context";
    return `Got it. I am logging your chosen next move as: ${chosen}. I am attaching it to ${routeLabels}, Advisor Guidance for This Step, and the Doma Report context. Anything else before we close this step?`;
  }

  function buildFinalCloseoutText(pending) {
    const routeLabels = pending?.routingLabels?.length ? pending.routingLabels.join(" + ") : "Step Notes + Advisor Guidance + Doma Report context";
    return `Okay. I logged the observation, ICY guidance, and your chosen next move under ${routeLabels}. You can review it in the In-Step Report Review. After you try the next move, come back and tell me what happened so I can log the outcome and help the Home Barista IQ community get smarter. When you are ready, repeat this step or move to the next step.`;
  }

  function buildCommunityLearningPayload({ outcomeText = "", pending = {}, review = {} } = {}) {
    return {
      occasion: occasionItem?.name,
      occasionId: occasionItem?.id,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      machineType: profile?.machineType || "",
      machine: profile?.machine || profile?.espressoMachine || profile?.allInOneMachine || "",
      grinder: profile?.grinder || profile?.grinderModel || "",
      houseFormula: `${profile?.houseDose || "?"} in → ${profile?.houseYield || "?"} out · ${profile?.houseShotTime || "?"}`,
      artisanIssue: pending?.transcript || review?.transcript || "",
      icyGuidance: pending?.guidance || review?.advisorGuidance || "",
      artisanDecision: pending?.decisionText || review?.suggestedAction || "",
      outcome: outcomeText,
      learningUse: "Aggregate/de-identified advisement workflow pattern for future ICY guidance, recovery recommendations, Machine Passport patterns, taste preference patterns, and community intelligence."
    };
  }

  function logAdvisementOutcome(outcomeText) {
    const outcome = String(outcomeText || advisementOutcome || "").trim();
    if (!outcome) {
      setCommunityLearningNote("Add what happened after trying the next move, then log the outcome.");
      return;
    }
    const pending = stepAdvisorPendingDecisionRef.current || stepAdvisorPendingDecision || {};
    const payload = buildCommunityLearningPayload({ outcomeText: outcome, pending, review: stepReview || {} });
    setCommunityLearningNote("Outcome logged for this step. This becomes part of the advisement workflow learning pattern for you and the broader Home Barista IQ community.");
    setStepReview((prev) => prev ? {
      ...prev,
      outcome,
      communityLearningPayload: payload,
      reportStatus: `${prev.reportStatus || "Marked for report."} Outcome feedback was logged for future ICY/community learning.`
    } : prev);
    setStepCaptureLedger((prev) => [{
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      occasion: occasionItem.name,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      transcript: `Advisement outcome: ${outcome}`,
      fields: ["Outcome feedback", "Community learning pattern"],
      routes: [{ label: "Advisement Outcome / Community Learning", detail: "Outcome retained as report context and future intelligence signal." }],
      advisorGuidance: "Outcome feedback captured for this advisement workflow."
    }, ...prev].slice(0, 8));
    recordTelemetry?.("advisement_outcome_logged", payload);
  }

  function clearStepAdvisorRestartTimer() {
    try { if (stepAdvisorRestartTimerRef.current) clearTimeout(stepAdvisorRestartTimerRef.current); } catch {}
    stepAdvisorRestartTimerRef.current = null;
  }

  function clearStepAdvisorSpeechFallback() {
    try { if (stepAdvisorSpeechFallbackRef.current) clearTimeout(stepAdvisorSpeechFallbackRef.current); } catch {}
    stepAdvisorSpeechFallbackRef.current = null;
  }

  function restartStepAdvisorListening(delayMs = 450) {
    if (!stepAdvisorEnabledRef.current || !stepRecognitionRef.current) return;
    clearStepAdvisorRestartTimer();
    const suppressWait = Math.max(0, (stepAdvisorSuppressUntilRef.current || 0) - Date.now() + 200);
    const wait = Math.max(delayMs, suppressWait, 250);
    stepAdvisorRestartTimerRef.current = setTimeout(() => {
      if (!stepAdvisorEnabledRef.current || !stepRecognitionRef.current) return;
      if (stepAdvisorSpeakingRef.current) {
        restartStepAdvisorListening(450);
        return;
      }
      try {
        stepAdvisorSuppressUntilRef.current = Date.now() + 250;
        stepRecognitionRef.current.start();
        setStepAdvisorListening(true);
        setStatus?.(stepAdvisorAwaitingInputRef.current
          ? "Advisor is quiet now and waiting for the artisan response inside this step."
          : "Occasion-aware Advisor is listening inside this step. Say ‘Advisor’ when you need help.");
      } catch (err) {
        // Chrome can throw if recognition is already starting. Try once more shortly.
        if (stepAdvisorEnabledRef.current) {
          stepAdvisorRestartTimerRef.current = setTimeout(() => restartStepAdvisorListening(300), 350);
        }
      }
    }, wait);
  }

  function speakStepAdvisor(text, { resumeListening = true, updateDisplay = true, forceVoice = false } = {}) {
    const spokenText = String(text || "").trim();
    if (!spokenText) return false;
    setLastSpokenAdvisement(spokenText);
    setStepVoiceStatus("ICY voice preparing…");
    if (updateDisplay) {
      setStepAdvisorReply(spokenText);
      if (setAdvisorText) setAdvisorText(spokenText);
    }
    clearStepAdvisorRestartTimer();
    clearStepAdvisorSpeechFallback();
    try { stepRecognitionRef.current?.stop?.(); } catch {}
    setStepAdvisorListening(false);
    stepAdvisorSuppressUntilRef.current = Date.now() + 900;

    if (!stepVoiceEnabled && !forceVoice) {
      stepAdvisorSpeakingRef.current = false;
      setStepVoiceStatus("Voice is off. Advisement is available on screen. Tap Play ICY Advisement to hear it.");
      if (resumeListening) restartStepAdvisorListening(450);
      return false;
    }

    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        // Chrome sometimes needs voices touched before first spoken response.
        window.speechSynthesis.getVoices?.();
      }
    } catch {}

    setStepVoicePaused(false);
    stepAdvisorSpeakingRef.current = true;
    setStepVoiceStatus("ICY is speaking advisement…");
    const wordCount = spokenText.split(/\s+/).filter(Boolean).length;
    const fallbackMs = Math.max(2200, Math.min(8000, wordCount * 230 + 700));
    const reopenListening = (delay = 350) => {
      stepAdvisorSpeakingRef.current = false;
      stepAdvisorSuppressUntilRef.current = Date.now() + 300;
      setStepVoiceStatus("ICY finished speaking. Listening restored.");
      if (icySessionActiveRef.current) {
        // The no-hands session engine controls the next recorded-audio listening window.
        return;
      }
      if (resumeListening && stepAdvisorEnabledRef.current) restartStepAdvisorListening(delay);
    };
    const started = speakFastLocal(spokenText, {
      rate: 0.98,
      onEnd: () => {
        clearStepAdvisorSpeechFallback();
        reopenListening(300);
      }
    });
    if (started && resumeListening) {
      stepAdvisorSpeechFallbackRef.current = setTimeout(() => reopenListening(250), fallbackMs);
      return true;
    }
    if (started) return true;

    setStepVoiceStatus("Voice did not start. Tap Play ICY Advisement to hear it, or read the advisement on screen.");
    if (!started) reopenListening(250);
    return false;
  }

  function replayLastStepAdvisement() {
    const text = lastSpokenAdvisement || stepAdvisorReply || "I do not have an advisement to replay yet.";
    speakStepAdvisor(text, { resumeListening: true, updateDisplay: false, forceVoice: true });
  }

  function pauseStepAdvisorVoice() {
    try { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.pause(); } catch {}
    setStepVoicePaused(true);
    setStepVoiceStatus("ICY voice paused.");
  }
  function resumeStepAdvisorVoice() {
    try { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.resume(); } catch {}
    setStepVoicePaused(false);
    setStepVoiceStatus("ICY voice resumed.");
  }
  function stopStepAdvisorVoice() {
    stopFastLocalSpeech();
    stepAdvisorSpeakingRef.current = false;
    clearStepAdvisorRestartTimer();
    clearStepAdvisorSpeechFallback();
    setStepVoicePaused(false);
    setStepVoiceStatus("ICY voice stopped. Advisement workflow state is preserved.");
    stepAdvisorSuppressUntilRef.current = Date.now() + 500;
    if (stepAdvisorEnabledRef.current) restartStepAdvisorListening(500);
  }

  function isLikelyAdvisorEcho(text) {
    const lower = String(text || "").toLowerCase().replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
    if (!lower) return true;
    const echoPhrases = [
      "i'm here", "im here", "what are we working on", "what can i help with", "you are in", "speak slowly",
      "i will record", "i wrote this", "where this was written", "do you want to add anything else",
      "move to next step", "repeat this step", "advisor guidance", "doma report", "i captured",
      "captured", "i placed", "i saved", "marked for the doma report"
    ];
    const onlyWakeOrEcho = lower
      .replace(/advisor/g, "")
      .replace(/icy/g, "")
      .replace(/icey/g, "")
      .replace(/hey icy/g, "")
      .replace(/hey advisor/g, "")
      .replace(/i'm here/g, "")
      .replace(/im here/g, "")
      .replace(/what are we working on/g, "")
      .replace(/what can i help with/g, "")
      .trim();
    if (!onlyWakeOrEcho) return true;
    return echoPhrases.some((phrase) => lower === phrase || lower.startsWith(`${phrase} `));
  }

  function detectIcyWake(text) {
    const raw = String(text || "").trim();
    const lower = raw.toLowerCase().replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();

    // Accept ICY plus the older Advisor wake word. Mobile speech may hear ICY as "icey",
    // "I C", "I see", "ice", or "icy". Wake-only speech must NEVER be treated as a note.
    const wakePattern = /\b(hey\s+)?(icy|icey|ice|i\s*c|i\s*see|advisor)\b/i;
    const match = lower.match(wakePattern);
    if (!match) return { hasWake: false, wakeWord: "", afterWake: raw, wakeOnly: false };

    const wakeWord = match[2] || "icy";
    const afterOriginal = raw.slice((match.index || 0) + match[0].length).replace(/^[,.!?:;\s-]+/, "").trim();
    const afterClean = afterOriginal
      .replace(/\b(hey\s+)?(icy|icey|ice|i\s*c|i\s*see|advisor)\b/ig, "")
      .replace(/\b(please|okay|ok|hello|hi|there|um|uh|er|or)\b/ig, "")
      .replace(/[.,!?;:\s-]+/g, " ")
      .trim();

    const wakeOnly = !afterClean || afterClean.length < 4;
    return { hasWake: true, wakeWord, afterWake: wakeOnly ? "" : afterOriginal, wakeOnly };
  }


  function detectMachinePassportFromText(text) {
    const raw = String(text || "");
    const lower = raw.toLowerCase();
    const updates = {};
    if (/ninja|luxe|café|cafe/.test(lower)) {
      updates.machineType = "All-in-one / automatic";
      updates.allInOneMachine = raw.match(/ninja[^,.]*/i)?.[0]?.trim() || "Ninja all-in-one / automatic";
      updates.machine = updates.allInOneMachine;
      updates.grinder = "Built-in grinder";
      updates.grinderModel = "Built-in grinder";
    } else if (/de[\s-]?longhi|delonghi|magnifica|dinamica|eletta|la specialista/.test(lower)) {
      updates.machineType = /magnifica|dinamica|eletta/.test(lower) ? "Superautomatic" : "All-in-one / automatic";
      updates.allInOneMachine = raw.match(/(de[\s-]?longhi|delonghi)[^,.]*/i)?.[0]?.trim() || "DeLonghi all-in-one / automatic";
      updates.machine = updates.allInOneMachine;
      updates.grinder = "Built-in grinder";
      updates.grinderModel = "Built-in grinder";
    } else if (/jura|philips|saeco|gaggia anima|superautomatic|super automatic|super-automatic/.test(lower)) {
      updates.machineType = "Superautomatic";
      updates.allInOneMachine = raw.match(/(jura|philips|saeco|gaggia)[^,.]*/i)?.[0]?.trim() || "Superautomatic machine";
      updates.machine = updates.allInOneMachine;
      updates.grinder = "Built-in grinder";
      updates.grinderModel = "Built-in grinder";
    } else if (/breville|barista express|barista touch|oracle|meraki|built.?in grinder/.test(lower)) {
      updates.machineType = "Espresso machine with built-in grinder";
      updates.espressoMachine = raw.match(/(breville|meraki|oracle)[^,.]*/i)?.[0]?.trim() || profile?.espressoMachine || "Espresso machine with built-in grinder";
      updates.machine = updates.espressoMachine;
      updates.grinder = "Built-in grinder";
      updates.grinderModel = "Built-in grinder";
    } else if (/flair|la pavoni|lever|robot/.test(lower)) {
      updates.machineType = "Manual / lever espresso";
      updates.espressoMachine = raw.match(/(flair|la pavoni|robot)[^,.]*/i)?.[0]?.trim() || "Manual / lever espresso machine";
      updates.machine = updates.espressoMachine;
    } else if (/rocket|ecm|profitec|lelit|rancilio|gaggia classic|silvia|decent|la marzocco|semi.?automatic|semi automatic/.test(lower)) {
      updates.machineType = "Espresso machine";
      updates.espressoMachine = raw.match(/(rocket|ecm|profitec|lelit|rancilio|gaggia classic|silvia|decent|la marzocco)[^,.]*/i)?.[0]?.trim() || "Semi-automatic espresso machine";
      updates.machine = updates.espressoMachine;
    }
    if (/separate grinder|df64|niche|eureka|baratza|fellow|lagom|mazzer|sette|specialita|mignon/.test(lower)) {
      updates.grinder = raw.match(/(df64|niche|eureka|baratza|fellow|lagom|mazzer|sette|specialita|mignon)[^,.]*/i)?.[0]?.trim() || "Separate grinder";
      updates.grinderModel = updates.grinder;
      if (!updates.machineType && /separate grinder/.test(lower)) updates.machineType = profile?.machineType || "Espresso machine";
    }
    const doseMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?)\s*(?:in|dose)?/i);
    const yieldMatch = raw.match(/(?:yield|out|output|to)\s*(\d+(?:\.\d+)?)\s*(?:g|grams?)/i) || raw.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?)\s*out/i);
    const timeMatch = raw.match(/(\d{1,3})\s*(?:sec|second|seconds)\b/i);
    const grindMatch = raw.match(/(?:grind|setting)\s*(?:is|at|on)?\s*([a-z0-9.\- ]{1,18})/i);
    if (doseMatch) updates.houseDose = `${doseMatch[1]}g`;
    if (yieldMatch) updates.houseYield = `${yieldMatch[1]}g`;
    if (timeMatch) updates.houseShotTime = `${timeMatch[1]} seconds`;
    if (grindMatch) updates.grinderSetting = grindMatch[1].trim();
    return updates;
  }

  function applyMachinePassportDraftFromText(text) {
    const updates = detectMachinePassportFromText(text);
    const labels = [];
    Object.entries(updates).forEach(([key, value]) => {
      if (value && updateProfile) {
        updateProfile(key, value);
        labels.push(key);
      }
    });
    if (labels.length) {
      recordTelemetry?.("machine_passport_voice_updated", { fields: labels, source: "ICY advisement workflow" });
    }
    return labels;
  }

  function getMachinePassportStatus(textForDraft = "") {
    const detected = detectMachinePassportFromText(textForDraft);
    const machineType = detected.machineType || profile?.machineType || "";
    const machine = detected.machine || profile?.machine || profile?.espressoMachine || profile?.allInOneMachine || "";
    const grinder = detected.grinder || profile?.grinder || profile?.grinderModel || "";
    const dose = detected.houseDose || profile?.quickShotDose || profile?.houseDose || "";
    const yieldOut = detected.houseYield || profile?.quickShotYield || profile?.houseYield || "";
    const shotTime = detected.houseShotTime || profile?.quickShotTime || occasion?.currentShotTime || profile?.houseShotTime || "";
    const grind = detected.grinderSetting || profile?.quickShotGrind || profile?.grinderSetting || "";
    const isAllInOne = /all-in-one|automatic|superautomatic|super-automatic|ninja|delonghi|de longhi|jura|philips|saeco/i.test(`${machineType} ${machine}`);
    const isSemiAuto = /espresso machine|semi|breville|meraki|rocket|ecm|profitec|lelit|rancilio|gaggia|decent/i.test(`${machineType} ${machine}`) && !isAllInOne;
    const missing = [];
    if (!machineType) missing.push("machine category");
    if (!machine) missing.push("machine brand/model");
    if (!grinder) missing.push("grinder setup");
    if (!dose) missing.push("house dose");
    if (!yieldOut) missing.push("house yield");
    if (!shotTime) missing.push("target or observed shot time");
    if (!grind && !isAllInOne) missing.push("grind setting");
    const adviceMode = isAllInOne ? "all-in-one / automatic machine guidance" : (isSemiAuto ? "semi-automatic espresso guidance" : "machine-context guidance");
    return { machineType, machine, grinder, dose, yieldOut, shotTime, grind, isAllInOne, isSemiAuto, missing, adviceMode };
  }

  function isTechnicalAdvisementRequest(text) {
    const lower = String(text || "").toLowerCase();
    return /shot|espresso|grind|dose|yield|time|puck|flow|thin|watery|fast|slow|bitter|sour|sharp|milk|foam|machine|brew|extraction|channel|spray|no flow|few drops|stalled|settings|preset|strength/.test(lower);
  }

  function buildMachinePassportQuestion(status) {
    const missing = status?.missing || [];
    if (!missing.length) return "";
    if (missing.includes("machine category") || missing.includes("machine brand/model")) {
      return "Before I advise, I need to confirm your setup so I do not give espresso-machine advice to an all-in-one or superautomatic machine. What machine type, brand, and model are you using?";
    }
    if (missing.includes("grinder setup")) {
      return "Before I narrow the adjustment, confirm your grinder setup: built-in grinder, separate grinder, pre-ground, or no grinder?";
    }
    if (missing.includes("house dose") || missing.includes("house yield") || missing.includes("target or observed shot time")) {
      return "Give me your basic house formula or observed pull if you have it: dose in, yield out, and shot time.";
    }
    if (missing.includes("grind setting")) {
      return "What grind setting are you on, or did the grind change from the last pull?";
    }
    return `I need one or two setup details first: ${missing.slice(0, 3).join(", ")}.`;
  }

  function getStepBoundaryNote(artisanText) {
    const lower = String(artisanText || "").toLowerCase();
    const stepText = `${current?.title || ""} ${current?.action || ""} ${current?.advisor || ""} ${current?.watch || ""} ${current?.script || ""}`.toLowerCase();
    if (!lower || !stepText) return "";
    const stepWords = stepText.split(/[^a-z0-9]+/).filter((w) => w.length > 4);
    const overlap = stepWords.some((w) => lower.includes(w));
    const clearlyCoffee = /coffee|espresso|shot|grind|dose|yield|milk|foam|taste|guest|serve|cup|puck|machine|occasion|script|flow/.test(lower);
    if (clearlyCoffee && !overlap) {
      return `That question is not directly about this step, but I can address it briefly and then get you back on track for Step ${safeIndex + 1}: ${current?.title}.`;
    }
    return "";
  }

  function buildStepAdvisorContext(artisanText) {
    const passport = getMachinePassportStatus(artisanText);
    return {
      advisementWorkflow: "Wake → artisan issue/question → ICY checks Machine Passport → if missing, asks setup questions → writes Machine Passport → gives machine-appropriate guidance → artisan confirms next move → ICY logs decision → closeout",
      machinePassportStatus: passport,
      machineType: passport.machineType || "not captured",
      machine: passport.machine || "not captured",
      grinder: passport.grinder || "not captured",
      adviceMode: passport.adviceMode,
      missingMachinePassportFields: passport.missing,
      dose: passport.dose || occasionItem?.dose || "not captured",
      yield: passport.yieldOut || occasionItem?.yield || "not captured",
      shotTime: passport.shotTime || occasionItem?.time || "not captured",
      grind: passport.grind || "not captured",
      drink: occasion?.drink || occasionItem?.drink || occasionItem?.recommendedPrimaryDrink || "espresso",
      recurrence: occasion?.recurrence || profile?.lastDialInResult || "not captured",
      occasion: occasionItem?.name || occasion?.occasionName || "Current Occasion",
      guest: occasion?.guest || "home guest / household",
      timePressure: occasion?.timePressure || "not captured",
      desiredFeeling: occasion?.desiredFeeling || occasionItem?.desiredFeeling || occasionItem?.purpose || "calm, repeatable readiness",
      advisorGuidanceLevel: profile?.advisorGuidanceLevel || profile?.experienceLevel || "Building Consistency",
      confirmedRecipe: profile?.confirmedRecipe || "Not yet confirmed",
      tamper: profile?.tamper || "not captured",
      distributionTool: profile?.distributionTool || "not captured",
      wdtTool: profile?.wdtTool || "not captured",
      puckScreen: profile?.puckScreen || "not captured",
      puckPrepWorkflow: profile?.puckPrepWorkflow || current?.advisor || "not captured",
      dialInAttempts: profile?.dialInAttempts || [],
      currentOccasionStep: `Step ${safeIndex + 1} of ${steps.length}: ${current?.title || "current step"}`,
      currentStepAction: current?.action || current?.advisor || "not captured",
      currentStepScript: current?.script || "not captured",
      currentStepWatch: current?.watch || "not captured",
      stepBoundaryRule: "Answer the artisan's question if possible. If the question is outside this step, briefly acknowledge that and re-anchor to the current step.",
      draftCaptureRule: "Place captured information into visible form/report areas as a draft first. Ask if the artisan wants to add or change anything before final save/closeout.",
      writtenTo: "Step Telemetry, Step Notes, Taste Notes, Recovery Notes, Guest Resonance, Machine Passport, and Doma Report according to detected intent",
      artisanVoice: artisanText
    };
  }

  function normalizeStepAdvisorResponse(advisorText, artisanText, routingLabels, changed) {
    const fallback = buildOccasionAwareAdvisorReply(artisanText, { occasionItem, currentStep: current, stepNumber: safeIndex + 1, totalSteps: steps.length, profile, occasion, changedFields: changed, routing: buildStepCaptureRouting(artisanText, changed) });
    const rawBase = String(advisorText || "").trim() || fallback;
    // Keep the on-screen guidance useful but not runaway. The report ledger can still keep the important routing,
    // but the active step should not become unreadable or impossible for voice to summarize.
    const base = trimForDisplay(rawBase, 1400);
    const routeLine = `\n\nVisible routing: I wrote this to ${routingLabels.join(" + ")}. You can verify it in the Step Capture Ledger and In-Step Report Review on this same step. It is marked for the Doma Report.`;
    return `${base}${base.includes("Visible routing:") ? "" : routeLine}`;
  }

  function buildStepSpokenConfirmation(artisanText, changed, routingLabels) {
    const fieldLine = changed?.length ? ` I filled ${changed.join(", ")}.` : " I saved it as a step note.";
    const routeLine = routingLabels?.length ? ` I wrote it to ${routingLabels.join(" and ")}.` : " I wrote it to Step Notes.";
    const reportLine = " It is marked for the Doma Report.";
    const repeat = String(artisanText || "").trim();
    return `Captured. You said: ${repeat}.${fieldLine}${routeLine}${reportLine}`;
  }

  function trimForDisplay(text, max = 1400) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max).trim()}…`;
  }

  function buildConciseSpokenAdvisement({ artisanText, guidance, suggestedAction, machineQuestion, routingLabels }) {
    // Classify spoken advisement from the CURRENT artisan phrase only.
    // Do not use guidance text here; it may contain old or API-expanded context.
    const lower = String(artisanText || "").toLowerCase();
    const routeLine = routingLabels?.length ? ` I placed it in ${routingLabels.slice(0, 2).join(" and ")} as a draft.` : " I placed it in the step as a draft.";
    if (machineQuestion) {
      return `I captured that.${routeLine} Before I advise, I need the Machine Passport clear so I do not give the wrong machine advice. ${machineQuestion}`;
    }
    if (/messy puck|puck looks messy|wet puck|soupy puck|puck/.test(lower)) {
      return `I captured messy puck.${routeLine} A messy puck by itself is not automatically a failed shot. First check the cup and the flow. If it also tastes thin, ran fast, sprayed, or channeled, check distribution, tamp level, headspace, and grind before changing multiple variables. Do you want to add or change anything before I save this?`;
    }
    if (/thin|watery|fast|gush|runny/.test(lower)) {
      return `I captured that the shot seems thin or fast.${routeLine} Keep the dose steady first. If the cup tastes watery, sour, or hollow, make one small adjustment—usually a little finer on grind if your machine allows it—then taste again. Do you want to add or change anything before I save this?`;
    }
    if (/few drops|no flow|chok|stalled/.test(lower)) {
      return `I captured a possible choke or no-flow issue.${routeLine} Stop the pull, purge, and only change one thing next. If dose and puck prep were normal, try slightly coarser. Do you want to add or change anything before I save this?`;
    }
    if (/bitter|harsh|dry|ashy/.test(lower)) {
      return `I captured bitter or harsh taste.${routeLine} First decide if the bitterness is pleasant or dry and lingering. If it is unpleasant, consider one controlled change: slightly shorter yield or a bit coarser. Do you want to add or change anything before I save this?`;
    }
    if (/sour|sharp|acid/.test(lower)) {
      return `I captured sour or sharp taste.${routeLine} If it is unpleasant and thin, you may need a little more extraction. Keep dose steady and consider slightly finer grind or a little more yield if your machine allows it. Do you want to add or change anything before I save this?`;
    }
    if (/guest|serve|script|say|occasion|resonance/.test(lower)) {
      return `I captured the Occasion question.${routeLine} Keep the service language short and focused on the guest. Use the current step script as the anchor, then bring the guest to the first sip. Do you want to add or change anything before I save this?`;
    }
    return `I captured that.${routeLine} My next move recommendation is: ${suggestedAction || "use the guidance shown on the screen, then taste and report back"}. Do you want to add or change anything before I save this?`;
  }

  function shouldAskAdvisorForGuidance(artisanText) {
    const lower = String(artisanText || "").toLowerCase();
    // Broad natural-language trigger. ICY should not need exact phrases.
    return /what should|what do i|help|advice|problem|wrong|issue|trouble|check|why|how do|runny|watery|thin|fast|slow|gush|few drops|no flow|bitter|sour|sharp|sweet|chok|stalled|messy|puck|soupy|wet|fractured|spray|channel|uneven|hollow|not sure|confused|fix|adjust|taste|milk|foam|texture|guest|serve|script|occasion|refreshing|cold|iced|tonic|matcha/.test(lower);
  }

  async function getNaturalStepAdvisorReply(artisanText, changed, routing) {
    const routingLabels = routing.map((r) => r.label);
    // Stabilization rule: the live Occasion step must answer the CURRENT artisan issue.
    // To stop stale API context from carrying "messy puck" into a different issue, use the
    // local Machine Passport + current-step advisement as the authoritative response for now.
    const localCurrentIssueGuidance = buildOccasionAwareAdvisorReply(artisanText, {
      occasionItem,
      currentStep: current,
      stepNumber: safeIndex + 1,
      totalSteps: steps.length,
      profile,
      occasion,
      changedFields: changed,
      routing
    });
    const routeLine = `\n\nVisible routing: I wrote this to ${routingLabels.join(" + ")}. You can verify it in the Step Capture Ledger and In-Step Report Review on this same step. It is marked for the Doma Report.`;
    const finalGuidance = `${trimForDisplay(localCurrentIssueGuidance, 1400)}${localCurrentIssueGuidance.includes("Visible routing:") ? "" : routeLine}`;
    recordTelemetry?.("occasion_step_advisor_local_current_issue_guidance", {
      companion: "ICY",
      occasion: occasionItem.name,
      step: safeIndex + 1,
      transcript: artisanText,
      routing: routingLabels
    });
    return finalGuidance;
  }


  function getBestPendingForContinuation(raw = "") {
    const pending = stepAdvisorPendingDecisionRef.current || stepAdvisorPendingDecision || {};
    if (pending && (pending.transcript || pending.guidance || pending.routingLabels?.length)) return pending;
    if (stepReview && (stepReview.transcript || stepReview.advisorGuidance)) {
      const routes = stepReview.routes || [];
      return {
        transcript: stepReview.transcript || raw,
        fields: stepReview.fields || [],
        routes,
        routingLabels: routes.map((r) => r.label).filter(Boolean),
        guidance: stepReview.advisorGuidance || "",
        suggestedAction: stepReview.suggestedAction || ""
      };
    }
    return {
      transcript: raw,
      fields: [],
      routes: [{ label: "Troubleshooting Continuation", detail: "Continuation captured outside the expected decision state." }],
      routingLabels: ["Troubleshooting Continuation"],
      guidance: stepAdvisorReply || "",
      suggestedAction: ""
    };
  }

  function handleGlobalTroubleshootingContinuation(rawText) {
    const raw = String(rawText || "").trim();
    if (!isTroubleshootingContinuation(raw)) return false;
    const pending = getBestPendingForContinuation(raw);
    const continuationGuidance = buildTroubleshootingContinuationGuidance(raw, pending);
    const updatedPending = {
      ...pending,
      troubleshootingContinuation: raw,
      guidance: `${pending?.guidance || ""}\n\nTroubleshooting continuation: ${continuationGuidance}`,
      suggestedAction: "Continue troubleshooting; answer ICY's follow-up checklist before closing this advisement."
    };
    stepAdvisorPendingDecisionRef.current = updatedPending;
    setStepAdvisorPendingDecision(updatedPending);
    setStepAdvisorPhase("Troubleshooting continuation");
    stepAdvisorConversationPhaseRef.current = "awaiting_decision";
    stepAdvisorAwaitingInputRef.current = true;
    setStepAdvisorReply(continuationGuidance);
    setStepPlacementNotice(`Troubleshooting continuation captured. ICY is keeping this advisement open and will not close the step yet.`);
    setStepReview({
      ...(stepReview || {}),
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      occasion: occasionItem.name,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      transcript: `${pending?.transcript || ""}\nArtisan continuation: ${raw}`.trim(),
      fields: pending?.fields || [],
      routes: pending?.routes || [{ label: "Troubleshooting Continuation", detail: "The prior suggestion was tried and did not resolve the issue." }],
      writtenTo: pending?.routingLabels?.join(" + ") || "Troubleshooting Continuation + Advisor Guidance + Doma Report context",
      advisorGuidance: continuationGuidance,
      suggestedAction: "Continue troubleshooting; answer ICY's follow-up checklist before closing.",
      reportStatus: "The original issue, ICY guidance, attempted action, and unresolved outcome are marked for the Doma Report and community learning.",
      nextPrompt: "Answer ICY’s follow-up checklist, describe what changed, or tell ICY the result stayed the same."
    });
    setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Troubleshooting continuation: ${raw}`);
    setStepCaptureLedger((prev) => [{
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      occasion: occasionItem.name,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      transcript: `Troubleshooting continuation: ${raw}`,
      fields: pending?.fields || [],
      routes: pending?.routes || [{ label: "Troubleshooting Continuation", detail: "The prior suggestion was tried and did not resolve the issue." }],
      advisorGuidance: continuationGuidance
    }, ...prev].slice(0, 8));
    recordTelemetry?.("occasion_step_advisor_global_troubleshooting_continuation", { companion: "ICY", occasion: occasionItem.name, step: safeIndex + 1, response: raw, phase: stepAdvisorConversationPhaseRef.current });
    speakStepAdvisor(continuationGuidance, { resumeListening: true, updateDisplay: false, forceVoice: true });
    return true;
  }

  async function handleStepAdvisorText(rawText) {
    const raw = String(rawText || "").trim();
    if (!raw) return;

    // First identify wake words before echo filtering. "Hey ICY" alone is a command,
    // not an artisan note, and must never create guidance or write report content.
    const wake = detectIcyWake(raw);
    const hasWake = wake.hasWake;
    let artisanText = raw;

    if (Date.now() < stepAdvisorSuppressUntilRef.current && !hasWake) {
      setStatus?.("ICY ignored its own voice and is waiting for the artisan.");
      return;
    }

    // Global continuation intent: if the artisan says the prior suggestion was already tried
    // or did not work, continue troubleshooting regardless of the current UI phase.
    if (!hasWake && !isLikelyAdvisorEcho(raw) && handleGlobalTroubleshootingContinuation(raw)) {
      return;
    }

    // Closed-loop phase: ICY already gave guidance and is waiting for the artisan
    // to accept, modify, or decline the next move. This must be logged before closeout.
    if (!hasWake && stepAdvisorConversationPhaseRef.current === "awaiting_decision") {
      if (isLikelyAdvisorEcho(raw)) {
        setStatus?.("ICY heard playback/echo and ignored it. It is still waiting for the artisan decision.");
        return;
      }
      const pending = stepAdvisorPendingDecisionRef.current || {};
      if (pending.machineQuestion) {
        const passportFields = applyMachinePassportDraftFromText(raw);
        const combinedTranscript = `${pending.transcript || ""}\nMachine Passport clarification: ${raw}`.trim();
        const combinedFields = [...new Set([...(pending.fields || []), ...(passportFields || []).map((x) => `Machine Passport: ${x}`)])];
        const routing = pending.routes?.length ? pending.routes : buildStepCaptureRouting(combinedTranscript, combinedFields);
        const routingLabels = routing.map((r) => r.label);
        const guidance = await getNaturalStepAdvisorReply(combinedTranscript, combinedFields, routing);
        const suggestedAction = inferSuggestedActionFromGuidance(guidance, combinedTranscript);
        const updatedPending = { ...pending, transcript: combinedTranscript, fields: combinedFields, routes: routing, routingLabels, guidance, suggestedAction, machineQuestion: "" };
        stepAdvisorPendingDecisionRef.current = updatedPending;
        setStepAdvisorPendingDecision(updatedPending);
        setStepAdvisorFields(combinedFields);
        setStepPlacementNotice(`Machine Passport updated from your answer. Draft capture remains in: ${routingLabels.join(" + ")}. Review before final save.`);
        setStepAdvisorReply(guidance);
        setStepReview({
          ...(stepReview || {}),
          at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
          occasion: occasionItem.name,
          step: safeIndex + 1,
          stepTitle: current?.title || "Current step",
          transcript: combinedTranscript,
          fields: combinedFields,
          routes: routing,
          writtenTo: routingLabels.join(" + "),
          advisorGuidance: guidance,
          suggestedAction,
          reportStatus: "The Machine Passport update, observation, and ICY guidance are marked for the Doma Report.",
          nextPrompt: "Tell ICY whether this is the next move you want to take, or tell ICY what you want to change."
        });
        setStepAdvisorPhase("Waiting for artisan decision");
        stepAdvisorConversationPhaseRef.current = "awaiting_decision";
        setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Machine Passport clarification: ${raw}`);
        recordTelemetry?.("occasion_step_advisor_machine_passport_clarified", { companion: "ICY", occasion: occasionItem.name, step: safeIndex + 1, fields: passportFields });
        const spokenAdvisement = buildConciseSpokenAdvisement({ artisanText: combinedTranscript, guidance, suggestedAction, machineQuestion: "", routingLabels });
        const passportSpoken = `Got it. I updated the Machine Passport from your answer. ${spokenAdvisement}`;
        setLastSpokenAdvisement(passportSpoken);
        setStepVoiceStatus("ICY advisement ready. Speaking now…");
        speakStepAdvisor(passportSpoken, { resumeListening: true, updateDisplay: false, forceVoice: true });
        return;
      }
      if (isTroubleshootingContinuation(raw)) {
        const continuationGuidance = buildTroubleshootingContinuationGuidance(raw, pending);
        const updatedPending = {
          ...pending,
          troubleshootingContinuation: raw,
          guidance: `${pending?.guidance || ""}\n\nTroubleshooting continuation: ${continuationGuidance}`,
          suggestedAction: "Continue troubleshooting; answer ICY's follow-up checklist before closing this advisement."
        };
        stepAdvisorPendingDecisionRef.current = updatedPending;
        setStepAdvisorPendingDecision(updatedPending);
        setStepAdvisorPhase("Troubleshooting continuation");
        stepAdvisorConversationPhaseRef.current = "awaiting_decision";
        setStepAdvisorReply(continuationGuidance);
        setStepReview({
          ...(stepReview || {}),
          at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
          occasion: occasionItem.name,
          step: safeIndex + 1,
          stepTitle: current?.title || "Current step",
          transcript: `${pending?.transcript || ""}\nArtisan continuation: ${raw}`.trim(),
          fields: pending?.fields || [],
          routes: pending?.routes || [],
          writtenTo: pending?.routingLabels?.join(" + ") || "Step Notes + Advisor Guidance + Doma Report context",
          advisorGuidance: continuationGuidance,
          suggestedAction: "Continue troubleshooting; answer ICY's follow-up checklist before closing.",
          reportStatus: "The original issue, ICY guidance, attempted action, and unresolved outcome are marked for the Doma Report and community learning.",
          nextPrompt: "Answer ICY’s follow-up checklist, or describe what changed after the attempted fix."
        });
        setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Troubleshooting continuation: ${raw}`);
        setStepCaptureLedger((prev) => [{
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
          occasion: occasionItem.name,
          step: safeIndex + 1,
          stepTitle: current?.title || "Current step",
          transcript: `Troubleshooting continuation: ${raw}`,
          fields: pending?.fields || [],
          routes: pending?.routes || [{ label: "Troubleshooting Continuation", detail: "The first suggestion was tried and did not resolve the issue." }],
          advisorGuidance: continuationGuidance
        }, ...prev].slice(0, 8));
        recordTelemetry?.("occasion_step_advisor_troubleshooting_continuation", { companion: "ICY", occasion: occasionItem.name, step: safeIndex + 1, response: raw });
        speakStepAdvisor(continuationGuidance, { resumeListening: true, updateDisplay: false, forceVoice: true });
        return;
      }
      const decisionText = summarizeArtisanDecision(raw, pending);
      const closeout = buildDecisionCloseoutText(raw, pending);
      const decisionReview = {
        ...(stepReview || {}),
        at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
        occasion: occasionItem.name,
        step: safeIndex + 1,
        stepTitle: current?.title || "Current step",
        transcript: pending?.transcript || raw,
        fields: pending?.fields || [],
        routes: pending?.routes || [],
        writtenTo: pending?.routingLabels?.join(" + ") || "Step Notes + Advisor Guidance + Doma Report context",
        advisorGuidance: `${pending?.guidance || ""}\n\nArtisan decision / chosen next move: ${decisionText}`,
        reportStatus: "The observation, ICY guidance, and artisan chosen next move are marked for the Doma Report.",
        nextPrompt: "ICY is waiting to know if anything else is needed. Say “no” to close this step, or add another note."
      };
      setStepReview(decisionReview);
      setStepReviewConfirmed(false);
      setStepAdvisorPendingDecision({ ...pending, decisionText });
      stepAdvisorPendingDecisionRef.current = { ...pending, decisionText };
      setStepAdvisorPhase("Waiting for anything else");
      stepAdvisorConversationPhaseRef.current = "awaiting_more";
      setStepAdvisorReply(closeout);
      setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Artisan decision: ${raw}\nICY logged chosen next move: ${decisionText}`);
      setStepCaptureLedger((prev) => [{
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
        occasion: occasionItem.name,
        step: safeIndex + 1,
        stepTitle: current?.title || "Current step",
        transcript: `Artisan decision: ${raw}`,
        fields: pending?.fields || [],
        routes: pending?.routes || [{ label: "Advisor Guidance / Chosen Next Move", detail: "Decision logged into report context." }],
        advisorGuidance: closeout
      }, ...prev].slice(0, 8));
      recordTelemetry?.("occasion_step_advisor_decision_logged", { companion: "ICY", occasion: occasionItem.name, step: safeIndex + 1, decision: decisionText });
      speakStepAdvisor(closeout, { resumeListening: true, updateDisplay: false });
      return;
    }

    // Final closeout phase: after ICY asks if anything else is needed, the artisan can say no.
    if (!hasWake && stepAdvisorConversationPhaseRef.current === "awaiting_more") {
      if (isLikelyAdvisorEcho(raw)) {
        setStatus?.("ICY heard playback/echo and ignored it. It is still waiting for the artisan closeout.");
        return;
      }
      const pending = stepAdvisorPendingDecisionRef.current || {};
      if (isArtisanNoMore(raw)) {
        const finalText = buildFinalCloseoutText(pending);
        setStepAdvisorReply(finalText);
        setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Artisan: ${raw}\nICY closed the step loop.`);
        setStepPlacementNotice(`Closed loop logged. Review the In-Step Report Review, then choose Repeat This Step or Move to Next Step.`);
        setStepAdvisorPhase("Wake word mode");
        stepAdvisorConversationPhaseRef.current = "wake";
        stepAdvisorAwaitingInputRef.current = false;
        stepAdvisorPendingDecisionRef.current = null;
        setStepAdvisorPendingDecision(null);
        recordTelemetry?.("occasion_step_advisor_closeout", { companion: "ICY", occasion: occasionItem.name, step: safeIndex + 1, status: "closed" });
        speakStepAdvisor(finalText, { resumeListening: false, updateDisplay: false });
        return;
      }
      // If they did not say no, treat this as an additional note and continue normally.
      stepAdvisorConversationPhaseRef.current = "awaiting_input";
      stepAdvisorAwaitingInputRef.current = true;
      artisanText = raw;
    }

    if (hasWake) {
      const now = Date.now();
      const intro = `I'm here. What are we working on?`;

      if (stepAdvisorConversationPhaseRef.current === "awaiting_decision" && stepAdvisorPendingDecisionRef.current) {
        const pending = stepAdvisorPendingDecisionRef.current;
        const resume = `I'm here. We are still in ${occasionItem.name}, Step ${safeIndex + 1}: ${current?.title}. I am waiting for your decision on the next move: ${pending.suggestedAction || "the guidance I just gave"}. Tell me what you want to do, or tell me what you want to change.`;
        setStepAdvisorReply(resume);
        setStepAdvisorPhase("Waiting for artisan decision");
        setStatus?.("ICY resumed the existing advisement workflow. No context was cleared.");
        speakStepAdvisor(resume, { resumeListening: true });
        return;
      }

      if (stepAdvisorConversationPhaseRef.current === "awaiting_more" && stepAdvisorPendingDecisionRef.current) {
        const resume = `I'm here. I already logged the chosen next move for ${occasionItem.name}, Step ${safeIndex + 1}. Is there anything else, or should I close this step?`;
        setStepAdvisorReply(resume);
        setStepAdvisorPhase("Waiting for anything else");
        setStatus?.("ICY resumed the existing advisement workflow closeout.");
        speakStepAdvisor(resume, { resumeListening: true });
        return;
      }

      // If the transcript is only the wake phrase, do ONLY the wake response:
      // no notes, no report write, no guidance generation.
      if (wake.wakeOnly || !wake.afterWake || isLikelyAdvisorEcho(wake.afterWake)) {
        stepAdvisorLastWakeAtRef.current = now;
        stepAdvisorAwaitingInputRef.current = true;
        stepAdvisorConversationPhaseRef.current = "awaiting_input";
        setStepAdvisorPhase("Waiting for artisan input");
        setStepAdvisorReply(intro);
        setStepPlacementNotice(`ICY is online for ${occasionItem.name}, Step ${safeIndex + 1}: ${current?.title}. Nothing has been written yet. Speak naturally now; captured details will appear here.`);
        setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Wake word: ${String(wake.wakeWord || "ICY").toUpperCase()} — waiting for artisan input`);
        setStatus?.("ICY is online and waiting. Nothing has been written yet.");
        recordTelemetry?.("occasion_step_advisor_wake", { companion: "ICY", wakeOnly: true, occasion: occasionItem.name, occasionId: occasionItem.id, step: safeIndex + 1, stepTitle: current?.title });
        speakStepAdvisor(intro, { resumeListening: true });
        return;
      }

      if (now - stepAdvisorLastWakeAtRef.current < 900) {
        setStatus?.("ICY already came online. It is waiting for the artisan response.");
        return;
      }

      stepAdvisorLastWakeAtRef.current = now;
      stepAdvisorAwaitingInputRef.current = true;
      stepAdvisorConversationPhaseRef.current = "awaiting_input";
      setStepAdvisorPhase("Waiting for artisan input");
      artisanText = wake.afterWake;
      setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Wake word: ${String(wake.wakeWord || "ICY").toUpperCase()}`);
      recordTelemetry?.("occasion_step_advisor_wake", { companion: "ICY", wakeOnly: false, occasion: occasionItem.name, occasionId: occasionItem.id, step: safeIndex + 1, stepTitle: current?.title });
      setStepAdvisorReply(intro);
    }

    if (!hasWake && !stepAdvisorAwaitingInputRef.current) {
      // Do not silently discard a real phrase if the artisan is typing or browser capture
      // delivers the phrase after wake state got lost. Treat it as a fresh current issue.
      beginFreshStepAdvisementIssue("direct");
    }

    if (isLikelyAdvisorEcho(artisanText)) {
      setStatus?.("ICY heard playback/echo and ignored it. It is still waiting for the artisan response.");
      return;
    }

    // At this point we have a real artisan note after ICY has been summoned.
    stepAdvisorAwaitingInputRef.current = false;
    stepAdvisorConversationPhaseRef.current = "processing";
    setStepAdvisorPhase("Processing artisan note");
    setStepAdvisorTranscript((prev) => `${prev ? `${prev}\n` : ""}Artisan: ${artisanText}`);
    if (setTranscript) setTranscript((prev) => `${prev ? `${prev}\n` : ""}Occasion Step Advisor (${occasionItem.name}, Step ${safeIndex + 1}): ${artisanText}`);

    const passportFields = applyMachinePassportDraftFromText(artisanText);
    const changed = applyVoiceTextToFields(artisanText, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry });
    const allChanged = [...new Set([...(changed || []), ...(passportFields || []).map((x) => `Machine Passport: ${x}`)])];
    const routing = buildStepCaptureRouting(artisanText, allChanged);
    const routingLabels = routing.map((r) => r.label);
    const passportStatus = getMachinePassportStatus(artisanText);
    const machineQuestion = isTechnicalAdvisementRequest(artisanText) ? buildMachinePassportQuestion(passportStatus) : "";
    const stepBoundaryNote = getStepBoundaryNote(artisanText);
    setStepAdvisorFields(allChanged);
    setStepPlacementNotice(`Draft capture placed in: ${routingLabels.join(" + ")}. ${passportFields.length ? "Machine Passport fields were updated from your voice note. " : ""}Review it here before final save; it will be included in the Doma Report after confirmation.`);

    const entryId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setStepCaptureLedger((prev) => [{
      id: entryId,
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      occasion: occasionItem.name,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      transcript: artisanText,
      fields: allChanged,
      routes: routing,
      advisorGuidance: "ICY is interpreting the full natural-language note with this step, form, House Formula, and Recovery Matrix context…"
    }, ...prev].slice(0, 8));

    setStepAdvisorReply("ICY is interpreting your full note with the current Occasion step, House Formula, and Recovery Matrix context…");
    setStatus?.(`ICY captured the note and wrote it to ${routingLabels.join(" + ")}. Generating contextual guidance…`);
    recordTelemetry?.("occasion_step_advisor_capture", { companion: "ICY", occasion: occasionItem.name, occasionId: occasionItem.id, step: safeIndex + 1, stepTitle: current?.title, fields: allChanged, routes: routingLabels, transcript: artisanText });

    const needsGuidance = shouldAskAdvisorForGuidance(artisanText);
    const guidance = machineQuestion
      ? `${stepBoundaryNote ? `${stepBoundaryNote} ` : ""}${machineQuestion} I placed what you already said into the form as a draft, but I will hold the technical recommendation until the Machine Passport is clear.`
      : (needsGuidance
        ? await getNaturalStepAdvisorReply(artisanText, allChanged, routing)
        : `Capture-only note. The artisan's spoken information was written to ${routingLabels.join(" + ")} as a draft. No extra guidance was requested; preserve this as report context and keep ICY quiet until the artisan asks again.`);
    const suggestedAction = machineQuestion ? "Answer the Machine Passport setup question so ICY can give the right machine-appropriate guidance." : inferSuggestedActionFromGuidance(guidance, artisanText);

    const spokenConfirmation = buildStepSpokenConfirmation(artisanText, allChanged, routingLabels);
    const review = {
      at: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" }),
      occasion: occasionItem.name,
      step: safeIndex + 1,
      stepTitle: current?.title || "Current step",
      transcript: artisanText,
      fields: allChanged,
      routes: routing,
      writtenTo: routingLabels.join(" + "),
      advisorGuidance: guidance,
      suggestedAction,
      reportStatus: "This capture, ICY guidance, and the artisan's chosen next move are marked for the Doma Report for this Occasion step.",
      nextPrompt: "Say whether you will take this next move, change it, or add more information."
    };

    setStepReview(review);
    setStepReviewConfirmed(false);
    setStepCaptureLedger((prev) => prev.map((entry) => entry.id === entryId ? { ...entry, advisorGuidance: guidance } : entry));
    if (setTranscript) setTranscript((prev) => `${prev ? `${prev}\n` : ""}Report routing (${occasionItem.name}, Step ${safeIndex + 1}): Written to ${routingLabels.join(" + ")}. Guidance saved: ${guidance}`);
    if (setAdvisorText) setAdvisorText(guidance);
    if (setSynthesis) setSynthesis((prev) => prev || { detectedArtisanIntent: "occasion_step_advisor", contextUsed: "active occasion, current step, house formula, spoken note", confidence: "natural-language restoration" });

    const pending = { transcript: artisanText, fields: allChanged, routes: routing, routingLabels, guidance, suggestedAction, machinePassportStatus: passportStatus, machineQuestion, stepBoundaryNote };
    stepAdvisorPendingDecisionRef.current = pending;
    setStepAdvisorPendingDecision(pending);
    stepAdvisorConversationPhaseRef.current = "awaiting_decision";
    setStepAdvisorPhase("Waiting for artisan decision");
    setStepAdvisorReply(guidance);
    setStatus?.("ICY filled the form/report fields and is waiting for the artisan to accept, change, or decline the next move.");
    const spokenAdvisement = buildConciseSpokenAdvisement({ artisanText, guidance, suggestedAction, machineQuestion, routingLabels });
    setLastSpokenAdvisement(spokenAdvisement);
    setStepVoiceStatus("ICY advisement ready. Speaking now…");
    speakStepAdvisor(spokenAdvisement, { resumeListening: true, updateDisplay: false, forceVoice: true });
  }

  function startStepAdvisor() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) throw new Error("This browser does not expose speech recognition. Use Chrome on HTTPS for step-aware no-hands Advisor.");
      try { stepRecognitionRef.current?.stop?.(); } catch {}
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      pushStepSpeechDebug("recognition create/start requested");
      recognition.onstart = () => {
        stepAdvisorEnabledRef.current = true;
        setStepAdvisorEnabled(true);
        setStepAdvisorListening(true);
        pushStepSpeechDebug(`recognition started; phase=${stepAdvisorConversationPhaseRef.current}`);
        setStatus?.(`ICY is online inside ${occasionItem.name}, Step ${safeIndex + 1}. Say ‘Hey ICY’ or ‘Advisor’.`);
        recordTelemetry?.("occasion_step_advisor_enabled", { occasion: occasionItem.name, occasionId: occasionItem.id, step: safeIndex + 1 });
      };
      recognition.onspeechstart = () => {
        pushStepSpeechDebug("speech detected");
        setStatus?.("ICY hears speech…");
      };
      recognition.onspeechend = () => {
        pushStepSpeechDebug("speech ended; waiting for final transcript");
      };
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const phrase = event.results[i][0]?.transcript || "";
          const finalFlag = Boolean(event.results[i].isFinal);
          pushStepSpeechDebug(`${finalFlag ? "final" : "interim"} transcript: ${phrase}`);
          if (finalFlag) handleStepAdvisorText(phrase);
        }
      };
      recognition.onerror = (event) => {
        const err = event?.error || "unknown";
        pushStepSpeechDebug(`recognition error: ${err}`);
        setStatus?.(`Wake-word recognition issue: ${err}. Use Tap to Speak or Type to ICY if wake mode does not capture.`);
        if (err === "aborted") {
          // Aborted errors usually mean Chrome is being start/stopped too quickly. Stop the loop.
          stepAdvisorEnabledRef.current = false;
          setStepAdvisorEnabled(false);
          setStepAdvisorListening(false);
          setStepTapToSpeakStatus("Wake mode aborted by the browser. Use Tap to Speak to ICY for stable capture.");
        }
      };
      recognition.onend = () => {
        setStepAdvisorListening(false);
        pushStepSpeechDebug(`recognition ended; enabled=${stepAdvisorEnabledRef.current}; phase=${stepAdvisorConversationPhaseRef.current}`);
        if (stepAdvisorEnabledRef.current) {
          // Avoid restart storms. Wake mode is optional; Tap to Speak is the stable path.
          stepAdvisorRestartCountRef.current += 1;
          if (stepAdvisorRestartCountRef.current <= 3) {
            pushStepSpeechDebug(`recognition restart #${stepAdvisorRestartCountRef.current}`);
            restartStepAdvisorListening(1600);
          } else {
            pushStepSpeechDebug("recognition restart limit reached; use Tap to Speak");
            stepAdvisorEnabledRef.current = false;
            setStepAdvisorEnabled(false);
            setStatus?.("Wake mode stopped to prevent browser abort loop. Use Tap to Speak to ICY.");
          }
        }
      };
      stepRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      pushStepSpeechDebug(`recognition start failed: ${err.message || String(err)}`);
      alert(err.message || String(err));
    }
  }

  function stopStepAdvisor() {
    // Stop listening/speaking only. Do NOT clear transcript, draft capture, pending decision,
    // Machine Passport clarification, or In-Step Report Review. Restart should resume in place.
    stepAdvisorEnabledRef.current = false;
    stepAdvisorSuppressUntilRef.current = Date.now() + 1200;
    try { stepRecognitionRef.current?.stop?.(); } catch {}
    clearStepAdvisorRestartTimer();
    stepAdvisorSpeakingRef.current = false;
    stopFastLocalSpeech();
    setStepAdvisorEnabled(false);
    setStepAdvisorListening(false);
    setStatus?.(`ICY stopped listening for this step. Current advisement workflow state is preserved: ${stepAdvisorPhase}. Restart ICY to continue from here.`);
    recordTelemetry?.("occasion_step_advisor_stopped_preserved", { occasion: occasionItem.name, occasionId: occasionItem.id, step: safeIndex + 1, phase: stepAdvisorConversationPhaseRef.current });
  }

  useEffect(() => () => { clearStepAdvisorRestartTimer(); clearStepAdvisorSpeechFallback(); try { stepRecognitionRef.current?.stop?.(); } catch {} stopFastLocalSpeech(); }, []);

  return <section className="walkthroughPage">
    <section className="card heroMini">
      <p className="eyebrow">{occasionItem.family || "Core Occasion"}</p>
      <h2>{occasionItem.name}</h2>
      <p className="successBox"><strong>Active walkthrough:</strong> {occasionItem.name}. This page walks through the selected Occasion step by step.</p>
      <p>{occasionItem.purpose}</p>
      <div className="specs"><p><strong>Drink / drink set</strong><span>{occasionItem.drink}</span></p><p><strong>Drink choices</strong><span>{occasionItem.drinkChoices}</span></p><p><strong>Dose / Yield / Time</strong><span>{occasionItem.dose} → {occasionItem.yield} · {occasionItem.time}</span></p><p><strong>Ratio / Build Guidance</strong><span>{occasionItem.ratioGuidance}</span></p><p><strong>Suggested total Occasion tempo</strong><span>{occasionItem.suggestedTempo || occasionItem.time}</span></p><p><strong>Intention</strong><span>{occasionItem.desiredFeeling}</span></p><p><strong>Guest Resonance prompt</strong><span>{occasionItem.guestResonancePrompt || "Did the cup and moment land with the guest?"}</span></p></div>
      <div className="noteBox"><strong>Preparation begins with Mise en Place.</strong> The goal is not speed. The goal is calm, repeatable readiness.</div>
    </section>
    <section className="card"><h2>Preparation</h2><div className="grid"><div className="noteBox"><strong>Home Coffee Mise en Place</strong><ul>{(occasionItem.preparation?.miseEnPlace || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div><div className="noteBox"><strong>Machine readiness</strong><ul>{(occasionItem.preparation?.machineReadiness || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div><div className="noteBox"><strong>Drink build / method readiness</strong><ul>{(occasionItem.preparation?.drinkBuildReadiness || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div><div className="noteBox"><strong>Service readiness</strong><ul>{(occasionItem.preparation?.serviceReadiness || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div></div><div className="noteBox"><strong>Advisor direction for this Occasion:</strong> {occasionItem.advisorDirection}<br/><strong>Recovery watchouts:</strong> {occasionItem.recoveryWatchouts}<br/><strong>First Sip Direction:</strong> {occasionItem.firstSipDirection}</div></section>
    <section className="card stepCard" ref={stepPanelRef}>
      <div className="stepProgress"><strong>Step {safeIndex + 1} of {steps.length}</strong><div className="stepDots">{steps.map((step, idx) => <button key={step.title + idx} className={idx === safeIndex ? "stepDot active" : stepTimings[idx] ? "stepDot done" : "stepDot"} onClick={() => goToStep(idx)} aria-label={`Go to step ${idx + 1}: ${step.title}`}>{idx + 1}</button>)}</div></div>
      <p className="eyebrow">Active stagecraft step</p>
      <h2>{current?.title}</h2>
      <p><strong>Suggested tempo:</strong> {current?.suggestedTempo || "60–90 sec"}</p>
      <p><strong>Action:</strong> {current?.action || current?.advisor}</p><p><strong>Why this matters:</strong> {current?.why || "This step supports the Occasion."}</p><p><strong>What to watch:</strong> {current?.watch || "Move calmly and preserve the moment."}</p><p><strong>Advisor guidance:</strong> {current?.advisor}</p>
      <div className="scriptPreview"><strong>Artisan Stagecraft Script</strong><p>{current?.script}</p></div>
      <section className="stepAdvisorPanel">
        <p className="eyebrow">ICY — Advisement Workflow Companion</p>
        <h3>Tap once in any Occasion step, then say “Hey ICY” or “Advisor.” ICY will answer first and wait.</h3>
        <p className="small">ICY comes online inside the active Occasion and the active step. It says, “I’m here. What are we working on?” That wake phrase does not write anything. After ICY answers, speak naturally: shot data, taste, puck behavior, guest reaction, stagecraft, uncertainty, or a recovery issue. ICY uses the current Occasion, current step, Machine Passport, grinder, machine category, house formula, telemetry, and form context. If the basics are missing, ICY asks a short setup checklist and writes the Machine Passport before advising. If enough context is present, it gives one calm next move, places information in the form as a draft, asks if you want to add or change anything, logs the artisan-confirmed decision, and keeps the Occasion moving.</p>
        <div className="buttonRow">
          <button className={icySessionActive ? "danger" : "primary"} type="button" onClick={icySessionActive ? stopIcyNoHandsSession : startIcyNoHandsSession}>{icySessionActive ? "Stop ICY No-Hands Session" : "Start ICY No-Hands Session"}</button>
          <button className="secondary" type="button" onClick={stepAudioRecording ? stopRecordedAudioAndSendToIcy : startRecordedAudioToIcy}>{stepAudioRecording ? "Stop + Transcribe" : "Record Audio to ICY"}</button>
          <button className="secondary" type="button" onClick={startTapToSpeakIcy}>Tap to Speak to ICY</button>
          <button className={stepAdvisorEnabled ? "danger" : "secondary"} type="button" onClick={stepAdvisorEnabled ? stopStepAdvisor : startStepAdvisor}>{stepAdvisorEnabled ? "Stop Wake Mode" : "Enable Wake Mode"}</button>
          <button className="secondary" type="button" onClick={() => handleStepAdvisorText("Hey ICY")}>Test ICY Wake Word</button>
          <button className="secondary" type="button" onClick={() => handleStepAdvisorText("the puck looks messy and the shot tastes a little thin")}>Test Natural Note</button>
          <button className="secondary" type="button" onClick={() => setActive("matrix")}>Something is wrong</button>
          <button className="secondary" type="button" onClick={() => setStepVoiceEnabled((v) => !v)}>{stepVoiceEnabled ? "Voice On" : "Voice Off / Text Only"}</button>
          <button className="secondary" type="button" onClick={pauseStepAdvisorVoice}>Pause Voice</button>
          <button className="secondary" type="button" onClick={resumeStepAdvisorVoice}>{stepVoicePaused ? "Resume Voice" : "Resume"}</button>
          <button className="secondary" type="button" onClick={stopStepAdvisorVoice}>Stop Voice</button>
          <button className="secondary" type="button" onClick={replayLastStepAdvisement}>Play ICY Advisement</button>
          <button className="secondary" type="button" onClick={resetStepAdvisorCapture}>Reset ICY Capture for This Step</button>
        </div>
        <div className={icySessionActive ? "successBox" : "noteBox"}><strong>ICY No-Hands Session:</strong> {icySessionStatus}<br/><small>Primary product path: start once, speak naturally, ICY transcribes, advises, speaks, and reopens listening for your next phrase. Phase: {icySessionPhase}. Last heard: {icySessionLastTranscript || "nothing yet"}.</small></div>
        <div className={stepAdvisorListening ? "successBox" : "noteBox"}><strong>Status:</strong> {stepAdvisorListening ? `Wake mode is listening. Phase: ${stepAdvisorPhase}.` : "Use Start ICY No-Hands Session as the primary path. Record Audio / Type to ICY remain as fallback controls."}</div>
        <div className="noteBox"><strong>Recorded-audio status:</strong> {stepAudioRecordStatus}<br/><small>Fallback path: tap <strong>Record Audio to ICY</strong>, speak the full issue, then tap <strong>Stop + Transcribe</strong>. This sends audio to /api/transcribe instead of relying on browser speech recognition.</small></div>
        {pendingAudioTranscript ? <div className="successBox"><strong>Confirm transcript before ICY advises</strong><p className="small">{transcriptGateStatus}</p><label className="label">Transcript ICY heard</label><textarea value={editableAudioTranscript} onChange={(e) => setEditableAudioTranscript(e.target.value)} placeholder="Edit the transcript before sending it to ICY." /><div className="buttonRow"><button className="primary" type="button" onClick={() => useConfirmedAudioTranscript()}>Use This Transcript</button><button className="secondary" type="button" onClick={rerecordAudioTranscript}>Re-record</button><button className="secondary" type="button" onClick={cancelAudioTranscriptGate}>Cancel</button></div></div> : null}
        <div className="noteBox"><strong>Tap-to-speak status:</strong> {stepTapToSpeakStatus}<br/><small>Fallback path: tap <strong>Tap to Speak to ICY</strong>, say the full issue, then let ICY process it.</small></div>
        <div className="noteBox"><strong>Voice status:</strong> {stepVoiceStatus}<br/><small>If ICY captures text but you do not hear guidance, tap <strong>Play ICY Advisement</strong>. The workflow state is preserved.</small></div>{stepAdvisorPendingDecision ? <div className="noteBox"><strong>Pending artisan decision:</strong><p>{stepAdvisorPendingDecision.suggestedAction || "ICY is waiting for the artisan to accept, change, or decline the suggested next move."}</p><small>Say “yes, that is what I will do,” “no, I will leave it,” or add more detail.</small></div> : null}
        <div className="grid">
          <Field label="Dose captured" value={profile?.quickShotDose || profile?.houseDose || ""} onChange={(v) => updateProfile?.("quickShotDose", v)} />
          <Field label="Yield captured" value={profile?.quickShotYield || profile?.houseYield || ""} onChange={(v) => updateProfile?.("quickShotYield", v)} />
          <Field label="Shot time captured" value={profile?.quickShotTime || occasion?.currentShotTime || profile?.houseShotTime || ""} onChange={(v) => updateProfile?.("quickShotTime", v)} />
          <Field label="Grind captured" value={profile?.quickShotGrind || profile?.grinderSetting || ""} onChange={(v) => updateProfile?.("quickShotGrind", v)} />
        </div>
        <div className="noteBox"><strong>Type to ICY fallback</strong><p className="small">If the microphone wakes ICY but does not capture the second phrase, type the exact issue here. This uses the same advisement workflow as voice, so we can verify the advisor logic separately from browser speech recognition.</p><textarea value={stepAdvisorManualInput} onChange={(e) => setStepAdvisorManualInput(e.target.value)} placeholder="Example: it was very bitter" /><div className="buttonRow"><button className="primary" type="button" onClick={submitStepAdvisorManualInput}>Send to ICY</button></div></div>
        <div className="noteBox"><strong>Voice capture diagnostics</strong>{stepSpeechDebug.length ? <ul>{stepSpeechDebug.map((line, idx) => <li key={idx}>{line}</li>)}</ul> : <p className="small">No speech recognition events recorded yet.</p>}</div>
        <label className="label">Step note / taste / recovery / Guest Resonance</label>
        <textarea value={stepAdvisorTranscript} onChange={(e) => setStepAdvisorTranscript(e.target.value)} placeholder="Voice notes captured inside this Occasion step appear here immediately." />
        <div className="successBox"><strong>Where this was written:</strong><p>{stepPlacementNotice}</p>{stepAdvisorFields?.length ? <small>Structured fields updated: {stepAdvisorFields.join(", ")}</small> : <small>If this was not structured shot data, it is still visible below as a Step Note and report context.</small>}</div>
        <div className="noteBox"><strong>Advisor repeat-back / guidance:</strong><p>{stepAdvisorReply}</p></div>
        <div className="stepReportReview">
          <h4>In-Step Report Review</h4>
          {stepReview ? <>
            <div className="reviewGrid">
              <div><strong>Artisan said</strong><p>{stepReview.transcript}</p></div>
              <div><strong>Written to</strong><p>{stepReview.writtenTo || "Step Notes"}</p></div>
              <div><strong>Report status</strong><p>{stepReview.reportStatus}</p></div>
              <div><strong>Advisor asks</strong><p>{stepReview.nextPrompt}</p></div>{stepReview.suggestedAction ? <div><strong>Suggested / chosen next move</strong><p>{stepReview.suggestedAction}</p></div> : null}
            </div>
            <div className="noteBox"><strong>Advisor Guidance for This Step</strong><p>{stepReview.advisorGuidance}</p></div>
            <div className="noteBox"><strong>Advisement Outcome / Community Learning</strong><p className="small">After you try the chosen next move, tell ICY what happened. This helps ICY learn from actual outcomes across machine types, recovery patterns, taste preferences, and community usage.</p><textarea value={advisementOutcome} onChange={(e) => setAdvisementOutcome(e.target.value)} placeholder="Example: I tried one step finer. The next pull had better body and less channeling, but still tasted a little sharp." /><div className="buttonRow"><button className="secondary" type="button" onClick={() => logAdvisementOutcome(advisementOutcome)}>Log Outcome for ICY Learning</button></div>{communityLearningNote ? <small>{communityLearningNote}</small> : null}</div>
            <label className="checkLine"><input type="checkbox" checked={stepReviewConfirmed} onChange={(e) => setStepReviewConfirmed(e.target.checked)} /> I reviewed this capture. It is written to the right place and should be included in the Doma Report.</label>
            <div className="buttonRow">
              <button className="secondary" type="button" onClick={() => { setStepAdvisorTranscript((prev) => `${prev ? `${prev}
` : ""}Artisan chose to add more before closing this step.`); setStepReviewConfirmed(false); }}>Add More / Ask Advisor Again</button>
              <button className="secondary" type="button" onClick={() => { startStep(); setStepReviewConfirmed(false); setStatus?.("Repeating the current Occasion step. Advisor capture remains in the ledger."); }}>Repeat This Step</button>
              <button className="primary" type="button" disabled={!stepReviewConfirmed} onClick={completeStep}>{safeIndex >= steps.length - 1 ? "Confirm + Complete Occasion" : "Confirm + Move to Next Step"}</button>
              <button className="secondary" type="button" onClick={() => { createReport?.(); setActive("reports"); }}>View Doma Report</button>
            </div>
          </> : <p className="small">After the Advisor captures something, this area will show exactly what was written, where it was written, the guidance saved to the report, and the next step choices.</p>}
        </div>
        <div className="captureLedger">
          <h4>Visible Capture Ledger for this Step</h4>
          {stepCaptureLedger.length ? stepCaptureLedger.map((entry) => <div className="captureItem" key={entry.id}>
            <p><strong>{entry.at}</strong> — {entry.occasion}, Step {entry.step}: {entry.stepTitle}</p>
            <p><strong>Artisan said:</strong> {entry.transcript}</p>
            <p><strong>Written to:</strong> {entry.routes.map((r) => r.label).join(" + ")}</p>
            {entry.fields?.length ? <p><strong>Fields updated:</strong> {entry.fields.join(", ")}</p> : <p><strong>Fields updated:</strong> Step note / contextual report note</p>}
            <p><strong>Advisor guidance saved:</strong> {entry.advisorGuidance}</p>
            <ul>{entry.routes.map((r) => <li key={r.label}><strong>{r.label}:</strong> {r.detail}</li>)}</ul>
          </div>) : <p className="small">Nothing has been captured for this step yet. Say “Hey ICY” or “Advisor,” then speak your shot specs, taste note, guest reaction, or issue.</p>}
        </div>
        <div className="buttonRow"><button className="primary" type="button" onClick={() => { createReport?.(); setActive("reports"); }}>Create / View Session Report</button><button className="secondary" type="button" onClick={() => setActive("tasting")}>Open Tasting Studio</button><button className="secondary" type="button" onClick={() => setActive("matrix")}>Open Recovery Notes</button></div>
      </section>
      <div className="tempoBox"><strong>Tempo Guide:</strong> {timerVisible ? "On" : "Hidden"}<div className="buttonRow"><button className="secondary" onClick={() => setTimerVisible((v) => !v)}>{timerVisible ? "Hide Timer" : "Show Timer"}</button><button className="primary" onClick={startStep}>Start Step</button><button className="primary" onClick={completeStep}>{safeIndex >= steps.length - 1 ? "Complete Occasion" : "Complete Step + Next"}</button></div>{timerVisible ? <div className="timerFace">{formatSeconds(elapsed)}</div> : <p className="small">Timer hidden. Your step time is still being captured for your Doma Report.</p>}{stepTimings[safeIndex]?.actualSeconds ? <p className="small">Captured actual: {formatSeconds(stepTimings[safeIndex].actualSeconds)}</p> : null}</div>
      <div className="buttonRow"><button className="secondary" onClick={readCurrentStep} disabled={stepReadBusy}>{stepReadBusy ? "Preparing audio…" : "Read Current Step"}</button><button className="secondary" onClick={stopStepReading}>Stop Reading</button><button className="secondary" disabled={safeIndex === 0} onClick={() => goToStep(safeIndex - 1)}>Previous Step</button><button className="secondary" disabled={safeIndex >= steps.length - 1} onClick={() => goToStep(safeIndex + 1)}>Next Step</button><button className="secondary" onClick={() => { setTranscript(current?.script || occasionItem.artisanOpening || ""); setActive("simulator"); }}>Send this step to Advisor</button><button className="secondary" onClick={() => setActive("matrix")}>What Went Wrong?</button></div>{stepAudioUrl === "__local_voice__" ? <div className="noteBox"><strong>Fast Step Read-Aloud:</strong> Speaking through the browser now. Use Stop Reading to interrupt.</div> : (stepAudioUrl ? <div className="noteBox"><strong>Step Read-Aloud Playback</strong><audio ref={stepAudioRef} controls autoPlay src={stepAudioUrl} /></div> : null)}{safeIndex >= steps.length - 1 ? <div className="successBox"><strong>Final step:</strong> Completing this step opens the Tasting Studio so you can capture flavor, Guest Resonance, and Doma Report detail.</div> : <p className="small">Complete Step will save this step time and automatically move you to Step {safeIndex + 2}.</p>}
    </section>
    <section className="card"><h2>Occasion Tempo Snapshot</h2><p><strong>Suggested total tempo:</strong> {occasionItem.suggestedTempo || occasionItem.time}</p><p><strong>Total actual time captured:</strong> {formatSeconds(timingMetrics.totalActualSeconds)}</p><p><strong>Personal best:</strong> Founder Benchmarks placeholder. Future anonymous cohort averages will compare Suggested Tempo, Your Actual Tempo, Personal Best, Founder Cohort Average, and Community Average later.</p><p className="small">Founder Benchmarks are not speed-only leaderboards. Future opt-in leaderboards should reward tempo quality, improvement, stagecraft, Guest Resonance, and calm readiness.</p></section>
    <section className="card"><h2>Full Occasion Stagecraft Script</h2><p className="small">The machine performs the extraction. The artisan performs the Occasion.</p><pre className="scriptFull">{scriptText}</pre><div className="buttonRow"><button className="secondary" onClick={readFullOccasionScript} disabled={stepReadBusy}>{stepReadBusy ? "Preparing audio…" : "Read Full Occasion Script"}</button><button className="secondary" onClick={stopStepReading}>Stop Reading</button><button className="secondary" onClick={() => setActive("occasions")}>Back to 21 Occasions</button><button className="secondary" onClick={() => setActive("tasting")}>Tasting / Flavor Wheel</button><button className="secondary" onClick={() => setActive("matrix")}>What Went Wrong?</button><button className="primary" onClick={createReport}>Create Doma Report</button></div></section>
  </section>;
}


function buildDialInReadiness(profile) {
  const attempts = Array.isArray(profile.dialInAttempts) ? profile.dialInAttempts : [];
  const hasRecipe = String(profile.confirmedRecipe || "").toLowerCase().includes("confirmed");
  const actualRecipe = `${profile.houseDose || "?"} in / ${profile.houseYield || "?"} out / ${profile.houseShotTime || "?"} · ratio ${profile.targetRatio || "?"} · grind ${profile.grinderSetting || "?"}`;
  let recommendation = hasRecipe
    ? "A house formula is confirmed. The Advisor can separate recipe issues from stagecraft and Occasion issues."
    : "Complete at least one Dial-In Session and save a house formula before judging the full Occasion presentation.";
  if (attempts.length && !hasRecipe) recommendation = `You have ${attempts.length} saved dial-in attempt${attempts.length === 1 ? "" : "s"}. Pick the strongest attempt and set it as the House Formula when it is repeatable.`;
  return { status: profile.confirmedRecipe || "Not captured", actualRecipe, attempts: attempts.length, recommendation };
}
function buildFluencyAssessment({ profile, selectedFounderOccasion, stepTimings, advisorSupportCount, correctionCount, recoverySupportCount, guestResonance, sensoryScores, timingMetrics }) {
  const selectedLevel = profile.advisorGuidanceLevel || "Building Consistency";
  const stepsTotal = selectedFounderOccasion?.steps?.length || 0;
  const stepsCompleted = Object.keys(stepTimings || {}).length;
  const stepCompletionPercent = stepsTotal ? Math.round((stepsCompleted / stepsTotal) * 100) : 0;
  const guestScore = Number(guestResonance?.score || 0);
  const tasteScore = Number(sensoryScores?.tasteClarity || 0);
  const stagecraftScore = Number(sensoryScores?.stagecraft || 0);
  const recoveryScore = Number(sensoryScores?.recoveryConfidence || 0);
  const setupScore = buildDialInReadiness(profile).status?.toLowerCase().includes("confirmed") ? 15 : 8;
  const completionScore = Math.min(20, Math.round(stepCompletionPercent / 5));
  const supportPenalty = Math.min(18, Number(advisorSupportCount || 0) * 3 + Number(recoverySupportCount || 0) * 4 + Number(correctionCount || 0) * 2);
  const sensoryContribution = Math.round(((tasteScore + stagecraftScore + recoveryScore + guestScore) / 20) * 35);
  const score = Math.max(0, Math.min(100, setupScore + completionScore + sensoryContribution + 30 - supportPenalty));
  let observedZone = "New to the Machine";
  if (score >= 88 && advisorSupportCount <= 1 && stepCompletionPercent >= 95) observedZone = "Data-Minded Artisan";
  else if (score >= 78 && advisorSupportCount <= 2 && stepCompletionPercent >= 90) observedZone = "Confident Home Barista";
  else if (score >= 62 && advisorSupportCount <= 4 && stepCompletionPercent >= 75) observedZone = "Building Consistency";
  const feedback = `You selected ${selectedLevel}. During this Occasion presentation, you used Advisor support ${advisorSupportCount || 0} time${advisorSupportCount === 1 ? "" : "s"}, Recovery support ${recoverySupportCount || 0} time${recoverySupportCount === 1 ? "" : "s"}, and correction/reassessment ${correctionCount || 0} time${correctionCount === 1 ? "" : "s"}. You completed ${stepsCompleted} of ${stepsTotal || "?"} stagecraft steps (${stepCompletionPercent}%). This suggests the Occasion performed in the ${observedZone} zone. Repeat with focus on confirmed dial-in, complete Mise en Place, puck prep, one calm recovery move, and Guest Resonance capture.`;
  return { score, selectedLevel, observedZone, advisorSupportCount: advisorSupportCount || 0, recoverySupportCount: recoverySupportCount || 0, correctionCount: correctionCount || 0, stepsCompleted, stepsTotal, stepCompletionPercent, feedback };
}

function buildTimingMetrics(occasionItem, stepTimings, occasionStartTime) {
  const totalActualSeconds = Object.values(stepTimings || {}).reduce((sum, item) => sum + (Number(item.actualSeconds) || 0), 0);
  return { suggestedTotalTempo: occasionItem?.suggestedTempo || occasionItem?.time || "Not set", totalActualSeconds, stepLevel: stepTimings || {}, previousAttempt: null, personalBest: null, improvementNote: "First captured attempt or no prior local attempt yet.", tempoReflection: "The goal is not speed. The goal is calm, repeatable readiness." };
}

function speakFastLocal(text, { rate = 1.02, pitch = 1, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) return false;
  try {
    const speechId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.__baristaDomaSpeechId = speechId;
    window.__baristaDomaSpeechStopped = false;
    try { window.speechSynthesis.cancel(); } catch {}
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = "en-US";
    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferred = voices.find((v) => /Samantha|Google US English|Microsoft.*Jenny|Alex|Natural/i.test(v.name)) || voices.find((v) => /en-US|English/i.test(v.lang));
    if (preferred) utterance.voice = preferred;
    window.__baristaDomaCurrentUtterance = utterance;
    utterance.onend = () => {
      if (window.__baristaDomaSpeechId === speechId) window.__baristaDomaCurrentUtterance = null;
      if (!window.__baristaDomaSpeechStopped && typeof onEnd === "function") onEnd();
    };
    utterance.onerror = () => {
      if (window.__baristaDomaSpeechId === speechId) window.__baristaDomaCurrentUtterance = null;
    };
    window.speechSynthesis.speak(utterance);
    return true;
  } catch { return false; }
}

function stopFastLocalSpeech() {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.__baristaDomaSpeechStopped = true;
      window.__baristaDomaCurrentUtterance = null;
      window.speechSynthesis.cancel();
      setTimeout(() => { try { window.speechSynthesis.cancel(); } catch {} }, 30);
      setTimeout(() => { try { window.speechSynthesis.cancel(); } catch {} }, 120);
    }
  } catch {}
}

function applyVoiceTextToFields(text, { updateProfile, updateOccasion, setGuestResonance, setTastingNote, recordTelemetry } = {}) {
  const parsed = parseQuickShotNote(text || "");
  const lower = String(text || "").toLowerCase();
  const changed = [];
  if (parsed.dose && updateProfile) { updateProfile("houseDose", parsed.dose); updateProfile("quickShotDose", parsed.dose); changed.push("dose"); }
  if (parsed.yield && updateProfile) { updateProfile("houseYield", parsed.yield); updateProfile("quickShotYield", parsed.yield); changed.push("yield"); }
  if (parsed.time) {
    if (updateProfile) { updateProfile("houseShotTime", parsed.time); updateProfile("quickShotTime", parsed.time); }
    if (updateOccasion) updateOccasion("currentShotTime", parsed.time);
    changed.push("shot time");
  }
  if (parsed.grind && updateProfile) { updateProfile("grinderSetting", parsed.grind); updateProfile("quickShotGrind", parsed.grind); changed.push("grind"); }
  if (parsed.liked && updateProfile) { updateProfile("quickShotLiked", parsed.liked); changed.push("preference"); }
  if (parsed.serve && updateProfile) { updateProfile("quickShotServeAgain", parsed.serve); changed.push("serve again"); }
  if (parsed.likedNotes && updateProfile) { updateProfile("quickShotLikedNotes", parsed.likedNotes); changed.push("taste notes"); }
  if (parsed.change && updateProfile) { updateProfile("quickShotChange", parsed.change); changed.push("next adjustment"); }
  if ((lower.includes("guest") || lower.includes("served") || lower.includes("liked it") || lower.includes("loved it")) && setGuestResonance) {
    setGuestResonance((prev) => ({ ...prev, reaction: lower.includes("loved") || lower.includes("delighted") ? "delighted" : (prev.reaction || "curious"), guestQuote: text || prev.guestQuote, wouldServeAgain: parsed.serve || prev.wouldServeAgain || "yes" }));
    changed.push("Guest Resonance");
  }
  if ((lower.includes("sweet") || lower.includes("bitter") || lower.includes("sour") || lower.includes("smooth") || lower.includes("body") || lower.includes("thin") || lower.includes("bright")) && setTastingNote) {
    setTastingNote(text);
    changed.push("tasting note");
  }
  if (recordTelemetry && changed.length) recordTelemetry("voice_to_field_applied", { fields: changed, transcriptLength: String(text || "").length });
  return changed;
}



function getStepAdvisementMode(currentStep = {}) {
  const title = String(currentStep?.title || "").toLowerCase();
  const action = String(currentStep?.action || "").toLowerCase();
  const advisor = String(currentStep?.advisor || "").toLowerCase();
  const combined = `${title} ${action} ${advisor}`;
  if (/occasion intention|set the occasion|intention|desired feeling|purpose|human purpose/.test(combined)) return "occasion-intention";
  if (/script|stagecraft|say|present|serve|guest|resonance|first sip/.test(combined)) return "stagecraft";
  if (/mise|place|readiness|prep|prepare|set up|setup/.test(combined)) return "preparation";
  if (/taste|sip|palate|flavor|sensory/.test(combined)) return "taste";
  if (/dose|yield|grind|shot|pull|extraction|espresso/.test(combined)) return "technical";
  return "step-context";
}

function isClearlyTechnicalIssue(text = "") {
  const lower = String(text || "").toLowerCase();
  return /dose|yield|grams?|shot|time|seconds?|grind|finer|coarser|fast|slow|gush|chok|no flow|few drops|sour|bitter|harsh|dry|watery|thin|puck|channel|spray|milk|foam|steam|temperature|temp|pressure|basket/.test(lower);
}

function getContextualIcyChecklist(text, { profile, occasion, occasionItem, currentStep } = {}) {
  const raw = String(text || "").trim();
  const lower = raw.toLowerCase();
  const stepMode = getStepAdvisementMode(currentStep);
  const forceStepContext = stepMode !== "technical" && !isClearlyTechnicalIssue(raw);
  const machine = profile?.machine || profile?.espressoMachine || profile?.allInOneMachine || profile?.machineType || "";
  const grinder = profile?.grinder || profile?.grinderModel || "";
  const dose = profile?.quickShotDose || profile?.houseDose || "";
  const yieldOut = profile?.quickShotYield || profile?.houseYield || "";
  const shotTime = profile?.quickShotTime || occasion?.currentShotTime || profile?.houseShotTime || "";
  const grind = profile?.quickShotGrind || profile?.grinderSetting || "";
  const beans = profile?.beans || profile?.beanName || profile?.coffeeBeans || "";
  const missing = [];
  if (!forceStepContext) {
    if (!machine) missing.push("machine");
    if (!grinder) missing.push("grinder");
    if (!dose) missing.push("dose");
    if (!yieldOut) missing.push("yield");
    if (!shotTime) missing.push("shot time");
    if (!grind) missing.push("grind setting");
    if (!beans) missing.push("beans");
  }

  let category = forceStepContext ? stepMode : "observation";
  if (forceStepContext && stepMode === "occasion-intention") category = "occasion-intention";
  else if (forceStepContext && stepMode === "stagecraft") category = "stagecraft/guest";
  else if (forceStepContext && stepMode === "preparation") category = "preparation";
  else if (forceStepContext && stepMode === "taste") category = "taste";
  else if (/few drops|no flow|barely drip|barely dripping|chok|nothing came out|stalled/.test(lower)) category = "choke/no-flow";
  else if (/runny|watery|thin|fast|gush|too quick|ran quick|ran fast|weak/.test(lower)) category = "fast/thin";
  else if (/messy puck|wet puck|soupy puck|fractured puck|puck|channel|spray|spurt|uneven/.test(lower)) category = "puck/flow";
  else if (/bitter|dry|ashy|harsh|over extract|over-extract/.test(lower)) category = "bitter/harsh";
  else if (/sour|sharp|acid|under extract|under-extract/.test(lower)) category = "sour/sharp";
  else if (/milk|foam|texture|steaming|latte|cappuccino|flat white/.test(lower)) category = "milk/texture";
  else if (/guest|serve|present|script|say to|room|occasion|feeling|resonance/.test(lower)) category = "stagecraft/guest";
  else if (/cold|iced|tonic|sparkling|matcha|foam|refreshing|sweet/.test(lower)) category = "cold/sensory";
  else if (/i like|liked|love|loved|good|tastes good|acceptable|would serve/.test(lower)) category = "preference-positive";

  const common = [];
  if (!dose || !yieldOut || !shotTime) common.push("Give me the shot numbers if you have them: dose in, yield out, and shot time.");
  if (!grind) common.push("Tell me the current grind setting or whether you changed it from the last pull.");
  if (!beans) common.push("Confirm the bean/roast if it matters for this cup.");

  let checklist = [];
  if (category === "occasion-intention") checklist = [
    "What is the purpose of this cup or moment?",
    "What feeling should the guest or household carry away: soft, steady, gentle, cared for, playful, impressive, or calm?",
    "Who is receiving this moment, and what do they need right now?",
    "Should ICY keep the guidance quiet and human-centered, or more technical once the purpose is set?"
  ];
  else if (category === "preparation") checklist = [
    "What needs to be ready before the machine work starts?",
    "Is the drinkware, water, milk, bean, towel, and serving space in place?",
    "Is there anything that could interrupt the moment once the step begins?",
    "Should ICY keep this as a readiness note or a recovery concern?"
  ];
  else if (category === "taste") checklist = [
    "What did you notice first: sweetness, acidity, body, texture, finish, or balance?",
    "Did the cup match the intended feeling for this Occasion?",
    "Would you serve it again in this moment?",
    "Should ICY save this as a preference, an adjustment, or a guest-resonance note?"
  ];
  else if (category === "fast/thin") checklist = [
    "Was the flow fast from the start, or did it speed up after blonding?",
    "What are the dose, yield, and time for this pull?",
    "Did the cup taste sour, hollow, watery, or just brighter than expected?",
    "Did anything change from the last good pull: grind, dose, beans, distribution, or tamp?"
  ];
  else if (category === "choke/no-flow") checklist = [
    "Did the pump run with only a few drops, or was there no flow at all?",
    "What dose is in the basket, and is it higher than your normal house formula?",
    "Did the grind move finer before this pull?",
    "Was the puck level and evenly distributed before tamping?"
  ];
  else if (category === "puck/flow") checklist = [
    "Is the cup itself acceptable, or is the puck only visually messy?",
    "Did you see channeling, spraying, or uneven flow during the shot?",
    "What basket, dose, and puck screen/headspace are you using?",
    "Did the issue repeat, or was this only one pull?"
  ];
  else if (category === "bitter/harsh") checklist = [
    "Is the bitterness pleasant chocolate/cocoa, or dry and lingering?",
    "What was the yield and shot time compared with your house formula?",
    "Did the cup feel heavy and dry at the finish?",
    "Would you serve it as-is, or does it need softening?"
  ];
  else if (category === "sour/sharp") checklist = [
    "Is the acidity pleasant and bright, or sharp and unpleasant?",
    "What was the yield and time compared with your house formula?",
    "Did the body feel thin or underdeveloped?",
    "Would a slightly finer grind or slightly longer yield fit your taste goal?"
  ];
  else if (category === "milk/texture") checklist = [
    "Are you missing sweetness, shine, microfoam, temperature, or pourability?",
    "What drink are you building: cappuccino, latte, flat white, or another milk drink?",
    "Did the milk stretch too long, not enough, or get too hot?",
    "Does the texture match the Occasion you are trying to serve?"
  ];
  else if (category === "stagecraft/guest") checklist = [
    "Who is the cup for, and what should they feel when they receive it?",
    "Do you want the script to sound warm, impressive, quiet, playful, or brief?",
    "Is the guest waiting, watching, or already seated?",
    "Should the cup be served with explanation, or should the first sip speak first?"
  ];
  else if (category === "cold/sensory") checklist = [
    "Should this drink feel refreshing, sweet, creamy, sparkling, or bold?",
    "What is the sweetness level you want: low, balanced, or dessert-like?",
    "Is espresso the center of the drink, or an accent inside the build?",
    "What should the guest notice first: aroma, color, chill, foam, citrus, or finish?"
  ];
  else if (category === "preference-positive") checklist = [
    "What exactly did you like: sweetness, body, acidity, finish, texture, or the way it landed?",
    "Do you want to save this as a reference recipe or house preference?",
    "Would you serve it again in this Occasion?",
    "Should we keep the numbers steady next time and only refine presentation?"
  ];
  else checklist = [
    "Tell me whether this is shot data, taste feedback, puck behavior, guest reaction, or stagecraft.",
    "What are the dose, yield, time, and grind if this involves extraction?",
    "Do you like the cup, or are we trying to adjust it?",
    "What should the Occasion feel like when it lands?"
  ];

  return { category, missing, checklist, common };
}

function buildOccasionAwareAdvisorReply(text, { occasionItem, currentStep, stepNumber, totalSteps, profile, occasion, changedFields, routing } = {}) {
  const raw = String(text || "").trim();
  const lower = raw.toLowerCase();
  const parsed = parseQuickShotNote(raw);
  const houseDose = profile?.houseDose || profile?.quickShotDose || "not set";
  const houseYield = profile?.houseYield || profile?.quickShotYield || "not set";
  const houseTime = profile?.houseShotTime || occasion?.currentShotTime || profile?.quickShotTime || "not set";
  const grind = profile?.grinderSetting || profile?.quickShotGrind || parsed.grind || "not captured";
  const machine = profile?.machine || profile?.espressoMachine || profile?.allInOneMachine || profile?.machineType || "your machine";
  const grinder = profile?.grinder || profile?.grinderModel || "your grinder";
  const occasionName = occasionItem?.name || occasion?.occasionName || "this Occasion";
  const stepTitle = currentStep?.title || "this step";
  const routeLabels = Array.isArray(routing) && routing.length ? routing.map((r) => r.label) : [];
  const writtenTo = routeLabels.length ? `I wrote this to ${routeLabels.join(" and ")}. You can verify it in the Where this was written panel on this same step, and it will be included in your Doma Report when you create the report.` : "I kept this as a visible Step Note and Doma Report context.";
  const fields = changedFields?.length ? ` I also updated these visible fields: ${changedFields.join(", ")}.` : "";
  const ctx = getContextualIcyChecklist(raw, { profile, occasion, occasionItem, currentStep });
  const stepMode = getStepAdvisementMode(currentStep);
  const stepAnchored = stepMode !== "technical" && !isClearlyTechnicalIssue(raw);
  const missingLine = stepAnchored
    ? " This step does not need machine troubleshooting unless you ask for it; I am staying with the step purpose."
    : (ctx.missing.length ? ` I still need ${ctx.missing.slice(0, 4).join(", ")} to make this more precise.` : " I have enough basic setup context to give you a first next move.");
  const checklistLine = ctx.checklist.slice(0, 3).map((q, i) => `${i + 1}) ${q}`).join(" ");
  let guidance = "";

  if (ctx.category === "occasion-intention") {
    guidance = `This is an Occasion intention step. I am not moving into shot repair or machine variables yet. Say the purpose out loud, choose the desired feeling, and let that become the anchor for the rest of the Occasion. A strong capture would sound like: “This is a quiet table moment. I want it to feel soft, steady, gentle, and cared for.”`;
  } else if (ctx.category === "preparation") {
    guidance = `This is a preparation/readiness step. Stay with the checklist and remove friction before the cup begins. ICY should help protect the moment, not jump ahead into extraction unless you report a technical issue.`;
  } else if (ctx.category === "taste") {
    guidance = `This is a taste/palate step. Describe what landed first and whether it matched the intended Occasion. ICY should capture preference and guest resonance before suggesting technical adjustment.`;
  } else if (ctx.category === "choke/no-flow") {
    guidance = `This sounds like a choke or no-flow condition, not a fast shot. With ${machine} and ${grinder}, compare against your house formula of ${houseDose} in, ${houseYield} out, around ${houseTime}. First stop the pump, knock out the puck, purge, and try one to two steps coarser only if the dose and prep were normal.`;
  } else if (ctx.category === "fast/thin") {
    guidance = `This sounds like fast flow or a thin cup. Compare it to your house formula: ${houseDose} in, ${houseYield} out, around ${houseTime}, grind ${grind}. If the taste is watery, sour, or hollow, keep the dose steady and move one small step finer. If you actually like the brightness, save it as a preference instead of treating it as failure.`;
  } else if (ctx.category === "puck/flow") {
    guidance = `I am treating this as puck and flow behavior, not automatically a failed cup. First read the cup. If it tastes good and the flow was acceptable, log the puck observation and keep going. If it repeats with thin taste, spraying, or channeling, check distribution, tamp level, headspace, and grind before changing multiple variables.`;
  } else if (ctx.category === "bitter/harsh") {
    guidance = `This points toward harshness or over-extraction only if the finish is dry and unpleasant. Compare yield and time against ${houseDose} in, ${houseYield} out, around ${houseTime}. Taste first; then consider one variable: slightly shorter yield or one step coarser.`;
  } else if (ctx.category === "sour/sharp") {
    guidance = `This may be under-extraction or simply brighter acidity than expected. If the cup is sharp and thin, keep dose steady and consider one step finer or slightly more yield. If you like the brightness, capture it as a taste preference for this bean.`;
  } else if (ctx.category === "milk/texture") {
    guidance = `This is a milk texture and service-fit question. Tell me whether the issue is sweetness, temperature, foam thickness, shine, or pourability. Then we can adjust stretch time, roll, temperature, or drink build without changing the espresso unnecessarily.`;
  } else if (ctx.category === "stagecraft/guest") {
    guidance = `This is an Occasion/stagecraft moment. Stay focused on the person receiving the cup. Use a short script: ${currentStep?.script || "I made this for this moment. Tell me what you notice first."}`;
  } else if (ctx.category === "cold/sensory") {
    guidance = `This is a sensory-build decision. Decide the first impression: refreshing, creamy, sparkling, sweet, or bold. Then adjust sweetness, dilution, ice, foam, or citrus around that intended guest experience.`;
  } else if (ctx.category === "preference-positive") {
    guidance = `Good. If you like the cup, we do not need to treat imperfect numbers as failure. Save what you liked and connect it to the recipe so you can repeat it later.`;
  } else {
    guidance = `I captured this as a contextual note for the current Occasion step. I am not going to guess beyond the data. Answer one or two checklist items and I can narrow the next move.`;
  }

  const anchorLine = stepAnchored ? " Step-context lock is on, so I will stay inside this step unless you clearly ask for technical recovery." : " You raised a technical issue, so I am allowing technical recovery while keeping the active step visible.";
  return `I'm here with you in ${occasionName}, Step ${stepNumber} of ${totalSteps}: ${stepTitle}.${anchorLine} ${writtenTo}${fields}${missingLine} Based on what you said, I am reading this as ${ctx.category}. ${guidance} Quick checklist: ${checklistLine} If you answer those, I can refine the next move. This guidance is marked for the Doma Report, and you can Add More, Repeat This Step, View Report, or Move to Next Step.`;
}

function formatSeconds(value) { const n = Math.max(0, Number(value) || 0); const m = Math.floor(n/60); const s = n % 60; return `${m}:${String(s).padStart(2,"0")}`; }

function OccasionSetup({ occasion, updateOccasion, setActive, loadClearFastShot, setupMissing, requireSetupThen }) {
  const setupComplete = !setupMissing?.length;
  return <section className="card"><h2>Occasion Setup</h2><p className="small">The product is not only about the cup. It prepares the barista for the moment.</p>{setupComplete ? <div className="successBox"><strong>Setup complete.</strong> You can begin a live Advisor Session.</div> : <div className="errorBox"><strong>Setup incomplete.</strong> Complete before beginning: {setupMissing.join(", ")}</div>}<div className="grid"><Field label="Occasion name" value={occasion.occasionName} onChange={(v) => updateOccasion("occasionName", v)} /><Field label="Drink" value={occasion.drink} onChange={(v) => updateOccasion("drink", v)} /><Field label="Who is being served" value={occasion.guest} onChange={(v) => updateOccasion("guest", v)} /><Field label="Time pressure" value={occasion.timePressure} onChange={(v) => updateOccasion("timePressure", v)} /><Field label="Current shot time" value={occasion.currentShotTime} onChange={(v) => updateOccasion("currentShotTime", v)} /><Field label="Suggested total Occasion tempo" value={occasion.suggestedTempo || ""} onChange={(v) => updateOccasion("suggestedTempo", v)} /><Field label="Recurrence / pattern" value={occasion.recurrence} onChange={(v) => updateOccasion("recurrence", v)} /></div><label className="label">Desired feeling / delight</label><input value={occasion.desiredFeeling} onChange={(e) => updateOccasion("desiredFeeling", e.target.value)} /><label className="label">Moment intent</label><textarea value={occasion.momentIntent} onChange={(e) => updateOccasion("momentIntent", e.target.value)} /><div className="buttonRow"><button className="secondary" onClick={loadClearFastShot}>Load Sample Before-Church Occasion</button><button className="secondary" onClick={() => setActive("matrix")}>Open What Went Wrong Matrix</button><button className="primary" onClick={() => requireSetupThen("simulator")}>Begin Occasion Simulation</button></div></section>;
}

function Simulator(props) {
  const { recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, advisorAudioRef, stopAdvisorVoice, beginCorrection, correctionMode, createReport, applyTranscriptToForms, uploadAsset, setUploadAsset, handleAdvisorUpload, sensoryScores, guestResonance, profile, occasion, reports, handsFreeEnabled, handsFreeCaptureActive, handsFreeStatus, startHandsFreeAdvisor, stopHandsFreeAdvisor } = props;
  const liveSessionReport = buildLiveSessionReport({ profile, occasion, sensoryScores, guestResonance, transcript, advisorText, matrixMatch });
  return <>
    <section className="card">
      <h2>Advisor Voice Capture + Visual Upload</h2>
      <div className="successBox"><strong>Voice capture is restored here.</strong><br/>Tap Start Recording, speak naturally, stop recording, and Barista Doma will transcribe the artisan voice and attempt to fill relevant fields.</div>
      <div className={handsFreeEnabled ? "successBox" : "noteBox"}>
        <strong>No-hands wake word:</strong> {handsFreeStatus}
        <p className="small">Use this when your hands are wet or occupied. Say <strong>“Advisor”</strong>, then speak slowly: “18 grams in, 36 grams out, 27 seconds, grind 8. I liked the sweetness and would serve it.” Barista Doma will repeat the final note and place the values into the form.</p>
        <div className="buttonRow"><button className={handsFreeEnabled ? "danger" : "primary"} type="button" onClick={handsFreeEnabled ? stopHandsFreeAdvisor : startHandsFreeAdvisor}>{handsFreeEnabled ? "Stop No-Hands Advisor" : "Enable No-Hands Advisor"}</button>{handsFreeCaptureActive ? <span className="pill">Advisor is recording the conversation</span> : null}</div>
      </div>
      <p className="small">Speak what is happening with the cup, machine, room, guest, or occasion — or upload a photo/video of the puck, flow, milk, cup, or machine screen. The Advisor receives the Doma Profile, Machine Passport, Dial-In Profile, Occasion setup, voice, typed issue, and upload notes together.</p>
      <div className="buttonRow">
        <button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : () => startRecording("replace")}>{recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}</button>
        <button className="secondary" onClick={() => startRecording("append")} disabled={recording}>Add Spoken Detail / Correction</button>
      </div>
      {correctionMode ? <div className="noteBox"><strong>Correction mode:</strong> Tell the Advisor what it misunderstood, for example: “No, it was not running fast. It was barely dripping, only a few drops came out.”</div> : null}
      {audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}
      <label className="label">Artisan transcript / comment</label>
      <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Speak or type what happened. Corrections are appended here." />
      <div className="buttonRow"><button className="secondary green" type="button" onClick={applyTranscriptToForms}>Apply Voice Note to Form Fields</button></div>
      <div className="uploadPanel">
        <h3>Upload Photo/Video for Advisor Analysis</h3>
        <p className="small">Restore photo/video context for puck, basket, espresso flow, milk texture, latte art, machine screen, or cup result. The Advisor uses this with the form and voice notes.</p>
        <div className="grid">
          <div><label className="label">Upload photo</label><input type="file" accept="image/*" onChange={(e) => handleAdvisorUpload(e.target.files?.[0], "photo")} /></div>
          <div><label className="label">Upload video</label><input type="file" accept="video/*" onChange={(e) => handleAdvisorUpload(e.target.files?.[0], "video")} /></div>
        </div>
        {uploadAsset?.fileName ? <div className="successBox"><strong>Attached:</strong> {uploadAsset.fileName}<br/><strong>Type:</strong> {uploadAsset.kind} · {uploadAsset.fileType}<br/>{uploadAsset.previewUrl && uploadAsset.kind === "photo" ? <img src={uploadAsset.previewUrl} alt="Advisor upload preview" className="uploadPreview" /> : null}</div> : <div className="noteBox">No photo or video attached yet.</div>}
        <label className="label">What should the Advisor inspect in the photo/video?</label>
        <textarea value={uploadAsset?.notes || ""} onChange={(e) => setUploadAsset((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Example: look at the puck, only a few drops came out, milk is too foamy, flow is spraying, crema disappeared…" />
        <div className="buttonRow"><button className="secondary" onClick={() => setUploadAsset({ fileName: "", fileType: "", kind: "", notes: "", previewUrl: "" })}>Clear Upload</button></div>
      </div>
      <button className="primary" onClick={generateAdvisorResponse} disabled={respondBusy}>{respondBusy ? "Assessing…" : "Generate Advisor Response"}</button>
    </section>
    <section className="card advisorCard">
      <h2>Premium Advisor Response</h2>
      {synthesis ? <SynthesisPanel synthesis={synthesis} /> : <div className="noteBox">Advisor Understanding will appear here.</div>}
      {matrixMatch ? <div className="successBox"><strong>Likely Matrix Match:</strong> {matrixMatch.label}<br /><strong>Matrix One Next Move:</strong> {matrixMatch.oneNextMove}</div> : <div className="noteBox"><strong>Matrix Match:</strong> None applied yet, or not appropriate for the artisan's intent.</div>}
      <label className="label">Advisor response</label>
      <textarea value={advisorText} onChange={(e) => setAdvisorText(e.target.value)} />
      <label className="label">Advisor voice option</label>
      <select value={advisorVoice} onChange={(e) => setAdvisorVoice(e.target.value)}><option value="alloy">Alloy — balanced and clear</option><option value="verse">Verse — expressive and warm</option><option value="sage">Sage — calm and composed</option><option value="coral">Coral — bright and friendly</option><option value="ash">Ash — steady and grounded</option></select>
      <div className="buttonRow">
        <button className="primary" onClick={generateAdvisorVoice} disabled={advisorBusy || !advisorText}>{advisorBusy ? "Generating…" : "Generate Advisor Voice"}</button>
        <button className="secondary" onClick={stopAdvisorVoice} disabled={!advisorAudioUrl && !advisorText}>Stop Advisor</button>
        <button className="secondary green" onClick={beginCorrection} disabled={!advisorText || advisorText === advisorStarterText}>Correct / Add Detail</button>
        <button className="secondary" onClick={createReport} disabled={!advisorText || advisorText === advisorStarterText}>Create Doma Report</button>
      </div>
      {advisorAudioUrl === "__local_voice__" ? <div className="successBox"><strong>Fast Advisor Voice:</strong> Speaking through the browser now. Use Stop Advisor to interrupt.</div> : (advisorAudioUrl ? <><h3>Advisor Audio Playback</h3><audio ref={advisorAudioRef} controls autoPlay src={advisorAudioUrl} /></> : null)}
    </section>
    <section className="card">
      <h2>Live Session Report Preview</h2>
      <p className="small">These are the graphs that should also appear in the saved Doma Report. They update from the current session data so the artisan can see the Occasion Presentation before printing or exporting.</p>
      <DomaPerformanceDashboard report={liveSessionReport} previous={(reports || [])[0]} reports={[...(reports || []), liveSessionReport]} compact />
    </section>
  </>;
}

function Reports({ reports, clearReports, setActive, printReport, exportReportsCSV, loadSampleReports, telemetryEvents }) {
  const latest = reports[0] || null;
  const previous = reports[1] || null;
  return <section className="reportsPage">
    <section className="card reportHero">
      <p className="eyebrow">Doma Reports / Second Coffee Brain</p>
      <h1>Performance reporting for the cup, the machine, and the Occasion.</h1>
      <p>Barista Doma should become the one true source for the artisan’s machine, recipes, dosing, recoveries, tasting notes, charts, Guest Resonance, and Occasion performance.</p>
      <div className="buttonRow"><button className="primary" onClick={() => setActive("simulator")}>Create New Occasion Report</button><button className="secondary" onClick={() => setActive("tasting")}>Open Tasting Studio</button><button className="secondary" onClick={exportReportsCSV} disabled={!reports.length}>Export CSV</button><button className="secondary green" onClick={loadSampleReports}>Load Sample Reports</button><button className="secondary" onClick={() => setActive("certification")}>Certification Progress</button><button className="secondary" onClick={clearReports}>Clear Local Reports</button></div>
    </section>

    <TelemetryPanel summary={buildTelemetrySummary(telemetryEvents || [])} events={telemetryEvents || []} compact />
    <CertificationProgressReport reports={reports} telemetryEvents={telemetryEvents || []} setActive={setActive} />
    <section className="card"><h2>How certification is completed</h2><p className="small">Production rule: an Occasion patch unlocks after the artisan completes every step in the walkthrough, captures taste/preference, records Guest Resonance, and creates a Doma Report. For this founder prototype, use <strong>Record Completion Evidence</strong> on any locked patch so we can test the pathway, progress bars, reports, and certificate unlock behavior end to end.</p></section>

    {!latest ? <div className="successBox"><strong>Sample reports available.</strong><br/>Click “Load Sample Reports” to show synthetic Doma Reports with scores, charts, Dial-In Readiness, Guest Resonance, trend plots, and print/export examples.</div> : null}

    {latest ? <section className="card"><h2>Current Performance Dashboard</h2><p className="small">Radar for balance, bar chart for category comparison, and a Decent-inspired plot for nerd-minded progression.</p><DomaPerformanceDashboard report={latest} previous={previous} reports={reports} /></section> : <div className="noteBox">No reports yet. Run the Simulator or Tasting Studio and create a Doma Report.</div>}

    {reports.map((r, idx) => <article className="report" key={r.id}>
      <h3>{r.title}</h3>
      <p className="small">{r.createdAt} • {r.drink} • Served to: {r.guest}</p>
      <div className="reportGrid">
        <div className="noteBox"><strong>Machine + Formula</strong><br/>Machine: {r.machineInfo?.machine || r.context?.machine || "Not captured"}<br/>Grinder: {r.machineInfo?.grinder || r.context?.grinder || "Not captured"}<br/>Beans: {r.machineInfo?.beans || r.context?.beans || "Not captured"}<br/>Dose → Yield: {r.dosingInfo?.dose || r.context?.dose || "?"} → {r.dosingInfo?.yield || r.context?.yield || "?"}<br/>House time: {r.dosingInfo?.houseShotTime || "Not captured"}<br/>Actual/observed time: {r.dosingInfo?.currentShotTime || r.context?.shotTime || "Not captured"}</div>
        <div className="successBox"><strong>Confidence + Trend</strong><br/>Machine Confidence: {r.confidenceMetrics?.machineConfidence ?? r.sensoryScores?.machineConfidence ?? "—"}<br/>Taste Clarity: {r.confidenceMetrics?.tasteClarity ?? r.sensoryScores?.tasteClarity ?? "—"}<br/>Stagecraft: {r.confidenceMetrics?.stagecraft ?? r.sensoryScores?.stagecraft ?? "—"}<br/>Recovery Confidence: {r.confidenceMetrics?.recoveryConfidence ?? r.sensoryScores?.recoveryConfidence ?? "—"}<br/>Trend: {r.trendSummary || "First report or no prior comparison."}</div>
      </div>
      {r.fluency ? <div className="successBox"><strong>Occasion Presentation Score:</strong> {r.fluency.score}/100 · <strong>Selected:</strong> {r.fluency.selectedLevel} · <strong>Observed zone:</strong> {r.fluency.observedZone}<br/><strong>Advisor support:</strong> {r.fluency.advisorSupportCount} · <strong>Recovery support:</strong> {r.fluency.recoverySupportCount} · <strong>Corrections:</strong> {r.fluency.correctionCount} · <strong>Step completion:</strong> {r.fluency.stepCompletionPercent}%<br/>{r.fluency.feedback}</div> : null}
      {r.dialInReadiness ? <div className="noteBox"><strong>Dial-In Readiness:</strong> {r.dialInReadiness.status}<br/><strong>Actual recipe:</strong> {r.dialInReadiness.actualRecipe}<br/><strong>Recommendation:</strong> {r.dialInReadiness.recommendation}</div> : null}
      {r.telemetrySnapshot ? <div className="noteBox"><strong>Development Telemetry Snapshot:</strong> {r.telemetrySnapshot.total} captured signal(s)<br/>{Object.entries(r.telemetrySnapshot.groups || {}).map(([group, count]) => <span key={group} className="telemetryPill">{group}: {count}</span>)}<br/><small>Telemetry groups the artisan’s shot, dial-in, taste, recovery, Advisor, Occasion, report, and Guest Resonance signals so future coaching can become more personal.</small></div> : null}
      <DomaPerformanceDashboard report={r} previous={reports[idx + 1]} reports={reports.slice(idx)} compact />
      <p><strong>Artisan said:</strong> {r.transcript || "No transcript captured."}</p>
      <p><strong>Matrix:</strong> {r.matrixMatch?.label || "None"}</p>
      <p><strong>Flavor notes:</strong> {(r.selectedFlavorNotes || []).join(", ") || "No flavor notes selected."}</p>
      {r.guestResonance ? <div className="successBox"><strong>Guest Resonance:</strong> {r.guestResonance.score}/5 · {r.guestResonance.status || "status not captured"} · {r.guestResonance.reaction} · first noticed {r.guestResonance.firstThingNoticed}<br/><strong>Would serve again:</strong> {r.guestResonance.wouldServeAgain} · <strong>Next adjustment:</strong> {r.guestResonance.nextAdjustment}<br/><strong>Guest quote/observation:</strong> {r.guestResonance.quote || "Not captured."}</div> : null}
      {r.timingMetrics ? <div className="noteBox"><strong>Occasion Tempo:</strong> Suggested {r.timingMetrics.suggestedTotalTempo}; actual captured {formatSeconds(r.timingMetrics.totalActualSeconds)}.<br/><strong>Improvement note:</strong> {r.timingMetrics.improvementNote}<br/><strong>Tempo reflection:</strong> {r.timingMetrics.tempoReflection}<br/><small>Founder Benchmarks placeholder: Suggested Tempo · Your Actual Tempo · Personal Best · Founder Cohort Average · Community Average later.</small></div> : null}
      <details><summary>Tasting note</summary><p>{r.tastingNote || "No tasting note captured."}</p></details>
      <details><summary>Advisor response</summary><pre>{r.advisorText}</pre></details>
      <div className="buttonRow"><button className="primary" onClick={() => printReport(r)}>Print Report</button></div>
    </article>)}
  </section>;
}





function buildLiveSessionReport({ profile, occasion, sensoryScores, guestResonance, transcript, advisorText, matrixMatch }) {
  const safeScores = sensoryScores || defaultSensoryScores;
  return {
    id: "live-session-preview",
    createdAt: new Date().toLocaleString(),
    title: occasion?.occasionName || "Live Advisor Session",
    drink: occasion?.drink || profile?.preferredDrinks || "Not selected",
    guest: occasion?.guest || "Not captured",
    transcript,
    advisorText,
    matrixMatch,
    selectedFlavorNotes: [],
    sensoryScores: safeScores,
    guestResonance: guestResonance || defaultGuestResonance,
    timingMetrics: { suggestedTotalTempo: occasion?.suggestedTempo || "Not selected", totalActualSeconds: 0, improvementNote: "Live preview. Save a Doma Report to start trend tracking.", tempoReflection: "The goal is calm, repeatable readiness — not speed." },
    fluency: { score: calculateLivePreviewScore(safeScores, guestResonance), selectedLevel: profile?.advisorGuidanceLevel || "Not selected", observedZone: profile?.advisorGuidanceLevel || "Not selected", advisorSupportCount: 0, recoverySupportCount: matrixMatch ? 1 : 0, correctionCount: 0, stepCompletionPercent: 0, feedback: "Live session preview. Create a Doma Report after the Occasion to lock the score, charts, support counts, and fluency feedback." },
    dialInReadiness: buildDialInReadiness(profile || {}),
    machineInfo: { machineType: profile?.machineType, machine: profile?.machine || profile?.espressoMachine || profile?.allInOneMachine, grinder: profile?.grinder || profile?.grinderModel, beans: profile?.beans, roastLevel: profile?.roastLevel, tamper: profile?.tamper, distributionTool: profile?.distributionTool, wdtTool: profile?.wdtTool, puckScreen: profile?.puckScreen },
    dosingInfo: { dose: profile?.houseDose, yield: profile?.houseYield, houseShotTime: profile?.houseShotTime, currentShotTime: occasion?.currentShotTime, targetRatio: profile?.targetRatio, grinderSetting: profile?.grinderSetting, confirmedRecipe: profile?.confirmedRecipe },
    confidenceMetrics: { machineConfidence: safeScores.machineConfidence, tasteClarity: safeScores.tasteClarity, stagecraft: safeScores.stagecraft, recoveryConfidence: safeScores.recoveryConfidence, guestResonance: guestResonance?.score || safeScores.guestResonance || 0, occasionTempo: 0 },
    trendSummary: "Live session preview. Save the report to compare against prior Occasions."
  };
}

function calculateLivePreviewScore(scores, guestResonance) {
  const vals = [scores?.machineConfidence, scores?.tasteClarity, scores?.stagecraft, scores?.recoveryConfidence, (guestResonance?.score || scores?.guestResonance || 0) * 2].map((x) => Number(x) || 0);
  return Math.round((vals.reduce((a,b)=>a+b,0) / Math.max(1, vals.length)) * 10);
}

function printableBarsHtml(report) {
  const rows = reportDashboardRows(report, null);
  return rows.map((row) => `<div class="printBarRow"><span>${row.label}</span><div class="printBarTrack"><div class="printBarFill" style="width:${Math.max(0, Math.min(10, row.current))*10}%"></div></div><strong>${row.current}/10</strong></div>`).join("");
}

function getReportMetric(report, key) {
  const score = report?.sensoryScores?.[key] ?? report?.confidenceMetrics?.[key];
  return Number.isFinite(Number(score)) ? Number(score) : 0;
}

function getReportSeconds(report) {
  return Number(report?.timingMetrics?.totalActualSeconds || report?.confidenceMetrics?.occasionTempo || 0);
}

function parseShotSeconds(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function reportDashboardRows(report, previous) {
  const rows = [
    ["Machine", "machineConfidence"],
    ["Taste", "tasteClarity"],
    ["Stagecraft", "stagecraft"],
    ["Resonance", "guestResonance"],
    ["Recovery", "recoveryConfidence"]
  ];
  return rows.map(([label, key]) => ({ label, current: getReportMetric(report, key), previous: previous ? getReportMetric(previous, key) : null }));
}

function DomaPerformanceDashboard({ report, previous, reports, compact = false }) {
  const rows = reportDashboardRows(report, previous);
  const trendReports = [...(reports || [])].slice(0, 8).reverse();
  return <div className={compact ? "performanceDashboard compact" : "performanceDashboard"}>
    <RadarChart scores={{ machineConfidence: getReportMetric(report,"machineConfidence"), tasteClarity: getReportMetric(report,"tasteClarity"), stagecraft: getReportMetric(report,"stagecraft"), guestResonance: getReportMetric(report,"guestResonance"), recoveryConfidence: getReportMetric(report,"recoveryConfidence") }} />
    <ReportBarChart rows={rows} />
    <ReportTrendPlot reports={trendReports} />
    <div className="noteBox"><strong>Machine + dose record</strong><br/>Machine: {report.machineInfo?.machine || report.context?.machine || "Not captured"}<br/>Grinder: {report.machineInfo?.grinder || report.context?.grinder || "Not captured"}<br/>Beans: {report.machineInfo?.beans || report.context?.beans || "Not captured"}<br/>Dose → Yield: {report.dosingInfo?.dose || report.context?.dose || "?"} → {report.dosingInfo?.yield || report.context?.yield || "?"}<br/>Observed shot time: {report.dosingInfo?.currentShotTime || report.context?.shotTime || "Not captured"}<br/>Actual Occasion tempo: {getReportSeconds(report) ? formatSeconds(getReportSeconds(report)) : "Not captured"}</div>
  </div>;
}

function ReportBarChart({ rows }) {
  return <div className="chartCard"><h3>Category Bar Chart</h3><p className="small">Current report scores with previous attempt comparison where available.</p><div className="barChart">{rows.map((row) => <div className="barRow compare" key={row.label}><span>{row.label}</span><div className="barTrack"><div className="barFill" style={{ width: `${Math.max(0, Math.min(10, row.current))*10}%` }} />{row.previous !== null ? <div className="barMarker" style={{ left: `${Math.max(0, Math.min(10, row.previous))*10}%` }} title={`Previous: ${row.previous}`} /> : null}</div><strong>{row.current}</strong></div>)}</div><p className="small">Thin marker = previous attempt when available.</p></div>;
}

function ReportTrendPlot({ reports }) {
  const w = 360, h = 210, pad = 36;
  const safeReports = reports?.length ? reports : [];
  const count = Math.max(1, safeReports.length - 1);
  const pts = safeReports.map((report, i) => {
    const taste = getReportMetric(report, "tasteClarity");
    const resonance = getReportMetric(report, "guestResonance");
    const confidence = getReportMetric(report, "machineConfidence");
    const composite = Math.max(0, Math.min(10, (taste + resonance + confidence) / 3));
    const x = pad + i * ((w - pad*2) / count);
    const y = h - pad - (composite / 10) * (h - pad*2);
    return { x, y, label: report.title || `Report ${i + 1}`, composite, shotSeconds: parseShotSeconds(report.dosingInfo?.currentShotTime || report.context?.shotTime) };
  });
  const shotPts = safeReports.map((report, i) => {
    const seconds = parseShotSeconds(report.dosingInfo?.currentShotTime || report.context?.shotTime);
    const normalized = seconds ? Math.max(0, Math.min(10, (seconds / 35) * 10)) : 0;
    const x = pad + i * ((w - pad*2) / count);
    const y = h - pad - (normalized / 10) * (h - pad*2);
    return { x, y, seconds };
  });
  return <div className="chartCard"><h3>Cup Profile Plot</h3><p className="small">A lightweight Decent-inspired trend view: performance composite plus observed shot-time movement.</p><svg viewBox={`0 0 ${w} ${h}`} className="lineSvg"><line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} className="chartAxis" /><line x1={pad} y1={pad} x2={pad} y2={h-pad} className="chartAxis" />{[2,4,6,8,10].map((g)=><line key={g} x1={pad} y1={h-pad-(g/10)*(h-pad*2)} x2={w-pad} y2={h-pad-(g/10)*(h-pad*2)} className="radarGrid" />)}<polyline points={pts.map((p)=>`${p.x},${p.y}`).join(" ")} className="linePath" />{shotPts.some((p)=>p.seconds) ? <polyline points={shotPts.map((p)=>`${p.x},${p.y}`).join(" ")} className="linePath secondaryLine" /> : null}{pts.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="5" className="lineDot" /><text x={p.x} y={h-8} textAnchor="middle" className="tinyLabel">{i+1}</text></g>)}</svg><p className="small"><span className="legendLine">Gold</span> = performance composite. <span className="legendLine secondary">Light line</span> = observed shot-time trend when available.</p></div>;
}


function TastingStudio({ selectedFlavorNotes, toggleFlavor, sensoryScores, updateSensoryScore, tastingNote, setTastingNote, guestResonance, setGuestResonance, setActive, createReport }) {
  const scoreEntries = Object.entries(sensoryScores);
  return <section className="tastingPage">
    <div className="card tastingHero"><p className="eyebrow">Tasting Table / Sensory Development</p><h1>Flavor Wheel + Real-Time Doma Report</h1><p>The artisan can identify what they are tasting, light up the flavor wheel, score sensory dimensions, and watch the report visuals update in real time.</p></div>
    <div className="tastingGrid">
      <section className="card"><h2>Interactive Flavor Wheel</h2><FlavorWheel selectedFlavorNotes={selectedFlavorNotes} /><p className="small">Selected notes light up on the wheel. This gives the artisan language for the cup, not just numbers.</p></section>
      <section className="card"><h2>What are you tasting?</h2>{flavorWheelGroups.map((group) => <div className="flavorGroup" key={group.group}><h3>{group.group}</h3><div className="flavorChips">{group.notes.map((note) => <button type="button" key={note} className={selectedFlavorNotes.includes(note) ? "chip selected" : "chip"} onClick={() => toggleFlavor(note)}>{note}</button>)}</div></div>)}<div className="noteBox"><strong>Selected:</strong> {selectedFlavorNotes.length ? selectedFlavorNotes.join(", ") : "Choose a few tasting notes."}</div></section>
    </div>
    <div className="tastingGrid">
      <section className="card"><h2>Sensory Scores</h2>{scoreEntries.map(([field, value]) => <div className="scoreRow" key={field}><label>{labelize(field)} <strong>{value}</strong></label><input type="range" min="0" max="10" value={value} onChange={(e) => updateSensoryScore(field, e.target.value)} /></div>)}<label className="label">Tasting note / cup reflection</label><textarea value={tastingNote} onChange={(e) => setTastingNote(e.target.value)} placeholder="Speak or type what you tasted: sweetness, body, citrus, cocoa, finish, delight…" /></section>
      <section className="card"><h2>Real-Time Report Visuals</h2><MiniReportCharts scores={sensoryScores} /><GuestResonanceForm guestResonance={guestResonance} setGuestResonance={setGuestResonance} /><div className="buttonRow"><button className="primary" onClick={createReport}>Create Doma Report with Tasting</button><button className="secondary" onClick={() => setActive("simulator")}>Back to Advisor Session</button><button className="secondary" onClick={() => setActive("reports")}>View Reports</button></div></section>
    </div>
  </section>;
}


function GuestResonanceForm({ guestResonance, setGuestResonance }) {
  function update(field, value) { setGuestResonance((prev) => ({ ...prev, [field]: value })); }
  return <section className="guestBox"><h3>Guest Resonance Check</h3><p className="small">The Occasion is not complete when the drink is made. It is complete when the drink is received.</p><div className="grid"><div><label className="label">Guest Resonance Score, 1–5</label><input type="range" min="1" max="5" value={guestResonance.score} onChange={(e) => update("score", Number(e.target.value))} /><strong>{guestResonance.score}</strong></div><div><label className="label">Guest reaction</label><select value={guestResonance.reaction} onChange={(e) => update("reaction", e.target.value)}>{["delighted","curious","neutral","confused","overwhelmed","comforted","surprised"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">First thing noticed</label><select value={guestResonance.firstThingNoticed} onChange={(e) => update("firstThingNoticed", e.target.value)}>{["aroma","sweetness","acidity","texture","temperature","visual presentation","story","finish"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">Guest Resonance status</label><select value={guestResonance.status || "Green — landed well"} onChange={(e) => update("status", e.target.value)}>{guestResonanceStatusOptions.map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">Would serve again</label><select value={guestResonance.wouldServeAgain} onChange={(e) => update("wouldServeAgain", e.target.value)}>{["yes","adjust","no"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">Next adjustment</label><select value={guestResonance.nextAdjustment} onChange={(e) => update("nextAdjustment", e.target.value)}>{["sweeter","brighter","colder","warmer","stronger","softer","more story","less explanation"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div></div><label className="label">Guest quote or observation</label><textarea value={guestResonance.quote} onChange={(e)=>update("quote", e.target.value)} placeholder="Capture what they said, noticed, or felt." /></section>;
}

function FlavorWheel({ selectedFlavorNotes }) {
  const notes = flatFlavorNotes();
  const cx = 180, cy = 180;
  const groupRadius = 72;
  const noteRadius = 132;
  return <svg viewBox="0 0 360 360" className="flavorWheelSvg" role="img" aria-label="Interactive flavor wheel">
    <circle cx={cx} cy={cy} r="168" className="wheelOuter" />
    <circle cx={cx} cy={cy} r="82" className="wheelCenter" />
    <text x={cx} y={cy - 8} textAnchor="middle" className="wheelTitle">Barista Doma</text>
    <text x={cx} y={cy + 14} textAnchor="middle" className="wheelSub">Flavor Wheel</text>
    {flavorWheelGroups.map((g, i) => {
      const angle = (i / flavorWheelGroups.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * groupRadius;
      const y = cy + Math.sin(angle) * groupRadius;
      const active = g.notes.some((n) => selectedFlavorNotes.includes(n));
      return <g key={g.group}><circle cx={x} cy={y} r="34" className={active ? "wheelGroup active" : "wheelGroup"} /><text x={x} y={y + 4} textAnchor="middle" className="wheelGroupText">{g.group.split(" /")[0]}</text></g>;
    })}
    {notes.map((item, i) => {
      const angle = (i / notes.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * noteRadius;
      const y = cy + Math.sin(angle) * noteRadius;
      const active = selectedFlavorNotes.includes(item.note);
      return <g key={item.note}><circle cx={x} cy={y} r={active ? 16 : 11} className={active ? "wheelNote active" : "wheelNote"} /><text x={x} y={y + 28} textAnchor="middle" className={active ? "wheelNoteText active" : "wheelNoteText"}>{item.note}</text></g>;
    })}
  </svg>;
}

function MiniReportCharts({ scores }) {
  return <div className="chartStack"><RadarChart scores={scores} /><BarChart scores={scores} /><LineChart scores={scores} /></div>;
}

function RadarChart({ scores }) {
  const entries = Object.entries(scores);
  const cx = 160, cy = 160, maxR = 110;
  const points = entries.map(([_, value], i) => {
    const angle = (i / entries.length) * Math.PI * 2 - Math.PI / 2;
    const r = (Number(value) / 10) * maxR;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });
  const grid = [2,4,6,8,10];
  return <div className="chartCard"><h3>Sensory Spider Chart</h3><svg viewBox="0 0 320 320" className="chartSvg">{grid.map((g) => <circle key={g} cx={cx} cy={cy} r={(g/10)*maxR} className="radarGrid" />)}{entries.map(([label], i) => { const angle = (i / entries.length) * Math.PI * 2 - Math.PI / 2; const x = cx + Math.cos(angle) * 132; const y = cy + Math.sin(angle) * 132; return <g key={label}><line x1={cx} y1={cy} x2={cx + Math.cos(angle)*maxR} y2={cy + Math.sin(angle)*maxR} className="radarAxis" /><text x={x} y={y} textAnchor="middle" className="chartLabel">{labelize(label)}</text></g>; })}<polygon points={points.map((p) => p.join(",")).join(" ")} className="radarShape" />{points.map(([x,y], i) => <circle key={i} cx={x} cy={y} r="5" className="radarDot" />)}</svg></div>;
}

function BarChart({ scores }) {
  const entries = Object.entries(scores);
  return <div className="chartCard"><h3>Sensory Bar Chart</h3><div className="barChart">{entries.map(([label, value]) => <div className="barRow" key={label}><span>{labelize(label)}</span><div className="barTrack"><div className="barFill" style={{ width: `${Number(value)*10}%` }} /></div><strong>{value}</strong></div>)}</div></div>;
}

function LineChart({ scores }) {
  const entries = Object.entries(scores);
  const w = 320, h = 190, pad = 34;
  const pts = entries.map(([_, value], i) => [pad + i * ((w - pad*2) / Math.max(1, entries.length - 1)), h - pad - (Number(value)/10)*(h-pad*2)]);
  return <div className="chartCard"><h3>Cup Profile Line</h3><svg viewBox={`0 0 ${w} ${h}`} className="lineSvg"><line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} className="chartAxis" /><line x1={pad} y1={pad} x2={pad} y2={h-pad} className="chartAxis" /><polyline points={pts.map((p) => p.join(",")).join(" ")} className="linePath" />{pts.map(([x,y], i) => <g key={entries[i][0]}><circle cx={x} cy={y} r="5" className="lineDot" /><text x={x} y={h-9} textAnchor="middle" className="tinyLabel">{labelize(entries[i][0]).slice(0,4)}</text></g>)}</svg></div>;
}

function labelize(value) { return String(value).replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase()); }



function normalizeMatrixText(value) {
  return String(value || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

const matrixNaturalTriggers = {
  "Shot choking / barely dripping": [
    "only a few drops", "few drops", "just a few drops", "just drips", "only drips", "barely dripping",
    "barely drips", "nothing came out", "nothing coming out", "no coffee came out", "no flow", "not flowing",
    "bottom of the cup", "pump is struggling", "machine is struggling", "puck too tight", "grind too tight",
    "too fine", "choked", "choking", "stalled", "blocked", "over pressure", "pressure but no flow"
  ],
  "No flow at all": [
    "no flow", "nothing comes through", "nothing came through", "nothing came out", "no coffee", "blocked",
    "pump runs but nothing", "pressure builds", "water not coming", "portafilter locked and nothing"
  ],
  "Shot runs too fast": [
    "ran fast", "runs fast", "too fast", "gushing", "gusher", "like water", "waterfall", "finished quickly",
    "quick shot", "pale crema", "thin stream", "low resistance", "opened too quickly"
  ],
  "Watery / thin body": [
    "watery", "thin", "weak", "flat", "no body", "disappears under milk", "little sweetness", "hollow"
  ],
  "Sour taste": ["sour", "sharp", "acidic", "tart", "green", "salty", "under extracted", "underextracted"],
  "Bitter / harsh taste": ["bitter", "harsh", "burnt", "ashy", "dry finish", "over extracted", "overextracted"],
  "Spraying / channeling": ["spraying", "spray", "channeling", "channel", "sideways", "spurting", "messy flow", "bottomless"],
  "Milk too foamy": ["milk too foamy", "too much foam", "big bubbles", "bubbly milk", "stiff foam", "dry foam"],
  "Milk will not foam": ["milk will not foam", "no foam", "milk flat", "wont foam", "won't foam"],
  "Machine not warmed up": ["not warmed", "cold machine", "machine cold", "not hot", "temperature unstable", "warm up"],
  "Guest is waiting / pressure rises": ["guest waiting", "guests waiting", "family waiting", "wife waiting", "husband waiting", "ten minutes", "in a hurry", "pressure", "nervous", "before church"]
};

function matrixMatchScore(item, rawQuery) {
  const q = normalizeMatrixText(rawQuery);
  if (!q) return 1;
  const haystack = normalizeMatrixText(`${item.category} ${item.issue} ${item.symptoms} ${item.likelyCause} ${item.advisor} ${item.oneNextMove} ${item.stagecraft} ${(item.solutionSteps || []).join(" ")}`);
  let score = 0;
  if (haystack.includes(q)) score += 30;
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  score += words.filter((w) => haystack.includes(w)).length;
  const triggers = matrixNaturalTriggers[item.issue] || [];
  for (const phrase of triggers) {
    const normalizedPhrase = normalizeMatrixText(phrase);
    if (q.includes(normalizedPhrase) || normalizedPhrase.includes(q)) score += 50;
  }
  // Hard guardrail: common natural-language no-flow phrases must favor choking/no-flow before fast-shot entries.
  if (/few drops|only drips|just drips|barely dripp|nothing came|nothing coming|no coffee|no flow|bottom of the cup|puck too tight|grind too tight|pressure but no flow|chok|stall/.test(q)) {
    if (item.issue === "Shot choking / barely dripping") score += 200;
    if (item.issue === "No flow at all") score += 150;
    if (item.issue === "Shot runs too fast") score -= 100;
  }
  // Opposite guardrail: fast/gushing language should favor low resistance, not choking, unless no-flow language is present.
  if (/ran fast|runs fast|too fast|gushing|gusher|like water|finished quickly|quick shot|opened too quickly/.test(q) && !/few drops|barely|nothing|no flow|chok|stall/.test(q)) {
    if (item.issue === "Shot runs too fast") score += 200;
    if (item.issue === "Shot choking / barely dripping") score -= 100;
  }
  return score;
}

function matrixConfidence(score) {
  if (score >= 150) return "high";
  if (score >= 50) return "medium";
  if (score > 0) return "low";
  return "none";
}

function Matrix({ setActive, setTranscript, updateOccasion, recordTelemetry }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [readBusy, setReadBusy] = useState(false);
  const [readAudioUrl, setReadAudioUrl] = useState("");
  const categories = ["All", ...Array.from(new Set(recoveryMatrixCatalog.map((item) => item.category)))];
  const scoredMatches = recoveryMatrixCatalog
    .map((item) => ({ item, score: matrixMatchScore(item, query) }))
    .filter(({ item, score }) => {
      const matchesCategory = category === "All" || item.category === category;
      return matchesCategory && (!query.trim() || score > 0);
    })
    .sort((a, b) => b.score - a.score || a.item.issue.localeCompare(b.item.issue));
  const filtered = scoredMatches.map(({ item }) => item);
  const topMatches = scoredMatches.slice(0, 6);
  const bestMatch = scoredMatches[0];
  function useIssue(item) {
    setTranscript(`I selected this What Went Wrong Matrix issue: ${item.issue}. Likely cause: ${item.likelyCause}. Advisor note: ${item.advisor}. Please blend this selected issue with my form and any voice note, then guide me with one next move while preserving the occasion.`);
    updateOccasion("recurrence", item.issue);
    updateOccasion("momentIntent", item.stagecraft);
    if (recordTelemetry) recordTelemetry("recovery_issue_used", { issue: item.issue, category: item.category, likelyCause: item.likelyCause, oneNextMove: item.oneNextMove });
    setSelectedIssue(null);
    setActive("simulator");
  }
  function useTypedIssue() {
    const typed = query.trim();
    if (!typed) return;
    setTranscript(`The artisan typed this What Went Wrong description: ${typed}. Please search the Recovery Matrix, identify the closest issue, and blend this with the form and any voice note before advising.`);
    updateOccasion("recurrence", `Typed issue: ${typed}`);
    updateOccasion("momentIntent", "Typed What Went Wrong note should be synthesized with the Occasion context.");
    if (recordTelemetry) recordTelemetry("recovery_typed_issue_used", { description: typed, bestMatch: bestMatch?.item?.issue || "none" });
    setActive("simulator");
  }
  async function readText(text) {
    setReadBusy(true); setReadAudioUrl("");
    try {
      const started = speakFastLocal(text, { rate: 1.02 });
      if (!started) throw new Error("This browser did not expose local speech synthesis.");
      setReadAudioUrl("__local_voice__");
    } catch (err) { alert(err.message || String(err)); }
    finally { setReadBusy(false); }
  }
  function recoveryText(item) {
    return `${item.issue}. Likely cause: ${item.likelyCause}. Advisor: ${item.advisor}. One next move: ${item.oneNextMove}. Occasion note: ${item.stagecraft}`;
  }
  function fixText(item) { return `${item.issue}. Solution steps. ${item.solutionSteps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`; }
  return <section className="recoveryPage">
    <div className="recoveryHero card">
      <p className="eyebrow">Recovery Library</p>
      <div className="matrixHeader"><div><h1>When the machine speaks, the Advisor helps interpret.</h1><p>This is the searchable What Went Wrong Matrix: a practical recovery knowledge base for real coffee occasions. Search an issue, open the Moment Recovery Engine, read guidance aloud, or send the issue back into the current Advisor Session.</p></div><button className="primary" onClick={() => setActive("walkthrough")}>Return to Selected Occasion</button></div>
    </div>
    <section className="card recoveryControls v8Search"><label className="label">Type or describe what went wrong</label><textarea className="matrixSearchBox" value={query} onChange={(e) => setQuery(e.target.value)} onInput={(e) => setQuery(e.currentTarget.value)} placeholder="Type naturally: only a few drops came out, sour cup, milk too foamy, shot ran fast, no crema…" rows={3} />
      <label className="label">Browse by category</label><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
      <div className="quickMatches"><strong>Quick matches</strong>{topMatches.length ? topMatches.map(({ item, score }) => <button type="button" key={item.issue} className="chip" onClick={() => setSelectedIssue(item)}>{item.issue} <span className="small">({matrixConfidence(score)})</span></button>) : <span className="small">No Matrix match yet. You can still send the typed description to the Advisor.</span>}</div>
      {bestMatch ? <div className="successBox"><strong>Best match:</strong> {bestMatch.item.issue}<br/><strong>Confidence:</strong> {matrixConfidence(bestMatch.score)}<br/><strong>One next move:</strong> {bestMatch.item.oneNextMove}</div> : null}
      <div className="buttonRow"><button className="secondary green" disabled={!bestMatch} onClick={() => bestMatch && useIssue(bestMatch.item)}>Use best match in Advisor Session</button><button className="secondary" disabled={!query.trim()} onClick={useTypedIssue}>Use typed description</button><button className="secondary" onClick={() => setQuery("")}>Clear Search</button></div>
      <p className="small"><strong>{filtered.length}</strong> issues shown. Natural-language matching is active; the browse list remains below for discovery.</p></section>
    <div className="recoveryGrid">{filtered.map((item) => <article className="recoveryCard" key={`${item.category}-${item.issue}`}><h3>{item.issue}</h3><p><strong>Likely cause:</strong> {item.likelyCause}</p><p><strong>Advisor:</strong> {item.advisor}</p><div className="recoveryActions"><button className="primary" onClick={() => setSelectedIssue(item)}>Solution / Fix Steps</button></div></article>)}</div>
    {readAudioUrl === "__local_voice__" ? <section className="card"><h3>Fast Recovery Read-Aloud</h3><p className="small">Speaking through the browser now.</p></section> : (readAudioUrl ? <section className="card"><h3>Advisor Read-Aloud Playback</h3><audio controls autoPlay src={readAudioUrl} /></section> : null)}
    {selectedIssue ? <div className="modalBackdrop" role="dialog" aria-modal="true"><div className="recoveryModal"><button className="modalClose" onClick={() => setSelectedIssue(null)}>Close</button><p className="eyebrow">Moment Recovery Engine</p><h2>{selectedIssue.issue}</h2><p><strong>Likely cause:</strong> {selectedIssue.likelyCause}</p><p><strong>Advisor:</strong> {selectedIssue.advisor}</p><p><strong>One next move:</strong> {selectedIssue.oneNextMove}</p><hr /><h2>Solution steps to follow</h2><ol>{selectedIssue.solutionSteps.map((step, idx) => <li key={idx}>{step}</li>)}</ol><div className="buttonRow"><button className="primary" onClick={() => readText(fixText(selectedIssue))} disabled={readBusy}>{readBusy ? "Reading…" : "Read solution"}</button><button className="secondary" onClick={() => readText(recoveryText(selectedIssue))} disabled={readBusy}>Read quick recovery</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Use in Advisor Session</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Log this in Doma Report</button></div>{readAudioUrl === "__local_voice__" ? <div className="successBox">Fast read-aloud is speaking now.</div> : (readAudioUrl ? <audio controls autoPlay src={readAudioUrl} /> : null)}</div></div> : null}
  </section>;
}


function SynthesisPanel({ synthesis }) {
  return <div className="synthesisBox"><h3>Advisor Understanding</h3><p><strong>Form complete:</strong> {String(synthesis.formComplete)}</p>{synthesis.missingFields?.length ? <p><strong>Missing fields:</strong> {synthesis.missingFields.join(", ")}</p> : null}<p><strong>Detected artisan intent:</strong> {synthesis.detectedArtisanIntent}</p><p><strong>Voice quality:</strong> {synthesis.voiceQuality}</p><p><strong>Primary live signal:</strong> {synthesis.primaryLiveSignal}</p><p><strong>Supporting context used:</strong> {synthesis.supportingContextUsed || "None"}</p><p><strong>Matrix applied:</strong> {String(synthesis.matrixApplied)}</p>{synthesis.primaryMatrixSignal ? <p><strong>Primary matrix signal:</strong> {synthesis.primaryMatrixSignal.label}</p> : null}{synthesis.secondaryMatrixSignal ? <p><strong>Secondary matrix signal:</strong> {synthesis.secondaryMatrixSignal.label}</p> : null}</div>;
}
function Field({ label, value, onChange }) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <div><label className="label" htmlFor={id}>{label}</label><input id={id} value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
