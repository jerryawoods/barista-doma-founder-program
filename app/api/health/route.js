export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    message: "Barista Doma health route is working",
    hasApiKey: Boolean(process.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString()
  });
}
