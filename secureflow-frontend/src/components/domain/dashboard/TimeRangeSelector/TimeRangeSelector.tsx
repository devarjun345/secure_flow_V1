'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CalendarIcon } from 'lucide-react';

export type TimeRange = '24h' | '7d' | '30d' | 'custom';

export interface TimeRangeSelectorProps {
  value?: TimeRange;
  onChange?: (value: TimeRange) => void;
  className?: string;
  syncWithUrl?: boolean;
  customRange?: { start: Date; end: Date };
  onCustomRangeChange?: (range: { start: Date; end: Date }) => void;
}

const TIME_RANGES: { value: TimeRange; label: string; description: string }[] = [
  { value: '24h', label: '24h', description: 'Last 24 hours' },
  { value: '7d', label: '7d', description: 'Last 7 days' },
  { value: '30d', label: '30d', description: 'Last 30 days' },
  { value: 'custom', label: 'Custom', description: 'Custom date range' },
];

export function TimeRangeSelector({
  value: controlledValue,
  onChange,
  className,
  syncWithUrl = true,
  customRange,
  onCustomRangeChange,
}: TimeRangeSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [internalValue, setInternalValue] = useState<TimeRange>(
    controlledValue || (searchParams.get('timerange') as TimeRange) || '30d'
  );
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customStart, setCustomStart] = useState<Date>(
    customRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [customEnd, setCustomEnd] = useState<Date>(
    customRange?.end || new Date()
  );

  const currentValue = controlledValue ?? internalValue;

  const handleValueChange = useCallback(
    (newValue: TimeRange) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);

      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams);
        if (newValue === 'custom') {
          params.delete('timerange');
        } else {
          params.set('timerange', newValue);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [controlledValue, onChange, searchParams, pathname, router, syncWithUrl]
  );

  useEffect(() => {
    if (syncWithUrl) {
      const urlRange = searchParams.get('timerange') as TimeRange | null;
      if (urlRange && urlRange !== internalValue) {
        setInternalValue(urlRange);
      }
    }
  }, [searchParams, syncWithUrl, internalValue]);

  const handleCustomRangeSubmit = () => {
    onCustomRangeChange?.({ start: customStart, end: customEnd });
    setIsCustomOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className={cn('flex items-center gap-1', className)} role="group" aria-label="Time range selector">
      {TIME_RANGES.map((range) => (
        <Button
          key={range.value}
          variant={currentValue === range.value ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleValueChange(range.value)}
          className={cn(
            'whitespace-nowrap',
            range.value === 'custom' && 'hidden sm:inline-flex'
          )}
          aria-pressed={currentValue === range.value}
        >
          {range.value === 'custom' ? (
            <>
              <CalendarIcon className="w-4 h-4" aria-hidden="true" />
              <span>Custom</span>
            </>
          ) : (
            range.label
          )}
        </Button>
      ))}
      {currentValue === 'custom' && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 z-50 w-64 rounded-lg p-4',
            'bg-surface-1 border border-border-strong shadow-elevated',
            'animate-slide-up-fade'
          )}
          role="dialog"
          aria-label="Custom date range"
        >
          <div className="space-y-3">
            <p className="text-label-md text-text-primary">Custom Date Range</p>
            <div className="space-y-2">
              <label className="block text-body-sm text-text-muted">Start Date</label>
              <input
                type="date"
                value={formatDate(customStart)}
                onChange={(e) => setCustomStart(new Date(e.target.value))}
                max={formatDate(new Date())}
                className="input-field w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-body-sm text-text-muted">End Date</label>
              <input
                type="date"
                value={formatDate(customEnd)}
                onChange={(e) => setCustomEnd(new Date(e.target.value))}
                max={formatDate(new Date())}
                className="input-field w-full"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsCustomOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCustomRangeSubmit}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TimeRangeDisplay({ value, className }: { value: TimeRange; className?: string }) {
  const labels: Record<TimeRange, string> = {
    '24h': 'Last 24 hours',
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    custom: 'Custom range',
  };

  return (
    <span className={cn('text-body-sm text-text-muted', className)}>
      {labels[value]}
    </span>
  );
}