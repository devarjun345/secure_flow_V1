# FRONTEND_ARCHITECTURE.md
## SecureFlow — Frontend Architecture Planning

---

## 1. Complete Route Structure

Based on Stitch designs and PRD information architecture:

```
/                                    → Landing Page (Public)
/login                               → Sign In (with GitHub Enterprise SSO)
/register                            → Create Account
/forgot-password                     → Reset Hardware Credential
/dashboard                           → Security Operations Center (Main Dashboard)
/repositories                        → Repository Management (List + Connect)
/repositories/:repoId                → Repository Detail (findings summary, last scan)
/scan-center                         → Scan Center (Real-time orchestration)
/scans                               → Scan History (List with filters)
/scans/:scanId                       → Scan Detail (status, duration, summary)
/scans/:scanId/findings              → Findings for specific scan
/findings                            → Vulnerability Management (Global findings search)
/findings/:findingId                 → Finding Detail (evidence, location, remediation)
/reports/:reportId                   → Executive Security Audit Report
/settings                            → Settings & Security Configuration
  /settings/account                  → Account Security & 2FA (Hardware keys, TOTP, Backup codes)
  /settings/github                   → GitHub Integration & CI/CD (App status, automation toggles)
  /settings/notifications            → Notification Preferences (Slack, PagerDuty, Email)
  /settings/scanner                  → Workspace Policies & Rules (CVSS threshold, Gitleaks allowlist)
  /settings/danger                   → Danger Zone (Disconnect org, Transfer ownership, Purge data)
/team                                → Team & Workspace Access Control
  /team/members                      → Members table (RBAC, MFA, Last active)
  /team/invitations                  → Pending invitations
  /team/audit                        → Workspace audit trail
/account                             → Account Profile & Security Settings
```

### Route Guards
- Public routes: `/`, `/login`, `/register`, `/forgot-password`
- Protected routes: All others require authentication
- Role-based access: Owner/Admin for settings danger zone, repo management

---

## 2. Recommended Folder Structure

