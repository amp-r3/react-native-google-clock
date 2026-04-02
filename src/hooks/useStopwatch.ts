import { useRef, useState, useCallback } from 'react';

export interface UseStopwatchReturn {
  displayTime: number;
  isRunning: boolean;
  laps: number[];
  lastLapTime: number;
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  handleLap: () => void;
  formatTime: (ms: number) => string;
}

export function useStopwatch(): UseStopwatchReturn {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const [displayTime, setDisplayTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const formatTime = useCallback((ms: number): string => {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSec = Math.floor(ms / 1000);
    const seconds = totalSec % 60;
    const minutes = Math.floor(totalSec / 60);

    return [
      minutes.toString().padStart(2, '0'),
      ':',
      seconds.toString().padStart(2, '0'),
      '.',
      cs.toString().padStart(2, '0'),
    ].join('');
  }, []);

  const handleStart = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setDisplayTime(accumulatedRef.current + elapsed);
    }, 30);
  }, []);

  const handleStop = useCallback(() => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    accumulatedRef.current += Date.now() - startTimeRef.current;
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
    accumulatedRef.current = 0;
    setDisplayTime(0);
    setIsRunning(false);
    setLaps([]);
  }, []);

  const handleLap = useCallback(() => {
    if (isRunning) {
      setLaps(prev => [displayTime, ...prev]);
    }
  }, [isRunning, displayTime]);

  const lastLapTime = laps.length > 0 ? displayTime - laps[0] : displayTime;

  return {
    displayTime,
    isRunning,
    laps,
    lastLapTime,
    handleStart,
    handleStop,
    handleReset,
    handleLap,
    formatTime,
  };
}