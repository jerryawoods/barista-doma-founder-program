export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    message: "Barista Doma health route is working",
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    node: process.version,
    timestamp: new Date().toISOString()
  });
}
