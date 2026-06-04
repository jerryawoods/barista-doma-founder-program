# Barista Doma — Home Barista Occasion Simulator v6

This is a one-piece prototype that gathers the proven working components into one deployable app.

## What is included

- Server/API key health check
- Structured context fields for Doma Profile / House Formula / Occasion context
- Mobile and laptop voice capture
- Voice-to-field transcription using `/api/transcribe`
- Starter Recovery Matrix knowledge base
- Multi-signal matrix detection through `/api/respond`
- Premium Advisor response that synthesizes from structured context
- Advisor Voice generation through `/api/speak`
- Diagnostic log for deployment and testing

## Product principle being tested

The Recovery Matrix knows what can go wrong.

The Premium Advisor synthesizes structured context into refined, occasion-aware guidance.

The Home Barista Occasion Simulator brings those together so the artisan can speak the occasion in and let the Advisor speak back with recovery, confidence, hospitality, and delight.

## Notes

This is still a prototype. It does not modify the protected v15 Founder Program. It is intended to let us step back and see the working pieces in one place before careful integration.

Required Vercel environment variable:

`OPENAI_API_KEY`
