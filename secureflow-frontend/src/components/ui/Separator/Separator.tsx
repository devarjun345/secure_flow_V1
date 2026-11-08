'use client';

import { forwardRef, type ReactNode } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends Separator.SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  label?: ReactNode;
}

export const SeparatorComponent = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, label, ...props }, ref) => {
    return (
      <Separator.Root
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={cn(
          'separator bg-transparent',
          orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
          'bg-gradient-to-r from-transparent via-border to-transparent',
          className
        )}
        {...props}
      >
        {label && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-body-sm text-text-muted bg-surface-1 whitespace-nowrap">
            {label}
          </span>
        )}
      </Separator.Root>
    );
  }
);

SeparatorComponent.displayName = 'Separator';