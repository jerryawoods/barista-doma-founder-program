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
  const [active, setActive] = useState("dashboard");
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

  function log(message) {
    const stamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${stamp}] ${message}`]);
  }
  function updateProfile(field, value) { setProfile((prev) => ({ ...prev, [field]: value })); }
  function updateOccasion(field, value) { setOccasion((prev) => ({ ...prev, [field]: value })); }

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
        <div className="brandMark"><span>BD</span><div><strong>Barista Doma</strong><small>Founder Program v7.2</small></div></div>
        {["dashboard", "onboarding", "occasion", "simulator", "matrix", "reports"].map((tab) => (
          <button key={tab} className={active === tab ? "sideLink active" : "sideLink"} onClick={() => setActive(tab)} type="button">{tabIcon(tab)} {tabLabel(tab)}</button>
        ))}
        <div className="pathwayBox"><strong>Founder Pathway</strong><p>Cup 0 of 30 completed · 0%</p><div className="pathTrack"><span style={{ width: `${Math.min(100, reports.length * 4)}%` }} /></div><small>Every Occasion can become a Doma Report.</small></div>
      </aside>
      <div className="page">
      <section className="card hero">
        <p className="eyebrow">Barista Doma Founder Program Prototype v7</p>
        <h1>Home Barista Occasion Simulator — Integrated Flow</h1>
        <p>This puts the experience together: onboarding, dashboard, Occasion setup, form + voice synthesis, Premium Advisor, Advisor Voice, and Doma Reports.</p>
        <div className="statusBox"><strong>Status:</strong> {status}</div>
        {error ? <div className="errorBox"><strong>Visible Error:</strong>{"\n"}{error}</div> : null}
        {health ? <div className={health.hasOpenAIKey ? "successBox" : "errorBox"}>Server: {health.ok ? "OK" : "Not OK"} | API Key Present: {String(health.hasOpenAIKey)} | Node: {health.node}</div> : null}
        <div className="navBar">
          {["dashboard", "onboarding", "occasion", "simulator", "reports", "matrix"].map((tab) => (
            <button key={tab} className={active === tab ? "tab active" : "tab"} onClick={() => setActive(tab)} type="button">{tabLabel(tab)}</button>
          ))}
        </div>
      </section>

      {active === "dashboard" && <Dashboard checkServer={checkServer} loadClearFastShot={loadClearFastShot} setActive={setActive} profile={profile} occasion={occasion} reports={reports} health={health} />}
      {active === "onboarding" && <Onboarding profile={profile} updateProfile={updateProfile} setActive={setActive} />}
      {active === "occasion" && <OccasionSetup occasion={occasion} updateOccasion={updateOccasion} setActive={setActive} loadClearFastShot={loadClearFastShot} />}
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

function tabLabel(tab) { return ({ dashboard: "Home", onboarding: "Onboarding", occasion: "Occasion Setup", simulator: "Advisor Session", reports: "Doma Reports", matrix: "Recovery Library" })[tab]; }
function tabIcon(tab) { return ({ dashboard: "🏠", onboarding: "☕", occasion: "🎭", simulator: "🎙️", reports: "📊", matrix: "🛠️" })[tab]; }

function Dashboard({ checkServer, loadClearFastShot, setActive, profile, occasion, reports, health }) {
  return <section className="card"><h2>Founder Dashboard</h2><p className="small">A single front door for the Founder Program experience.</p><div className="tiles"><Tile title="Server" value={health?.hasOpenAIKey ? "Connected" : "Check needed"} /><Tile title="Machine" value={profile.machine || "Not set"} /><Tile title="House Formula" value={`${profile.houseDose || "?"} → ${profile.houseYield || "?"}`} /><Tile title="Current Occasion" value={occasion.occasionName || "Not set"} /><Tile title="Saved Reports" value={String(reports.length)} /></div><div className="buttonRow"><button className="primary" onClick={checkServer}>Check Server / API Key</button><button className="secondary" onClick={() => setActive("onboarding")}>Open Doma Profile</button><button className="secondary" onClick={() => setActive("occasion")}>Set Up Occasion</button><button className="primary" onClick={loadClearFastShot}>Load Sample Full Flow</button><button className="secondary" onClick={() => setActive("simulator")}>Go to Simulator</button></div></section>;
}
function Tile({ title, value }) { return <div className="tile"><p>{title}</p><strong>{value}</strong></div>; }

function Onboarding({ profile, updateProfile, setActive }) {
  return <section className="card"><h2>Doma Profile / Machine Passport</h2><p className="small">This is the structured context that makes the Advisor different from a generic AI answer.</p><div className="grid"><Field label="Founder / artisan name" value={profile.founderName} onChange={(v) => updateProfile("founderName", v)} /><Field label="Role identity" value={profile.roleIdentity} onChange={(v) => updateProfile("roleIdentity", v)} /><Field label="Machine" value={profile.machine} onChange={(v) => updateProfile("machine", v)} /><Field label="Grinder" value={profile.grinder} onChange={(v) => updateProfile("grinder", v)} /><Field label="Beans" value={profile.beans} onChange={(v) => updateProfile("beans", v)} /><Field label="Experience level" value={profile.experienceLevel} onChange={(v) => updateProfile("experienceLevel", v)} /><Field label="House dose" value={profile.houseDose} onChange={(v) => updateProfile("houseDose", v)} /><Field label="House yield" value={profile.houseYield} onChange={(v) => updateProfile("houseYield", v)} /><Field label="House shot time" value={profile.houseShotTime} onChange={(v) => updateProfile("houseShotTime", v)} /><Field label="Preferred drinks" value={profile.preferredDrinks} onChange={(v) => updateProfile("preferredDrinks", v)} /></div><label className="label">Milk style / service preference</label><input value={profile.milkStyle} onChange={(e) => updateProfile("milkStyle", e.target.value)} /><button className="primary" onClick={() => setActive("occasion")}>Continue to Occasion Setup</button></section>;
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
