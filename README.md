# Barista Doma / Home Barista IQ — v8.9.27 ICY Transcript Confirmation Gate

Purpose:
- Stop ICY from running ahead after recorded-audio transcription.
- Let the artisan verify what ICY heard before advisement begins.

New recorded-audio flow:
1. Record Audio to ICY.
2. Stop + Transcribe.
3. App shows the transcript ICY heard.
4. Artisan can:
   - Use This Transcript
   - Edit the transcript first
   - Re-record
   - Cancel
5. Only after confirmation does the transcript enter the advisement workflow.

Why:
- v8.9.26 proved recorded audio can move in the right direction, but ICY could advise/write too quickly.
- This patch adds transaction control so ICY does not act on an unconfirmed or misheard transcript.

Recommended test:
1. Open any Occasion/step.
2. Reset ICY Capture for This Step.
3. Record Audio to ICY.
4. Say: “it was very bitter.”
5. Stop + Transcribe.
6. Confirm the transcript shown is correct.
7. Click Use This Transcript.
8. ICY should process bitter/harsh guidance.
