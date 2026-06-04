# Barista Doma Voice Diagnostic v3

This is a narrow diagnostic build. It does not modify the protected v15 Founder Program.

## Purpose

Prove the hosted voice path:

Record audio on Android Chrome -> send to `/api/transcribe` -> call OpenAI transcription -> return text -> fill field.

## New in v3

- Adds `/api/health` to confirm the server is running and whether `OPENAI_API_KEY` is visible to Vercel Production.
- Removes the OpenAI SDK dependency and uses direct `fetch` to the OpenAI transcription endpoint.
- Pins Next/React versions and requests Node 20.x via `package.json` engines.
- Shows visible errors on the page instead of silently hanging.
- Logs audio name/type/size on the server.
