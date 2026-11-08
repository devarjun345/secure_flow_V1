export const SCAN_STATUSES = ['queued', 'running', 'completed', 'failed', 'timeout', 'flagged', 'cancelled'] as const;
export type ScanStatus = (typeof SCAN_STATUSES)[number];

export const SCAN_STATUS_LABELS: Record<ScanStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  timeout: 'Timed Out',
  flagged: 'Flagged',
  cancelled: 'Cancelled',
};

export const SCAN_TRIGGER_TYPES = ['manual', 'webhook', 'scheduled', 'api'] as const;
export type ScanTriggerType = (typeof SCAN_TRIGGER_TYPES)[number];

export const SCAN_TRIGGER_LABELS: Record<ScanTriggerType, string> = {
  manual: 'Manual',
  webhook: 'Webhook',
  scheduled: 'Scheduled',
  api: 'API',
};