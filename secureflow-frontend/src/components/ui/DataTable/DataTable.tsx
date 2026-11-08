'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (value: ReactNode, row: T) => ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortingState {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyAccessor: (row: T) => string;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: Partial<PaginationState>) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  rowSelection?: Set<string>;
  onRowSelectionChange?: (selection: Set<string>) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  actionsColumn?: {
    header: string;
    render: (row: T) => ReactNode;
    width?: string;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  rowSelection = new Set(),
  onRowSelectionChange,
  onRowClick,
  loading = false,
  emptyState,
  className,
  striped = false,
  hoverable = true,
  selectable = false,
  actionsColumn,
}: DataTableProps<T>) {
  const [sortConfig, _setSortConfig] = useState<SortingState | null>(sorting || null);

  const handleSort = (key: string) => {
    if (!onSortingChange) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onSortingChange({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = columns.find((c) => c.key === sortConfig.key)?.accessor(a);
      const bVal = columns.find((c) => c.key === sortConfig.key)?.accessor(b);
      if (aVal === bVal) return 0;
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns]);

  const handleSelectAll = () => {
    if (rowSelection.size === data.length) {
      onRowSelectionChange?.(new Set());
    } else {
      onRowSelectionChange?.(new Set(data.map(keyAccessor)));
    }
  };

  const handleSelectRow = (rowKey: string) => {
    const newSelection = new Set(rowSelection);
    if (newSelection.has(rowKey)) {
      newSelection.delete(rowKey);
    } else {
      newSelection.add(rowKey);
    }
    onRowSelectionChange?.(newSelection);
  };

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="data-table rounded-lg border border-border overflow-hidden">
        <table className="w-full border-collapse" role="grid">
          <thead>
            <tr className="bg-surface-1 border-b border-border">
              {selectable && (
                <th
                  className={cn(
                    'px-4 py-3 text-left text-label-xs',
                    'w-12'
                  )}
                  scope="col"
                >
                  <input
                    type="checkbox"
                    checked={rowSelection.size === data.length && data.length > 0}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = rowSelection.size > 0 && rowSelection.size < data.length;
                      }
                    }}
                    onChange={handleSelectAll}
                    className="checkbox-input w-4 h-4"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-label-xs',
                    column.align && `text-${column.align}`,
                    column.width && `w-[${column.width}]`,
                    column.minWidth && `min-w-[${column.minWidth}]`,
                    column.maxWidth && `max-w-[${column.maxWidth}]`,
                    column.headerClassName
                  )}
                  scope="col"
                  style={{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth }}
                >
                  <div className={cn('flex items-center gap-1.5', column.sortable && 'cursor-pointer select-none')}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <>
                        <span className="flex flex-col gap-0">
                          {sortConfig?.key === column.key && sortConfig.direction === 'asc' ? (
                            <ChevronUpIcon className="w-3 h-3 text-primary" />
                          ) : (
                            <ChevronUpIcon className="w-3 h-3 text-text-muted/50" />
                          )}
                          {sortConfig?.key === column.key && sortConfig.direction === 'desc' ? (
                            <ChevronDownIcon className="w-3 h-3 text-primary" />
                          ) : (
                            <ChevronDownIcon className="w-3 h-3 text-text-muted/50" />
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSort(column.key)}
                          className="p-1 rounded hover:bg-white/5 transition-colors"
                          aria-label={`Sort by ${column.header}`}
                        >
                          <span className="sr-only">Sort</span>
                        </button>
                      </>
                    )}
                  </div>
                </th>
              ))}
              {actionsColumn && (
                <th
                  className={cn(
                    'px-4 py-3 text-left text-label-xs',
                    actionsColumn.width && `w-[${actionsColumn.width}]`
                  )}
                  scope="col"
                  style={{ width: actionsColumn.width }}
                >
                  {actionsColumn.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actionsColumn ? 1 : 0)} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="spinner w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <span className="text-body-md text-text-muted">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actionsColumn ? 1 : 0)} className="py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center gap-2 text-text-muted">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-body-md">No data available</span>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const rowKey = keyAccessor(row);
                const isSelected = rowSelection.has(rowKey);
                return (
                  <tr
                    key={rowKey}
                    className={cn(
                      'border-b border-border transition-colors duration-fast',
                      striped && rowIndex % 2 === 1 && 'bg-white/5',
                      hoverable && 'hover:bg-white/5',
                      isSelected && 'bg-primary/10 border-l-2 border-l-primary',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowKey)}
                          onClick={(e) => e.stopPropagation()}
                          className="checkbox-input w-4 h-4 mx-auto"
                          aria-label={`Select row ${rowIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-3 text-body-md',
                          column.align && `text-${column.align}`,
                          column.cellClassName
                        )}
                        style={{ width: column.width, minWidth: column.minWidth, maxWidth: column.maxWidth }}
                      >
                        {column.render ? column.render(column.accessor(row), row) : column.accessor(row)}
                      </td>
                    ))}
                    {actionsColumn && (
                      <td className="px-4 py-3">
                        {actionsColumn.render(row)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {pagination && (
          <div className="pagination px-4 py-3 border-t border-border flex items-center justify-between gap-4">
            <div className="text-body-sm text-text-muted">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPaginationChange?.({ page: 1 })}
                disabled={pagination.page === 1}
                className="pagination-button p-2"
                aria-label="First page"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPaginationChange?.({ page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="pagination-button p-2"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPaginationChange?.({ page: pageNum })}
                    className={cn(
                      'pagination-button',
                      pagination.page === pageNum && 'bg-primary text-white'
                    )}
                    aria-current={pagination.page === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => onPaginationChange?.({ page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="pagination-button p-2"
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPaginationChange?.({ page: pagination.totalPages })}
                disabled={pagination.page === pagination.totalPages}
                className="pagination-button p-2"
                aria-label="Last page"
              >
                <ChevronRightIcon className="w-4 h-4" />
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}