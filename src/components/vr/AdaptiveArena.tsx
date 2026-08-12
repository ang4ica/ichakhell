// src/components/vr/AdaptiveArena.tsx

import { CoachOverlay } from './CoachOverlay';
import { VRCanvasWrapper } from './VRCanvasWrapper';
import { SportRecommendation } from '../../engine/classificationEngine';

interface AdaptiveArenaProps {
  sport: SportRecommendation;
  onExit: () => void;
}

export function AdaptiveArena({ sport, onExit }: AdaptiveArenaProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden">
      {/* Top Header Control Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto bg-dark-800/90 backdrop-blur-md border border-maroon-800 px-5 py-2.5 rounded-xl shadow-2xl">
          <span className="text-[10px] text-gold-500 font-serif uppercase tracking-widest block">
            Adaptive Arena VR Active
          </span>
          <h2 className="text-xl font-serif text-cream-100">{sport.name}</h2>
        </div>

        <button
          onClick={onExit}
          className="pointer-events-auto bg-maroon-800 hover:bg-maroon-700 text-cream-100 text-xs font-serif uppercase tracking-wider px-5 py-2.5 rounded-xl border border-gold-500/50 transition shadow-2xl cursor-pointer"
        >
          ✕ End Session & Exit
        </button>
      </header>

      {/* AI Coaching Tips Overlay */}
      <CoachOverlay sportName={sport.name} adaptations={sport.adaptations} />

      {/* Interactive Aiming & Shooting Arena */}
      <VRCanvasWrapper sportName={sport.name} adaptations={sport.adaptations} />
    </div>
  );
}