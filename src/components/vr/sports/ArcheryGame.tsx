// src/components/vr/sports/ArcheryGame.tsx

import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArcheryConfig } from '../../../config/SportConfigs';
import { soundFx } from '../../../engine/AudioEngine';

interface EmbeddedArrow {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  score: number;
}

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: string;
}

interface ArcheryGameProps {
  onHit: (score: number) => void;
  onMiss: () => void;
  aimAssistLevel?: 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export function ArcheryGame({ onHit, onMiss, aimAssistLevel = 'MEDIUM' }: ArcheryGameProps) {
  const { camera } = useThree();

  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPower, setDrawPower] = useState(0);
  const [embeddedArrows, setEmbeddedArrows] = useState<EmbeddedArrow[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Wind simulation
  const [windSpeed] = useState(1.8);
  const windDir = useRef(new THREE.Vector3(1, 0, 0));

  // Bow & Arrow Mesh Refs
  const bowRef = useRef<THREE.Group>(null);
  const arrowMeshRef = useRef<THREE.Group>(null);
  const targetGroupRef = useRef<THREE.Group>(null);
  const impactVibration = useRef(0);

  // Active Flying Arrow Object
  const activeArrow = useRef<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    active: boolean;
  } | null>(null);

  const [isFlying, setIsFlying] = useState(false);

  // Target Location
  const targetPos = new THREE.Vector3(0, 1.8, -ArcheryConfig.targetDistance);
  const targetRadius = 1.2;

  // Direct Attachment of Bow to Camera Scene Hierarchy
  useEffect(() => {
    const bow = bowRef.current;
    if (bow) {
      camera.add(bow);
      // Position bow right in front of the camera view
      bow.position.set(0.25, -0.25, -0.6);
      bow.rotation.set(0, -Math.PI / 12, 0);
    }
    return () => {
      if (bow) {
        camera.remove(bow);
      }
    };
  }, [camera]);

