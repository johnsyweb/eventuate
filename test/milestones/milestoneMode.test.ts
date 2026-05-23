import {
  isPreviewMilestonesParamEnabled,
  showPreviewMilestonesDisclaimer,
  useFiveKMilestoneExtensions,
  useJuniorFinisherMilestones,
} from '../../src/milestones/milestoneMode';

const june302026 = new Date(2026, 5, 30);
const july12026 = new Date(2026, 6, 1);
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

describe('useJuniorFinisherMilestones', () => {
  it('uses production milestones before 1 July 2026 without the preview param', () => {
    expect(useJuniorFinisherMilestones('', june302026)).toBe(false);
  });

  it('uses preview milestones before 1 July 2026 when the preview param is set', () => {
    expect(
      useJuniorFinisherMilestones(
        '?eventuate-preview-milestones=true',
        june302026
      )
    ).toBe(true);
  });

  it('uses preview milestones from 1 July 2026 regardless of the preview param', () => {
    expect(useJuniorFinisherMilestones('', july12026)).toBe(true);
    expect(
      useJuniorFinisherMilestones(
        '?eventuate-preview-milestones=true',
        july12026
      )
    ).toBe(true);
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
  it('shows a disclaimer for junior events before go-live when the preview param is set', () => {
    expect(
      showPreviewMilestonesDisclaimer(
        2,
        '?eventuate-preview-milestones=true',
        june302026
      )
    ).toBe(true);
  });

  it('does not show a disclaimer after junior go-live', () => {
    expect(
      showPreviewMilestonesDisclaimer(
        2,
        '?eventuate-preview-milestones=true',
        july12026
      )
    ).toBe(false);
  });
});
