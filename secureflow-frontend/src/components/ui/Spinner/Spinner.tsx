'use client';

import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
  color?: 'primary' | 'white' | 'critical' | 'success' | 'warning';
}

const sizeClasses = {
  sm: 'w-4 h-4 border-[2px]',
  md: 'w-6 h-6 border-[2px]',
  lg: 'w-8 h-8 border-[3px]',
  xl: 'w-12 h-12 border-[4px]',
};

const colorClasses = {
  primary: 'border-primary border-r-transparent',
  white: 'border-white border-r-transparent',
  critical: 'border-critical border-r-transparent',
  success: 'border-success border-r-transparent',
  warning: 'border-warning border-r-transparent',
};

export function Spinner({ size = 'md', className, label, color = 'primary' }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)} role="status" aria-live="polite" aria-label={label || 'Loading'}>
      <svg
        className={cn('spinner', sizeClasses[size], colorClasses[color])}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {label && <span className="text-body-sm text-text-muted">{label}</span>}
    </div>
  );
}

export interface SpinnerOverlayProps {
  isVisible: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'critical' | 'success' | 'warning';
  className?: string;
}

export function SpinnerOverlay({ isVisible, label, size = 'lg', color = 'primary', className }: SpinnerOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-surface-1/80 backdrop-blur-sm',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      <Spinner size={size} color={color} label={label} />
    </div>
  );
}

export interface InlineSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
  color?: 'primary' | 'white' | 'critical' | 'success' | 'warning';
}

export function InlineSpinner({ size = 'sm', className, color = 'primary' }: InlineSpinnerProps) {
  return (
    <svg
      className={cn('spinner inline-block', sizeClasses[size], colorClasses[color], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}