import type { Organization, Membership } from './api';

export interface WorkspaceState {
  currentWorkspace: Organization | null;
  memberships: Membership[];
  isLoading: boolean;
  error: string | null;
}

export interface WorkspaceContext {
  organizationId: string;
  role: Membership['role'];
}