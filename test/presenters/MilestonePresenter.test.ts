import { MilestonePresenter } from '../../src/presenters/MilestonePresenter';
import { MilestoneCelebrations } from '../../src/types/Milestones';

describe('MilestonePresenter', () => {
  it('is empty when nothing to celebrate', () => {
    expect(new MilestonePresenter([]).details()).toBe('');
  });
});

describe('MilestonePresenter', () => {
  it('is empty when nothing to celebrate', () => {
    expect(new MilestonePresenter([]).details()).toBe('');
  });

  it('shows one milestone celebration', () => {
    const milestones: MilestoneCelebrations[] = [
      {
        icon: '&#x1F534;',
        clubName: '50',
        names: ['Jane Smith'],
      },
    ];

    const presenter = new MilestonePresenter(milestones);
    expect(presenter.title()).toBe(
      'Three cheers to the parkrunner who joined a new parkrun milestone club this weekend:<br>'
    );
    expect(presenter.details()).toBe('&#x1F534; Jane Smith joined the 50-club');
  });

  it('shows two people sharing one milestone celebration', () => {
    const milestones: MilestoneCelebrations[] = [
      {
        icon: '&#x1F534;',
        clubName: '50',
        names: ['Jane Smith', 'Bob Smith'],
      },
    ];

    const presenter = new MilestonePresenter(milestones);
    expect(presenter.title()).toBe(
      'Three cheers to the 2 parkrunners who joined a new parkrun milestone club this weekend:<br>'
    );
    expect(presenter.details()).toBe(
      '&#x1F534; Bob Smith and Jane Smith joined the 50-club'
    );
  });

  it('shows two people sharing one milestone celebration and another on the next milestone', () => {
    const milestones: MilestoneCelebrations[] = [
      {
        icon: '&#x1F534;',
        clubName: '50',
        names: ['Jane Smith', 'Bob Smith'],
      },
      {
        icon: '&#x1F535;',
        clubName: '100',
        names: ['Scott the Centurion'],
      },
    ];

    const presenter = new MilestonePresenter(milestones);
    expect(presenter.title()).toBe(
      'Three cheers to the 3 parkrunners who joined a new parkrun milestone club this weekend:<br>'
    );
    expect(presenter.details()).toBe(
      '&#x1F534; Bob Smith and Jane Smith joined the 50-club<br>' +
        '&#x1F535; Scott the Centurion joined the 100-club'
    );
  });
});
