import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Alarm, days, enableAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { getIsScheduled, getTimeUntilAlarm } from '../utils/alarmUtils';

type Props = {
  alarm: Alarm;
};

const DAYS: days[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function AlarmItem({ alarm }: Props) {
  const enabled = alarm.enabled
  const dispatch = useDispatch()
  const isScheduled = getIsScheduled(new Date(alarm.date)) && alarm.days.length < 1;
  const scheduledText = new Date(alarm.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  })
  const setEnabled = () => {
    if (alarm.date || alarm.days.length > 0) {
      dispatch(enableAlarm({ id: alarm.id }))
      if (!enabled) {
        Toast.show({
          type: 'info',
          text1: getTimeUntilAlarm(alarm.date),
          position: 'bottom',
          visibilityTime: 2500,

        });
      }
    }

  }
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/add-alarm', params: { id: alarm.id } });
      }}
      style={[styles.card, !enabled && styles.cardDisabled]}
    >
      <View style={styles.info}>
        <Text style={[styles.label, !enabled && styles.textDisabled]}>
          {alarm.label}
        </Text>

        <View style={styles.timeRow}>
          <Text style={[styles.time, !enabled && styles.textDisabled]}>
            {alarm.time}
          </Text>
          <Text style={[styles.period, !enabled && styles.textDisabled]}>
            {alarm.period}
          </Text>
        </View>

        {
          isScheduled ?
            <Text>{`Scheduled for ${scheduledText}`}</Text> :
            <View style={styles.daysRow}>
              {DAYS.map(day => {
                const isActive = alarm.days.includes(day);
                return (
                  <View
                    key={day}
                    style={[
                      styles.dayBadge,
                      isActive && (enabled ? styles.dayBadgeActive : styles.dayBadgeActiveDisabled),
                      !isActive && (enabled ? styles.dayBadgeInactive : styles.dayBadgeInactiveDisabled),
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isActive && (enabled ? styles.dayTextActive : styles.dayTextActiveDisabled),
                        !isActive && (enabled ? styles.dayTextInactive : styles.dayTextInactiveDisabled),
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
        }
      </View>

      <Switch
        value={enabled}
        onValueChange={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setEnabled();
        }}
        trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
        thumbColor={enabled ? '#fff' : '#636366'}
        style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    borderRadius: 16,
    padding: 20,
  },
  cardDisabled: {
    backgroundColor: '#212121',
  },
  info: {
    gap: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  time: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
  },
  period: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#3c3c3c',
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  textDisabled: {
    color: '#fff',
    fontWeight: '400',
  },

  daysRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  dayBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayBadgeActive: {
    backgroundColor: '#1c1c1e',
  },
  dayBadgeInactive: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  dayBadgeActiveDisabled: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dayBadgeInactiveDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  dayText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dayTextActive: {
    color: '#fff',
  },
  dayTextInactive: {
    color: 'rgba(0,0,0,0.3)',
  },
  dayTextActiveDisabled: {
    color: 'rgba(255,255,255,0.9)',
  },
  dayTextInactiveDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
});