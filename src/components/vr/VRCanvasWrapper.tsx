// src/components/vr/VRCanvasWrapper.tsx

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { StadiumEnvironment } from './StadiumEnvironment';
import { FirstPersonController } from './FirstPersonController';
import { ThreeArenaScene } from './ThreeArenaScene';

const store = createXRStore();

interface VRCanvasWrapperProps {
  sportName: string;
  adaptations: string[];
}

export function VRCanvasWrapper({ sportName, adaptations }: VRCanvasWrapperProps) {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [lastShotScore, setLastShotScore] = useState<number | null>(null);

  const isArchery = sportName.toLowerCase().includes('archery');

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr
        ?.isSessionSupported('immersive-vr')
        ?.then((supported: boolean) => setIsXRSupported(supported))
        ?.catch(() => setIsXRSupported(false));
    }
  }, []);

  const handleHit = (points = 10) => {
    setScore((prev) => prev + points);
    setShots((prev) => prev + 1);
    setHits((prev) => prev + 1);
    setLastShotScore(points);
  };

  const handleMiss = () => {
    setShots((prev) => prev + 1);
    setLastShotScore(0);
  };

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 100;

  return (
    <div className="relative w-full h-full bg-dark-900 select-none overflow-hidden">
      {/* Top Experience Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
        {isXRSupported ? (
          <button
            onClick={() => store.enterVR()}
            className="px-6 py-2.5 bg-gold-500 text-dark-900 font-serif font-bold uppercase rounded-xl border border-gold-400 shadow-2xl cursor-pointer hover:bg-gold-400 transition"
          >
            🥽 ENTER VR
          </button>
        ) : (
          <div className="bg-dark-800/90 border border-maroon-800/80 px-4 py-1.5 rounded-full text-[11px] text-cream-400 font-mono shadow-lg backdrop-blur-md">
            🖥️ DESKTOP MODE — Click screen to aim (Hold Left-Click to draw, release to shoot)
          </div>
        )}
      </div>

      {/* 🎯 ARCHERY PROFESSIONAL BROADCAST TELEMETRY HUD */}
      <div className="absolute top-6 right-6 z-40 bg-dark-900/90 border border-gold-500/30 p-4 rounded-2xl w-64 text-cream-100 shadow-2xl backdrop-blur-md font-mono">
        <div className="flex items-center justify-between border-b border-gold-500/20 pb-2 mb-3">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
            {isArchery ? '🏹 ARCHERY RANGE' : sportName}
          </span>
          <span className="text-[10px] bg-maroon-900 text-gold-300 px-2 py-0.5 rounded-full border border-gold-500/30 font-bold">
            LIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 text-center">
          <div className="bg-dark-800/80 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] text-cream-400 uppercase">Score</div>
            <div className="text-2xl font-extrabold text-gold-400">{score}</div>
          </div>
          <div className="bg-dark-800/80 p-2 rounded-xl border border-white/5">
            <div className="text-[10px] text-cream-400 uppercase">Accuracy</div>
            <div className="text-2xl font-extrabold text-cream-100">{accuracy}%</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-cream-300 border-t border-white/10 pt-2">
          <span>Shots: {shots}</span>
          <span>Hits: {hits}</span>
          {lastShotScore !== null && (
            <span
              className={`font-bold ${
                lastShotScore >= 9
                  ? 'text-gold-400'
                  : lastShotScore > 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {lastShotScore > 0 ? `+${lastShotScore} PTS` : 'MISS'}
            </span>
          )}
        </div>
      </div>

      {/* Active Adaptive Features Telemetry Overlay */}
      {adaptations && adaptations.length > 0 && (
        <div className="absolute bottom-6 left-6 z-40 bg-dark-900/90 border border-gold-500/30 p-3.5 rounded-xl text-xs text-cream-300 max-w-xs shadow-2xl backdrop-blur-md">
          <div className="font-bold text-gold-400 mb-1 uppercase tracking-wider text-[11px]">
            ⚡ Active Adaptive Systems
          </div>
          <div className="flex flex-wrap gap-1">
            {adaptations.map((aid, idx) => (
              <span
                key={idx}
                className="bg-maroon-950/80 text-gold-200 border border-gold-500/20 px-2 py-0.5 rounded text-[10px]"
              >
                ✓ {aid}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <Canvas camera={{ position: [0, 1.7, 5], fov: 65 }} shadows className="w-full h-full">
        <XR store={store}>
          <FirstPersonController />
          <StadiumEnvironment sportName={sportName} />
          <ThreeArenaScene sportName={sportName} onHit={handleHit} onMiss={handleMiss} />
        </XR>
      </Canvas>
    </div>
  );
}