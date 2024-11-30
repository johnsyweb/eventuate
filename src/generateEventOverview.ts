import { deleteParagraph, upsertParagraph } from "./dom/upsertParagraph";
import { ResultsPageExtractor } from "./extractors/ResultsPageExtractor";
import { MilestonePresenter } from "./presenters/MilestonePresenter";
import { pluralize, sortAndConjoin } from "./stringFunctions";
import { fiveKFinishersToMilestones } from "./transformers/fiveKFinishersToMilestones";
import {
  fiveKVolunteersToMilestones,
} from "./transformers/fiveKVolunteersToMilestones";
import { twoKFinishersToMilestones } from "./transformers/twoKFinishersToMilestone";
import { twoKVolunteersToMilestones } from "./transformers/twoKVolunteersToMilestones";
import { VolunteerWithCount } from "./types/Volunteer";
import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
  message?: string
): void {
  const introduction = `On parkrunday, ${rpe.finishers.length} parkrunners joined us for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course`;

  const newestParkrunnersTitle = `Kudos to our ${pluralize(
    "newest parkrunner",
    "newest parkrunners",
    rpe.newestParkrunners.length
  )}: `;

  const firstTimersTitle = `Welcome to the ${pluralize(
    "parkrunner",
    "parkrunners",
    rpe.firstTimers.length
  )} who joined us at ${rpe.eventName ?? "parkrun"} for the first time: `;

  const finishersWithNewPBsTitle = `Very well done to the ${pluralize(
    "parkrunner",
    "parkrunners",
    rpe.finishersWithNewPBs.length
  )} who improved their personal best this week: `;

  const runningWalkingGroupsTitle = `We were pleased to see ${pluralize(
    "at least one active group",
    "walking and running groups",
    rpe.runningWalkingGroups.length
  )} represented at this event: `;

  const volunteerOccasions = volunteerWithCountList
    .map((v) => v.vols)
    .reduce((c, p) => c + p, 0);

  const volunteersTitle = `The following ${volunteerWithCountList.length.toLocaleString()} superstars have volunteered a total of ${volunteerOccasions.toLocaleString()} times between them, and helped us host ${rpe.eventName} this weekend. Our deep thanks to:  `;

  const finisherMilestoneCelebrations =
    rpe.courseLength == 2
      ? [
          ...twoKVolunteersToMilestones(volunteerWithCountList),
          ...twoKFinishersToMilestones(rpe.finishers),
        ]
      : fiveKFinishersToMilestones(rpe.finishers);
  const milestoneCelebrations = [
    ...fiveKVolunteersToMilestones(volunteerWithCountList),
    ...finisherMilestoneCelebrations,
  ];
  const milestonePresenter = new MilestonePresenter(milestoneCelebrations);

  const facts =
    `Since ${rpe.eventName} started ` +
    `${rpe.facts?.finishers?.toLocaleString()} brilliant parkrunners have had their barcodes scanned, ` +
    `and a grand total of ${rpe.facts.finishes.toLocaleString()} finishers ` +
    `have covered a total distance of ${(
      rpe.facts.finishes * rpe.courseLength
    ).toLocaleString()}km, ` +
    `while celebrating ${rpe.facts.pbs.toLocaleString()} personal bests. ` +
    `We shall always be grateful to each of our ${rpe.facts.volunteers.toLocaleString()} wonderful volunteers for their contributions`;

  const eventuateDiv: HTMLDivElement =
    (document.getElementById("eventuate") as HTMLDivElement) ||
    document.createElement("div");
  eventuateDiv.id = "eventuate";

  const ageGroupChart = (document.getElementById("ageGroupChart") ??
    document.createElement("canvas")) as HTMLCanvasElement;
    ageGroupChart.id = "ageGroupChart";

  const finishTimesChart = (document.getElementById("finishTimesChart") ??
    document.createElement("canvas")) as HTMLCanvasElement;
  finishTimesChart.id = "finishTimesChart";

  const reportDetails = {
    message: { title: "⏳︎", details: message },
    introduction: { title: "", details: introduction },

    milestoneCelebrations: {
      title: milestonePresenter.title(),
      details: milestonePresenter.details(),
    },
    newestParkrunners: {
      title: newestParkrunnersTitle,
      details: sortAndConjoin(rpe.newestParkrunners),
    },
    firstTimers: {
      title: firstTimersTitle,
      details: sortAndConjoin(rpe.firstTimers),
    },
    newPBs: {
      title: finishersWithNewPBsTitle,
      details: sortAndConjoin(rpe.finishersWithNewPBs),
    },
    groups: {
      title: runningWalkingGroupsTitle,
      details: sortAndConjoin(rpe.runningWalkingGroups),
    },
    volunteers: {
      title: volunteersTitle,
      details: sortAndConjoin(volunteerWithCountList.map((v) => v.name)),
    },
    unknowns: {
      title: "",
      details:
        rpe.unknowns.length > 0
          ? `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded`
          : undefined,
    },
    facts: {
      title: "",
      details: facts,
    },
  };

  const insertionPoint: HTMLDivElement | null =
    document.querySelector(".Results-header");
  if (insertionPoint) {
    insertionPoint.insertAdjacentElement("afterend", finishTimesChart);
    insertionPoint.insertAdjacentElement("afterend", eventuateDiv);

    for (const [section, content] of Object.entries(reportDetails)) {
      if (content.details) {
        const paragraphText = `${content.title} ${content.details}.`;
        upsertParagraph(eventuateDiv, section, paragraphText);
      } else {
        deleteParagraph(eventuateDiv, section);
      }
    }
  }
}
export function generateEventOverview() {
  const rpe = new ResultsPageExtractor(document);

  const volunteerWithCountList = rpe
    .volunteersList()
    .map((vol) => new VolunteerWithCount(vol));
  const waitingOn = volunteerWithCountList
    .map((v) => v.promisedVols)
    .filter((v) => !!v);
  const loadingMessage = `Loading volunteer data for ${waitingOn.length} parkrunners. Please wait`;

  populate(rpe, volunteerWithCountList, loadingMessage);

  Promise.all(waitingOn).then(() => {
    populate(rpe, volunteerWithCountList);
    createFinishTimesChart(rpe.getFinishTimes(), rpe.eventName ?? "WAT", rpe.eventNumber ?? "WEN");
    createAgeGroupChart(rpe.getFinishTimes(), rpe.eventName ?? "WAT", rpe.eventNumber ?? "WEN");
  });
}

