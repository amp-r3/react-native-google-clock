import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getNextAlarmDay } from '../utils/alarmUtils';

export interface Alarm {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  label: string;
  days: days[];
  options: AlarmOptions;
  enabled: boolean;
  date: string;
}

export type days = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su'

export interface AlarmState {
  alarms: Alarm[];
}

export interface AlarmOptions {
  vibration: boolean;
  weather: boolean;
}

const initialState: AlarmState = {
  alarms: [],
}

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    addAlarm: (state, action: PayloadAction<Alarm>) => {   
      const alarm = action.payload 
      state.alarms.push(alarm);
    },
    editAlarm: (state, action: PayloadAction<{ 
      editedAlarm: Partial<Alarm>; 
      id: string 
    }>) => {
      const alarm = state.alarms.find(item => item.id === action.payload.id);
      if (!alarm) return;
    
      Object.assign(alarm, action.payload.editedAlarm);
    },
    deleteAlarm: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.alarms.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state.alarms.splice(index, 1)
      }
    },
    enableAlarm: (state, action: PayloadAction<{ id: string }>) => {
      const alarm = state.alarms.find(item => item.id === action.payload.id)
      if (alarm) {
        alarm.enabled = !alarm.enabled
      }
    },    
  },
})

export const { addAlarm, deleteAlarm, enableAlarm, editAlarm } = alarmSlice.actions

export default alarmSlice.reducer