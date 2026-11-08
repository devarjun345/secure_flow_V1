'use client';

import { forwardRef, type ReactNode } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

export interface RadioGroupProps extends RadioGroup.RadioGroupProps {
  label?: ReactNode;
  description?: ReactNode;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export const RadioGroupComponent = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, label, description, options, orientation = 'vertical', ...props }, ref) => {
    const groupId = `radiogroup-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={cn('w-full', className)} ref={ref}>
        {(label || description) && (
          <div className="mb-3">
            {label && (
              <label className="text-label-md text-text-muted mb-1.5 block">{label}</label>
            )}
            {description && <p className="text-body-sm text-text-muted">{description}</p>}
          </div>
        )}
        <RadioGroup.Root
          id={groupId}
          orientation={orientation}
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-3' : 'flex-wrap gap-4'
          )}
          {...props}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-start gap-3">
              <RadioGroup.Item
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'radio-input peer w-4 h-4 flex items-center justify-center text-white transition-all duration-fast',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1',
                  'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_0_4px_rgba(59,130,246,0.4)]',
                  'data-[state=unchecked]:bg-surface-1 data-[state=unchecked]:border-border-strong',
                  'disabled:opacity-50 disabled:pointer-events-none'
                )}
              >
                <RadioGroup.Indicator className="flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </RadioGroup.Indicator>
              </RadioGroup.Item>
              <div className="pt-0.5 min-w-0">
                <label
                  htmlFor={`${groupId}-${option.value}`}
                  className={cn(
                    'text-body-md text-text-primary cursor-pointer select-none',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-body-sm text-text-muted mt-0.5">{option.description}</p>
                )}
              </div>
            </div>
          ))}
        </RadioGroup.Root>
      </div>
    );
  }
);

RadioGroupComponent.displayName = 'RadioGroup';