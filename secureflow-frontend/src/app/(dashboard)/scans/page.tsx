'use client';

import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { PlayCircleIcon, ListIcon, FilterIcon, ArrowRightIcon } from 'lucide-react';

const mockScans = [
  { id: 'scan-1', repo: 'secureflow-frontend', branch: 'main', trigger: 'webhook', status: 'completed', progress: 100, duration: '5m 23s', started: '2 hours ago', vulns: { critical: 2, high: 5, medium: 12, low: 8 } },
  { id: 'scan-2', repo: 'secureflow-backend', branch: 'develop', trigger: 'manual', status: 'running', progress: 65, duration: '3m 12s', started: '5 min ago', vulns: { critical: 0, high: 0, medium: 0, low: 0 } },
  { id: 'scan-3', repo: 'secureflow-api', branch: 'main', trigger: 'scheduled', status: 'completed', progress: 100, duration: '4m 45s', started: '1 day ago', vulns: { critical: 1, high: 2, medium: 5, low: 3 } },
  { id: 'scan-4', repo: 'secureflow-worker', branch: 'main', trigger: 'webhook', status: 'failed', progress: 100, duration: '1m 30s', started: '2 days ago', vulns: { critical: 0, high: 0, medium: 0, low: 0 }, error: 'Trivy timeout' },
  { id: 'scan-5', repo: 'secureflow-docs', branch: 'main', trigger: 'manual', status: 'completed', progress: 100, duration: '2m 10s', started: '3 days ago', vulns: { critical: 0, high: 0, medium: 0, low: 0 } },
];

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan History"
        description="View and manage all security scans across your repositories"
        icon={<ListIcon className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <FilterIcon className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <PlayCircleIcon className="w-4 h-4" />
              New Scan
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-label-xs">Repository</th>
                  <th className="px-4 py-3 text-left text-label-xs">Branch</th>
                  <th className="px-4 py-3 text-left text-label-xs">Trigger</th>
                  <th className="px-4 py-3 text-left text-label-xs">Status</th>
                  <th className="px-4 py-3 text-left text-label-xs">Progress</th>
                  <th className="px-4 py-3 text-left text-label-xs">Duration</th>
                  <th className="px-4 py-3 text-left text-label-xs">Started</th>
                  <th className="px-4 py-3 text-left text-label-xs">Findings</th>
                  <th className="px-4 py-3 text-right text-label-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-border hover:bg-surface-1 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-text-primary">{scan.repo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="sm">{scan.branch}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={scan.trigger === 'webhook' ? 'info' : scan.trigger === 'manual' ? 'default' : 'success'} size="sm">
                        {scan.trigger}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge
                        severity={
                          scan.status === 'completed' ? 'info' :
                          scan.status === 'running' ? 'info' :
                          scan.status === 'failed' ? 'critical' :
                          scan.status === 'queued' ? 'unknown' : 'unknown'
                        }
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32 h-2 rounded-full bg-surface-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-tertiary to-primary"
                          style={{ width: `${scan.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm font-mono text-text-muted">{scan.duration}</td>
                    <td className="px-4 py-3 text-body-sm text-text-muted">{scan.started}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {scan.vulns.critical > 0 && <SeverityBadge severity="critical" size="sm" showLabel={false} />}
                        {scan.vulns.high > 0 && <SeverityBadge severity="high" size="sm" showLabel={false} />}
                        {scan.vulns.medium > 0 && <SeverityBadge severity="medium" size="sm" showLabel={false} />}
                        {scan.vulns.low > 0 && <SeverityBadge severity="low" size="sm" showLabel={false} />}
                        {scan.vulns.critical === 0 && scan.vulns.high === 0 && scan.vulns.medium === 0 && scan.vulns.low === 0 && (
                          <Badge variant="success" size="sm">Clean</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <span className="text-body-sm text-text-muted">Showing 1 to 5 of 5 results</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled><ArrowRightIcon className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" disabled><ArrowRightIcon className="w-4 h-4" /><ArrowRightIcon className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}