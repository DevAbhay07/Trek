import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import parkingReducer from './slices/parkingSlice';
import bookingReducer from './slices/bookingSlice';
import websocketReducer from './slices/websocketSlice';
import opencvReducer from './slices/opencvSlice';
import systemReducer from './slices/systemSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parking: parkingReducer,
    booking: bookingReducer,
    websocket: websocketReducer,
    opencv: opencvReducer,
    system: systemReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/messageReceived'],
        ignoredPaths: ['websocket.lastMessage'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;