```
src/
├── app/                          # Next.js App Router pages (or React Router)
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Authenticated layout group
│   │   ├── dashboard/
│   │   ├── repositories/
│   │   │   ├── [repoId]/
│   │   │   └── connect/
│   │   ├── scan-center/
│   │   ├── scans/
│   │   │   └── [scanId]/
│   │   │       └── findings/
│   │   ├── findings/
│   │   │   └── [findingId]/
│   │   ├── reports/
│   │   │   └── [reportId]/
│   │   ├── settings/
│   │   │   ├── account/
│   │   │   ├── github/
│   │   │   ├── notifications/
│   │   │   ├── scanner/
│   │   │   └── danger/
│   │   ├── team/
│   │   │   ├── members/
│   │   │   ├── invitations/
│   │   │   └── audit/
│   │   └── account/
│   └── layout.tsx                # Root layout with providers
├── components/
│   ├── ui/                       # Design system primitives (atomic)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Table/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   ├── Tooltip/
│   │   ├── Avatar/
│   │   ├── Progress/
│   │   ├── RadialGauge/
│   │   ├── CodeBlock/
│   │   ├── ScanProgressBar/
│   │   ├── SeverityBadge/
│   │   ├── StatusPill/
│   │   ├── Switch/
│   │   ├── Tabs/
│   │   ├── Dropdown/
│   │   ├── SearchInput/
│   │   ├── Pagination/
│   │   ├── Skeleton/
│   │   └── EmptyState/
│   ├── layout/                   # Layout components (molecular)
│   │   ├── Sidebar/
│   │   ├── TopNav/
│   │   ├── PageHeader/
│   │   ├── KPIStrip/
│   │   ├── MetricCard/
│   │   ├── DataTable/
│   │   ├── FilterToolbar/
│   │   ├── ActionBar/
│   │   ├── Breadcrumb/
│   │   └── SectionCard/
│   ├── domain/                   # Business logic components (organisms)
│   │   ├── auth/
│   │   │   ├── SignInForm/
│   │   │   ├── SignUpForm/
│   │   │   ├── ForgotPasswordForm/
│   │   │   ├── SSOButton/
│   │   │   └── PasswordStrength/
│   │   ├── dashboard/
│   │   │   ├── SecurityHealthGauge/
│   │   │   ├── VulnerabilityMatrix/
│   │   │   ├── ActiveScansTable/
│   │   │   ├── LiveAuditStream/
│   │   │   ├── CveSpotlight/
│   │   │   └── TimeRangeSelector/
│   │   ├── repositories/
│   │   │   ├── RepositoryCard/
│   │   │   ├── RepositoryGrid/
│   │   │   ├── ConnectRepositoryModal/
│   │   │   ├── RepoFilterToolbar/
│   │   │   └── RepoSummaryCounters/
│   │   ├── scan-center/
│   │   │   ├── ScanTriggerBar/
│   │   │   ├── ActiveScanHero/
│   │   │   ├── PipelineNodesMatrix/
│   │   │   ├── TelemetryTerminal/
│   │   │   ├── ScanMetricsStrip/
│   │   │   └── ScanHistoryTable/
│   │   ├── findings/
│   │   │   ├── FindingsStream/
│   │   │   ├── FindingCard/
│   │   │   ├── FindingDetailPanel/
│   │   │   ├── CvssVectorRibbon/
│   │   │   ├── RemediationPlaybook/
│   │   │   ├── FindingFilters/
│   │   │   └── SeverityDistribution/
│   │   ├── reports/
│   │   │   ├── ReportHeader/
│   │   │   ├── SecurityScoreCard/
│   │   │   ├── SeverityBreakdown/
│   │   │   ├── FindingsTable/
│   │   │   ├── EngineTabs/
│   │   │   ├── SbomSummary/
│   │   │   └── ComplianceSignoff/
│   │   ├── settings/
│   │   │   ├── SettingsNav/
│   │   │   ├── HardwareKeyCard/
│   │   │   ├── AuthenticatorCard/
│   │   │   ├── BackupCodesCard/
│   │   │   ├── SessionTimeoutSelect/
│   │   │   ├── GitHubIntegrationCard/
│   │   │   ├── PipelineToggles/
│   │   │   ├── SlackIntegrationCard/
│   │   │   ├── PagerDutyIntegrationCard/
│   │   │   ├── EmailBriefingCard/
│   │   │   ├── CvssThresholdSlider/
│   │   │   ├── GitleaksAllowlistEditor/
│   │   │   ├── DangerActionCard/
│   │   │   ├── FloatingSaveBar/
│   │   │   └── ConfirmModal/
│   │   ├── team/
│   │   │   ├── MembersTable/
│   │   │   ├── MemberRow/
│   │   │   ├── InvitationsList/
│   │   │   ├── InviteModal/
│   │   │   ├── QuickInviteForm/
│   │   │   ├── AuditTrail/
│   │   │   └── SummaryCards/
│   │   └── scan-detail/
│   │       ├── ScanStatusBadge/
│   │       ├── EngineManifest/
│   │       └── ScanMetaPanel/
│   └── feedback/                 # Feedback components
│       ├── ToastContainer/
│       ├── LoadingSkeleton/
│       └── ErrorBoundary/
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useWorkspaces.ts
│   ├── useRepositories.ts
│   ├── useScans.ts
│   ├── useFindings.ts
│   ├── useTeam.ts
│   ├── useSettings.ts
│   ├── useWebSocket.ts           # For real-time telemetry
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
├── lib/                          # Utilities & configuration
│   ├── api/
│   │   ├── client.ts             # Axios/Fetch wrapper with interceptors
│   │   ├── endpoints.ts          # API endpoint constants
│   │   ├── auth.ts               # Auth API calls
│   │   ├── workspaces.ts
│   │   ├── repositories.ts
│   │   ├── scans.ts
│   │   ├── findings.ts
│   │   ├── team.ts
│   │   └── settings.ts
│   ├── auth/
│   │   ├── token.ts              # Token storage/refresh
│   │   ├── guards.ts             # Route guards
│   │   └── permissions.ts        # Role-based permissions
│   ├── utils/
│   │   ├── format.ts             # Date, duration, number formatting
│   │   ├── severity.ts           # Severity color/label helpers
│   │   ├── cvss.ts               # CVSS vector parsing
│   │   ├── validation.ts         # Form validation schemas (Zod)
│   │   └── cn.ts                 # clsx/tailwind-merge helper
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   ├── severities.ts
│   │   ├── scanStatuses.ts
│   │   └── findingCategories.ts
│   └── design-tokens/
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       ├── borderRadius.ts
│       ├── shadows.ts
│       └── animations.ts
├── store/                        # State management (Zustand/Redux)
│   ├── authStore.ts
│   ├── workspaceStore.ts
│   ├── uiStore.ts                # Modals, toasts, sidebar state
│   └── scanStore.ts              # Real-time scan updates
├── types/                        # TypeScript types (mirroring API schemas)
│   ├── api.ts
│   ├── user.ts
│   ├── workspace.ts
│   ├── repository.ts
│   ├── scan.ts
│   ├── finding.ts
│   ├── team.ts
│   └── settings.ts
├── styles/
│   ├── globals.css               # Tailwind imports + CSS variables
│   └── theme.css                 # Design token CSS custom properties
└── middleware.ts                 # Auth middleware for route protection
```

