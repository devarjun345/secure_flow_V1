'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast focus-ring disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
      primary: 'bg-primary text-white rounded-lg px-4 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_16px_rgba(59,130,246,0.5),_inset_0_1px_0_0_rgba(255,255,255,0.25)] active:brightness-95',
      secondary: 'bg-transparent text-text-primary border border-border-strong rounded px-4 py-2.5 hover:bg-white/5 hover:border-white/20',
      ghost: 'bg-transparent text-text-primary rounded px-4 py-2.5 hover:bg-white/5',
      destructive: 'bg-red-500/10 text-critical border border-red-500/40 rounded px-4 py-2.5 hover:bg-red-500/20',
      success: 'bg-tertiary text-white rounded-lg px-4 py-2.5 hover:bg-tertiary/90',
    };

    const sizeStyles = {
      sm: 'text-body-sm px-3 py-1.5 gap-1.5',
      md: 'text-body-md px-4 py-2.5 gap-2',
      lg: 'text-body-lg px-6 py-3 gap-2',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], widthStyles, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            <svg className="spinner h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';