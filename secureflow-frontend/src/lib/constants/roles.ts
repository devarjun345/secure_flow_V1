export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner: [
    'workspace:read',
    'workspace:write',
    'workspace:delete',
    'members:read',
    'members:invite',
    'members:update',
    'members:remove',
    'members:manage_roles',
    'repositories:read',
    'repositories:connect',
    'repositories:disconnect',
    'repositories:scan',
    'scans:read',
    'scans:trigger',
    'scans:cancel',
    'findings:read',
    'findings:update_status',
    'findings:manage',
    'settings:read',
    'settings:write',
    'settings:danger',
    'reports:read',
    'reports:generate',
    'audit:read',
    'integrations:manage',
  ],
  admin: [
    'workspace:read',
    'workspace:write',
    'members:read',
    'members:invite',
    'members:update',
    'members:remove',
    'repositories:read',
    'repositories:connect',
    'repositories:disconnect',
    'repositories:scan',
    'scans:read',
    'scans:trigger',
    'scans:cancel',
    'findings:read',
    'findings:update_status',
    'findings:manage',
    'settings:read',
    'settings:write',
    'reports:read',
    'reports:generate',
    'audit:read',
    'integrations:manage',
  ],
  member: [
    'workspace:read',
    'members:read',
    'repositories:read',
    'repositories:scan',
    'scans:read',
    'scans:trigger',
    'findings:read',
    'findings:update_status',
    'reports:read',
    'audit:read',
  ],
  viewer: [
    'workspace:read',
    'members:read',
    'repositories:read',
    'scans:read',
    'findings:read',
    'reports:read',
    'audit:read',
  ],
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canManageRole(currentRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[currentRole] > ROLE_HIERARCHY[targetRole];
}

export function getRoleLabel(role: Role): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case 'owner':
      return '#8B5CF6';
    case 'admin':
      return '#3B82F6';
    case 'member':
      return '#10B981';
    case 'viewer':
      return '#94A3B8';
  }
}