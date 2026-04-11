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
import {
  createLanguageSwitcher,
  getTranslations,
  switchLanguage,
} from './translations';
import { shareReportText } from './share';
import {
  isSupportedResultsPageUrl,
  eventDateFromResultsPageUrl,
} from './urlFunctions';
import { getCurrentHref } from './currentUrl';

const STALE_DAYS = 7;
const STALE_STYLE_ID = 'eventuate-stale-results-style';

function civilDayNumber(year: number, month: number, day: number): number {
  // Convert a Gregorian calendar date to a stable day number.
  const y = month <= 2 ? year - 1 : year;
  const m = month <= 2 ? month + 12 : month;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m - 3) + 2) / 5) + day - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe;
}

const DISCLAIMER_TOP =
  '\u26A0\uFE0F This information is drawn by the Eventuate Web Extension from the results table to facilitate writing a report. It is not a report in itself.';

function escapeCssContent(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

export function upsertStaleResultsInCss(
  eventuateDiv: HTMLDivElement,
  message: string | null
): void {
  const existing = document.getElementById(STALE_STYLE_ID);
  if (existing) {
    existing.remove();
  }
  eventuateDiv.classList.toggle('eventuate-stale-results', message !== null);
  if (message !== null) {
    const style = document.createElement('style');
    style.id = STALE_STYLE_ID;
    style.textContent = `#eventuate.eventuate-stale-results::before{content:"${escapeCssContent(DISCLAIMER_TOP)} \\A ${escapeCssContent(message)}";}`;
    document.head.appendChild(style);
  }
}

export function isStaleResults(eventDate: string | undefined): boolean {
  if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return false;
  }
  const [y, m, d] = eventDate.split('-').map(Number);
  const now = new Date();
  const eventDay = civilDayNumber(y, m, d);
  const todayDay = civilDayNumber(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  const daysDiff = todayDay - eventDay;
  return daysDiff > STALE_DAYS;
}

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

function createPresenters(rpe: ResultsPageExtractor): Presenters {
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
          ...twoKVolunteersToMilestones(rpe.volunteersList()),
          ...twoKFinishersToMilestones(rpe.finishers),
        ]
      : fiveKFinishersToMilestones(rpe.finishers);
  const milestoneCelebrations = [
    ...fiveKVolunteersToMilestones(rpe.volunteersList()),
    ...finisherMilestoneCelebrations,
  ];

  return {
    introduction: new IntroductionPresenter(
      rpe.finishers.length,
      rpe.volunteersList().length,
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
      getCurrentHref()
    ),
    volunteers: new VolunteersPresenter(rpe.volunteersList(), rpe.eventName),
    firstTimeVolunteers: new FirstTimeVolunteersPresenter(
      rpe.volunteersList(),
      rpe.eventName
    ),
    volunteerInvitation: new VolunteerInvitationPresenter(
      rpe.eventName,
      getCurrentHref()
    ),
    unknowns: new UnknownsPresenter(rpe.unknowns, rpe.eventName),
    juniorSupervision: new JuniorSupervisionPresenter(rpe),
    facts: new FactsPresenter(
      rpe.eventName,
      rpe.courseLength,
      rpe.facts,
      rpe.isLaunchEvent()
    ),
    closing: new ClosingPresenter(rpe.courseLength),
  };
}

function populate(
  rpe: ResultsPageExtractor,
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

  const eventDate = eventDateFromResultsPageUrl(getCurrentHref());
  const staleMessage = isStaleResults(eventDate)
    ? `\u2139\uFE0F ${getTranslations().staleResultsWarning}`
    : null;

  // Iterate over presenters and add to reportDetails
  for (const [key, presenter] of Object.entries(presenters)) {
    reportDetails[key] = {
      title: presenter.title(),
      details: presenter.details(),
    };
  }

  const insertionPoint: Element | null =
    document.querySelector('.Results-header') ?? document.body;
  if (insertionPoint === document.body) {
    insertionPoint.insertAdjacentElement('afterbegin', eventuateDiv);
  } else {
    insertionPoint.insertAdjacentElement('afterend', eventuateDiv);
  }

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

  upsertStaleResultsInCss(eventuateDiv, staleMessage);

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
      shareReportText({
        eventName: rpe.eventName,
        eventDate: eventDateFromResultsPageUrl(getCurrentHref()),
        eventNumber: rpe.eventNumber,
      });
    });
  }
}

type WindowWithEventuate = Window & { eventuate?: () => void };

export function eventuate(): void {
  if (!isSupportedResultsPageUrl(getCurrentHref())) {
    return;
  }
  const rpe = new ResultsPageExtractor(document);
  const presenters = createPresenters(rpe);
  populate(rpe, presenters);
}

(window as WindowWithEventuate).eventuate = eventuate;

eventuate();
