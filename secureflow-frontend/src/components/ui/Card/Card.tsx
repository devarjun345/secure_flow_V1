'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  bordered?: boolean;
}

export function Card({
  children,
  className,
  padding = 'md',
  hover = false,
  bordered = true,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'card rounded-lg',
        bordered && 'border-border',
        !bordered && 'border-transparent',
        paddingStyles[padding],
        hover && 'transition-all duration-fast hover:border-primary/50 hover:shadow-glow-primary',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>{children}</div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
  subtitle?: ReactNode;
}

export function CardTitle({ children, className, subtitle }: CardTitleProps) {
  return (
    <div>
      <h3 className={cn('text-headline-sm text-text-primary', className)}>{children}</h3>
      {subtitle && <p className="text-body-sm text-text-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('flex items-center gap-2 mt-4 pt-4 border-t border-border', className)}>
      {children}
    </div>
  );
}