---

## 3. Reusable Component Architecture

### 3.1 Atomic Design Hierarchy

```
Atoms (ui/)           → Button, Input, Badge, Avatar, Checkbox, Radio, Switch, Icon
Molecules (layout/)   → SearchInput, FilterToolbar, KPIStrip, MetricCard, Tabs, Dropdown
Organisms (domain/)   → RepositoryCard, FindingCard, PipelineNodesMatrix, SecurityHealthGauge
Templates (app/)      → DashboardLayout, SettingsLayout, AuthLayout
Pages (app/)          → DashboardPage, RepositoriesPage, FindingsPage, etc.
```

### 3.2 Component Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Composition over inheritance** | Use `className` + `children` props; avoid deep prop drilling |
| **Type-safe props** | All components exported with TypeScript interfaces |
| **Design token driven** | No hardcoded colors/spacing; use design token imports |
| **Accessibility first** | ARIA attributes, keyboard navigation, focus management |
| **Responsive by default** | Mobile-first Tailwind classes; breakpoint-aware |
| **Controlled + uncontrolled** | Support both patterns for forms |
| **Compound components** | For complex UI (Tabs, Select, Modal) |

### 3.3 Key Reusable Components

#### `Button` (Atoms)
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

#### `SeverityBadge` (Atoms)
```tsx
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}
```

#### `DataTable` (Molecules)
```tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: PaginationState;
  sorting?: SortingState;
  filtering?: FilterState;
  rowSelection?: RowSelectionState;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: ReactNode;
}
```

#### `ScanProgressBar` (Atoms)
- Animated gradient bar with percentage
- Supports indeterminate (pulse) and determinate states
- Color-coded by scan stage

#### `RadialGauge` (Atoms)
- SVG-based concentric rings
- Animated progress arc
- Center value display with label

#### `CodeBlock` (Atoms)
- Monospace (JetBrains Mono) with line numbers
- Syntax highlighting (Prism/Shiki)
- Diff view support (added/removed lines)
- Secret redaction rendering

#### `TelemetryTerminal` (Organisms)
- Real-time log streaming via WebSocket
- Color-coded log levels (error, warning, info, success)
- Auto-scroll with manual override
- Clear/reset functionality

---

## 4. Design System Architecture

### 4.1 Color System (CSS Custom Properties)

