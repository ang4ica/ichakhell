// src/store/useAthleteStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AthleteProfile, FunctionalProfile, AccessibilitySettings } from '../types/athlete';

interface AthleteStore {
  profile: AthleteProfile;
  isOnboarded: boolean;
  updateBasicInfo: (name: string, age: number, language: string) => void;
  updateFunctionalProfile: (profile: Partial<FunctionalProfile>) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  toggleFavoriteSport: (sportId: string) => void;
  completeSession: (minutes: number) => void;
  resetProfile: () => void;
}

const defaultProfile: AthleteProfile = {
  id: 'ath_default',
  name: 'Alex Vance',
  age: 28,
  preferredLanguage: 'English',
  createdAt: new Date().toISOString(),
  completedSessions: 5,
  totalTrainingTimeMinutes: 75,
  favoriteSports: ['archery', 'basketball'],
  achievements: [
    {
      id: 'first_bullseye',
      title: 'First Bullseye',
      description: 'Hit the center ring in Archery VR',
      icon: '🎯',
      unlockedAt: new Date().toISOString(),
      category: 'archery',
    },
  ],
  functionalProfile: {
    lowerLimbMobility: 'limited',
    upperLimbMobility: 'fully',
    hasBothArms: true,
    hasBothLegs: true,
    affectedRegion: ['lower_leg'],
    usesProsthetic: false,
    usesWheelchair: true,
    wheelchairType: 'sports',
    gripStrength: 'fully',
    armRangeOfMotion: 'fully',
    legMovement: 'limited',
    sittingStability: 'fully',
    balance: 'partially',
    vision: 'fully',
    hearing: 'fully',
    fineMotorControl: 'fully',
    reactionSpeed: 'fully',
  },
  accessibilitySettings: {
    seatedMode: true,
    oneHandedMode: false,
    reducedMotion: false,
    cameraSmoothing: 0.8,
    uiScale: 1.0,
    highContrast: false,
    audioCues: true,
    subtitles: true,
    voiceNavigation: false,
    aimAssistSensitivity: 0.5,
    customControls: {},
  },
};

export const useAthleteStore = create<AthleteStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      isOnboarded: true,
      updateBasicInfo: (name: string, age: number, language: string) =>
        set((state) => ({
          profile: { ...state.profile, name, age, preferredLanguage: language },
        })),
      updateFunctionalProfile: (newProfile: Partial<FunctionalProfile>) =>
        set((state) => ({
          profile: {
            ...state.profile,
            functionalProfile: { ...state.profile.functionalProfile, ...newProfile },
          },
        })),
      updateAccessibilitySettings: (newSettings: Partial<AccessibilitySettings>) =>
        set((state) => ({
          profile: {
            ...state.profile,
            accessibilitySettings: { ...state.profile.accessibilitySettings, ...newSettings },
          },
        })),
      toggleFavoriteSport: (sportId: string) =>
        set((state) => {
          const favorites = state.profile.favoriteSports.includes(sportId)
            ? state.profile.favoriteSports.filter((id) => id !== sportId)
            : [...state.profile.favoriteSports, sportId];
          return { profile: { ...state.profile, favoriteSports: favorites } };
        }),
      completeSession: (minutes: number) =>
        set((state) => ({
          profile: {
            ...state.profile,
            completedSessions: state.profile.completedSessions + 1,
            totalTrainingTimeMinutes: state.profile.totalTrainingTimeMinutes + minutes,
          },
        })),
      resetProfile: () => set({ profile: defaultProfile, isOnboarded: false }),
    }),
    { name: 'adaptive_arena_athlete_data' }
  )
);