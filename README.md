# Barista Doma / Home Barista IQ — v8.9.24 ICY Current-Issue Isolation

Focused corrective patch after user reported:
- Artisan said a new issue such as “it loaded fast.”
- ICY still responded with prior/stale “messy puck” context.

Root problem:
- Current spoken/typed issue and prior guidance state could bleed together.
- Spoken advisement classifier was using guidance text in addition to the current artisan phrase.
- API guidance could reintroduce stale/prior issue language.

Fixes:
- Spoken advisement classification now uses ONLY the current artisan phrase.
- Type-to-ICY starts a fresh advisement issue every time.
- Direct non-wake phrases can be treated as a fresh issue instead of discarded.
- Added Reset ICY Capture for This Step.
- Live step guidance now uses local current-issue Machine Passport + step advisement as authoritative response, avoiding stale API context while stabilizing.
- Prior pending decision/review/outcome state is cleared when a fresh issue begins, without leaving the Occasion step.

Test:
1. Open any Occasion/step.
2. Click Reset ICY Capture for This Step.
3. Type or say: “it was very bitter.”
4. ICY must respond about bitter/harsh taste, not messy puck.
5. Reset again.
6. Type or say: “it loaded fast” / “it ran fast.”
7. ICY must respond about fast/thin flow, not messy puck.
