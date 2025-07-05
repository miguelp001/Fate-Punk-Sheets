
export interface Skill {
  name: string;
  level: number;
}

export interface StressTrack {
  boxes: number;
  checked: boolean[];
}

export interface Consequences {
  mild: string;
  moderate: string;
  severe: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  highConcept: string;
  trouble: string;
  aspects: string[];
  skills: Skill[];
  stunts: string[];
  physicalStress: StressTrack;
  mentalStress: StressTrack;
  consequences: Consequences;
  fatePoints: number;
}
