# Barista Doma v8.3 — Occasion Walkthrough Routing Hard Fix

This patch makes the selected Occasion walkthrough explicit and persistent.

- Uses a dedicated walkthroughOccasionId separate from general Occasion setup.
- Opening an Occasion immediately sets selectedOccasionId and walkthroughOccasionId.
- Removes the previous occasion-name sync behavior that could overwrite the selected walkthrough.
- Adds a visible Active walkthrough confirmation on the walkthrough page.
- Preserves voice, Advisor, Recovery Matrix, Tasting Studio, Doma Reports, charts, print, CSV, Guest Resonance, and Occasion Tempo.
