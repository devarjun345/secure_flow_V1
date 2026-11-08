import { http, HttpResponse, delay } from 'msw';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://github.com/identicons/john.png',
  mfaEnabled: true,
  hardwareKeysCount: 2,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockOrganization = {
  id: 'org-1',
  name: 'SecureFlow Inc.',
  ownerId: 'user-1',
  plan: 'pro' as const,
  githubInstallationId: 12345,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockMemberships = [
  {
    id: 'mem-1',
    organizationId: 'org-1',
    userId: 'user-1',
    role: 'owner' as const,
    user: mockUser,
    joinedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'mem-2',
    organizationId: 'org-1',
    userId: 'user-2',
    role: 'admin' as const,
    user: { ...mockUser, id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
    joinedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'mem-3',
    organizationId: 'org-1',
    userId: 'user-3',
    role: 'member' as const,
    user: { ...mockUser, id: 'user-3', name: 'Bob Wilson', email: 'bob@example.com' },
    joinedAt: '2024-02-01T10:00:00Z',
  },
];

const mockRepositories = [
  {
    id: 'repo-1',
    organizationId: 'org-1',
    githubRepoId: 123456789,
    owner: 'secureflow',
    name: 'secureflow-frontend',
    fullName: 'secureflow/secureflow-frontend',
    description: 'SecureFlow frontend application',
    defaultBranch: 'main',
    language: 'TypeScript',
    stars: 42,
    forks: 12,
    enabled: true,
    lastScannedAt: '2024-01-20T14:30:00Z',
    vulnerabilityCounts: { critical: 2, high: 5, medium: 12, low: 8 },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'repo-2',
    organizationId: 'org-1',
    githubRepoId: 123456790,
    owner: 'secureflow',
    name: 'secureflow-backend',
    fullName: 'secureflow/secureflow-backend',
    description: 'SecureFlow backend API',
    defaultBranch: 'main',
    language: 'Python',
    stars: 38,
    forks: 8,
    enabled: true,
    lastScannedAt: '2024-01-20T12:15:00Z',
    vulnerabilityCounts: { critical: 0, high: 3, medium: 7, low: 4 },
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-20T12:15:00Z',
  },
  {
    id: 'repo-3',
    organizationId: 'org-1',
    githubRepoId: 123456791,
    owner: 'secureflow',
    name: 'secureflow-worker',
    fullName: 'secureflow/secureflow-worker',
    description: 'SecureFlow scanning worker',
    defaultBranch: 'main',
    language: 'Python',
    stars: 15,
    forks: 3,
    enabled: false,
    lastScannedAt: undefined,
    vulnerabilityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
];

const mockScans = [
  {
    id: 'scan-1',
    organizationId: 'org-1',
    repositoryId: 'repo-1',
    commitSha: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    branch: 'main',
    triggerType: 'webhook' as const,
    status: 'completed' as const,
    startedAt: '2024-01-20T14:30:00Z',
    completedAt: '2024-01-20T14:35:00Z',
    duration: 300000,
    summary: { total: 27, critical: 2, high: 5, medium: 12, low: 8, info: 0 },
    engines: ['trivy', 'gitleaks'],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:35:00Z',
  },
  {
    id: 'scan-2',
    organizationId: 'org-1',
    repositoryId: 'repo-1',
    commitSha: 'f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1',
    branch: 'develop',
    triggerType: 'manual' as const,
    status: 'running' as const,
    startedAt: '2024-01-20T15:00:00Z',
    completedAt: undefined,
    duration: undefined,
    summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    engines: ['trivy', 'gitleaks'],
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 'scan-3',
    organizationId: 'org-1',
    repositoryId: 'repo-2',
    commitSha: 'b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
    branch: 'main',
    triggerType: 'scheduled' as const,
    status: 'failed' as const,
    startedAt: '2024-01-19T10:00:00Z',
    completedAt: '2024-01-19T10:02:00Z',
    duration: 120000,
    summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    engines: ['trivy'],
    errorMessage: 'Trivy scan timeout',
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:02:00Z',
  },
];

const mockFindings = [
  {
    id: 'finding-1',
    organizationId: 'org-1',
    repositoryId: 'repo-1',
    scanId: 'scan-1',
    fingerprint: 'sha256:abc123...',
    severity: 'critical' as const,
    category: 'dependency' as const,
    title: 'CVE-2024-1234: Remote Code Execution in lodash',
    description: 'Prototype pollution vulnerability in lodash versions prior to 4.17.21 allows remote code execution.',
    filePath: 'package-lock.json',
    lineStart: 45,
    lineEnd: 45,
    codeSnippet: '"lodash": "4.17.20"',
    cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    cvssScore: 9.8,
    cweIds: ['CWE-1321'],
    cveIds: ['CVE-2024-1234'],
    packageName: 'lodash',
    packageVersion: '4.17.20',
    fixedVersion: '4.17.21',
    engine: 'trivy' as const,
    ruleId: 'CVE-2024-1234',
    status: 'open' as const,
    assigneeId: undefined,
    firstSeen: '2024-01-20T14:35:00Z',
    lastSeen: '2024-01-20T14:35:00Z',
    createdAt: '2024-01-20T14:35:00Z',
    updatedAt: '2024-01-20T14:35:00Z',
  },
  {
    id: 'finding-2',
    organizationId: 'org-1',
    repositoryId: 'repo-1',
    scanId: 'scan-1',
    fingerprint: 'sha256:def456...',
    severity: 'high' as const,
    category: 'secret' as const,
    title: 'AWS Access Key detected in config file',
    description: 'An AWS access key was found in the configuration file. This could allow unauthorized access to AWS resources.',
    filePath: 'config/aws.json',
    lineStart: 12,
    lineEnd: 12,
    codeSnippet: '"accessKeyId": "AKIAIOSFODNN7EXAMPLE"',
    cvssVector: undefined,
    cvssScore: undefined,
    cweIds: ['CWE-798'],
    cveIds: [],
    packageName: undefined,
    packageVersion: undefined,
    fixedVersion: undefined,
    engine: 'gitleaks' as const,
    ruleId: 'aws-access-key',
    status: 'open' as const,
    assigneeId: undefined,
    firstSeen: '2024-01-20T14:35:00Z',
    lastSeen: '2024-01-20T14:35:00Z',
    createdAt: '2024-01-20T14:35:00Z',
    updatedAt: '2024-01-20T14:35:00Z',
  },
];

const mockDashboardOverview = {
  monitoredRepositories: 12,
  totalScans: 156,
  criticalCVEs: 8,
  leakedSecrets: 3,
  securityHealthScore: 72,
  healthBreakdown: {
    dependencies: 65,
    secrets: 80,
    iac: 90,
    policy: 75,
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'scan_completed' as const,
      title: 'Scan completed for secureflow-frontend',
      description: 'Found 2 critical, 5 high, 12 medium, 8 low vulnerabilities',
      severity: 'critical' as const,
      repository: { id: 'repo-1', name: 'secureflow-frontend' },
      actor: { id: 'user-1', name: 'GitHub Webhook', avatarUrl: 'https://github.com/github.png' },
      timestamp: '2024-01-20T14:35:00Z',
    },
    {
      id: 'act-2',
      type: 'vulnerability_found' as const,
      title: 'New critical vulnerability in lodash',
      description: 'CVE-2024-1234 detected in secureflow-frontend',
      severity: 'critical' as const,
      repository: { id: 'repo-1', name: 'secureflow-frontend' },
      actor: { id: 'system', name: 'Trivy Scanner', avatarUrl: 'https://github.com/trivy.png' },
      timestamp: '2024-01-20T14:35:00Z',
    },
    {
      id: 'act-3',
      type: 'repository_connected' as const,
      title: 'Repository connected: secureflow-worker',
      description: 'Monitoring enabled for secureflow-worker',
      severity: 'info' as const,
      repository: { id: 'repo-3', name: 'secureflow-worker' },
      actor: { id: 'user-1', name: 'John Doe', avatarUrl: 'https://github.com/identicons/john.png' },
      timestamp: '2024-01-18T10:00:00Z',
    },
  ],
  severityTrend: [
    { date: '2024-01-01', ingested: 45, mitigated: 30 },
    { date: '2024-01-08', ingested: 52, mitigated: 38 },
    { date: '2024-01-15', ingested: 38, mitigated: 42 },
    { date: '2024-01-22', ingested: 27, mitigated: 45 },
  ],
};

export const handlers = [
  http.post(API_ENDPOINTS.auth.login, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string } | null;
    if (!body || body.email !== 'demo@secureflow.io' || body.password !== 'demo1234') {
      return HttpResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      user: mockUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    });
  }),

  http.post(API_ENDPOINTS.auth.register, async ({ request }) => {
    await delay(800);
    const body = (await request.json()) as { name: string; email: string; organizationName: string; password: string; confirmPassword: string };
    return HttpResponse.json({
      user: { ...mockUser, name: body.name, email: body.email },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
    });
  }),

  http.post(API_ENDPOINTS.auth.refresh, async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.includes('mock-refresh-token')) {
      return HttpResponse.json({
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      });
    }
    return HttpResponse.json({ code: 'INVALID_TOKEN', message: 'Invalid refresh token' }, { status: 401 });
  }),

  http.get(API_ENDPOINTS.auth.me, async ({ request }) => {
    await delay(200);
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.includes('mock-access-token')) {
      return HttpResponse.json(mockUser);
    }
    return HttpResponse.json({ code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
  }),

  http.post(API_ENDPOINTS.auth.logout, async () => {
    await delay(200);
    return HttpResponse.json({ success: true });
  }),

  http.get(API_ENDPOINTS.organizations.list, async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.includes('mock-access-token')) {
      return HttpResponse.json([mockOrganization]);
    }
    return HttpResponse.json({ code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
  }),

  http.get(API_ENDPOINTS.organizations.members(':id'), async () => {
    await delay(300);
    return HttpResponse.json(mockMemberships);
  }),

  http.post(API_ENDPOINTS.organizations.inviteMember(':id'), async ({ request, params }) => {
    await delay(500);
    const body = (await request.json()) as { role: string; email: string };
    const newMember = {
      id: `mem-${Date.now()}`,
      organizationId: params.id,
      userId: `user-${Date.now()}`,
      role: body.role,
      user: { ...mockUser, id: `user-${Date.now()}`, email: body.email },
      joinedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newMember);
  }),

  http.patch(API_ENDPOINTS.organizations.updateMember(':id', ':userId'), async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { role: string };
    return HttpResponse.json({ success: true, role: body.role });
  }),

  http.delete(API_ENDPOINTS.organizations.removeMember(':id', ':userId'), async () => {
    await delay(500);
    return HttpResponse.json({ success: true });
  }),

  http.get(API_ENDPOINTS.repositories.list, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedRepos = mockRepositories.slice(start, end);
    return HttpResponse.json({
      data: paginatedRepos,
      meta: { page, limit, total: mockRepositories.length, totalPages: Math.ceil(mockRepositories.length / limit) },
    });
  }),

  http.get(API_ENDPOINTS.repositories.detail(':id'), async ({ params }) => {
    await delay(300);
    const repo = mockRepositories.find((r) => r.id === params.id);
    if (!repo) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Repository not found' }, { status: 404 });
    }
    return HttpResponse.json(repo);
  }),

  http.get(API_ENDPOINTS.scans.list, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedScans = mockScans.slice(start, end);
    return HttpResponse.json({
      data: paginatedScans,
      meta: { page, limit, total: mockScans.length, totalPages: Math.ceil(mockScans.length / limit) },
    });
  }),

  http.post(API_ENDPOINTS.scans.create, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { repositoryId: string; branch?: string };
    const newScan = {
      id: `scan-${Date.now()}`,
      organizationId: 'org-1',
      repositoryId: body.repositoryId,
      commitSha: 'mock-sha-' + Date.now(),
      branch: body.branch || 'main',
      triggerType: 'manual' as const,
      status: 'queued' as const,
      startedAt: undefined,
      completedAt: undefined,
      duration: undefined,
      summary: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
      engines: ['trivy', 'gitleaks'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newScan);
  }),

  http.get(API_ENDPOINTS.scans.detail(':id'), async ({ params }) => {
    await delay(300);
    const scan = mockScans.find((s) => s.id === params.id);
    if (!scan) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Scan not found' }, { status: 404 });
    }
    return HttpResponse.json(scan);
  }),

  http.get(API_ENDPOINTS.findings.list, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedFindings = mockFindings.slice(start, end);
    return HttpResponse.json({
      data: paginatedFindings,
      meta: { page, limit, total: mockFindings.length, totalPages: Math.ceil(mockFindings.length / limit) },
    });
  }),

  http.get(API_ENDPOINTS.dashboard.overview, async () => {
    await delay(500);
    return HttpResponse.json(mockDashboardOverview);
  }),

  http.get(API_ENDPOINTS.github.installations, async () => {
    await delay(300);
    return HttpResponse.json([{
      id: 12345,
      organizationId: 'org-1',
      accountName: 'secureflow',
      accountAvatarUrl: 'https://github.com/secureflow.png',
      repositoriesCount: 15,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }]);
  }),

  http.get(API_ENDPOINTS.github.repositories, async () => {
    await delay(400);
    return HttpResponse.json(mockRepositories.map((r) => ({
      id: r.githubRepoId,
      name: r.name,
      fullName: r.fullName,
      private: false,
      defaultBranch: r.defaultBranch,
      language: r.language,
    })));
  }),

  http.post(API_ENDPOINTS.github.connect, async ({ request }) => {
    await delay(800);
    const body = (await request.json()) as { repositoryIds: string[] };
    return HttpResponse.json({ success: true, connected: body.repositoryIds.length });
  }),
];

export const worker = { handlers };