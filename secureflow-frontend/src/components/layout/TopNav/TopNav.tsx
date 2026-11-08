'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, Avatar, Dropdown, type DropdownItem } from '@/components/ui';
import { SearchIcon, BellIcon, MoonIcon, MenuIcon, LogOutIcon, UserIcon, SettingsIcon, ShieldIcon, GithubIcon } from 'lucide-react';

export interface TopNavProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout: () => void;
  className?: string;
  title?: string;
  breadcrumbs?: ReactNode;
}

export function TopNav({
  onMenuClick,
  user,
  onLogout,
  className,
  title,
  breadcrumbs,
}: TopNavProps) {

  const userMenuItems: DropdownItem[] = [
    { label: 'Profile', value: 'profile', icon: <UserIcon className="w-4 h-4" />, onSelect: () => {} },
    { label: 'Account Settings', value: 'account', icon: <SettingsIcon className="w-4 h-4" />, onSelect: () => {} },
    { label: 'Security', value: 'security', icon: <ShieldIcon className="w-4 h-4" />, onSelect: () => {} },
    { label: 'GitHub Integration', value: 'github', icon: <GithubIcon className="w-4 h-4" />, onSelect: () => {} },
    { label: '', value: 'divider', disabled: true },
    { label: 'Sign Out', value: 'logout', icon: <LogOutIcon className="w-4 h-4" />, destructive: true, onSelect: onLogout },
  ];

  return (
    <header
      className={cn(
        'top-nav fixed top-0 left-0 right-0 z-30 h-16 glass-panel border-b border-border flex items-center justify-between px-4 lg:px-6',
        'lg:ml-64',
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-4 w-full max-w-screen-2xl mx-auto">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors duration-fast"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center gap-4 min-w-0">
          {title && (
            <h1 className="text-headline-sm font-display font-semibold text-text-primary truncate">
              {title}
            </h1>
          )}
          {breadcrumbs && (
            <nav className="hidden md:flex items-center gap-2 ml-4" aria-label="Breadcrumb">
              {breadcrumbs}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search repositories, findings, scans..."
              className="input-field w-64 pl-10 pr-4 py-2 text-body-sm bg-surface-1/50 border-border/50 focus:w-80"
              aria-label="Global search"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <BellIcon className="w-4 h-4" />
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <MoonIcon className="w-4 h-4" />
            </Button>
          </div>

          {user && (
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                  />
                  <span className="hidden md:inline-block text-body-sm font-medium text-text-primary truncate max-w-[120px]">
                    {user.name}
                  </span>
                </Button>
              }
              items={userMenuItems}
              align="end"
            />
          )}
        </div>
      </div>
    </header>
  );
}