import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SetTimer from '../../src/components/SetTimer';
import TimerItem from '../../src/components/TimerItem';

export type TimerKeyboard = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫']
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';
const numbsArr: TimerKeyboard = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'] as const


export default function TimerScreen() {
  const insets = useSafeAreaInsets();
  const [timeSet, setTimeSet] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [digits, setDigits] = useState([0, 0, 0, 0, 0, 0]);
  const totalHours = digits[0] * 10 + digits[1]
  const totalMinutes = digits[2] * 10 + digits[3]
  const totalSeconds = digits[4] * 10 + digits[5]

  // Убран setInterval — CountdownCircleTimer сам управляет обратным отсчётом.
  // Два источника (interval + onUpdate) создавали race condition в timeLeft.

  const start = () => {
    if (!timeLeft) {
      const totalSec = digitsToSec(digits);
      if (totalSec === 0) return;
      setTimeSet(totalSec);
      setTimeLeft(totalSec);
      setDigits([0, 0, 0, 0, 0, 0]);
      setStatus('running');
      return; 
    }
    setStatus('running');
  };

  const pause = () => setStatus('paused');

  const stop = () => {
    setStatus('idle');
    setTimeLeft(null);
    setTimeSet(null);
  };

  const reset = () => {
    setStatus('paused');
    setTimeLeft(timeSet);
  };

  // handleAdd только обновляет timeSet для корректного reset в будущем.
  // Актуальный initialRemainingTime считается в TimerItem через remainingRef.
  const addTime = () => {
    setTimeSet(prev => prev + 60);
  };

  const finish = () => {
    setStatus('finished');
  };

  const handleTimeUpdate = (remainingTime: number) => {
    setTimeLeft(remainingTime);
  };

  function handlePress(item: TimerKeyboard[number]) {
    if (item === '⌫') {
      setDigits([0, ...digits.slice(0, 5)]);
    } else if (item === '00') {
      if (digits[0] === 0 && digits[1] === 0) {
        const afterFirst = [...digits.slice(1), 0];
        const afterSecond = [...afterFirst.slice(1), 0];
        setDigits(afterSecond);
      }
    } else {
      if (digits[0] === 0) {
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
    const seconds = Math.floor(totalSec % 60);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    return [
      hours.toString().padStart(2, '0'),
      ':',
      minutes.toString().padStart(2, '0'),
      ':',
      seconds.toString().padStart(2, '0'),
    ].join('');
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
        ) : (
          <TimerItem
            timeLeft={timeLeft}
            timeSet={timeSet}
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
        )}
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