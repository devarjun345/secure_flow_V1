'use client';

import { forwardRef, type ReactNode } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Checkbox.CheckboxProps {
  label?: ReactNode;
  description?: ReactNode;
}

export const CheckboxComponent = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, description, disabled, required, ...props }, ref) => {
    const checkboxId = `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex items-start gap-3">
        <Checkbox.Root
          ref={ref}
          id={checkboxId}
          disabled={disabled}
          required={required}
          className={cn(
            'checkbox-input peer w-4 h-4 flex items-center justify-center text-white transition-all duration-fast',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1',
            'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_0_4px_rgba(59,130,246,0.4)]',
            'data-[state=unchecked]:bg-surface-1 data-[state=unchecked]:border-border-strong',
            'disabled:opacity-50 disabled:pointer-events-none',
            className
          )}
          {...props}
        >
          <Checkbox.Indicator className="flex items-center justify-center">
            <CheckIcon className="w-3 h-3" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        {(label || description) && (
          <div className="pt-0.5 min-w-0">
            {label && (
              <label
                htmlFor={checkboxId}
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

CheckboxComponent.displayName = 'Checkbox';