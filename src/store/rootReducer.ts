import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alarmSlice from './alarmSlice';
import clockSlice from './clockSlice';


const alarmPersistConfig = {
  key: 'alarm',
  storage: AsyncStorage,
  whitelist: ['alarms'], 
};
const clockPersistConfig = {
  key: 'clock',
  storage: AsyncStorage,
  whitelist: ['clocks'], 
};

const rootReducer = combineReducers({
  alarm: persistReducer(alarmPersistConfig, alarmSlice),
  clock: persistReducer(clockPersistConfig, clockSlice)
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;