export interface ShareReportOptions {
  eventName?: string;
  eventDate?: string;
  eventNumber?: string;
}

// Share report text using native share or clipboard
export function shareReportText(options?: ShareReportOptions): void {
  const eventuateDiv = document.getElementById('eventuate');
  if (!eventuateDiv) {
    console.warn('Eventuate content not found');
    return;
  }

  const eventTitle = buildEventTitle(options);
  const reportText = extractReportText(eventuateDiv);

  if (reportText) {
    // Try native share first (works on mobile devices and some desktop browsers)
    if (navigator.share) {
      navigator
        .share({
          title: eventTitle,
          text: reportText,
        })
        .catch((error) => {
          console.warn('Native share failed:', error);
          copyToClipboard(eventTitle, reportText);
        });
    } else {
      copyToClipboard(eventTitle, reportText);
    }
  }
}

function buildEventTitle(options?: ShareReportOptions): string {
  if (options?.eventName && options?.eventDate && options?.eventNumber) {
    return `${options.eventName} ${options.eventDate} | ${options.eventNumber}`;
  } else if (options?.eventName) {
    return options.eventName;
  } else {
    return 'parkrun Event Report';
  }
}

function extractReportText(eventuateDiv: HTMLElement): string {
  const paragraphs = eventuateDiv.querySelectorAll('p');
  const reportText = Array.from(paragraphs)
    .map((p) => {
      if (
        p.id === 'languageSwitcher' ||
        p.querySelector('.eventuate-language-switcher')
      ) {
        return '';
      }

      const clone = p.cloneNode(true) as HTMLElement;

      const elementsToRemove = clone.querySelectorAll('*:not(br)');
      elementsToRemove.forEach((el) => {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
      });

      const textContent = clone.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();

      return textContent;
    })
    .filter((text) => text && text.length > 0)
    .join('\n\n');

  return reportText;
}

function copyToClipboard(title: string, text: string): void {
  const fullText = `${title}\n\n${text}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        showSuccessFeedback();
      })
      .catch((error) => {
        console.warn('Clipboard write failed:', error);
        fallbackCopyToClipboard(fullText);
      });
  } else {
    fallbackCopyToClipboard(fullText);
  }
}

function showSuccessFeedback(): void {
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
}

function fallbackCopyToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  showSuccessFeedback();
}
