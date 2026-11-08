export const SEVERITIES = ['critical', 'high', 'medium', 'low', 'unknown', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SEVERITY_LABELS: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unknown: 'Unknown',
  info: 'Info',
};

export const SEVERITY_SLA_HOURS: Record<Severity, number> = {
  critical: 24,
  high: 72,
  medium: 168,
  low: 720,
  unknown: 0,
  info: 0,
};