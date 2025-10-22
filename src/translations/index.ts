// translations/index.ts - Translation registry and utilities
import { en } from './en';
import { de } from './de';

export interface TranslationKeys {
  introduction: string;
  newestParkrunnersTitle: string;
  firstTimersTitle: string;
  finishersWithNewPBsTitle: string;
  runningWalkingGroupsTitle: string;
  volunteersTitle: string;
  fullResults: string;
  volunteerInvitation: string;
  unknowns: string;
  facts: {
    sinceStarted: string;
    brilliantParkrunners: string;
    grandTotal: string;
    coveredDistance: string;
    celebratingPBs: string;
    gratefulToVolunteers: string;
  };
  milestoneCelebrations: {
    title: string;
    joinedClub: string;
  };
  loadingMessage: string;
  closing: string;
  fallbackParkrunName: string;
  fallbackParkrunnerName: string;
  finisher: string;
  finishers: string;
  volunteer: string;
  volunteers: string;
  parkrunner: string;
  parkrunners: string;
  milestoneClubs: Record<string, string>;
}

export const translations: Record<string, TranslationKeys> = {
  en,
  de,
};

// Detect browser locale
export function detectLocale(): string {
  const browserLocale = navigator.language || navigator.languages?.[0] || 'en';
  const language = browserLocale.split('-')[0].toLowerCase();

  // Return supported locale or fallback to English
  return translations[language] ? language : 'en';
}

// Get translations for current locale
export function getTranslations(locale?: string): TranslationKeys {
  const targetLocale = locale || detectLocale();
  return translations[targetLocale] || translations.en;
}

// Simple template replacement function
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

// Pluralization helper that works with translations
export function pluralizeTranslated(
  singular: string,
  plural: string,
  count: number
): string {
  return count === 1 ? singular : plural;
}
