import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Alarm, enableAlarm } from "../store/alarmSlice";
import { useDispatch } from "react-redux";
import { useRouter } from 'expo-router';

type Props = {
  alarm: Alarm;
};

export default function AlarmItem({ alarm }: Props) {
  const enabled = alarm.enabled
  const dispatch = useDispatch()
  const setEnabled = () => {
    dispatch(enableAlarm({id:alarm.id}))
  }
  const router = useRouter()


  return (
    <TouchableOpacity onPress={()=>{router.push({ pathname: '/add-alarm', params: { id: alarm.id } })}} style={[styles.card, !enabled && styles.cardDisabled]}>
      <View style={styles.info}>
        <Text style={[styles.label, !enabled && styles.textDisabled]}>
          {alarm.label}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', gap: 10, }}>
          <Text style={[styles.time, !enabled && styles.textDisabled]}>
            {alarm.time}
          </Text>
          <Text style={[styles.period, !enabled && styles.textDisabled]}>
            {alarm.period}
          </Text>
        </View> 

        <View style={{marginTop: 2, flexDirection: 'row', gap: 4}}>
          {
            alarm.days.map(day => (
              <Text key={day} style={[styles.days, !enabled && styles.daysDisabled]}>
                {day}
              </Text>
            ))
          }

        </View>

      </View>

      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{ false: '#3A3A3C', true: '#3A3A3C' }}
        thumbColor={enabled ? '#fff' : '#636366'}
        style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
      />

    </TouchableOpacity>
  )
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
  time: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -1,
  },
  period: {
    alignSelf: 'flex-end',
    marginBottom: 5
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: 600
  },
  days: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c5c5c',
  },
  daysDisabled: {
    color: '#d1d1d1',
    fontWeight: '400'
  },
  textDisabled: {
    color: '#fff',
    fontWeight: '400',
  },
});