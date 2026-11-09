'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import {
  GitBranchIcon,
  AlertTriangleIcon,
  ShieldIcon,
  KeyIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  Rss,
  Layers,
  PauseIcon,
  PlayIcon,
  PlayCircleIcon,
  DownloadIcon,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';

export interface AuditEvent {
  id: string;
  type: 'scan_completed' | 'vulnerability_found' | 'repository_connected' | 'member_invited' | 'secret_detected' | 'policy_violation' | 'scan_started' | 'scan_failed' | 'secret_redacted' | 'engine_sync';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  repository?: { id: string; name: string; fullName?: string };
  actor: { id: string; name: string; avatarUrl?: string };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LiveAuditStreamProps {
  events: AuditEvent[];
  maxEvents?: number;
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onEventClick?: (event: AuditEvent) => void;
  onExport?: () => void;
  onFilterChange?: (filter: string) => void;
}

const EVENT_CONFIG = {
  scan_completed: { label: 'SCAN COMPLETED', color: 'info', icon: <CheckCircleIcon className="w-3.5 h-3.5" />, borderColor: 'primary' },
  vulnerability_found: { label: 'VULNERABILITY FOUND', color: 'critical', icon: <AlertTriangleIcon className="w-3.5 h-3.5" />, borderColor: 'critical' },
  repository_connected: { label: 'REPOSITORY CONNECTED', color: 'success', icon: <GitBranchIcon className="w-3.5 h-3.5" />, borderColor: 'success' },
  member_invited: { label: 'MEMBER INVITED', color: 'info', icon: <UserIcon className="w-3.5 h-3.5" />, borderColor: 'primary' },
  secret_detected: { label: 'SECRET DETECTED', color: 'critical', icon: <KeyIcon className="w-3.5 h-3.5" />, borderColor: 'critical' },
  policy_violation: { label: 'POLICY VIOLATION', color: 'warning', icon: <AlertCircleIcon className="w-3.5 h-3.5" />, borderColor: 'warning' },
  scan_started: { label: 'SCAN STARTED', color: 'info', icon: <PlayCircleIcon className="w-3.5 h-3.5" />, borderColor: 'primary' },
  scan_failed: { label: 'SCAN FAILED', color: 'critical', icon: <XCircleIcon className="w-3.5 h-3.5" />, borderColor: 'critical' },
  secret_redacted: { label: 'SECRET REDACTED', color: 'warning', icon: <ShieldIcon className="w-3.5 h-3.5" />, borderColor: 'warning' },
  engine_sync: { label: 'ENGINE SYNC', color: 'info', icon: <ShieldIcon className="w-3.5 h-3.5" />, borderColor: 'primary' },
} as const;

const MOCK_EVENTS: Omit<AuditEvent, 'id' | 'timestamp'>[] = [
  {
    type: 'scan_completed',
    title: 'Scan completed for payment-gateway',
    description: 'Found 1 critical, 2 high, 5 medium, 3 low vulnerabilities',
    severity: 'critical',
    repository: { id: 'repo-1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'system', name: 'GitHub Webhook', avatarUrl: 'https://github.com/github.png' },
    metadata: { pr: '#412', engines: ['Trivy', 'Gitleaks'] },
  },
  {
    type: 'vulnerability_found',
    title: 'New critical vulnerability in liblzma5',
    description: 'CVE-2024-3094 candidate detected in data-pipeline-worker',
    severity: 'critical',
    repository: { id: 'repo-2', name: 'data-pipeline-worker', fullName: 'acme-corp/data-pipeline-worker' },
    actor: { id: 'system', name: 'Trivy Scanner', avatarUrl: 'https://github.com/trivy.png' },
    metadata: { cve: 'CVE-2024-3094', package: 'liblzma5' },
  },
  {
    type: 'repository_connected',
    title: 'Repository connected: auth-service',
    description: 'Monitoring enabled for auth-service',
    severity: 'info',
    repository: { id: 'repo-3', name: 'auth-service', fullName: 'acme-corp/auth-service' },
    actor: { id: 'user-1', name: 'Alex Mercer', avatarUrl: 'https://github.com/identicons/alex.png' },
    metadata: { branch: 'main' },
  },
  {
    type: 'policy_violation',
    title: 'Policy violation: STRICT_PRODUCTION_ZERO_HIGH',
    description: 'Blocked merge on branch main due to CVE-2024-21626',
    severity: 'high',
    repository: { id: 'repo-1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'system', name: 'Policy Engine', avatarUrl: 'https://github.com/policy.png' },
    metadata: { policy: 'STRICT_PRODUCTION_ZERO_HIGH', cve: 'CVE-2024-21626' },
  },
  {
    type: 'secret_detected',
    title: 'AWS Access Key detected in config',
    description: 'Slack Incoming Webhook URL caught by Gitleaks in commit 8d22f9',
    severity: 'critical',
    repository: { id: 'repo-1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'system', name: 'Gitleaks Scanner', avatarUrl: 'https://github.com/gitleaks.png' },
    metadata: { file: 'config/aws.json', secretType: 'AWS Access Key' },
  },
  {
    type: 'secret_redacted',
    title: 'Secret redacted and rotated',
    description: 'Slack Incoming Webhook URL caught by Gitleaks. Quarantine applied; token rotated via AWS Secrets Manager.',
    severity: 'high',
    repository: { id: 'repo-1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'system', name: 'Gitleaks Scanner', avatarUrl: 'https://github.com/gitleaks.png' },
    metadata: { rotated: true, zeroExposure: true },
  },
  {
    type: 'engine_sync',
    title: 'Engine sync completed',
    description: 'Trivy database daily mirror sync finished. Synced 412 CVE descriptors across Debian, Alpine, and Go ecosystems.',
    severity: 'info',
    repository: undefined,
    actor: { id: 'system', name: 'Trivy Engine', avatarUrl: 'https://github.com/trivy.png' },
    metadata: { synced: 412, ecosystems: ['Debian', 'Alpine', 'Go'] },
  },
  {
    type: 'scan_started',
    title: 'Scan initiated for auth-service',
    description: 'Pull request #234 triggered automated Trivy scan pipeline',
    severity: 'info',
    repository: { id: 'repo-3', name: 'auth-service', fullName: 'acme-corp/auth-service' },
    actor: { id: 'system', name: 'GitHub Webhook', avatarUrl: 'https://github.com/github.png' },
    metadata: { pr: '#234', branch: 'feature/oauth' },
  },
];

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function getRandomTimeOffset() {
  return Math.floor(Math.random() * 300000);
}

function getSeverityColor(severity: AuditEvent['severity']) {
  switch (severity) {
    case 'critical': return 'text-critical';
    case 'high': return 'text-warning';
    case 'medium': return 'text-info';
    case 'low': return 'text-info';
    case 'info': return 'text-primary';
    default: return 'text-text-muted';
  }
}

function EventItem({
  event,
  index,
  eventConfig,
  getSeverityColor,
  formatRelativeTime,
  onEventClick,
}: {
  event: AuditEvent;
  index: number;
  eventConfig: typeof EVENT_CONFIG;
  getSeverityColor: (severity: AuditEvent['severity']) => string;
  formatRelativeTime: (timestamp: string) => string;
  onEventClick?: (event: AuditEvent) => void;
}) {
  const config = eventConfig[event.type];
  const borderColor = config?.borderColor || 'primary';
  const eventColor = getSeverityColor(event.severity);

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={cn(
        'p-4 rounded-lg flex flex-col gap-3 transition-all duration-200',
        'bg-surface-1 hover:bg-surface-2',
        `border-l-2 border-${borderColor}`
      )}
      onClick={() => onEventClick?.(event)}
      style={{ cursor: onEventClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-center justify-between font-label-xs text-label-xs">
        <span className={cn('font-bold', eventColor)}>
          {config?.label || event.type.toUpperCase()}
        </span>
        <span className="font-mono text-text-muted">{formatRelativeTime(event.timestamp)}</span>
      </div>
      <p className="text-body-sm text-text-primary leading-relaxed">
        {event.description}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-outline font-code-sm text-code-sm">
        {event.repository && (
          <span className="flex items-center gap-1">
            <GitBranchIcon className="w-3.5 h-3.5" />
            <span className="font-semibold text-text-muted">{event.repository.fullName || event.repository.name}</span>
          </span>
        )}
        <span>•</span>
        {(() => {
          const cve = event.metadata?.cve;
          if (cve) {
            return (
              <span className="flex items-center gap-1 text-critical">
                <AlertTriangleIcon className="w-3.5 h-3.5" />
                <span className="font-mono">{String(cve)}</span>
              </span>
            );
          }
          return null;
        })()}
        {(() => {
          const pkg = event.metadata?.package;
          if (pkg) {
            return (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span className="font-mono">{String(pkg)}</span>
              </span>
            );
          }
          return null;
        })()}
        {(() => {
          const policy = event.metadata?.policy;
          if (policy) {
            return (
              <span className="flex items-center gap-1 text-warning">
                <ShieldIcon className="w-3.5 h-3.5" />
                <span className="font-mono">{String(policy)}</span>
              </span>
            );
          }
          return null;
        })()}
        {(() => {
          const secretType = event.metadata?.secretType;
          if (secretType) {
            return (
              <span className="flex items-center gap-1 text-critical">
                <KeyIcon className="w-3.5 h-3.5" />
                <span>{String(secretType)}</span>
              </span>
            );
          }
          return null;
        })()}
        <span className="flex items-center gap-1">
          <UserIcon className="w-3.5 h-3.5" />
          <span>{event.actor.name}</span>
        </span>
        {(() => {
          const pr = event.metadata?.pr;
          if (pr) {
            return (
              <span className="flex items-center gap-1">
                <GitBranchIcon className="w-3.5 h-3.5" />
                <span className="font-mono text-primary">{String(pr)}</span>
              </span>
            );
          }
          return null;
        })()}
        {(() => {
          const branch = event.metadata?.branch;
          if (branch) {
            return (
              <span className="flex items-center gap-1">
                <GitBranchIcon className="w-3.5 h-3.5" />
                <span className="font-mono">{String(branch)}</span>
              </span>
            );
          }
          return null;
        })()}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-muted">
      <Rss className="w-12 h-12 text-text-muted/50 mb-4" />
      <p className="text-body-md">No events match the current filter</p>
      <p className="text-body-sm">Try adjusting your filter or wait for new events</p>
    </div>
  );
}

export function LiveAuditStream({
  events: initialEvents = [],
  maxEvents = 50,
  className,
  autoRefresh = true,
  refreshInterval = 30000,
  onEventClick,
  onExport,
  onFilterChange,
}: LiveAuditStreamProps) {
  const [events, setEvents] = useState<AuditEvent[]>(() => {
    const combined = [...initialEvents];
    if (combined.length < maxEvents) {
      const mockEvents = MOCK_EVENTS.slice(0, maxEvents - combined.length).map((event, index) => ({
        ...event,
        id: generateId(),
        timestamp: new Date(Date.now() - index * 60000 - getRandomTimeOffset()).toISOString(),
      }));
      combined.push(...mockEvents);
    }
    return combined.slice(0, maxEvents);
  });
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const eventConfig = EVENT_CONFIG;

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return event.severity === 'critical';
    if (filter === 'high') return event.severity === 'high' || event.severity === 'critical';
    if (filter === 'medium') return event.severity === 'medium' || event.severity === 'high' || event.severity === 'critical';
    if (filter === 'info') return event.severity === 'info' || event.severity === 'low';
    return true;
  });

  const addMockEvent = useCallback(() => {
    if (paused) return;
    const mockEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
    const newEvent = {
      ...mockEvent,
      id: generateId(),
      timestamp: new Date().toISOString(),
    } as AuditEvent;
    setEvents((prev) => [newEvent, ...prev].slice(0, maxEvents));
  }, [maxEvents]);

  useEffect(() => {
    if (!autoRefresh || paused) return;
    const interval = setInterval(addMockEvent, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, paused, refreshInterval, addMockEvent]);

  const handlePauseToggle = () => setPaused((prev) => !prev);

  const handleExport = () => {
    const exportData = events.map((e) => ({
      timestamp: e.timestamp,
      type: e.type,
      severity: e.severity,
      title: e.title,
      description: e.description,
      repository: e.repository?.fullName,
      actor: e.actor.name,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onExport?.();
    setShowExportMenu(false);
  };

  const renderEventList = () => {
    if (filteredEvents.length === 0) {
      return <EmptyState />;
    }

    return filteredEvents.map((event, index) => (
      <EventItem
        key={event.id}
        event={event}
        index={index}
        eventConfig={eventConfig}
        getSeverityColor={getSeverityColor}
        formatRelativeTime={formatRelativeTime}
        onEventClick={onEventClick}
      />
    ));
  };

  return (
    <Card className={cn('flex flex-col', className)}>
      <div className="p-4 lg:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-tertiary" />
            <h3 className="text-headline-sm font-display font-semibold text-text-primary">Live Audit Stream</h3>
          </div>
          <span className={cn(
            'px-2 py-0.5 rounded text-label-xs font-mono font-medium',
            paused ? 'bg-warning/20 text-warning' : 'bg-tertiary/20 text-tertiary'
          )}>
            {paused ? 'Paused' : 'Real-time'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full right-0 mb-2 z-50 w-48 rounded-lg p-2 bg-surface-1 border border-border-strong shadow-elevated animate-slide-up-fade"
                >
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-2 px-3 py-2 text-body-sm text-text-primary hover:bg-surface-2 rounded-lg transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Export JSON Logs
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1 bg-surface-1 rounded-lg p-1">
            {(['all', 'critical', 'high', 'medium', 'info'] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  onFilterChange?.(f);
                }}
                className={cn(
                  'px-2 py-1 rounded font-label-xs text-label-xs transition-colors',
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePauseToggle}
            className={cn('gap-1', paused && 'text-warning')}
            aria-label={paused ? 'Resume stream' : 'Pause stream'}
          >
            {paused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">{paused ? 'Resume' : 'Pause'}</span>
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1"
        >
          {renderEventList()}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export function LiveAuditStreamCompact({
  events,
  maxEvents = 5,
  className,
  onEventClick,
}: { events: AuditEvent[]; maxEvents?: number; className?: string; onEventClick?: (event: AuditEvent) => void }) {
  const displayEvents = events.slice(0, maxEvents);

  return (
    <div className={cn('space-y-3', className)}>
      {displayEvents.map((event, index) => {
        const config = EVENT_CONFIG[event.type];
        const borderColor = config?.borderColor || 'primary';
        const eventColor = getSeverityColor(event.severity);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-surface-1',
              `border-l-2 border-${borderColor}`
            )}
            onClick={() => onEventClick?.(event)}
            style={{ cursor: onEventClick ? 'pointer' : 'default' }}
          >
            <div className={cn('w-2 h-2 rounded-full mt-2 flex-shrink-0', eventColor)}>
              {event.severity === 'critical' && <motion.div className="w-2 h-2 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-text-primary">{event.title}</span>
                <SeverityBadge severity={event.severity as any} size="sm" />
                {event.repository && (
                  <span className="text-body-sm text-text-muted font-mono">{event.repository.name}</span>
                )}
              </div>
              <p className="text-body-sm text-text-muted">{event.description}</p>
              <div className="flex items-center gap-2 mt-1 text-body-xs text-text-muted">
                <AvatarGroup max={3} size="xs">
                  <Avatar name={event.actor.name} size="xs" />
                </AvatarGroup>
                <span className="font-mono">{formatRelativeTime(event.timestamp)}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}