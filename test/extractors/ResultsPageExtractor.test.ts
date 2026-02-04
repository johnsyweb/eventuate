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

    it('extracts event date', () => {
      expect(extractor.eventDate).toEqual('22/02/2025');
    });

    it('extracts event number', () => {
      expect(extractor.eventNumber).toEqual('#321');
    });

    it('is not a launch event', () => {
      expect(extractor.isLaunchEvent()).toBe(false);
    });

    it('extracts finishers data', () => {
      expect(extractor.finishers).toHaveLength(138);
      expect(extractor.finishers[0]).toMatchObject({
        name: 'Shane MALLIA',
        agegroup: 'SM30-34',
        position: '1',
        time: '18:22',
        athleteID: 917370,
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
        expect(volunteers).toHaveLength(7);

        // RD: Didn't finish
        expect(volunteers[2]).toEqual({
          name: 'Pete JOHNS',
          link: '/brimbank/parkrunner/1001388/',
          athleteID: 1001388,
          agegroup: undefined,
          vols: NaN,
        });

        // Tailwalker: Finished
        expect(volunteers[1]).toEqual({
          name: 'Robyn DOIG',
          link: '/brimbank/parkrunner/8094033/',
          athleteID: 8094033,
          agegroup: 'VW70-74',
          vols: 33,
        });
      });
    });

    it('extracts facts', () => {
      expect(extractor.facts).toMatchObject({
        finishers: 4884,
        finishes: 23299,
        pbs: 3264,
        volunteers: 398,
      });
    });

    it('extracts running/walking groups', () => {
      expect(extractor.runningWalkingGroups).toHaveLength(9);
      expect(extractor.runningWalkingGroups[0]).toEqual('Keilor Running Club');
    });

    it('identifies first timers', () => {
      expect(extractor.firstTimersWithFinishCounts).toHaveLength(32);
      expect(extractor.firstTimersWithFinishCounts[0].name).toEqual('Tim CHIU');
      expect(extractor.firstTimersWithFinishCounts[0].finishes).toBeGreaterThan(
        1
      );
    });

    it('identifies PBs', () => {
      expect(extractor.finishersWithNewPBs).toHaveLength(21);
      expect(extractor.finishersWithNewPBs[0]).toEqual('Luke SOL (18:52)');
    });

    it('identifies unknown parkrunners', () => {
      expect(extractor.unknowns).toHaveLength(1);
      expect(extractor.unknowns[0]).toEqual('Unknown');
    });

    it('identifies newest parkrunners', () => {
      expect(extractor.newestParkrunners).toHaveLength(2);
      expect(extractor.newestParkrunners[0]).toEqual('Rasha MOSA');
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
});
