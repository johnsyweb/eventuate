// translations/index.ts - Translation registry and utilities
import { en } from './en';
import { de } from './de';

export interface TranslationKeys {
  // Language metadata
  flag: string;
  languageName: string;

  // Translation strings
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
  // First check for stored user preference
  const stored = localStorage.getItem('eventuate-language');
  if (stored && translations[stored]) {
    return stored;
  }

  const browserLocale = navigator.language || navigator.languages?.[0] || 'en';

  // Check for exact match first (e.g., en-GB, de-DE)
  if (translations[browserLocale]) {
    return browserLocale;
  }

  // Check for language match (e.g., en, de)
  const language = browserLocale.split('-')[0].toLowerCase();
  if (translations[language]) {
    return language;
  }

  // Default to English
  return 'en';
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

// Language switcher functionality
export function createLanguageSwitcher(): string {
  const currentLocale = detectLocale();
  const availableLocales = Object.keys(translations);

  return `
    <div class="eventuate-language-switcher">
      <span class="eventuate-language-label">Language:</span>
      ${availableLocales
        .map(
          (locale) => `
        <button 
          class="eventuate-language-btn ${currentLocale === locale ? 'active' : ''}" 
          data-locale="${locale}"
          title="${translations[locale].languageName}"
        >
          ${translations[locale].flag} ${translations[locale].languageName}
        </button>
      `
        )
        .join('')}
    </div>
  `;
}

// Switch language function
export function switchLanguage(locale: string): void {
  if (!translations[locale]) {
    console.warn(`Locale ${locale} not supported`);
    return;
  }

  // Store the user's language preference
  localStorage.setItem('eventuate-language', locale);

  // Reload the page to apply the new language
  window.location.reload();
}

// Get stored language preference or detect from browser
export function getStoredOrDetectedLocale(): string {
  const stored = localStorage.getItem('eventuate-language');
  if (stored && translations[stored]) {
    return stored;
  }
  return detectLocale();
}

// Pluralization helper that works with translations
export function pluralizeTranslated(
  singular: string,
  plural: string,
  count: number
): string {
  return count === 1 ? singular : plural;
}
