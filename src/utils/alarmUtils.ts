import { Alarm, days } from "../store/alarmSlice";

interface GetNextAlarmDayProps {
  time?: string;
  period?: 'AM' | 'PM';
  selectedDays?: days[];
  date?: Date | null;
}

interface NextAlarmResult {
  dateLabel: string;
  isoDate: string | null;
}

export function parseTime(time: string, period: 'AM' | 'PM') {
  const [hourStr, minuteStr] = time.split(':');
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return { hours, minutes };
}

/**
 * Returns the next alarm occurrence with a human-readable label.
 * Supports two modes:
 * 1. One-time alarm — when `date` is provided.
 * 2. Recurring alarm — when `selectedDays` is provided.
 *
 * Does NOT modify selectedDays anymore — this logic is now handled in useAlarmForm for instant UI updates.
 */
export function getNextAlarmDay({
  time = '6:00',
  period = 'AM',
  selectedDays = [],
  date = null,
}: GetNextAlarmDayProps): NextAlarmResult {
  const dayMap: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };
  const now = new Date();

  const { hours: alarmHour, minutes: alarmMinute } = parseTime(time, period);
  const DAY_MS = 1000 * 60 * 60 * 24;

  // === ONE-TIME ALARM MODE ===
  if (date) {
    const target = new Date(date);
    target.setHours(alarmHour, alarmMinute, 0, 0);

    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffDays = Math.floor(
      (targetMidnight.getTime() - nowMidnight.getTime()) / DAY_MS
    );

    const dateLabel =
      diffDays === 0 ? 'Today' :
      diffDays === 1 ? 'Tomorrow' :
      `${target.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${target.toLocaleDateString('en-US', { weekday: 'long' })}`;

    return { dateLabel, isoDate: target.toISOString() };
  }

  // === RECURRING ALARM MODE ===
  const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const selectedDaysSet = new Set(selectedDays.map(day => dayMap[day as string]));

  if (selectedDaysSet.size === 0) {
    return { dateLabel: 'No alarm set', isoDate: null };
  }

  for (let i = 0; i <= 7; i++) {
    const checkDayIndex = (todayIndex + i) % 7;

    if (!selectedDaysSet.has(checkDayIndex)) continue;

    if (i === 0) {
      const isAlarmTodayPassed =
        currentHour > alarmHour ||
        (currentHour === alarmHour && currentMinute >= alarmMinute);
      if (isAlarmTodayPassed) continue;
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    nextDate.setHours(alarmHour, alarmMinute, 0, 0);

    const dateLabel =
      i === 0 ? 'Today' :
      i === 1 ? 'Tomorrow' :
      `${nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${nextDate.toLocaleDateString('en-US', { weekday: 'long' })}`;

    return { dateLabel, isoDate: nextDate.toISOString() };
  }

  return { dateLabel: 'No alarm set', isoDate: null };
}

export function getTimeUntilAlarm(isoDate: string): string {
  const now = new Date();
  const alarm = new Date(isoDate);
  
  if (isNaN(alarm.getTime())) {
    return 'Invalid date';
  }

  const diffMs = alarm.getTime() - now.getTime();

  if (diffMs < 60000) {
    return 'Before the alarm goes off: less than a minute';
  }

  const MS_IN_MIN = 60000;
  const MIN_IN_HOUR = 60;
  const MIN_IN_DAY = 1440;

  const totalMinutes = Math.floor(diffMs / MS_IN_MIN);
  const days = Math.floor(totalMinutes / MIN_IN_DAY);
  const hours = Math.floor((totalMinutes % MIN_IN_DAY) / MIN_IN_HOUR);
  const minutes = totalMinutes % MIN_IN_HOUR;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} h`);
  if (minutes > 0) parts.push(`${minutes} min`);

  return `Before the alarm goes off: ${parts.join(' ')}`;
}

export function getTimeAsDate(time: string, period: 'AM' | 'PM'): Date {
  const { hours, minutes } = parseTime(time, period);
  
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function getIsScheduled(date: Date): boolean {
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return target > tomorrow;
}

export function getDefaultDate(time: string, period: 'AM' | 'PM'): string {
  const alarmDate = getTimeAsDate(time, period);

  if (alarmDate <= new Date()) {
    alarmDate.setDate(alarmDate.getDate() + 1);
  }

  return alarmDate.toISOString();
}

export function getNearestAlarm(alarms: Alarm[]): Alarm | null {
  if (!alarms || alarms.length === 0) return null;

  const activeAlarms = alarms.filter(alarm => alarm.enabled);
  if (activeAlarms.length === 0) return null;

  const now = Date.now();

  return activeAlarms.reduce((closest, alarm) => {
    const alarmTime   = new Date(alarm.date).getTime();
    const closestTime = new Date(closest.date).getTime();

    const diffAlarm   = alarmTime - now;
    const diffClosest = closestTime - now;

    if (diffAlarm < 0)   return closest;
    if (diffClosest < 0) return alarm;

    return diffAlarm < diffClosest ? alarm : closest;
  }, activeAlarms[0]);
}

export function formatAlarmLabel(isoDate: string): string {
  const date = new Date(isoDate);

  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Sat"
  const time    = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${weekday} ${time}`;
}