export type AbilityLevel = 'fully' | 'partially' | 'limited' | 'none' | 'prefer_not_to_say';

export interface FunctionalProfile {
  lowerLimbMobility: AbilityLevel;
  upperLimbMobility: AbilityLevel;
  hasBothArms: boolean;
  hasBothLegs: boolean;
  affectedRegion: string[];
  usesProsthetic: boolean;
  usesWheelchair: boolean;
  wheelchairType?: 'manual' | 'power' | 'sports';
  gripStrength: AbilityLevel;
  armRangeOfMotion: AbilityLevel;
  legMovement: AbilityLevel;
  sittingStability: AbilityLevel;
  balance: AbilityLevel;
  vision: AbilityLevel;
  hearing: AbilityLevel;
  fineMotorControl: AbilityLevel;
  reactionSpeed: AbilityLevel;
}

export interface AccessibilitySettings {
  seatedMode: boolean;
  oneHandedMode: boolean;
  reducedMotion: boolean;
  cameraSmoothing: number; // 0.1 to 1.0
  uiScale: number;         // 1.0 to 2.0
  highContrast: boolean;
  audioCues: boolean;
  subtitles: boolean;
  voiceNavigation: boolean;
  aimAssistSensitivity: number; // 0.0 to 1.0
  customControls: Record<string, string>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'archery' | 'basketball' | 'boccia' | 'swimming' | 'goalball' | 'racing' | 'general';
}

export interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  preferredLanguage: string;
  functionalProfile: FunctionalProfile;
  accessibilitySettings: AccessibilitySettings;
  favoriteSports: string[];
  completedSessions: number;
  totalTrainingTimeMinutes: number;
  achievements: Achievement[];
  createdAt: string;
}