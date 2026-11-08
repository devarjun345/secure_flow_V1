'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Checkbox } from '@/components/ui';
import { ShieldIcon, GithubIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/utils/validation';
import { useAuthStore } from '@/store/authStore';
import { useToastHelpers } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { error: toastError } = useToastHelpers();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@secureflow.io',
      password: 'demo1234',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      login({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = '/api/v1/auth/github';
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
        <h1 className="text-headline-lg font-display font-bold text-text-primary">Sign In</h1>
        <p className="text-body-md text-text-muted mt-2">Enter your credentials to access your workspace</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-critical/10 border border-critical/30 flex items-start gap-3" role="alert">
          <AlertCircleIcon className="w-5 h-5 text-critical flex-shrink-0 mt-0.5" />
          <p className="text-body-sm text-critical">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox {...register('rememberMe')} />
            <span className="text-body-sm text-text-muted">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-body-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          Sign In
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
        onClick={handleGitHubLogin}
        disabled={isLoading}
      >
        <GithubIcon className="w-5 h-5" />
        <span>Continue with GitHub</span>
      </Button>

      <p className="mt-6 text-center text-body-sm text-text-muted">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Create one
        </Link>
      </p>

      <div className="mt-8 p-4 rounded-lg bg-surface-1 border border-border">
        <p className="text-label-md text-text-muted mb-2">Demo Credentials</p>
        <div className="space-y-1 text-body-sm font-mono text-text-primary">
          <div>Email: <span className="text-primary">demo@secureflow.io</span></div>
          <div>Password: <span className="text-primary">demo1234</span></div>
        </div>
      </div>
    </div>
  );
}