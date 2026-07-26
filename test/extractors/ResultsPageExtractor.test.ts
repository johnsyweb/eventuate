import { ResultsPageExtractor } from '../../src/extractors/ResultsPageExtractor';
import fs from 'fs';
import path from 'path';

/**
 * @jest-environment jsdom
 */

describe('ResultsPageExtractor', () => {
  let document: Document;
  let extractor: ResultsPageExtractor;

  describe('for a 5k event', () => {
    beforeEach(() => {
      const html = fs.readFileSync(
        path.join(
          __dirname,
          '../../test/fixtures/results-brimbank-parkrun.html'
        ),
        'utf8'
      );
      document = new DOMParser().parseFromString(html, 'text/html');
      extractor = new ResultsPageExtractor(document);
    });

    it('extracts event name', () => {
      expect(extractor.eventName).toBe('Brimbank parkrun');
    });

    it('sets correct course length', () => {
      expect(extractor.courseLength).toBe(5);
    });

    it('extracts event number', () => {
      expect(extractor.eventNumber).toEqual('#374');
    });

    it('is not a launch event', () => {
      expect(extractor.isLaunchEvent()).toBe(false);
    });

    it('extracts finishers data', () => {
      expect(extractor.finishers).toHaveLength(118);
      expect(extractor.finishers[0]).toMatchObject({
        name: 'Felix ALLEN',
        agegroup: 'JM15-17',
        position: '1',
        time: '21:26',
        athleteID: 10317928,
      });
    });

    describe('removeSurnameFromJunior', () => {
      it('returns full name for 5k events', () => {
        expect(extractor.removeSurnameFromJunior('John DOE')).toBe('John DOE');
      });
    });

    describe('volunteersList', () => {
      it('extracts volunteers data', () => {
        const volunteers = extractor.volunteersList();
        expect(volunteers).toHaveLength(8);

        // RD: Didn't finish
        expect(volunteers).toContainEqual({
          name: 'Amanda SHINTON',
          vols: 234,
          vClub: 100,
          athleteID: 4144103,
          profileUrl: expect.stringContaining('/brimbank/parkrunner/4144103'),
        });

        // Tailwalker: Finished
        expect(volunteers).toContainEqual({
          name: 'Zoran PETROVSKI',
          vols: 46,
          vClub: 25,
          athleteID: expect.any(Number),
          profileUrl: expect.stringMatching(/parkrunner\/\d+/),
        });

        // New volunteer
        expect(volunteers).toContainEqual({
          name: 'Charles GAVRIEL',
          vols: 2,
          vClub: undefined,
          athleteID: 10296588,
          profileUrl: expect.stringContaining('/brimbank/parkrunner/10296588'),
        });
      });
    });

    it('extracts facts', () => {
      expect(extractor.facts).toMatchObject({
        finishers: 6025,
        finishes: 29013,
        pbs: 3975,
        volunteers: 438,
      });
    });

    it('extracts running/walking groups', () => {
      expect(extractor.runningWalkingGroups).toHaveLength(6);
      expect(extractor.runningWalkingGroups).toEqual(
        expect.arrayContaining([
          'Crosbie Crew',
          'Aberfeldie Masters Running Team',
          'Keilor Running Club',
          'Red and Black Running',
          'RUN THE WORLD',
          'Macedon Ranges Running Club',
        ])
      );
    });

    it('identifies first timers', () => {
      expect(extractor.firstTimersWithFinishCounts).toHaveLength(20);
      expect(extractor.firstTimersWithFinishCounts[0].name).toEqual(
        'Felix ALLEN'
      );
      expect(extractor.firstTimersWithFinishCounts[0].finishes).toBeGreaterThan(
        1
      );
    });

    it('identifies PBs', () => {
      expect(extractor.finishersWithNewPBs).toHaveLength(19);
      expect(extractor.finishersWithNewPBs[0]).toEqual('Hayden WEST (21:47)');
    });

    it('identifies unknown parkrunners', () => {
      expect(extractor.unknowns).toHaveLength(3);
      expect(extractor.unknowns[0]).toEqual('Unknown');
    });

    it('identifies newest parkrunners', () => {
      expect(extractor.newestParkrunners).toHaveLength(2);
      expect(extractor.newestParkrunners).toEqual(
        expect.arrayContaining(['Brayden RIZZO', 'Jake MARRA'])
      );
    });
  });

  describe('for a launch event', () => {
    beforeEach(() => {
      const html = `
        <div class="Results-header">
          <h1>Test parkrun</h1>
          <h3><span>Event</span><span>#1</span></h3>
        </div>
      `;
      document = new DOMParser().parseFromString(html, 'text/html');
      extractor = new ResultsPageExtractor(document);
    });

    it('is a launch event', () => {
      expect(extractor.isLaunchEvent()).toBe(true);
    });
  });

  describe('volunteer club icons', () => {
    it('reads the club number from the milestone-v class when link text is not vN', () => {
      const html = `<!DOCTYPE html><html><body>
        <div class="Results-header"><h1>Example junior parkrun</h1><h3><span>#1</span></h3></div>
        <div class="aStat"><span class="num">1</span></div>
        <div class="aStat"><span class="num">1</span></div>
        <div class="aStat"><span class="num">1</span></div>
        <div class="aStat"><span class="num">0</span></div>
        <div class="aStat"><span class="num">0</span></div>
        <table><tr class="Volunteers-table-row" data-name="Rachel SINGLETON"
          data-volunteercredits="100">
          <td class="Volunteers-table-td Volunteers-table-td--name">
            <a href="/event/parkrunner/540657">Rachel SINGLETON</a>
            <a href="https://parkrun.me/milestone-clubs"
              class="milestone-v100 Results-table--clubIcon Results-table--v100club">100 volunteer milestone</a>
          </td>
        </tr></table>
      </body></html>`;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const volunteers = new ResultsPageExtractor(doc).volunteersList();
      expect(volunteers).toContainEqual(
        expect.objectContaining({
          name: 'Rachel',
          vols: 100,
          vClub: 100,
          athleteID: 540657,
        })
      );
    });
  });
});
