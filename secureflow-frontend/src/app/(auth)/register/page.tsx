'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import { ShieldIcon, GithubIcon, MailIcon, LockIcon, UserIcon, BuildingIcon, EyeIcon, EyeOffIcon, AlertCircleIcon, CheckIcon } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { useToastHelpers } from '@/components/ui/Toast';

const passwordRequirements = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter', regex: /[A-Z]/ },
  { label: 'One lowercase letter', regex: /[a-z]/ },
  { label: 'One number', regex: /[0-9]/ },
  { label: 'One special character', regex: /[^A-Za-z0-9]/ },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      organizationName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');

  const checkRequirement = (regex: RegExp) => regex.test(watchedPassword);

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      login({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      });

      toastSuccess('Account created!', 'Welcome to SecureFlow');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6" aria-label="SecureFlow Home">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ShieldIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-headline-lg text-text-primary">SecureFlow</span>
        </Link>
        <h1 className="text-headline-lg font-display font-bold text-text-primary">Create Account</h1>
        <p className="text-body-md text-text-muted mt-2">Start securing your codebase in minutes</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-critical/10 border border-critical/30 flex items-start gap-3" role="alert">
          <AlertCircleIcon className="w-5 h-5 text-critical flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-critical">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<UserIcon className="w-5 h-5" />}
          error={errors.name?.message}
          {...register('name')}
          disabled={isLoading}
          autoComplete="name"
        />

        <Input
          label="Organization Name"
          type="text"
          placeholder="Acme Inc."
          leftIcon={<BuildingIcon className="w-5 h-5" />}
          error={errors.organizationName?.message}
          {...register('organizationName')}
          disabled={isLoading}
          autoComplete="organization"
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          leftIcon={<MailIcon className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
          disabled={isLoading}
          autoComplete="email"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<LockIcon className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        {watchedPassword && (
          <div className="p-3 rounded-lg bg-surface-1 border border-border space-y-1">
            <p className="text-label-xs text-text-muted">Password strength:</p>
            {passwordRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-body-sm">
                <CheckIcon
                  className={checkRequirement(req.regex) ? 'w-4 h-4 text-success' : 'w-4 h-4 text-text-muted/30'}
                  aria-hidden="true"
                />
                <span className={checkRequirement(req.regex) ? 'text-text-muted' : 'text-text-muted/50'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<LockIcon className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-body-sm">
          <span className="px-4 bg-canvas text-text-muted">Or continue with</span>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full gap-2"
        size="lg"
        onClick={() => (window.location.href = '/api/v1/auth/github')}
        disabled={isLoading}
      >
        <GithubIcon className="w-5 h-5" />
        <span>Continue with GitHub</span>
      </Button>

      <p className="mt-6 text-center text-body-sm text-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </p>

      <div className="mt-6 p-4 rounded-lg bg-surface-1 border border-border text-body-sm text-text-muted">
        <p className="font-medium text-text-primary mb-1">By creating an account, you agree to our</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
          <span className="text-text-muted">and</span>
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}