import { ResultsPageExtractor } from "./extractors/ResultsPageExtractor";
import { MilestonePresenter } from "./presenters/MilestonePresenter";
import { conjoin, pluralize, sortAndConjoin } from "./stringFunctions";
import { fiveKFinishersToMilestones } from "./transformers/fiveKFinishersToMilestones";
import { upsertParagraph } from "./dom/upsertParagraph";
import { presentVolunteerName } from "./presenters/presentVolunteerName";
import { sourceVolunteerCount } from "./extractors/sourceVolunteerCount";

function eventuate(): void {
const rpe = new ResultsPageExtractor(document);

const milestoneCelebrations = fiveKFinishersToMilestones(rpe.finishers);
const milestonePresenter = new MilestonePresenter(milestoneCelebrations);
const introduction = `On parkrunday, ${rpe.finishers.length} parkrunners joined us for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course.`;

const newestParkrunnersTitle = `Congratulations to our ${pluralize(
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
  "active group",
  "walking and running groups",
  rpe.runningWalkingGroups.length
)} represented at this event: `;

const volunteerList = rpe.volunteersList();
const volunteersTitle = `${rpe.eventName} are very grateful to the ${volunteerList.length} amazing volunteers who made this event happen: `;

const eventuateDiv: HTMLDivElement =
  (document.getElementById("eventuate") as HTMLDivElement) ||
  document.createElement("div");
eventuateDiv.id = "eventuate";

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
};

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
      `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded.`
    );
  }
  const p = upsertParagraph(eventuateDiv, "volunteers", volunteersTitle);

  volunteerList
    .sort((v1, v2) => v1.name.localeCompare(v2.name))
    .forEach((v, i) => {
      const span = document.createElement("span");
      const punctuation =
        i < volunteerList.length - 1
          ? i === volunteerList.length - 2
            ? document.createTextNode(", and ")
            : document.createTextNode(", ")
          : document.createTextNode(".");
      span.id = v.athleteID.toString();
      if (v.vols) {
        span.title = v.vols;
        span.dataset.vols = v.vols;
        span.dataset.agegroup = v.agegroup;
        span.dataset.vols_source = "finisher";

        span.innerText = presentVolunteerName(
          v.name,
          Number(v.vols),
          v.agegroup ?? "None"
        );
      } else {
        span.innerText = v.name;
        sourceVolunteerCount(v, span);
      }

      p.insertAdjacentElement("beforeend", span);
      p.appendChild(punctuation);
    });

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
      `We shall always be grateful to each of our ${rpe.facts.volunteers.toLocaleString()} wonderful volunteers for their contributions.`
  );
}
}

eventuate();
