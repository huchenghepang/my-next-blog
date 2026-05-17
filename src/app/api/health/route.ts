export async function GET() {
  return Response.json({
    status: "ok",
    message: "Application is running",
    timestamp: new Date().toISOString(),
  });
}
