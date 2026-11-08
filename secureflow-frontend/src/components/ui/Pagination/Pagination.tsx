'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  className,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= boundaryCount * 2 + siblingCount * 2 + 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const leftBoundary = Math.min(boundaryCount, totalPages);
    const rightBoundary = Math.max(totalPages - boundaryCount + 1, 1);

    const leftSiblingStart = Math.max(leftBoundary + 1, currentPage - siblingCount);
    const leftSiblingEnd = Math.min(currentPage - 1, totalPages);
    const rightSiblingStart = Math.max(currentPage + 1, 1);
    const rightSiblingEnd = Math.min(rightBoundary - 1, currentPage + siblingCount);

    for (let i = 1; i <= leftBoundary; i++) {
      pages.push(i);
    }

    if (leftSiblingStart > leftBoundary + 1) {
      pages.push('ellipsis');
    }

    for (let i = leftSiblingStart; i <= leftSiblingEnd; i++) {
      pages.push(i);
    }

    pages.push(currentPage);

    for (let i = rightSiblingStart; i <= rightSiblingEnd; i++) {
      pages.push(i);
    }

    if (rightSiblingEnd < rightBoundary - 1) {
      pages.push('ellipsis');
    }

    for (let i = rightBoundary; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  return (
    <div className={cn('pagination flex items-center justify-between gap-4 flex-wrap', className)}>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-body-sm text-text-muted">
          Showing <span className="font-mono">{startItem}</span> to{' '}
          <span className="font-mono">{endItem}</span> of{' '}
          <span className="font-mono">{totalItems}</span> results
        </div>
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-body-sm text-text-muted">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="input-field w-auto py-1.5 pl-2 pr-8 text-body-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button p-1.5"
          aria-label="First page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button p-1.5"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="pagination-button px-2 text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'pagination-button min-w-[36px]',
                currentPage === page && 'bg-primary text-white'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button p-1.5"
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button p-1.5"
          aria-label="Last page"
        >
          <ChevronRightIcon className="w-4 h-4" />
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}