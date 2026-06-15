# Barista Doma / Home Barista IQ — v8.9.25 ICY Tap-to-Speak Stabilization

Focused fix after diagnostics showed:
- recognition started
- recognition ended
- recognition error: aborted
- restart count > 300
- ICY/Advisor did not respond at all

Root cause:
- Browser Web Speech recognition was stuck in an abort/restart storm.
- Wake mode was starting/stopping too aggressively for Chrome.
- The phrase never reached ICY.

Fix:
- Adds stable Tap to Speak to ICY one-shot capture.
- Tap-to-speak stops the wake recognizer, listens for one phrase, then sends that exact phrase to the same advisement workflow.
- Wake mode is still available but optional.
- Wake mode no longer restarts indefinitely; abort errors stop the loop and direct the artisan to Tap to Speak.
- Adds Tap-to-speak status and diagnostics.

Recommended test:
1. Open any Occasion/step.
2. Click Reset ICY Capture for This Step.
3. Click Tap to Speak to ICY.
4. Say: “it was very bitter.”
5. ICY should process bitter/harsh taste guidance.
6. Click Tap to Speak to ICY again.
7. Say: “it ran fast.”
8. ICY should process fast/thin flow guidance.

This avoids the browser abort loop while preserving the advisement workflow.
