# Barista Doma Home Barista Development Platform v8.9.4

Focused stabilization patch after v8.9.3.

## Fixes included

- Keeps all v8.9.1 Development Telemetry foundation.
- Keeps the 21 total Occasions: 15 Core plus 6 Modern Sensory Occasions.
- Keeps dual certification pathways:
  - Barista Doma Certified Occasion Practitioner
  - Barista Doma Certified Modern Sensory Occasion Practitioner
- Adds interaction to the Certification page:
  - How certification is completed section
  - Open Occasion buttons
  - Record Completion Evidence buttons for founder prototype testing
  - Progress bars, patch boards, and certificate unlock behavior now visibly respond to completion evidence
- Restores visible Advisor photo/video upload access without setup gate hiding the upload panel.
- Restores voice-to-field behavior from Advisor transcript:
  - captured transcript can populate dose, yield, shot time, grind, preference, serve-again, tasting note, and Guest Resonance
  - adds Apply Voice Note to Form Fields button
- Speeds up read-aloud by using browser-native speech synthesis for immediate response:
  - Advisor voice
  - Step read-aloud
  - Full Occasion script read-aloud
  - Recovery read-aloud
- Preserves /api/speak, /api/transcribe, and /api/respond routes for future server voice/AI paths.

## Suggested commit message

Deploy v8.9.4 certification voice upload fixes


## v8.9.7 — Occasion-Aware Advisor Real-Time Guidance

- Adds step-aware Advisor inside the 21-Occasion walkthrough engine.
- Artisan can enable the Advisor on any Occasion step and say “Advisor.”
- Advisor replies in the context of the active Occasion and current step.
- Spoken shot specs, taste notes, Guest Resonance, and recovery comments are immediately placed into visible fields/notes and telemetry.
- Adds Something is wrong path from the step panel to Recovery Matrix.
- Adds fast browser voice with pause, resume, stop, and text-only toggle for step Advisor guidance.
- Preserves v8.9.1 telemetry, 21 Occasions, dual certification pathways, Quick Capture, reports, graphs, upload, and existing Advisor pages.
