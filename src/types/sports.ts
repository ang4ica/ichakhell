import { AbilityLevel } from './athlete';

export interface SportRequirement {
  minUpperLimb?: AbilityLevel;
  minLowerLimb?: AbilityLevel;
  minSittingStability?: AbilityLevel;
  minVision?: AbilityLevel;
  requiresWheelchair?: boolean;
  oneHandedSupported: boolean;
  seatedSupported: boolean;
}

export interface SportDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  skillsUsed: string[];
  accessibilityFeatures: string[];
  equipmentNeeded: string[];
  vrSupported: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requirements: SportRequirement;
  previewImageUrl: string;
  portalPosition: [number, number, number];
}

export interface MatchScore {
  sportId: string;
  matchPercentage: number;
  reasons: string[];
  warnings?: string[];
}       