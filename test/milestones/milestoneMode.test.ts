import {
  isPreviewMilestonesParamEnabled,
  showPreviewMilestonesDisclaimer,
  useFiveKMilestoneExtensions,
} from '../../src/milestones/milestoneMode';

const august312026 = new Date(2026, 7, 31);
const september12026 = new Date(2026, 8, 1);

describe('isPreviewMilestonesParamEnabled', () => {
  it('returns true when eventuate-preview-milestones=true', () => {
    expect(
      isPreviewMilestonesParamEnabled('?eventuate-preview-milestones=true')
    ).toBe(true);
  });

  it('returns false when the parameter is absent', () => {
    expect(isPreviewMilestonesParamEnabled('')).toBe(false);
  });

  it('returns false when the parameter is present without value true', () => {
    expect(
      isPreviewMilestonesParamEnabled('?eventuate-preview-milestones')
    ).toBe(false);
    expect(
      isPreviewMilestonesParamEnabled('?eventuate-preview-milestones=false')
    ).toBe(false);
  });
});

describe('useFiveKMilestoneExtensions', () => {
  it('uses production milestones before 1 September 2026 without the preview param', () => {
    expect(useFiveKMilestoneExtensions('', august312026)).toBe(false);
  });

  it('uses preview milestones before 1 September 2026 when the preview param is set', () => {
    expect(
      useFiveKMilestoneExtensions(
        '?eventuate-preview-milestones=true',
        august312026
      )
    ).toBe(true);
  });

  it('uses preview milestones from 1 September 2026 regardless of the preview param', () => {
    expect(useFiveKMilestoneExtensions('', september12026)).toBe(true);
  });
});

describe(showPreviewMilestonesDisclaimer, () => {
  it('does not show a disclaimer for junior events', () => {
    expect(
      showPreviewMilestonesDisclaimer(
        2,
        '?eventuate-preview-milestones=true',
        august312026
      )
    ).toBe(false);
  });

  it('shows a disclaimer for 5km events before extensions go-live when the preview param is set', () => {
    expect(
      showPreviewMilestonesDisclaimer(
        5,
        '?eventuate-preview-milestones=true',
        august312026
      )
    ).toBe(true);
  });

  it('does not show a disclaimer after 5km extensions go-live', () => {
    expect(
      showPreviewMilestonesDisclaimer(
        5,
        '?eventuate-preview-milestones=true',
        september12026
      )
    ).toBe(false);
  });
});
