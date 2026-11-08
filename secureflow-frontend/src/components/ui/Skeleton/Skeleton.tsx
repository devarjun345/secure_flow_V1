'use client';

import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ className, variant = 'text', width, height, lines = 1 }: SkeletonProps) {
  if (variant === 'circular') {
    return (
      <div
        className={cn('skeleton rounded-full', className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn('skeleton rounded-lg', className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn('skeleton rounded h-4', i === lines - 1 && 'w-3/4')}
            style={{ width: i === lines - 1 ? width : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('skeleton rounded h-4', className)}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

export interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
  showAction?: boolean;
}

export function CardSkeleton({ className, showImage = true, lines = 3, showAction = false }: CardSkeletonProps) {
  return (
    <div className={cn('card rounded-lg p-4 space-y-4', className)}>
      {showImage && <Skeleton variant="rectangular" height="120" width="100%" />}
      <div className="space-y-2">
        <Skeleton width="60%" />
        <Skeleton lines={lines} />
      </div>
      {showAction && (
        <div className="flex justify-end pt-2 border-t border-border">
          <Skeleton variant="rectangular" width="80" height="36" />
        </div>
      )}
    </div>
  );
}

export interface TableSkeletonProps {
  columns: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({ columns, rows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="80%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}

export interface ListSkeletonProps {
  items?: number;
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function ListSkeleton({ items = 5, className, showAvatar = true, lines = 2 }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" />
            <Skeleton lines={lines} />
          </div>
        </div>
      ))}
    </div>
  );
}