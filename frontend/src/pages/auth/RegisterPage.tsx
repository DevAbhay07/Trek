import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Car,
  MapPin,
  Hash,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

import { registerByRole } from '../../store/slices/authSlice';
import type { AppDispatch, RootState } from '../../store';
import type { RegistrationRole } from '../../types/auth';
import {
  userRegistrationSchema,
  adminRegistrationSchema,
  FACILITY_TYPES,
  type UserRegistrationFormValues,
  type AdminRegistrationFormValues,
} from '../../validation/registrationSchemas';

// ── Shared field wrapper ──────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field = ({ id, label, error, children }: FieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5"
    >
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          key={error}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mt-1 text-xs text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputClass = (hasError: boolean) =>
  `w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm font-medium text-gray-800 outline-none transition-all duration-150 ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400'
      : 'border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white'
  }`;

// ── Password strength ─────────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
  if (score === 2) return { level: 2, label: 'Fair', color: 'bg-yellow-400' };
  return { level: 3, label: 'Strong', color: 'bg-green-500' };
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
  showStrength?: boolean;
}

const PasswordField = ({
  id, label, value, onChange, onBlur, error, placeholder, showStrength,
}: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`${inputClass(!!error)} pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {showStrength && strength && strength.level > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            {([1, 2, 3] as const).map((n) => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  strength.level >= n ? strength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-gray-400">{strength.label}</span>
        </div>
      )}
    </Field>
  );
};

// ── Role selection card ───────────────────────────────────────────────────────

interface RoleCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const RoleCard = ({
  selected, onClick, icon, title, description, badge, badgeColor,
}: RoleCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
      selected
        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          selected
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-black text-sm text-gray-900">{title}</span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
      >
        <CheckCircle2 size={13} className="text-white" />
      </motion.div>
    )}
  </button>
);

// ── User Form ─────────────────────────────────────────────────────────────────

const UserForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: { name: '', vehicleNumber: '', email: '', phone: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (data: UserRegistrationFormValues) => {
    const result = await dispatch(
      registerByRole({
        role: 'USER',
        name: data.name,
        vehicleNumber: data.vehicleNumber,
        email: data.email,
        phone: data.phone,
        password: data.password,
      }),
    );
    if (registerByRole.fulfilled.match(result)) {
      toast.success('Registration successful! Welcome to Park-Prabandh 🚗', { duration: 5000 });
      navigate('/user-home');
    } else {
      toast.error((result.payload as string) ?? 'Registration failed. Please try again.', { duration: 5000 });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Field id="u-name" label="Full Name" error={errors.name?.message}>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input id="u-name" type="text" placeholder="Rahul Sharma" {...register('name')} className={inputClass(!!errors.name)} />
        </div>
      </Field>

      <Field id="u-vehicle" label="Vehicle Number" error={errors.vehicleNumber?.message}>
        <div className="relative">
          <Car size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input id="u-vehicle" type="text" placeholder="MH12AB1234" {...register('vehicleNumber')} className={`${inputClass(!!errors.vehicleNumber)} uppercase`} />
        </div>
      </Field>

      <Field id="u-email" label="Email Address" error={errors.email?.message}>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input id="u-email" type="email" placeholder="rahul@example.com" {...register('email')} className={inputClass(!!errors.email)} />
        </div>
      </Field>

      <Field id="u-phone" label="Mobile Number" error={errors.phone?.message}>
        <div className="relative">
          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">+91</div>
          <input id="u-phone" type="tel" placeholder="9876543210" maxLength={10} {...register('phone')} className={`${inputClass(!!errors.phone)} pl-16`} />
        </div>
      </Field>

      <Controller control={control} name="password" render={({ field }) => (
        <PasswordField id="u-password" label="Password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.password?.message} placeholder="Min 8 chars, upper, digit, symbol" showStrength />
      )} />

      <Controller control={control} name="confirmPassword" render={({ field }) => (
        <PasswordField id="u-confirm" label="Confirm Password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.confirmPassword?.message} placeholder="Re-enter your password" />
      )} />

      <button type="submit" disabled={isLoading}
        className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating Account…</> : <>Create User Account <ChevronRight size={16} /></>}
      </button>
    </form>
  );
};

// ── Admin Form ────────────────────────────────────────────────────────────────

const AdminForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminRegistrationFormValues>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      name: '', email: '', phone: '',
      organizationName: '', facilityType: undefined,
      totalSlots: undefined as unknown as number,
      address: '', password: '', confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: AdminRegistrationFormValues) => {
    const result = await dispatch(
      registerByRole({
        role: 'ADMIN',
        name: data.name,
        email: data.email,
        phone: data.phone,
        organizationName: data.organizationName,
        facilityType: data.facilityType,
        totalSlots: data.totalSlots,
        address: data.address,
        password: data.password,
      }),
    );
    if (registerByRole.fulfilled.match(result)) {
      toast.success('Admin account created! Manage your facility now 🏢', { duration: 5000 });
      navigate('/admin');
    } else {
      toast.error((result.payload as string) ?? 'Registration failed. Please try again.', { duration: 5000 });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Personal Details</p>

      <Field id="a-name" label="Full Name" error={errors.name?.message}>
        <div className="relative">
          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input id="a-name" type="text" placeholder="Priya Patel" {...register('name')} className={inputClass(!!errors.name)} />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="a-email" label="Work Email" error={errors.email?.message}>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input id="a-email" type="email" placeholder="admin@facility.com" {...register('email')} className={inputClass(!!errors.email)} />
          </div>
        </Field>

        <Field id="a-phone" label="Mobile Number" error={errors.phone?.message}>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">+91</div>
            <input id="a-phone" type="tel" placeholder="9876543210" maxLength={10} {...register('phone')} className={`${inputClass(!!errors.phone)} pl-16`} />
          </div>
        </Field>
      </div>

      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase pt-1">Facility Details</p>

      <Field id="a-org" label="Organization / Facility Name" error={errors.organizationName?.message}>
        <div className="relative">
          <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input id="a-org" type="text" placeholder="Phoenix Marketcity Pvt. Ltd." {...register('organizationName')} className={inputClass(!!errors.organizationName)} />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="a-type" label="Facility Type" error={errors.facilityType?.message}>
          <div className="relative">
            <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select id="a-type" {...register('facilityType')} className={`${inputClass(!!errors.facilityType)} appearance-none cursor-pointer`}>
              <option value="">Select type…</option>
              {FACILITY_TYPES.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
            </select>
          </div>
        </Field>

        <Field id="a-slots" label="Total Parking Slots" error={errors.totalSlots?.message}>
          <div className="relative">
            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input id="a-slots" type="number" min={1} placeholder="e.g. 250" {...register('totalSlots', { valueAsNumber: true })} className={inputClass(!!errors.totalSlots)} />
          </div>
        </Field>
      </div>

      <Field id="a-address" label="Business Address" error={errors.address?.message}>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
          <textarea id="a-address" rows={2} placeholder="Viman Nagar, Pune, Maharashtra 411014" {...register('address')} className={`${inputClass(!!errors.address)} pt-3 pl-10 resize-none`} />
        </div>
      </Field>

      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase pt-1">Security</p>

      <Controller control={control} name="password" render={({ field }) => (
        <PasswordField id="a-password" label="Password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.password?.message} placeholder="Min 8 chars, upper, digit, symbol" showStrength />
      )} />

      <Controller control={control} name="confirmPassword" render={({ field }) => (
        <PasswordField id="a-confirm" label="Confirm Password" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={errors.confirmPassword?.message} placeholder="Re-enter your password" />
      )} />

      <button type="submit" disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-3.5 rounded-xl hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-purple-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating Admin Account…</> : <>Create Admin Account <ChevronRight size={16} /></>}
      </button>
    </form>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<RegistrationRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) setStep('form');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex flex-col justify-center py-10 px-4">
      <div className="w-full max-w-lg mx-auto">

        <div className="text-center mb-8">
          <img src="/images/image.png" alt="Park-Prabandh" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">

            {step === 'role' && (
              <motion.div key="step-role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} className="p-8">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Step 1 of 2</p>
                <h2 className="text-lg font-black text-gray-900 mb-1">Who are you registering as?</h2>
                <p className="text-sm text-gray-400 mb-6">Choose your role to see the right sign-up form.</p>

                <div className="space-y-3 mb-6">
                  <RoleCard
                    selected={selectedRole === 'USER'}
                    onClick={() => setSelectedRole('USER')}
                    icon={<Car size={20} />}
                    title="Regular User"
                    description="Book parking slots at venues across the city. Requires your vehicle details."
                    badge="Free"
                    badgeColor="bg-green-100 text-green-700"
                  />
                  <RoleCard
                    selected={selectedRole === 'ADMIN'}
                    onClick={() => setSelectedRole('ADMIN')}
                    icon={<Building2 size={20} />}
                    title="Facility Admin"
                    description="Manage your parking facility, monitor slots, and view analytics."
                    badge="Business"
                    badgeColor="bg-purple-100 text-purple-700"
                  />
                </div>

                <button type="button" disabled={!selectedRole} onClick={handleContinue}
                  className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>

                <p className="text-center text-xs text-gray-400 mt-5">
                  By creating an account you agree to our{' '}
                  <Link to="/terms" className="text-blue-500 hover:underline">Terms</Link>
                  {' & '}
                  <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                </p>
              </motion.div>
            )}

            {step === 'form' && selectedRole && (
              <motion.div key="step-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22 }} className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <button type="button" onClick={handleBack}
                    className="p-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                      Step 2 of 2 · {selectedRole === 'USER' ? 'User Details' : 'Business Details'}
                    </p>
                    <h2 className="text-base font-black text-gray-900 leading-tight">
                      {selectedRole === 'USER' ? 'Your parking profile' : 'Facility information'}
                    </h2>
                  </div>
                </div>

                {selectedRole === 'USER' ? <UserForm /> : <AdminForm />}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
