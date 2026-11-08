'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

export function Breadcrumb({ items, className, separator, showHome = false, homeLabel = 'Dashboard', homeHref = '/dashboard' }: BreadcrumbProps) {
  return (
    <nav className={cn('breadcrumb flex items-center gap-1.5 text-body-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <a
              href={homeHref}
              className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors duration-fast"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{homeLabel}</span>
            </a>
            {items.length > 0 && (
              <span className="breadcrumb-separator text-text-muted" aria-hidden="true">
                {separator || <ChevronRightIcon className="w-3.5 h-3.5" />}
              </span>
            )}
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span className="breadcrumb-separator text-text-muted" aria-hidden="true">
                {separator || <ChevronRightIcon className="w-3.5 h-3.5" />}
              </span>
            )}
            {item.current || (!item.href && !item.onClick) ? (
              <span className="breadcrumb-current text-text-primary font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={item.onClick}
                className="breadcrumb-link flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors duration-fast"
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface BreadcrumbWithActionsProps extends BreadcrumbProps {
  actions?: ReactNode;
  className?: string;
}

export function BreadcrumbWithActions({ items, actions, className, ...props }: BreadcrumbWithActionsProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <Breadcrumb items={items} {...props} />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}