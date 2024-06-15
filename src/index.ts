import { ResultsPageExtractor } from "./extractors/ResultsPageExtractor";
import { MilestonePresenter } from "./presenters/MilestonePresenter";
import { conjoin, pluralize, sortAndConjoin } from "./stringFunctions";
import { fiveKFinishersToMilestones } from "./transformers/fiveKFinishersToMilestones";

function upsertParagraph(div: HTMLElement, id: string, content: string) {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id,
  );

  if (existingParagraph) {
    existingParagraph.remove();
  }

  const paragraph = document.createElement("p");
  paragraph.id = id;
  paragraph.innerText = content;
  div.appendChild(paragraph);
}

const rpe = new ResultsPageExtractor(document);

const milestoneCelebrations = fiveKFinishersToMilestones(rpe.finishers);
const milestonePresenter = new MilestonePresenter(milestoneCelebrations);

const formattedEventDate = new Date(
  Date.parse(rpe.eventDate ?? "today"),
).toLocaleDateString(undefined, { dateStyle: "full" });

const introduction = `${rpe.finishers.length} parkrunners joined us on ${formattedEventDate} for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course.`;

const newestParkrunnersTitle = `Congratulations to our ${pluralize(
  "newest parkrunner",
  "newest parkrunners",
  rpe.newestParkrunners.length,
)}: `;

const firstTimersTitle = `Welcome to the ${pluralize(
  "parkrunner",
  "parkrunners",
  rpe.firstTimers.length,
)} who joined us at ${rpe.eventName ?? "parkrun"} for the first time: `;

const finishersWithNewPBsTitle = `Very well done to the ${pluralize(
  "parkrunner",
  "parkrunners",
  rpe.finishersWithNewPBs.length,
)} who improved their personal best this week: `;

const runningWalkingGroupsTitle = `We were pleased to see ${pluralize(
  "active group",
  "walking and running groups",
  rpe.runningWalkingGroups.length,
)} represented at this event: `;

const volunteersTitle = `${rpe.eventName} are very grateful to the ${rpe.volunteersList.length} amazing volunteers who made this event happen: `;

const reportDetails = {
  milestoneCelebrations: {
    title: milestonePresenter.title(),
    details: milestonePresenter.details(),
  },
  newestParkrunners: {
    title: newestParkrunnersTitle,
    details: conjoin(rpe.newestParkrunners),
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
    details: sortAndConjoin(rpe.volunteersList.map((v) => v.name)),
  },
};

const eventuateDiv: HTMLElement =
  document.getElementById("eventuate") || document.createElement("div");
eventuateDiv.id = "eventuate";

const insertionPoint: HTMLDivElement | null =
  document.querySelector(".Results-header");
if (insertionPoint) {
  insertionPoint.insertAdjacentElement("afterend", eventuateDiv);

  upsertParagraph(eventuateDiv, "introduction", introduction);

  for (const [section, content] of Object.entries(reportDetails)) {
    if (content.details) {
      const paragraphText = `${content.title} ${content.details}.`;
      upsertParagraph(eventuateDiv, section, paragraphText);
    }
  }

  if (rpe.unknowns.length > 0) {
    upsertParagraph(
      eventuateDiv,
      "unknowns",
      `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded.`,
    );
  }

  upsertParagraph(
    eventuateDiv,
    "facts",
    `Since ${rpe.eventName} started ` +
      `${rpe.facts?.finishers?.toLocaleString()} brilliant parkrunners have had their barcodes scanned, ` +
      `and a grand total of ${rpe.facts.finishes.toLocaleString()} finishers ` +
      `have covered a total distance of ${(
        rpe.facts.finishes * rpe.courseLength
      ).toLocaleString()}km, ` +
      `while celebrating ${rpe.facts.pbs.toLocaleString()} personal bests. ` +
      `We shall always be grateful to each of our ${rpe.facts.volunteers.toLocaleString()} wonderful volunteers for their contributions.`,
  );
}
