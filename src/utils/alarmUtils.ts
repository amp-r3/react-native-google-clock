import { days } from "../store/alarmSlice";

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

  // Parse time to 24-hour format
  const [alarmHourStr, alarmMinuteStr] = time.split(':');
  let alarmHour = parseInt(alarmHourStr, 10);
  const alarmMinute = parseInt(alarmMinuteStr, 10);

  if (period === 'PM' && alarmHour !== 12) alarmHour += 12;
  else if (period === 'AM' && alarmHour === 12) alarmHour = 0;

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

  const selectedDaysSet = new Set(selectedDays.map(day => dayMap[day]));

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