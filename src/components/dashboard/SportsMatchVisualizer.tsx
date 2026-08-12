// src/components/dashboard/SportsMatchVisualizer.tsx

import { useState } from 'react';
import { useAthleteStore } from '../../store/useAthleteStore';
import { generateSportRecommendations, SportRecommendation } from '../../engine/classificationEngine';
import { VRSessionModal } from '../vr/VRSessionModal';

export function SportsMatchVisualizer() {
  const { profile, toggleFavoriteSport } = useAthleteStore();
  
  // Safely extract functional profile or fall back to profile itself
  const rawProfile = profile as unknown as Record<string, unknown>;
  const functionalProfileData = (rawProfile?.functionalProfile ?? rawProfile?.functional ?? profile) as any;
  
  const recommendations = generateSportRecommendations(functionalProfileData);
  const [activeSessionSport, setActiveSessionSport] = useState<SportRecommendation | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-maroon-800 pb-4">
        <div>
          <span className="text-gold-500 font-serif text-xs uppercase tracking-widest">
            AI Match Engine
          </span>
          <h2 className="text-2xl font-serif text-cream-100 mt-1">
            Recommended Adaptive Disciplines
          </h2>
        </div>
        <span className="text-xs text-cream-400">
          Dynamically Generated from Assessment Profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((sport) => {
          const rawFavs = (profile as unknown as Record<string, unknown>)?.favoriteSports as string[] | undefined;
          const isFavorite = rawFavs?.includes(sport.id) ?? false;

          return (
            <div
              key={sport.id}
              className="bg-dark-800 border border-maroon-800/80 hover:border-gold-500/50 rounded-xl p-6 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-serif text-gold-500 tracking-wider">
                    {sport.category}
                  </span>
                  <span className="px-2 py-0.5 bg-maroon-900 border border-gold-500/30 text-gold-400 text-xs font-serif rounded">
                    {sport.matchScore}% Match
                  </span>
                </div>

                <h3 className="text-xl font-serif text-cream-100">{sport.name}</h3>
                <p className="text-xs text-cream-400 mt-1">{sport.description}</p>

                <div className="mt-4 space-y-1.5">
                  <span className="text-[11px] text-cream-400 font-medium block uppercase tracking-wide">
                    Active Adaptations:
                  </span>
                  {sport.adaptations.map((item, idx) => (
                    <div key={idx} className="text-xs text-cream-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-maroon-900/60 flex items-center justify-between">
                <button
                  onClick={() => toggleFavoriteSport && toggleFavoriteSport(sport.id)}
                  className={`text-xs px-3 py-1.5 rounded font-serif uppercase tracking-wider border transition ${
                    isFavorite
                      ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                      : 'bg-dark-900 border-maroon-800 text-cream-300 hover:text-cream-100'
                  }`}
                >
                  {isFavorite ? '★ Favorited' : '☆ Favorite'}
                </button>

                <button
                  onClick={() => setActiveSessionSport(sport)}
                  className="text-xs px-4 py-1.5 bg-maroon-700 hover:bg-maroon-600 text-cream-100 font-serif uppercase tracking-wider rounded transition cursor-pointer"
                >
                  Launch VR
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Render VR Launcher Modal */}
      {activeSessionSport && (
        <VRSessionModal
          sport={activeSessionSport}
          onClose={() => setActiveSessionSport(null)}
          onStartMatch={() => {
            const sportToLaunch = activeSessionSport;
            setActiveSessionSport(null);
            if ((window as any).launchActiveSession) {
              (window as any).launchActiveSession(sportToLaunch);
            }
          }}
        />
      )}
    </div>
  );
}