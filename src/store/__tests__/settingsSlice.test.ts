import reducer, {
  setThemeMode,
  setHomeTimezone,
  setWeekendAlarmBehavior,
  setSnoozeLength,
  setSilenceAfter,
  setVolume,
  setGraduallyIncreaseVolume,
  setDefaultVibrate,
  setTimerSound,
  resetSettings,
  SettingsState,
} from '../settingsSlice';

const initialState: SettingsState = {
  themeMode: 'system',
  homeTimezoneId: null,
  weekendAlarmBehavior: 'normal',
  snoozeLengthMinutes: 10,
  silenceAfterMinutes: 15,
  volume: 0.7,
  graduallyIncreaseVolume: false,
  defaultVibrate: true,
  timerSoundId: 'default',
};

describe('settingsSlice reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets the theme mode', () => {
    const state = reducer(initialState, setThemeMode('dark'));
    expect(state.themeMode).toBe('dark');
  });

  it('sets the home timezone', () => {
    const state = reducer(initialState, setHomeTimezone('Europe/Paris'));
    expect(state.homeTimezoneId).toBe('Europe/Paris');
  });

  it('sets weekend alarm behavior', () => {
    const state = reducer(initialState, setWeekendAlarmBehavior('skip'));
    expect(state.weekendAlarmBehavior).toBe('skip');
  });

  it('sets snooze length', () => {
    const state = reducer(initialState, setSnoozeLength(20));
    expect(state.snoozeLengthMinutes).toBe(20);
  });

  it('sets silence after', () => {
    const state = reducer(initialState, setSilenceAfter(5));
    expect(state.silenceAfterMinutes).toBe(5);
  });

  it('sets volume', () => {
    const state = reducer(initialState, setVolume(0.3));
    expect(state.volume).toBe(0.3);
  });

  it('sets gradually increase volume', () => {
    const state = reducer(initialState, setGraduallyIncreaseVolume(true));
    expect(state.graduallyIncreaseVolume).toBe(true);
  });

  it('sets default vibrate', () => {
    const state = reducer(initialState, setDefaultVibrate(false));
    expect(state.defaultVibrate).toBe(false);
  });

  it('sets timer sound', () => {
    const state = reducer(initialState, setTimerSound('chimes'));
    expect(state.timerSoundId).toBe('chimes');
  });

  it('resets to initial state', () => {
    const changed = reducer(initialState, setThemeMode('light'));
    const state = reducer(changed, resetSettings());
    expect(state).toEqual(initialState);
  });
});