```css
:root {
  /* Base Canvas */
  --color-canvas: #080B14;
  --color-surface-1: #0D1220;
  --color-surface-2: #111827;
  --color-surface-3: #1C1F29;

  /* Brand Accents */
  --color-primary: #3B82F6;        /* Electric Blue */
  --color-primary-glow: rgba(59, 130, 246, 0.4);
  --color-secondary: #8B5CF6;      /* Cyber Violet */
  --color-tertiary: #10B981;       /* Emerald */

  /* Threat Statuses */
  --color-critical: #EF4444;       /* Crimson */
  --color-warning: #F59E0B;        /* Amber */
  --color-success: #10B981;        /* Emerald */
  --color-info: #3B82F6;           /* Electric Blue */

  /* Typography */
  --color-text-primary: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-text-code: #E0E2EF;

  /* Borders */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-strong: #1E293B;

  /* Focus */
  --color-focus-ring: #3B82F6;
  --color-focus-glow: rgba(59, 130, 246, 0.3);
}
```

### 4.2 Typography Scale

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|-------|------|------|--------|-------------|----------------|
| `display-xl` | Geist | 56px | 700 | 64px | -0.03em |
| `headline-lg` | Geist | 36px | 600 | 44px | -0.02em |
| `headline-md` | Geist | 24px | 600 | 32px | -0.015em |
| `headline-sm` | Geist | 18px | 600 | 26px | -0.01em |
| `body-lg` | Inter | 16px | 400 | 24px | -0.005em |
| `body-md` | Inter | 14px | 400 | 20px | 0em |
| `body-sm` | Inter | 12px | 400 | 18px | 0.01em |
| `code-lg` | JetBrains Mono | 14px | 500 | 20px | -0.01em |
| `code-md` | JetBrains Mono | 12px | 400 | 18px | 0em |
| `code-sm` | JetBrains Mono | 11px | 400 | 16px | 0.02em |
| `label-md` | Inter | 12px | 600 | 16px | 0.04em |
| `label-xs` | JetBrains Mono | 10px | 700 | 14px | 0.08em |

### 4.3 Spacing System

| Token | Value | Use Case |
|-------|-------|----------|
| `space-xs` | 0.25rem (4px) | Tight node links, icon gaps |
| `space-sm` | 0.5rem (8px) | Related elements, internal padding |
| `space-md` | 1rem (16px) | Card internal spacing |
| `space-lg` | 1.5rem (24px) | Inter-card relationships |
| `space-xl` | 2.5rem (40px) | Major section separation |
| `gutter` | 1.5rem (24px) | Grid gutters (desktop) |
| `gutter-mobile` | 0.75rem (12px) | Grid gutters (mobile) |
| `margin` | 2rem (32px) | Page outer margins (desktop) |
| `margin-mobile` | 1rem (16px) | Page outer margins (mobile) |

### 4.4 Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `rounded-sm` | 0.125rem (2px) | Micro buttons, tags |
| `rounded` | 0.25rem (4px) | Form fields, inline code |
| `rounded-md` | 0.375rem (6px) | Standard buttons |
| `rounded-lg` | 0.5rem (8px) | Cards, modals, code viewports |
| `rounded-xl` | 0.75rem (12px) | Full-screen flyouts, toasts |
| `rounded-full` | 9999px | Status badges, scan pills, severity chips |

### 4.5 Elevation & Glass Morphism

| Layer | Background | Border | Backdrop Filter | Shadow |
|-------|------------|--------|-----------------|--------|
| Canvas (0) | `#080B14` | None | None | None |
| Panels/Rails (1) | `#0D1220` | 1px `rgba(255,255,255,0.06)` | None | None |
| Cards/Containers (2) | `#111827` | 1px `#1E293B` + inset highlight | `blur(12px)` | None |
| Overlays/Slide-outs (3) | `#0D1220` @ 80% | None | `blur(20px)` | `0 20px 40px -15px rgba(0,0,0,0.8)` |

