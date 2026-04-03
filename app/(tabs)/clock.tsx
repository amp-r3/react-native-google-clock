import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store/rootReducer';
import { formatAlarmLabel, getNearestAlarm } from '../../src/utils/alarmUtils';

export default function ClockScreen() {
  const alarms = useSelector((state: RootState) => state.alarm.alarms)
  const [time, setTime] = useState(new Date());
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const nearest = getNearestAlarm(alarms);
  const nearestDate = nearest ? formatAlarmLabel(nearest.date) : null

  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(time);

  const formattedTime = parts.find(p => p.type === 'hour').value
    + ':'
    + parts.find(p => p.type === 'minute').value;

  const period = parts.find(p => p.type === 'dayPeriod').value;
  const date = time.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clocks</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text><Text style={styles.period}>{period}</Text>
      </View>
      <View style={[styles.optionsContainer, !nearest && { justifyContent: 'center' }]}>
        <Text style={styles.date}>{date}</Text>
        {nearestDate && (
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Ionicons name="alarm" size={25} color="#f0f0f0" />
            <Text style={styles.nearestAlarm}>{nearestDate}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        activeOpacity={0.9}
        onPress={() => router.push('/add-clock')}
      >
        <Ionicons name="add" size={38} color="#0F0F0F" style={styles.fabIcon} />
      </TouchableOpacity>
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 20,
    padding: 25,
  },
  time: {
    color: '#fff',
    letterSpacing: 2,
    fontSize: 90,
    fontWeight: 400
  },
  period: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: 16,
    fontWeight: 400,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  date: {
    color: '#fff',
    fontSize: 20,
  },
  nearestAlarm: {
    color: '#fff',
    fontSize: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 86,
    height: 86,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    color: '#0F0F0F',
  },
});