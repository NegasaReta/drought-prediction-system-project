export async function GET() {
  // Mock chart data
  const charts = [
    {
      title: "Rainfall",
      type: "bar",
      data: {
        labels: ["Jan", "Feb"],
        datasets: [
          {
            label: "mm",
            data: [50, 30],
            backgroundColor: "rgba(75, 192, 192, 0.5)", // fill
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
    },
    {
      title: "Temperature",
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [{ label: "°C", data: [20, 15, 30, 25], borderColor: "red" }],
      },
    },
  ];
  return new Response(JSON.stringify(charts), { status: 200 });
}
