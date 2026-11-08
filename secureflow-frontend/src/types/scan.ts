import type { Scan } from './api';
import type { ScanFilterInput } from '../lib/utils/validation';

export type { Scan, ScanFilterInput };

export interface ScanState {
  scans: Scan[];
  activeScans: Map<string, Scan>;
  selectedScan: Scan | null;
  isLoading: boolean;
  error: string | null;
  filters: ScanFilterInput;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ScanProgress {
  scanId: string;
  stage: 'clone' | 'trivy' | 'gitleaks' | 'sbom' | 'complete';
  progress: number;
  message: string;
  startedAt: string;
  eta?: number;
}

export interface ScanTelemetry {
  scanId: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  stage?: string;
}