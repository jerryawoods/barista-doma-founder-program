# Barista Doma Home Barista Development Platform v8.9.10

Advisor listen-loop stabilization patch.

This version keeps the v8.9.9 closed-loop Advisor workflow and corrects the step-aware Advisor behavior so the Advisor prompt is not repeatedly captured as artisan speech.

## Fixes
- The step-aware Advisor now pauses recognition while it speaks.
- After saying “Advisor,” it says the prompt, then resumes listening for the artisan response.
- It ignores likely Advisor echo/playback such as “I’m here,” “what can I help with,” and repeated wake-word loops.
- It throttles repeated wake-word detections so it does not keep saying “I’m here.”
- Stop Step Advisor now also stops voice output and prevents automatic restart.
- Preserves the v8.9.9 closed-loop capture routing, visible ledger, report inclusion, and next-step/repeat-step workflow.