function createFinishTimesChart(
  finishTimes: { finishTime: number; vols: number; ageGroup: string }[],
  eventName: string,
  eventNumber: string
) {
  const ctx = document.getElementById("finishTimesChart") as HTMLCanvasElement;
  const finishTimesDistribution = getFinishTimesDistribution(finishTimes);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: finishTimesDistribution.labels,
      datasets: finishTimesDistribution.datasets,
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Finish Time Ranges (minutes)",
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Percentage of Finishers",
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "right",
        },
        datalabels: {
          display: 'auto',
          color: 'black',
          anchor: 'center',
          align: 'center',
          formatter: (value) => {
            return value > 0 ? value.toFixed(1) + '%' : '';
          }
        },
        title: {
          display: true,
          text: `Distribution of Finish Times at ${eventName} ${eventNumber} by Volunteer Milestone Clubs as a percentage.`
        }
      },
    },
  });
}

const VolunteerGroups: Record<string, { text: string; colour: string }> = {
  0: { text: "yet to have a go", colour: "grey" },
  1: { text: "on the way to the v25 club", colour: "white" },
  25: { text: "member of the v25 club", colour: "purple" },
  50: { text: "member of the v50 club", colour: "red" },
  100: { text: "member of the v100 club", colour: "black" },
  250: { text: "member of the v250 club", colour: "green" },
  500: { text: "member of the v500 club", colour: "blue" },
  1000: { text: "member of the v1000 club", colour: "yellow" },
};

