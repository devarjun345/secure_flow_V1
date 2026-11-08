'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  monospace?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      monospace = false,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="text-label-md text-text-muted mb-1.5 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-lg px-3 py-2.5 text-body-md transition-all duration-fast bg-surface-1 border border-border-strong text-text-primary placeholder-text-muted resize-y min-h-[100px]',
            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-1 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)]',
            'disabled:opacity-50 disabled:pointer-events-none',
            monospace && 'font-mono text-code-md',
            error && 'border-critical focus:border-critical focus:ring-critical',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, hintId)}
          {...props}
        />
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

Textarea.displayName = 'Textarea';