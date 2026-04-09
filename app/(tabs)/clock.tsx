import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../src/store/rootReducer';
import { formatAlarmLabel, getNearestAlarm } from '../../src/utils/alarmUtils';
import { Clock, removeClock, selectClocks } from '../../src/store/clockSlice';
import ClockItem from '../../src/components/ClockItem';
import SwipeableRow from '../../src/components/SwipeableRow';


export default function ClockScreen() {
  const clocks = useSelector(selectClocks);
  const alarms = useSelector((state: RootState) => state.alarm.alarms);
  const [time, setTime] = useState(new Date());
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const nearest = getNearestAlarm(alarms);
  const nearestDate = nearest ? formatAlarmLabel(nearest.date) : null;
  const dispatch = useDispatch();

  const deleteClock = (item: Clock) => {
    if (item.id) {
      dispatch(removeClock(item.id));
    }
  };

  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(time);

  const formattedTime = parts.find(p => p.type === 'hour')!.value
    + ':'
    + parts.find(p => p.type === 'minute')!.value;

  const period = parts.find(p => p.type === 'dayPeriod')!.value;

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
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#F5F5F5" />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
        <Text style={styles.period}>{period}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.date}>{date}</Text>
        {nearestDate && (
          <View style={styles.nearestAlarmContainer}>
            <MaterialCommunityIcons name="alarm" size={24} color="#9E9E9E" />
            <Text style={styles.nearestAlarm}>{nearestDate}</Text>
          </View>
        )}
      </View>

      {
        clocks.length > 0 ?
          <View style={styles.itemsContainer}>
            <FlatList
              nestedScrollEnabled
              showsVerticalScrollIndicator
              contentContainerStyle={styles.itemsScrollContent}
              data={clocks}
              keyExtractor={(item, i) => `${item.city}-${item.timezone}-${i}`}
              renderItem={({ item }) => (
                <SwipeableRow onRemove={() => deleteClock(item)}>
                  <ClockItem item={item} />
                </SwipeableRow>
              )}
            />
          </View> :
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 44, color: '#AAAAAA', textAlign: 'center' }}>No cities selected</Text>
          </View>
      }

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        activeOpacity={0.9}
        onPress={() => router.push('/add-clock')}
      >
        <MaterialCommunityIcons name="plus" size={38} style={styles.fabIcon} />
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
    gap: 12,
    paddingVertical: 32,
  },
  time: {
    color: '#F5F5F5',
    fontSize: 88,
    fontWeight: '700',
    letterSpacing: -4,
  },
  period: {
    color: '#9E9E9E',
    fontSize: 32,
    paddingBottom: 14,
    fontWeight: '600',
  },

  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  date: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  nearestAlarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nearestAlarm: {
    color: '#9E9E9E',
    fontSize: 18,
    fontWeight: '500',
  },

  itemsContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 12,
  },
  itemsScrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    color: '#262626',
  },
});