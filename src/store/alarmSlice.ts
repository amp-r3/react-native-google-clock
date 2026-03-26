import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Alarm {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  label: string;
  days: days[];
  enabled: boolean;
}

export type days = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su'

export interface AlarmState {
  alarms: Alarm[];
}

const initialState: AlarmState = {
  alarms: [
    {
      id: '1',
      time: '06:00',
      period: 'AM',
      label: 'Work',
      days: ['Mo', 'Tu', 'Th', 'Fr', 'Sa'],
      enabled: true,
    },
    {
      id: '2',
      time: '06:30',
      period: 'AM',
      label: 'Day off',
      days: ['We', 'Su'],
      enabled: false,
    },
    {
      id: '3',
      time: '08:00',
      period: 'AM',
      label: 'Gym',
      days: ['We', 'Su'],
      enabled: false,
    },
  ],
}

export const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    addAlarm: (state, action: PayloadAction<Omit<Alarm, 'id'>>) => {
      state.alarms.push({ ...action.payload, id: nanoid() })
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

export const { addAlarm, deleteAlarm, enableAlarm } = alarmSlice.actions

export default alarmSlice.reducer