// src/components/vr/VRSessionModal.tsx

import { useState, useEffect } from 'react';
import { SportRecommendation } from '../../engine/classificationEngine';

interface VRSessionModalProps {
  sport: SportRecommendation;
  onClose: () => void;
  onStartMatch: () => void;
}

export function VRSessionModal({ sport, onClose, onStartMatch }: VRSessionModalProps) {
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsSimulating(true);
          return 100;
        }
        return prev + 20;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-dark-800 border border-gold-500/50 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-maroon-800 pb-4">
          <div>
            <span className="text-gold-500 font-serif text-xs uppercase tracking-widest">
              Active Simulation — 60 FPS
            </span>
            <h2 className="text-3xl font-serif text-cream-100 mt-1">
              {sport.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-cream-400 hover:text-cream-100 font-serif text-sm border border-maroon-800 px-3 py-1 rounded transition cursor-pointer"
          >
            ✕ Exit VR
          </button>
        </div>

        {/* Telemetry Status */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-serif text-cream-300">
            <span>Spatial Tracking Calibration</span>
            <span>{calibrationProgress}%</span>
          </div>
          <div className="w-full bg-dark-900 border border-maroon-800 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gold-500 h-full transition-all duration-300"
              style={{ width: `${calibrationProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Active Profile Telemetry */}
        <div className="bg-dark-900 border border-maroon-900 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-serif uppercase text-gold-500 tracking-wider">
            Active VR Telemetry & Adaptations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {sport.adaptations.map((item, idx) => (
              <div
                key={idx}
                className="bg-dark-800 border border-maroon-800/60 p-3 rounded flex items-center gap-2 text-cream-200"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-4 flex justify-between items-center">
          <span className="text-xs text-cream-400 italic">
            {isSimulating ? '● Session Ready. Click Start Match to enter Arena.' : 'Calibrating adaptive sensors...'}
          </span>
          <button
            onClick={onStartMatch}
            disabled={!isSimulating}
            className={`px-6 py-2.5 font-serif uppercase tracking-wider text-xs rounded transition cursor-pointer ${
              isSimulating
                ? 'bg-gold-500 text-dark-900 hover:bg-gold-400 font-bold shadow-lg'
                : 'bg-maroon-900/50 text-cream-400 cursor-not-allowed'
            }`}
          >
            {isSimulating ? 'Start Match' : 'Calibrating...'}
          </button>
        </div>
      </div>
    </div>
  );
}