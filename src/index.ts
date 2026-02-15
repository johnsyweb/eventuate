import { deleteParagraph, upsertParagraph } from './dom/upsertParagraph';
import { fiveKFinishersToMilestones } from './transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from './transformers/fiveKVolunteersToMilestones';
import { FactsPresenter } from './presenters/FactsPresenter';
import { MilestonePresenter } from './presenters/MilestonePresenter';
import { FirstTimersPresenter } from './presenters/FirstTimersPresenter';
import { FirstTimersLaunchEventPresenter } from './presenters/FirstTimersLaunchEventPresenter';
import { FirstTimeVolunteersPresenter } from './presenters/FirstTimeVolunteersPresenter';
import { JuniorSupervisionPresenter } from './presenters/JuniorSupervisionPresenter';
import { UnknownsPresenter } from './presenters/UnknownsPresenter';
import { IntroductionPresenter } from './presenters/IntroductionPresenter';
import { NewestParkrunnersPresenter } from './presenters/NewestParkrunnersPresenter';
import { NewPBsPresenter } from './presenters/NewPBsPresenter';
import { GroupsPresenter } from './presenters/GroupsPresenter';
import { FullResultsPresenter } from './presenters/FullResultsPresenter';
import { VolunteersPresenter } from './presenters/VolunteersPresenter';
import { VolunteerInvitationPresenter } from './presenters/VolunteerInvitationPresenter';
import { ClosingPresenter } from './presenters/ClosingPresenter';
import { ResultsPageExtractor } from './extractors/ResultsPageExtractor';
import { twoKFinishersToMilestones } from './transformers/twoKFinishersToMilestone';
import { twoKVolunteersToMilestones } from './transformers/twoKVolunteersToMilestones';
import { VolunteerWithCount } from './types/Volunteer';
import {
  getTranslations,
  interpolate,
  createLanguageSwitcher,
  switchLanguage,
} from './translations';
import { shareReportText } from './share';

interface Presenters {
  introduction: IntroductionPresenter;
  milestoneCelebrations: MilestonePresenter;
  newestParkrunners: NewestParkrunnersPresenter;
  firstTimers: FirstTimersPresenter;
  newPBs: NewPBsPresenter;
  groups: GroupsPresenter;
  fullResults: FullResultsPresenter;
  volunteers: VolunteersPresenter;
  firstTimeVolunteers: FirstTimeVolunteersPresenter;
  volunteerInvitation: VolunteerInvitationPresenter;
  unknowns: UnknownsPresenter;
  juniorSupervision: JuniorSupervisionPresenter;
  facts: FactsPresenter;
  closing: ClosingPresenter;
}

function createPresenters(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[]
): Presenters {
  const firstTimersPresenter =
    rpe.isLaunchEvent() && rpe.firstTimersWithFinishCounts.length > 0
      ? new FirstTimersLaunchEventPresenter(
          rpe.firstTimersWithFinishCounts,
          rpe.eventName
        )
      : new FirstTimersPresenter(
          rpe.firstTimersWithFinishCounts,
          rpe.eventName
        );

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

  return {
    introduction: new IntroductionPresenter(
      rpe.finishers.length,
      volunteerWithCountList.length,
      rpe.eventName,
      rpe.eventNumber
    ),
    milestoneCelebrations: new MilestonePresenter(milestoneCelebrations),
    newestParkrunners: new NewestParkrunnersPresenter(rpe.newestParkrunners),
    firstTimers: firstTimersPresenter,
    newPBs: new NewPBsPresenter(rpe.finishersWithNewPBs, rpe.eventName),
    groups: new GroupsPresenter(rpe.runningWalkingGroups),
    fullResults: new FullResultsPresenter(
      rpe.eventName,
      rpe.eventNumber,
      window.location.href
    ),
    volunteers: new VolunteersPresenter(volunteerWithCountList, rpe.eventName),
    firstTimeVolunteers: new FirstTimeVolunteersPresenter(
      volunteerWithCountList,
      rpe.eventName
    ),
    volunteerInvitation: new VolunteerInvitationPresenter(
      rpe.eventName,
      window.location.href
    ),
    unknowns: new UnknownsPresenter(rpe.unknowns, rpe.eventName),
    juniorSupervision: new JuniorSupervisionPresenter(rpe),
    facts: new FactsPresenter(
      rpe.eventName,
      rpe.courseLength,
      rpe.facts,
      rpe.isLaunchEvent()
    ),
    closing: new ClosingPresenter(),
  };
}

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
  presenters: Presenters,
  message?: string
): void {
  const eventuateDiv: HTMLDivElement =
    (document.getElementById('eventuate') as HTMLDivElement) ||
    document.createElement('div');
  eventuateDiv.id = 'eventuate';

  // Build reportDetails from presenters
  const reportDetails: Record<
    string,
    { title: string; details: string | undefined }
  > = {
    languageSwitcher: {
      title: '',
      details: createLanguageSwitcher(),
    },
    message: { title: '&#x23f3;', details: message },
  };

  // Iterate over presenters and add to reportDetails
  for (const [key, presenter] of Object.entries(presenters)) {
    reportDetails[key] = {
      title: presenter.title(),
      details: presenter.details(),
    };
  }

  const insertionPoint: HTMLDivElement | null =
    document.querySelector('.Results-header');
  if (insertionPoint) {
    insertionPoint.insertAdjacentElement('afterend', eventuateDiv);

    for (const [section, content] of Object.entries(reportDetails)) {
      if (content.details) {
        if (section === 'languageSwitcher') {
          // Handle language switcher specially - no title, no period
          upsertParagraph(eventuateDiv, section, content.details);
        } else {
          // Check if title ends with <br> to avoid extra space
          const separator = content.title.endsWith('<br>') ? '' : ' ';
          const paragraphText = `${content.title}${separator}${content.details}.`;
          upsertParagraph(eventuateDiv, section, paragraphText);
        }
      } else {
        deleteParagraph(eventuateDiv, section);
      }
    }

    // Add event listeners for language switcher and copy button
    const languageButtons = eventuateDiv.querySelectorAll(
      '.eventuate-language-btn'
    );
    languageButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const locale = target.getAttribute('data-locale');
        if (locale) {
          switchLanguage(locale);
        }
      });
    });

    // Add event listener for share button
    const shareButton = eventuateDiv.querySelector('.eventuate-share-btn');
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        shareReportText(rpe);
      });
    }
  }
}

type WindowWithEventuate = Window & { eventuate?: () => void };

function eventuate() {
  const rpe = new ResultsPageExtractor(document);
  const volunteerWithCountList = rpe
    .volunteersList()
    .map((vol) => new VolunteerWithCount(vol, window.location.origin));
  const waitingOn = volunteerWithCountList
    .map((v) => v.promisedVols)
    .filter((v) => !!v);
  const loadingMessage = interpolate(getTranslations().loadingMessage, {
    count: waitingOn.length,
  });

  const presenters = createPresenters(rpe, volunteerWithCountList);

  populate(rpe, volunteerWithCountList, presenters, loadingMessage);

  Promise.all(waitingOn).then(() =>
    populate(rpe, volunteerWithCountList, presenters)
  );
}

(window as WindowWithEventuate).eventuate = eventuate;

eventuate();
