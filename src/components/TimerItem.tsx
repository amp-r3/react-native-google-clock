import { useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { TimerStatus } from "../../app/(tabs)/timer";
import { useHaptics } from "../hooks/useHaptics";
import { useTheme } from "../theme/ThemeProvider";
import { ThemeColors } from "../theme/colors";

interface TimerItemProps {
  duration: number;
  timeLeft: number;
  remountKey: number;
  formatTime: (seconds: number) => string;
  handleClear: () => void;
  handleStop: () => void;
  handleStart: () => void;
  handleAdd: () => void;
  handleReset: () => void;
  handleFinish: () => void;
  status: TimerStatus;
  onTimeUpdate: (remainingTime: number) => void;
}

export default function TimerItem({
  duration,
  timeLeft,
  remountKey,
  status,
  formatTime,
  handleClear,
  handleStop,
  handleStart,
  handleAdd,
  handleReset,
  handleFinish,
  onTimeUpdate,
}: TimerItemProps) {

  const { onDelete, onPress } = useHaptics()
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isPlaying = status === 'running';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={()=>{onPress(); handleClear()}} activeOpacity={0.7}>
        <MaterialCommunityIcons name="close" color={colors.textPrimary} size={20} />
      </TouchableOpacity>

      <View style={styles.middle}>
        <CountdownCircleTimer
          key={remountKey}
          isPlaying={isPlaying}
          duration={duration}
          initialRemainingTime={timeLeft}
          size={300}
          strokeWidth={14}
          colors={colors.accent as `#${string}`}
          trailColor={colors.surfaceSecondary as `#${string}`}
          rotation="clockwise"
          updateInterval={0.001}
          onUpdate={(t) => onTimeUpdate(t)}
          onComplete={() => {
            handleFinish();
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => (
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(remainingTime)}</Text>

              <TouchableOpacity style={styles.reset} onPress={() => { onDelete(); handleReset(); }} activeOpacity={0.7}>
                <MaterialCommunityIcons name="restart" color={colors.textPrimary} size={38} />
              </TouchableOpacity>
            </View>
          )}
        </CountdownCircleTimer>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.addTime} onPress={() => { onPress(); handleAdd(); }}>
          <Text style={styles.addTimeText}>+1:00</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pause}
          onPress={status === 'running' ? handleStop : handleStart}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={status === 'running' ? 'pause' : 'play'}
            color={colors.background}
            size={32}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
  },
  close: {
    alignSelf: 'flex-end',
    backgroundColor: colors.surfaceSecondary,
    width: 30,
    height: 30,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 55,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  reset: {
    position: 'absolute',
    bottom: -55,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 50,
    gap: 12,
  },
  addTime: {
    backgroundColor: colors.surfaceSecondary,
    width: 130,
    height: 90,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeText: {
    fontWeight: '600',
    fontSize: 22,
    color: colors.textPrimary,
  },
  pause: {
    backgroundColor: colors.accent,
    width: 130,
    height: 90,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