  // Window Event Listeners for Draw & Release
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if ((e.button === 0 || e.button === undefined) && !activeArrow.current?.active) {
        setIsDrawing(true);
      }
    };

    const handlePointerUp = () => {
      if (isDrawing) {
        shootArrow();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDrawing, drawPower]);

  // Main 60FPS Frame Loop
  useFrame((_, delta) => {
    // 1. Bow Draw Charging Mechanics
    if (isDrawing) {
      setDrawPower((prev) => Math.min(1.0, prev + delta * 1.8));
    }

    // 2. Target Impact Recoil Shockwave
    if (impactVibration.current > 0 && targetGroupRef.current) {
      impactVibration.current = Math.max(0, impactVibration.current - delta * 10);
      targetGroupRef.current.position.x = (Math.random() - 0.5) * impactVibration.current * 0.08;
      targetGroupRef.current.position.y = 1.8 + (Math.random() - 0.5) * impactVibration.current * 0.08;
    }

    // 3. Particles Update
    if (particles.length > 0) {
      setParticles((prev) =>
        prev
          .map((p) => {
            p.position.addScaledVector(p.velocity, delta);
            p.life -= delta * 2.5;
            return p;
          })
          .filter((p) => p.life > 0)
      );
    }

    // 4. Arrow Flight Engine & Collision Detection
    if (activeArrow.current && activeArrow.current.active && arrowMeshRef.current) {
      const arrow = activeArrow.current;

      // Apply Physics: Gravity + Dynamic Wind Shift
      arrow.velocity.y -= ArcheryConfig.gravity * delta;
      arrow.velocity.x += windDir.current.x * windSpeed * delta * 0.35;

      arrow.position.addScaledVector(arrow.velocity, delta);

      // Render Active Arrow at Exact Frame Position
      arrowMeshRef.current.position.copy(arrow.position);

      // Rotate arrow shaft towards current velocity direction
      const lookAtTarget = arrow.position.clone().add(arrow.velocity);
      arrowMeshRef.current.lookAt(lookAtTarget);

      // Collision Check with Target Board Plane
      if (arrow.position.z <= targetPos.z) {
        arrow.active = false;
        setIsFlying(false);

        const distFromCenter = Math.hypot(
          arrow.position.x - targetPos.x,
          arrow.position.y - targetPos.y
        );

        if (distFromCenter <= targetRadius) {
          // Ring Score Calculation (1 to 10 points)
          const ringFraction = 1 - distFromCenter / targetRadius;
          const score = Math.max(1, Math.ceil(ringFraction * 10));

          soundFx.playHit();
          onHit(score);

          // Impact Shake
          impactVibration.current = 1.0;

          // Impact Dust Particle Explosion
          const impactParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
            id: Math.random() + i,
            position: arrow.position.clone(),
            velocity: new THREE.Vector3(
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4,
              Math.random() * 3 + 1
            ),
            life: 1.0,
            color: score >= 9 ? '#eab308' : score >= 7 ? '#dc2626' : '#0284c7',
          }));
          setParticles((prev) => [...prev, ...impactParticles]);

          // Stick Arrow into Target Face
          setEmbeddedArrows((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              position: [arrow.position.x, arrow.position.y, targetPos.z + 0.05],
              rotation: [
                arrowMeshRef.current?.rotation.x || 0,
                arrowMeshRef.current?.rotation.y || 0,
                arrowMeshRef.current?.rotation.z || 0,
              ],
              score,
            },
          ]);
        } else {
          soundFx.playMiss();
          onMiss();
        }
      }
    }
  });

  const shootArrow = () => {
    setIsDrawing(false);

    // Get aiming direction from camera
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);

    // Adaptive Aim Assist Correction
    const assistMultiplier = ArcheryConfig.aimAssistSensitivities[aimAssistLevel] || 0.5;
    if (assistMultiplier < 1.0) {
      const idealDirection = targetPos.clone().sub(camera.position).normalize();
      cameraDir.lerp(idealDirection, (1.0 - assistMultiplier) * 0.55);
    }

    // Launch velocity
    const speed = ArcheryConfig.arrowSpeed * Math.max(0.4, drawPower);
    const velocity = cameraDir.multiplyScalar(speed);

    // Initial arrow start position in front of bow
    const startPos = camera.position.clone().add(new THREE.Vector3(0.15, -0.15, -0.4).applyQuaternion(camera.quaternion));

    activeArrow.current = {
      position: startPos,
      velocity,
      active: true,
    };

    soundFx.playRelease();
    setIsFlying(true);
    setDrawPower(0);
  };

  return (
    <group>
      {/* 🏹 3D FIRST-PERSON RECURVE BOW (Child of Camera) */}
      <group ref={bowRef}>
        {/* Main Bow Riser Handle */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.25, 0.05]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.5} />
        </mesh>
        
        {/* Upper Bow Limb */}
        <mesh position={[0, 0.3, -isDrawing ? drawPower * 0.06 : 0]} rotation={[-drawPower * 0.25, 0, 0]}>
          <boxGeometry args={[0.035, 0.4, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} />
        </mesh>

        {/* Lower Bow Limb */}
        <mesh position={[0, -0.3, -isDrawing ? drawPower * 0.06 : 0]} rotation={[drawPower * 0.25, 0, 0]}>
          <boxGeometry args={[0.035, 0.4, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} />
        </mesh>

        {/* Bowstring Line */}
        <mesh position={[-drawPower * 0.18, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.95, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Notched Arrow on Bow (Visible when drawing) */}
        {isDrawing && (
          <group position={[0, 0, -drawPower * 0.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.85, 12]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} />
            </mesh>
            {/* Arrow Tip */}
            <mesh position={[0, 0, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.02, 0.08, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
            {/* Feathers */}
            <mesh position={[0, 0, 0.38]}>
              <boxGeometry args={[0.06, 0.1, 0.005]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        )}
      </group>

      {/* 🚀 ACTIVE FLYING ARROW IN 3D SPACE */}
      <group ref={arrowMeshRef} visible={isFlying}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.85, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} />
        </mesh>
        {/* Metal Tip */}
        <mesh position={[0, 0, -0.44]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.02, 0.08, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Red Fletching */}
        <mesh position={[0, 0, 0.38]}>
          <boxGeometry args={[0.06, 0.1, 0.006]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* 🎯 COMPETITION TARGET STAND & BOSS */}
      <group ref={targetGroupRef} position={[targetPos.x, targetPos.y, targetPos.z]}>
        {/* A-Frame Legs */}
        <mesh position={[-0.8, -1.2, -0.2]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.12, 2.6, 0.12]} />
          <meshStandardMaterial color="#3f2305" roughness={0.8} />
        </mesh>
        <mesh position={[0.8, -1.2, -0.2]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.12, 2.6, 0.12]} />
          <meshStandardMaterial color="#3f2305" roughness={0.8} />
        </mesh>

        {/* White Target Face */}
        <mesh rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.12, 48]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Black Ring */}
        <mesh position={[0, 0, 0.061]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.96, 0.96, 0.01, 48]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Blue Ring */}
        <mesh position={[0, 0, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.01, 48]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Red Ring */}
        <mesh position={[0, 0, 0.063]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.01, 48]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Gold Bullseye Ring */}
        <mesh position={[0, 0, 0.064]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.01, 48]} />
          <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Embedded Stick-In Arrows on Target */}
        {embeddedArrows.map((arrow) => (
          <group
            key={arrow.id}
            position={[arrow.position[0], arrow.position[1], 0.065]}
            rotation={arrow.rotation}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.75, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <boxGeometry args={[0.06, 0.1, 0.008]} />
              <meshStandardMaterial color="#eab308" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 💫 IMPACT SPARK PARTICLES */}
      {particles.map((p) => (
        <mesh key={p.id} position={p.position.toArray()}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={p.life} />
        </mesh>
      ))}
    </group>
  );
}