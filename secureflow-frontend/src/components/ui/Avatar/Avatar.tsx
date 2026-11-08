'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: ReactNode;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({
  src,
  alt = '',
  fallback,
  name,
  size = 'md',
  className,
  shape = 'circle',
}: AvatarProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name: string) => {
    const colors = [
      'bg-primary/20 text-primary',
      'bg-secondary/20 text-secondary',
      'bg-tertiary/20 text-tertiary',
      'bg-warning/20 text-warning',
      'bg-critical/20 text-critical',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        'avatar inline-flex items-center justify-center overflow-hidden bg-surface-3',
        sizeClasses[size],
        shapeClass,
        className
      )}
      role="img"
      aria-label={alt || name || 'Avatar'}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="avatar-image w-full h-full object-cover"
        />
      ) : fallback ? (
        <div className="avatar-fallback w-full h-full">{fallback}</div>
      ) : name ? (
        <div
          className={cn(
            'avatar-fallback w-full h-full font-display font-semibold',
            getColorFromName(name)
          )}
        >
          {getInitials(name)}
        </div>
      ) : (
        <div className="avatar-fallback w-full h-full text-text-muted">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({ children, max = 5, size = 'md', className }: AvatarGroupProps) {
  const kids = Array.isArray(children) ? children : [children];
  const visible = kids.slice(0, max);
  const remaining = kids.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} role="group" aria-label={`${kids.length} members`}>
      {visible.map((child, index) => (
        <div key={index} className="relative z-[calc(100_-_index)]">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'avatar inline-flex items-center justify-center border-2 border-surface-1 font-mono font-medium',
            sizeClasses[size],
            'bg-surface-3 text-text-muted'
          )}
          aria-label={`${remaining} more members`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}