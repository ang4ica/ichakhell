import { FunctionalProfile, AbilityLevel } from '../types/athlete';
import { SportDefinition, MatchScore } from '../types/sports';

const ABILITY_WEIGHTS: Record<AbilityLevel, number> = {
  fully: 1.0,
  partially: 0.75,
  limited: 0.4,
  none: 0.0,
  prefer_not_to_say: 0.5,
};

export class RecommendationEngine {
  public static calculateMatch(profile: FunctionalProfile, sport: SportDefinition): MatchScore {
    let baseScore = 70;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Evaluate Upper Limb Capability
    const upperScore = ABILITY_WEIGHTS[profile.upperLimbMobility];
    if (sport.id === 'archery') {
      if (upperScore >= 0.4) {
        baseScore += 15;
        reasons.push('✓ Excellent match for available upper-body control');
      }
      if (profile.gripStrength === 'limited' || profile.gripStrength === 'none') {
        reasons.push('✓ Supports quick-release and adaptive trigger systems');
      }
    }

    // Evaluate Wheelchair & Lower Limb Compatibility
    if (profile.usesWheelchair || profile.lowerLimbMobility === 'limited' || profile.lowerLimbMobility === 'none') {
      if (sport.id === 'basketball' || sport.id === 'boccia' || sport.id === 'archery') {
        baseScore += 15;
        reasons.push('✓ Fully optimized for seated and wheelchair participation');
      }
    }

    // Evaluate One-Handed Operation
    if (!profile.hasBothArms || profile.fineMotorControl === 'limited') {
      if (sport.requirements.oneHandedSupported) {
        baseScore += 10;
        reasons.push('✓ Fully operable using single-switch or one-handed mode');
      }
    }

    // Evaluate Vision Adaptation
    if (profile.vision === 'limited' || profile.vision === 'none') {
      if (sport.id === 'goalball') {
        baseScore += 25;
        reasons.push('✓ Primary sport designed around audio-tactile cues and spatial sound');
      } else {
        warnings.push('Requires audio-cue assist mode for optimal gameplay');
      }
    }

    const finalScore = Math.min(Math.max(baseScore, 40), 98);

    return {
      sportId: sport.id,
      matchPercentage: finalScore,
      reasons,
      warnings,
    };
  }

  public static getRecommendedSports(
    profile: FunctionalProfile,
    sportsList: SportDefinition[]
  ): MatchScore[] {
    return sportsList
      .map((sport) => this.calculateMatch(profile, sport))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}