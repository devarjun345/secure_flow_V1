'use client';

import { forwardRef, type ReactNode } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  delayDuration?: number;
  className?: string;
}

export const TooltipComponent = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, content, side = 'top', align = 'center', sideOffset = 4, delayDuration = 200, ...props }, ref) => {
    return (
      <Tooltip.Provider delayDuration={delayDuration}>
        <Tooltip.Root {...props}>
          <Tooltip.Trigger asChild>
            <span ref={ref} className={cn('inline-block', className)}>
              {children}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side={side}
              align={align}
              sideOffset={sideOffset}
              className={cn(
                'tooltip-content z-50 px-3 py-1.5 text-body-sm text-white whitespace-nowrap',
                'animate-slide-up-fade'
              )}
            >
              {content}
              <Tooltip.Arrow className="fill-surface-3" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }
);

TooltipComponent.displayName = 'Tooltip';