// src/components/vr/ThreeArenaScene.tsx

import { ArcheryGame } from './sports/ArcheryGame';
import { BasketballGame } from './sports/BasketballGame';
import { BocciaGame } from './sports/BocciaGame';

interface ThreeArenaSceneProps {
  sportName: string;
  onHit: (score?: number) => void;
  onMiss: () => void;
  aimAimAssistLevel?: 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export function ThreeArenaScene({
  sportName,
  onHit,
  onMiss,
}: ThreeArenaSceneProps) {
  const normalizedSport = sportName.toLowerCase();

  const isBasketball =
    normalizedSport.includes('basketball') || normalizedSport.includes('wheelchairbasketball');
  const isBoccia = normalizedSport.includes('boccia');

  return (
    <group>
      {/* Dynamic 3D Sport Engine Router */}
      {isBasketball ? (
        <BasketballGame onHit={onHit} onMiss={onMiss} />
      ) : isBoccia ? (
        <BocciaGame onHit={onHit} onMiss={onMiss} />
      ) : (
        <ArcheryGame onHit={onHit} onMiss={onMiss} />
      )}
    </group>
  );
}