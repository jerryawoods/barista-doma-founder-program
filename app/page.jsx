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
  milkStyle: "Creamy microfoam for warmth and comfort",
  dialInNotes: "Keep dose and yield steady before changing grind."
};

const machineTypeOptions = ["Espresso machine", "Espresso machine with built-in grinder", "All-in-one / automatic", "Superautomatic", "Filter / brewer", "Other"];
const espressoMachineOptions = ["Breville Barista Express", "Breville Barista Pro", "Breville Dual Boiler", "Meraki Gen 2", "Gaggia Classic Pro", "Rancilio Silvia", "Lelit Bianca", "Profitec Pro", "ECM", "Rocket", "La Marzocco Linea Mini", "Decent DE1", "Ascaso Steel", "Other espresso machine"];
const grinderOptions = ["Built-in grinder", "Baratza", "DF64 / DF83", "Niche Zero / Duo", "Eureka Mignon", "Fellow Opus / Ode", "Timemore", "Mazzer", "Weber", "Mahlkönig", "Other grinder"];
const allInOneOptions = ["Ninja Luxe Café / Ninja espresso system", "Jura", "DeLonghi", "Philips / Saeco", "Terra Kaffe", "Breville Oracle", "Breville Barista Touch", "Meraki all-in-one", "xBloom", "Other all-in-one"];
const roastLevelOptions = ["Light", "Medium-light", "Medium", "Medium-dark", "Dark", "Decaf", "Unknown"];
const experienceOptions = ["First-time / learning", "Developing confidence", "Comfortable but inconsistent", "Serious home barista", "Advanced enthusiast"];

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
    "family": "Next-Gen Sensory Occasions",
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
    "family": "Next-Gen Sensory Occasions",
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
    "family": "Next-Gen Sensory Occasions",
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
    "family": "Next-Gen Sensory Occasions",
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
    "family": "Next-Gen Sensory Occasions",
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
    "family": "Next-Gen Sensory Occasions",
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
  const [active, setActive] = useState("occasions");
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
  const [selectedFlavorNotes, setSelectedFlavorNotes] = useState(["caramel", "cocoa", "citrus"]);
  const [sensoryScores, setSensoryScores] = useState(defaultSensoryScores);
  const [tastingNote, setTastingNote] = useState("Creamy cappuccino impression with sweetness, body, and a touch of citrus brightness.");
  const [guestResonance, setGuestResonance] = useState(defaultGuestResonance);
  const [uploadAsset, setUploadAsset] = useState({ fileName: "", fileType: "", kind: "", notes: "", previewUrl: "" });
  const [stepTimings, setStepTimings] = useState({});
  const [occasionStartTime, setOccasionStartTime] = useState(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const advisorAudioRef = useRef(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("bd_profile_v7");
      const savedOccasion = localStorage.getItem("bd_occasion_v7");
      const savedReports = localStorage.getItem("bd_reports_v7");
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
      if (savedFlavors) setSelectedFlavorNotes(JSON.parse(savedFlavors));
      if (savedScores) setSensoryScores(JSON.parse(savedScores));
      if (savedTastingNote) setTastingNote(savedTastingNote);
      if (savedGuestResonance) setGuestResonance(JSON.parse(savedGuestResonance));
    } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem("bd_profile_v7", JSON.stringify(profile)); } catch {} }, [profile]);
  useEffect(() => { try { localStorage.setItem("bd_occasion_v7", JSON.stringify(occasion)); } catch {} }, [occasion]);
  useEffect(() => { try { localStorage.setItem("bd_reports_v7", JSON.stringify(reports)); } catch {} }, [reports]);
  useEffect(() => { try { localStorage.setItem("bd_selected_occasion_v83", selectedOccasionId); } catch {} }, [selectedOccasionId]);
  useEffect(() => { try { localStorage.setItem("bd_walkthrough_occasion_v83", walkthroughOccasionId); } catch {} }, [walkthroughOccasionId]);
  useEffect(() => { try { localStorage.setItem("bd_flavors_v77", JSON.stringify(selectedFlavorNotes)); } catch {} }, [selectedFlavorNotes]);
  useEffect(() => { try { localStorage.setItem("bd_scores_v77", JSON.stringify(sensoryScores)); } catch {} }, [sensoryScores]);
  useEffect(() => { try { localStorage.setItem("bd_tasting_note_v77", tastingNote); } catch {} }, [tastingNote]);

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
    dialInNotes: profile.dialInNotes,
    momentIntent: occasion.momentIntent,
    uploadedAsset: uploadAsset?.fileName ? { fileName: uploadAsset.fileName, fileType: uploadAsset.fileType, kind: uploadAsset.kind, notes: uploadAsset.notes } : null
  }), [profile, occasion, uploadAsset]);

  const selectedFounderOccasion = useMemo(() => founderOccasions.find((item) => item.id === selectedOccasionId) || founderOccasions[0], [selectedOccasionId]);
  const walkthroughFounderOccasion = useMemo(() => founderOccasions.find((item) => item.id === walkthroughOccasionId) || selectedFounderOccasion || founderOccasions[0], [walkthroughOccasionId, selectedFounderOccasion]);
  const setupMissing = useMemo(() => getSetupMissing(profile, occasion), [profile, occasion]);
  const setupComplete = setupMissing.length === 0;

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }
  function updateProfile(field, value) { setProfile((prev) => ({ ...prev, [field]: value })); }
  function updateOccasion(field, value) { setOccasion((prev) => ({ ...prev, [field]: value })); }
  function handleAdvisorUpload(file, kind = "photo/video") {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setUploadAsset((prev) => ({ ...prev, fileName: file.name, fileType: file.type || "unknown", kind, previewUrl }));
    setStatus("Advisor upload attached. Add notes or ask the Advisor to analyze it with the form and voice context.");
    log(`Attached Advisor upload: ${file.name} (${file.type || "unknown"})`);
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
        setTranscript(appendMode ? `${existingTranscript.trim()}

Correction / added detail: ${newText}`.trim() : newText);
        setCorrectionMode(false);
        setStatus(appendMode ? "Correction captured. Re-generate Advisor response." : "Transcription complete. Generate Advisor response next."); log(`Transcription returned ${String(newText).length} characters${appendMode ? " as correction/additional detail" : ""}.`);
      };
      recorder.start();
    } catch (err) { setRecording(false); setStatus(`Error: ${err.message}`); setError(err.message); log(`Recording failed: ${err.message}`); }
  }
  function stopRecording() {
    try { if (recorderRef.current && recorderRef.current.state !== "inactive") { recorderRef.current.stop(); setStatus("Stopping…"); log("Stop requested."); } }
    catch (err) { setError(err.message); log(`Stop failed: ${err.message}`); }
  }

  function stopAdvisorVoice() {
    try {
      if (advisorAudioRef.current) {
        advisorAudioRef.current.pause();
        advisorAudioRef.current.currentTime = 0;
      }
      setStatus("Advisor stopped. You can correct or add detail.");
      log("Advisor Voice playback stopped by artisan.");
    } catch (err) { log(`Stop Advisor failed: ${err.message}`); }
  }

  function beginCorrection() {
    stopAdvisorVoice();
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
    setError(""); setRespondBusy(true); setAdvisorAudioUrl(""); setStatus("Assessing Matrix + generating Advisor response…"); log("Sending form + voice to /api/respond.");
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
    const timingMetrics = buildTimingMetrics(selectedFounderOccasion, stepTimings, occasionStartTime);
    const priorReport = reports[0] || null;
    const report = {
      id: Date.now(), createdAt: new Date().toLocaleString(), title: occasion.occasionName || "Home Coffee Occasion",
      drink: occasion.drink, guest: occasion.guest, transcript, advisorText,
      synthesis, matrixMatch, context, selectedFlavorNotes, sensoryScores, tastingNote, guestResonance, stepTimings, timingMetrics, uploadAsset: uploadAsset?.fileName ? { ...uploadAsset, previewUrl: "" } : null,
      profileSnapshot: { ...profile },
      occasionSnapshot: { ...occasion },
      machineInfo: { machineType: profile.machineType, machine: profile.machine, espressoMachine: profile.espressoMachine, allInOneMachine: profile.allInOneMachine, grinder: profile.grinder, grinderModel: profile.grinderModel, beans: profile.beans, roastLevel: profile.roastLevel, basketSize: profile.basketSize, portafilterSize: profile.portafilterSize, waterSource: profile.waterSource, warmupRoutine: profile.warmupRoutine, experienceLevel: profile.experienceLevel, milkStyle: profile.milkStyle },
      dosingInfo: { dose: profile.houseDose, yield: profile.houseYield, houseShotTime: profile.houseShotTime, targetRatio: profile.targetRatio, grinderSetting: profile.grinderSetting, dialInNotes: profile.dialInNotes, currentShotTime: occasion.currentShotTime, drink: occasion.drink },
      confidenceMetrics: { machineConfidence: sensoryScores.machineConfidence, tasteClarity: sensoryScores.tasteClarity, stagecraft: sensoryScores.stagecraft, recoveryConfidence: sensoryScores.recoveryConfidence, guestResonance: guestResonance.score, occasionTempo: timingMetrics.totalActualSeconds },
      trendSummary: reportTrendSummary(priorReport, sensoryScores, guestResonance)
    };
    setReports((prev) => [report, ...prev]); setStatus("Doma Report created."); log("Created Doma Report from current Occasion."); setActive("reports");
  }
  function clearReports() { setReports([]); log("Cleared local reports."); }
  function printReport(report) {
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><title>Doma Report</title><style>body{font-family:Arial,sans-serif;padding:28px;line-height:1.45;color:#1c140f} h1{color:#3a2318} .box{border:1px solid #ddd;border-radius:12px;padding:14px;margin:12px 0} pre{white-space:pre-wrap;background:#f7f3ee;padding:12px;border-radius:10px}</style></head><body><h1>Doma Report — ${report.title}</h1><p>${report.createdAt}</p><div class=box><h2>Machine + Formula</h2><p><strong>Machine:</strong> ${report.machineInfo?.machine || ""}<br/><strong>Grinder:</strong> ${report.machineInfo?.grinder || ""}<br/><strong>Beans:</strong> ${report.machineInfo?.beans || ""}<br/><strong>Dose → Yield:</strong> ${report.dosingInfo?.dose || ""} → ${report.dosingInfo?.yield || ""}<br/><strong>House shot time:</strong> ${report.dosingInfo?.houseShotTime || ""}<br/><strong>Current shot time:</strong> ${report.dosingInfo?.currentShotTime || ""}</p></div><div class=box><h2>Occasion</h2><p><strong>Drink:</strong> ${report.drink}<br/><strong>Served to:</strong> ${report.guest}<br/><strong>Matrix:</strong> ${report.matrixMatch?.label || "None"}</p><p><strong>Trend:</strong> ${report.trendSummary || ""}</p></div><div class=box><h2>Confidence Metrics</h2><p>Machine Confidence: ${report.confidenceMetrics?.machineConfidence ?? ""}<br/>Taste Clarity: ${report.confidenceMetrics?.tasteClarity ?? ""}<br/>Stagecraft: ${report.confidenceMetrics?.stagecraft ?? ""}<br/>Recovery Confidence: ${report.confidenceMetrics?.recoveryConfidence ?? ""}<br/>Guest Resonance: ${report.confidenceMetrics?.guestResonance ?? ""}/5</p></div><div class=box><h2>Flavor + Sensory</h2><p>${(report.selectedFlavorNotes || []).join(", ")}</p><p>${report.tastingNote || ""}</p></div><div class=box><h2>Artisan Transcript</h2><pre>${report.transcript || ""}</pre></div><div class=box><h2>Advisor Response</h2><pre>${report.advisorText || ""}</pre></div><script>window.print()</script></body></html>`;
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
        <div className="brandMark"><span>BD</span><div><strong>Barista Doma</strong><small>Founder Program v8.7</small></div></div>
        {["dashboard", "onboarding", "occasions", "walkthrough", "simulator", "tasting", "matrix", "reports"].map((tab) => (
          <button key={tab} className={active === tab ? "sideLink active" : "sideLink"} onClick={() => setActive(tab)} type="button">{tabIcon(tab)} {tabLabel(tab)}</button>
        ))}
        <div className="pathwayBox"><strong>Founder Pathway</strong><p>Cup 0 of 21 completed · 0%</p><div className="pathTrack"><span style={{ width: `${Math.min(100, reports.length * 7)}%` }} /></div><small>Every Occasion can become a Doma Report.</small></div>
      </aside>
      <div className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Founder Program Prototype v8.7</p>
        <h1>Home Barista Occasion Simulator — Machine Passport + Upload Analysis</h1>
        <p>This starts with 21 selectable Occasions: 15 Core Occasions plus 6 Next-Gen Sensory Occasions. The machine makes the beverage; the home barista prepares the moment. The Occasion is complete when the drink is received.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
        <div className="navBar">
          {["dashboard", "onboarding", "occasions", "walkthrough", "simulator", "tasting", "reports", "matrix"].map((tab) => (
            <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)} type="button">{tabLabel(tab)}</button>
          ))}
        </div>
      </section>

      {active === "dashboard" && <Dashboard checkServer={checkServer} loadClearFastShot={loadClearFastShot} setActive={setActive} profile={profile} occasion={occasion} reports={reports} health={health} setupMissing={setupMissing} requireSetupThen={requireSetupThen} />}
      {active === "onboarding" && <Onboarding profile={profile} updateProfile={updateProfile} setActive={setActive} />}
      {active === "occasion" && <OccasionSetup occasion={occasion} updateOccasion={updateOccasion} setActive={setActive} loadClearFastShot={loadClearFastShot} setupMissing={setupMissing} requireSetupThen={requireSetupThen} />}
      {active === "occasions" && <OccasionsLibrary founderOccasions={founderOccasions} openFounderOccasion={openFounderOccasion} selectedOccasionId={selectedOccasionId} setSelectedOccasionId={setSelectedOccasionId} />}
      {active === "walkthrough" && <OccasionWalkthrough occasionItem={walkthroughFounderOccasion} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} setActive={setActive} setTranscript={setTranscript} createReport={createReport} stepTimings={stepTimings} setStepTimings={setStepTimings} occasionStartTime={occasionStartTime} />}
      {active === "simulator" && <Simulator {...{ recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, advisorAudioRef, stopAdvisorVoice, beginCorrection, correctionMode, createReport, uploadAsset, setUploadAsset, handleAdvisorUpload }} />}
      {active === "tasting" && <TastingStudio selectedFlavorNotes={selectedFlavorNotes} toggleFlavor={toggleFlavor} sensoryScores={sensoryScores} updateSensoryScore={updateSensoryScore} tastingNote={tastingNote} setTastingNote={setTastingNote} guestResonance={guestResonance} setGuestResonance={setGuestResonance} setActive={setActive} createReport={createReport} />}
      {active === "reports" && <Reports reports={reports} clearReports={clearReports} setActive={setActive} printReport={printReport} exportReportsCSV={exportReportsCSV} />}
      {active === "matrix" && <Matrix setActive={setActive} setTranscript={setTranscript} updateOccasion={updateOccasion} />}

      <section className="card principleCard">
        <h2>Product Principle</h2>
        <p><strong>The form grounds.</strong> The Doma Profile, Machine Passport, House Formula, and Occasion setup prevent generic answers.</p>
        <p><strong>The artisan voice clarifies.</strong> The live comment adds nuance, emotion, uncertainty, and situational detail.</p><p><strong>The artisan can interrupt.</strong> If the Advisor misreads the cup, stop it, add a correction, and re-assess the moment.</p>
        <p><strong>The Advisor synthesizes.</strong> The Recovery Matrix grounds the diagnosis; the Premium Advisor preserves the occasion and speaks back with care, confidence, and delight.</p>
      </section>

      <section className="card"><h2>Diagnostic Log</h2><div className="log">{logs.join("\n")}</div></section>
      </div>
    </main>
  );
}

