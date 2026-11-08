'use client';

import React, { forwardRef, type ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export const TabsComponent = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, orientation = 'horizontal', children, variant = 'default', ...props }, ref) => {
    return (
      <Tabs.Root
        ref={ref}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        className={cn('w-full', className)}
        {...props}
      >
        {variant === 'pills' && (
          <Tabs.List
            className={cn(
              'tab-list inline-flex',
              orientation === 'vertical' && 'flex-col'
            )}
          >
            {children}
          </Tabs.List>
        )}
        {variant === 'underline' && (
          <Tabs.List
            className={cn(
              'flex border-b border-border',
              orientation === 'vertical' && 'border-b-0 border-r flex-col'
            )}
          >
            {children}
          </Tabs.List>
        )}
        {variant === 'default' && <Tabs.List className="flex">{children}</Tabs.List>}
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && child.type === TabsContent ? (
            <Tabs.Content value={child.props.value} className="mt-4 focus:outline-none" />
          ) : null
        )}
      </Tabs.Root>
    );
  }
);

TabsComponent.displayName = 'Tabs';

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Tabs.List
        ref={ref}
        className={cn(
          'tab-list inline-flex',
          className
        )}
        {...props}
      >
        {children}
      </Tabs.List>
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, disabled, icon, ...props }, ref) => {
    return (
      <Tabs.Trigger
        ref={ref}
        className={cn(
          'tab-trigger flex items-center gap-1.5 whitespace-nowrap',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </Tabs.Trigger>
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Tabs.Content
        ref={ref}
        className={cn(
          'focus:outline-none animate-slide-up-fade',
          className
        )}
        {...props}
      >
        {children}
      </Tabs.Content>
    );
  }
);

TabsContent.displayName = 'TabsContent';