const AgeGroups: Record<string, { text: string; colour: string }> = {
  "JM10": { text: "Junior Male 10", colour: "lightblue" },
  "JW10": { text: "Junior Female 10", colour: "pink" },
  "JM11-14": { text: "Junior Male 11-14", colour: "blue" },
  "JW11-14": { text: "Junior Female 11-14", colour: "lightpink" },
  "JM15-17": { text: "Junior Male 15-17", colour: "darkblue" },
  "JW15-17": { text: "Junior Female 15-17", colour: "darkpink" },
  "SM18-19": { text: "Senior Male 18-19", colour: "lightgreen" },
  "SW18-19": { text: "Senior Female 18-19", colour: "lightyellow" },
  "SM20-24": { text: "Senior Male 20-24", colour: "green" },
  "SW20-24": { text: "Senior Female 20-24", colour: "yellow" },
  "SM25-29": { text: "Senior Male 25-29", colour: "darkgreen" },
  "SW25-29": { text: "Senior Female 25-29", colour: "darkyellow" },
  "SM30-34": { text: "Senior Male 30-34", colour: "lightorange" },
  "SW30-34": { text: "Senior Female 30-34", colour: "lightred" },
  "SM35-39": { text: "Senior Male 35-39", colour: "orange" },
  "SW35-39": { text: "Senior Female 35-39", colour: "red" },
  "SM40-44": { text: "Senior Male 40-44", colour: "darkorange" },
  "SW40-44": { text: "Senior Female 40-44", colour: "darkred" },
  "SM45-49": { text: "Senior Male 45-49", colour: "brown" },
  "SW45-49": { text: "Senior Female 45-49", colour: "darkbrown" },
  "SM50-54": { text: "Senior Male 50-54", colour: "purple" },
  "SW50-54": { text: "Senior Female 50-54", colour: "lightpurple" },
  "SM55-59": { text: "Senior Male 55-59", colour: "darkpurple" },
  "SW55-59": { text: "Senior Female 55-59", colour: "darkpink" },
  "SM60-64": { text: "Senior Male 60-64", colour: "grey" },
  "SW60-64": { text: "Senior Female 60-64", colour: "lightgrey" },
  "SM65-69": { text: "Senior Male 65-69", colour: "black" },
  "SW65-69": { text: "Senior Female 65-69", colour: "darkgrey" },
  "SM70-74": { text: "Senior Male 70-74", colour: "darkblue" },
  "SW70-74": { text: "Senior Female 70-74", colour: "darkpink" },
  "SM75-79": { text: "Senior Male 75-79", colour: "darkgreen" },
  "SW75-79": { text: "Senior Female 75-79", colour: "darkyellow" },
  "SM80+": { text: "Senior Male 80+", colour: "darkbrown" },
  "SW80+": { text: "Senior Female 80+", colour: "darkred" },
};

function getFinishTimesDistribution(
  finishTimes: { finishTime: number; vols: number; ageGroup: string }[]
) {
  const distribution: Record<string, Record<string, number>> = {};

  finishTimes.forEach(({ finishTime, ageGroup }) => {
    const timeRange = `${Math.floor(finishTime / 5) * 5}-${Math.floor(finishTime / 5) * 5 + 4}`;
    const ageGroupRange = ageGroup;

    if (!distribution[timeRange]) {
      distribution[timeRange] = {};
    }
    distribution[timeRange][ageGroupRange] = (distribution[timeRange][ageGroupRange] || 0) + 1;
  });

  const labels = Object.keys(distribution).sort((a, b) => parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]));
  const ageGroupRanges = Object.keys(AgeGroups);
  const datasets = ageGroupRanges.map(ageGroupRange => {
    const data = labels.map(label => distribution[label][ageGroupRange] || 0);
    return {
      label: AgeGroups[ageGroupRange].text,
      data,
      backgroundColor: AgeGroups[ageGroupRange].colour,
    };
  });

  // Normalize the data to percentages
  labels.forEach((label, index) => {
    const total = datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
    datasets.forEach(dataset => {
      dataset.data[index] = total ? (dataset.data[index] / total) * 100 : 0;
    });
  });

  return { labels, datasets };
}

function getMilestoneClub(vols: number): string {
  const milestones = Object.keys(VolunteerGroups)
    .map(Number)
    .sort((a, b) => b - a);
  for (const milestone of milestones) {
    if (vols >= milestone) {
      return milestone.toString();
    }
  }
  return "0";
}

function createAgeGroupChart(
  finishTimes: { finishTime: number; vols: number; ageGroup: string }[],
  eventName: string,
  eventNumber: string
) {
  const ctx = document.getElementById("ageGroupChart") as HTMLCanvasElement;
  const ageGroupDistribution = getFinishTimesDistribution(finishTimes);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ageGroupDistribution.labels,
      datasets: ageGroupDistribution.datasets,
    },
    options: {
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Finish Time Ranges (minutes)",
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Percentage of Finishers",
          },
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "right",
        },
        datalabels: {
          display: 'auto',
          color: 'black',
          anchor: 'center',
          align: 'center',
          formatter: (value, context) => {
            return value > 0 ? value.toFixed(1) + '%' : '';
          }
        },
        title: {
          display: true,
          text: `Distribution of Finish Times at ${eventName} ${eventNumber} by Age Group`
        }
      },
    },
  });
}
