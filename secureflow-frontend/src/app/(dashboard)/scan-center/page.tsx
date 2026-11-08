'use client';

import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SeverityBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  PlayCircleIcon,
  FileTextIcon,
  ShieldIcon,
  KeyIcon,
  GitBranchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from 'lucide-react';

export default function ScanCenterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan Center"
        description="Real-time scan orchestration and monitoring"
        icon={<ShieldIcon className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <FileTextIcon className="w-4 h-4" />
              Scan Profiles
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <PlayCircleIcon className="w-4 h-4" />
              Start Scan
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            <div className="card rounded-lg p-4 border border-warning/30 bg-warning/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-label-md text-text-muted">Active Scan</p>
                  <h3 className="text-headline-sm font-display font-bold text-text-primary">secureflow-frontend</h3>
                  <p className="text-body-sm text-text-muted mt-1">Branch: main • Commit: a1b2c3d4e5f6...</p>
                </div>
                <SeverityBadge severity="info" size="lg" />
              </div>
              <div className="h-4 rounded-full bg-surface-1 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary via-tertiary to-primary animate-shimmer" style={{ width: '65%' }} />
              </div>
              <div className="flex items-center justify-between text-body-sm text-text-muted mt-2">
                <span>65% Complete</span>
                <span>Stage: Gitleaks Secret Scanning</span>
                <span>ETA: ~2m 30s</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Clone', status: 'success', progress: 100, icon: GitBranchIcon },
                { label: 'Trivy', status: 'success', progress: 100, icon: ShieldIcon },
                { label: 'Gitleaks', status: 'running', progress: 65, icon: KeyIcon },
                { label: 'SBOM', status: 'pending', progress: 0, icon: FileTextIcon },
              ].map((stage) => (
                <Card key={stage.label} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <stage.icon className="w-4 h-4" />
                    </div>
                    <SeverityBadge
                      severity={
                        stage.status === 'success' ? 'info' :
                        stage.status === 'running' ? 'info' : 'unknown'
                      }
                      size="sm"
                    />
                  </div>
                  <div className="h-2 rounded-full bg-surface-1 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        stage.status === 'running' ? 'bg-gradient-to-r from-primary via-tertiary to-primary animate-shimmer' :
                        stage.status === 'success' ? 'bg-success' : 'bg-border'
                      )}
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-body-xs text-text-muted mt-1">
                    <span>{stage.progress}%</span>
                    <span>{stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}</span>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <p className="text-label-md text-text-muted mb-3">Telemetry Terminal</p>
              <div className="h-64 bg-surface-1 rounded-lg p-4 font-mono text-code-sm text-text-code overflow-y-auto space-y-1">
                <div className="flex items-center gap-2 text-success"><span>[14:32:15]</span><span>✓</span><span>Clone completed successfully</span></div>
                <div className="flex items-center gap-2 text-success"><span>[14:32:18]</span><span>✓</span><span>Trivy scan started</span></div>
                <div className="flex items-center gap-2 text-success"><span>[14:35:42]</span><span>✓</span><span>Trivy scan completed: 27 findings</span></div>
                <div className="flex items-center gap-2 text-info"><span>[14:35:45]</span><span>⟳</span><span>Gitleaks scan started</span></div>
                <div className="flex items-center gap-2 text-warning"><span>[14:36:12]</span><span>⚠</span><span>Secret detected: AWS Access Key in config/aws.json</span></div>
                <div className="flex items-center gap-2 text-info"><span>[14:37:01]</span><span>⟳</span><span>Scanning... 65% complete</span></div>
              </div>
            </Card>
          </CardContent>
        </Card>

        <Card className="space-y-4 p-4">
          <CardContent className="space-y-4">
            <div>
              <p className="text-label-md text-text-muted mb-3">Scan Metrics</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Active Scans', value: '2', icon: PlayCircleIcon, color: 'text-primary' },
                  { label: 'Completed (24h)', value: '12', icon: CheckCircleIcon, color: 'text-success' },
                  { label: 'Failed (24h)', value: '1', icon: XCircleIcon, color: 'text-critical' },
                  { label: 'Avg Duration', value: '4m 32s', icon: ClockIcon, color: 'text-warning' },
                ].map((metric) => (
                  <Card key={metric.label} className="p-3 text-center">
                    <metric.icon className={cn('w-5 h-5 mx-auto mb-1', metric.color)} />
                    <div className="text-headline-md font-display font-bold text-text-primary">{metric.value}</div>
                    <div className="text-label-xs text-text-muted">{metric.label}</div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <p className="text-label-md text-text-muted mb-3">Runner Pool Health</p>
              <div className="space-y-2">
                {[
                  { name: 'runner-1', status: 'healthy', jobs: 2, capacity: 4 },
                  { name: 'runner-2', status: 'healthy', jobs: 1, capacity: 4 },
                  { name: 'runner-3', status: 'busy', jobs: 4, capacity: 4 },
                ].map((runner) => (
                  <div key={runner.name} className="flex items-center justify-between p-2 rounded-lg bg-surface-1">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', runner.status === 'healthy' ? 'bg-success' : 'bg-warning')} />
                      <span className="font-mono text-code-sm text-text-primary">{runner.name}</span>
                    </div>
                    <div className="text-body-sm text-text-muted">{runner.jobs}/{runner.capacity} jobs</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}