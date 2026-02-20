import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  FastagVerification,
  UserRole,
  VehicleType,
  UserRegistration,
  AdminRegistration,
} from '@/types';

// Dummy users for testing
const DUMMY_USERS: Array<User & {password: string}> = [
  {
    id: '2',
    firstName: 'Admin',
    lastName: 'Team',
    email: 'teaminfra06@gmail.com',
    password: 'teaminfra',
    phone: '+91 9315880054',
    role: UserRole.ADMIN,
    fastagId: 'FT987654321',
    fastagBalance: 5000,
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      privacy: {
        showProfile: true,
        shareLocation: true,
      },
      theme: 'dark',
      language: 'en',
    },
    vehicles: [
      {
        id: 'v2',
        userId: '2',
        licensePlate: 'MH 12 AD 5678',
        make: 'BMW',
        model: 'X5',
        color: 'Black',
        vehicleType: VehicleType.CAR,
        fastagEnabled: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@test.com',
    password: 'jane123',
    phone: '+91 9876543230',
    role: UserRole.USER,
    fastagId: 'FT456789123',
    fastagBalance: 800,
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        push: false,
        sms: true,
      },
      privacy: {
        showProfile: false,
        shareLocation: false,
      },
      theme: 'light',
      language: 'en',
    },
    vehicles: [
      {
        id: 'v3',
        userId: '3',
        licensePlate: 'MH 12 JS 9012',
        make: 'Honda',
        model: 'CBR',
        color: 'Red',
        vehicleType: VehicleType.MOTORCYCLE,
        fastagEnabled: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Backup test accounts for quick testing
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@test.com',
    password: 'password123',
    phone: '+91 9876543210',
    role: UserRole.USER,
    fastagId: 'FT111111111',
    fastagBalance: 1200,
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        showProfile: true,
        shareLocation: false,
      },
      theme: 'light',
      language: 'en',
    },
    vehicles: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    firstName: 'Admin',
    lastName: 'Test',
    email: 'admin@test.com',
    password: 'admin123',
    phone: '+91 9876543220',
    role: UserRole.ADMIN,
    fastagId: 'FT999999999',
    fastagBalance: 5000,
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      privacy: {
        showProfile: true,
        shareLocation: true,
      },
      theme: 'dark',
      language: 'en',
    },
    vehicles: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
];

export interface OTPResponse {
  success: boolean;
  message: string;
  mobile?: string;
  otpSentAt?: string;
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
}

export interface AuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<AuthResponse>;
  registerUser(data: UserRegistration): Promise<AuthResponse>;
  registerAdmin(data: AdminRegistration): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  updateProfile(userData: Partial<User>): Promise<User>;
  verifyFastag(fastagId: string): Promise<FastagVerification>;
  refreshToken(): Promise<{ token: string; refreshToken: string }>;
  resetPassword(email: string): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  resendVerificationEmail(): Promise<void>;
  sendOTP(mobile: string): Promise<OTPResponse>;
  verifyOTP(data: OTPVerifyRequest): Promise<AuthResponse>;
}

class AuthServiceImpl implements AuthService {
  private generateToken(user: User): string {
    return `dummy_token_${user.id}_${Date.now()}`;
  }

