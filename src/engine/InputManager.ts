// src/engine/InputManager.ts

export interface ActionState {
  moveForward: boolean;
  moveBackward: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  sprint: boolean;
  interact: boolean;
  reset: boolean;
  pause: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
}

class InputManagerEngine {
  private keys: Record<string, boolean> = {};
  private mouseDelta = { x: 0, y: 0 };
  private isPointerLocked = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      window.addEventListener('mousemove', this.handleMouseMove);
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isPointerLocked) {
      this.mouseDelta.x += e.movementX;
      this.mouseDelta.y += e.movementY;
    }
  };

  public requestPointerLock(element: HTMLElement) {
    element.requestPointerLock();
    this.isPointerLocked = true;
  }

  public exitPointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    this.isPointerLocked = false;
  }

  public getActions(sensitivity = 1.0): ActionState {
    const actions: ActionState = {
      moveForward: !!(this.keys['KeyW'] || this.keys['ArrowUp']),
      moveBackward: !!(this.keys['KeyS'] || this.keys['ArrowDown']),
      moveLeft: !!(this.keys['KeyA'] || this.keys['ArrowLeft']),
      moveRight: !!(this.keys['KeyD'] || this.keys['ArrowRight']),
      sprint: !!this.keys['ShiftLeft'],
      interact: !!this.keys['KeyE'],
      reset: !!this.keys['KeyR'],
      pause: !!this.keys['Escape'],
      mouseDeltaX: this.mouseDelta.x * sensitivity,
      mouseDeltaY: this.mouseDelta.y * sensitivity,
    };

    // Reset mouse deltas after consuming
    this.mouseDelta = { x: 0, y: 0 };
    return actions;
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }
}

export const InputManager = new InputManagerEngine();