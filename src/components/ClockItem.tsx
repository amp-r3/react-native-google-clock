import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Clock } from '../store/clockSlice';

const getFormattedTime = (timezone: string) => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--:--';
  }
};

const getTimeDiff = (timezone: string, localTimezone = 'Asia/Tashkent'): string => {
  const getOffset = (tz: string) => {
    const offsetStr = Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
      .formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value ?? '';
    const [, sign, h, m = '0'] = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/) ?? [];
    return sign ? (sign === '+' ? 1 : -1) * (parseInt(h) + parseInt(m) / 60) : 0;
  };

  const diff = Math.round(getOffset(timezone) - getOffset(localTimezone));
  if (diff === 0) return 'Local time';
  return `${diff > 0 ? '+' : ''}${diff}h from you`;
};

export default function ClockItem({ item }: { item: Clock }) {
  const [time, setTime] = useState(() => getFormattedTime(item.timezone));

  useEffect(() => {
    const id = setInterval(() => setTime(getFormattedTime(item.timezone)), 1000);
    return () => clearInterval(id);
  }, [item.timezone]);

  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display12 = `${String(hour % 12 || 12).padStart(2, '0')}:${m}`;


  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {}}
      style={styles.card}
    >
      <View style={styles.info}>
        <Text style={styles.country}>{item.country}</Text>
        <Text style={styles.city}>{item.city}</Text>
        <Text style={styles.timeDiff}>{getTimeDiff(item.timezone)}</Text>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{display12}</Text>
          <Text style={styles.period}>{ampm}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1B1F',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    minHeight: 110,
  },

  info: {
    flex: 1,
    gap: 4,
  },
  country: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  city: {
    fontSize: 19,
    fontWeight: '600',
    color: '#F5F5F5',
    letterSpacing: -0.3,
  },
  timeDiff: {
    fontSize: 13,
    fontWeight: '400',
    color: '#757575',
  },

  timeContainer: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -3,
    color: '#F5F5F5', 
  },
  period: {
    marginBottom: 9,
    fontSize: 22,
    fontWeight: '600',
    color: '#9E9E9E',
  },
});