// src/components/vr/StadiumEnvironment.tsx

export function StadiumEnvironment({ sportName }: { sportName: string }) {
  const isBasketball = sportName.toLowerCase().includes('basketball');
  const isBoccia = sportName.toLowerCase().includes('boccia');

  return (
    <group>
      {/* Dynamic Lighting Setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[15, 25, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 8, -5]} intensity={1.2} color="#ffd700" />

      {/* Main Arena Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color={isBasketball ? '#b87333' : isBoccia ? '#1f2937' : '#14532d'}
          roughness={isBasketball ? 0.2 : 0.8}
          metalness={isBasketball ? 0.1 : 0.0}
        />
      </mesh>

      {/* Arena Architectural Stadium Walls */}
      <mesh position={[0, 10, -30]}>
        <boxGeometry args={[60, 20, 1]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[-30, 10, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[60, 20, 1]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[30, 10, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[60, 20, 1]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>

      {/* Maroon & Gold Championship Banners */}
      <mesh position={[0, 14, -29.4]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#4a1523" />
      </mesh>
    </group>
  );
}