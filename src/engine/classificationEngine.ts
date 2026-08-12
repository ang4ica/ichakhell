// src/engine/classificationEngine.ts

import { FunctionalProfile } from '../types/athlete';

export interface SportRecommendation {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  adaptations: string[];
  description: string;
}

export function generateSportRecommendations(
  profile: FunctionalProfile
): SportRecommendation[] {
  // Extract profile values with safe record casting to accommodate varied field names
  const rawProfile = profile as unknown as Record<string, unknown>;

  const upperLimbMobility = String(rawProfile.upperLimbMobility ?? 'full');
  const stance = String(rawProfile.stance ?? rawProfile.gameplayStance ?? 'seated');
  const visionSupport = String(rawProfile.visionSupport ?? rawProfile.visualSupport ?? 'none');
  const handGripStrength = String(rawProfile.handGripStrength ?? rawProfile.gripStrength ?? 'moderate');

  // 1. Adaptive Archery
  let archeryScore = 70;
  const archeryAdaptations: string[] = [];

  if (stance === 'seated') {
    archeryScore += 15;
    archeryAdaptations.push('Seated Target Anchor Active');
  } else {
    archeryAdaptations.push('Standing Stabilizer Mode');
  }

  if (handGripStrength === 'low' || handGripStrength === 'limited') {
    archeryScore += 10;
    archeryAdaptations.push('Single-Trigger Auto-Release');
  } else {
    archeryAdaptations.push('Dual-Grip Tension Assist');
  }

  if (visionSupport !== 'none' && visionSupport !== 'undefined') {
    archeryScore += 5;
    archeryAdaptations.push('Spatial Audio & High-Contrast Reticle');
  }

  // 2. Wheelchair Basketball / Track
  let basketballScore = 60;
  const basketballAdaptations: string[] = [];

  if (stance === 'seated') {
    basketballScore += 25;
    basketballAdaptations.push('Wheelchair Controller Mapping');
  }

  if (upperLimbMobility === 'full' || upperLimbMobility === 'high') {
    basketballScore += 10;
    basketballAdaptations.push('Manual Propulsion Input');
  } else {
    basketballAdaptations.push('Upper-Limb Throw & Speed Assist');
  }

  // 3. Boccia Precision
  let bocciaScore = 80;
  const bocciaAdaptations: string[] = [];

  if (upperLimbMobility === 'limited' || handGripStrength === 'low') {
    bocciaScore += 18;
    bocciaAdaptations.push('Ramp Control Elevation Support');
  }

  if (visionSupport === 'high_contrast') {
    bocciaScore += 2;
    bocciaAdaptations.push('Enhanced Sphere Contrast');
  }
  bocciaAdaptations.push('Voice Command Target Selector');

  return [
    {
      id: 'archery',
      name: 'Adaptive Archery VR',
      category: 'Precision & Target',
      matchScore: Math.min(archeryScore, 99),
      adaptations: archeryAdaptations,
      description: 'Precision target shooting dynamic visual reticles and custom draw-tension assists.',
    },
    {
      id: 'wheelchair_basketball',
      name: 'Wheelchair Basketball',
      category: 'Team & Speed',
      matchScore: Math.min(basketballScore, 99),
      adaptations: basketballAdaptations,
      description: 'Fast-paced court action mapped for specialized seated motion tracking.',
    },
    {
      id: 'boccia',
      name: 'Boccia Tactical VR',
      category: 'Tactical Strategy',
      matchScore: Math.min(bocciaScore, 99),
      adaptations: bocciaAdaptations,
      description: 'Strategic ball placement with fine-tuned force output and switch controls.',
    },
  ].sort((a, b) => b.matchScore - a.matchScore);
}