import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async Thunk: Fetch all events
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Unable to load events');
    }
  }
);

// Async Thunk: Create an event
export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create event');
    }
  }
);

// Async Thunk: Delete an event
export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${eventId}`);
      return eventId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete event');
    }
  }
);

// Events Slice managing global events state
const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearEventsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  }
});

export const { clearEventsError } = eventsSlice.actions;
export default eventsSlice.reducer;

