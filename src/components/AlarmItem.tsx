import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Alarm, days, editAlarm, enableAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { getDefaultDate, getIsScheduled, getTimeUntilAlarm } from '../utils/alarmUtils';
import { useAlarmHaptics } from '../hooks/useAlarmHaptics';

type Props = {
  alarm: Alarm;
};

const DAYS: days[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

export default function AlarmItem({ alarm }: Props) {
  const enabled = alarm.enabled
  const dispatch = useDispatch()
  const isScheduled = getIsScheduled(new Date(alarm.date)) && alarm.days.length < 1;
  const scheduledText = new Date(alarm.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
  })
  const { onToggle } = useAlarmHaptics()

  const handleToggleAlarm = () => {
    const isAlarmPassed = new Date(alarm.date).getTime() < Date.now();

    if (isAlarmPassed && !enabled) {
      const newDate = getDefaultDate(alarm.time, alarm.period);

      dispatch(editAlarm({ id: alarm.id, editedAlarm: { ...alarm, date: newDate } }));
      dispatch(enableAlarm({ id: alarm.id }));

      Toast.show({
        type: 'info',
        text1: "The alarm clock won't sound today.",
        text2: "Automatically rescheduled for tomorrow",
        position: 'bottom',
        visibilityTime: 2000,
        onHide: () => {
          Toast.show({
            type: 'info',
            text1: getTimeUntilAlarm(newDate),
            position: 'bottom',
            visibilityTime: 2500,
          });
        },
      });

    } else if (alarm.date || alarm.days.length > 0) {
      dispatch(enableAlarm({ id: alarm.id }));

      if (!enabled) {
        Toast.show({
          type: 'info',
          text1: getTimeUntilAlarm(alarm.date),
          position: 'bottom',
          visibilityTime: 2500,
        });
      }

    } else {
      Toast.show({
        type: 'error',
        text1: 'Set a date or repeat days first',
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };
  const router = useRouter()

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        onToggle();
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
          isScheduled ? (
            <Text
              style={[
                styles.scheduledText,
                enabled ? { color: '#1C1C1E' } : { color: '#FFFFFF' }
              ]}
            >
              {`Scheduled for ${scheduledText}`}
            </Text>
          ) :
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
          handleToggleAlarm();
        }}
        trackColor={{
          false: enabled ? '#C8C8C8' : '#3A3A3C',
          true: enabled ? '#1C1C1E' : '#636366'
        }}
        thumbColor={enabled ? '#FFFFFF' : '#9E9E9E'}
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
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDisabled: {
    backgroundColor: '#212121',
    shadowOpacity: 0.08,
    elevation: 2,
  },

  info: {
    gap: 2,
    flex: 1,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  time: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#1C1C1E',              
  },
  period: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#6B6B6B',                
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  textDisabled: {
    color: '#FFFFFF',
    fontWeight: '400',
  },

  scheduledText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
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
    backgroundColor: '#1C1C1E',        
  },
  dayBadgeInactive: {
    backgroundColor: 'rgba(28, 28, 30, 0.08)',
  },

  dayBadgeActiveDisabled: {
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  dayBadgeInactiveDisabled: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  dayText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dayTextInactive: {
    color: 'rgba(28,28,30,0.45)',
  },
  dayTextActiveDisabled: {
    color: '#FFFFFF',
  },
  dayTextInactiveDisabled: {
    color: 'rgba(255,255,255,0.35)',
  },
});