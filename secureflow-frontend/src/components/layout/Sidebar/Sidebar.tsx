'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboardIcon,
  GitBranchIcon,
  PlayCircleIcon,
  ListChecksIcon,
  AlertTriangleIcon,
  FileTextIcon,
  SettingsIcon,
  UsersIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboardIcon className="w-5 h-5" />,
  },
  {
    label: 'Repositories',
    href: '/repositories',
    icon: <GitBranchIcon className="w-5 h-5" />,
  },
  {
    label: 'Scan Center',
    href: '/scan-center',
    icon: <PlayCircleIcon className="w-5 h-5" />,
  },
  {
    label: 'Scan History',
    href: '/scans',
    icon: <ListChecksIcon className="w-5 h-5" />,
  },
  {
    label: 'Vulnerabilities',
    href: '/findings',
    icon: <AlertTriangleIcon className="w-5 h-5" />,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: <FileTextIcon className="w-5 h-5" />,
  },
  {
    label: 'Team',
    href: '/team',
    icon: <UsersIcon className="w-5 h-5" />,
    roles: ['owner', 'admin'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    roles: ['owner', 'admin'],
  },
];

export function Sidebar({ isOpen, onToggle, className, user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const isExpanded = (href: string) => expandedItems.has(href);

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  return (
    <>
      <button
        onClick={onToggle}
        className={cn(
          'fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-surface-1 border border-border-strong text-text-primary hover:bg-surface-2 transition-colors duration-fast',
          isOpen && 'left-64'
        )}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
      </button>

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full glass-panel flex flex-col transition-transform duration-normal lg:translate-x-0',
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:w-64',
          collapsed && 'w-16 lg:w-16',
          className
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="SecureFlow Home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-headline-sm text-text-primary">SecureFlow</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors duration-fast flex-shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1" role="navigation" aria-label="Main">
          <ul className="space-y-1" role="list">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <div className="group">
                    <button
                      onClick={() => toggleItem(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-colors duration-fast',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary border-l-2 border-l-primary'
                          : 'text-text-muted hover:text-text-primary hover:bg-surface-1',
                        collapsed && 'justify-center px-2'
                      )}
                      aria-expanded={isExpanded(item.href)}
                      aria-controls={`${item.href}-submenu`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="badge-info text-label-xs">{item.badge}</span>
                          )}
                          <ChevronRightIcon
                            className={cn(
                              'w-4 h-4 text-text-muted transition-transform duration-fast',
                              isExpanded(item.href) && 'rotate-90'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && (
                      <ul
                        id={`${item.href}-submenu`}
                        className={cn(
                          'mt-1 ml-10 space-y-1 overflow-hidden transition-all duration-fast',
                          isExpanded(item.href) ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                        )}
                        role="list"
                        aria-label={`${item.label} submenu`}
                      >
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm transition-colors duration-fast',
                                isActive(child.href)
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-text-muted hover:text-text-primary hover:bg-surface-1'
                              )}
                              aria-current={isActive(child.href) ? 'page' : undefined}
                            >
                              {child.icon && <span className="flex-shrink-0 w-4 h-4">{child.icon}</span>}
                              <span>{child.label}</span>
                              {child.badge && <span className="badge-info text-label-xs ml-auto">{child.badge}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-colors duration-fast',
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary border-l-2 border-l-primary'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface-1',
                      collapsed && 'justify-center px-2'
                    )}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && <span className="badge-info text-label-xs">{item.badge}</span>}
                      </>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {!collapsed && user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="font-display font-semibold text-body-md text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-body-sm text-text-muted truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 px-2">
              <Link
                href="/account"
                className="btn-ghost flex-1 justify-center py-2"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link
                href="/settings/account"
                className="btn-ghost flex-1 justify-center py-2"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {!collapsed && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}