  private generateRefreshToken(user: User): string {
    return `dummy_refresh_${user.id}_${Date.now()}`;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'tester@gmail.com' && credentials.password === 'user@1234') {
    return {
      user: {
        id: 'user-001',
        email: 'tester@gmail.com',
        firstName: 'Tester', // Ensure these match your User type
        lastName: 'Account',
        role: UserRole.USER
      } as any,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    };
  }
    const user = DUMMY_USERS.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store tokens in localStorage for dummy implementation
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = DUMMY_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User & {password: string} = {
      id: `${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: UserRole.USER,
      fastagId: userData.fastagId,
      fastagBalance: 0,
      isVerified: false,
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          showProfile: true,
          shareLocation: false,
        },
        theme: 'light',
        language: 'en',
      },
      vehicles: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to dummy users (in real app, this would be saved to database)
    DUMMY_USERS.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const token = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    // Store tokens in localStorage for dummy implementation
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  }

  async registerUser(data: UserRegistration): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));

    const existingUser = DUMMY_USERS.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const [firstName, ...lastParts] = data.name.trim().split(' ');
    const lastName = lastParts.join(' ') || '-';

    const newUser: User & { password: string } = {
      id: `usr_${Date.now()}`,
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: UserRole.USER,
      fastagId: undefined,
      fastagBalance: 0,
      isVerified: false,
      preferences: {
        notifications: { email: true, push: true, sms: false },
        privacy: { showProfile: true, shareLocation: false },
        theme: 'light',
        language: 'en',
      },
      vehicles: [
        {
          id: `v_${Date.now()}`,
          userId: `usr_${Date.now()}`,
          licensePlate: data.vehicleNumber.toUpperCase(),
          make: 'Unknown',
          model: 'Unknown',
          color: 'Unknown',
          vehicleType: VehicleType.CAR,
          fastagEnabled: false,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DUMMY_USERS.push(newUser);
    const { password: _pw, ...userWithoutPassword } = newUser;
    const token = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return { user: userWithoutPassword, token, refreshToken };
  }

  async registerAdmin(data: AdminRegistration): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));

    const existingUser = DUMMY_USERS.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const [firstName, ...lastParts] = data.name.trim().split(' ');
    const lastName = lastParts.join(' ') || '-';

    const newAdmin: User & { password: string } = {
      id: `adm_${Date.now()}`,
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: UserRole.ADMIN,
      fastagId: undefined,
      fastagBalance: 0,
      isVerified: false,
      preferences: {
        notifications: { email: true, push: true, sms: true },
        privacy: { showProfile: true, shareLocation: true },
        theme: 'dark',
        language: 'en',
      },
      vehicles: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DUMMY_USERS.push(newAdmin);
    const { password: _pw, ...adminWithoutPassword } = newAdmin;
    const token = this.generateToken(newAdmin);
    const refreshToken = this.generateRefreshToken(newAdmin);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return { user: adminWithoutPassword, token, refreshToken };
  }

  async logout(): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser(): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract user ID from token (in real implementation, would verify JWT)
    const userId = token.split('_')[2];
    const user = DUMMY_USERS.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const userId = token.split('_')[2];
    const userIndex = DUMMY_USERS.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    DUMMY_USERS[userIndex] = { 
      ...DUMMY_USERS[userIndex], 
      ...userData, 
      updatedAt: new Date().toISOString() 
    };
    
    const { password, ...userWithoutPassword } = DUMMY_USERS[userIndex];
    return userWithoutPassword;
  }

  async verifyFastag(fastagId: string): Promise<FastagVerification> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate FASTag verification
    return {
      fastagId,
      balance: Math.floor(Math.random() * 5000) + 500,
      isActive: true,
      lastTransaction: new Date().toISOString(),
    };
  }

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const userId = refreshToken.split('_')[2];
    const user = DUMMY_USERS.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const newToken = this.generateToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    // Update tokens in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  async resetPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = DUMMY_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User with this email does not exist');
    }
    
    // In real implementation, would send reset email via backend API
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const userId = token.split('_')[2];
    const userIndex = DUMMY_USERS.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    if (DUMMY_USERS[userIndex].password !== oldPassword) {
      throw new Error('Current password is incorrect');
    }

    DUMMY_USERS[userIndex].password = newPassword;
  }

  async verifyEmail(token: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real implementation, would verify the email token via backend API
  }

  async resendVerificationEmail(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // In real implementation, would resend verification email via backend API
  }

  async sendOTP(mobile: string): Promise<OTPResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate mobile number
    if (!mobile || mobile.length !== 10) {
      throw new Error('Invalid mobile number');
    }

    // Generate random 6-digit OTP (for simulation)
    const otp = '123456'; // Fixed OTP for testing
    
    // In real implementation, would send SMS via backend API gateway
    
    // Store OTP temporarily (in real app, would be server-side)
    localStorage.setItem(`otp_${mobile}`, otp);
    localStorage.setItem(`otp_${mobile}_timestamp`, Date.now().toString());

    return {
      success: true,
      message: 'OTP sent successfully',
      mobile,
      otpSentAt: new Date().toISOString(),
    };
  }

  async verifyOTP(data: OTPVerifyRequest): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { mobile, otp } = data;

    // Validate inputs
    if (!mobile || !otp) {
      throw new Error('Mobile number and OTP are required');
    }

    // Check stored OTP (in real app, would verify with backend)
    const storedOtp = localStorage.getItem(`otp_${mobile}`);
    const timestamp = localStorage.getItem(`otp_${mobile}_timestamp`);

    if (!storedOtp) {
      throw new Error('OTP not found. Please request a new OTP');
    }

    // Check if OTP is expired (5 minutes)
    if (timestamp) {
      const otpAge = Date.now() - parseInt(timestamp);
      if (otpAge > 5 * 60 * 1000) {
        localStorage.removeItem(`otp_${mobile}`);
        localStorage.removeItem(`otp_${mobile}_timestamp`);
        throw new Error('OTP has expired. Please request a new OTP');
      }
    }

    // Verify OTP
    if (otp !== storedOtp) {
      throw new Error('Invalid OTP. Please try again');
    }

    // Clear OTP after successful verification
    localStorage.removeItem(`otp_${mobile}`);
    localStorage.removeItem(`otp_${mobile}_timestamp`);

    // Find or create user by mobile number
    let user = DUMMY_USERS.find(u => u.phone === `+91 ${mobile}` || u.phone === mobile);

    // If user doesn't exist, create a new one
    if (!user) {
      const newUser: User & {password: string} = {
        id: `mobile_${Date.now()}`,
        firstName: 'User',
        lastName: mobile.slice(-4),
        email: `${mobile}@mobile.user`,
        password: mobile, // Use mobile as password for mobile users
        phone: `+91 ${mobile}`,
        role: UserRole.USER,
        fastagId: undefined,
        fastagBalance: 0,
        isVerified: true,
        preferences: {
          notifications: {
            email: false,
            push: true,
            sms: true,
          },
          privacy: {
            showProfile: true,
            shareLocation: false,
          },
          theme: 'light',
          language: 'en',
        },
        vehicles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      DUMMY_USERS.push(newUser);
      user = newUser;
    }

    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store tokens in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  }
}

// Export a singleton instance
export const authService = new AuthServiceImpl();
export default authService;