function tabLabel(tab) { return ({ dashboard: "Home", onboarding: "Onboarding", occasions: "21 Occasions", walkthrough: "Stagecraft Walkthrough", occasion: "Occasion Setup", simulator: "Advisor Session", tasting: "Tasting Studio", reports: "Doma Reports", matrix: "Recovery Library" })[tab]; }
function tabIcon(tab) { return ({ dashboard: "🏠", onboarding: "☕", occasions: "🎭", walkthrough: "📜", occasion: "🎭", simulator: "🎙️", tasting: "🍯", reports: "📊", matrix: "🛠️" })[tab]; }

function Dashboard({ checkServer, loadClearFastShot, setActive, profile, occasion, reports, health, setupMissing, requireSetupThen }) {
  const setupComplete = !setupMissing?.length;
  return <section className="card"><h2>Founder Dashboard</h2><p className="small">A single front door for the Founder Program experience.</p><div className="tiles"><Tile title="Server" value={health?.hasOpenAIKey ? "Connected" : "Check needed"} /><Tile title="Machine" value={profile.machine || "Not set"} /><Tile title="House Formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} /><Tile title="Current Occasion" value={occasion.occasionName || "Not set"} /><Tile title="Saved Reports" value={String(reports.length)} /></div>{setupComplete ? <div className="successBox"><strong>Setup Gate:</strong> Ready. Doma Profile, Machine Passport, House Formula, and Occasion setup are present.</div> : <div className="errorBox"><strong>Setup Gate:</strong> Complete these before starting a live session: {setupMissing.join(", ")}</div>}<div className="buttonRow"><button className="primary" onClick={checkServer}>Check Server / API Key</button><button className="secondary" onClick={() => setActive("onboarding")}>Open Doma Profile</button><button className="secondary" onClick={() => setActive("occasions")}>Open 21 Occasions</button><button className="primary" onClick={loadClearFastShot}>Load Sample Advisor Flow</button><button className="secondary" onClick={() => requireSetupThen("simulator")}>Go to Simulator</button></div></section>;
}
function Tile({ title, value }) { return <div className="tile"><p>{title}</p><strong>{value}</strong></div>; }

