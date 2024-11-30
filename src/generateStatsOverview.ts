import { Chart, LinearScale, LineElement, LineController, CategoryScale, PointElement, Legend, Tooltip, Title } from "chart.js/auto";

export function generateStatsOverview() {
  const eventHistoryData = Array.from(
    document.querySelectorAll(".Results-table-row")
  )
    .reverse()
    .map((row) => {
      const element: HTMLTableRowElement = row as HTMLTableRowElement;
      return {
        eventDate: `${element.dataset.date}`,
        finishers: Number(element.dataset.finishers),
        volunteers: Number(element.dataset.volunteers),
      };
    });

    let title = document.querySelector("h1")?.textContent;
    if (!title) {
      title = "Event History";
    }

  let ctx: HTMLCanvasElement | null = document.querySelector(".eventHistoryChart");
  if (!ctx) {
    ctx = document.createElement("canvas");
    ctx.id = "eventHistoryChart";
    const insertionPoint: HTMLDivElement | null = document.querySelector("h1");
    if (insertionPoint) {
      insertionPoint.insertAdjacentElement("afterend", ctx);
    }
  }

  Chart.register(
    LinearScale,
    LineElement,
    LineController,
    CategoryScale,
    PointElement,
    Legend,
    Tooltip,
    Title
  );

  new Chart(ctx, {
    type: "line",
    data: {
      labels: eventHistoryData.map((d) => d.eventDate),
      datasets: [
        {
          label: "Finishers",
          data: eventHistoryData.map((d) => d.finishers),
          borderWidth: 1,
          borderColor: "rgba(255, 99, 132, 1)",
          yAxisID: "finishers",
        },
        {
          label: "Volunteers",
          data: eventHistoryData.map((d) => d.volunteers),
          borderWidth: 1,
          borderColor: "rgba(54, 162, 235, 1)",
          yAxisID: "volunteers",
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: "right",
      },
      scales: {
        finishers: {
          beginAtZero: true,
        },
        volunteers: {
          position: "right",
          beginAtZero: true,
        },
        
      },
    },
  });
}
