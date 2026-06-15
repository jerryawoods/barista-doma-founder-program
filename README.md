# Barista Doma Home Barista Development Platform v8.9.12

## Natural Language Advisor Intelligence Restoration

This package restores the premium Occasion-aware Advisor behavior inside the active Occasion step.

### Restored / corrected
- Keeps all v8.9.11 voice response capture fixes.
- Preserves 21 total Occasions: 15 Core + 6 Modern Sensory Occasions.
- Preserves dual certification pathways and Development Telemetry.
- Keeps the Advisor inside the current Occasion step.
- After the wake word, the Advisor listens for the artisan response.
- The artisan can speak naturally instead of being limited to a few hard-coded phrases.
- Spoken information is routed visibly into Step Telemetry, Step Notes, Taste Notes, Recovery Notes, Guest Resonance, and Doma Report context.
- The Advisor now attempts the premium natural-language Advisor route using /api/respond with current Occasion, current step, House Formula, puck prep, taste, machine/grinder, and Recovery Matrix context.
- If the AI route is unavailable, the app falls back to local step guidance rather than breaking the flow.
- The In-Step Report Review and Step Capture Ledger show where information was written and what guidance was saved.

### Test flow
1. Dashboard → Occasions → choose an Occasion → Open Occasion → enter a step.
2. Enable Step Advisor.
3. Say: Advisor.
4. After it asks what it can help with, say a natural note such as: "The puck looks uneven and the shot feels a little hollow, but the taste is not bad."
5. Confirm the visible capture ledger updates.
6. Confirm Advisor guidance is more contextual than a narrow keyword response.

Suggested commit message:
Deploy v8.9.12 natural language advisor restoration
