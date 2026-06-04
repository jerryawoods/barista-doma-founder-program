# Barista Doma Advisor Interaction Diagnostic v5

This diagnostic is separate from the protected v15 Founder Program.

It proves the full premium interaction loop for The Home Barista Occasion Simulator:

1. Structured context fields: machine, house formula, occasion, guest/time pressure, desired delight.
2. Artisan voice capture and transcription.
3. `/api/respond` Premium Advisor response using structured context + starter Recovery Matrix + Advisor rules.
4. `/api/speak` premium Advisor Voice playback.

## Included routes

- `/api/health` — confirms server and OpenAI key
- `/api/transcribe` — audio to transcript
- `/api/respond` — structured-context Advisor response
- `/api/speak` — Advisor response to premium voice audio

## Required Vercel Environment Variable

`OPENAI_API_KEY` must be added to Production.

Optional:

`OPENAI_TEXT_MODEL` can override the Advisor response model. Default is `gpt-4.1-mini`.

## Core principle

The Recovery Matrix knows what can go wrong.
The Premium Advisor synthesizes structured context into refined, occasion-aware guidance.
