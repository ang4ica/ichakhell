// src/components/dashboard/AdaptiveDashboard.tsx

import { useState } from 'react';

interface Sport {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  description: string;
  adaptations: string[];
  isFavorited: boolean;
}

export function AdaptiveDashboard({ onLaunchVR }: { onLaunchVR?: (sportId: string) => void }) {
  const [sports, setSports] = useState<Sport[]>([
    {
      id: 'archery',
      name: 'Adaptive Archery VR',
      category: 'Precision & Target',
      matchScore: 85,
      description: 'Precision target shooting dynamic visual reticles and custom draw-tension assists.',
      adaptations: ['Seated Target Anchor Active', 'Dual-Grip Tension Assist'],
      isFavorited: true,
    },
    {
      id: 'basketball',
      name: 'Wheelchair Basketball',
      category: 'Team & Speed',
      matchScore: 85,
      description: 'Fast-paced court action mapped for specialized seated motion tracking.',
      adaptations: ['Wheelchair Controller Mapping', 'Upper-Limb Throw & Speed Assist'],
      isFavorited: false,
    },
    {
      id: 'boccia',
      name: 'Boccia Tactical VR',
      category: 'Tactical Strategy',
      matchScore: 80,
      description: 'Strategic ball placement with fine-tuned force output and switch controls.',
      adaptations: ['Voice Command Target Selector'],
      isFavorited: false,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setSports((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorited: !s.isFavorited } : s))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans relative overflow-hidden">
      {/* 🔮 Background Radial Glow Effect */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* 🏆 HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              ADAPTIVE ARENA
              <span className="text-xs px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-full font-mono">
                v2.4
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Immersive VR Sports & Classification Platform</p>
          </div>
          <button className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-xl text-xs font-semibold tracking-wider text-slate-200 transition-all flex items-center justify-center gap-2">
            ⚙️ Edit Capabilities
          </button>
        </header>

        {/* 👤 ATHLETE PASSPORT CARD */}
        <section className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
                <span>PASSPORT</span>
                <span>•</span>
                <span>Official Athlete Identification</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Alex Vance</h2>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Passport
            </span>
          </div>

          {/* Capability Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {[
              { label: 'Gameplay Stance', val: 'Seated Mode' },
              { label: 'Control Scheme', val: 'Standard Dual' },
              { label: 'Wheelchair Mode', val: 'Enabled' },
              { label: 'Aim Assist', val: '50% Intensity' },
              { label: 'AI Match Engine', val: 'Active' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950/50 border border-white/5 rounded-xl p-3">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-slate-200">{item.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 🎯 RECOMMENDED DISCIPLINES SECTION */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Adaptive Disciplines</h2>
            <p className="text-xs text-slate-400">Dynamically Generated from Assessment Profile</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sports.map((sport) => (
              <div
                key={sport.id}
                className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-cyan-500/30 rounded-2xl p-6 transition-all shadow-lg flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold rounded-md">
                      {sport.category} • {sport.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{sport.name}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{sport.description}</p>

                  {/* Active Adaptations Tags */}
                  <div className="pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Active Adaptations:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sport.adaptations.map((adapt, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-slate-800/80 border border-white/5 rounded-lg text-xs text-slate-300"
                        >
                          ✓ {adapt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons Action Column */}
                <div className="flex md:flex-col justify-end md:justify-center items-center gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => toggleFavorite(sport.id)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      sport.isFavorited
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sport.isFavorited ? '★ Favorited' : '☆ Favorite'}
                  </button>

                  <button
                    onClick={() => onLaunchVR && onLaunchVR(sport.id)}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
                  >
                    Launch VR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}