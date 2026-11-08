export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  mfaEnabled: boolean;
  hardwareKeysCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  plan: 'free' | 'pro' | 'enterprise';
  githubInstallationId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user: User;
  joinedAt: string;
}

export interface GitHubInstallation {
  id: number;
  organizationId: string;
  accountName: string;
  accountAvatarUrl: string;
  repositoriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  organizationId: string;
  githubRepoId: number;
  owner: string;
  name: string;
  fullName: string;
  description?: string;
  defaultBranch: string;
  language?: string;
  stars: number;
  forks: number;
  enabled: boolean;
  lastScannedAt?: string;
  vulnerabilityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: string;
  organizationId: string;
  repositoryId: string;
  commitSha: string;
  branch: string;
  triggerType: 'manual' | 'webhook' | 'scheduled' | 'api';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'timeout' | 'flagged' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  engines: string[];
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Finding {
  id: string;
  organizationId: string;
  repositoryId: string;
  scanId: string;
  fingerprint: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown' | 'info';
  category: 'dependency' | 'secret' | 'iac' | 'policy' | 'container';
  title: string;
  description: string;
  filePath?: string;
  lineStart?: number;
  lineEnd?: number;
  codeSnippet?: string;
  cvssVector?: string;
  cvssScore?: number;
  cweIds: string[];
  cveIds: string[];
  packageName?: string;
  packageVersion?: string;
  fixedVersion?: string;
  engine: 'trivy' | 'gitleaks' | 'semgrep' | 'checkov';
  ruleId: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'accepted_risk' | 'false_positive';
  assigneeId?: string;
  firstSeen: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  monitoredRepositories: number;
  totalScans: number;
  criticalCVEs: number;
  leakedSecrets: number;
  securityHealthScore: number;
  healthBreakdown: {
    dependencies: number;
    secrets: number;
    iac: number;
    policy: number;
  };
  recentActivity: ActivityEvent[];
  severityTrend: TrendPoint[];
}

export interface ActivityEvent {
  id: string;
  type: 'scan_completed' | 'vulnerability_found' | 'repository_connected' | 'member_invited' | 'secret_detected' | 'policy_violation';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  repository?: {
    id: string;
    name: string;
  };
  actor: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
}

export interface TrendPoint {
  date: string;
  ingested: number;
  mitigated: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}