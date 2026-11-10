/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppMode, PowerTreeFullState, BatteryStatus } from '../types';

export function usePowerTreeState() {
  const [mode, setMode] = useState<AppMode>('demo');
  const [isSunOn, setIsSunOn] = useState<boolean>(true);
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [isCarMoving, setIsCarMoving] = useState<boolean>(false);
  const [ledOn, setLedOn] = useState<boolean>(true);

  // Solar State
  const [solarStatus, setSolarStatus] = useState<'generating' | 'idle' | 'no_data'>('generating');
  const [solarVoltage, setSolarVoltage] = useState<number | undefined>(5.2);

  // Piezo State
  const [piezoHits, setPiezoHits] = useState<number>(0);
  const [piezoHasSignal, setPiezoHasSignal] = useState<boolean>(false);
  const [piezoStatus, setPiezoStatus] = useState<'signal' | 'idle' | 'no_data'>('idle');

  // Water State
  const [lowFloat, setLowFloat] = useState<boolean>(false);
  const [highFloat, setHighFloat] = useState<boolean>(false);
  const [fullFloat, setFullFloat] = useState<boolean>(false);
  const [pumpRunning, setPumpRunning] = useState<boolean>(false);
  const [reservoirVisualLevel, setReservoirVisualLevel] = useState<number>(0);
  const [treeVisualLevel, setTreeVisualLevel] = useState<number>(15);

  // Battery State: 'charging' | 'discharging' | 'idle' | 'no_data' | 'unknown'
  const [battery, setBattery] = useState<BatteryStatus>('charging');

  // Web Serial State
  const [serialSupported, setSerialSupported] = useState<boolean>(false);
  const [serialConnected, setSerialConnected] = useState<boolean>(false);
  const [serialPortName, setSerialPortName] = useState<string | undefined>();
  const [serialError, setSerialError] = useState<string | undefined>();
  const [serialLastPacket, setSerialLastPacket] = useState<string | undefined>();
  const [serialLogs, setSerialLogs] = useState<string[]>([]);

  const serialPortRef = useRef<any>(null);
  const serialReaderRef = useRef<any>(null);
  const keepReadingRef = useRef<boolean>(false);

  // Check Web Serial support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      setSerialSupported(true);
    } else {
      setSerialSupported(false);
    }
  }, []);

  // Update Solar & Battery when Sun, LED or Mode changes
  useEffect(() => {
    if (mode === 'live') {
      // In live mode, only show charging if confirmed by measurement/charge controller
      if (!serialConnected) {
        setBattery('no_data');
      }
      return;
    }

    if (isSunOn) {
      setSolarStatus('generating');
      setSolarVoltage(5.2);
      setBattery('charging');
    } else {
      setSolarStatus('idle');
      setSolarVoltage(0.0);
      if (ledOn) {
        setBattery('discharging');
      } else {
        setBattery('idle');
      }
    }
  }, [isSunOn, ledOn, mode, serialConnected]);

  // Demo simulation clock for Rain & Water Pump
  useEffect(() => {
    if (mode === 'live') return;

    const interval = setInterval(() => {
      // 1. Rain flow into reservoir
      if (isRaining) {
        setReservoirVisualLevel((prev) => {
          const next = Math.min(100, prev + 3);
          if (next >= 25 && !lowFloat) setLowFloat(true);
          if (next >= 75 && !highFloat) {
            setHighFloat(true);
            // Trigger automatic pump if tree is not full
            if (!fullFloat) {
              setPumpRunning(true);
            }
          }
          return next;
        });
      }

      // 2. Active Pump logic (transfer water from reservoir up to tree)
      if (pumpRunning) {
        setReservoirVisualLevel((prevRes) => {
          const nextRes = Math.max(0, prevRes - 3.5);
          // Safety stop: Reservoir below low float -> stop pump to prevent dry run
          if (nextRes < 20) {
            setLowFloat(false);
            setHighFloat(false);
            setPumpRunning(false);
          } else if (nextRes < 75) {
            setHighFloat(false);
          }
          return nextRes;
        });

        setTreeVisualLevel((prevTree) => {
          const nextTree = Math.min(100, prevTree + 3.5);
          // Safety stop: Tree tank reaches full float -> stop pump to prevent overflow
          if (nextTree >= 88) {
            setFullFloat(true);
            setPumpRunning(false);
          }
          return nextTree;
        });
      }
    }, 300);

    return () => clearInterval(interval);
  }, [isRaining, pumpRunning, lowFloat, highFloat, fullFloat, mode]);

  // Trigger Car over Piezo
  const triggerCarPass = useCallback(() => {
    if (isCarMoving) return;
    setIsCarMoving(true);
    setPiezoHits((prev) => prev + 1);
    setPiezoHasSignal(true);
    setPiezoStatus('signal');

    setTimeout(() => {
      setPiezoHasSignal(false);
      setPiezoStatus('idle');
      setIsCarMoving(false);
    }, 1200);
  }, [isCarMoving]);

  // Toggle Sun
  const toggleSun = useCallback(() => {
    setIsSunOn((prev) => !prev);
  }, []);

  // Toggle Rain
  const toggleRain = useCallback(() => {
    setIsRaining((prev) => !prev);
  }, []);

  // Toggle LED
  const toggleLed = useCallback(() => {
    setLedOn((prev) => !prev);
  }, []);

  // Reset Demo simulation
  const resetSimulation = useCallback(() => {
    setIsSunOn(true);
    setIsRaining(false);
    setIsCarMoving(false);
    setSolarStatus('generating');
    setSolarVoltage(5.2);
    setPiezoHits(0);
    setPiezoHasSignal(false);
    setPiezoStatus('idle');
    setLowFloat(false);
    setHighFloat(false);
    setFullFloat(false);
    setPumpRunning(false);
    setReservoirVisualLevel(0);
    setTreeVisualLevel(15);
    setBattery('charging');
    setLedOn(true);
  }, []);

  // Water tree out (Simulate watering plants from stored tree bladder)
  const useStoredWater = useCallback(() => {
    if (treeVisualLevel <= 15) return;
    setTreeVisualLevel((prev) => {
      const next = Math.max(15, prev - 25);
      if (next < 88) {
        setFullFloat(false);
      }
      return next;
    });
  }, [treeVisualLevel]);

  // Connect Web Serial (Live Mode)
  const connectSerial = useCallback(async () => {
    if (!('serial' in navigator)) {
      setSerialError('Trình duyệt không hỗ trợ Web Serial API. Vui lòng mở bằng Google Chrome hoặc Microsoft Edge trên máy tính.');
      return;
    }

    try {
      setSerialError(undefined);
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      serialPortRef.current = port;
      setSerialConnected(true);
      setSerialPortName('Arduino USB (9600 baud)');
      setMode('live');
      keepReadingRef.current = true;

      // Read loop
      const textDecoder = new TextDecoderStream();
      // @ts-ignore
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      serialReaderRef.current = reader;

      let buffer = '';

      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split('\n');
          // Keep trailing unfinished chunk in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            setSerialLastPacket(trimmed);
            setSerialLogs((prev) => [trimmed, ...prev.slice(0, 19)]);

            // Try parse JSON
            try {
              const parsed = JSON.parse(trimmed);
              // Expected JSON keys:
              // { solar: 1|0, solarV: 4.8, piezoHits: 12, piezoTrigger: true|false,
              //   lowFloat: 1|0, highFloat: 1|0, fullFloat: 1|0, pump: 1|0,
              //   battery: "CHARGING"|"DISCHARGING"|"IDLE", led: 1|0 }

              if (parsed.solar !== undefined) {
                setSolarStatus(parsed.solar ? 'generating' : 'idle');
                setSolarVoltage(typeof parsed.solarV === 'number' ? parsed.solarV : (parsed.solar ? 5.0 : 0.0));
              }

              if (typeof parsed.piezoHits === 'number') {
                setPiezoHits(parsed.piezoHits);
              }
              if (parsed.piezoTrigger !== undefined) {
                setPiezoHasSignal(Boolean(parsed.piezoTrigger));
                setPiezoStatus(parsed.piezoTrigger ? 'signal' : 'idle');
              }

              if (parsed.lowFloat !== undefined) setLowFloat(Boolean(parsed.lowFloat));
              if (parsed.highFloat !== undefined) setHighFloat(Boolean(parsed.highFloat));
              if (parsed.fullFloat !== undefined) setFullFloat(Boolean(parsed.fullFloat));
              if (parsed.pump !== undefined) setPumpRunning(Boolean(parsed.pump));

              // Map visual heights based on float switches
              if (parsed.highFloat) {
                setReservoirVisualLevel(85);
              } else if (parsed.lowFloat) {
                setReservoirVisualLevel(45);
              } else {
                setReservoirVisualLevel(5);
              }

              if (parsed.fullFloat) {
                setTreeVisualLevel(95);
              } else {
                setTreeVisualLevel(40);
              }

              // In Live Mode: only show charging status when confirmed by Arduino measurement/charge controller
              if (parsed.battery !== undefined && parsed.battery !== null) {
                const b = String(parsed.battery).toLowerCase();
                if (b.includes('charg')) setBattery('charging');
                else if (b.includes('dis')) setBattery('discharging');
                else if (b.includes('idle')) setBattery('idle');
                else setBattery('no_data');
              } else {
                setBattery('no_data');
              }

              if (parsed.led !== undefined) {
                setLedOn(Boolean(parsed.led));
              }
            } catch (err) {
              // Non-JSON line or partial frame, ignore safely
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setSerialError(err.message || 'Lỗi kết nối cổng Serial');
      }
      setSerialConnected(false);
      setMode('demo');
    }
  }, []);

  // Disconnect Web Serial
  const disconnectSerial = useCallback(async () => {
    keepReadingRef.current = false;
    try {
      if (serialReaderRef.current) {
        await serialReaderRef.current.cancel();
      }
      if (serialPortRef.current) {
        await serialPortRef.current.close();
      }
    } catch (e) {
      // ignore close errors
    }
    serialPortRef.current = null;
    serialReaderRef.current = null;
    setSerialConnected(false);
    setSerialPortName(undefined);
    setMode('demo');
  }, []);

  // Build unified state object
  const fullState: PowerTreeFullState = {
    mode,
    isSunOn,
    isRaining,
    isCarMoving,
    solar: {
      status: solarStatus,
      voltage: solarVoltage,
    },
    piezo: {
      hits: piezoHits,
      hasSignal: piezoHasSignal,
      status: piezoStatus,
    },
    water: {
      lowFloat,
      highFloat,
      fullFloat,
      pumpRunning,
      reservoirStatus: highFloat ? 'high' : lowFloat ? 'low' : 'empty',
      treeTankStatus: fullFloat ? 'full' : 'not_full',
      reservoirVisualLevel,
      treeVisualLevel,
    },
    battery,
    ledOn,
    serial: {
      isSupported: serialSupported,
      connected: serialConnected,
      portName: serialPortName,
      error: serialError,
      lastPacket: serialLastPacket,
      baudRate: 9600,
    },
  };

  return {
    state: fullState,
    serialLogs,
    actions: {
      setMode,
      toggleSun,
      toggleRain,
      triggerCarPass,
      toggleLed,
      resetSimulation,
      useStoredWater,
      connectSerial,
      disconnectSerial,
    },
  };
}
