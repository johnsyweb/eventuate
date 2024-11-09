import Chart from "chart.js/auto";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export function generateStatsOverview() {
  const eventName = document.querySelector("h1")?.textContent;
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

  // Determine the start and end dates
  const startDate = eventHistoryData[0]?.eventDate;
  const endDate = eventHistoryData[eventHistoryData.length - 1]?.eventDate;

  // Create and insert date range picker input fields and update button
  const dateRangeContainer = document.createElement("div");
  dateRangeContainer.id = "dateRangeContainer";
  dateRangeContainer.innerHTML = `
    <input type="text" id="startDate" placeholder="Start Date" value="${startDate}">
    <input type="text" id="endDate" placeholder="End Date" value="${endDate}">
    <button id="updateChart">Update Chart</button>
  `;
  const insertionPoint: HTMLDivElement | null = document.querySelector("h1");
  if (insertionPoint) {
    insertionPoint.insertAdjacentElement("afterend", dateRangeContainer);
  }

  // Initialize flatpickr for the date range picker inputs
  flatpickr("#startDate", {
    dateFormat: "Y-m-d",
    defaultDate: startDate,
  });

  flatpickr("#endDate", {
    dateFormat: "Y-m-d",
    defaultDate: endDate,
  });

  let ctx: HTMLCanvasElement | null =
    document.querySelector(".eventHistoryChart");
  if (!ctx) {
    ctx = document.createElement("canvas");
    ctx.id = "eventHistoryChart";
    if (insertionPoint) {
      insertionPoint.insertAdjacentElement("afterend", ctx);
    }
  }

  const chart = new Chart(ctx, {
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
      scales: {
        finishers: {
          beginAtZero: true,
        },
        volunteers: {
          position: "right",
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "right",
        },
        title: {
          display: true,
          text: `${eventName}`,
        },
      },
    },
  });

  document.getElementById("updateChart")?.addEventListener("click", () => {
    const startDate = (document.getElementById("startDate") as HTMLInputElement).value;
    const endDate = (document.getElementById("endDate") as HTMLInputElement).value;

    const filteredData = eventHistoryData.filter((d) => {
      return (!startDate || d.eventDate >= startDate) && (!endDate || d.eventDate <= endDate);
    });

    chart.data.labels = filteredData.map((d) => d.eventDate);
    chart.data.datasets[0].data = filteredData.map((d) => d.finishers);
    chart.data.datasets[1].data = filteredData.map((d) => d.volunteers);
    chart.update();
  });
}
