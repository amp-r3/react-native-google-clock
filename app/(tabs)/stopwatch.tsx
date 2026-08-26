import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStopwatch } from '../../src/hooks/useStopwatch';
import { FlatList } from 'react-native-gesture-handler';
import LapItem from '../../src/components/LapItem';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ThemeColors } from '../../src/theme/colors';
import OverflowMenu from '../../src/components/OverflowMenu';

export default function StopWatchScreen() {
  const insets = useSafeAreaInsets();
  const {
    displayTime,
    isRunning,
    formattedLaps,
    handleStart,
    handleStop,
    handleReset,
    handleLap,
    formatTime,
  } = useStopwatch();

  const {onPress,  onDelete} = useHaptics()
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [menuVisible, setMenuVisible] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stopwatch</Text>
        <TouchableOpacity onPress={() => { onPress(); setMenuVisible(true); }}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <OverflowMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <View style={styles.timerContainer}>
        <Text
          style={isRunning ? styles.timerText : styles.timerTextDisabled}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatTime(displayTime)}
        </Text>
      </View>

      <View style={styles.lapsWrapper}>
        {formattedLaps.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={formattedLaps}
            contentContainerStyle={styles.lapsScrollContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => {
              const order = 'order' in item ? item.order : formattedLaps.length;
              return `lap-${order}`;
            }}
            renderItem={({ item }) => {
              const itemOrder = 'order' in item ? item.order : formattedLaps.length;
              return (
                <LapItem
                  order={itemOrder}
                  startMs={item.start}
                  finishMs={item.finish}
                  isActive={item.isActive}
                />
              );
            }}
          />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
          onPress={isRunning ? ()=>{onPress(); handleStop()} : ()=>{onPress(); handleStart()}}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.startStopText]}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtonsWrapper}>
          {!!displayTime && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={()=>{onDelete(); handleReset()}}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          )}
          {!!isRunning && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={()=>{onPress(); handleLap()}}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Lap</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  timerContainer: {
    letterSpacing: 0.2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  timerText: {
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    fontSize: 80,
    fontWeight: '700',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    ...Platform.select({
      ios: { fontFamily: 'System' },
      android: { fontFamily: 'sans-serif-light' },
    }),
  },

  lapsWrapper: {
    height: 120,
  },
  lapsScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
  },

  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 67,
    gap: 6,
  },
  secondaryButtonsWrapper: {
    height: 140,
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
    backgroundColor: colors.danger,
  },
  startButton: {
    backgroundColor: colors.accent,
  },
  secondaryButton: {
    paddingVertical: 35,
    backgroundColor: colors.surfaceSecondary,
  },
  startStopText: {
    color: colors.background,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
