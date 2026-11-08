'use client';

import { forwardRef } from 'react';
import * as Progress from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export interface ProgressProps extends Progress.ProgressProps {
  className?: string;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  variant?: 'default' | 'success' | 'warning' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantColors = {
  default: 'bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:200%_100%]',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
};

export const ProgressComponent = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, showLabel = false, labelPosition = 'inside', variant = 'default', size = 'md', indeterminate = false, value = 0, max = 100, ...props }, ref) => {
    const numericValue = value ?? 0;
    const percentage = max > 0 ? Math.min(100, Math.max(0, (numericValue / max) * 100)) : 0;

    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-between mb-1.5">
          {showLabel && labelPosition === 'outside' && (
            <span className="text-label-xs text-text-muted">{Math.round(percentage)}%</span>
          )}
        </div>
        <Progress.Root
          ref={ref}
          value={numericValue}
          max={max}
          className={cn(
            'progress-bar relative overflow-hidden rounded-full bg-surface-1',
            sizeClasses[size]
          )}
          {...props}
        >
          <Progress.Indicator
            className={cn(
              'progress-bar-fill h-full rounded-full transition-all duration-normal ease-standard',
              indeterminate ? 'indeterminate' : '',
              variantColors[variant]
            )}
            style={{ width: indeterminate ? '100%' : `${percentage}%` }}
          />
          {showLabel && labelPosition === 'inside' && (
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center text-label-xs font-mono font-medium',
                variant === 'default' ? 'text-white' : 'text-white'
              )}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </Progress.Root>
        {showLabel && labelPosition === 'outside' && (
          <span className="text-label-xs text-text-muted">{Math.round(percentage)}%</span>
        )}
      </div>
    );
  }
);

ProgressComponent.displayName = 'Progress';

export interface RadialProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'critical';
  showValue?: boolean;
  valueLabel?: string;
  className?: string;
  trackColor?: string;
}

const radialSizeClasses = {
  sm: 64,
  md: 96,
  lg: 128,
  xl: 160,
};

const radialVariantColors = {
  default: 'url(#radial-gradient-default)',
  success: 'url(#radial-gradient-success)',
  warning: 'url(#radial-gradient-warning)',
  critical: 'url(#radial-gradient-critical)',
};

export function RadialProgress({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 8,
  variant = 'default',
  showValue = true,
  valueLabel,
  className,
}: RadialProgressProps) {
  const diameter = radialSizeClasses[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const strokeDashoffset = circumference * (1 - percentage);

  const gradientId = `radial-gradient-${variant}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={cn('radial-gauge relative inline-flex items-center justify-center', className)}>
      <svg className="radial-gauge-svg" width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} role="img" aria-label={`Progress: ${Math.round(percentage * 100)}%`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {variant === 'default' && (
              <>
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </>
            )}
            {variant === 'success' && (
              <>
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </>
            )}
            {variant === 'warning' && (
              <>
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </>
            )}
            {variant === 'critical' && (
              <>
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#F87171" />
              </>
            )}
          </linearGradient>
        </defs>
        <circle
          className="radial-gauge-track"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="radial-gauge-progress"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={radialVariantColors[variant]}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1000ms ease-out' }}
        />
      </svg>
      {showValue && (
        <div className="radial-gauge-value absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-display-xl font-display font-bold text-text-primary">
            {valueLabel ?? Math.round(percentage * 100)}
          </span>
          {valueLabel && <span className="text-body-sm text-text-muted">/100</span>}
        </div>
      )}
    </div>
  );
}

export interface RadialGaugeProps extends RadialProgressProps {
  subMetrics?: Array<{
    label: string;
    value: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'critical';
  }>;
  subMetricSize?: 'sm' | 'md';
}

export function RadialGauge({
  subMetrics,
  subMetricSize = 'md',
  ...props
}: RadialGaugeProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <RadialProgress {...props} />
      {subMetrics && subMetrics.length > 0 && (
        <div className="w-full space-y-3">
          {subMetrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-label-md text-text-muted">{metric.label}</span>
                <span className="text-body-sm font-mono text-text-primary">
                  {Math.round((metric.value / (metric.max || 100)) * 100)}%
                </span>
              </div>
              <ProgressComponent
                value={metric.value}
                max={metric.max || 100}
                size={subMetricSize}
                variant={metric.variant || 'default'}
                showLabel={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}