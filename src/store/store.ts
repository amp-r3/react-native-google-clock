import { configureStore } from '@reduxjs/toolkit'
import alarmSlice from '../hooks/alarmSlice'

export const store = configureStore({
  reducer: {
    alarm: alarmSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch