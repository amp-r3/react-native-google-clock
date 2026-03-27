import { days } from "../store/alarmSlice";

interface GetNextAlarmDayProps {
  time?: string;
  period?: 'AM' | 'PM';
  selectedDays?: days[];
}


export function getNextAlarmDay ({time = '6:00', period = 'AM', selectedDays = [], }: GetNextAlarmDayProps): string  {
  const dayMap: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };
  const now = new Date();
  const todayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let [alarmHourStr, alarmMinuteStr] = time.split(':');
  let alarmHour = parseInt(alarmHourStr, 10);
  const alarmMinute = parseInt(alarmMinuteStr, 10);

  if (period === "PM" && alarmHour !== 12) alarmHour += 12;
  else if (period === "AM" && alarmHour === 12) alarmHour = 0;

  const selectedDaysNum = selectedDays.map(day => dayMap[day]);

  if (selectedDaysNum.length === 0) return "No alarm set";

  for (let i = 0; i <= 7; i++) {
    const checkDayIndex = (todayIndex + i) % 7;

    if (!selectedDaysNum.includes(checkDayIndex)) continue;

    if (i === 0) {
      const isAlarmTodayPassed = currentHour > alarmHour || (currentHour === alarmHour && currentMinute >= alarmMinute);
      if (!isAlarmTodayPassed) return "Today";
      continue;
    }

    if (i === 1) return "Tomorrow";

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + i);
    
    return `${nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${nextDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
  }

  return "No alarm set";
};