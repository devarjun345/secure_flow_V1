import type { Finding } from './api';
import type { FindingFilterInput } from '../lib/utils/validation';

export interface FindingState {
  findings: Finding[];
  selectedFinding: Finding | null;
  isLoading: boolean;
  error: string | null;
  filters: FindingFilterInput;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    unknown: number;
    info: number;
  };
}

export interface FindingDetailProps {
  finding: Finding;
  onClose: () => void;
  onStatusChange: (status: Finding['status']) => Promise<void>;
  onGeneratePR: () => Promise<void>;
}