function Onboarding({ profile, updateProfile, setActive }) {
  return <section className="card">
    <p className="eyebrow">Onboarding split into layers</p>
    <h2>Doma Profile + Machine Passport + Dial-In Profile</h2>
    <p className="small">Initial onboarding stays simple, while Machine Passport and Dial-In Profile capture the structured context the Advisor needs for better guidance.</p>
    <div className="setupStack">
      <div className="noteBox"><strong>1. Doma Profile</strong><br/>Who is the artisan, what are they trying to serve, and what confidence level are they bringing to the machine?</div>
      <div className="grid">
        <Field label="Founder / artisan name" value={profile.founderName} onChange={(v) => updateProfile("founderName", v)} />
        <Field label="Role identity" value={profile.roleIdentity} onChange={(v) => updateProfile("roleIdentity", v)} />
        <SelectField label="Experience level" value={profile.experienceLevel} onChange={(v) => updateProfile("experienceLevel", v)} options={experienceOptions} />
        <Field label="Preferred drinks" value={profile.preferredDrinks} onChange={(v) => updateProfile("preferredDrinks", v)} />
      </div>
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
      <div className="noteBox"><strong>3. Dial-In Profile / House Formula</strong><br/>This is separate from onboarding. It captures how the machine is currently dialed in so the Advisor can interpret choking, fast shots, sourness, milk issues, and repeatability.</div>
      <div className="grid">
        <Field label="Beans" value={profile.beans} onChange={(v) => updateProfile("beans", v)} />
        <SelectField label="Roast level" value={profile.roastLevel} onChange={(v) => updateProfile("roastLevel", v)} options={roastLevelOptions} />
        <Field label="House dose" value={profile.houseDose} onChange={(v) => updateProfile("houseDose", v)} />
        <Field label="House yield" value={profile.houseYield} onChange={(v) => updateProfile("houseYield", v)} />
        <Field label="House shot time" value={profile.houseShotTime} onChange={(v) => updateProfile("houseShotTime", v)} />
        <Field label="Target ratio" value={profile.targetRatio} onChange={(v) => updateProfile("targetRatio", v)} />
        <Field label="Current grinder setting" value={profile.grinderSetting} onChange={(v) => updateProfile("grinderSetting", v)} />
        <Field label="Milk style / service preference" value={profile.milkStyle} onChange={(v) => updateProfile("milkStyle", v)} />
      </div>
      <label className="label">Dial-in notes</label>
      <textarea value={profile.dialInNotes} onChange={(e) => updateProfile("dialInNotes", e.target.value)} placeholder="Current behavior, last adjustment, what worked, what keeps recurring…" />
    </div>
    <div className="buttonRow"><button className="primary" onClick={() => setActive("occasions")}>Continue to 21 Occasions</button><button className="secondary" onClick={() => setActive("simulator")}>Go to Advisor Session</button></div>
  </section>;
}

