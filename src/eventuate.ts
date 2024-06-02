function upsertParagraph(div: HTMLElement, id: string, content: string) {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id
  );

  if (existingParagraph) {
    existingParagraph.remove();
  }

  const paragraph = document.createElement("p");
  paragraph.id = id;
  paragraph.innerText = content;
  div.appendChild(paragraph);
}
function conjoin(elements: string[]) {
  return elements.length > 1
    ? `${elements.slice(0, -1).join(", ")} and ${elements.slice(-1)}`
    : elements[0];
}

const alphabetize = (names: string[]) =>
  names.sort((a, b) => a.localeCompare(b));
const sortAndConjoin = (names: string[]) => conjoin(alphabetize(names));
const pluralize = (noun: string, nouns: string, collection: any[]) =>
  collection.length === 1 ? noun : nouns;

const rpe = new ResultsPageExtractor(document);

type MilestoneDefinition = {
  restricted_age: string;
  p_icon: string;
  v_icon: string;
};

const milestones: Record<number, MilestoneDefinition> = {
  10: { restricted_age: "J", p_icon: "⚪︎", v_icon: "🤍" },
  25: { restricted_age: "", p_icon: "🟣", v_icon: "💜" },
  50: { restricted_age: "", p_icon: "🔴", v_icon: "❤️" },
  100: { restricted_age: "", p_icon: "⚫", v_icon: "🖤" },
  250: { restricted_age: "", p_icon: "🟢", v_icon: "💚" },
  500: { restricted_age: "", p_icon: "🔵", v_icon: "💙" },
  1000: { restricted_age: "", p_icon: "🟡", v_icon: "💛" },
};

let milestoneCelebrations: string[] = [];

for (const n in milestones) {
  const milestone: MilestoneDefinition = milestones[n];
  const names: string[] = rpe.finishers
    .filter(
      (f) =>
        Number(f.runs) === Number(n) &&
        f.agegroup.startsWith(milestone.restricted_age)
    )
    .map((f) => f.name);

  if (names.length > 0) {
    milestoneCelebrations.push(
      `${sortAndConjoin(names)} joined the ${milestone.p_icon} ${n} Club`
    );
  }
}

const introduction = `${rpe.finishers.length} parkrunners joined us on ${rpe.eventDate} for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course.`;

const milestoneCelebrationsTitle =
  "Three cheers to the following parkrunners who earned themselves a new parkrun club shirt this weekend";

const newestParkrunnersTitle = `Congratulations to our ${
  rpe.newestParkrunners.length
} newest ${pluralize("parkrunner", "parkrunners", rpe.newestParkrunners)}`;

const firstTimersTitle = `Welcome to the ${rpe.firstTimers.length} ${pluralize(
  "parkrunner",
  "parkrunners",
  rpe.firstTimers
)} who joined us at ${rpe.eventName} for the first time`;

const finishersWithNewPBsTitle = `Very well done to the ${
  rpe.finishersWithNewPBs.length
} ${pluralize(
  "parkrunner",
  "parkrunners",
  rpe.finishersWithNewPBs
)} who improved their personal best this week`;

const runningWalkingGroupsTitle = `We were pleased to see ${
  rpe.runningWalkingGroups.length
} ${pluralize(
  "active group",
  "walking and running groups",
  rpe.runningWalkingGroups
)} represented at this event`;

const volunteersTitle = `${rpe.eventName} are very grateful to the ${rpe.volunteersList.length} amazing volunteers who made this event happen`;

const reportDetails = {
  milestoneCelebrations: {
    title: milestoneCelebrationsTitle,
    details: milestoneCelebrations,
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
      const paragraphText = `${content.title}: ${content.details}.`;
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
