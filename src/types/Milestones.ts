export type IconHex = `&#x${string};`;

export interface MilestoneCelebrations {
  clubName: string;
  icon: IconHex;
  names: string[];
}

export interface MilestoneDefinition {
  restricted_age?: 'J';
  icon: IconHex;
}
