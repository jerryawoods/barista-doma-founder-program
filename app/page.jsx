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


const founderOccasions = [
  {
    id: "first-cup-diagnostic",
    name: "The First Cup Diagnostic",
    tag: "Orientation",
    purpose: "Establish the artisan's baseline and begin reading the machine as an instrument.",
    drink: "Espresso",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec target",
    grindVessel: "medium-fine · demitasse",
    desiredFeeling: "clear, calm, observant, confident",
    artisanOpening: "This first cup is not about perfection. I am learning how this machine speaks today, and I am going to listen carefully.",
    reportPrompt: "What did the first cup reveal about flow, taste, rhythm, and confidence?",
    steps: [
      { title: "Name the intention", advisor: "Begin by stating that this is a diagnostic cup, not a performance test. Your job is to observe without panic.", script: "I am starting with a clear baseline so I can understand the machine before I try to impress it." },
      { title: "Prepare the counter", advisor: "Clear the immediate workspace. Put cup, towel, scale, beans, tamper, and milk pitcher where your hands can move calmly.", script: "The counter is set. I am giving the cup a clean place to begin." },
      { title: "Warm the machine and cup", advisor: "Confirm the machine is ready, purge briefly, and warm the vessel. A cold start can distort the cup.", script: "I am warming the cup so the coffee lands in a ready vessel." },
      { title: "Dose with discipline", advisor: "Use the house dose. Do not improvise yet. A stable dose lets the Advisor understand what changed.", script: "I am keeping the dose steady so I can learn from one variable at a time." },
      { title: "Prepare the puck", advisor: "Distribute evenly, tamp level, and check the rim. Puck preparation is the first act of stagecraft.", script: "I am preparing the coffee bed carefully so the water can move with intention." },
      { title: "Pull and observe", advisor: "Watch first drops, flow color, speed, and body. Record what happened without judging yourself.", script: "I am watching the flow and letting the machine show me where we are." },
      { title: "Taste for direction", advisor: "Taste for sour, bitter, thin, balanced, or pleasant. Do not chase every note; identify the next useful direction.", script: "This taste is information. I am not failing; I am learning the path." },
      { title: "Use Recovery if needed", advisor: "If the cup chokes, runs fast, tastes sour, or feels thin, open the Recovery Library before guessing.", script: "If something goes wrong, I will recover with one clear move rather than panic." },
      { title: "Capture the Doma Report", advisor: "Speak a quick note: dose, yield, time, taste, feeling, and one next move.", script: "I am saving what this cup taught me so the next cup can become more confident." }
    ]
  },
  {
    id: "quiet-table",
    name: "The Quiet Table",
    tag: "Soft connection",
    purpose: "Serve a calm, low-noise coffee moment for a person who needs quiet presence more than performance.",
    drink: "Cappuccino",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · warm ceramic cup",
    desiredFeeling: "soft, steady, gentle, cared for",
    artisanOpening: "I made this one quietly, just to create a little room for you to settle.",
    reportPrompt: "Did the cup lower the room's noise and create a softer moment?",
    steps: [
      { title: "Read the room", advisor: "Notice whether the person wants conversation or quiet. Do not over-explain the coffee.", script: "No rush. This is just a quiet cup for a quiet moment." },
      { title: "Soften the setup", advisor: "Reduce clatter. Set tools down gently. The sound of preparation is part of the occasion.", script: "I am keeping the counter calm so the cup feels peaceful before it is served." },
      { title: "Choose a comforting drink", advisor: "A cappuccino or milk drink can carry warmth without demanding analysis.", script: "I chose something soft and warm rather than something that asks for attention." },
      { title: "Confirm the house formula", advisor: "Use the familiar recipe. This is not the moment for experimentation.", script: "I am keeping the recipe familiar so the moment can stay easy." },
      { title: "Pull with steady pace", advisor: "Watch the shot, but do not let the machine pull your emotional rhythm faster than the room.", script: "The coffee can take its time. So can we." },
      { title: "Texture the milk softly", advisor: "Aim for glossy, quiet milk texture. Avoid large bubbles and harsh steaming sounds where possible.", script: "I am giving this cup a softer texture for a softer moment." },
      { title: "Present without performance", advisor: "Serve simply. Let the cup be an offering, not a demonstration.", script: "Here you go. Just something warm to sit with for a minute." },
      { title: "Recover quietly", advisor: "If the shot is imperfect, do not announce failure. Use the Recovery Library only if the issue would harm the moment.", script: "If I need to adjust, I will do it calmly and keep the room steady." },
      { title: "Report the felt outcome", advisor: "Capture whether the moment felt calmer, not only whether the extraction was ideal.", script: "I am remembering whether this cup brought peace, not just whether it hit numbers." }
    ]
  },
  {
    id: "welcome-home-cup",
    name: "The Welcome Home Cup",
    tag: "Homecoming",
    purpose: "Use coffee to mark arrival, warmth, and belonging when someone returns home.",
    drink: "Latte or cappuccino",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · favorite home cup",
    desiredFeeling: "welcoming, warm, relieving, familiar",
    artisanOpening: "Welcome home. I made this so the day can soften a little as you come in.",
    reportPrompt: "Did the cup help the person feel received by the home?",
    steps: [
      { title: "Prepare before arrival", advisor: "If possible, set the station before the person enters. The welcome should feel effortless.", script: "I wanted this ready close to when you walked in." },
      { title: "Choose the right cup", advisor: "Use a familiar vessel. Homecoming is about recognition.", script: "I chose the cup that feels most like home." },
      { title: "Set the atmosphere", advisor: "Lower clutter, create counter space, and let the machine feel like a hearth rather than an appliance.", script: "The counter is ready. The house gets to welcome you too." },
      { title: "Pull the espresso", advisor: "Keep the shot reliable. This is a service moment, not a dial-in experiment.", script: "I am keeping this cup steady and familiar." },
      { title: "Steam for comfort", advisor: "Texture milk for sweetness and warmth. Avoid chasing complex latte art if it slows the welcome.", script: "I am making this soft enough to land gently." },
      { title: "Serve with eye contact", advisor: "Presentation is human before it is visual. Let the guest feel seen.", script: "Here you go. I am glad you are home." },
      { title: "Use Recovery gracefully", advisor: "If something misbehaves, choose the simplest recovery. The welcome matters more than perfection.", script: "If this one needs a small correction, I will keep the welcome intact." },
      { title: "Invite the pause", advisor: "Give the person permission to sit, breathe, or talk.", script: "Take a minute. The rest can wait." },
      { title: "Capture what worked", advisor: "Report the guest reaction and the rhythm of the welcome.", script: "I am noting whether the cup helped the home feel like home." }
    ]
  },
  {
    id: "morning-launch",
    name: "The Morning Launch",
    tag: "Confidence",
    purpose: "Start the day with a coffee ritual that creates momentum without rushing the artisan or the household.",
    drink: "Americano or cappuccino",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · travel or breakfast cup",
    desiredFeeling: "focused, capable, ordered, optimistic",
    artisanOpening: "This cup is here to help us begin the day with steadiness instead of scramble.",
    reportPrompt: "Did the cup create momentum, order, and confidence for the day?",
    steps: [
      { title: "Choose the morning outcome", advisor: "Decide whether the cup needs speed, softness, or focus. Let the occasion choose the drink.", script: "This cup is for a better start, not just more speed." },
      { title: "Stage the essentials", advisor: "Put only what you need on the counter. Morning complexity causes mistakes.", script: "I am keeping the station simple so the morning can move cleanly." },
      { title: "Confirm machine readiness", advisor: "Warm the machine and cup. A hurried cold pull can sabotage confidence.", script: "I am giving the machine a fair start so it can give us a steady cup." },
      { title: "Use the house formula", advisor: "Use your reliable dose and yield. Morning launch is not the place for excessive experimentation.", script: "I am choosing the known path this morning." },
      { title: "Pull and watch the pace", advisor: "If it runs fast or slow, note it. Make one adjustment only if time allows.", script: "I am watching the flow without letting it rush me." },
      { title: "Finish for the day ahead", advisor: "If milk is involved, texture for comfort. If black coffee, serve cleanly and promptly.", script: "This cup is ready to move with us into the day." },
      { title: "Recovery path", advisor: "If something goes wrong, open the Matrix and choose the fastest stabilizing move.", script: "One calm recovery is better than a frantic perfect cup." },
      { title: "Serve the launch", advisor: "Hand the cup over as a signal that the day can begin with care.", script: "Here is a steady start for the morning." },
      { title: "Report the rhythm", advisor: "Log whether the workflow helped or hurt the morning.", script: "I am saving what made the morning smoother." }
    ]
  },
  {
    id: "listening-cup",
    name: "The Listening Cup",
    tag: "Conversation",
    purpose: "Create low-pressure ground for conversation, reflection, or reconciliation.",
    drink: "Pour-over, Americano, or gentle milk drink",
    dose: "18g espresso or 20g brew",
    yield: "36g espresso or 300g brew",
    time: "espresso 25–32 sec · brew 3:00–4:00",
    grindVessel: "method-appropriate · shared table cup",
    desiredFeeling: "open, unhurried, safe, attentive",
    artisanOpening: "I made this so we could have something warm between us while we talk.",
    reportPrompt: "Did the cup create low-pressure space for listening?",
    steps: [
      { title: "Name the human purpose", advisor: "This is not a beverage flex. It is a container for listening.", script: "No pressure. I just thought coffee might give us a gentle place to start." },
      { title: "Choose a non-demanding drink", advisor: "Select a drink that does not require the guest to analyze flavor.", script: "I kept this simple so the conversation can lead." },
      { title: "Set seating before service", advisor: "Know where the cup will land. The table is part of the stage.", script: "I set this here so we can sit comfortably." },
      { title: "Prepare with quiet rhythm", advisor: "Let your movements show care and patience.", script: "I am not rushing this cup." },
      { title: "Serve as an invitation", advisor: "Offer the cup without forcing the conversation.", script: "Here you go. We can talk, or just sit for a minute." },
      { title: "Let silence work", advisor: "Do not fill every pause. Coffee can hold the threshold.", script: "We do not have to rush the words." },
      { title: "Recovery if needed", advisor: "If the cup is imperfect, do not make the moment about the mistake.", script: "This cup is here to support the moment, not dominate it." },
      { title: "Close gently", advisor: "Let the cup end with appreciation rather than a verdict.", script: "Thank you for sitting with me." },
      { title: "Report the threshold", advisor: "Capture whether trust, calm, or openness increased.", script: "I am noting how the cup helped the conversation begin." }
    ]
  },
  {
    id: "apology-cup",
    name: "The Apology Cup",
    tag: "Repair",
    purpose: "Offer coffee as a humble gesture of repair without using it to avoid accountability.",
    drink: "Warm latte or gentle cappuccino",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · simple cup",
    desiredFeeling: "humble, sincere, warm, safe",
    artisanOpening: "I made this as a small gesture. The apology matters more than the coffee, but I wanted to bring care with it.",
    reportPrompt: "Did the cup support humility and repair without becoming a distraction?",
    steps: [
      { title: "Check your posture", advisor: "Do not use the cup as a performance to earn forgiveness. Use it as a vessel of care.", script: "This is just a small gesture. What I need to say matters more." },
      { title: "Keep the drink simple", advisor: "Avoid flamboyance. Repair calls for humility.", script: "I kept this simple because I do not want to make this about me." },
      { title: "Prepare calmly", advisor: "Let your pace settle you before you speak.", script: "I am slowing down before I come to you." },
      { title: "Serve before explaining", advisor: "Hand the cup gently, then speak plainly.", script: "Here. I made this for you, and I also owe you an apology." },
      { title: "Say the apology", advisor: "Be specific. Do not hide behind the coffee.", script: "I am sorry for what I did. I understand it affected you." },
      { title: "Do not demand response", advisor: "The cup is an offering, not a transaction.", script: "You do not have to respond right now." },
      { title: "Recovery if coffee fails", advisor: "If the drink is imperfect, keep the apology centered.", script: "The coffee may not be perfect, but the care is real." },
      { title: "Close with respect", advisor: "Let the other person lead the next moment.", script: "Thank you for hearing me." },
      { title: "Report with honesty", advisor: "Capture what the cup helped and what the conversation still needs.", script: "I am recording the lesson, not scoring the person." }
    ]
  },
  {
    id: "celebration-cup",
    name: "The Celebration Cup",
    tag: "Joy",
    purpose: "Mark good news with a cup that feels intentional, elevated, and shared.",
    drink: "Signature milk drink or espresso tonic",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · clear or favorite celebratory cup",
    desiredFeeling: "joyful, bright, proud, delightful",
    artisanOpening: "This cup is for the good news. I wanted the moment to have a little ceremony.",
    reportPrompt: "Did the cup help make the celebration feel remembered?",
    steps: [
      { title: "Name the celebration", advisor: "Know exactly what the cup is honoring.", script: "This is for what just happened. It deserves a little ceremony." },
      { title: "Choose a festive format", advisor: "A signature drink, garnish, or special cup can elevate the moment.", script: "I made this one a little special for the occasion." },
      { title: "Set visual stagecraft", advisor: "Use a tray, cloth, garnish, or clear glass if it adds delight.", script: "I wanted it to look like the good news feels." },
      { title: "Pull the base carefully", advisor: "A bright moment still needs a stable cup. Keep dose and yield known.", script: "The base is steady so the celebration can shine." },
      { title: "Build the signature touch", advisor: "Add the celebratory element without overcomplicating the drink.", script: "This is the little extra for today." },
      { title: "Serve with words", advisor: "Say what is being celebrated. Let the cup become a marker.", script: "To this moment — and to what it means." },
      { title: "Recovery path", advisor: "If the drink stumbles, simplify and preserve joy.", script: "If I need to adjust, I will keep the celebration moving." },
      { title: "Invite a toast or pause", advisor: "Let the cup hold the recognition.", script: "Let's take one sip before we rush past it." },
      { title: "Report the memory", advisor: "Capture what made the cup feel celebratory.", script: "I am saving the details that made this feel like a real moment." }
    ]
  },
  {
    id: "boss-coming-over",
    name: "The Boss Is Coming Over",
    tag: "Hospitality",
    purpose: "Prepare a confident, polished coffee moment for a high-stakes guest without becoming stiff or performative.",
    drink: "Cappuccino, latte, or clean espresso",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · polished ceramic cup",
    desiredFeeling: "composed, credible, generous, refined",
    artisanOpening: "I made this as a small welcome. I hope it gives us a good place to begin.",
    reportPrompt: "Did the cup support confidence and gracious hosting?",
    steps: [
      { title: "Lower the stakes internally", advisor: "You are hosting a person, not auditioning for a café job.", script: "This is hospitality, not a performance exam." },
      { title: "Choose a reliable drink", advisor: "Select the drink you can make consistently under pressure.", script: "I chose something familiar so I can serve it well." },
      { title: "Prepare the room", advisor: "Clear seating, cup placement, napkin, water, and counter visibility.", script: "I set things up so we can just enjoy the coffee." },
      { title: "Use known settings", advisor: "Do not attempt a new recipe. Let confidence come from repetition.", script: "I am staying with the house formula today." },
      { title: "Pull with composure", advisor: "If flow is off, make one controlled recovery, not a string of nervous changes.", script: "I am keeping the process steady." },
      { title: "Serve with ease", advisor: "Avoid apologizing for small imperfections. Offer the cup warmly.", script: "Here you go. I hope this brings a little warmth to the conversation." },
      { title: "Recovery path", advisor: "If something fails, use the Matrix and simplify to a drink you can complete gracefully.", script: "If I need to reset, I will do it calmly and keep the welcome intact." },
      { title: "Let conversation lead", advisor: "After serving, stop performing. Be present.", script: "Please enjoy. I am glad you could come by." },
      { title: "Report the host rhythm", advisor: "Capture what helped you feel composed.", script: "I am noting how I hosted, not just how the shot ran." }
    ]
  },
  {
    id: "neighbor-cup",
    name: "The Neighbor Cup",
    tag: "Community",
    purpose: "Use coffee to build simple local connection without overformalizing the moment.",
    drink: "Americano, latte, or batch-style coffee",
    dose: "18g espresso or 20g brew",
    yield: "36g or 300g brew",
    time: "espresso 25–32 sec · brew 3:00–4:00",
    grindVessel: "method-appropriate · casual mug",
    desiredFeeling: "friendly, generous, easy, connected",
    artisanOpening: "I made a little extra and thought you might enjoy a cup.",
    reportPrompt: "Did the cup create an easy bridge to community?",
    steps: [
      { title: "Keep it neighborly", advisor: "Do not make the invitation feel elaborate or burdensome.", script: "No big production. I just thought you might like some coffee." },
      { title: "Choose an accessible drink", advisor: "Select something broadly enjoyable and easy to accept.", script: "I made something simple and warm." },
      { title: "Prepare an extra cup", advisor: "Have a second cup ready before offering so the gesture feels natural.", script: "I already had enough for one more." },
      { title: "Serve without pressure", advisor: "Offer, then let them decline easily if needed.", script: "Only if you want one — no pressure at all." },
      { title: "Read the response", advisor: "If they linger, conversation may open. If not, the gesture still worked.", script: "I am glad to share it either way." },
      { title: "Recovery path", advisor: "If the coffee is not perfect, let generosity carry the moment.", script: "It is a simple cup, but it comes with good will." },
      { title: "Create the bridge", advisor: "Use the cup to make future connection easier.", script: "Maybe next time we can sit for a few minutes." },
      { title: "Report community signal", advisor: "Capture whether the cup made the relationship warmer.", script: "I am remembering how coffee helped us connect." }
    ]
  },
  {
    id: "late-night-counter",
    name: "The Late-Night Counter",
    tag: "Reflection",
    purpose: "Make coffee or decaf as a reflective counter moment when the house is quieter.",
    drink: "Decaf espresso, cortado, or warm milk drink",
    dose: "17–18g",
    yield: "34–36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · small ceramic cup",
    desiredFeeling: "quiet, reflective, settled, grateful",
    artisanOpening: "This is just a small cup to close the day with a little care.",
    reportPrompt: "Did the cup help the day land softly?",
    steps: [
      { title: "Choose gentleness", advisor: "Late-night coffee should not disturb the body or the room.", script: "I am making this gentle because the day is closing." },
      { title: "Lower the sound", advisor: "Keep grinder, cups, and cleanup as quiet as possible.", script: "I am keeping the counter quiet tonight." },
      { title: "Use decaf or small format", advisor: "Match the cup to rest, not stimulation.", script: "This is for reflection, not a second workday." },
      { title: "Prepare slowly", advisor: "Let the ritual help you settle.", script: "I am letting the process slow me down." },
      { title: "Serve to self or loved one", advisor: "If sharing, keep words soft and brief.", script: "Here is something small and warm before we close the day." },
      { title: "Recovery path", advisor: "If the shot is off, do not chase multiple pulls late at night. Simplify.", script: "A simple cup is enough tonight." },
      { title: "Reflect with the cup", advisor: "Let the cup hold gratitude, not analysis.", script: "One sip, one breath, and the day can rest." },
      { title: "Report the closure", advisor: "Capture whether the ritual helped the transition to rest.", script: "I am noting what helped the day end well." }
    ]
  },
  {
    id: "parent-visit",
    name: "The Parent Visit",
    tag: "Familiarity",
    purpose: "Serve family with dignity, familiarity, and care without overcomplicating the cup.",
    drink: "Latte, drip-style coffee, or cappuccino",
    dose: "18g or familiar brew ratio",
    yield: "36g or full cup",
    time: "25–32 sec espresso · brew as needed",
    grindVessel: "familiar mug",
    desiredFeeling: "honoring, familiar, comfortable, generous",
    artisanOpening: "I made this the way I thought you might enjoy it — familiar and warm.",
    reportPrompt: "Did the cup honor the guest rather than the artisan's ego?",
    steps: [
      { title: "Start with their preference", advisor: "Family hospitality often means serving what they enjoy, not what you want to showcase.", script: "I made this closer to how you like it." },
      { title: "Choose familiarity", advisor: "Use a drink style and cup that feels recognizable.", script: "Nothing complicated — just something warm for you." },
      { title: "Prepare with respect", advisor: "Let your movements show care rather than impatience.", script: "I wanted to take a little care with this one." },
      { title: "Adjust sweetness or milk thoughtfully", advisor: "Do not shame preferences. Hospitality honors the person.", script: "I can add a little more milk or sweetness if you prefer." },
      { title: "Serve with memory", advisor: "Connect the cup to family warmth, not performance.", script: "This reminded me of the kind of coffee we would sit with." },
      { title: "Recovery path", advisor: "If the machine misbehaves, simplify quickly. The visit matters more.", script: "I will keep this easy and make sure you have a cup you enjoy." },
      { title: "Invite comfort", advisor: "Make the guest feel they can relax.", script: "Sit down. I will bring it over." },
      { title: "Report preference", advisor: "Capture what they actually liked for next time.", script: "I am remembering your preference so the next cup feels even more like yours." }
    ]
  },
  {
    id: "friend-needs-lift",
    name: "The Friend Who Needs a Lift",
    tag: "Encouragement",
    purpose: "Use coffee as a gentle lift for someone discouraged, tired, or emotionally low.",
    drink: "Mocha, latte, or comforting cappuccino",
    dose: "18g",
    yield: "36g",
    time: "25–32 sec",
    grindVessel: "medium-fine · comforting mug",
    desiredFeeling: "encouraging, warm, seen, hopeful",
    artisanOpening: "I made this because sometimes a warm cup helps the next few minutes feel possible.",
    reportPrompt: "Did the cup help lift the friend's spirit without forcing cheer?",
    steps: [
      { title: "Do not force positivity", advisor: "A lift is not denial. Offer warmth without minimizing their feeling.", script: "I know today is a lot. I made this for right now." },
      { title: "Choose comfort", advisor: "A slightly sweeter or milk-based drink may serve the emotional moment.", script: "I made this one a little comforting." },
      { title: "Prepare with care", advisor: "Let the ritual communicate attention.", script: "I took a little time with this because you matter." },
      { title: "Serve gently", advisor: "Place the cup as support, not a demand to feel better.", script: "No need to talk unless you want to. Here is something warm." },
      { title: "Let the cup work", advisor: "Allow quiet. The cup can be the first bridge.", script: "We can just sit for a minute." },
      { title: "Recovery path", advisor: "If the drink is imperfect, the kindness still matters. Simplify.", script: "The cup is simple, but the care behind it is real." },
      { title: "Encourage lightly", advisor: "Use one sincere line, not a speech.", script: "I am with you. We can take the next step slowly." },
      { title: "Report the lift", advisor: "Capture whether warmth, presence, or conversation emerged.", script: "I am noting how the cup helped create a little lift." }
    ]
  },
  {
    id: "deep-work-cup",
    name: "The Deep Work Cup",
    tag: "Focus",
    purpose: "Create a focused cup that supports serious work without becoming a distraction.",
    drink: "Americano, espresso, or pour-over",
    dose: "18g espresso or 20g brew",
    yield: "36g espresso or 300g brew",
    time: "espresso 25–32 sec · brew 3:00–4:00",
    grindVessel: "method-appropriate · desk-safe cup",
    desiredFeeling: "focused, clear, sustained, capable",
    artisanOpening: "This cup is to help me enter focused work with clarity and steadiness.",
    reportPrompt: "Did the cup support focus without pulling attention away from the work?",
    steps: [
      { title: "Define the work block", advisor: "Name the work before making the coffee. The cup serves the work.", script: "This cup is for one focused block, not endless distraction." },
      { title: "Choose clean energy", advisor: "Avoid over-rich drinks if they slow the body or mind.", script: "I am choosing clarity over comfort this time." },
      { title: "Set the desk stage", advisor: "Prepare water, notebook, and cup placement before brewing.", script: "The workspace is ready before the coffee arrives." },
      { title: "Brew reliably", advisor: "Use a known recipe. Deep work does not need a dial-in detour.", script: "I am keeping the cup simple so the work can be complex." },
      { title: "Serve to self", advisor: "Place the cup where it supports rhythm without becoming fidgeting.", script: "This cup marks the start." },
      { title: "Recovery path", advisor: "If the cup fails, do not sacrifice the work block. Simplify quickly.", script: "A decent cup and a strong work block beat a perfect cup and lost focus." },
      { title: "Begin immediately", advisor: "The first sip should lead into action.", script: "Sip, breathe, begin." },
      { title: "Report effectiveness", advisor: "Capture whether the cup helped focus, clarity, and momentum.", script: "I am noting whether this cup helped me do the work." }
    ]
  },
  {
    id: "after-dinner-cup",
    name: "The After-Dinner Cup",
    tag: "Closure",
    purpose: "Close a meal with warmth, conversation, and a sense of completion.",
    drink: "Decaf espresso, cortado, affogato, or small cappuccino",
    dose: "17–18g",
    yield: "34–36g",
    time: "25–32 sec",
    grindVessel: "small cup or dessert vessel",
    desiredFeeling: "complete, warm, lingering, satisfied",
    artisanOpening: "I made this as a small closing note for the meal.",
    reportPrompt: "Did the cup help the meal end with warmth and completion?",
    steps: [
      { title: "Read the meal's energy", advisor: "Decide whether the close should be bright, sweet, quiet, or celebratory.", script: "This is just a little finish for the table." },
      { title: "Choose the closing drink", advisor: "Select small and elegant rather than large and heavy.", script: "I kept it small so it can close the meal, not restart it." },
      { title: "Prepare dessert pairing if needed", advisor: "If pairing with dessert, let coffee support sweetness and texture.", script: "This should sit nicely with the last bite." },
      { title: "Pull with care", advisor: "A small drink magnifies flaws, so keep the recipe stable.", script: "I am keeping this clean and simple." },
      { title: "Serve at the table", advisor: "Bring the cup as part of the meal's final rhythm.", script: "Here is the closing cup." },
      { title: "Recovery path", advisor: "If extraction is off, use milk, dessert, or smaller serving to preserve the close.", script: "I will adjust the finish without making the table wait." },
      { title: "Invite lingering", advisor: "Let the cup extend conversation without dragging the evening.", script: "We can linger for a few minutes." },
      { title: "Report the close", advisor: "Capture pairing, timing, and emotional finish.", script: "I am remembering how the meal ended through the cup." }
    ]
  },


  {
    id: "founders-performance",
    name: "The Founder's Performance",
    tag: "Showcase",
    purpose: "Bring story, technique, recovery, and report capture together as a signature home barista performance.",
    drink: "Chosen signature drink",
    dose: "18g or chosen formula",
    yield: "36g or chosen formula",
    time: "25–32 sec or chosen target",
    grindVessel: "chosen vessel · staged presentation",
    desiredFeeling: "expressive, confident, hospitable, delightful",
    artisanOpening: "This cup has a story. I made it to express care, memory, and a little craft at the counter.",
    reportPrompt: "Did the performance integrate story, cup, service, recovery, and delight?",
    steps: [
      { title: "Choose the story", advisor: "Name the feeling, memory, person, or place the drink will express.", script: "This cup is about a feeling I wanted to bring into the room." },
      { title: "Design the drink", advisor: "Choose ingredients, vessel, dose, yield, and finishing touch in service of the story.", script: "Every part of this drink is here for a reason." },
      { title: "Stage the counter", advisor: "Arrange tools and ingredients so the performance flows visibly and calmly.", script: "I prepared the counter so the cup could unfold clearly." },
      { title: "Rehearse the spoken opening", advisor: "Say the first line before starting. The story should guide the movement.", script: "Before I make it, let me tell you what this cup is meant to hold." },
      { title: "Execute the base", advisor: "Pull the espresso or brew foundation with known discipline.", script: "The base carries the structure of the drink." },
      { title: "Build the signature element", advisor: "Add the special element with restraint. It should clarify the story, not clutter it.", script: "This is the note that connects the cup to the moment." },
      { title: "Present the cup", advisor: "Serve with the vessel facing the guest, and speak the final line clearly.", script: "The cup holds the promise; the sip releases the joy." },
      { title: "Use Recovery if needed", advisor: "If something misfires, narrate calmly and choose one recovery path.", script: "I am going to steady this part so the cup can still land." },
      { title: "Invite the sip", advisor: "Give the guest a simple way to experience the drink.", script: "Take the first sip slowly; this one is meant to open gently." },
      { title: "Capture the performance report", advisor: "Record story, recipe, movement, guest response, and next refinement.", script: "I am saving the performance so the next one becomes more intentional." }
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

const advisorStarterText = `The form grounds. The artisan voice clarifies. The Advisor synthesizes. Capture a voice note or load a scenario, then generate an Advisor response.`;

export default function Home() {
  const [active, setActive] = useState("occasions");
  const [selectedOccasionId, setSelectedOccasionId] = useState(founderOccasions[0].id);
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

  const selectedFounderOccasion = useMemo(() => founderOccasions.find((item) => item.id === selectedOccasionId) || founderOccasions[0], [selectedOccasionId]);

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }
  function updateProfile(field, value) { setProfile((prev) => ({ ...prev, [field]: value })); }
  function updateOccasion(field, value) { setOccasion((prev) => ({ ...prev, [field]: value })); }
  function openFounderOccasion(item) {
    setSelectedOccasionId(item.id);
    setCurrentStepIndex(0);
    setOccasion((prev) => ({
      ...prev,
      occasionName: item.name,
      drink: item.drink,
      desiredFeeling: item.desiredFeeling,
      momentIntent: item.purpose,
      recurrence: "Selected Occasion: " + item.name,
      currentShotTime: item.time
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
    <main className="appShell">
      <aside className="sideNav">
        <div className="brandMark"><span>BD</span><div><strong>Barista Doma</strong><small>Founder Program v7.5</small></div></div>
        {["dashboard", "onboarding", "occasions", "walkthrough", "simulator", "matrix", "reports"].map((tab) => (
          <button key={tab} className={active === tab ? "sideLink active" : "sideLink"} onClick={() => setActive(tab)} type="button">{tabIcon(tab)} {tabLabel(tab)}</button>
        ))}
        <div className="pathwayBox"><strong>Founder Pathway</strong><p>Cup 0 of 15 completed · 0%</p><div className="pathTrack"><span style={{ width: `${Math.min(100, reports.length * 7)}%` }} /></div><small>Every Occasion can become a Doma Report.</small></div>
      </aside>
      <div className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Founder Program Prototype v7.5</p>
        <h1>Home Barista Occasion Simulator — 15 Occasions + Stagecraft</h1>
        <p>This starts with the 15 selectable Occasions because this is the heart of the product: detailed stagecraft walkthroughs, beverage targets, Artisan Stagecraft Scripts, Recovery Library access, Premium Advisor synthesis, Advisor Voice, and Doma Reports.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
        <div className="navBar">
          {["dashboard", "onboarding", "occasions", "walkthrough", "simulator", "reports", "matrix"].map((tab) => (
            <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)} type="button">{tabLabel(tab)}</button>
          ))}
        </div>
      </section>

      {active === "dashboard" && <Dashboard checkServer={checkServer} loadClearFastShot={loadClearFastShot} setActive={setActive} profile={profile} occasion={occasion} reports={reports} health={health} />}
      {active === "onboarding" && <Onboarding profile={profile} updateProfile={updateProfile} setActive={setActive} />}
      {active === "occasion" && <OccasionSetup occasion={occasion} updateOccasion={updateOccasion} setActive={setActive} loadClearFastShot={loadClearFastShot} />}
      {active === "occasions" && <OccasionsLibrary founderOccasions={founderOccasions} openFounderOccasion={openFounderOccasion} />}
      {active === "walkthrough" && <OccasionWalkthrough occasionItem={selectedFounderOccasion} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} setActive={setActive} setTranscript={setTranscript} createReport={createReport} />}
      {active === "simulator" && <Simulator {...{ recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, createReport }} />}
      {active === "reports" && <Reports reports={reports} clearReports={clearReports} setActive={setActive} />}
      {active === "matrix" && <Matrix setActive={setActive} setTranscript={setTranscript} updateOccasion={updateOccasion} />}

      <section className="card principleCard">
        <h2>Product Principle</h2>
        <p><strong>The form grounds.</strong> The Doma Profile, Machine Passport, House Formula, and Occasion setup prevent generic answers.</p>
        <p><strong>The artisan voice clarifies.</strong> The live comment adds nuance, emotion, uncertainty, and situational detail.</p>
        <p><strong>The Advisor synthesizes.</strong> The Recovery Matrix grounds the diagnosis; the Premium Advisor preserves the occasion and speaks back with care, confidence, and delight.</p>
      </section>

      <section className="card"><h2>Diagnostic Log</h2><div className="log">{logs.join("\n")}</div></section>
      </div>
    </main>
  );
}

function tabLabel(tab) { return ({ dashboard: "Home", onboarding: "Onboarding", occasions: "15 Occasions", walkthrough: "Stagecraft Walkthrough", occasion: "Occasion Setup", simulator: "Advisor Session", reports: "Doma Reports", matrix: "Recovery Library" })[tab]; }
function tabIcon(tab) { return ({ dashboard: "🏠", onboarding: "☕", occasions: "🎭", walkthrough: "📜", occasion: "🎭", simulator: "🎙️", reports: "📊", matrix: "🛠️" })[tab]; }

function Dashboard({ checkServer, loadClearFastShot, setActive, profile, occasion, reports, health }) {
  return <section className="card"><h2>Founder Dashboard</h2><p className="small">A single front door for the Founder Program experience.</p><div className="tiles"><Tile title="Server" value={health?.hasOpenAIKey ? "Connected" : "Check needed"} /><Tile title="Machine" value={profile.machine || "Not set"} /><Tile title="House Formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} /><Tile title="Current Occasion" value={occasion.occasionName || "Not set"} /><Tile title="Saved Reports" value={String(reports.length)} /></div><div className="buttonRow"><button className="primary" onClick={checkServer}>Check Server / API Key</button><button className="secondary" onClick={() => setActive("onboarding")}>Open Doma Profile</button><button className="secondary" onClick={() => setActive("occasions")}>Open 15 Occasions</button><button className="primary" onClick={loadClearFastShot}>Load Sample Advisor Flow</button><button className="secondary" onClick={() => setActive("simulator")}>Go to Simulator</button></div></section>;
}
function Tile({ title, value }) { return <div className="tile"><p>{title}</p><strong>{value}</strong></div>; }

function Onboarding({ profile, updateProfile, setActive }) {
  return <section className="card"><h2>Doma Profile / Machine Passport</h2><p className="small">This is the structured context that makes the Advisor different from a generic AI answer.</p><div className="grid"><Field label="Founder / artisan name" value={profile.founderName} onChange={(v) => updateProfile("founderName", v)} /><Field label="Role identity" value={profile.roleIdentity} onChange={(v) => updateProfile("roleIdentity", v)} /><Field label="Machine" value={profile.machine} onChange={(v) => updateProfile("machine", v)} /><Field label="Grinder" value={profile.grinder} onChange={(v) => updateProfile("grinder", v)} /><Field label="Beans" value={profile.beans} onChange={(v) => updateProfile("beans", v)} /><Field label="Experience level" value={profile.experienceLevel} onChange={(v) => updateProfile("experienceLevel", v)} /><Field label="House dose" value={profile.houseDose} onChange={(v) => updateProfile("houseDose", v)} /><Field label="House yield" value={profile.houseYield} onChange={(v) => updateProfile("houseYield", v)} /><Field label="House shot time" value={profile.houseShotTime} onChange={(v) => updateProfile("houseShotTime", v)} /><Field label="Preferred drinks" value={profile.preferredDrinks} onChange={(v) => updateProfile("preferredDrinks", v)} /></div><label className="label">Milk style / service preference</label><input value={profile.milkStyle} onChange={(e) => updateProfile("milkStyle", e.target.value)} /><button className="primary" onClick={() => setActive("occasions")}>Continue to 15 Occasions</button></section>;
}


function OccasionsLibrary({ founderOccasions, openFounderOccasion }) {
  return <section className="occasionPage">
    <section className="card heroMini">
      <p className="eyebrow">15 Founder Occasions</p>
      <h2>Fifteen stagecraft occasions, not thirty generic drills.</h2>
      <p className="small">Each Occasion opens into a detailed home coffee stagecraft walkthrough with beverage targets, Advisor guidance, an Artisan Stagecraft Script, recovery access, voice capture, and Doma Report capture.</p>
    </section>
    <div className="occasionGrid">
      {founderOccasions.map((item, index) => <article className="occasionCard" key={item.id}>
        <div className="occasionTop"><span>Occasion {index + 1}</span><em>{item.tag}</em></div>
        <h3>{item.name}</h3>
        <p>{item.purpose}</p>
        <div className="specs"><p><strong>Drink</strong><span>{item.drink}</span></p><p><strong>Dose → Yield</strong><span>{item.dose} → {item.yield}</span></p><p><strong>Time / Ratio</strong><span>{item.time}</span></p><p><strong>Grind / Vessel</strong><span>{item.grindVessel}</span></p></div>
        <div className="scriptPreview"><strong>Artisan opening to guest</strong><p>{item.artisanOpening}</p></div>
        <div className="buttonRow"><button className="primary" onClick={() => openFounderOccasion(item)}>Open Occasion</button><button className="secondary" onClick={() => openFounderOccasion(item)}>Mark Complete</button></div>
      </article>)}
    </div>
  </section>;
}

function OccasionWalkthrough({ occasionItem, currentStepIndex, setCurrentStepIndex, setActive, setTranscript, createReport }) {
  const step = occasionItem.steps[currentStepIndex] || occasionItem.steps[0];
  const progress = Math.round(((currentStepIndex + 1) / occasionItem.steps.length) * 100);
  const scriptText = occasionItem.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.script}`).join("\n");
  return <section className="walkthroughPage">
    <section className="card walkthroughHero">
      <p className="eyebrow">Selected Occasion</p>
      <h2>{occasionItem.name}</h2>
      <p>{occasionItem.purpose}</p>
      <div className="tiles"><Tile title="Drink" value={occasionItem.drink} /><Tile title="Dose → Yield" value={`${occasionItem.dose} → ${occasionItem.yield}`} /><Tile title="Time" value={occasionItem.time} /><Tile title="Desired delight" value={occasionItem.desiredFeeling} /></div>
      <div className="pathTrack"><span style={{ width: `${progress}%` }} /></div><p className="small">Step {currentStepIndex + 1} of {occasionItem.steps.length} · {progress}% complete</p>
    </section>
    <section className="card stageStep">
      <p className="eyebrow">Stagecraft Step {currentStepIndex + 1}</p>
      <h2>{step.title}</h2>
      <div className="twoColumn">
        <div className="noteBox"><h3>Advisor guidance</h3><p>{step.advisor}</p></div>
        <div className="scriptBox"><h3>Artisan Stagecraft Script</h3><p>{step.script}</p></div>
      </div>
      <div className="buttonRow"><button className="secondary" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}>Previous Step</button><button className="primary" onClick={() => setCurrentStepIndex(Math.min(occasionItem.steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex >= occasionItem.steps.length - 1}>Next Step</button><button className="secondary" onClick={() => setActive("matrix")}>Open Recovery Library</button><button className="primary" onClick={() => { setTranscript(`I am working through the ${occasionItem.name}. Current stagecraft step: ${step.title}. Advisor guidance: ${step.advisor}. Artisan script: ${step.script}. Please synthesize this Occasion with my form and any voice note.`); setActive("simulator"); }}>Speak / Ask Advisor</button></div>
    </section>
    <section className="card">
      <h2>Full Occasion Stagecraft Script</h2>
      <p className="small">This is the artisan-facing script to rehearse and follow. It is separate from Advisor guidance.</p>
      <pre className="scriptFull">{scriptText}</pre>
      <div className="buttonRow"><button className="secondary" onClick={() => setActive("occasions")}>Back to 15 Occasions</button><button className="secondary" onClick={() => setActive("matrix")}>What Went Wrong?</button><button className="primary" onClick={createReport}>Create Doma Report</button></div>
    </section>
  </section>;
}

function OccasionSetup({ occasion, updateOccasion, setActive, loadClearFastShot }) {
  return <section className="card"><h2>Occasion Setup</h2><p className="small">The product is not only about the cup. It prepares the barista for the moment.</p><div className="grid"><Field label="Occasion name" value={occasion.occasionName} onChange={(v) => updateOccasion("occasionName", v)} /><Field label="Drink" value={occasion.drink} onChange={(v) => updateOccasion("drink", v)} /><Field label="Who is being served" value={occasion.guest} onChange={(v) => updateOccasion("guest", v)} /><Field label="Time pressure" value={occasion.timePressure} onChange={(v) => updateOccasion("timePressure", v)} /><Field label="Current shot time" value={occasion.currentShotTime} onChange={(v) => updateOccasion("currentShotTime", v)} /><Field label="Recurrence / pattern" value={occasion.recurrence} onChange={(v) => updateOccasion("recurrence", v)} /></div><label className="label">Desired feeling / delight</label><input value={occasion.desiredFeeling} onChange={(e) => updateOccasion("desiredFeeling", e.target.value)} /><label className="label">Moment intent</label><textarea value={occasion.momentIntent} onChange={(e) => updateOccasion("momentIntent", e.target.value)} /><div className="buttonRow"><button className="secondary" onClick={loadClearFastShot}>Load Sample Before-Church Occasion</button><button className="secondary" onClick={() => setActive("matrix")}>Open What Went Wrong Matrix</button><button className="primary" onClick={() => setActive("simulator")}>Begin Occasion Simulation</button></div></section>;
}

function Simulator(props) {
  const { recording, startRecording, stopRecording, audioUrl, transcript, setTranscript, generateAdvisorResponse, respondBusy, synthesis, matrixMatch, advisorText, setAdvisorText, advisorVoice, setAdvisorVoice, generateAdvisorVoice, advisorBusy, advisorAudioUrl, createReport } = props;
  return <><section className="card"><h2>Occasion Simulator</h2><p className="small">Speak what is happening with the cup, machine, room, guest, or occasion. The form grounds; your voice clarifies.</p><button className={recording ? "danger" : "primary"} onClick={recording ? stopRecording : startRecording}>{recording ? "🟢 Stop Recording" : "🎙️ Start Recording"}</button>{audioUrl ? <><h3>Captured Audio Playback</h3><audio controls src={audioUrl} /></> : null}<label className="label">Artisan transcript / comment</label><textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Speak or type what happened." /><button className="primary" onClick={generateAdvisorResponse} disabled={respondBusy}>{respondBusy ? "Generating…" : "Generate Advisor Response"}</button></section><section className="card advisorCard"><h2>Premium Advisor Response</h2>{synthesis ? <SynthesisPanel synthesis={synthesis} /> : <div className="noteBox">Advisor Understanding will appear here.</div>}{matrixMatch ? <div className="successBox"><strong>Likely Matrix Match:</strong> {matrixMatch.label}<br /><strong>Matrix One Next Move:</strong> {matrixMatch.oneNextMove}</div> : <div className="noteBox"><strong>Matrix Match:</strong> None applied yet, or not appropriate for the artisan's intent.</div>}<label className="label">Advisor response</label><textarea value={advisorText} onChange={(e) => setAdvisorText(e.target.value)} /><label className="label">Advisor voice option</label><select value={advisorVoice} onChange={(e) => setAdvisorVoice(e.target.value)}><option value="alloy">Alloy — balanced and clear</option><option value="verse">Verse — expressive and warm</option><option value="sage">Sage — calm and composed</option><option value="coral">Coral — bright and friendly</option><option value="ash">Ash — steady and grounded</option></select><div className="buttonRow"><button className="primary" onClick={generateAdvisorVoice} disabled={advisorBusy || !advisorText}>{advisorBusy ? "Generating…" : "Generate Advisor Voice"}</button><button className="secondary" onClick={createReport} disabled={!advisorText || advisorText === advisorStarterText}>Create Doma Report</button></div>{advisorAudioUrl ? <><h3>Advisor Audio Playback</h3><audio controls autoPlay src={advisorAudioUrl} /></> : null}</section></>;
}

function Reports({ reports, clearReports, setActive }) {
  return <section className="card"><h2>Doma Reports / Refinement Records</h2><p className="small">This is where each Occasion becomes memory: what happened, what the Advisor understood, what was recommended, and what can be refined later.</p>{reports.length === 0 ? <div className="noteBox">No reports yet. Run the Simulator and create a Doma Report.</div> : reports.map((r) => <article className="report" key={r.id}><h3>{r.title}</h3><p className="small">{r.createdAt} • {r.drink} • Served to: {r.guest}</p><p><strong>Artisan said:</strong> {r.transcript || "No transcript captured."}</p><p><strong>Matrix:</strong> {r.matrixMatch?.label || "None"}</p><details><summary>Advisor response</summary><pre>{r.advisorText}</pre></details></article>)}<div className="buttonRow"><button className="primary" onClick={() => setActive("simulator")}>Create New Occasion Report</button><button className="secondary" onClick={clearReports}>Clear Local Reports</button></div></section>;
}

function Matrix({ setActive, setTranscript, updateOccasion }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [readBusy, setReadBusy] = useState(false);
  const [readAudioUrl, setReadAudioUrl] = useState("");
  const categories = ["All", ...Array.from(new Set(recoveryMatrixCatalog.map((item) => item.category)))];
  const filtered = recoveryMatrixCatalog.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesCategory = category === "All" || item.category === category;
    const haystack = `${item.category} ${item.issue} ${item.symptoms} ${item.likelyCause} ${item.advisor} ${item.oneNextMove} ${item.stagecraft} ${item.solutionSteps?.join(" ")}`.toLowerCase();
    return matchesCategory && (!q || haystack.includes(q));
  });
  function useIssue(item) {
    setTranscript(`I selected this What Went Wrong Matrix issue: ${item.issue}. Likely cause: ${item.likelyCause}. Advisor note: ${item.advisor}. Please blend this selected issue with my form and any voice note, then guide me with one next move while preserving the occasion.`);
    updateOccasion("recurrence", item.issue);
    updateOccasion("momentIntent", item.stagecraft);
    setSelectedIssue(null);
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
      <div className="matrixHeader"><div><h1>When the machine speaks, the Advisor helps interpret.</h1><p>This is the searchable What Went Wrong Matrix: a practical recovery knowledge base for real coffee occasions. Search an issue, open the Moment Recovery Engine, read guidance aloud, or send the issue back into the current Advisor Session.</p></div><button className="primary" onClick={() => setActive("occasion")}>Return to Occasion</button></div>
    </div>
    <section className="card recoveryControls"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search: sour, milk, choking, grinder, water, puck…" /><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select><p className="small"><strong>{filtered.length}</strong> issues shown. This library should keep expanding as the Barista Doma knowledge base grows.</p></section>
    <div className="recoveryGrid">{filtered.map((item) => <article className="recoveryCard" key={`${item.category}-${item.issue}`}><h3>{item.issue}</h3><p><strong>Likely cause:</strong> {item.likelyCause}</p><p><strong>Advisor:</strong> {item.advisor}</p><div className="recoveryActions"><button className="primary" onClick={() => setSelectedIssue(item)}>Solution / Fix Steps</button><button className="secondary" onClick={() => readText(recoveryText(item))} disabled={readBusy}>Read recovery</button><button className="secondary" onClick={() => readText(fixText(item))} disabled={readBusy}>Read fix steps</button></div></article>)}</div>
    {readAudioUrl ? <section className="card"><h3>Advisor Read-Aloud Playback</h3><audio controls autoPlay src={readAudioUrl} /></section> : null}
    {selectedIssue ? <div className="modalBackdrop" role="dialog" aria-modal="true"><div className="recoveryModal"><button className="modalClose" onClick={() => setSelectedIssue(null)}>Close</button><p className="eyebrow">Moment Recovery Engine</p><h2>{selectedIssue.issue}</h2><p><strong>Likely cause:</strong> {selectedIssue.likelyCause}</p><p><strong>Advisor:</strong> {selectedIssue.advisor}</p><hr /><h2>Solution steps to follow</h2><ol>{selectedIssue.solutionSteps.map((step, idx) => <li key={idx}>{step}</li>)}</ol><div className="buttonRow"><button className="primary" onClick={() => readText(fixText(selectedIssue))} disabled={readBusy}>{readBusy ? "Reading…" : "Read solution"}</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Use in Advisor Session</button><button className="secondary green" onClick={() => useIssue(selectedIssue)}>Log this in Doma Report</button></div>{readAudioUrl ? <audio controls autoPlay src={readAudioUrl} /> : null}</div></div> : null}
  </section>;
}

function SynthesisPanel({ synthesis }) {
  return <div className="synthesisBox"><h3>Advisor Understanding</h3><p><strong>Form complete:</strong> {String(synthesis.formComplete)}</p>{synthesis.missingFields?.length ? <p><strong>Missing fields:</strong> {synthesis.missingFields.join(", ")}</p> : null}<p><strong>Detected artisan intent:</strong> {synthesis.detectedArtisanIntent}</p><p><strong>Voice quality:</strong> {synthesis.voiceQuality}</p><p><strong>Primary live signal:</strong> {synthesis.primaryLiveSignal}</p><p><strong>Supporting context used:</strong> {synthesis.supportingContextUsed || "None"}</p><p><strong>Matrix applied:</strong> {String(synthesis.matrixApplied)}</p>{synthesis.primaryMatrixSignal ? <p><strong>Primary matrix signal:</strong> {synthesis.primaryMatrixSignal.label}</p> : null}{synthesis.secondaryMatrixSignal ? <p><strong>Secondary matrix signal:</strong> {synthesis.secondaryMatrixSignal.label}</p> : null}</div>;
}
function Field({ label, value, onChange }) { const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <div><label className="label" htmlFor={id}>{label}</label><input id={id} value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