function SelectField({ label, value, onChange, options }) {
  return <div><label className="label">{label}</label><select value={value || ""} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option || "blank"} value={option}>{option || "Select…"}</option>)}</select></div>;
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
  const families = ["All", "Core Occasions", "Next-Gen Sensory Occasions"];
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
      <h2>Twenty-one stagecraft Occasions: 15 Core Occasions plus 6 Next-Gen Sensory Occasions.</h2>
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

function OccasionWalkthrough({ occasionItem, currentStepIndex, setCurrentStepIndex, setActive, setTranscript, createReport, stepTimings, setStepTimings, occasionStartTime }) {
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
      const response = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: buildStepReadText(current), voice: "sage" }) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data?.error || data?.detail || `Step read-aloud failed with HTTP ${response.status}`); }
      const blob = await response.blob();
      setStepAudioUrl(URL.createObjectURL(blob));
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
      const response = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `Full Barista Doma stagecraft script for ${occasionItem.name}.\n\n${scriptText}`, voice: "sage" }) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data?.error || data?.detail || `Script read-aloud failed with HTTP ${response.status}`); }
      const blob = await response.blob();
      setStepAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      setStepReadBusy(false);
    }
  }

  function stopStepReading() {
    if (stepAudioRef.current) {
      stepAudioRef.current.pause();
      stepAudioRef.current.currentTime = 0;
    }
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
      <div className="tempoBox"><strong>Tempo Guide:</strong> {timerVisible ? "On" : "Hidden"}<div className="buttonRow"><button className="secondary" onClick={() => setTimerVisible((v) => !v)}>{timerVisible ? "Hide Timer" : "Show Timer"}</button><button className="primary" onClick={startStep}>Start Step</button><button className="primary" onClick={completeStep}>{safeIndex >= steps.length - 1 ? "Complete Occasion" : "Complete Step + Next"}</button></div>{timerVisible ? <div className="timerFace">{formatSeconds(elapsed)}</div> : <p className="small">Timer hidden. Your step time is still being captured for your Doma Report.</p>}{stepTimings[safeIndex]?.actualSeconds ? <p className="small">Captured actual: {formatSeconds(stepTimings[safeIndex].actualSeconds)}</p> : null}</div>
      <div className="buttonRow"><button className="secondary" onClick={readCurrentStep} disabled={stepReadBusy}>{stepReadBusy ? "Preparing audio…" : "Read Current Step"}</button><button className="secondary" onClick={stopStepReading}>Stop Reading</button><button className="secondary" disabled={safeIndex === 0} onClick={() => goToStep(safeIndex - 1)}>Previous Step</button><button className="secondary" disabled={safeIndex >= steps.length - 1} onClick={() => goToStep(safeIndex + 1)}>Next Step</button><button className="secondary" onClick={() => { setTranscript(current?.script || occasionItem.artisanOpening || ""); setActive("simulator"); }}>Send this step to Advisor</button><button className="secondary" onClick={() => setActive("matrix")}>What Went Wrong?</button></div>{stepAudioUrl ? <div className="noteBox"><strong>Step Read-Aloud Playback</strong><audio ref={stepAudioRef} controls autoPlay src={stepAudioUrl} /></div> : null}{safeIndex >= steps.length - 1 ? <div className="successBox"><strong>Final step:</strong> Completing this step opens the Tasting Studio so you can capture flavor, Guest Resonance, and Doma Report detail.</div> : <p className="small">Complete Step will save this step time and automatically move you to Step {safeIndex + 2}.</p>}
    </section>
    <section className="card"><h2>Occasion Tempo Snapshot</h2><p><strong>Suggested total tempo:</strong> {occasionItem.suggestedTempo || occasionItem.time}</p><p><strong>Total actual time captured:</strong> {formatSeconds(timingMetrics.totalActualSeconds)}</p><p><strong>Personal best:</strong> Founder Benchmarks placeholder. Future anonymous cohort averages will compare Suggested Tempo, Your Actual Tempo, Personal Best, Founder Cohort Average, and Community Average later.</p><p className="small">Founder Benchmarks are not speed-only leaderboards. Future opt-in leaderboards should reward tempo quality, improvement, stagecraft, Guest Resonance, and calm readiness.</p></section>
    <section className="card"><h2>Full Occasion Stagecraft Script</h2><p className="small">The machine performs the extraction. The artisan performs the Occasion.</p><pre className="scriptFull">{scriptText}</pre><div className="buttonRow"><button className="secondary" onClick={readFullOccasionScript} disabled={stepReadBusy}>{stepReadBusy ? "Preparing audio…" : "Read Full Occasion Script"}</button><button className="secondary" onClick={stopStepReading}>Stop Reading</button><button className="secondary" onClick={() => setActive("occasions")}>Back to 21 Occasions</button><button className="secondary" onClick={() => setActive("tasting")}>Tasting / Flavor Wheel</button><button className="secondary" onClick={() => setActive("matrix")}>What Went Wrong?</button><button className="primary" onClick={createReport}>Create Doma Report</button></div></section>
  </section>;
}

