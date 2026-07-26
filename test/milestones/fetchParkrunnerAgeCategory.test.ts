import { parseAgeCategoryFromParkrunnerProfileHtml } from '../../src/milestones/fetchParkrunnerAgeCategory';

describe(parseAgeCategoryFromParkrunnerProfileHtml, () => {
  it('extracts the most recent age category', () => {
    const html = `
      <p>
        Visit Aintree Reserve juniors results page<br>
        View summary stats for this parkrunner<br>
        Most recent age category was JM11-14
      </p>
    `;
    expect(parseAgeCategoryFromParkrunnerProfileHtml(html)).toBe('JM11-14');
  });

  it('returns undefined when the phrase is missing', () => {
    expect(
      parseAgeCategoryFromParkrunnerProfileHtml('<p>No age</p>')
    ).toBeUndefined();
  });
});
