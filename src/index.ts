import { sortAndConjoin } from './stringFunctions';
import { deleteParagraph, upsertParagraph } from './dom/upsertParagraph';
import { fiveKFinishersToMilestones } from './transformers/fiveKFinishersToMilestones';
import { fiveKVolunteersToMilestones } from './transformers/fiveKVolunteersToMilestones';
import { MilestonePresenter } from './presenters/MilestonePresenter';
import { ResultsPageExtractor } from './extractors/ResultsPageExtractor';
import { twoKFinishersToMilestones } from './transformers/twoKFinishersToMilestone';
import { twoKVolunteersToMilestones } from './transformers/twoKVolunteersToMilestones';
import { VolunteerWithCount } from './types/Volunteer';
import { canonicalResultsPageUrl, futureRosterUrl } from './urlFunctions';
import {
  getTranslations,
  interpolate,
  pluralizeTranslated,
  createLanguageSwitcher,
  switchLanguage,
  shareReportText,
} from './translations';

function populate(
  rpe: ResultsPageExtractor,
  volunteerWithCountList: VolunteerWithCount[],
  message?: string
): void {
  const t = getTranslations();

  const introduction = interpolate(t.introduction, {
    finisherCount: `${rpe.finishers.length} ${pluralizeTranslated(
      t.finisher,
      t.finishers,
      rpe.finishers.length
    )}`,
    volunteerCount: `${volunteerWithCountList.length} ${pluralizeTranslated(
      t.volunteer,
      t.volunteers,
      volunteerWithCountList.length
    )}`,
    eventName: rpe.eventName || t.fallbackParkrunName,
    eventNumber: rpe.eventNumber || '',
  });

  const newestParkrunnersTitle = interpolate(t.newestParkrunnersTitle, {
    count: `${rpe.newestParkrunners.length} ${pluralizeTranslated(
      t.parkrunner,
      t.parkrunners,
      rpe.newestParkrunners.length
    )}`,
  });

  const firstTimersTitle = interpolate(t.firstTimersTitle, {
    count: `${rpe.firstTimers.length} ${pluralizeTranslated(
      t.parkrunner,
      t.parkrunners,
      rpe.firstTimers.length
    )}`,
    eventName: rpe.eventName || t.fallbackParkrunName,
  });

  const finishersWithNewPBsTitle = interpolate(t.finishersWithNewPBsTitle, {
    eventName: rpe.eventName || t.fallbackParkrunName,
    count: `${rpe.finishersWithNewPBs.length} ${pluralizeTranslated(
      t.parkrunner,
      t.parkrunners,
      rpe.finishersWithNewPBs.length
    )}`,
  });

  const runningWalkingGroupsTitle = interpolate(t.runningWalkingGroupsTitle, {
    count: `${rpe.runningWalkingGroups.length} ${
      rpe.runningWalkingGroups.length === 1
        ? 'active group'
        : 'walking and running groups'
    }`,
  });

  const volunteersTitle = interpolate(t.volunteersTitle, {
    count: volunteerWithCountList.length.toLocaleString(),
    eventName: rpe.eventName || t.fallbackParkrunName,
  });

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

  const facts = [
    interpolate(t.facts.sinceStarted, {
      eventName: rpe.eventName || t.fallbackParkrunName,
    }),
    interpolate(t.facts.brilliantParkrunners, {
      count: rpe.facts?.finishers?.toLocaleString() || '0',
    }),
    interpolate(t.facts.grandTotal, {
      count: rpe.facts.finishes.toLocaleString(),
    }),
    interpolate(t.facts.coveredDistance, {
      distance: (rpe.facts.finishes * rpe.courseLength).toLocaleString(),
    }),
    interpolate(t.facts.celebratingPBs, {
      count: rpe.facts.pbs.toLocaleString(),
    }),
    interpolate(t.facts.gratefulToVolunteers, {
      count: rpe.facts.volunteers.toLocaleString(),
    }),
  ].join('');

  const eventuateDiv: HTMLDivElement =
    (document.getElementById('eventuate') as HTMLDivElement) ||
    document.createElement('div');
  eventuateDiv.id = 'eventuate';

  const reportDetails = {
    languageSwitcher: {
      title: '',
      details: createLanguageSwitcher(),
    },
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
      details: sortAndConjoin(volunteerWithCountList.map((v) => v.name)),
    },
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
          const paragraphText = `${content.title} ${content.details}.`;
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
        shareReportText();
      });
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
  const loadingMessage = interpolate(getTranslations().loadingMessage, {
    count: waitingOn.length,
  });

  populate(rpe, volunteerWithCountList, loadingMessage);

  Promise.all(waitingOn).then(() => populate(rpe, volunteerWithCountList));
}

eventuate();
