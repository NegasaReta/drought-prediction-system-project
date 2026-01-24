export async function GET() {
  // Mock prediction logic (replace with real ML model)
  const predictions = [
    { location: "Gode,somali", risk: Math.random() * 100, date: new Date() },
    // More mocks
  ];
  return new Response(JSON.stringify(predictions), { status: 200 });
}
