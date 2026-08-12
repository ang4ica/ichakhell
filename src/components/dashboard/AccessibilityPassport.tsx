// src/components/dashboard/AccessibilityPassport.tsx

import { useAthleteStore } from '../../store/useAthleteStore';

export function AccessibilityPassport() {
  const { profile } = useAthleteStore();
  const { accessibilitySettings, functionalProfile } = profile;

  return (
    <div className="bg-gradient-to-b from-dark-800 to-dark-900 border border-gold-500/30 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Passport Label */}
      <div className="absolute top-4 right-4 text-gold-500/10 font-serif text-8xl font-bold pointer-events-none select-none">
        PASSPORT
      </div>

      <header className="flex justify-between items-start border-b border-maroon-800/80 pb-4">
        <div>
          <span className="text-gold-500 font-serif text-xs uppercase tracking-widest">
            Official Athlete Identification
          </span>
          <h3 className="text-2xl font-serif text-cream-100 mt-1">{profile.name}</h3>
        </div>
        <span className="px-3 py-1 bg-maroon-900/80 border border-gold-500/40 text-gold-400 text-xs font-serif uppercase tracking-wider rounded">
          Active Passport
        </span>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-dark-900/80 p-3 rounded border border-maroon-900">
          <span className="block text-cream-400 text-[10px] uppercase">Gameplay Stance</span>
          <span className="font-serif text-cream-100 text-sm mt-0.5 block">
            {accessibilitySettings.seatedMode ? 'Seated Mode' : 'Standing Mode'}
          </span>
        </div>

        <div className="bg-dark-900/80 p-3 rounded border border-maroon-900">
          <span className="block text-cream-400 text-[10px] uppercase">Control Scheme</span>
          <span className="font-serif text-cream-100 text-sm mt-0.5 block">
            {accessibilitySettings.oneHandedMode ? 'One-Handed' : 'Standard Dual'}
          </span>
        </div>

        <div className="bg-dark-900/80 p-3 rounded border border-maroon-900">
          <span className="block text-cream-400 text-[10px] uppercase">Wheelchair Mode</span>
          <span className="font-serif text-cream-100 text-sm mt-0.5 block">
            {functionalProfile.usesWheelchair ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="bg-dark-900/80 p-3 rounded border border-maroon-900">
          <span className="block text-cream-400 text-[10px] uppercase">Aim Assist</span>
          <span className="font-serif text-gold-400 text-sm mt-0.5 block">
            {Math.round(accessibilitySettings.aimAssistSensitivity * 100)}% Intensity
          </span>
        </div>
      </div>
    </div>
  );
}