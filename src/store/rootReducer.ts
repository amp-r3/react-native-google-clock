import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import alarmSlice from './alarmSlice';


const alarmPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['alarms'], 
};

const rootReducer = combineReducers({
  alarm: persistReducer(alarmPersistConfig, alarmSlice),
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;