// src/components/vr/sports/BocciaGame.tsx

import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BallState {
  id: string;
  type: 'jack' | 'red' | 'blue';
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  isRolling: boolean;
}

interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: string;
}

interface BocciaGameProps {
  onHit: (score: number) => void;
  onMiss: () => void;
}

const BALL_RADIUS = 0.18; // ~8.6 cm standard Boccia ball radius
const COURT_WIDTH = 6.0;
const COURT_LENGTH = 12.5;
const FRICTION = 0.92; // Realistic court carpet friction

export function BocciaGame({ onHit, onMiss }: BocciaGameProps) {
  const { camera } = useThree();

  // Match State
  const [gameState, setGameState] = useState<'JACK_THROW' | 'RED_TURN' | 'BLUE_TURN' | 'ROUND_END'>('JACK_THROW');
  const [redBallsLeft, setRedBallsLeft] = useState(6);
  const [blueBallsLeft, setBlueBallsLeft] = useState(6);
  
  // Aim & Power
  const [aimAngle, setAimAngle] = useState(0); // Angle in radians
  const [power, setPower] = useState(0.2);
  const [isCharging, setIsCharging] = useState(false);
  const chargeDir = useRef(1);

  // Ball Storage
  const ballsRef = useRef<BallState[]>([]);
  const [, setRenderTrigger] = useState(0);

  // Particles
  const [particles, setParticles] = useState<Particle[]>([]);

  // 1. Smooth Camera Tracking System
  useFrame(() => {
    const activeBall = ballsRef.current.find((b) => b.isRolling);
    
    // Target position for camera tracking
    const targetCamPos = activeBall
      ? new THREE.Vector3(activeBall.position.x * 0.4, 3.5, activeBall.position.z + 3.0)
      : new THREE.Vector3(0, 4.0, 4.0);

    const targetLookAt = activeBall
      ? activeBall.position.clone()
      : new THREE.Vector3(0, 0, -3.0);

    // Smooth lerp movement
    camera.position.lerp(targetCamPos, 0.08);
    camera.lookAt(targetLookAt);
  });

  // 2. Keyboard & Pointer Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setAimAngle((prev) => Math.min(Math.PI / 3, prev + 0.04));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setAimAngle((prev) => Math.max(-Math.PI / 3, prev - 0.04));
      } else if (e.code === 'Space' && !e.repeat && !isCharging) {
        setIsCharging(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isCharging) {
        executeThrow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCharging, aimAngle, power, gameState]);

  // Handle Pointer Down/Up for Mouse controls
  const handlePointerDown = () => {
    if (!isCharging && !ballsRef.current.some((b) => b.isRolling)) {
      setIsCharging(true);
    }
  };

  const handlePointerUp = () => {
    if (isCharging) {
      executeThrow();
    }
  };

  // 3. Throw Execution Logic
  const executeThrow = () => {
    setIsCharging(false);

    // Calculate throw velocity vector based on aim angle and power bar
    const launchSpeed = 4 + power * 12;
    const velocity = new THREE.Vector3(
      -Math.sin(aimAngle) * launchSpeed,
      0.8 + power * 0.5, // Small vertical drop arc
      -Math.cos(aimAngle) * launchSpeed
    );

    let ballType: 'jack' | 'red' | 'blue' = 'red';
    if (gameState === 'JACK_THROW') {
      ballType = 'jack';
    } else if (gameState === 'RED_TURN') {
      ballType = 'red';
      setRedBallsLeft((prev) => prev - 1);
    } else if (gameState === 'BLUE_TURN') {
      ballType = 'blue';
      setBlueBallsLeft((prev) => prev - 1);
    }

    const newBall: BallState = {
      id: `${ballType}-${Date.now()}`,
      type: ballType,
      position: new THREE.Vector3(0, BALL_RADIUS + 0.1, 2.2), // Throw box start point
      velocity,
      isRolling: true,
    };

    ballsRef.current.push(newBall);
    setPower(0.2);
  };

  // 4. Main Physics, Rolling & Collision Loop
  useFrame((_, delta) => {
    // Oscillating Power Bar Logic
    if (isCharging) {
      setPower((prev) => {
        let next = prev + delta * 1.6 * chargeDir.current;
        if (next >= 1.0) {
          next = 1.0;
          chargeDir.current = -1;
        } else if (next <= 0.1) {
          next = 0.1;
          chargeDir.current = 1;
        }
        return next;
      });
    }

    let anyRolling = false;
    const balls = ballsRef.current;

    // A. Apply Gravity, Friction & Movement
    balls.forEach((ball) => {
      if (ball.isRolling) {
        anyRolling = true;

        // Apply airborne gravity until ball rests on court plane
        if (ball.position.y > BALL_RADIUS) {
          ball.velocity.y -= 9.81 * delta;
        } else {
          ball.position.y = BALL_RADIUS;
          ball.velocity.y = 0;
          // Apply floor surface friction
          ball.velocity.multiplyScalar(Math.pow(FRICTION, delta * 60));
        }

        ball.position.addScaledVector(ball.velocity, delta);

        // Court Boundary Collisions
        if (Math.abs(ball.position.x) > COURT_WIDTH / 2 - BALL_RADIUS) {
          ball.position.x = Math.sign(ball.position.x) * (COURT_WIDTH / 2 - BALL_RADIUS);
          ball.velocity.x *= -0.5;
        }
        if (ball.position.z < -COURT_LENGTH + BALL_RADIUS) {
          ball.position.z = -COURT_LENGTH + BALL_RADIUS;
          ball.velocity.z *= -0.5;
        }

        // Stop motion threshold
        if (ball.velocity.length() < 0.06 && ball.position.y <= BALL_RADIUS + 0.01) {
          ball.velocity.set(0, 0, 0);
          ball.isRolling = false;
        }
      }
    });

    // B. Elastic Ball-to-Ball Impulse Physics
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const b1 = balls[i];
        const b2 = balls[j];

        const deltaPos = new THREE.Vector3().subVectors(b2.position, b1.position);
        deltaPos.y = 0; // Flat court plane collision
        const dist = deltaPos.length();

        if (dist < BALL_RADIUS * 2) {
          const normal = deltaPos.normalize();

          // Separate overlapping balls to prevent sticking
          const overlap = BALL_RADIUS * 2 - dist;
          b1.position.addScaledVector(normal, -overlap * 0.5);
          b2.position.addScaledVector(normal, overlap * 0.5);

          // Elastic Momentum Transfer
          const relativeVelocity = new THREE.Vector3().subVectors(b1.velocity, b2.velocity);
          const speedAlongNormal = relativeVelocity.dot(normal);

          if (speedAlongNormal > 0) {
            const restitution = 0.8; // Energy retention
            const impulseMagnitude = speedAlongNormal * restitution;

            b1.velocity.addScaledVector(normal, -impulseMagnitude);
            b2.velocity.addScaledVector(normal, impulseMagnitude);

            b1.isRolling = true;
            b2.isRolling = true;

            // Spark particles on impact
            if (speedAlongNormal > 0.8) {
              const impactPt = b1.position.clone().add(b2.position).multiplyScalar(0.5);
              const newParticles: Particle[] = Array.from({ length: 10 }, (_, k) => ({
                id: Math.random() + k,
                position: impactPt.clone(),
                velocity: new THREE.Vector3(
                  (Math.random() - 0.5) * 2.5,
                  Math.random() * 2 + 0.5,
                  (Math.random() - 0.5) * 2.5
                ),
                life: 0.6,
                color: b1.type === 'jack' || b2.type === 'jack' ? '#facc15' : '#ffffff',
              }));
              setParticles((prev) => [...prev, ...newParticles]);
            }
          }
        }
      }
    }

    // C. Particle System Updates
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

    // D. Turn Management State Machine
    if (!anyRolling && balls.length > 0) {
      if (gameState === 'JACK_THROW') {
        setGameState('RED_TURN');
      } else if (redBallsLeft === 0 && blueBallsLeft === 0 && gameState !== 'ROUND_END') {
        calculateScores();
      } else if (gameState === 'RED_TURN' && redBallsLeft > 0 && blueBallsLeft > 0) {
        setGameState(redBallsLeft >= blueBallsLeft ? 'BLUE_TURN' : 'RED_TURN');
      } else if (gameState === 'RED_TURN' && redBallsLeft === 0) {
        setGameState('BLUE_TURN');
      } else if (gameState === 'BLUE_TURN' && blueBallsLeft === 0) {
        setGameState('RED_TURN');
      }
    }

    setRenderTrigger((prev) => prev + 1);
  });

  // 5. Final Paralympic Score Calculation
  const calculateScores = () => {
    setGameState('ROUND_END');
    const jack = ballsRef.current.find((b) => b.type === 'jack');
    if (!jack) return;

    const redBalls = ballsRef.current.filter((b) => b.type === 'red');
    const blueBalls = ballsRef.current.filter((b) => b.type === 'blue');

    const redDistances = redBalls.map((b) => ({
      color: 'red',
      dist: b.position.distanceTo(jack.position),
    }));
    const blueDistances = blueBalls.map((b) => ({
      color: 'blue',
      dist: b.position.distanceTo(jack.position),
    }));

    const sortedAll = [...redDistances, ...blueDistances].sort((a, b) => a.dist - b.dist);
    if (sortedAll.length === 0) return;

    const winnerColor = sortedAll[0].color;
    const opponentClosestDist =
      sortedAll.find((b) => b.color !== winnerColor)?.dist || Infinity;

    const points = sortedAll.filter(
      (b) => b.color === winnerColor && b.dist < opponentClosestDist
    ).length;

    if (winnerColor === 'red') {
      onHit(points);
    } else {
      onMiss();
    }
  };

  // Trajectory Guide Calculation
  const guideLength = 2.0 + power * 6.5;
  const targetX = -Math.sin(aimAngle) * guideLength;
  const targetZ = 2.2 - Math.cos(aimAngle) * guideLength;

  return (
    <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      {/* 🏟️ BOCCIA COURT SURFACE & LINES */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.25]}>
        <planeGeometry args={[COURT_WIDTH, COURT_LENGTH]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Court Outer Boundary Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -3.25]}>
        <planeGeometry args={[COURT_WIDTH + 0.08, COURT_LENGTH + 0.08]} />
        <meshBasicMaterial color="#0284c7" wireframe />
      </mesh>

      {/* Throwing Box Limit Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.2]}>
        <planeGeometry args={[COURT_WIDTH, 0.06]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* 🎯 DYNAMIC TRAJECTORY & AIM LINE */}
      {gameState !== 'ROUND_END' && (
        <group position={[0, 0.03, 2.2]}>
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geo) => {
                geo.setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(targetX, 0, targetZ - 2.2),
                ]);
              }}
            />
            <lineBasicMaterial
              attach="material"
              color={
                gameState === 'JACK_THROW'
                  ? '#facc15'
                  : gameState === 'RED_TURN'
                  ? '#ef4444'
                  : '#3b82f6'
              }
              linewidth={3}
            />
          </line>

          {/* Target Impact Marker Ring */}
          <mesh position={[targetX, 0, targetZ - 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.26, 32]} />
            <meshBasicMaterial
              color={
                gameState === 'JACK_THROW'
                  ? '#facc15'
                  : gameState === 'RED_TURN'
                  ? '#ef4444'
                  : '#3b82f6'
              }
            />
          </mesh>
        </group>
      )}

      {/* 🔴🔵⚪ BOCCIA BALLS IN PLAY */}
      {ballsRef.current.map((ball) => (
        <mesh key={ball.id} position={ball.position.toArray()} castShadow>
          <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
          <meshStandardMaterial
            color={
              ball.type === 'jack'
                ? '#ffffff'
                : ball.type === 'red'
                ? '#dc2626'
                : '#2563eb'
            }
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* 💥 CELEBRATION / IMPACT PARTICLES */}
      {particles.map((p) => (
        <mesh key={p.id} position={p.position.toArray()}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={p.life} />
        </mesh>
      ))}
    </group>
  );
}