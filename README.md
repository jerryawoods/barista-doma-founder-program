# Barista Doma Home Barista Occasion Simulator — v6.1

This is a one-piece diagnostic prototype for the core Barista Doma interaction loop.

## Product principle

The form grounds. The artisan voice clarifies. The Advisor synthesizes.

## What v6.1 proves

- Structured form context is required for premium guidance.
- Artisan voice is blended with the form rather than ignored or over-prioritized.
- Incomplete forms trigger a completion request instead of a guess.
- System-test comments are treated as system tests, not forced coffee diagnoses.
- Thin or unclear voice notes trigger a clarifying response.
- The Recovery Matrix is applied only when the form + voice indicate an actual recovery or occasion signal.
- Advisor response can be spoken back with premium generated voice.

## Routes

- `/api/health`
- `/api/transcribe`
- `/api/respond`
- `/api/speak`

## Required environment variable

`OPENAI_API_KEY` must be set in Vercel Production.
