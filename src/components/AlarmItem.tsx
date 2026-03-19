import { useState } from "react";
import { StyleSheet, Switch, Text, View } from 'react-native'

type Alarm = {
  id: string;
  period: string;
  time: string;
  label: string;
  days: string;
  enabled: boolean;
};

type Props = {
  alarm: Alarm;
};

export default function AlarmItem({ alarm }: Props) {
  const [enabled, setEnabled] = useState(alarm.enabled)

  return (
    <View style={[styles.card, !enabled && styles.cardDisabled]}>
      <View style={styles.info}>
        <Text style={[styles.label, !enabled && styles.textDisabled]}>
          {alarm.label}
        </Text>
        <View style={{flex: 1, flexDirection: 'row', gap: 10,}}>
        <Text style={[styles.time, !enabled && styles.textDisabled]}>
          {alarm.time}
        </Text>
        <Text style={[styles.period, !enabled && styles.textDisabled]}>
          {alarm.period}
        </Text>
        </View>

        <Text style={[styles.days, !enabled && styles.textDisabled]}>
          {alarm.days}
        </Text>

      </View>

      <Switch
        value={enabled}
        onValueChange={setEnabled}
        trackColor={{ false: '#3A3A3C', true: '#8AB4F8' }}
        thumbColor={enabled ? '#f5f5f5' : '#636366'}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    
  },
  cardDisabled: {
    backgroundColor: '#262626',
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
    color: '#8E8E93',
    marginTop: 2,
  },
  textDisabled: {
    color: '#fff',
    fontWeight: '400',
  },
});