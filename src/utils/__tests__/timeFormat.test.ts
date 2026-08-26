import { formatDuration, to12Hour } from '../timeFormat';

describe('formatDuration', () => {
  it('formats zero as 00:00', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('formats minutes and seconds without hours by default', () => {
    expect(formatDuration(65_000)).toBe('01:05');
  });

  it('includes hours when showHours is true', () => {
    expect(formatDuration(3_661_000, { showHours: true })).toBe('01:01:01');
  });

  it('appends centiseconds when requested', () => {
    expect(formatDuration(1_234, { centiseconds: true })).toBe('00:01.23');
  });
});

describe('to12Hour', () => {
  it('maps midnight to 12 AM', () => {
    expect(to12Hour(0)).toEqual({ hours12: 12, period: 'AM' });
  });

  it('maps noon to 12 PM', () => {
    expect(to12Hour(12)).toEqual({ hours12: 12, period: 'PM' });
  });

  it('maps afternoon hours to 12-hour PM', () => {
    expect(to12Hour(13)).toEqual({ hours12: 1, period: 'PM' });
  });

  it('maps late evening hours to 12-hour PM', () => {
    expect(to12Hour(23)).toEqual({ hours12: 11, period: 'PM' });
  });
});
