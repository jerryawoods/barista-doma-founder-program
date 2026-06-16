# Barista Doma / Home Barista IQ — v8.9.30 ICY No-Hands Session Engine

Purpose:
- Restore the real product promise: Start ICY once, then speak naturally while hands are busy.
- Typing remains diagnostic/fallback only. The primary market path is no-hands conversation.

Primary flow:
1. Open any Occasion step.
2. Click Start ICY No-Hands Session once.
3. ICY says: “I’m here. I’ll stay with you on this step. Tell me what happens.”
4. ICY opens a recorded-audio listening window.
5. Artisan speaks a natural phrase.
6. App records audio, sends to /api/transcribe, routes transcript into ICY advisement workflow.
7. ICY writes notes/guidance, speaks a response, then reopens listening.
8. Artisan can continue: “I already tried that and it did not work,” “it ran fast,” “no,” etc.
9. Stop ICY No-Hands Session closes the active session while preserving step state.

Technical direction:
- Uses MediaRecorder + /api/transcribe for the primary session loop.
- Avoids fragile Web Speech wake/restart loop as primary experience.
- Keeps Record Audio, Tap to Speak, and Type to ICY as fallback/debug controls.
- Maintains global troubleshooting continuation logic from v8.9.29.
- Build verified.

Test:
1. Start ICY No-Hands Session.
2. Say: “it was very bitter.”
3. Wait for ICY response.
4. When listening reopens, say: “I already tried that and it did not work.”
5. ICY should continue troubleshooting, not close the advisement.
