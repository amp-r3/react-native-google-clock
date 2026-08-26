import { getFormattedTime, getTimeDiff } from '../clockUtils';

describe('getFormattedTime', () => {
  it('returns a placeholder for an invalid timezone', () => {
    expect(getFormattedTime('Not/AZone')).toBe('--:--');
  });

  it('formats a valid timezone as 24-hour HH:MM', () => {
    expect(getFormattedTime('UTC')).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('getTimeDiff', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // January — outside US daylight saving time.
    jest.setSystemTime(new Date('2024-01-01T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('reports "Local time" when comparing a timezone to itself', () => {
    expect(getTimeDiff('UTC', 'UTC')).toBe('Local time');
  });

  it('reports the signed hour offset between two timezones', () => {
    expect(getTimeDiff('America/New_York', 'UTC')).toBe('-5h from you');
  });
});