function buildTimingMetrics(occasionItem, stepTimings, occasionStartTime) {
  const totalActualSeconds = Object.values(stepTimings || {}).reduce((sum, item) => sum + (Number(item.actualSeconds) || 0), 0);
  return { suggestedTotalTempo: occasionItem?.suggestedTempo || occasionItem?.time || "Not set", totalActualSeconds, stepLevel: stepTimings || {}, previousAttempt: null, personalBest: null, improvementNote: "First captured attempt or no prior local attempt yet.", tempoReflection: "The goal is not speed. The goal is calm, repeatable readiness." };
}
function formatSeconds(value) { const n = Math.max(0, Number(value) || 0); const m = Math.floor(n/60); const s = n % 60; return `${m}:${String(s).padStart(2,"0")}`; }

function OccasionSetup({ occasion, updateOccasion, setActive, loadClearFastShot, setupMissing, requireSetupThen }) {
  const setupComplete = !setupMissing?.length;
  return <section className="card"><h2>Occasion Setup</h2><p className="small">The product is not only about the cup. It prepares the barista for the moment.</p>{setupComplete ? <div className="successBox"><strong>Setup complete.</strong> You can begin a live Advisor Session.</div> : <div className="errorBox"><strong>Setup incomplete.</strong> Complete before beginning: {setupMissing.join(", ")}</div>}<div className="grid"><Field label="Occasion name" value={occasion.occasionName} onChange={(v) => updateOccasion("occasionName", v)} /><Field label="Drink" value={occasion.drink} onChange={(v) => updateOccasion("drink", v)} /><Field label="Who is being served" value={occasion.guest} onChange={(v) => updateOccasion("guest", v)} /><Field label="Time pressure" value={occasion.timePressure} onChange={(v) => updateOccasion("timePressure", v)} /><Field label="Current shot time" value={occasion.currentShotTime} onChange={(v) => updateOccasion("currentShotTime", v)} /><Field label="Suggested total Occasion tempo" value={occasion.suggestedTempo || ""} onChange={(v) => updateOccasion("suggestedTempo", v)} /><Field label="Recurrence / pattern" value={occasion.recurrence} onChange={(v) => updateOccasion("recurrence", v)} /></div><label className="label">Desired feeling / delight</label><input value={occasion.desiredFeeling} onChange={(e) => updateOccasion("desiredFeeling", e.target.value)} /><label className="label">Moment intent</label><textarea value={occasion.momentIntent} onChange={(e) => updateOccasion("momentIntent", e.target.value)} /><div className="buttonRow"><button className="secondary" onClick={loadClearFastShot}>Load Sample Before-Church Occasion</button><button className="secondary" onClick={() => setActive("matrix")}>Open What Went Wrong Matrix</button><button className="primary" onClick={() => requireSetupThen("simulator")}>Begin Occasion Simulation</button></div></section>;
}

