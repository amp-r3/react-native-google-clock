import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './rootReducer';


export type Clock = {
  id: string;
  city: string;
  country: string;
  timezone: string;
};

type ClockState = {
  clocks: Clock[];
};


const initialState: ClockState = {
  clocks: [],
};


const clockSlice = createSlice({
  name: 'clocks',
  initialState,
  reducers: {
    addClock(state, action: PayloadAction<Omit<Clock, 'id'>>) {
      const id = action.payload.timezone;
      const exists = state.clocks.some((c) => c.id === id);
      if (!exists) {
        state.clocks.push({ id, ...action.payload });
      }
    },

    removeClock(state, action: PayloadAction<string>) {
      state.clocks = state.clocks.filter((c) => c.id !== action.payload);
    },

    reorderClocks(state, action: PayloadAction<Clock[]>) {
      state.clocks = action.payload;
    },
  },
});

export const { addClock, removeClock, reorderClocks } = clockSlice.actions;
export default clockSlice.reducer;



export const selectClocks = (state: RootState) => state.clock.clocks;
export const selectClockById = (id: string) => (state: RootState) =>
  state.clock.clocks.find((c) => c.id === id);