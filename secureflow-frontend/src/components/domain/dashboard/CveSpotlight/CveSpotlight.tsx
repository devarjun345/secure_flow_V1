'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Card as UICard } from '@/components/ui/Card';
import {
  AlertTriangleIcon,
  ShieldIcon,
  FileTextIcon,
  GitBranchIcon,
  XIcon,
  ExternalLinkIcon,
  LayersIcon,
} from 'lucide-react';

export interface CVEFinding {
  cveId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvssScore: number;
  cvssVector?: string;
  title: string;
  description: string;
  packageName: string;
  packageVersion: string;
  fixedVersion?: string;
  cweIds: string[];
  repository: { name: string; owner: string; fullName: string; defaultBranch: string };
  filePath: string;
  lineStart: number;
  lineEnd: number;
  codeSnippet: string;
  vulnerableCode: string;
  fixedCode: string;
  engine: 'trivy' | 'gitleaks' | 'semgrep' | 'checkov';
  ruleId: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'accepted_risk' | 'false_positive';
  firstSeen: string;
  lastSeen: string;
}

export interface CveSpotlightProps {
  finding?: CVEFinding;
  onClose?: () => void;
  onGeneratePR?: () => Promise<void>;
  onQuarantine?: () => Promise<void>;
  className?: string;
}

const mockFinding: CVEFinding = {
  cveId: 'CVE-2024-3094',
  severity: 'critical',
  cvssScore: 9.8,
  cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
  title: 'Remote Code Execution in liblzma5 (xz-utils)',
  description:
    'A malicious backdoor was discovered in xz-utils versions 5.6.0 and 5.6.1 that allows remote code execution via SSH authentication bypass. The backdoor was inserted by a compromised maintainer account.',
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
  engine: 'trivy',
  ruleId: 'CVE-2024-3094',
  status: 'open',
  firstSeen: '2024-03-29T14:30:00Z',
  lastSeen: '2024-03-29T14:30:00Z',
};

const cvssMetrics = [
  { label: 'Attack Vector', value: 'Network (AV:N)' },
  { label: 'Attack Complexity', value: 'Low (AC:L)' },
  { label: 'Privileges Required', value: 'None (PR:N)' },
  { label: 'User Interaction', value: 'None (UI:N)' },
  { label: 'Scope', value: 'Unchanged (S:U)' },
  { label: 'Confidentiality', value: 'High (C:H)' },
  { label: 'Integrity', value: 'High (I:H)' },
  { label: 'Availability', value: 'High (A:H)' },
];

const diffLines = [
  { line: 38, type: 'context', content: '# Base runtime image configuration' },
  { line: 39, type: 'context', content: 'FROM debian:bookworm-slim' },
  { line: 40, type: 'removed', content: 'RUN apt-get update && apt-get install -y liblzma5=5.6.1-1' },
  { line: 41, type: 'added', content: 'RUN apt-get update && apt-get install -y liblzma5=5.6.1+really5.4.5-1' },
  { line: 42, type: 'context', content: 'USER worker' },
];

export function CveSpotlightCard({
  finding = mockFinding,
  onClick,
  className,
}: { finding?: CVEFinding; onClick?: () => void; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-4 rounded-lg flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:bg-surface-1 hover:shadow-glow-primary',
        'bg-critical/10 border border-critical/30',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity="critical" size="sm" />
            <span className="font-mono text-code-sm text-critical">{finding.cveId}</span>
          </div>
          <p className="text-body-sm text-text-muted">{finding.description.slice(0, 100)}...</p>
        </div>
        <Badge variant="critical" size="sm">{finding.cvssScore}</Badge>
      </div>
      <div className="flex items-center gap-2 text-body-sm text-text-muted">
        <span className="font-mono">{finding.repository.fullName}</span>
        <span className="text-border">•</span>
        <span>{finding.filePath}:{finding.lineStart}-{finding.lineEnd}</span>
      </div>
    </motion.div>
  );
}

