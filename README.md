# Barista Doma Voice Advisor Diagnostic v4

This diagnostic keeps the working voice-to-field transcription path and adds a premium Advisor Voice test.

It is separate from the protected v15 Founder Program.

## Includes

- `/api/health` — confirms the server and OpenAI key
- `/api/transcribe` — phone/laptop audio to transcript field
- `/api/speak` — Advisor text to premium MP3 voice
- Mobile-friendly diagnostic page

## Required Vercel Environment Variable

`OPENAI_API_KEY` must be added to Production.
