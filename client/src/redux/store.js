import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventsReducer from './eventsSlice';

// Redux Store configuration combining auth and events slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer
  }
});

export default store;

