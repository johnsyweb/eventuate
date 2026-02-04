import { sortAndConjoin } from './stringFunctions';
import { deleteParagraph, upsertParagraph } from './dom/upsertParagraph';
import { fiveKFinishersToMilestones } from './transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from './transformers/fiveKVolunteersToMilestones';
import { MilestonePresenter } from './presenters/MilestonePresenter';
import { FirstTimersPresenter } from './presenters/FirstTimersPresenter';
import { FirstTimersLaunchEventPresenter } from './presenters/FirstTimersLaunchEventPresenter';
import { FirstTimeVolunteersPresenter } from './presenters/FirstTimeVolunteersPresenter';
import { JuniorSupervisionPresenter } from './presenters/JuniorSupervisionPresenter';
import { ResultsPageExtractor } from './extractors/ResultsPageExtractor';
import { twoKFinishersToMilestones } from './transformers/twoKFinishersToMilestone';
import { twoKVolunteersToMilestones } from './transformers/twoKVolunteersToMilestones';
import { VolunteerWithCount } from './types/Volunteer';
import { canonicalResultsPageUrl, futureRosterUrl } from './urlFunctions';
import {
  getTranslations,
  interpolate,
  formatCount,
  createLanguageSwitcher,
  switchLanguage,
} from './translations';
import { shareReportText } from './share';

interface Presenters {
  firstTimers: FirstTimersPresenter;
  firstTimeVolunteers: FirstTimeVolunteersPresenter;
  milestone: MilestonePresenter;
  juniorSupervision: JuniorSupervisionPresenter;
}

function createPresenters(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[]
): Presenters {
  const firstTimersPresenter =
    rpe.isLaunchEvent() &&
    rpe.firstTimersWithFinishCounts.length > 0
      ? new FirstTimersLaunchEventPresenter(
          rpe.firstTimersWithFinishCounts,
          rpe.eventName
        )
      : new FirstTimersPresenter(rpe.firstTimersWithFinishCounts, rpe.eventName);

  const firstTimeVolunteersPresenter = new FirstTimeVolunteersPresenter(
    volunteerWithCountList,
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
  const milestonePresenter = new MilestonePresenter(milestoneCelebrations);

  const juniorSupervisionPresenter = new JuniorSupervisionPresenter(rpe);

  return {
    firstTimers: firstTimersPresenter,
    firstTimeVolunteers: firstTimeVolunteersPresenter,
    milestone: milestonePresenter,
    juniorSupervision: juniorSupervisionPresenter,
  };
}

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
  presenters: Presenters,
  message?: string
): void {
  const t = getTranslations();

  const introduction = interpolate(t.introduction, {
    finisherCount: formatCount(rpe.finishers.length, t.finisher, t.finishers),
    volunteerCount: formatCount(
      volunteerWithCountList.length,
      t.volunteer,
      t.volunteers
    ),
    eventName: rpe.eventName || t.fallbackParkrunName,
    eventNumber: rpe.eventNumber || '',
  });

  const newestParkrunnersTitle = interpolate(t.newestParkrunnersTitle, {
    count: formatCount(
      rpe.newestParkrunners.length,
      t.parkrunner,
      t.parkrunners
    ),
  });

  const finishersWithNewPBsTitle = interpolate(t.finishersWithNewPBsTitle, {
    eventName: rpe.eventName || t.fallbackParkrunName,
    count: formatCount(
      rpe.finishersWithNewPBs.length,
      t.parkrunner,
      t.parkrunners
    ),
  });

  const runningWalkingGroupsTitle = interpolate(t.runningWalkingGroupsTitle, {
    count: formatCount(
      rpe.runningWalkingGroups.length,
      t.activeGroup,
      t.walkingAndRunningGroups
    ),
  });

  const volunteersTitle = interpolate(t.volunteersTitle, {
    eventName: rpe.eventName || t.fallbackParkrunName,
  });

  const facts = [
    interpolate(t.facts.sinceStarted, {
      eventName: rpe.eventName || t.fallbackParkrunName,
    }),
    interpolate(t.facts.brilliantParkrunners, {
      count: rpe.facts?.finishers?.toLocaleString() || '0',
    }),
    interpolate(t.facts.grandTotal, {
      count: rpe.facts.finishes?.toLocaleString() || '0',
    }),
    interpolate(t.facts.coveredDistance, {
      distance: ((rpe.facts.finishes || 0) * rpe.courseLength).toLocaleString(),
    }),
    interpolate(t.facts.celebratingPBs, {
      count: rpe.facts.pbs?.toLocaleString() || '0',
    }),
    interpolate(t.facts.gratefulToVolunteers, {
      count: rpe.facts.volunteers?.toLocaleString() || '0',
    }),
  ].join('');

  const eventuateDiv: HTMLDivElement =
    (document.getElementById('eventuate') as HTMLDivElement) ||
    document.createElement('div');
  eventuateDiv.id = 'eventuate';

  const firstTimersTitle = presenters.firstTimers.title();
  const firstTimersDetails = presenters.firstTimers.details();

  const reportDetails = {
    languageSwitcher: {
      title: '',
      details: createLanguageSwitcher(),
    },
    message: { title: '&#x23f3;', details: message },
    introduction: { title: '', details: introduction },

    milestoneCelebrations: {
      title: presenters.milestone.title(),
      details: presenters.milestone.details(),
    },
    newestParkrunners: {
      title: newestParkrunnersTitle,
      details: sortAndConjoin(rpe.newestParkrunners),
    },
    firstTimers: {
      title: firstTimersTitle,
      details: firstTimersDetails,
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
      details: interpolate(t.fullResults, {
        eventName: rpe.eventName || t.fallbackParkrunName,
        eventNumber: rpe.eventNumber || '',
        url: canonicalResultsPageUrl(
          rpe.eventNumber ?? 'latestresults',
          window.location.href
        ),
      }),
    },
    volunteers: {
      title: volunteersTitle,
      details: sortAndConjoin(
        volunteerWithCountList
          .filter((v) => v.vols !== 1) // Exclude first-time volunteers
          .map((v) => v.name)
      ),
    },
    ...(presenters.firstTimeVolunteers.hasFirstTimeVolunteers() && {
      firstTimeVolunteers: {
        title: presenters.firstTimeVolunteers.title(),
        details: presenters.firstTimeVolunteers.details(),
      },
    }),
    volunteerInvitation: {
      title: '',
      details: interpolate(t.volunteerInvitation, {
        eventName: rpe.eventName || t.fallbackParkrunName,
        url: futureRosterUrl(window.location.href),
      }),
    },
    unknowns: {
      title: '',
      details:
        rpe.unknowns.length > 0
          ? interpolate(t.unknowns, {
              eventName: rpe.eventName || t.fallbackParkrunName,
            })
          : undefined,
    },
    juniorSupervision: {
      title: '',
      details: presenters.juniorSupervision.hasSupervisionIssue()
        ? presenters.juniorSupervision.details()
        : undefined,
    },
    facts: {
      title: '',
      details: facts,
    },
    closing: {
      title: '&#x1f333;',
      details: t.closing,
    },
  };

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
