import { ResultsPageExtractor } from '../../src/extractors/ResultsPageExtractor';
import { milestoneCelebrationsForEvent } from '../../src/milestones/milestoneCelebrationsForEvent';
function juniorDocument(options?: {
  volunteerCredits?: string;
  volunteerClubClass?: string;
  volunteerClubText?: string;
}): Document {
  const volunteerRow =
    options?.volunteerCredits === undefined
      ? ''
      : `<tr class="Volunteers-table-row" data-name="Rachel SINGLETON"
          data-volunteercredits="${options.volunteerCredits}">
          <td class="Volunteers-table-td Volunteers-table-td--name">
            <a href="/event/parkrunner/540657">Rachel SINGLETON</a>
            ${
              options.volunteerClubClass
                ? `<a href="https://parkrun.me/milestone-clubs"
              class="${options.volunteerClubClass} Results-table--clubIcon">${options.volunteerClubText ?? 'v100'}</a>`
                : ''
            }
          </td>
        </tr>`;
  const html = `<!DOCTYPE html><html><body>
    <div class="Results-header"><h1>Example junior parkrun</h1><h3><span>#1</span></div>
    <div class="aStat"><span class="num">1</span></div>
    <div class="aStat"><span class="num">1</span></div>
    <div class="aStat"><span class="num">1</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <table><tr class="Results-table-row" data-name="Alex" data-agegroup="JW10"
      data-club="" data-gender="Female" data-position="1" data-runs="25" data-vols="0"
      data-agegrade="60%"><td class="Results-table-td--name"><a href="/p/1">Alex</a></td>
      <td class="Results-table-td--time"><span class="compact">10:00</span></td></tr>
      ${volunteerRow}
    </table>
  </body></html>`;
  return new DOMParser().parseFromString(html, 'text/html');
}

describe(milestoneCelebrationsForEvent, () => {
  it('celebrates live junior finisher milestones for junior participants', () => {
    const extractor = new ResultsPageExtractor(juniorDocument());
    const celebrations = milestoneCelebrationsForEvent(extractor, '');

    expect(celebrations).toEqual([
      {
        clubName: 'junior parkrun 25',
        icon: '&#x1F7E7;',
        names: ['Alex'],
      },
    ]);
  });

  it('celebrates Volunteer milestones synchronously on junior pages', () => {
    const extractor = new ResultsPageExtractor(
      juniorDocument({
        volunteerCredits: '100',
        volunteerClubClass: 'milestone-v100 Results-table--v100club',
        volunteerClubText: '100 volunteer milestone',
      })
    );
    const celebrations = milestoneCelebrationsForEvent(extractor, '');

    expect(celebrations).toEqual([
      {
        clubName: 'Volunteer 100',
        icon: '&#x1F5A4;',
        names: ['Rachel'],
      },
      {
        clubName: 'junior parkrun 25',
        icon: '&#x1F7E7;',
        names: ['Alex'],
      },
    ]);
  });
});

function fiveKDocument(runs: string): Document {
  const html = `<!DOCTYPE html><html><body>
    <div class="Results-header"><h1>Example parkrun</h1><h3><span>#1</span></div>
    <div class="aStat"><span class="num">1</span></div>
    <div class="aStat"><span class="num">1</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <div class="aStat"><span class="num">0</span></div>
    <table><tr class="Results-table-row" data-name="Sam" data-agegroup="VM50"
      data-club="" data-gender="Male" data-position="1" data-runs="${runs}" data-vols="0"
      data-agegrade="60%"><td class="Results-table-td--name"><a href="/p/2">Sam</a></td>
      <td class="Results-table-td--time"><span class="compact">20:00</span></td></tr></table>
  </body></html>`;
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('milestoneCelebrationsForEvent on 5k events', () => {
  it('adds the 200 club when extensions are enabled', () => {
    const extractor = new ResultsPageExtractor(fiveKDocument('200'));
    const celebrations = milestoneCelebrationsForEvent(
      extractor,
      '?eventuate-preview-milestones=true',
      new Date(2026, 7, 15)
    );

    expect(celebrations).toEqual([
      { clubName: '200', icon: '&#x26AB;', names: ['Sam'] },
    ]);
  });
});