function OverviewTab({ finding }: { finding: CVEFinding }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-headline-sm font-display font-semibold text-text-primary">Vulnerability Details</h4>
          <div className="card rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-label-md text-text-muted">CVE ID</p>
                <p className="font-mono text-code-sm text-text-primary">{finding.cveId}</p>
              </div>
              <div>
                <p className="text-label-md text-text-muted">CVSS Score</p>
                <p className="font-mono text-code-sm text-critical font-bold">{finding.cvssScore} / 10</p>
              </div>
              <div>
                <p className="text-label-md text-text-muted">Severity</p>
                <SeverityBadge severity={finding.severity as any} size="md" />
              </div>
              <div>
                <p className="text-label-md text-text-muted">Status</p>
                <SeverityBadge severity={finding.status as any} size="md" />
              </div>
              <div>
                <p className="text-label-md text-text-muted">Package</p>
                <p className="font-mono text-code-sm text-text-primary">{finding.packageName}@{finding.packageVersion}</p>
              </div>
              <div>
                <p className="text-label-md text-text-muted">Fixed Version</p>
                <p className="font-mono text-code-sm text-success">{finding.fixedVersion || 'Not available'}</p>
              </div>
              <div>
                <p className="text-label-md text-text-muted">Engine</p>
                <Badge variant="info" size="sm">{finding.engine}</Badge>
              </div>
              <div>
                <p className="text-label-md text-text-muted">Rule ID</p>
                <p className="font-mono text-code-sm text-text-primary">{finding.ruleId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-headline-sm font-display font-semibold text-text-primary">Description</h4>
          <div className="card rounded-lg p-4">
            <p className="text-body-md text-text-muted leading-relaxed">{finding.description}</p>
          </div>

          <h4 className="text-headline-sm font-display font-semibold text-text-primary">Affected Location</h4>
          <div className="card rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-text-muted">
                <FileTextIcon className="w-4 h-4" />
                <span>File: </span>
                <span className="font-mono text-code-sm text-text-primary">{finding.filePath}</span>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1 text-text-muted">
                <GitBranchIcon className="w-3.5 h-3.5" />
                <span>Lines: </span>
                <span className="font-mono text-code-sm">{finding.lineStart}-{finding.lineEnd}</span>
              </span>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1 text-text-muted">
                <LayersIcon className="w-3.5 h-3.5" />
                <span>Package: </span>
                <span className="font-mono text-code-sm">{finding.packageName}</span>
              </span>
            </div>
          </div>

          <h4 className="text-headline-sm font-display font-semibold text-text-primary">CWE IDs</h4>
          <div className="flex flex-wrap gap-2">
            {finding.cweIds.map((cwe) => (
              <Badge key={cwe} variant="default" size="sm">
                <ExternalLinkIcon className="w-3 h-3 mr-1" />
                {cwe}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiffTab() {
  return (
    <div className="space-y-4">
      <div className="card rounded-lg overflow-hidden">
        <div className="font-mono text-code-sm">
          {diffLines.map((line) => (
            <div
              key={line.line}
              className={`px-4 py-2 border-t border-border ${
                line.type === 'removed' ? 'bg-red-500/10 text-red-400' :
                line.type === 'added' ? 'bg-green-500/10 text-green-400' :
                'text-text-muted'
              } flex items-center gap-3`}
            >
              <span className="w-10 text-right text-text-muted select-none">{line.line}</span>
              <span className="flex-1 whitespace-pre font-mono text-code-sm">
                {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '} {line.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CvssTab({ finding }: { finding: CVEFinding }) {
  return (
    <div className="space-y-4">
      <div className="card rounded-lg p-4 space-y-3">
        {cvssMetrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-label-md text-text-muted">{metric.label}</span>
            <span className="font-mono text-code-sm text-text-primary">{metric.value}</span>
          </div>
        ))}
      </div>
      <div className="card rounded-lg p-4">
        <p className="text-body-sm text-text-muted">
          Vector: {finding.cvssVector || 'N/A'}
        </p>
      </div>
    </div>
  );
}

function RemediationTab({ finding, onGeneratePR, onQuarantine }: { finding: CVEFinding; onGeneratePR?: () => Promise<void>; onQuarantine?: () => Promise<void> }) {
  return (
    <div className="space-y-4">
      <div className="card rounded-lg p-4 space-y-3">
        <h5 className="text-headline-sm font-display font-semibold text-text-primary">Recommended Actions</h5>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onGeneratePR} className="gap-2">
            <GitBranchIcon className="w-4 h-4" />
            Generate Fix PR
          </Button>
          <Button variant="destructive" size="sm" onClick={onQuarantine} className="gap-2">
            <ShieldIcon className="w-4 h-4" />
            Quarantine Container
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLinkIcon className="w-4 h-4" />
            View NVD Entry
          </Button>
        </div>
      </div>
      {finding.fixedVersion && (
        <div className="card rounded-lg p-4 space-y-3">
          <h5 className="text-headline-sm font-display font-semibold text-text-primary">Fixed Version Available</h5>
          <p className="text-body-md text-text-muted">
            Upgrade <code className="font-mono bg-surface-2 px-1.5 py-0.5 rounded">{finding.packageName}</code> to version <code className="font-mono bg-surface-2 px-1.5 py-0.5 rounded text-success">{finding.fixedVersion}</code>
          </p>
        </div>
      )}
    </div>
  );
}

function TabContent({ activeTab, finding, onGeneratePR, onQuarantine }: { activeTab: string; finding: CVEFinding; onGeneratePR?: () => Promise<void>; onQuarantine?: () => Promise<void> }) {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab finding={finding} />;
    case 'diff':
      return <DiffTab />;
    case 'cvss':
      return <CvssTab finding={finding} />;
    case 'remediation':
      return <RemediationTab finding={finding} onGeneratePR={onGeneratePR} onQuarantine={onQuarantine} />;
    default:
      return <OverviewTab finding={finding} />;
  }
}

export function CveSpotlightDetail({
  finding = mockFinding,
  isOpen,
  onClose,
  onGeneratePR,
  onQuarantine,
}: { finding?: CVEFinding; isOpen: boolean; onClose: () => void; onGeneratePR?: () => Promise<void>; onQuarantine?: () => Promise<void> }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'diff' | 'cvss' | 'remediation'>('overview');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          <UICard className="h-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-4 lg:p-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center text-critical">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <SeverityBadge severity="critical" size="lg" />
                    <span className="font-mono text-code-md text-critical">{finding.cveId}</span>
                    <Badge variant="critical" size="lg">{finding.cvssScore}</Badge>
                  </div>
                  <h3 className="text-headline-sm font-display font-bold text-text-primary truncate">
                    {finding.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-body-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <GitBranchIcon className="w-3.5 h-3.5" />
                      <span className="font-mono text-text-primary">{finding.repository.fullName}</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <GitBranchIcon className="w-3.5 h-3.5" />
                      <span className="font-mono">{finding.repository.defaultBranch}</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <FileTextIcon className="w-3.5 h-3.5" />
                      <span className="font-mono">{finding.filePath}:{finding.lineStart}-{finding.lineEnd}</span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <LayersIcon className="w-3.5 h-3.5" />
                      <span className="font-mono text-text-primary">{finding.packageName}@{finding.packageVersion}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={finding.severity === 'critical' ? 'critical' : 'default'} size="lg">
                  {finding.severity.toUpperCase()}
                </Badge>
                <Badge variant="info" size="sm">{finding.cvssScore}</Badge>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
              <nav className="flex gap-1 p-1 bg-surface-1 rounded-lg m-4" aria-label="CVE detail tabs">
                {[
                  { id: 'overview', label: 'Overview', icon: <AlertTriangleIcon className="w-4 h-4" /> },
                  { id: 'diff', label: 'Code Diff', icon: <FileTextIcon className="w-4 h-4" /> },
                  { id: 'cvss', label: 'CVSS Vector', icon: <ShieldIcon className="w-4 h-4" /> },
                  { id: 'remediation', label: 'Remediation', icon: <ShieldIcon className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-label-md transition-all duration-fast',
                      activeTab === tab.id
                        ? 'bg-surface-2 text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface-3'
                      )}
                    >
                      <span className="flex-shrink-0">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabContent activeTab={activeTab} finding={finding} onGeneratePR={onGeneratePR} onQuarantine={onQuarantine} />
                </motion.div>
              </AnimatePresence>
            </div>
          </UICard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function CveSpotlight({
  finding = mockFinding,
  onGeneratePR,
  onQuarantine,
  className,
}: CveSpotlightProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleClick = () => setIsDetailOpen(true);

  return (
    <div className={cn('space-y-4', className)}>
      <CveSpotlightCard finding={finding} onClick={handleClick} />
      <CveSpotlightDetail
        finding={finding}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onGeneratePR={onGeneratePR}
        onQuarantine={onQuarantine}
      />
    </div>
  );
}

export function CveSpotlightInline({
  finding = mockFinding,
  className,
}: { finding?: CVEFinding; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="p-4 rounded-lg bg-critical/10 border border-critical/30">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SeverityBadge severity="critical" size="sm" />
              <span className="font-mono text-code-sm text-critical">{finding.cveId}</span>
            </div>
            <p className="text-body-sm text-text-muted">{finding.description.slice(0, 100)}...</p>
          </div>
          <Badge variant="critical" size="sm">{finding.cvssScore}</Badge>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-text-muted">
          <span className="font-mono">{finding.repository.fullName}</span>
          <span className="text-border">•</span>
          <span>{finding.filePath}:{finding.lineStart}-{finding.lineEnd}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button variant="secondary" size="sm" className="gap-2">
            <GitBranchIcon className="w-4 h-4" />
            Generate Fix PR
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <ShieldIcon className="w-4 h-4" />
            Quarantine Container
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLinkIcon className="w-4 h-4" />
            View NVD Entry
          </Button>
        </div>
      </div>
    </div>
  );
}