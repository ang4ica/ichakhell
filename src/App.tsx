// src/App.tsx

import { useState } from 'react';
import { FunctionalAssessmentForm } from './components/onboarding/FunctionalAssessmentForm';
import { AccessibilityPassport } from './components/dashboard/AccessibilityPassport';
import { SportsMatchVisualizer } from './components/dashboard/SportsMatchVisualizer';
import { AdaptiveArena } from './components/vr/AdaptiveArena';
import { useAthleteStore } from './store/useAthleteStore';
import { SportRecommendation } from './engine/classificationEngine';

export function App() {
  const store = useAthleteStore();
  const isOnboarded = store?.isOnboarded ?? false;
  const [showAssessment, setShowAssessment] = useState(!isOnboarded);
  const [activeVRMatch, setActiveVRMatch] = useState<SportRecommendation | null>(null);

  // Global handler to trigger full-screen VR session
  (window as any).launchActiveSession = (sport: SportRecommendation) => {
    setActiveVRMatch(sport);
  };

  if (activeVRMatch) {
    return (
      <AdaptiveArena
        sport={activeVRMatch}
        onExit={() => setActiveVRMatch(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-cream-100 font-sans p-6 md:p-12">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-maroon-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-cream-100">
            ADAPTIVE ARENA
          </h1>
          <p className="text-xs text-gold-500 tracking-widest uppercase mt-1">
            Immersive VR Sports & Classification Platform
          </p>
        </div>

        <button
          onClick={() => setShowAssessment(!showAssessment)}
          className="text-xs px-4 py-2 border border-maroon-700 hover:border-gold-500 text-cream-200 font-serif uppercase tracking-wider rounded transition cursor-pointer"
        >
          {showAssessment ? 'View Dashboard' : 'Edit Capabilities'}
        </button>
      </header>

      <main className="max-w-7xl mx-auto">
        {showAssessment ? (
          <FunctionalAssessmentForm onComplete={() => setShowAssessment(false)} />
        ) : (
          <div className="space-y-12">
            <AccessibilityPassport />
            <SportsMatchVisualizer />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;