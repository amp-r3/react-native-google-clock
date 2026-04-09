export const getFormattedTime = (timezone: string): string => {
  try {
    const timeString = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());

    return timeString.replace(/\s?[AP]M/i, '');
  } catch {
    return '--:--';
  }
};

export const getTimeDiff = (timezone: string, localTimezone = 'Asia/Tashkent'): string => {
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