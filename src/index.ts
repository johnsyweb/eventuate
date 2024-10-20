import { conjoin, pluralize, sortAndConjoin } from "./stringFunctions";
import { fiveKFinishersToMilestones } from "./transformers/fiveKFinishersToMilestones";
import { fiveKVolunteersToMilestones } from "./transformers/fiveKVolunteersToMilestones";
import { MilestonePresenter } from "./presenters/MilestonePresenter";
import { ResultsPageExtractor } from "./extractors/ResultsPageExtractor";
import { upsertParagraph } from "./dom/upsertParagraph";
import { VolunteerWithCount } from "./types/Volunteer";

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
): void {
  console.debug(
    `⏱︎ Eventuating with ${JSON.stringify(volunteerWithCountList)}`,
  );
  const introduction = `On parkrunday, ${rpe.finishers.length} parkrunners joined us for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course`;

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

  const volunteersTitle = `${rpe.eventName} are very grateful to the ${volunteerWithCountList.length} amazing volunteers who made this event happen: `;

  const milestoneCelebrations = [
    ...fiveKVolunteersToMilestones(volunteerWithCountList),
    ...fiveKFinishersToMilestones(rpe.finishers),
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

  const reportDetails = {
    introduction: { title: "", details: introduction },

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
    insertionPoint.insertAdjacentElement("afterend", eventuateDiv);

    for (const [section, content] of Object.entries(reportDetails)) {
      if (content.details) {
        const paragraphText = `${content.title} ${content.details}.`;
        upsertParagraph(eventuateDiv, section, paragraphText);
      }
    }
  }
}

function gather() {
  const rpe = new ResultsPageExtractor(document);
  const volunteerWithCountList = rpe
    .volunteersList()
    .map((vol) => new VolunteerWithCount(vol));

  Promise.all(
    volunteerWithCountList.map((v) => v.promisedVols).filter((v) => !!v),
  ).then(() => populate(rpe, volunteerWithCountList));
}

gather();
