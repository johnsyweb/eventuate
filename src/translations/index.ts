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
      <button 
        class="eventuate-share-btn" 
        title="Share report text"
        data-action="share-report"
      >
        📤 Share Report
      </button>
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

// Share report text using native share or clipboard
export function shareReportText(): void {
  const eventuateDiv = document.getElementById('eventuate');
  if (!eventuateDiv) {
    console.warn('Eventuate content not found');
    return;
  }

  // Get all paragraphs and process them individually
  const paragraphs = eventuateDiv.querySelectorAll('p');
  const reportText = Array.from(paragraphs)
    .map((p) => {
      // Skip the language switcher paragraph
      if (
        p.id === 'languageSwitcher' ||
        p.querySelector('.eventuate-language-switcher')
      ) {
        return '';
      }

      // Get the text content, preserving line breaks from <br> tags
      const htmlContent = p.innerHTML;
      const textContent = htmlContent
        .replace(/<br\s*\/?>/gi, '\n') // Convert <br> tags to line breaks
        .replace(/<[^>]*>/g, '') // Remove other HTML tags
        .trim();

      return textContent;
    })
    .filter((text) => text && text.length > 0)
    .join('\n\n'); // Join paragraphs with double line breaks

  if (reportText) {
    // Try native share first (works on mobile devices and some desktop browsers)
    if (navigator.share) {
      navigator
        .share({
          title: 'parkrun Event Report',
          text: reportText,
        })
        .catch((err) => {
          console.log('Native share cancelled or failed:', err);
          // Fall back to clipboard if share fails
          copyToClipboard(reportText);
        });
    } else {
      // Fall back to clipboard for browsers without native share
      copyToClipboard(reportText);
    }
  }
}

// Helper function to copy text to clipboard
function copyToClipboard(text: string): void {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success feedback
      const shareBtn = document.querySelector('.eventuate-share-btn');
      if (shareBtn) {
        const originalText = shareBtn.textContent;
        shareBtn.textContent = '✅ Copied!';
        shareBtn.classList.add('shared');

        setTimeout(() => {
          shareBtn.textContent = originalText;
          shareBtn.classList.remove('shared');
        }, 2000);
      }
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
}
