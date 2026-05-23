/**
 * @jest-environment jsdom
 */

import { eventuate, upsertPreviewMilestonesBanner } from '../src/index';
import { getCurrentHref } from '../src/currentUrl';
import fs from 'fs';
import path from 'path';

jest.mock('../src/currentUrl', () => ({
  getCurrentHref: jest.fn(),
}));

describe(upsertPreviewMilestonesBanner, () => {
  let eventuateDiv: HTMLDivElement;

  beforeEach(() => {
    eventuateDiv = document.createElement('div');
    eventuateDiv.id = 'eventuate';
    document.body.appendChild(eventuateDiv);
  });

  afterEach(() => {
    eventuateDiv.remove();
  });

  it('inserts a visible preview paragraph at the top of the eventuate block', () => {
    upsertPreviewMilestonesBanner(
      eventuateDiv,
      'Preview: milestone clubs use upcoming parkrun rules.'
    );

    const preview = document.getElementById('previewMilestones');
    expect(preview).not.toBeNull();
    expect(preview?.textContent).toContain('Preview: milestone clubs');
    expect(eventuateDiv.firstChild).toBe(preview);
  });

  it('removes the preview paragraph when message is null', () => {
    upsertPreviewMilestonesBanner(eventuateDiv, 'Preview message');
    upsertPreviewMilestonesBanner(eventuateDiv, null);
    expect(document.getElementById('previewMilestones')).toBeNull();
  });
});

describe('preview milestones display with eventuate()', () => {
  const previewUrl =
    'https://www.parkrun.com.au/kirkdalereserve/results/2026-05-23/?eventuate-preview-milestones=true';

  const fixturePath = path.join(
    __dirname,
    'fixtures',
    'results-brimbank-parkrun.html'
  );

  beforeEach(() => {
    jest.mocked(getCurrentHref).mockReturnValue(previewUrl);
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 4, 23));
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.body.innerHTML = new DOMParser().parseFromString(
      html,
      'text/html'
    ).body.innerHTML;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the preview milestones banner when the preview param is set before go-live', () => {
    eventuate();

    const preview = document.getElementById('previewMilestones');
    expect(preview).not.toBeNull();
    expect(preview?.textContent).toMatch(/Preview: milestone clubs/);
  });
});
