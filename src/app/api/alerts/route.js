export async function GET() {
  // Mock alerts
  const alerts = [
    {
      title: "High Drought Risk",
      description: "Severe drought expected in next week.",
      severity: "high",
    },
    {
      title: "Moderate Alert",
      description: "Monitor rainfall levels.",
      severity: "medium",
    },
  ];
  return new Response(JSON.stringify(alerts), { status: 200 });
}
