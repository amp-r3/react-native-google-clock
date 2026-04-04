import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStopwatch } from '../../src/hooks/useStopwatch';
import { FlatList } from 'react-native-gesture-handler';
import LapItem from '../../src/components/LapItem';
import { useRef } from 'react';

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

  const flatListRef = useRef<FlatList>(null);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stopwatch</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={22} color="#fff" />
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
          onPress={isRunning ? handleStop : handleStart}
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
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          )}
          {!!isRunning && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleLap}
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
  timerContainer: {
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
    backgroundColor: '#FF6B6B',
  },
  startButton: {
    backgroundColor: '#F0F0F0',
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