// src/components/vr/sports/BasketballGame.tsx

import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundFx } from '../../../engine/AudioEngine';

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: string;
}

interface BasketballGameProps {
  onHit: (score: number) => void;
  onMiss: () => void;
}

export function BasketballGame({ onHit, onMiss }: BasketballGameProps) {
  const { camera } = useThree();

  // Charging / Charging State
  const [isCharging, setIsCharging] = useState(false);
  const [shotPower, setShotPower] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Refs for 3D Meshes
  const ballHeldRef = useRef<THREE.Group>(null);
  const activeBallMeshRef = useRef<THREE.Group>(null);
  const netMeshRef = useRef<THREE.Group>(null);
  const rimRef = useRef<THREE.Group>(null);

  // Animation values
  const netSwishAnim = useRef(0);
  const rimShakeAnim = useRef(0);

  // Active Flying Ball State
  const activeBall = useRef<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    rotation: THREE.Vector3;
    active: boolean;
    hasScored: boolean;
    bounces: number;
  } | null>(null);

  const [isFlying, setIsFlying] = useState(false);

  // Hoop / Court Dimensions
  const hoopPos = new THREE.Vector3(0, 3.05, -5.2); // Regulation 10ft high hoop
  const rimRadius = 0.45;
  const ballRadius = 0.24;

  // 1. Direct Attachment of Held Ball to Camera Scene Hierarchy
  useEffect(() => {
    const heldBall = ballHeldRef.current;
    if (heldBall) {
      camera.add(heldBall);
      // Position ball bottom-center/right in player view
      heldBall.position.set(0.2, -0.28, -0.5);
    }
    return () => {
      if (heldBall) {
        camera.remove(heldBall);
      }
    };
  }, [camera]);

  // 2. Mouse/Pointer Controls for Shot Charging & Release
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if ((e.button === 0 || e.button === undefined) && !activeBall.current?.active) {
        setIsCharging(true);
      }
    };

    const handlePointerUp = () => {
      if (isCharging) {
        shootBasketball();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isCharging, shotPower]);

  // 3. Main 60FPS Physics & Frame Loop
  useFrame((_, delta) => {
    // Shot Power Charge Mechanics
    if (isCharging) {
      setShotPower((prev) => Math.min(1.0, prev + delta * 1.5));
    }

    // Net Swish Wave Animation
    if (netSwishAnim.current > 0 && netMeshRef.current) {
      netSwishAnim.current = Math.max(0, netSwishAnim.current - delta * 4);
      netMeshRef.current.scale.x = 1 + Math.sin(netSwishAnim.current * 15) * 0.15;
      netMeshRef.current.scale.z = 1 + Math.sin(netSwishAnim.current * 15) * 0.15;
    }

    // Rim Vibration Shake
    if (rimShakeAnim.current > 0 && rimRef.current) {
      rimShakeAnim.current = Math.max(0, rimShakeAnim.current - delta * 6);
      rimRef.current.position.y = 3.05 + Math.sin(rimShakeAnim.current * 25) * 0.03;
    }

    // Update Particle Systems
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

    // Flying Ball Physics Engine
    if (activeBall.current && activeBall.current.active && activeBallMeshRef.current) {
      const ball = activeBall.current;

      // Apply Gravity
      ball.velocity.y -= 9.81 * delta;

      // Update position based on velocity
      ball.position.addScaledVector(ball.velocity, delta);

      // Apply Ball Spin (Backspin)
      ball.rotation.x -= delta * 12;

      // Render at exact position & rotation
      activeBallMeshRef.current.position.copy(ball.position);
      activeBallMeshRef.current.rotation.set(ball.rotation.x, ball.rotation.y, ball.rotation.z);

      // --- COLLISION DETECTION ---

      // A. Swish / Basket Trigger Zone
      const distToHoopCenter = Math.hypot(
        ball.position.x - hoopPos.x,
        ball.position.z - hoopPos.z
      );

      // Check if passing through rim height level while moving downwards
      if (
        !ball.hasScored &&
        ball.velocity.y < 0 &&
        Math.abs(ball.position.y - hoopPos.y) < 0.25 &&
        distToHoopCenter < rimRadius - 0.05
      ) {
        ball.hasScored = true;
        netSwishAnim.current = 1.0;
        soundFx.playHit();
        onHit(3); // 3 Points for a successful basket!

        // Gold Spark Particle Burst
        const burstParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
          id: Math.random() + i,
          position: hoopPos.clone(),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 3,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 3
          ),
          life: 1.0,
          color: '#eab308',
        }));
        setParticles((prev) => [...prev, ...burstParticles]);
      }

      // B. Rim Bounce Physics
      if (
        Math.abs(ball.position.y - hoopPos.y) < 0.2 &&
        distToHoopCenter > rimRadius - 0.1 &&
        distToHoopCenter < rimRadius + 0.15
      ) {
        // Reverse X/Z Velocity on Rim Impact
        ball.velocity.x *= -0.6;
        ball.velocity.z *= -0.6;
        ball.velocity.y *= 0.5;
        rimShakeAnim.current = 1.0;
      }

      // C. Floor Bounce Physics
      if (ball.position.y <= ballRadius) {
        ball.position.y = ballRadius;
        ball.velocity.y = -ball.velocity.y * 0.65; // Dampen bounce energy
        ball.velocity.x *= 0.8;
        ball.velocity.z *= 0.8;
        ball.bounces += 1;

        // Reset ball after multiple floor bounces
        if (ball.bounces > 3 || ball.velocity.length() < 0.5) {
          ball.active = false;
          setIsFlying(false);
          if (!ball.hasScored) {
            soundFx.playMiss();
            onMiss();
          }
        }
      }
    }
  });

  const shootBasketball = () => {
    setIsCharging(false);

    // Calculate arc direction vector based on camera angle
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);

    // Initial release position in front of player
    const startPos = camera.position
      .clone()
      .add(new THREE.Vector3(0.1, 0.2, -0.4).applyQuaternion(camera.quaternion));

    // Force vector: upward arc combined with forward direction
    const launchPower = 8 + Math.max(0.3, shotPower) * 7;
    const velocity = new THREE.Vector3(
      cameraDir.x * launchPower,
      cameraDir.y * launchPower + 3.8 + shotPower * 2.2, // Upward parabola boost
      cameraDir.z * launchPower
    );

    activeBall.current = {
      position: startPos,
      velocity,
      rotation: new THREE.Vector3(),
      active: true,
      hasScored: false,
      bounces: 0,
    };

    soundFx.playRelease();
    setIsFlying(true);
    setShotPower(0);
  };

  return (
    <group>
      {/* 🏀 HELD BASKETBALL (Attached to Camera) */}
      <group ref={ballHeldRef}>
        <mesh castShadow position={[0, 0, 0]}>
          <sphereGeometry args={[ballRadius, 32, 32]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Ball Black Seams */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[ballRadius + 0.002, 0.006, 16, 32]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* 🚀 ACTIVE FLYING BASKETBALL */}
      <group ref={activeBallMeshRef} visible={isFlying}>
        <mesh castShadow>
          <sphereGeometry args={[ballRadius, 32, 32]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh>
          <torusGeometry args={[ballRadius + 0.002, 0.006, 16, 32]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* 🎯 BASKETBALL HOOP & BACKBOARD ASSEMBLY */}
      <group position={[hoopPos.x, 0, hoopPos.z]}>
        {/* Support Base Post */}
        <mesh position={[0, 1.8, -0.6]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>

        {/* Backboard Frame */}
        <mesh position={[0, 3.4, -0.1]}>
          <boxGeometry args={[1.8, 1.1, 0.05]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} transparent opacity={0.85} />
        </mesh>

        {/* Backboard Inner Target Box */}
        <mesh position={[0, 3.25, -0.07]}>
          <boxGeometry args={[0.59, 0.45, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Orange Steel Rim */}
        <group ref={rimRef} position={[0, 3.05, 0.35]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[rimRadius, 0.025, 16, 32]} />
            <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.2} />
          </mesh>

          {/* White Net Mesh */}
          <group ref={netMeshRef} position={[0, -0.22, 0]}>
            <mesh>
              <cylinderGeometry args={[rimRadius, rimRadius * 0.6, 0.45, 16, 1, true]} />
              <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.8} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 💫 CELEBRATION PARTICLES */}
      {particles.map((p) => (
        <mesh key={p.id} position={p.position.toArray()}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={p.life} />
        </mesh>
      ))}
    </group>
  );
}