'use client';

import { forwardRef, type ReactNode } from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Switch.SwitchProps {
  label?: ReactNode;
  description?: ReactNode;
}

export const SwitchComponent = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, label, description, disabled, required, ...props }, ref) => {
    const switchId = `switch-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <Switch.Root
          ref={ref}
          id={switchId}
          disabled={disabled}
          required={required}
          className={cn(
            'switch-input relative w-10 h-6 flex items-center transition-all duration-fast',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1',
            'data-[state=checked]:bg-primary',
            'data-[state=unchecked]:bg-border-strong',
            'disabled:opacity-50 disabled:pointer-events-none',
            className
          )}
          {...props}
        >
          <Switch.Thumb
            className={cn(
              'w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-fast',
              'data-[state=checked]:translate-x-5',
              'data-[state=unchecked]:translate-x-0.5'
            )}
          />
        </Switch.Root>
        {(label || description) && (
          <div className="pt-1 min-w-0">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'text-body-md text-text-primary cursor-pointer select-none',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-body-sm text-text-muted mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

SwitchComponent.displayName = 'Switch';