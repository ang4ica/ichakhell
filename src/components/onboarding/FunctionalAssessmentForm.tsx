// src/components/onboarding/FunctionalAssessmentForm.tsx

import React from 'react';
import { useAthleteStore } from '../../store/useAthleteStore';
import { AbilityLevel } from '../../types/athlete';

interface Option {
  label: string;
  value: AbilityLevel;
}

const ABILITY_OPTIONS: Option[] = [
  { label: 'Fully Available', value: 'fully' },
  { label: 'Partially Available', value: 'partially' },
  { label: 'Limited', value: 'limited' },
  { label: 'Not Available', value: 'none' },
  { label: 'Prefer Not to Answer', value: 'prefer_not_to_say' },
];

export function FunctionalAssessmentForm({ onComplete }: { onComplete: () => void }) {
  const { profile, updateFunctionalProfile } = useAthleteStore();
  const { functionalProfile } = profile;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 p-8 bg-dark-800 border border-maroon-800 rounded-xl text-cream-100">
      <header className="border-b border-maroon-800 pb-6">
        <span className="text-gold-500 font-serif text-xs uppercase tracking-widest">
          Adaptive Onboarding
        </span>
        <h2 className="text-3xl font-serif text-cream-100 mt-1">Functional Ability Profile</h2>
        <p className="text-cream-400 text-sm mt-2">
          We use functional capabilities—not medical diagnoses—to suggest compatible adaptive sports.
        </p>
      </header>

      {/* Mobility Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif text-gold-400 border-b border-maroon-900/60 pb-2">
          1. Mobility & Motion
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-cream-200">
              Lower-Limb Mobility
            </label>
            <select
              value={functionalProfile.lowerLimbMobility}
              onChange={(e) => updateFunctionalProfile({ lowerLimbMobility: e.target.value as AbilityLevel })}
              className="w-full bg-dark-900 border border-maroon-800 rounded p-3 text-cream-100 focus:border-gold-500 outline-none"
            >
              {ABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cream-200">
              Upper-Limb Mobility
            </label>
            <select
              value={functionalProfile.upperLimbMobility}
              onChange={(e) => updateFunctionalProfile({ upperLimbMobility: e.target.value as AbilityLevel })}
              className="w-full bg-dark-900 border border-maroon-800 rounded p-3 text-cream-100 focus:border-gold-500 outline-none"
            >
              {ABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={functionalProfile.usesWheelchair}
              onChange={(e) => updateFunctionalProfile({ usesWheelchair: e.target.checked })}
              className="w-5 h-5 accent-maroon-600 rounded"
            />
            <span className="text-sm text-cream-200">Wheelchair User</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={functionalProfile.usesProsthetic}
              onChange={(e) => updateFunctionalProfile({ usesProsthetic: e.target.checked })}
              className="w-5 h-5 accent-maroon-600 rounded"
            />
            <span className="text-sm text-cream-200">Uses Prosthetics</span>
          </label>
        </div>
      </section>

      {/* Control & Precision Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif text-gold-400 border-b border-maroon-900/60 pb-2">
          2. Fine Motor Control & Balance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-cream-200">
              Grip Strength
            </label>
            <select
              value={functionalProfile.gripStrength}
              onChange={(e) => updateFunctionalProfile({ gripStrength: e.target.value as AbilityLevel })}
              className="w-full bg-dark-900 border border-maroon-800 rounded p-3 text-cream-100 focus:border-gold-500 outline-none"
            >
              {ABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-cream-200">
              Sitting Stability
            </label>
            <select
              value={functionalProfile.sittingStability}
              onChange={(e) => updateFunctionalProfile({ sittingStability: e.target.value as AbilityLevel })}
              className="w-full bg-dark-900 border border-maroon-800 rounded p-3 text-cream-100 focus:border-gold-500 outline-none"
            >
              {ABILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="pt-6 border-t border-maroon-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-cream-400/70 max-w-lg">
          These settings configure VR controls and match percentages. You can modify them anytime.
        </p>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-maroon-700 hover:bg-maroon-600 border border-gold-500/40 text-cream-100 font-serif tracking-widest uppercase text-xs rounded transition shadow-maroon-glow"
        >
          Generate Profile & Recommendations
        </button>
      </div>
    </form>
  );
}