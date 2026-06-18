# Barista Doma / Home Barista IQ — v8.9.32 Controlled ICY Session Context Guard

Baseline:
- Built from v8.9.30 / commit 5656289 baseline, where the full Occasion catalog was restored.
- v8.9.31 is rejected and should not be used.

Purpose:
- Stabilize ICY step context without changing Occasion catalog or product surface.
- Keep v8.9.30 no-hands session engine intact.
- Add a controlled guard so non-technical steps stay anchored unless the artisan clearly raises a technical issue.

Protected baseline checks:
- Occasion ID markers remain 21.
- The Quiet Table remains present.
- Core Occasions markers remain present.
- Start ICY No-Hands Session remains present.
- Global troubleshooting continuation remains present.

What changed:
- Inside existing ICY local guidance logic only:
  - Step 1 / intention-like steps stay focused on purpose, desired feeling, who the moment is for, and Occasion intention.
  - Preparation steps stay focused on readiness.
  - Taste steps stay focused on palate/preference/guest resonance.
  - ICY only moves into machine/shot troubleshooting when the artisan clearly says a technical issue such as bitter, sour, fast, grind, dose, puck, milk, etc.

Gate 1 test:
1. Open The Quiet Table.
2. Go to Step 1: Set the Occasion intention.
3. Start ICY No-Hands Session.
4. Say: “I want this to feel soft and steady.”
Expected:
- ICY stays on Occasion intention.
- ICY does not ask for machine, grinder, dose, yield, puck, milk, or shot time.

Gate 2 test after Gate 1 passes:
1. Same step/session.
2. Say: “The shot was very bitter.”
Expected:
- ICY may allow technical recovery because you raised a clear technical issue, while still naming the active step.
