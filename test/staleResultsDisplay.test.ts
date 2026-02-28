/**
 * @jest-environment jsdom
 */

import { upsertStaleResultsInCss, eventuate } from '../src/index';
import { getCurrentHref } from '../src/currentUrl';
import { eventDateFromResultsPageUrl } from '../src/urlFunctions';
import fs from 'fs';
import path from 'path';

const staleResultsUrl =
  'https://www.parkrun.com.au/parkville/results/2020-01-01/';

jest.mock('../src/currentUrl', () => ({
  getCurrentHref: jest.fn(),
}));

describe('upsertStaleResultsInCss', () => {
  let eventuateDiv: HTMLDivElement;

  beforeEach(() => {
    eventuateDiv = document.createElement('div');
    eventuateDiv.id = 'eventuate';
    document.body.appendChild(eventuateDiv);
  });

  afterEach(() => {
    document.getElementById('eventuate-stale-results-style')?.remove();
    eventuateDiv.remove();
  });

  it('adds eventuate-stale-results class and injects style with content when message is provided', () => {
    const message = 'ℹ️ These results are more than a week old.';
    upsertStaleResultsInCss(eventuateDiv, message);

    expect(eventuateDiv.classList.contains('eventuate-stale-results')).toBe(
      true
    );
    const style = document.getElementById('eventuate-stale-results-style');
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain(message);
  });

  it('removes class and style when message is null', () => {
    upsertStaleResultsInCss(eventuateDiv, 'Some message');
    expect(eventuateDiv.classList.contains('eventuate-stale-results')).toBe(
      true
    );

    upsertStaleResultsInCss(eventuateDiv, null);
    expect(eventuateDiv.classList.contains('eventuate-stale-results')).toBe(
      false
    );
    expect(document.getElementById('eventuate-stale-results-style')).toBeNull();
  });

  it('escapes double quotes in message for CSS content', () => {
    upsertStaleResultsInCss(eventuateDiv, 'Say "hello"');
    const style = document.getElementById('eventuate-stale-results-style');
    expect(style?.textContent).toContain('\\"hello\\"');
  });
});

describe('stale results display with eventuate()', () => {
  const fixturePath = path.join(
    __dirname,
    'fixtures',
    'results-brimbank-parkrun.html'
  );

  beforeEach(() => {
    jest.mocked(getCurrentHref).mockReturnValue(staleResultsUrl);
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.body.innerHTML = new DOMParser().parseFromString(
      html,
      'text/html'
    ).body.innerHTML;
    if (!document.head) {
      const head = document.createElement('head');
      document.documentElement.insertBefore(head, document.body);
    }
  });

  it('shows stale message when URL has a date more than 7 days ago', () => {
    eventuate();

    const eventuateEl = document.getElementById('eventuate');
    expect(eventuateEl).not.toBeNull();
    expect(eventuateEl?.classList.contains('eventuate-stale-results')).toBe(
      true
    );
    const style = document.getElementById('eventuate-stale-results-style');
    expect(style).not.toBeNull();
    expect(style?.textContent).toMatch(/more than a week old/);
  });

  it('shows eventuate block and stale message when page has no .Results-header', () => {
    document.body.innerHTML = '<p>No results header</p>';
    eventuate();

    const eventuateEl = document.getElementById('eventuate');
    expect(eventuateEl).not.toBeNull();
    expect(eventuateEl?.parentNode).toBe(document.body);
    expect(eventuateEl?.classList.contains('eventuate-stale-results')).toBe(
      true
    );
  });
});

describe('eventDateFromResultsPageUrl for parkville URLs', () => {
  it('extracts date from parkville 2026-02-14 URL', () => {
    expect(
      eventDateFromResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/2026-02-14/'
      )
    ).toBe('2026-02-14');
  });

  it('extracts date from parkville 2026-02-21 URL', () => {
    expect(
      eventDateFromResultsPageUrl(
        'https://www.parkrun.com.au/parkville/results/2026-02-21/'
      )
    ).toBe('2026-02-21');
  });
});
