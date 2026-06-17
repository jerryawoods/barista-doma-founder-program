# Barista Doma / Home Barista IQ — v8.9.31 ICY Step-Context No-Hands Guard

Purpose:
- Keep ICY anchored to the active Occasion step during no-hands sessions.
- Fix drift where ICY hears the artisan but asks questions unrelated to the current step.

What changed:
- Added step advisement mode detection:
  - occasion-intention
  - stagecraft
  - preparation
  - taste
  - technical
  - step-context
- Added step-context lock:
  - For non-technical steps, ICY stays with the current step unless the artisan clearly raises a technical issue.
- Step 1 “Set the Occasion intention” now keeps ICY focused on:
  - purpose of the cup/moment
  - desired feeling
  - who is receiving the moment
  - human-centered guidance
- Machine/troubleshooting questions are suppressed during intention/stagecraft/preparation steps unless the artisan clearly says something technical like bitter, sour, fast shot, grind, dose, puck, milk, etc.
- Keeps v8.9.30 no-hands session engine.
- Keeps v8.9.29 global troubleshooting continuation.

Test:
1. Open The Quiet Table or any Occasion.
2. Go to Step 1: Set the Occasion intention.
3. Start ICY No-Hands Session.
4. Say: “I want this to feel soft and steady.”
5. Expected: ICY stays with intention/feeling/purpose and does not ask dose, yield, grind, puck, milk, etc.
6. Then say a clearly technical issue, e.g. “The shot was very bitter.”
7. Expected: ICY may move into technical recovery while still naming the active step.
