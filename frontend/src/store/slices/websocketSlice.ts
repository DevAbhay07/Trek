import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketState, WebSocketMessage, WebSocketMessageType } from '@/types';

const initialState: WebSocketState = {
  isConnected: false,
  isConnecting: false,
  error: null,
  lastMessage: null,
  subscribedChannels: [],
  connectionAttempts: 0,
  lastReconnectAt: undefined,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectionStart: (state) => {
      state.isConnecting = true;
      state.error = null;
      state.connectionAttempts += 1;
    },
    connectionSuccess: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
      state.connectionAttempts = 0;
    },
    connectionFailed: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
      state.lastReconnectAt = new Date().toISOString();
    },
    connectionClosed: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.subscribedChannels = [];
    },
    messageReceived: (state, action: PayloadAction<WebSocketMessage>) => {
      state.lastMessage = action.payload;
    },
    subscribeToChannel: (state, action: PayloadAction<string>) => {
      if (!state.subscribedChannels.includes(action.payload)) {
        state.subscribedChannels.push(action.payload);
      }
    },
    unsubscribeFromChannel: (state, action: PayloadAction<string>) => {
      state.subscribedChannels = state.subscribedChannels.filter(
        channel => channel !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
    },
    resetConnectionAttempts: (state) => {
      state.connectionAttempts = 0;
    },
  },
});

export const {
  connectionStart,
  connectionSuccess,
  connectionFailed,
  connectionClosed,
  messageReceived,
  subscribeToChannel,
  unsubscribeFromChannel,
  clearError,
  resetConnectionAttempts,
} = websocketSlice.actions;

export default websocketSlice.reducer;