# Barista Doma Home Barista Development Platform v8.9.8

Step Capture + Report Routing refinement.

This package builds on v8.9.7 and clarifies the Occasion-aware Advisor sequence inside the active Occasion step.

## Added in v8.9.8

- Advisor now tells the artisan exactly where spoken information was written.
- New visible **Where this was written** confirmation inside each active step.
- New **Visible Capture Ledger for this Step** showing the transcript, written destinations, fields updated, and report routing.
- Spoken shot specs are routed to Step Telemetry / Shot Pull fields.
- Taste comments are routed to Taste Notes and Doma Report context.
- Problem language such as runny, watery, thin, bitter, sour, choking, or no flow is routed to Recovery / Issue Notes.
- Guest reaction language is routed to Guest Resonance.
- Advisor repeat-back now says whether the capture will be included in the Doma Report and tells the artisan to click Create / View Session Report if they want to review it.
- Added direct buttons from the step Advisor panel to Create / View Session Report, Tasting Studio, and Recovery Notes.
- Preserved all v8.9.7 functionality: 21 Occasions, Occasion-aware Advisor, voice controls, dual certification pathways, Development Telemetry, reports/graphs, Recovery Library, Tasting Studio, Quick Capture, and mobile navigation.

## Suggested commit message

Deploy v8.9.8 step capture report routing
