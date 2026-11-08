'use client';

import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GitBranchIcon, PlusIcon, SearchIcon, ShieldIcon } from 'lucide-react';


const mockRepos = [
  { id: '1', name: 'secureflow-frontend', owner: 'secureflow', language: 'TypeScript', branch: 'main', enabled: true, lastScan: '2 hours ago', vulns: { critical: 2, high: 5, medium: 12, low: 8 }, status: 'vulnerable' },
  { id: '2', name: 'secureflow-backend', owner: 'secureflow', language: 'Python', branch: 'main', enabled: true, lastScan: '4 hours ago', vulns: { critical: 0, high: 3, medium: 7, low: 4 }, status: 'healthy' },
  { id: '3', name: 'secureflow-worker', owner: 'secureflow', language: 'Python', branch: 'main', enabled: false, lastScan: 'Never', vulns: { critical: 0, high: 0, medium: 0, low: 0 }, status: 'disabled' },
  { id: '4', name: 'secureflow-docs', owner: 'secureflow', language: 'Markdown', branch: 'main', enabled: true, lastScan: '1 day ago', vulns: { critical: 0, high: 0, medium: 0, low: 0 }, status: 'secure' },
  { id: '5', name: 'secureflow-api', owner: 'secureflow', language: 'TypeScript', branch: 'develop', enabled: true, lastScan: '30 min ago', vulns: { critical: 1, high: 2, medium: 5, low: 3 }, status: 'vulnerable' },
  { id: '6', name: 'secureflow-dashboard', owner: 'secureflow', language: 'TypeScript', branch: 'main', enabled: true, lastScan: '6 hours ago', vulns: { critical: 0, high: 0, medium: 2, low: 1 }, status: 'healthy' },
];

export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Repository Management"
        description="Monitor and manage security scanning for your GitHub repositories"
        icon={<GitBranchIcon className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <ShieldIcon className="w-4 h-4" />
              Bulk Sync
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
              <PlusIcon className="w-4 h-4" />
              Connect Repository
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input type="search" placeholder="Search repositories..." className="input-field w-full pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <select className="input-field w-auto py-2">
                <option value="">All Languages</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Go">Go</option>
              </select>
              <select className="input-field w-auto py-2">
                <option value="">All Status</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="healthy">Healthy</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {mockRepos.map((repo) => (
              <Card key={repo.id} className="p-4 h-full flex flex-col" hover>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <GitBranchIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">{repo.name}</span>
                        <Badge variant={repo.enabled ? 'success' : 'default'} size="sm">
                          {repo.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-text-muted">{repo.owner}/{repo.name}</p>
                    </div>
                  </div>
                  <Badge variant={repo.status === 'vulnerable' ? 'critical' : repo.status === 'healthy' ? 'success' : repo.status === 'disabled' ? 'default' : 'info'} size="sm">
                    {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-3 text-body-sm text-text-muted">
                  <span className="flex items-center gap-1"><GitBranchIcon className="w-3.5 h-3.5" />{repo.branch}</span>
                  <span className="flex items-center gap-1"><ShieldIcon className="w-3.5 h-3.5" />{repo.language}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  {[
                    { label: 'Critical', count: repo.vulns.critical, variant: 'critical' as const },
                    { label: 'High', count: repo.vulns.high, variant: 'warning' as const },
                    { label: 'Medium', count: repo.vulns.medium, variant: 'info' as const },
                    { label: 'Low', count: repo.vulns.low, variant: 'default' as const },
                  ].map((v) => (
                    <Badge key={v.label} variant={v.variant} size="sm" dot={v.count > 0}>
                      {v.count}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-body-sm text-text-muted">Last scan: {repo.lastScan}</span>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}