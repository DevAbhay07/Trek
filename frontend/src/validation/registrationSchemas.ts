import { z } from 'zod';

// ─── Shared helpers ───────────────────────────────────────────────────────────

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character (!@#$…)');

// Indian vehicle number plate  — handles both old (MP07CA0505) and
// modern BH-series (22BH1234A) formats, case-insensitive
const vehicleNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{1,4}$|^\d{2}BH\d{4}[A-Z]{1,2}$/,
    'Enter a valid Indian vehicle number (e.g. MH12AB1234 or 22BH1234A)',
  );

// ─── User Registration Schema ─────────────────────────────────────────────────

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(64, 'Name is too long'),
  vehicleNumber: vehicleNumberSchema,
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type UserRegistrationFormValues = z.infer<typeof userRegistrationSchema>;

// ─── Admin Registration Schema ────────────────────────────────────────────────

export const FACILITY_TYPES = [
  'Mall',
  'Hospital',
  'Business Park',
  'Public Parking',
  'Airport',
  'Stadium',
] as const;

export const adminRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(64, 'Name is too long'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: phoneSchema,
  organizationName: z
    .string()
    .trim()
    .min(2, 'Organization name is required')
    .max(120, 'Too long'),
  facilityType: z.enum(FACILITY_TYPES, {
    errorMap: () => ({ message: 'Select a facility type' }),
  }),
  totalSlots: z
    .number({ invalid_type_error: 'Enter a positive number' })
    .int('Must be a whole number')
    .positive('Must be greater than 0')
    .max(10_000, 'Exceeds maximum allowed slots'),
  address: z
    .string()
    .trim()
    .min(10, 'Address must be at least 10 characters')
    .max(300, 'Address is too long'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type AdminRegistrationFormValues = z.infer<typeof adminRegistrationSchema>;
