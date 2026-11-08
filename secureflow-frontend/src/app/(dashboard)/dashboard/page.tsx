'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { SecurityHealthGauge } from '@/components/domain/dashboard/SecurityHealthGauge';
import { VulnerabilityMatrix } from '@/components/domain/dashboard/VulnerabilityMatrix';
import { ActiveScansTable } from '@/components/domain/dashboard/ActiveScansTable';
import { LiveAuditStream } from '@/components/domain/dashboard/LiveAuditStream';
import { CveSpotlight, CveSpotlightInline } from '@/components/domain/dashboard/CveSpotlight';
import { TimeRangeSelector } from '@/components/domain/dashboard/TimeRangeSelector/TimeRangeSelector';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import {
  LayoutDashboardIcon,
  GitBranchIcon,
  AlertTriangleIcon,
  KeyIcon,
  ActivityIcon,
  ClockIcon,
  ShieldIcon,
  CheckCircleIcon,
  XCircleIcon,
  RssFeedIcon,
  BoltIcon,
  FileTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const mockKPIs = [
  { label: 'Monitored Repositories', value: '14', change: { value: 2, label: 'vs last week', positive: true }, icon: <GitBranchIcon className="w-6 h-6" />, trend: 'up' as const },
  { label: 'Total Scans (30d)', value: '1,428', change: { value: 99, label: 'vs last week', positive: true }, icon: <ActivityIcon className="w-6 h-6" />, trend: 'up' as const },
  { label: 'Critical CVEs', value: '3', change: { value: 1, label: 'vs last week', positive: false }, icon: <AlertTriangleIcon className="w-6 h-6" />, trend: 'down' as const },
  { label: 'Leaked Secrets', value: '0', change: { value: 0, label: 'vs last week', positive: true }, icon: <KeyIcon className="w-6 h-6" />, trend: 'neutral' as const },
];

const mockSeverityBreakdown = {
  critical: 3,
  high: 14,
  medium: 32,
  low: 58,
  total: 107,
};

const mockTrendData = [
  { date: 'D-30', ingested: 45, mitigated: 30 },
  { date: 'D-25', ingested: 52, mitigated: 38 },
  { date: 'D-20', ingested: 38, mitigated: 42 },
  { date: 'D-15', ingested: 45, mitigated: 40 },
  { date: 'D-10', ingested: 41, mitigated: 48 },
  { date: 'D-5', ingested: 38, mitigated: 52 },
  { date: 'Current', ingested: 27, mitigated: 45 },
];

const mockActiveScans = [
  {
    id: 'scan-1',
    repository: { name: 'payment-gateway', owner: 'acme-corp', fullName: 'acme-corp/payment-gateway', icon: <LockIcon className="w-4 h-4" /> },
    branch: 'main',
    commitSha: 'e7b9c1a',
    triggerType: 'webhook' as const,
    status: 'completed' as const,
    progress: 100,
    stage: 'complete',
    startedAt: '2024-01-20T14:32:15Z',
    duration: 38000,
    findings: { critical: 1, high: 2, medium: 5, low: 3, info: 0 },
    engines: ['trivy', 'gitleaks'],
  },
  {
    id: 'scan-2',
    repository: { name: 'auth-service', owner: 'acme-corp', fullName: 'acme-corp/auth-service', icon: <KeyIcon className="w-4 h-4" /> },
    branch: 'v2.4-release',
    commitSha: '4a1f89c',
    triggerType: 'webhook' as const,
    status: 'running' as const,
    progress: 68,
    stage: 'gitleaks',
    startedAt: '2024-01-20T15:00:00Z',
    findings: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    engines: ['gitleaks'],
  },
  {
    id: 'scan-3',
    repository: { name: 'frontend-portal', owner: 'acme-corp', fullName: 'acme-corp/frontend-portal', icon: <GlobeIcon className="w-4 h-4" /> },
    branch: 'staging',
    commitSha: '99d3e4b',
    triggerType: 'scheduled' as const,
    status: 'completed' as const,
    progress: 100,
    stage: 'complete',
    startedAt: '2024-01-20T14:00:00Z',
    duration: 24000,
    findings: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    engines: ['trivy'],
  },
  {
    id: 'scan-4',
    repository: { name: 'data-pipeline-worker', owner: 'acme-corp', fullName: 'acme-corp/data-pipeline-worker', icon: <DatabaseIcon className="w-4 h-4" /> },
    branch: 'develop',
    commitSha: '2c8e11f',
    triggerType: 'webhook' as const,
    status: 'failed' as const,
    progress: 100,
    stage: 'trivy',
    startedAt: '2024-01-19T10:00:00Z',
    duration: 72000,
    findings: { critical: 2, high: 0, medium: 0, low: 0, info: 0 },
    engines: ['trivy', 'gitleaks'],
    errorMessage: 'Trivy scan timeout',
  },
];

const mockAuditEvents = [
  {
    id: '1',
    type: 'scan_completed' as const,
    title: 'Scan completed for payment-gateway',
    description: 'Found 1 critical, 2 high, 5 medium, 3 low vulnerabilities',
    severity: 'critical' as const,
    repository: { id: '1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: '1', name: 'GitHub Webhook', avatarUrl: 'https://github.com/github.png' },
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'vulnerability_found' as const,
    title: 'New critical vulnerability in liblzma5',
    description: 'CVE-2024-3094 candidate detected in data-pipeline-worker',
    severity: 'critical' as const,
    repository: { id: '2', name: 'data-pipeline-worker', fullName: 'acme-corp/data-pipeline-worker' },
    actor: { id: 'sys', name: 'Trivy Scanner', avatarUrl: 'https://github.com/trivy.png' },
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'repository_connected' as const,
    title: 'Repository connected: auth-service',
    description: 'Monitoring enabled for auth-service',
    severity: 'info' as const,
    repository: { id: '3', name: 'auth-service', fullName: 'acme-corp/auth-service' },
    actor: { id: '1', name: 'Alex Mercer', avatarUrl: 'https://github.com/identicons/alex.png' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'policy_violation' as const,
    title: 'Policy violation: STRICT_PRODUCTION_ZERO_HIGH',
    description: 'Blocked merge on branch main due to CVE-2024-21626',
    severity: 'high' as const,
    repository: { id: '1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'sys', name: 'Policy Engine', avatarUrl: 'https://github.com/policy.png' },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'secret_detected' as const,
    title: 'AWS Access Key detected in config',
    description: 'Slack Incoming Webhook URL caught by Gitleaks in commit 8d22f9',
    severity: 'critical' as const,
    repository: { id: '1', name: 'payment-gateway', fullName: 'acme-corp/payment-gateway' },
    actor: { id: 'sys', name: 'Gitleaks Scanner', avatarUrl: 'https://github.com/gitleaks.png' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'engine_sync' as const,
    title: 'Trivy database sync completed',
    description: 'Synced 412 CVE descriptors across Debian, Alpine, and Go ecosystems',
    severity: 'info' as const,
    repository: undefined,
    actor: { id: 'sys', name: 'Trivy Engine', avatarUrl: 'https://github.com/trivy.png' },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockFinding = {
  cveId: 'CVE-2024-3094',
  severity: 'critical' as const,
  cvssScore: 9.8,
  cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
  title: 'Remote Code Execution in liblzma5 (xz-utils)',
  description: 'A malicious backdoor was discovered in xz-utils versions 5.6.0 and 5.6.1 that allows remote code execution via SSH authentication bypass. The backdoor was inserted by a compromised maintainer account.',
  packageName: 'liblzma5',
  packageVersion: '5.6.1',
  fixedVersion: '5.6.1+really5.4.5-1',
  cweIds: ['CWE-506', 'CWE-507', 'CWE-799'],
  repository: {
    name: 'data-pipeline-worker',
    owner: 'acme-corp',
    fullName: 'acme-corp/data-pipeline-worker',
    defaultBranch: 'develop',
  },
  filePath: 'Dockerfile.base',
  lineStart: 38,
  lineEnd: 44,
  codeSnippet: 'RUN apt-get update && apt-get install -y liblzma5=5.6.1-1',
  vulnerableCode: `FROM debian:bookworm-slim

# Base runtime image configuration
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y liblzma5=5.6.1-1
USER worker`,
  fixedCode: `FROM debian:bookworm-slim

# Base runtime image configuration
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y liblzma5=5.6.1+really5.4.5-1
USER worker`,
  engine: 'trivy' as const,
  ruleId: 'CVE-2024-3094',
  status: 'open' as const,
  firstSeen: '2024-03-29T14:30:00Z',
  lastSeen: '2024-03-29T14:30:00Z',
};

function GlobeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" /></svg>;
}

function DatabaseIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* SOC Header with Context Ribbon */}
      <div className="w-full bg-surface-container-low px-6 py-3 rounded-xl flex items-center justify-between shadow-sm mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shrink-0" />
          <span className="font-label-xs text-label-xs uppercase tracking-wider text-tertiary font-bold shrink-0">Telemetry Active</span>
          <span className="text-border shrink-0">•</span>
          <span className="font-code-sm text-code-sm text-text-muted truncate">
            DEMO SIMULATION ENVIRONMENT — Live node stream synchronized with mock Kubernetes cluster ingress & Git Webhooks
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-code-sm text-code-sm text-outline hidden md:inline">Sync Latency: 12ms</span>
          <button className="px-3 py-1 rounded font-label-xs text-label-xs text-primary hover:text-on-primary hover:bg-primary/10 transition-colors uppercase tracking-widest font-semibold" type="button">Config Stream</button>
        </div>
      </div>

      {/* SOC Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-headline-lg font-display font-bold text-text-primary tracking-tight">Security Operations Center</h1>
            <span className="px-3 py-1 rounded bg-primary/20 text-primary font-code-sm text-code-sm">DEFCON-3</span>
            <span className="px-3 py-1 rounded bg-primary/20 text-primary font-code-sm text-code-sm">Gitleaks & Trivy Online</span>
          </div>
          <p className="text-body-md text-text-muted">
            Real-time posture across 14 connected GitHub repositories • Continuous pipeline telemetry & vulnerability triage.
          </p>
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <TimeRangeSelector
            value="30d"
            onChange={(v) => console.log('Time range changed:', v)}
            syncWithUrl={false}
            className="hidden sm:flex"
          />
          <div className="relative inline-flex items-center">
            <Button variant="secondary" size="sm" className="gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span>Env: Production</span>
              <ChevronDownIcon className="w-4 h-4 text-outline" />
            </Button>
          </div>
          <Button variant="primary" size="sm" className="gap-2" style={{ boxShadow: '0 0 18px -2px rgba(77,142,255,0.45)' }}>
            <BoltIcon className="w-4 h-4" />
            <span>Run Fast Audit</span>
          </Button>
          <Button variant="ghost" size="sm" aria-label="Export Executive Brief (PDF)">
            <FileTextIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mockKPIs.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="p-4 sm:p-6 rounded-xl bg-surface-1 hover:bg-surface-2 transition-all flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="font-label-xs text-label-xs uppercase text-text-muted tracking-wider">{kpi.label}</span>
                <span className="p-1 rounded bg-surface-container text-primary flex items-center justify-center">
                  {kpi.icon}
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-headline-lg font-display font-bold text-text-primary">{kpi.value}</span>
                  <span className={cn('font-label-xs text-label-xs', kpi.change?.positive ? 'text-success' : 'text-critical')}>
                    {kpi.change?.positive ? '+' : ''}{kpi.change?.value}% {kpi.change?.label}
                  </span>
                </div>
                <span className="font-code-sm text-code-sm text-text-muted">{kpi.change?.positive ? '100% active' : 'Action Req'}</span>
              </div>
              <div className="mt-4 pt-2 flex items-center justify-between text-text-muted font-code-sm text-code-sm">
                <span>12 GitHub Enterprise</span>
                <span>2 Internal Services</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Visualizations */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Security Health Gauge */}
        <div className="lg:col-span-5">
          <SecurityHealthGauge
            score={92}
            grade="A+"
            breakdown={{
              dependencies: 88,
              secrets: 99,
              iac: 94,
              policy: 89,
            }}
            showGrade
            showSubMetrics
            animate
          />
        </div>

        {/* Vulnerability Matrix */}
        <div className="lg:col-span-7">
          <VulnerabilityMatrix
            breakdown={mockSeverityBreakdown}
            trendData={mockTrendData}
            animate
          />
        </div>

        {/* Active Scans & Live Audit */}
        <div className="xl:col-span-8">
          <ActiveScansTable
            scans={mockActiveScans}
            onScanClick={(scan) => console.log('Scan clicked:', scan)}
            onViewReport={(scan) => console.log('View report:', scan)}
          />
        </div>

        <div className="xl:col-span-4">
          <LiveAuditStream
            events={mockAuditEvents}
            maxEvents={50}
            autoRefresh
            refreshInterval={30000}
            onEventClick={(event) => console.log('Event clicked:', event)}
            onExport={() => console.log('Export clicked')}
          />
        </div>

        {/* CVE Spotlight */}
        <div className="xl:col-span-12">
          <CveSpotlight
            finding={mockFinding}
            onClose={() => console.log('Close CVE detail')}
            onGeneratePR={() => console.log('Generate PR')}
            onQuarantine={() => console.log('Quarantine')}
          />
        </div>
      </div>
    </div>
  );
}