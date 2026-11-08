import type { Membership } from './api';
import type { Role } from '../lib/constants/roles';

export interface TeamState {
  members: Membership[];
  invitations: Invitation[];
  auditEvents: AuditEvent[];
  isLoading: boolean;
  error: string | null;
}

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  githubHandle?: string;
  role: Role;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
}

export interface AuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface InviteMemberData {
  email: string;
  githubHandle?: string;
  role: Role;
  requireHardware2FA: boolean;
}