**Luminescence & Glow:**
- Critical: `box-shadow: 0 0 16px -2px rgba(239, 68, 68, 0.35)`
- Primary: `box-shadow: 0 0 14px -2px rgba(59, 130, 246, 0.4)`
- Active scanning: `conic-gradient` radar beam animation

---

## 5. State Management Strategy

### 5.1 Store Separation (Zustand)

```typescript
// store/authStore.ts - Authentication state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

// store/workspaceStore.ts - Current workspace context
interface WorkspaceState {
  currentWorkspace: Organization | null;
  memberships: Membership[];
  switchWorkspace: (id: string) => Promise<void>;
  inviteMember: (data) => Promise<void>;
  updateMemberRole: (userId, role) => Promise<void>;
  removeMember: (userId) => Promise<void>;
}

// store/uiStore.ts - Global UI state
interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  toasts: Toast[];
  modals: Record<string, boolean>;
  addToast: (toast) => void;
  removeToast: (id) => void;
  openModal: (id) => void;
  closeModal: (id) => void;
  toggleSidebar: () => void;
}

// store/scanStore.ts - Real-time scan updates
interface ScanState {
  activeScans: Map<string, Scan>;
  scanHistory: Scan[];
  findings: Finding[];
  subscribeToScan: (scanId) => void;
  unsubscribeFromScan: (scanId) => void;
  updateScanProgress: (scanId, progress) => void;
}
```

### 5.2 Server State (TanStack Query / React Query)

- All API data fetched via React Query
- Automatic caching, background refetching, deduplication
- Optimistic updates for mutations (finding status, repo enable/disable)
- Invalidation strategies per resource type

### 5.3 Real-Time Updates

- WebSocket connection for:
  - Live scan progress (Scan Center telemetry)
  - Live audit stream (Dashboard)
  - Finding status changes
  - Team member updates
- Fallback to polling if WebSocket unavailable

---

## 6. API Integration Strategy

### 6.1 API Client Architecture

```typescript
// lib/api/client.ts
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor: attach access token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['X-Request-ID'] = generateRequestId();
  return config;
});

// Response interceptor: handle 401, token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await refreshAccessToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 6.2 Typed API Hooks

```typescript
// hooks/useRepositories.ts
export function useRepositories(filters?: RepoFilters) {
  return useQuery({
    queryKey: ['repositories', filters],
    queryFn: () => api.repositories.list(filters),
    staleTime: 30000,
  });
}

