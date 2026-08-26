import { getIsScheduled, getNextAlarmDay, getTimeUntilAlarm, parseTime } from '../alarmUtils';

// 2024-01-01 is a Monday.
const NOW = new Date('2024-01-01T10:00:00');

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('parseTime', () => {
  it('parses AM times, treating 12 AM as hour 0', () => {
    expect(parseTime('6:00', 'AM')).toEqual({ hours: 6, minutes: 0 });
    expect(parseTime('12:00', 'AM')).toEqual({ hours: 0, minutes: 0 });
  });

  it('parses PM times, treating 12 PM as hour 12', () => {
    expect(parseTime('12:00', 'PM')).toEqual({ hours: 12, minutes: 0 });
    expect(parseTime('11:30', 'PM')).toEqual({ hours: 23, minutes: 30 });
  });
});

describe('getNextAlarmDay — one-time mode', () => {
  it('labels a future time today as "Today"', () => {
    const result = getNextAlarmDay({ time: '11:00', period: 'AM', date: NOW });
    expect(result.dateLabel).toBe('Today');
    expect(result.isoDate).not.toBeNull();
  });
});

describe('getNextAlarmDay — recurring mode', () => {
  it('returns no alarm when no days are selected', () => {
    const result = getNextAlarmDay({ selectedDays: [] });
    expect(result).toEqual({ dateLabel: 'No alarm set', isoDate: null });
  });

  it('labels a later time today as "Today"', () => {
    const result = getNextAlarmDay({ time: '11:00', period: 'AM', selectedDays: ['Mo'] });
    expect(result.dateLabel).toBe('Today');
  });

  it('rolls over to next week when the only selected day has already passed today', () => {
    const result = getNextAlarmDay({ time: '9:00', period: 'AM', selectedDays: ['Mo'] });
    expect(result.dateLabel).not.toBe('Today');
    expect(result.isoDate).not.toBeNull();
    const target = new Date(result.isoDate as string);
    expect(target.getDay()).toBe(1); // Monday
    expect(target.getTime()).toBeGreaterThan(NOW.getTime());
  });
});

describe('getIsScheduled', () => {
  it('is false for today and tomorrow', () => {
    expect(getIsScheduled(NOW)).toBe(false);
    const tomorrow = new Date(NOW);
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getIsScheduled(tomorrow)).toBe(false);
  });

  it('is true more than a day out', () => {
    const dayAfterTomorrow = new Date(NOW);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    expect(getIsScheduled(dayAfterTomorrow)).toBe(true);
  });
});

describe('getTimeUntilAlarm', () => {
  it('reports invalid dates', () => {
    expect(getTimeUntilAlarm('not-a-date')).toBe('Invalid date');
  });

  it('reports less than a minute for near-term alarms', () => {
    const soon = new Date(NOW.getTime() + 30_000).toISOString();
    expect(getTimeUntilAlarm(soon)).toBe('Before the alarm goes off: less than a minute');
  });

  it('formats hours and minutes', () => {
    const later = new Date(NOW.getTime() + 90 * 60_000).toISOString();
    expect(getTimeUntilAlarm(later)).toBe('Before the alarm goes off: 1 h 30 min');
  });
});
