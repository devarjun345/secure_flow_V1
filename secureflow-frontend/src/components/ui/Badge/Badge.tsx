'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'critical' | 'warning' | 'success' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  icon,
  dot = false,
  pulse = false,
}: BadgeProps) {
  const variantStyles = {
    critical: 'badge-critical',
    warning: 'badge-warning',
    success: 'badge-success',
    info: 'badge-info',
    default: 'bg-surface-3 text-text-muted border-border',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 gap-1 text-label-xs',
    md: 'px-2 py-0.5 gap-1.5 text-label-xs',
    lg: 'px-3 py-1 gap-2 text-label-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold uppercase rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'relative w-1.5 h-1.5 rounded-full flex-shrink-0',
            variant === 'critical' && 'bg-critical',
            variant === 'warning' && 'bg-warning',
            variant === 'success' && 'bg-success',
            variant === 'info' && 'bg-info',
            variant === 'default' && 'bg-text-muted',
            pulse && 'animate-pulse-glow'
          )}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function SeverityBadge({
  severity,
  size = 'md',
  showIcon = false,
  showLabel = true,
  className,
}: SeverityBadgeProps) {
  const severityMap = {
    critical: { variant: 'critical' as const, icon: '⬤', label: 'CRITICAL' },
    high: { variant: 'warning' as const, icon: '⬤', label: 'HIGH' },
    medium: { variant: 'info' as const, icon: '⬤', label: 'MEDIUM' },
    low: { variant: 'default' as const, icon: '⬤', label: 'LOW' },
    unknown: { variant: 'default' as const, icon: '⬤', label: 'UNKNOWN' },
    info: { variant: 'success' as const, icon: '⬤', label: 'SECURE' },
  };

  const config = severityMap[severity];

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={true}
      pulse={severity === 'critical'}
      className={className}
    >
      {showIcon && <span className="text-[6px] leading-none" aria-hidden="true">{config.icon}</span>}
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}