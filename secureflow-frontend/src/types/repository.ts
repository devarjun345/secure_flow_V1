import type { Repository } from './api';
import type { RepositoryFilterInput } from '../lib/utils/validation';

export interface RepositoryState {
  repositories: Repository[];
  selectedRepository: Repository | null;
  isLoading: boolean;
  error: string | null;
  filters: RepositoryFilterInput;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
  onScan?: () => void;
  onSettings?: () => void;
}

export interface ConnectRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (repositoryIds: string[]) => Promise<void>;
}