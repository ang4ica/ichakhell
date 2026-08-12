// src/pages/Dashboard.tsx
import { useState } from 'react';

interface SportCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  accentColor: string;
  badge: string;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function SportCard({
  id,
  title,
  category,
  description,
  icon,
  accentColor,
  badge,
  isActive,
  onSelect,
}: SportCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative overflow-hidden rounded-2xl glass-card p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 ${
        isActive ? 'ring-2 ring-cyan-400 bg-slate-900/80 shadow-2xl shadow-cyan-500/20' : ''
      }`}
    >
      {/* Background Radial Accent Glow */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${accentColor}`}
      />

      {/* Top Badge & Icon Row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 rounded-full">
          {badge}
        </span>
      </div>

      {/* Sport Title & Category */}
      <div className="mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {category}
        </span>
        <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
          Enter VR Arena
        </span>
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
          ➔
        </div>
      </div>
    </div>
  );
}

export function MainDashboard({ onStartSport }: { onStartSport: (sportId: string) => void }) {
  const [selectedSport, setSelectedSport] = useState('basketball');

  const sports = [
    {
      id: 'basketball',
      title: 'Wheelchair Basketball',
      category: 'Paralympic Sport',
      description: 'Precision shooting with parabolic rim physics, dynamic power-charge throwing, and immersive rim vibrations.',
      icon: '🏀',
      accentColor: 'bg-orange-500',
      badge: 'Interactive 3D',
    },
    {
      id: 'archery',
      title: 'Adaptive Archery',
      category: 'Precision Aiming',
      description: 'Full tension bow string mechanics with multi-ring target collision scoring and customizable aim-assist levels.',
      icon: '🏹',
      accentColor: 'bg-yellow-500',
      badge: 'Aim Assist',
    },
    {
      id: 'boccia',
      title: 'Tactical Boccia',
      category: 'Strategic Precision',
      description: 'Paralympic tactical ball rolling, dynamic impulse physics collisions, and real-time distance calculation.',
      icon: '⚪',
      accentColor: 'bg-blue-500',
      badge: 'New Engine',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* 🔮 Ambient Cyberpunk Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* NAVIGATION BAR */}
      <nav className="relative z-10 border-b border-white/10 glass-card px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-xl font-black text-slate-950">A</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider uppercase text-white">
              Adaptive<span className="text-cyan-400">Arena</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">VR Adaptive Sports Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white glass-card rounded-xl transition-all">
            ⚙️ Accessibility Settings
          </button>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center space-x-2 px-3 py-1.5 glass-card rounded-xl text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>VR Headset Ready</span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-mx-auto px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-full inline-block mb-4 shadow-inner">
            Next-Gen Adaptive Simulation
          </span>
          <h2 className="text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Immersive Inclusive Sports <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Engineered for Everyone
            </span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Select a discipline below to enter the 3D WebGL Arena. Supports full VR spatial controllers, custom aim-assist modes, and adaptive input mappings.
          </p>
        </div>

        {/* SPORTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sports.map((sport) => (
            <SportCard
              key={sport.id}
              {...sport}
              isActive={selectedSport === sport.id}
              onSelect={(id) => {
                setSelectedSport(id);
                onStartSport(id);
              }}
            />
          ))}
        </div>

        {/* STATS / FEATURE BAR */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 glass-card rounded-2xl p-6 border border-white/10">
          <div className="text-center border-r border-white/10 last:border-0">
            <p className="text-3xl font-black text-cyan-400 mb-1">60 FPS</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Physics Rate</p>
          </div>
          <div className="text-center border-r border-white/10 last:border-0">
            <p className="text-3xl font-black text-indigo-400 mb-1">100%</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Web Accessibility</p>
          </div>
          <div className="text-center border-r border-white/10 last:border-0">
            <p className="text-3xl font-black text-yellow-400 mb-1">Spatial</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Audio Engine</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-emerald-400 mb-1">WebXR</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Zero Setup Needed</p>
          </div>
        </div>
      </main>
    </div>
  );
}