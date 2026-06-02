# Barista Doma Voice Transcription Test

This is a clean-room hosted voice test for Barista Doma. It does not touch v15.

## What it proves

Tap mic → record audio → send audio to `/api/transcribe` → OpenAI transcribes → transcript fills the field.

## Required Vercel environment variable

Create this environment variable in Vercel:

`OPENAI_API_KEY`

Paste the OpenAI API key there. Do not put it into the code.

## How to deploy

1. Upload this project to GitHub.
2. Import the GitHub repo into Vercel.
3. In Vercel, add environment variable `OPENAI_API_KEY`.
4. Deploy.
5. Open the Vercel HTTPS URL on Android Chrome.
6. Tap Start Recording.
7. Speak.
8. Tap Stop Recording.
9. Confirm transcript appears in the field.

## Notes

This uses `MediaRecorder` in the browser and OpenAI transcription on the server.
The OpenAI API key is never exposed to the browser.
