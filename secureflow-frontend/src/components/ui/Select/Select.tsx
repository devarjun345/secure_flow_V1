'use client';

import { forwardRef, type ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SelectProps extends Select.SelectProps {
  label?: ReactNode;
  placeholder?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  clearable?: boolean;
  className?: string;
  multiple?: false;
}

export const SelectComponent = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      label,
      placeholder = 'Select...',
      error,
      hint,
      options,
      clearable = false,
      disabled,
      required,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const selectId = `select-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div className={cn('w-full', className)} ref={ref}>
        {label && (
          <label htmlFor={selectId} className="text-label-md text-text-muted mb-1.5 block">
            {label}
          </label>
        )}
        <Select.Root
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          required={required}
          {...props}
        >
          <Select.Trigger
            id={selectId}
            className={cn(
              'input-field w-full flex items-center justify-between gap-2',
              'data-[placeholder]:text-text-muted',
              'data-[state=open]:border-primary data-[state=open]:ring-1 data-[state=open]:ring-primary',
              error && 'border-critical focus:border-critical focus:ring-critical',
              disabled && 'opacity-50 pointer-events-none'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(errorId, hintId)}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon>
              <ChevronDownIcon className="w-4 h-4 text-text-muted transition-transform duration-fast data-[state=open]:rotate-180" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className={cn(
                'dropdown-content z-50 max-h-[300px]',
                'data-[side=bottom]:animate-slide-up-fade data-[side=top]:animate-slide-down-fade'
              )}
              position="popper"
            >
              <Select.Viewport className="p-1">
                {clearable && value && (
                  <Select.Item
                    value=""
                    className={cn(
                      'dropdown-item flex items-center gap-2',
                      'hover:bg-surface-2'
                    )}
                    onSelect={() => onValueChange?.('')}
                  >
                    <XIcon className="w-4 h-4" />
                    <span>Clear selection</span>
                  </Select.Item>
                )}
                {clearable && value && <Select.Separator className="separator my-1" />}
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      'dropdown-item flex items-center gap-2 relative',
                      'focus:bg-surface-2',
                      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none'
                    )}
                    textValue={option.value}
                  >
                    {option.icon && <span className="flex-shrink-0 w-4 h-4">{option.icon}</span>}
                    <Select.ItemText className="flex-1 truncate">{option.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <CheckIcon className="w-3 h-3" strokeWidth={3} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              {options.length > 10 && (
                <Select.ScrollUpButton className="flex items-center justify-center h-8 text-text-muted hover:text-text-primary">
                  <ChevronDownIcon className="w-4 h-4 rotate-180" />
                </Select.ScrollUpButton>
              )}
              {options.length > 10 && (
                <Select.ScrollDownButton className="flex items-center justify-center h-8 text-text-muted hover:text-text-primary">
                  <ChevronDownIcon className="w-4 h-4" />
                </Select.ScrollDownButton>
              )}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {error && (
          <p id={errorId} className="mt-1.5 text-body-sm text-critical" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-body-sm text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

SelectComponent.displayName = 'Select';

export interface MultiSelectProps extends Select.SelectProps {
  label?: ReactNode;
  placeholder?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  className?: string;
  multiple: true;
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      label,
      placeholder = 'Select...',
      error,
      hint,
      options,
      disabled,
      required,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const selectId = `multiselect-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    return (
      <div className={cn('w-full', className)} ref={ref}>
        {label && (
          <label htmlFor={selectId} className="text-label-md text-text-muted mb-1.5 block">
            {label}
          </label>
        )}
        <Select.Root
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          required={required}
          {...props}
        >
          <Select.Trigger
            id={selectId}
            className={cn(
              'input-field w-full flex items-center justify-between gap-2 min-h-[44px]',
              'data-[placeholder]:text-text-muted',
              'data-[state=open]:border-primary data-[state=open]:ring-1 data-[state=open]:ring-primary',
              error && 'border-critical focus:border-critical focus:ring-critical',
              disabled && 'opacity-50 pointer-events-none'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(errorId, hintId)}
          >
<Select.Value placeholder={placeholder}>
              {((values: string[]) => {
                return (
                  <div className="flex flex-wrap gap-1.5">
                    {values.map((val) => (
                      <span
                        key={val}
                        className={cn(
                          'badge-info px-2 py-0.5 gap-1',
                          'flex items-center'
                        )}
                      >
                        {options.find((o) => o.value === val)?.label}
                        <Select.Item
                          value={val}
                          className="p-0 ml-1 -mr-1"
                        >
                          <Select.ItemIndicator>
                            <XIcon className="w-3 h-3" strokeWidth={3} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      </span>
                    ))}
                  </div>
                );
              }) as unknown as ReactNode}
            </Select.Value>
            <Select.Icon>
              <ChevronDownIcon className="w-4 h-4 text-text-muted transition-transform duration-fast data-[state=open]:rotate-180" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className={cn(
                'dropdown-content z-50 max-h-[300px]',
                'data-[side=bottom]:animate-slide-up-fade data-[side=top]:animate-slide-down-fade'
              )}
              position="popper"
            >
              <Select.Viewport className="p-1">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn(
                      'dropdown-item flex items-center gap-2 relative',
                      'focus:bg-surface-2',
                      'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none'
                    )}
                    textValue={option.value}
                  >
                    <Select.ItemIndicator>
                      <CheckIcon className="w-3 h-3" strokeWidth={3} />
                    </Select.ItemIndicator>
                    {option.icon && <span className="flex-shrink-0 w-4 h-4">{option.icon}</span>}
                    <Select.ItemText className="flex-1 truncate">{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              {options.length > 10 && (
                <Select.ScrollUpButton className="flex items-center justify-center h-8 text-text-muted hover:text-text-primary">
                  <ChevronDownIcon className="w-4 h-4 rotate-180" />
                </Select.ScrollUpButton>
              )}
              {options.length > 10 && (
                <Select.ScrollDownButton className="flex items-center justify-center h-8 text-text-muted hover:text-text-primary">
                  <ChevronDownIcon className="w-4 h-4" />
                </Select.ScrollDownButton>
              )}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {error && (
          <p id={errorId} className="mt-1.5 text-body-sm text-critical" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-body-sm text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';