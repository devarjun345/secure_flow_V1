'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { DataTable, type ColumnDef, type PaginationState, type SortingState } from '@/components/ui/DataTable';
import { SearchIcon, AlertTriangleIcon, ArrowRightIcon, PlayCircleIcon, ClockIcon, ExternalLinkIcon, XCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { formatDurationShort } from '@/lib/utils/format';

export interface ScanRow {
  id: string;
  repository: { name: string; owner: string; fullName: string; icon?: React.ReactNode };
  branch: string;
  commitSha: string;
  triggerType: 'manual' | 'webhook' | 'scheduled' | 'api';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'timeout' | 'flagged' | 'cancelled';
  progress: number;
  stage: 'clone' | 'trivy' | 'gitleaks' | 'sbom' | 'pending' | 'complete';
  startedAt: string;
  duration?: number;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  engines: string[];
  errorMessage?: string;
}

export interface ActiveScansTableProps {
  scans: ScanRow[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onScanClick?: (scan: ScanRow) => void;
  onViewReport?: (scan: ScanRow) => void;
  className?: string;
}

const STATUS_CONFIG = {
  queued: { label: 'Queued', severity: 'info' as const, icon: <ClockIcon className="w-3 h-3" /> },
  running: { label: 'Running', severity: 'info' as const, icon: <PlayCircleIcon className="w-3 h-3" /> },
  completed: { label: 'Completed', severity: 'low' as const, icon: <CheckCircleIcon className="w-3 h-3" /> },
  failed: { label: 'Failed', severity: 'critical' as const, icon: <XCircleIcon className="w-3 h-3" /> },
  timeout: { label: 'Timed Out', severity: 'critical' as const, icon: <ClockIcon className="w-3 h-3" /> },
  flagged: { label: 'Flagged', severity: 'high' as const, icon: <AlertTriangleIcon className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', severity: 'info' as const, icon: <XCircleIcon className="w-3 h-3" /> },
};

export function ActiveScansTable({
  scans,
  loading = false,
  emptyState,
  onScanClick,
  onViewReport,
  className,
}: ActiveScansTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [triggerFilter, setTriggerFilter] = useState<'all' | string>('all');
  const [sorting, setSorting] = useState<SortingState>({ key: 'startedAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    total: scans.length,
    totalPages: Math.ceil(scans.length / 10),
  });

  const filteredScans = useMemo(() => {
    return scans
      .filter((scan) => {
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            scan.repository.name.toLowerCase().includes(searchLower) ||
            scan.repository.owner.toLowerCase().includes(searchLower) ||
            scan.commitSha.toLowerCase().includes(searchLower) ||
            scan.stage.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter((scan) => {
        if (statusFilter !== 'all') return scan.status === statusFilter;
        return true;
      })
      .filter((scan) => {
        if (triggerFilter !== 'all') return scan.triggerType === triggerFilter;
        return true;
      })
      .sort((a, b) => {
        if (!sorting.key) return 0;
        const aVal = (a as unknown as Record<string, unknown>)[sorting.key];
        const bVal = (b as unknown as Record<string, unknown>)[sorting.key];
        if (aVal === bVal) return 0;
        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sorting.direction === 'asc' ? comparison : -comparison;
      });
  }, [scans, search, statusFilter, triggerFilter, sorting]);

  const paginatedScans = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredScans.slice(start, end);
  }, [filteredScans, pagination.page, pagination.pageSize]);

  const handleSort = useCallback((sorting: SortingState) => {
    if (sorting.key) {
      setSorting(sorting);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1, totalPages: Math.ceil(filteredScans.length / pageSize) }));
  }, [filteredScans.length]);

  const columns: ColumnDef<ScanRow>[] = useMemo(() => [
    {
      key: 'repository',
      header: 'Repository',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-code-sm text-text-primary">{row.repository.name}</span>
          <span className="text-body-sm text-text-muted">({row.repository.owner})</span>
        </div>
      ),
      sortable: true,
      minWidth: '200px',
    },
    {
      key: 'branch',
      header: 'Branch',
      accessor: (row) => (
        <Badge variant="default" size="sm">{row.branch}</Badge>
      ),
      sortable: true,
      minWidth: '100px',
    },
    {
      key: 'commitSha',
      header: 'Commit',
      accessor: (row) => (
        <span className="font-mono text-code-sm text-primary hover:underline cursor-pointer">{row.commitSha.slice(0, 7)}</span>
      ),
      sortable: true,
      minWidth: '100px',
    },
    {
      key: 'engines',
      header: 'Engines',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {row.engines.map((engine) => (
            <Badge
              key={engine}
              variant={engine === 'trivy' ? 'info' : engine === 'gitleaks' ? 'warning' : 'default'}
              size="sm"
            >
              {engine}
            </Badge>
          ))}
        </div>
      ),
      minWidth: '120px',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => {
        const config = STATUS_CONFIG[row.status];
        return (
          <SeverityBadge severity={config.severity} size="sm" showIcon />
        );
      },
      sortable: true,
      minWidth: '100px',
    },
    {
      key: 'progress',
      header: 'Progress',
      accessor: (row) => (
        <div className="w-32 h-2 rounded-full bg-surface-1 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              row.status === 'running' ? 'bg-gradient-to-r from-primary via-tertiary to-primary animate-shimmer' :
              row.status === 'completed' ? 'bg-success' : 'bg-border'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${row.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ width: `${row.progress}%` }}
          />
        </div>
      ),
      minWidth: '100px',
    },
    {
      key: 'duration',
      header: 'Duration',
      accessor: (row) => (
        <span className="font-mono text-code-sm text-text-muted">
          {row.duration ? formatDurationShort(row.duration) : '—'}
        </span>
      ),
      sortable: true,
      minWidth: '80px',
    },
    {
      key: 'findings',
      header: 'Findings',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.findings.critical > 0 && <SeverityBadge severity="critical" size="sm" showLabel={false} />}
          {row.findings.high > 0 && <SeverityBadge severity="high" size="sm" showLabel={false} />}
          {row.findings.medium > 0 && <SeverityBadge severity="medium" size="sm" showLabel={false} />}
          {row.findings.low > 0 && <SeverityBadge severity="low" size="sm" showLabel={false} />}
          {row.findings.critical === 0 && row.findings.high === 0 && row.findings.medium === 0 && row.findings.low === 0 && (
            <Badge variant="success" size="sm">Clean</Badge>
          )}
        </div>
      ),
      minWidth: '120px',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onViewReport?.(row)} aria-label="View report">
            <ExternalLinkIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onScanClick?.(row)} aria-label="View details">
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
      minWidth: '80px',
    },
  ], []);

  if (loading) {
    return (
      <div className="card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-4">
          <h3 className="text-headline-sm font-display font-semibold text-text-primary">Active Scans</h3>
        </div>
        <div className="p-4">
          <motion.div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card rounded-lg p-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-surface-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-1 rounded w-1/4" />
                  <div className="h-2 bg-surface-1 rounded w-1/2" />
                </div>
                <div className="w-32 h-2 bg-surface-1 rounded" />
                <div className="w-20 h-4 bg-surface-1 rounded" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  const filterStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'queued', label: 'Queued' },
    { value: 'running', label: 'Running' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'timeout', label: 'Timed Out' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filterTriggerOptions = [
    { value: 'all', label: 'All Triggers' },
    { value: 'manual', label: 'Manual' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'api', label: 'API' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-headline-sm font-display font-semibold text-text-primary">Active Scans</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
          <Input
            placeholder="Search scans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<SearchIcon className="w-4 h-4" />}
            className="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={filterStatusOptions}
            className="w-auto min-w-[160px]"
          />
          <Select
            value={triggerFilter}
            onValueChange={setTriggerFilter}
            options={filterTriggerOptions}
            className="w-auto min-w-[160px]"
          />
        </div>
      </div>

      <div className="card rounded-lg border border-border overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pagination.page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <DataTable
              columns={columns}
              data={paginatedScans}
              keyAccessor={(row) => row.id}
              pagination={{
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: filteredScans.length,
                totalPages: Math.ceil(filteredScans.length / pagination.pageSize),
              }}
              onPaginationChange={(changes) => {
                if (changes.page) setPagination((prev) => ({ ...prev, page: changes.page! }));
                if (changes.pageSize) handlePageSizeChange(changes.pageSize);
              }}
              sorting={sorting}
              onSortingChange={handleSort}
              rowSelection={new Set()}
              onRowClick={onScanClick}
              loading={loading}
              emptyState={emptyState}
              className="border-0"
            />
          </motion.div>
        </AnimatePresence>
        {filteredScans.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between">
            <span className="text-body-sm text-text-muted">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, filteredScans.length)} of {filteredScans.length} results
            </span>
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(filteredScans.length / pagination.pageSize)}
              totalItems={filteredScans.length}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}