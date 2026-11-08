'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

export function PageHeader({
  title,
  description,
  icon,
  badge,
  actions,
  breadcrumbs,
  className,
  variant = 'default',
}: PageHeaderProps) {
  const variantStyles = {
    default: 'py-6 lg:py-8',
    compact: 'py-4',
    hero: 'py-10 lg:py-12',
  };

  return (
    <header className={cn('page-header w-full', variantStyles[variant], className)}>
      {breadcrumbs && (
        <div className="mb-4">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-headline-lg font-display font-bold text-text-primary truncate">
                {title}
              </h1>
              {badge && (
                <div className="flex-shrink-0">{badge}</div>
              )}
            </div>
            {description && (
              <p className="text-body-md text-text-muted mt-1.5 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

export interface SectionHeaderProps {
  title: string;
  description?: string;
  count?: number;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, count, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4', className)}>
      <div>
        <h2 className="text-headline-sm font-display font-semibold text-text-primary flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="badge-info text-label-xs">{count}</span>
          )}
        </h2>
        {description && (
          <p className="text-body-sm text-text-muted mt-0.5">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export interface KPIStripProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function KPIStrip({ label, value, change, icon, trend = 'neutral', className }: KPIStripProps) {
  return (
    <div className={cn('card rounded-lg p-4 sm:p-6 flex flex-col gap-2', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-label-md text-text-muted">{label}</p>
          <p className="text-headline-md font-display font-bold text-text-primary mt-1 font-mono tabular-nums">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'text-label-xs font-mono font-medium',
            change.positive ? 'text-success' : 'text-critical'
          )}>
            {change.positive ? '+' : ''}{change.value}%
          </span>
          <span className="text-body-sm text-text-muted">{change.label}</span>
          {trend !== 'neutral' && (
            <span className={cn('text-label-xs font-mono', trend === 'up' ? 'text-success' : 'text-critical')}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}