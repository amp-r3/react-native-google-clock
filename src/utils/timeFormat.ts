interface FormatDurationOptions {
  showHours?: boolean;
  centiseconds?: boolean;
}

export function formatDuration(ms: number, opts: FormatDurationOptions = {}): string {
  const { showHours = false, centiseconds = false } = opts;

  const totalCs = Math.floor(ms / 10) % 100;
  const totalSec = Math.floor(ms / 1000);
  const seconds = totalSec % 60;
  const totalMinutes = Math.floor(totalSec / 60);
  const minutes = showHours ? totalMinutes % 60 : totalMinutes;
  const hours = Math.floor(totalMinutes / 60);

  const parts = showHours
    ? [hours, minutes, seconds]
    : [minutes, seconds];

  let result = parts.map((n) => n.toString().padStart(2, '0')).join(':');
  if (centiseconds) {
    result += '.' + totalCs.toString().padStart(2, '0');
  }
  return result;
}

export function to12Hour(hours24: number): { hours12: number; period: 'AM' | 'PM' } {
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return { hours12, period };
}
