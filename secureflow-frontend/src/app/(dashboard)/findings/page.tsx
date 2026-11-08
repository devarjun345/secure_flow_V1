'use client';

import { PageHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AlertTriangleIcon, FileTextIcon, FilterIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const mockFindings = [
  { id: '1', cve: 'CVE-2024-1234', severity: 'critical', category: 'dependency', package: 'lodash', version: '4.17.20', fixed: '4.17.21', cvss: 9.8, status: 'open', repo: 'secureflow-frontend', file: 'package-lock.json:45' },
  { id: '2', cve: 'AWS-Key-Leak', severity: 'high', category: 'secret', package: '-', version: '-', fixed: '-', cvss: '-', status: 'open', repo: 'secureflow-frontend', file: 'config/aws.json:12' },
  { id: '3', cve: 'CVE-2024-5678', severity: 'high', category: 'dependency', package: 'axios', version: '1.6.0', fixed: '1.6.5', cvss: 7.5, status: 'acknowledged', repo: 'secureflow-api', file: 'package-lock.json:23' },
  { id: '4', cve: 'CVE-2024-9012', severity: 'medium', category: 'dependency', package: 'react', version: '18.2.0', fixed: '18.2.1', cvss: 6.5, status: 'open', repo: 'secureflow-frontend', file: 'package-lock.json:67' },
  { id: '5', cve: 'Hardcoded-Password', severity: 'medium', category: 'secret', package: '-', version: '-', fixed: '-', cvss: '-', status: 'resolved', repo: 'secureflow-backend', file: 'settings.py:89' },
];

export default function FindingsPage() {
  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'dependency', label: 'Dependency' },
    { value: 'secret', label: 'Secret' },
    { value: 'iac', label: 'IaC' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'accepted_risk', label: 'Accepted Risk' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vulnerability Management"
        description="Search, filter, and manage security findings across all repositories"
        icon={<AlertTriangleIcon className="w-6 h-6" />}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <FileTextIcon className="w-4 h-4" />
              Export CSV
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <FilterIcon className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search findings..."
            leftIcon={<SearchIcon className="w-4 h-4" />}
            className="flex-1 max-w-sm"
          />
          <Select
            placeholder="Severity"
            options={severityOptions}
            className="w-auto min-w-[160px]"
          />
          <Select
            placeholder="Category"
            options={categoryOptions}
            className="w-auto min-w-[160px]"
          />
          <Select
            placeholder="Status"
            options={statusOptions}
            className="w-auto min-w-[160px]"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="critical" size="sm" dot>12</Badge>
            <Badge variant="warning" size="sm" dot>28</Badge>
            <Badge variant="info" size="sm" dot>45</Badge>
            <Badge variant="default" size="sm" dot>18</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-1">
                  <th className="px-4 py-3 text-left text-label-xs">Finding</th>
                  <th className="px-4 py-3 text-left text-label-xs">Severity</th>
                  <th className="px-4 py-3 text-left text-label-xs">Category</th>
                  <th className="px-4 py-3 text-left text-label-xs">Package</th>
                  <th className="px-4 py-3 text-left text-label-xs">Version</th>
                  <th className="px-4 py-3 text-left text-label-xs">Fixed In</th>
                  <th className="px-4 py-3 text-left text-label-xs">CVSS</th>
                  <th className="px-4 py-3 text-left text-label-xs">Status</th>
                  <th className="px-4 py-3 text-left text-label-xs">Repository</th>
                  <th className="px-4 py-3 text-left text-label-xs">Location</th>
                  <th className="px-4 py-3 text-right text-label-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFindings.map((finding) => (
                  <tr key={finding.id} className="border-b border-border hover:bg-surface-1 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-mono text-code-sm text-text-primary">{finding.cve}</span>
                        <p className="text-body-sm text-text-muted truncate max-w-xs">{finding.category === 'secret' ? 'Secret detected in configuration' : 'Vulnerability in dependency'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><SeverityBadge severity={finding.severity as any} size="sm" /></td>
                    <td className="px-4 py-3"><Badge variant={finding.category === 'dependency' ? 'info' : 'warning'} size="sm">{finding.category}</Badge></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-text-primary">{finding.package}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-text-muted">{finding.version}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-success">{finding.fixed}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-text-primary">{finding.cvss}</span></td>
                    <td className="px-4 py-3"><SeverityBadge severity={finding.severity as any} size="sm" /></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-text-primary">{finding.repo}</span></td>
                    <td className="px-4 py-3"><span className="font-mono text-code-sm text-text-muted">{finding.file}</span></td>
                    <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border flex items-center justify-between">
            <span className="text-body-sm text-text-muted">Showing 1 to 5 of 103 results</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled><ChevronLeftIcon className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" disabled><ChevronRightIcon className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}