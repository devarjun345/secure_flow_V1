export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown' | 'info';

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  unknown: 4,
  info: 5,
};

export const SEVERITY_COLORS: Record<Severity, { base: string; glow: string; bg: string; border: string }> = {
  critical: {
    base: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  high: {
    base: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  medium: {
    base: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.3)',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  low: {
    base: '#94A3B8',
    glow: 'transparent',
    bg: 'rgba(148, 163, 184, 0.15)',
    border: 'rgba(148, 163, 184, 0.3)',
  },
  unknown: {
    base: '#64748B',
    glow: 'transparent',
    bg: 'rgba(100, 116, 139, 0.15)',
    border: 'rgba(100, 116, 139, 0.3)',
  },
  info: {
    base: '#10B981',
    glow: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
};

export function getSeverityColor(severity: Severity): { base: string; glow: string; bg: string; border: string } {
  return SEVERITY_COLORS[severity] || SEVERITY_COLORS.unknown;
}

export function getSeverityLabel(severity: Severity): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function compareSeverity(a: Severity, b: Severity): number {
  return SEVERITY_ORDER[a] - SEVERITY_ORDER[b];
}

export function getHighestSeverity(severities: Severity[]): Severity {
  if (severities.length === 0) return 'unknown';
  const sorted = [...severities].sort(compareSeverity);
  return sorted[0] ?? 'unknown';
}