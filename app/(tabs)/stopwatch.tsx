import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StopWatchScreen() {
  const insets = useSafeAreaInsets();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const [displayTime, setDisplayTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  function formatTime(ms: number): string {
    const totalCs = Math.floor(ms / 10);
    const cs = totalCs % 100;
    const totalSec = Math.floor(ms / 1000);
    const seconds = totalSec % 60;
    const minutes = Math.floor(totalSec / 60);

    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    const cc = cs.toString().padStart(2, '0');

    return `${mm}:${ss}.${cc}`;
  }

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

  const lastLapTime = laps.length > 0
    ? displayTime - laps[0]
    : displayTime;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stopwatch</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Text
          style={isRunning ? styles.timerText : styles.timerTextDisabled}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatTime(displayTime)}
        </Text>
        {laps.length > 0 && (
          <Text style={styles.lapTimeText}>
            Lap  {formatTime(lastLapTime)}
          </Text>
        )}
      </View>

      {laps.length > 0 && (
        <View style={styles.lapsContainer}>
          {laps.slice(0, 5).map((lapMs, i) => {
            const lapDuration = i === laps.length - 1
              ? lapMs
              : lapMs - laps[i + 1];
            return (
              <View key={i} style={styles.lapRow}>
                <Text style={styles.lapLabel}>Lap {laps.length - i}</Text>
                <Text style={styles.lapValue}>{formatTime(lapDuration)}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.buttonsContainer}>
        {!!isRunning ? (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.startStopText]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.startStopText]}>Start</Text>
          </TouchableOpacity>
        )}

        {
          !!displayTime &&
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        }
        {
          !!isRunning &&
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleLap}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Lap</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  timerContainer: {
    flex: 1,
    letterSpacing: 0.2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  timerText: {
    color: '#fff',
    fontSize: 80,
    fontWeight: '700',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif-light' },
    }),
  },
  timerTextDisabled: {
    color: '#bababa',
    fontSize: 80,
    fontWeight: '700',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif-light' },
    }),
  },
  lapTimeText: {
    color: '#8E8E93',
    fontSize: 18,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },

  lapsContainer: {
    paddingHorizontal: 20,
  },
  lapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },
  lapLabel: {
    color: '#8E8E93',
    fontSize: 15,
  },
  lapValue: {
    color: '#fff',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },

  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 6,
  },
  button: {
    width: '100%',
    paddingVertical: 45,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
  },
  startButton: {
    backgroundColor: '#d4d4d4',
  },
  secondaryButton: {
    paddingVertical: 35,
    backgroundColor: '#2b2b2b',
  },
  startStopText: {
    color: '#1C1C1E'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});