export function useEnableRepository(repoId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.repositories.enable(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

### 6.3 Error Handling

- Standardized error envelope: `{ code, message, details?, requestId }`
- User-facing toasts for mutations
- Inline field errors for forms
- Global error boundary for unexpected errors
- Retry logic for idempotent GET requests

---

## 7. Mock Data Strategy

### 7.1 Development Mocking (MSW - Mock Service Worker)

```typescript
// mocks/handlers.ts
export const handlers = [
  http.get('/api/v1/dashboard/overview', () => HttpResponse.json(mockDashboardData)),
  http.get('/api/v1/repositories', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    return HttpResponse.json(mockPaginatedRepos(page));
  }),
  http.post('/api/v1/scans', () => HttpResponse.json({ scanId: 'scan_123', status: 'queued' })),
  http.get('/api/v1/findings', () => HttpResponse.json(mockFindings)),
  // WebSocket mock for telemetry
];
```

### 7.2 Mock Data Files

```
mocks/
├── data/
│   ├── dashboard.ts           # KPI cards, severity chart, recent scans
│   ├── repositories.ts        # 6 repo cards with varied statuses
│   ├── scans.ts               # Scan history with all states
│   ├── findings.ts            # 107 findings across severities
│   ├── scanDetail.ts          # Active scan with pipeline nodes
│   ├── report.ts              # Executive report with score, findings
│   ├── team.ts                # 18 members, 3 pending invites
│   ├── settings.ts            # Hardware keys, GitHub config, notifications
│   └── audit.ts               # Audit trail entries
├── handlers.ts                # MSW request handlers
└── websocket.ts               # Simulated telemetry stream
```

### 7.3 Storybook Stories

- Each domain component has stories for all states
- Mock data injected via decorators
- Interactive controls for props (severity, status, loading, etc.)

---

## 8. Animation Strategy

### 8.1 Animation Principles

| Principle | Implementation |
|-----------|----------------|
| **Purposeful** | Every animation communicates state change |
| **Performant** | Transform/opacity only; GPU accelerated |
| **Respectful** | `prefers-reduced-motion` honored |
| **Consistent** | Shared timing/easing tokens |

### 8.2 Animation Tokens

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-emphasized: cubic-bezier(0.4, 0, 0, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 8.3 Key Animations

| Animation | Component | Implementation |
|-----------|-----------|----------------|
| **Fade + Slide** | Modals, Drawers, Toasts | `opacity + transform: translateY` |
| **Scale** | Button press, Card hover | `transform: scale(0.98)` |
| **Progress Fill** | Scan bars, Radial gauge | `width` / `stroke-dashoffset` transition |
| **Pulse** | Live indicators, Scanning badges | `opacity` keyframe animation |
| **Radar Sweep** | Active scan node | `conic-gradient` + CSS animation |
| **Spin** | Loading spinners, Refresh buttons | `transform: rotate(360deg)` |
| **Shimmer** | Skeleton loaders | `background-position` animation |
| **Stagger** | List/item entrance | `transition-delay` index-based |

### 8.4 Framer Motion Integration

- Page transitions: `AnimatePresence` + `layout` prop
- List reordering: `layout` + `drag` (if needed)
- Complex sequences: `useAnimate` + `timeline`

---

## 9. Responsive Design Strategy

### 9.1 Breakpoints

| Breakpoint | Width | Columns | Gutter | Margin |
|------------|-------|---------|--------|--------|
| Mobile | < 768px | 1 | 0.75rem | 1rem |
| Tablet | 768px - 1279px | 8 | 1rem | 1.5rem |
| Desktop | ≥ 1280px | 12 | 1.5rem | 2rem |

### 9.2 Layout Patterns

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Dashboard KPI | 1-col stack | 2-col grid | 4-col grid |
| Repo Cards | 1-col | 2-col | 2-col (xl: 3-col) |
| Scan Center | Stacked | Split (70/30) | Split (5/7 cols) |
| Findings | Single pane | Split (40/60) | Split (5/7 cols) |
| Settings | Stacked tabs | Side nav (3 cols) | Side nav (3 cols) |
| Tables | Horizontal scroll | Full width | Full width |
| Modals | Full screen | Centered (max-w-2xl) | Centered (max-w-2xl) |

### 9.3 Touch Targets

- Minimum 44x44px for interactive elements
- Increased padding on mobile for buttons/links
- Swipe gestures for drawer navigation (mobile)

---

## 10. Frontend Implementation Dependencies

### 10.1 Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.3.0",
  "next": "^14.0.0",
  "tailwindcss": "^3.4.0",
  "@tailwindcss/forms": "^0.5.0",
  "@tailwindcss/typography": "^0.5.0"
}
```

### 10.2 UI & Components

```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@radix-ui/react-tooltip": "^1.0.7",
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-progress": "^1.0.3",
  "@radix-ui/react-navigation-menu": "^1.1.4",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0",
  "lucide-react": "^0.300.0"
}
```

### 10.3 Data & State

```json
{
  "@tanstack/react-query": "^5.17.0",
  "zustand": "^4.5.0",
  "axios": "^1.6.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
  "react-hook-form": "^7.49.0"
}
```

### 10.4 Visualization & Code

```json
{
  "recharts": "^2.10.0",
  "prismjs": "^1.29.0",
  "react-syntax-highlighter": "^15.5.0"
}
```

### 10.5 Real-Time

```json
{
  "socket.io-client": "^4.7.0"
}
```

### 10.6 Dev Tools

```json
{
  "storybook": "^7.6.0",
  "@storybook/react": "^7.6.0",
  "@storybook/nextjs": "^7.6.0",
  "msw": "^2.1.0",
  "jest": "^29.7.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.2.0",
  "eslint": "^8.56.0",
  "prettier": "^3.2.0"
}
```

---

## 11. Screen Mapping Summary

| Stitch Design Folder | Screens Covered | Route(s) |
|---------------------|-----------------|----------|
| `authentication_suite` | Sign In, Sign Up, Forgot Password | `/login`, `/register`, `/forgot-password` |
| `main_dashboard` | Security Operations Center | `/dashboard` |
| `repository_management` | Repository List, Connect Modal | `/repositories`, `/repositories/connect` |
| `scan_center` | Scan Center (live + history) | `/scan-center`, `/scans` |
| `scan_details_security_reports` | Executive Report, Findings Tables | `/reports/:id`, `/scans/:id/findings` |
| `settings_security_configuration` | 5 Settings Tabs | `/settings/*` |
| `team_workspace_management` | Members, Invitations, Audit | `/team/*` |
| `vulnerability_management` | Findings Stream + Detail | `/findings`, `/findings/:id` |

---

## 12. Implementation Sequence (Frontend)

### Phase 1: Foundation (Week 1-2)
1. Project setup (Next.js, Tailwind, TypeScript, ESLint, Prettier)
2. Design token system (colors, typography, spacing, radius)
3. Atomic UI components (Button, Input, Badge, Card, Avatar, etc.)
4. Layout components (Sidebar, TopNav, PageHeader)
5. Auth pages + route guards
6. API client + React Query setup
7. Zustand stores (auth, UI)
8. Storybook configuration

### Phase 2: Dashboard & Core (Week 3-4)
1. Dashboard page with KPI strips
2. Security Health Gauge (RadialGauge)
3. Vulnerability Matrix + Trend Chart
4. Active Scans Table
5. Live Audit Stream
6. CVE Spotlight with Code Diff
7. Real-time WebSocket integration

### Phase 3: Repository Management (Week 5)
1. Repository Grid with cards
2. Filter Toolbar (search, language, status)
3. Connect Repository Modal
4. Repository Detail View
5. Summary Counter Strip

### Phase 4: Scan Center (Week 6)
1. Scan Trigger Bar
2. Active Scan Hero (Pipeline Nodes Matrix)
3. Telemetry Terminal (WebSocket log stream)
4. Scan Metrics Strip
5. Scan History Table with pagination

### Phase 5: Findings & Reports (Week 7-8)
1. Findings Stream + Detail Panel (split view)
2. Finding Filters (severity, category, status, fixable)
3. CVSS Vector Ribbon
4. Remediation Playbook with Code Diff
5. Executive Report page
6. Engine Tabs (Trivy, Gitleaks, SBOM, Playbook)
7. Compliance Sign-off Panel

### Phase 6: Settings & Team (Week 9)
1. Settings Navigation + 5 Tabs
2. Account Security (Hardware keys, TOTP, Backup codes)
3. GitHub Integration (Pipeline toggles)
4. Notifications (Slack, PagerDuty, Email)
5. Scanner Rules (CVSS Slider, Gitleaks Allowlist)
6. Danger Zone (Confirmation modals)
7. Team Members Table (RBAC, MFA, Actions)
8. Invitations + Invite Modal
9. Audit Trail

### Phase 7: Polish & Integration (Week 10)
1. Loading skeletons for all pages
2. Empty states with CTAs
3. Error boundaries + retry UI
4. Responsive testing + fixes
5. Accessibility audit (WCAG AA)
6. Performance optimization (code splitting, memoization)
7. E2E tests (Playwright)
8. Documentation