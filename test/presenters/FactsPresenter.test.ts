import { FactsPresenter } from '../../src/presenters/FactsPresenter';

describe('FactsPresenter', () => {
  it('builds the facts details string', () => {
    const presenter = new FactsPresenter('Test parkrun', 5, {
      finishers: 12,
      finishes: 34,
      volunteers: 3,
      pbs: 4,
    });

    const details = presenter.details();

    expect(details).toBe(
      'Since Test parkrun started 12 brilliant parkrunners have had their barcodes scanned, and a grand total of 34 finishers have covered a total distance of 170 km, while celebrating 4 personal bests. We shall always be grateful to each of our 3 wonderful volunteers for their contributions'
    );
  });

  it('falls back to default parkrun name when missing', () => {
    const presenter = new FactsPresenter(undefined, 2, {
      finishers: 1,
      finishes: 2,
      volunteers: 1,
      pbs: 0,
    });

    const details = presenter.details();

    expect(details).toContain('Since parkrun started ');
  });
});
