import { pluralize, sortAndConjoin } from './stringFunctions';
import { deleteParagraph, upsertParagraph } from './dom/upsertParagraph';
import { fiveKFinishersToMilestones } from './transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from './transformers/fiveKVolunteersToMilestones';
import { MilestonePresenter } from './presenters/MilestonePresenter';
import { ResultsPageExtractor } from './extractors/ResultsPageExtractor';
import { twoKFinishersToMilestones } from './transformers/twoKFinishersToMilestone';
import { twoKVolunteersToMilestones } from './transformers/twoKVolunteersToMilestones';
import { VolunteerWithCount } from './types/Volunteer';
import { canonicalResultsPageUrl, futureRosterUrl } from './urlFunctions';

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
  message?: string
): void {
  const introduction = `Thank you to all the parkrunners, including the ${pluralize(
    'finisher',
    'finishers',
    rpe.finishers.length
  )} and ${pluralize(
    'volunteer',
    'volunteers',
    volunteerWithCountList.length
  )} who joined us for ${rpe.eventName} event ${rpe.eventNumber}. Without you, this event would not have been possible`;

  const newestParkrunnersTitle = `Kudos to our ${pluralize(
    'newest parkrunner',
    'newest parkrunners',
    rpe.newestParkrunners.length
  )}: `;

  const firstTimersTitle = `Welcome to the ${pluralize(
    'parkrunner',
    'parkrunners',
    rpe.firstTimers.length
  )} who joined us at ${rpe.eventName ?? 'parkrun'} for the first time: `;

  const finishersWithNewPBsTitle = `Very well done to the ${pluralize(
    'parkrunner',
    'parkrunners',
    rpe.finishersWithNewPBs.length
  )} who improved their personal best this week: `;

  const runningWalkingGroupsTitle = `We were pleased to see ${pluralize(
    'at least one active group',
    'walking and running groups',
    rpe.runningWalkingGroups.length
  )} represented at this event: `;

  const volunteersTitle = `The following ${volunteerWithCountList.length.toLocaleString()} parkrunners volunteered to host ${
    rpe.eventName
  } this weekend. Our deep thanks to:  `;

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
    (document.getElementById('eventuate') as HTMLDivElement) ||
    document.createElement('div');
  eventuateDiv.id = 'eventuate';

  const reportDetails = {
    message: { title: '&#x23f3;', details: message },
    introduction: { title: '', details: introduction },

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
    fullResults: {
      title: '',
      details: `You can find the full results for ${rpe.eventName} event ${rpe.eventNumber} at ${canonicalResultsPageUrl(
        rpe.eventNumber ?? 'latestresults',
        window.location.href
      )} `,
    },
    volunteers: {
      title: volunteersTitle,
      details: sortAndConjoin(volunteerWithCountList.map((v) => v.name)),
    },
    volunteerInvitation: {
      title: '',
      details: `If you would like to volunteer at ${rpe.eventName}, please check out our future roster page at ${futureRosterUrl(window.location.href)} . All of our roles are easy to learn, and we will provide training and support. We would love to have you join us`,
    },
    unknowns: {
      title: '',
      details:
        rpe.unknowns.length > 0
          ? `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded`
          : undefined,
    },
    facts: {
      title: '',
      details: facts,
    },
    closing: {
      title: '&#x1f333;',
      details: '#loveparkrun',
    },
  };

  const insertionPoint: HTMLDivElement | null =
    document.querySelector('.Results-header');
  if (insertionPoint) {
    insertionPoint.insertAdjacentElement('afterend', eventuateDiv);

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

function eventuate() {
  const rpe = new ResultsPageExtractor(document);
  const volunteerWithCountList = rpe
    .volunteersList()
    .map((vol) => new VolunteerWithCount(vol, window.location.origin));
  const waitingOn = volunteerWithCountList
    .map((v) => v.promisedVols)
    .filter((v) => !!v);
  const loadingMessage = `Loading volunteer data for ${waitingOn.length} parkrunners. Please wait`;

  populate(rpe, volunteerWithCountList, loadingMessage);

  Promise.all(waitingOn).then(() => populate(rpe, volunteerWithCountList));
}

eventuate();
