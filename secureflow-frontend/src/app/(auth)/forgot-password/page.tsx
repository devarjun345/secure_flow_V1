'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import { ShieldIcon, MailIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/utils/validation';
import { useToastHelpers } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const watchedEmail = watch('email');

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email');
      }

      toastSuccess('Email sent!', 'Check your inbox for password reset instructions');
      setStep('sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = watchedEmail;
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to resend email');

      toastSuccess('Email resent!', 'Check your inbox for password reset instructions');
    } catch {
      toastError('Failed to resend email');
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
        {step === 'email' ? (
          <>
            <h1 className="text-headline-lg font-display font-bold text-text-primary">Forgot Password?</h1>
            <p className="text-body-md text-text-muted mt-2">Enter your email and we'll send you reset instructions</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-headline-lg font-display font-bold text-text-primary">Check Your Email</h1>
            <p className="text-body-md text-text-muted mt-2">
              We've sent password reset instructions to <strong className="text-text-primary">{watchedEmail}</strong>
            </p>
          </>
        )}
      </div>

      {step === 'email' && (
        <>
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

            <Button type="submit" className="w-full" size="lg" loading={isLoading}>
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-body-sm text-text-muted">
            Remember your password?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </>
      )}

      {step === 'sent' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-1 border border-border text-body-sm text-text-muted">
            <p className="font-medium text-text-primary mb-2">Didn't receive the email?</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes for delivery</li>
            </ul>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleResend} loading={isLoading}>
            Resend Email
          </Button>

          <p className="text-center text-body-sm text-text-muted">
            <Link href="/login" className="text-primary hover:underline font-medium">
              Back to Sign In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}