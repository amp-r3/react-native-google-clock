import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import SetTimer from '../../src/components/SetTimer';
import TimerItem from '../../src/components/TimerItem';
import { useHaptics } from '../../src/hooks/useHaptics';
import { formatDuration } from '../../src/utils/timeFormat';

export type TimerKeyboard = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫']
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';
const numbsArr: TimerKeyboard = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'] as const


export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  // initialDuration is the reset baseline (what the user originally typed).
  // duration is the current total used for the progress ring — grows with "+1:00".
  const [initialDuration, setInitialDuration] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [remountKey, setRemountKey] = useState(0);
  const [digits, setDigits] = useState([0, 0, 0, 0, 0, 0]);
  const totalHours = digits[0] * 10 + digits[1]
  const totalMinutes = digits[2] * 10 + digits[3]
  const totalSeconds = digits[4] * 10 + digits[5]
  const { onHeavyPress, onPress, onSave, onError } = useHaptics()

  const start = () => {
    if (timeLeft === null) {
      const totalSec = digitsToSec(digits);
      if (totalSec === 0) {
        onError();
        Toast.show({
          type: 'error',
          text1: 'Set a time first',
          position: 'bottom',
          visibilityTime: 2000,
        });
        return;
      }
      setInitialDuration(totalSec);
      setDuration(totalSec);
      setTimeLeft(totalSec);
      setDigits([0, 0, 0, 0, 0, 0]);
      onSave()
      setStatus('running');
      return;
    }
    setStatus('running');
  };

  const pause = () => {onPress(); setStatus('paused')};

  const stop = () => {
    setStatus('idle');
    setTimeLeft(null);
    setDuration(null);
    setInitialDuration(null);
  };

  const reset = () => {
    setStatus('paused');
    setDuration(initialDuration);
    setTimeLeft(initialDuration);
    setRemountKey(prev => prev + 1);
  };

  const addTime = () => {
    setDuration(prev => (prev ?? 0) + 60);
    setTimeLeft(prev => (prev ?? 0) + 60);
    setRemountKey(prev => prev + 1);
  };

  const finish = () => {
    setStatus('finished');
  };

  const handleTimeUpdate = (remainingTime: number) => {
    setTimeLeft(remainingTime);
  };

  function handlePress(item: TimerKeyboard[number]) {
    if (item === '⌫') {
      onHeavyPress()
      setDigits([0, ...digits.slice(0, 5)]);
    } else if (item === '00') {
      if (digits[0] === 0 && digits[1] === 0) {
        onPress()
        const afterFirst = [...digits.slice(1), 0];
        const afterSecond = [...afterFirst.slice(1), 0];
        setDigits(afterSecond);
      }
    } else {
      if (digits[0] === 0) {
        onPress()
        setDigits([...digits.slice(1), +item]);
      }
    }
  }

  function digitsToSec(digits: number[]): number {
    const hh = digits[0] * 10 + digits[1]
    const mm = digits[2] * 10 + digits[3]
    const ss = digits[4] * 10 + digits[5]
    return (hh * 60 * 60) + (mm * 60) + ss;
  }

  function formatTime(totalSec: number): string {
    return formatDuration(totalSec * 1000, { showHours: true });
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timer</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {status === 'idle' ? (
          <SetTimer
            hours={totalHours}
            minutes={totalMinutes}
            seconds={totalSeconds}
            numbsArr={numbsArr}
            handlePress={handlePress}
            handleStart={start}
          />
        ) : duration !== null && timeLeft !== null ? (
          <TimerItem
            timeLeft={timeLeft}
            duration={duration}
            remountKey={remountKey}
            handleClear={stop}
            formatTime={formatTime}
            handleStop={pause}
            handleStart={start}
            handleAdd={addTime}
            handleReset={reset}
            handleFinish={finish}
            onTimeUpdate={handleTimeUpdate}
            status={status}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F0F0F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#FFFFFF',
  },
  content: {
    padding: 15
  }
});