function Simulator(props) {
  const { recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, advisorAudioRef, stopAdvisorVoice, beginCorrection, correctionMode, createReport, uploadAsset, setUploadAsset, handleAdvisorUpload } = props;
  return <>
    <section className="card">
      <h2>Occasion Simulator</h2>
      <p className="small">Speak what is happening with the cup, machine, room, guest, or occasion. The form grounds; your voice clarifies; corrections can update the Advisor.</p>
      <div className="buttonRow">
        <button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : () => startRecording("replace")}>{recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}</button>
        <button className="secondary" onClick={() => startRecording("append")} disabled={recording}>Add Spoken Detail / Correction</button>
      </div>
      {correctionMode ? <div className="noteBox"><strong>Correction mode:</strong> Tell the Advisor what it misunderstood, for example: “No, it was not running fast. It was barely dripping, only a few drops came out.”</div> : null}
      {audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}
      <label className="label">Artisan transcript / comment</label>
      <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Speak or type what happened. Corrections are appended here." />
      <div className="uploadPanel">
        <h3>Advisor visual upload</h3>
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
        <button className="secondary" onClick={stopAdvisorVoice} disabled={!advisorAudioUrl}>Stop Advisor</button>
        <button className="secondary green" onClick={beginCorrection} disabled={!advisorText || advisorText === advisorStarterText}>Correct / Add Detail</button>
        <button className="secondary" onClick={createReport} disabled={!advisorText || advisorText === advisorStarterText}>Create Doma Report</button>
      </div>
      {advisorAudioUrl ? <><h3>Advisor Audio Playback</h3><audio ref={advisorAudioRef} controls autoPlay src={advisorAudioUrl} /></> : null}
    </section>
  </>;
}

