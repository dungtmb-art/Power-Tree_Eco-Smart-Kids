/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppMode = 'demo' | 'live';

export type SolarStatus = 'generating' | 'idle' | 'no_data';
export type PiezoStatus = 'signal' | 'idle' | 'no_data';
export type ReservoirStatus = 'empty' | 'low' | 'high';
export type TreeTankStatus = 'not_full' | 'full';
export type BatteryStatus = 'charging' | 'discharging' | 'idle' | 'no_data' | 'unknown';

export interface SolarData {
  status: SolarStatus;
  voltage?: number;
}

export interface PiezoData {
  hits: number;
  hasSignal: boolean;
  status: PiezoStatus;
}

export interface WaterData {
  lowFloat: boolean;     // True if underground reservoir has reached low-level switch
  highFloat: boolean;    // True if underground reservoir has reached high-level switch (trigger pump)
  fullFloat: boolean;    // True if inner tree bladder is full (stop pump)
  pumpRunning: boolean;  // True if mini pump is actively pumping water
  reservoirStatus: ReservoirStatus;
  treeTankStatus: TreeTankStatus;
  // Simulation visual water levels (0 to 100)
  reservoirVisualLevel: number;
  treeVisualLevel: number;
}

export interface SerialState {
  isSupported: boolean;
  connected: boolean;
  portName?: string;
  error?: string;
  lastPacket?: string;
  baudRate: number;
}

export interface PowerTreeFullState {
  mode: AppMode;
  isSunOn: boolean;
  isRaining: boolean;
  isCarMoving: boolean;
  solar: SolarData;
  piezo: PiezoData;
  water: WaterData;
  battery: BatteryStatus;
  ledOn: boolean;
  serial: SerialState;
}
