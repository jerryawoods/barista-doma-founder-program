# Barista Doma / Home Barista IQ — v8.9.26 ICY Recorded Audio Transcription Path

Focused fix after Web Speech recognition failed completely:
- Tap-to-speak started and stopped with no final transcript.
- Wake mode had already shown abort/restart storm.
- Browser recognition is unreliable on the user device.

Fix:
- Adds Record Audio to ICY / Stop + Send to ICY.
- Uses MediaRecorder to capture actual audio.
- Sends the audio blob to existing /api/transcribe.
- Sends returned transcript into the same current-issue advisement workflow.
- Stops wake/tap recognizers while recording so they cannot interfere.
- Keeps Tap to Speak and Type to ICY as fallback paths.

Recommended test:
1. Open any Occasion/step.
2. Click Reset ICY Capture for This Step.
3. Click Record Audio to ICY.
4. Say: “it was very bitter.”
5. Click Stop + Send to ICY.
6. Confirm the Recorded-audio status shows a transcript.
7. Confirm ICY gives bitter/harsh taste guidance.
