'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
  illustration?: ReactNode;
}

export function EmptyState({ icon, title, description, action, secondaryAction, className, illustration }: EmptyStateProps) {
  return (
    <div className={cn('empty-state flex flex-col items-center justify-center gap-4 py-12 text-center', className)}>
      {illustration ? (
        <div className="text-6xl text-text-muted/50" aria-hidden="true">
          {illustration}
        </div>
      ) : icon ? (
        <div className="text-6xl text-text-muted" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <div className="max-w-xs">
        <h3 className="empty-state-title text-headline-sm text-text-primary">{title}</h3>
        {description && (
          <p className="empty-state-description text-body-md text-text-muted mt-2">{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="empty-state-action flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
          {secondaryAction && (
            <span className="btn-secondary">{secondaryAction}</span>
          )}
          {action && <span className="btn-primary">{action}</span>}
        </div>
      )}
    </div>
  );
}

export interface EmptyStateCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyStateCard({ icon, title, description, action, className }: EmptyStateCardProps) {
  return (
    <div className={cn('card rounded-lg p-8 text-center', className)}>
      <EmptyState icon={icon} title={title} description={description} action={action} />
    </div>
  );
}

export interface SearchEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function SearchEmptyState({ searchTerm, onClearSearch, icon, title, description }: SearchEmptyStateProps) {
  return (
    <EmptyState
      icon={icon}
      title={title || 'No results found'}
      description={description || `No matches for "${searchTerm}". Try adjusting your search or filters.`}
      action={<button onClick={onClearSearch} className="btn-secondary">Clear search</button>}
    />
  );
}

export interface ErrorEmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
}

export function ErrorEmptyState({ title = 'Something went wrong', description, onRetry, retryLabel = 'Try again', icon }: ErrorEmptyStateProps) {
  return (
    <EmptyState
      icon={icon || (
        <svg className="w-16 h-16 text-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      title={title}
      description={description || 'An unexpected error occurred. Please try again or contact support.'}
      action={onRetry ? <button onClick={onRetry} className="btn-primary">{retryLabel}</button> : undefined}
    />
  );
}