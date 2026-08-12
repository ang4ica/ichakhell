// src/config/SportConfigs.ts

export const ArcheryConfig = {
  targetDistance: 15,
  arrowSpeed: 35,
  gravity: 9.81,
  windStrength: 1.2,
  aimAssistSensitivities: {
    OFF: 1.0,
    LOW: 0.8,
    MEDIUM: 0.5,
    HIGH: 0.2,
  },
};

export const BasketballConfig = {
  wheelchairSpeed: 6.5,
  wheelchairTurnSpeed: 2.2,
  ballMass: 0.62,
  rimHeight: 3.05,
  shootingPowerMultiplier: 12.0,
};

export const BocciaConfig = {
  courtWidth: 6,
  courtLength: 12.5,
  ballMass: 0.275,
  frictionCoefficient: 0.85,
  assistedTrajectoryPreview: true,
};