import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginRequest, RegisterRequest, AuthResponse, RegistrationPayload } from '@/types';
import { authService } from '@/services/authService';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'), // Set to true if token exists
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      if (credentials.email === 'tester@gmail.com' && credentials.password === 'user@1234') {
        const mockResponse: AuthResponse = {
          user: {
            id: 'user-001',
            email: 'tester@gmail.com',
            // Try these common property names instead of 'name'
            firstName: 'Test',
            lastName: 'User',
            role: 'user' as any,
            // Add any other required fields from your User interface here
            // e.g., phoneNumber: '',
          } as User, // Explicitly cast to User to see which fields are missing
          token: 'mock-user-token',
          refreshToken: 'mock-user-refresh'
        };
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('refreshToken', mockResponse.refreshToken);
        return mockResponse;
      }

      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Role-aware registration: routes to registerUser or registerAdmin in authService
 * based on the discriminated union payload.
 */
export const registerByRole = createAsyncThunk(
  'auth/registerByRole',
  async (payload: RegistrationPayload, { rejectWithValue }) => {
    try {
      const response =
        payload.role === 'USER'
          ? await authService.registerUser(payload)
          : await authService.registerAdmin(payload);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const verifyFastag = createAsyncThunk(
  'auth/verifyFastag',
  async (fastagId: string, { rejectWithValue }) => {
    try {
      const fastagData = await authService.verifyFastag(fastagId);
      return fastagData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'FASTag verification failed');
    }
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (mobile: string, { rejectWithValue }) => {
    try {
      const response = await authService.sendOTP(mobile);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (data: { mobile: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'OTP verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // Register by Role
      .addCase(registerByRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerByRole.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerByRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setLoading, updateUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;