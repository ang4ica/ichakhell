// src/components/vr/FirstPersonController.tsx

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InputManager } from '../../engine/InputManager';

interface FPSControllerProps {
  moveSpeed?: number;
  sensitivity?: number;
}

export function FirstPersonController({ moveSpeed = 5.0, sensitivity = 0.002 }: FPSControllerProps) {
  const { camera, gl } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  useEffect(() => {
    const handleCanvasClick = () => {
      InputManager.requestPointerLock(gl.domElement);
    };

    gl.domElement.addEventListener('click', handleCanvasClick);
    return () => {
      gl.domElement.removeEventListener('click', handleCanvasClick);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const actions = InputManager.getActions(sensitivity);

    // Mouse Look
    euler.current.y -= actions.mouseDeltaX;
    euler.current.x -= actions.mouseDeltaY;
    euler.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.current.x));
    camera.quaternion.setFromEuler(euler.current);

    // WASD Movement
    const speed = actions.sprint ? moveSpeed * 1.6 : moveSpeed;
    const moveVector = new THREE.Vector3();

    if (actions.moveForward) moveVector.z -= 1;
    if (actions.moveBackward) moveVector.z += 1;
    if (actions.moveLeft) moveVector.x -= 1;
    if (actions.moveRight) moveVector.x += 1;

    moveVector.normalize();
    moveVector.applyQuaternion(camera.quaternion);
    moveVector.y = 0; // Prevent floating/clipping ground

    camera.position.addScaledVector(moveVector, speed * delta);
  });

  return null;
}