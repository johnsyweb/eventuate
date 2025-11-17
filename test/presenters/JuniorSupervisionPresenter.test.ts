import { JuniorSupervisionPresenter } from '../../src/presenters/JuniorSupervisionPresenter';
import { ResultsPageExtractor } from '../../src/extractors/ResultsPageExtractor';
import { Finisher } from '../../src/types/Finisher';

/**
 * @jest-environment jsdom
 */

function createMockExtractor(
  courseLength: number,
  finishers: Finisher[],
  eventName?: string
): ResultsPageExtractor {
  const mockDocument = document.implementation.createHTMLDocument();
  const extractor = {
    courseLength,
    finishers,
    eventName: eventName || 'Test parkrun',
    eventDate: '01/01/2025',
    eventNumber: '#1',
    unknowns: [],
    newestParkrunners: [],
    firstTimers: [],
    finishersWithNewPBs: [],
    runningWalkingGroups: [],
    facts: {
      finishers: 0,
      finishes: 0,
      volunteers: 0,
      pbs: 0,
    },
    resultsPageDocument: mockDocument,
  } as unknown as ResultsPageExtractor;

  return extractor;
}

describe('JuniorSupervisionPresenter', () => {
  const originalConsoleLog = console.log;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('for 5km events', () => {
    it('should not show message when there are no children', () => {
      const finishers = [
        new Finisher(
          'John SMITH',
          'SM30-34',
          '',
          'Male',
          '1',
          '10',
          '',
          '',
          '',
          '18:00'
        ),
        new Finisher(
          'Jane DOE',
          'SW25-29',
          '',
          'Female',
          '2',
          '5',
          '',
          '',
          '',
          '19:00'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
      expect(presenter.details()).toBe('');
    });

    it("should not show message when all children are within arm's reach (15 seconds)", () => {
      const finishers = [
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '1',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '2',
          '5',
          '',
          '',
          '',
          '20:10'
        ),
        new Finisher(
          'Adult BROWN',
          'SW25-29',
          '',
          'Female',
          '3',
          '5',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
      expect(presenter.details()).toBe('');
    });

    it('should show message when a child is more than 15 seconds ahead of nearest adult', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
      const details = presenter.details();
      expect(details).toContain("arm's reach");
      expect(details).toContain('5km parkrun events');
    });

    it('should show message when a child is more than 15 seconds behind nearest adult', () => {
      const finishers = [
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '1',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '2',
          '5',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
      expect(presenter.details()).toContain("arm's reach");
    });

    it('should show message when a child has no adults nearby', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
      expect(presenter.details()).toContain("arm's reach");
    });

    it('should find nearest adult correctly when multiple adults exist', () => {
      const finishers = [
        new Finisher(
          'Adult FAR',
          'SM30-34',
          '',
          'Male',
          '1',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '2',
          '5',
          '',
          '',
          '',
          '20:10'
        ),
        new Finisher(
          'Adult NEAR',
          'SW25-29',
          '',
          'Female',
          '3',
          '5',
          '',
          '',
          '',
          '20:11'
        ),
        new Finisher(
          'Adult FAR2',
          'VM40-44',
          '',
          'Male',
          '4',
          '5',
          '',
          '',
          '',
          '20:30'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });

    it("should handle multiple children, showing message if any are outside arm's reach", () => {
      const finishers = [
        new Finisher(
          'Child1',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult1',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:10'
        ),
        new Finisher(
          'Child2',
          'JW10',
          '',
          'Female',
          '3',
          '5',
          '',
          '',
          '',
          '20:30'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should handle children with missing time', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          undefined
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should handle invalid time format', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          'invalid'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should recognise Senior (S) age groups as adults', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM18-19',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:10'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });

    it('should recognise Veteran (V) age groups as adults', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'VM35-39',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:10'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });

    it('should recognise both JM10 and JW10 as under 11', () => {
      const finishers1 = [
        new Finisher(
          'Child1',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult1',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor1 = createMockExtractor(5, finishers1);
      const presenter1 = new JuniorSupervisionPresenter(extractor1);
      expect(presenter1.hasSupervisionIssue()).toBe(true);

      const finishers2 = [
        new Finisher(
          'Child2',
          'JW10',
          '',
          'Female',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult2',
          'SW25-29',
          '',
          'Female',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor2 = createMockExtractor(5, finishers2);
      const presenter2 = new JuniorSupervisionPresenter(extractor2);
      expect(presenter2.hasSupervisionIssue()).toBe(true);
    });

    it('should not recognise JM11-14 or JW11-14 as under 11', () => {
      const finishers = [
        new Finisher(
          'Older Child',
          'JM11-14',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });
  });

  describe('for junior parkrun (2km events)', () => {
    it('should not show message for junior parkrun events', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '10:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '10:30'
        ),
      ];
      const extractor = createMockExtractor(
        2,
        finishers,
        'Test junior parkrun'
      );
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
      expect(presenter.details()).toBe('');
    });
  });

  describe('diagnostic logging', () => {
    it('should log diagnostics when debug-juniors query parameter is present', () => {
      const extractor = createMockExtractor(5, [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ]);
      const getSearchStringMock = jest
        .fn()
        .mockReturnValue('?debug-juniors=true');
      const presenter = new (class extends JuniorSupervisionPresenter {
        protected getSearchString() {
          return getSearchStringMock();
        }
      })(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
      expect(console.log).toHaveBeenCalled();
      const logCall = (console.log as jest.Mock).mock.calls[0];
      expect(logCall[0]).toBe('Junior supervision check:');
    });

    it('should log diagnostics when log-juniors query parameter is present', () => {
      const extractor = createMockExtractor(5, [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ]);
      void new (class extends JuniorSupervisionPresenter {
        protected getSearchString() {
          return '?log-juniors=true';
        }
      })(extractor);

      expect(console.log).toHaveBeenCalled();
    });

    it('should not log diagnostics when query parameter is not present', () => {
      const extractor = createMockExtractor(5, [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ]);
      void new (class extends JuniorSupervisionPresenter {
        protected getSearchString() {
          return '';
        }
      })(extractor);

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should log correct diagnostic information', () => {
      const extractor = createMockExtractor(5, [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '20:20'
        ),
      ]);
      void new (class extends JuniorSupervisionPresenter {
        protected getSearchString() {
          return '?debug-juniors=true';
        }
      })(extractor);

      const logCall = (console.log as jest.Mock).mock.calls[0];
      expect(logCall[0]).toBe('Junior supervision check:');
      expect(logCall[1]).toMatchObject({
        child: {
          name: 'Child DOE',
          agegroup: 'JM10',
          time: '20:00',
          position: '1',
        },
        nearestAdult: {
          name: 'Adult SMITH',
          agegroup: 'SM30-34',
          time: '20:20',
          position: '2',
        },
        timeDeltaSeconds: 20,
      });
    });

    it('should log null for nearestAdult when no adults exist', () => {
      const extractor = createMockExtractor(5, [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
      ]);
      void new (class extends JuniorSupervisionPresenter {
        protected getSearchString() {
          return '?debug-juniors=true';
        }
      })(extractor);

      const logCall = (console.log as jest.Mock).mock.calls[0];
      expect(logCall[1]).toMatchObject({
        child: {
          name: 'Child DOE',
          agegroup: 'JM10',
          time: '20:00',
          position: '1',
        },
        nearestAdult: null,
        timeDeltaSeconds: null,
      });
    });
  });

  describe('edge cases', () => {
    it("should handle exactly 15 seconds difference as within arm's reach", () => {
      const finishers = [
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '1',
          '10',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '2',
          '5',
          '',
          '',
          '',
          '20:15'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });

    it('should handle times over 1 hour', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '1:00:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          '1:00:20'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should correctly parse times in HH:MM:SS format', () => {
      const finishers = [
        new Finisher(
          'Child KOOCHEW',
          'JM10',
          '',
          'Male',
          '275',
          '5',
          '',
          '',
          '',
          '1:15:27'
        ),
        new Finisher(
          'Adult MACIVOR',
          'VW35-39',
          '',
          'Female',
          '277',
          '10',
          '',
          '',
          '',
          '1:15:28'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(false);
    });

    it('should correctly calculate time delta for times over 1 hour', () => {
      const finishers = [
        new Finisher(
          'Child KOOCHEW',
          'JM10',
          '',
          'Male',
          '275',
          '5',
          '',
          '',
          '',
          '1:15:27'
        ),
        new Finisher(
          'Adult MACIVOR',
          'VW35-39',
          '',
          'Female',
          '277',
          '10',
          '',
          '',
          '',
          '1:15:45'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should handle adults with missing time', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          undefined
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });

    it('should handle adults with invalid time format', () => {
      const finishers = [
        new Finisher(
          'Child DOE',
          'JM10',
          '',
          'Male',
          '1',
          '5',
          '',
          '',
          '',
          '20:00'
        ),
        new Finisher(
          'Adult SMITH',
          'SM30-34',
          '',
          'Male',
          '2',
          '10',
          '',
          '',
          '',
          'invalid'
        ),
      ];
      const extractor = createMockExtractor(5, finishers);
      const presenter = new JuniorSupervisionPresenter(extractor);

      expect(presenter.hasSupervisionIssue()).toBe(true);
    });
  });
});
