import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';

export type ThemeMode = 'light' | 'dark' | 'system';
export type WeekendAlarmBehavior = 'normal' | 'skip';

export interface SettingsState {
  themeMode: ThemeMode;
  homeTimezoneId: string | null;
  weekendAlarmBehavior: WeekendAlarmBehavior;
  snoozeLengthMinutes: number;
  silenceAfterMinutes: number;
  volume: number;
  graduallyIncreaseVolume: boolean;
  defaultVibrate: boolean;
  timerSoundId: string;
}

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

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setHomeTimezone(state, action: PayloadAction<string | null>) {
      state.homeTimezoneId = action.payload;
    },
    setWeekendAlarmBehavior(state, action: PayloadAction<WeekendAlarmBehavior>) {
      state.weekendAlarmBehavior = action.payload;
    },
    setSnoozeLength(state, action: PayloadAction<number>) {
      state.snoozeLengthMinutes = action.payload;
    },
    setSilenceAfter(state, action: PayloadAction<number>) {
      state.silenceAfterMinutes = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    setGraduallyIncreaseVolume(state, action: PayloadAction<boolean>) {
      state.graduallyIncreaseVolume = action.payload;
    },
    setDefaultVibrate(state, action: PayloadAction<boolean>) {
      state.defaultVibrate = action.payload;
    },
    setTimerSound(state, action: PayloadAction<string>) {
      state.timerSoundId = action.payload;
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const {
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
} = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = (state: RootState) => state.settings;
export const selectThemeMode = (state: RootState) => state.settings.themeMode;
