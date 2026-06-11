# Barista Doma Home Barista Development Platform v8.9.3

This patch builds on v8.9.1 telemetry foundation and the v8.9.2 certification work, then corrects the certification model to show two distinct certificate pathways.

## Preserved from v8.9.1
- Home as preparation hub
- Dashboard as operating hub
- Pull Some Shots / Quick Capture
- Preference-first taste logging
- Voice-to-field parsing
- Mobile navigation cleanup
- Development Telemetry groups
- Reports with graphs
- Advisor/session/report flow
- Recovery Library
- Tasting Studio
- Dial-In Journal

## Preserved from v8.9.2
- Certification navigation
- Certification Progress page
- Certification Progress Report card in Doma Reports
- Occasion Patch Board / earned patches
- Certificate preview with certificate ID
- 21 total Occasions preserved
- 6 Modern Sensory Occasions preserved without using Gen Z language in the app
- Completion telemetry for reports and completed Occasions

## Added / corrected in v8.9.3
- Two visible certification tracks instead of one:
  1. Barista Doma Certified Occasion Practitioner — 15 Core Occasions
  2. Barista Doma Certified Modern Sensory Occasion Practitioner — 6 Modern Sensory Occasions
- Separate progress bars for both certification tracks
- Separate patch boards for Core and Modern Sensory Occasions
- Separate certificate previews and certificate IDs:
  - BD-COP for Core Occasion Practitioner
  - BD-MSO for Modern Sensory Occasion Practitioner
- Dashboard and report certification summaries now show Core progress, Modern Sensory progress, and total 21-Occasion library progress

## Build check
Compiled successfully and generated the static pages. The local environment timed out only during the familiar final trace collection step after the meaningful build completed.

## Commit message
Deploy v8.9.3 dual certification pathways