function Reports({ reports, clearReports, setActive, printReport, exportReportsCSV }) {
  const latest = reports[0] || null;
  const previous = reports[1] || null;
  return <section className="reportsPage">
    <section className="card reportHero">
      <p className="eyebrow">Doma Reports / Second Coffee Brain</p>
      <h1>Performance reporting for the cup, the machine, and the Occasion.</h1>
      <p>Barista Doma should become the one true source for the artisan’s machine, recipes, dosing, recoveries, tasting notes, charts, Guest Resonance, and Occasion performance.</p>
      <div className="buttonRow"><button className="primary" onClick={() => setActive("simulator")}>Create New Occasion Report</button><button className="secondary" onClick={() => setActive("tasting")}>Open Tasting Studio</button><button className="secondary" onClick={exportReportsCSV} disabled={!reports.length}>Export CSV</button><button className="secondary" onClick={clearReports}>Clear Local Reports</button></div>
    </section>

    {latest ? <section className="card"><h2>Current Performance Dashboard</h2><p className="small">Radar for balance, bar chart for category comparison, and a Decent-inspired plot for nerd-minded progression.</p><DomaPerformanceDashboard report={latest} previous={previous} reports={reports} /></section> : <div className="noteBox">No reports yet. Run the Simulator or Tasting Studio and create a Doma Report.</div>}

    {reports.map((r, idx) => <article className="report" key={r.id}>
      <h3>{r.title}</h3>
      <p className="small">{r.createdAt} • {r.drink} • Served to: {r.guest}</p>
      <div className="reportGrid">
        <div className="noteBox"><strong>Machine + Formula</strong><br/>Machine: {r.machineInfo?.machine || r.context?.machine || "Not captured"}<br/>Grinder: {r.machineInfo?.grinder || r.context?.grinder || "Not captured"}<br/>Beans: {r.machineInfo?.beans || r.context?.beans || "Not captured"}<br/>Dose → Yield: {r.dosingInfo?.dose || r.context?.dose || "?"} → {r.dosingInfo?.yield || r.context?.yield || "?"}<br/>House time: {r.dosingInfo?.houseShotTime || "Not captured"}<br/>Actual/observed time: {r.dosingInfo?.currentShotTime || r.context?.shotTime || "Not captured"}</div>
        <div className="successBox"><strong>Confidence + Trend</strong><br/>Machine Confidence: {r.confidenceMetrics?.machineConfidence ?? r.sensoryScores?.machineConfidence ?? "—"}<br/>Taste Clarity: {r.confidenceMetrics?.tasteClarity ?? r.sensoryScores?.tasteClarity ?? "—"}<br/>Stagecraft: {r.confidenceMetrics?.stagecraft ?? r.sensoryScores?.stagecraft ?? "—"}<br/>Recovery Confidence: {r.confidenceMetrics?.recoveryConfidence ?? r.sensoryScores?.recoveryConfidence ?? "—"}<br/>Trend: {r.trendSummary || "First report or no prior comparison."}</div>
      </div>
      <DomaPerformanceDashboard report={r} previous={reports[idx + 1]} reports={reports.slice(idx)} compact />
      <p><strong>Artisan said:</strong> {r.transcript || "No transcript captured."}</p>
      <p><strong>Matrix:</strong> {r.matrixMatch?.label || "None"}</p>
      <p><strong>Flavor notes:</strong> {(r.selectedFlavorNotes || []).join(", ") || "No flavor notes selected."}</p>
      {r.guestResonance ? <div className="successBox"><strong>Guest Resonance:</strong> {r.guestResonance.score}/5 · {r.guestResonance.reaction} · first noticed {r.guestResonance.firstThingNoticed}<br/><strong>Would serve again:</strong> {r.guestResonance.wouldServeAgain} · <strong>Next adjustment:</strong> {r.guestResonance.nextAdjustment}<br/><strong>Guest quote/observation:</strong> {r.guestResonance.quote || "Not captured."}</div> : null}
      {r.timingMetrics ? <div className="noteBox"><strong>Occasion Tempo:</strong> Suggested {r.timingMetrics.suggestedTotalTempo}; actual captured {formatSeconds(r.timingMetrics.totalActualSeconds)}.<br/><strong>Improvement note:</strong> {r.timingMetrics.improvementNote}<br/><strong>Tempo reflection:</strong> {r.timingMetrics.tempoReflection}<br/><small>Founder Benchmarks placeholder: Suggested Tempo · Your Actual Tempo · Personal Best · Founder Cohort Average · Community Average later.</small></div> : null}
      <details><summary>Tasting note</summary><p>{r.tastingNote || "No tasting note captured."}</p></details>
      <details><summary>Advisor response</summary><pre>{r.advisorText}</pre></details>
      <div className="buttonRow"><button className="primary" onClick={() => printReport(r)}>Print Report</button></div>
    </article>)}
  </section>;
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
  return <section className="guestBox"><h3>Guest Resonance Check</h3><p className="small">The Occasion is not complete when the drink is made. It is complete when the drink is received.</p><div className="grid"><div><label className="label">Guest Resonance Score, 1–5</label><input type="range" min="1" max="5" value={guestResonance.score} onChange={(e) => update("score", Number(e.target.value))} /><strong>{guestResonance.score}</strong></div><div><label className="label">Guest reaction</label><select value={guestResonance.reaction} onChange={(e) => update("reaction", e.target.value)}>{["delighted","curious","neutral","confused","overwhelmed","comforted","surprised"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">First thing noticed</label><select value={guestResonance.firstThingNoticed} onChange={(e) => update("firstThingNoticed", e.target.value)}>{["aroma","sweetness","acidity","texture","temperature","visual presentation","story","finish"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">Would serve again</label><select value={guestResonance.wouldServeAgain} onChange={(e) => update("wouldServeAgain", e.target.value)}>{["yes","adjust","no"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="label">Next adjustment</label><select value={guestResonance.nextAdjustment} onChange={(e) => update("nextAdjustment", e.target.value)}>{["sweeter","brighter","colder","warmer","stronger","softer","more story","less explanation"].map((x)=><option key={x} value={x}>{x}</option>)}</select></div></div><label className="label">Guest quote or observation</label><textarea value={guestResonance.quote} onChange={(e)=>update("quote", e.target.value)} placeholder="Capture what they said, noticed, or felt." /></section>;
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

function Matrix({ setActive, setTranscript, updateOccasion }) {
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
    setSelectedIssue(null);
    setActive("simulator");
  }
  function useTypedIssue() {
    const typed = query.trim();
    if (!typed) return;
    setTranscript(`The artisan typed this What Went Wrong description: ${typed}. Please search the Recovery Matrix, identify the closest issue, and blend this with the form and any voice note before advising.`);
    updateOccasion("recurrence", `Typed issue: ${typed}`);
    updateOccasion("momentIntent", "Typed What Went Wrong note should be synthesized with the Occasion context.");
    setActive("simulator");
  }
  async function readText(text) {
    setReadBusy(true); setReadAudioUrl("");
    try {
      const response = await fetch("/api/speak", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voice: "sage" }) });
      if (!response.ok) throw new Error("Read aloud failed.");
      const blob = await response.blob();
      setReadAudioUrl(URL.createObjectURL(blob));
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
    {readAudioUrl ? <section className="card"><h3>Advisor Read-Aloud Playback</h3><audio controls autoPlay src={readAudioUrl} /></section> : null}
    {selectedIssue ? <div className="modalBackdrop" role="dialog" aria-modal="true"><div className="recoveryModal"><button className="modalClose" onClick={() => setSelectedIssue(null)}>Close</button><p className="eyebrow">Moment Recovery Engine</p><h2>{selectedIssue.issue}</h2><p><strong>Likely cause:</strong> {selectedIssue.likelyCause}</p><p><strong>Advisor:</strong> {selectedIssue.advisor}</p><p><strong>One next move:</strong> {selectedIssue.oneNextMove}</p><hr /><h2>Solution steps to follow</h2><ol>{selectedIssue.solutionSteps.map((step, idx) => <li key={idx}>{step}</li>)}</ol><div className="buttonRow"><button className="primary" onClick={() => readText(fixText(selectedIssue))} disabled={readBusy}>{readBusy ? "Reading…" : "Read solution"}</button><button className="secondary" onClick={() => readText(recoveryText(selectedIssue))} disabled={readBusy}>Read quick recovery</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Use in Advisor Session</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Log this in Doma Report</button></div>{readAudioUrl ? <audio controls autoPlay src={readAudioUrl} /> : null}</div></div> : null}
  </section>;
}


function SynthesisPanel({ synthesis }) {
  return <div className="synthesisBox"><h3>Advisor Understanding</h3><p><strong>Form complete:</strong> {String(synthesis.formComplete)}</p>{synthesis.missingFields?.length ? <p><strong>Missing fields:</strong> {synthesis.missingFields.join(", ")}</p> : null}<p><strong>Detected artisan intent:</strong> {synthesis.detectedArtisanIntent}</p><p><strong>Voice quality:</strong> {synthesis.voiceQuality}</p><p><strong>Primary live signal:</strong> {synthesis.primaryLiveSignal}</p><p><strong>Supporting context used:</strong> {synthesis.supportingContextUsed || "None"}</p><p><strong>Matrix applied:</strong> {String(synthesis.matrixApplied)}</p>{synthesis.primaryMatrixSignal ? <p><strong>Primary matrix signal:</strong> {synthesis.primaryMatrixSignal.label}</p> : null}{synthesis.secondaryMatrixSignal ? <p><strong>Secondary matrix signal:</strong> {synthesis.secondaryMatrixSignal.label}</p> : null}</div>;
}
function Field({ label, value, onChange }) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <div><label className="label" htmlFor={id}>{label}</label><input id={id} value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
