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
        });

        // Tailwalker: Finished
        expect(volunteers).toContainEqual({
          name: 'Zoran PETROVSKI',
          vols: 46,
          vClub: 25,
        });

        // New volunteer
        expect(volunteers).toContainEqual({
          name: 'Charles GAVRIEL',
          vols: 2,
          vClub: undefined,
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
});
