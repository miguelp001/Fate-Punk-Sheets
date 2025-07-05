
import type { Character, Skill } from './types';

export const FATE_CORE_SKILLS: string[] = [
  "Athletics", "Burglary", "Contacts", "Crafts", "Deceive", "Drive",
  "Empathy", "Fight", "Investigate", "Lore", "Notice", "Physique",
  "Provoke", "Rapport", "Resources", "Shoot", "Stealth", "Will"
];

export const createDefaultSkills = (): Skill[] => {
  return FATE_CORE_SKILLS.map(name => ({ name, level: 0 }));
};

export const createDefaultCharacter = (): Character => ({
  id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  name: "New Punk",
  description: "Anarchy in the U.K.",
  highConcept: "High Concept Aspect",
  trouble: "Trouble Aspect",
  aspects: ["", "", ""],
  skills: createDefaultSkills(),
  stunts: ["My Awesome Stunt"],
  physicalStress: { boxes: 2, checked: [false, false] },
  mentalStress: { boxes: 2, checked: [false, false] },
  consequences: {
    mild: "",
    moderate: "",
    severe: "",
  },
  fatePoints: 3,
});
