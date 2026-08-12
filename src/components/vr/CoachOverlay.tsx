// src/components/vr/CoachOverlay.tsx

import { useState, useEffect } from 'react';

interface CoachOverlayProps {
  sportName: string;
  adaptations: string[];
}

export function CoachOverlay({ sportName, adaptations }: CoachOverlayProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    `AI Coach Active: Analyzing spatial targeting for ${sportName}.`,
    `Active Assist: ${adaptations[0] || 'Standard Reticle Stabilization'}.`,
    'Motion dampening active — jitter reduced by 98%.',
    'Keep your cursor centered on moving targets to trigger lock-on.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="absolute top-6 left-6 z-30 max-w-sm bg-dark-800/90 backdrop-blur-md border border-gold-500/40 p-4 rounded-xl shadow-2xl pointer-events-none">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping"></span>
        <span className="text-[10px] font-serif uppercase tracking-widest text-gold-400 font-bold">
          AI Adaptive Coach
        </span>
      </div>
      <p className="text-xs text-cream-100 font-sans leading-relaxed">
        {tips[currentTipIndex]}
      </p>
    </div>
  );
}