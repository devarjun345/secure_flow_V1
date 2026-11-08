# IMPLEMENTATION_ROADMAP.md
## SecureFlow — Frontend Implementation Roadmap

---

## 1. Executive Summary

This roadmap translates the SecureFlow PRD v2.0 and Stitch "Cyber Command Glass" designs into a phased frontend implementation plan. The plan assumes a team of 2-3 frontend engineers working in parallel with backend engineers, targeting a 10-week frontend implementation within the 6-month overall schedule.

**Target**: Demonstrable MVP by Week 10 (Month 5 of overall project)
**Methodology**: Vertical slice → horizontal expansion → polish
**Branching**: Trunk-based development with feature flags

---

## 2. Gap Analysis: PRD vs. Stitch Designs

### 2.1 Screens in PRD but Missing from Stitch

| Screen | PRD Section | Priority | Notes |
|--------|-------------|----------|-------|
| Landing Page | §8.1 Public | Medium | Marketing + feature overview; can use simplified version |
| Password Recovery Flow | FR-01 | High | Email sent → Token validate → New password |
| Email Verification | FR-01 | Medium | Post-registration; can defer to post-MVP |
| Organization Creation Wizard | FR-03 | High | Multi-step: Name → Plan → Invite Members |
| GitHub App Installation Flow | FR-04 | Critical | Redirect to GitHub → Callback → Success |
| Repository Selection UI | FR-05 | Critical | Checklist with search, bulk select |
| Scan Comparison View | Should Have | Low | Defer to post-MVP |
| Finding Status Workflow UI | Should Have | Medium | Kanban or detailed status transition |
| Repository Analytics | Should Have | Low | Defer to post-MVP |
| Notification Center | FR-20 | Medium | Bell icon + dropdown + history |
| User Profile/Settings | §8.1 Account | Medium | Avatar, name, email, password, sessions |
| API Key Management | Not in Stitch | Low | For CI/CD integrations; post-MVP |

### 2.2 Stitch Screens Not Explicitly in PRD (But Aligned)

| Stitch Screen | Alignment | Notes |
|---------------|-----------|-------|
| Authentication Suite (3 tabs) | FR-01 | Complete with SSO |
| Main Dashboard (SOC) | FR-15 | Complete + real-time |
| Repository Management | FR-05, FR-15 | Complete with connect modal |
| Scan Center | FR-08, FR-18 | Complete with live telemetry |
| Scan Details/Reports | FR-17, FR-19 | Complete with playbook |
| Settings (5 tabs) | FR-02, FR-20 | Complete with danger zone |
| Team Management | FR-03, FR-20 | Complete with audit trail |
| Vulnerability Management | FR-16, FR-17 | Complete with detail panel |

### 2.3 Design Inconsistencies to Resolve

| Inconsistency | Impact | Resolution |
|---------------|--------|------------|
| Button radius varies (rounded vs rounded-lg) | Visual consistency | Standardize: Primary=rounded-lg, Secondary=rounded |
| Toast implementations differ across screens | Code duplication | Single Toast component with variants |
| Modal backdrop blur inconsistent | Visual consistency | Standardize to backdrop-blur-xl |
| Focus ring styles vary | Accessibility | Unified focus ring system |
| Empty state illustrations missing | UX completeness | Add consistent illustrations |

### 2.4 Functional Interactions Needing Implementation

| Interaction | Stitch Status | Implementation Needed |
|-------------|---------------|----------------------|
| Real-time scan progress (WebSocket) | Simulated in HTML | Connect to backend WebSocket |
| Live audit stream | Simulated | Server-sent events / WebSocket |
| GitHub webhook signature verification | UI only | Backend integration |
| Finding status workflow (Open→Acknowledged→Resolved) | UI only | API integration + optimistic updates |
| Repository enable/disable monitoring | UI only | API integration |
| Scan trigger (manual + webhook) | UI only | API integration |
| GitHub Check publishing | Not in Stitch | Backend + UI status |
| Secret redaction verification | UI shows redacted | Backend enforcement |
| Tenant isolation validation | Not visible | Automated test UI (admin) |

---

## 3. Implementation Phases

### Phase 0: Foundation (Week 1-2) — **CRITICAL PATH**

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Next.js 14 + TypeScript + Tailwind setup | FE Lead | None | Running dev server |
| Design token system (CSS custom properties) | FE Lead | None | `styles/theme.css` + Tailwind config |
| Atomic UI components (Button, Input, Badge, Card, Avatar, Checkbox, Radio, Switch) | FE1 | Design tokens | Storybook stories + tests |
| Layout primitives (Grid, Flex, Container, Sidebar, TopNav) | FE1 | Atomic components | Layout components |
| Auth pages (Login, Register, Forgot) + Route Guards | FE2 | Atomic components | Working auth flow (mocked) |
| API Client (Axios + interceptors + React Query) | FE2 | None | `lib/api/client.ts` |
| Zustand stores (Auth, UI) | FE2 | None | Working state management |
| ESLint + Prettier + Husky + lint-staged | FE Lead | None | CI passes |
| Storybook configuration | FE1 | Atomic components | Running Storybook |
| MSW (Mock Service Worker) setup | FE1 | API contracts | Mock handlers for all endpoints |

**Exit Criteria**: All foundation code merged; Storybook running; Auth flow works with mocks; CI green.

---

### Phase 1: Dashboard & Core Real-Time (Week 3-4)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Dashboard Page Layout (SOC Header, KPI Strips) | FE1 | Phase 0 | Static dashboard |
| Security Health Gauge (RadialGauge + Sub-meters) | FE1 | Atomic: Progress, Card | Interactive gauge |
| Vulnerability Matrix (Severity Cards + Trend Chart) | FE1 | Recharts + Atomic | Chart with mock data |
| Active Scans Table (with inline progress) | FE2 | Atomic: Table, Badge, Progress | Sortable, filterable table |
| Live Audit Stream (WebSocket integration) | FE2 | WebSocket hook + Atomic | Real-time log stream |
| CVE Spotlight with Code Diff Drawer | FE1 | Atomic: CodeBlock, Modal | Diff view with syntax highlighting |
| Time Range Selector (24h/7d/30d/Custom) | FE1 | Atomic: Button Group | State persisted in URL |
| WebSocket Connection Manager | FE2 | Backend WS endpoint | Auto-reconnect, auth |
| Real-time Scan Progress Subscription | FE2 | Scan Store + WS | Live updates in Scan Center |

**Exit Criteria**: Dashboard fully functional with real-time data; WebSocket stable; All components in Storybook.

---

### Phase 2: Repository Management (Week 5)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Repository Grid (6 Card Variants) | FE1 | Phase 0 | Responsive grid |
| Repository Card Components (all states) | FE1 | Atomic: Card, Badge, Progress | Vulnerable, Scanning, Healthy, Critical, Minor, Secure |
| Filter Toolbar (Search, Language, Status) | FE1 | Atomic: Input, Select | Server-side filtering |
| Summary Counter Strip (4 Metric Cards) | FE1 | Atomic: MetricCard | Live counts |
| Connect Repository Modal | FE2 | Atomic: Modal, List, Switch | Org selector + repo toggles |
| Repository Detail View | FE2 | Phase 1 components | Findings summary + last scan |
| GitHub App Installation Flow (New) | FE2 | Backend OAuth endpoint | Redirect → Callback → Success |
| Repository Selection UI (New) | FE2 | Connect Modal patterns | Checklist with bulk actions |

**Exit Criteria**: Repo management complete; GitHub App install flow works end-to-end.

---

### Phase 3: Scan Center (Week 6)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Scan Trigger Bar (Repo/Branch/Profile Select + Initiate) | FE1 | Phase 2 | Form with validation |
| Active Scan Hero (Target Info + Status Meter + Global Progress) | FE1 | Phase 1 Gauge | Live progress |
| Pipeline Nodes Matrix (4 Nodes with States) | FE1 | Atomic: Card, Progress, Badge | Animated transitions |
| Telemetry Terminal (WebSocket Log Stream) | FE2 | Phase 1 WS | Color-coded, auto-scroll, clear |
| Scan Metrics Strip (4 Metric Cards) | FE1 | Atomic: MetricCard | Live data |
| Scan History Table (Tabs + Pagination + Filters) | FE2 | Atomic: Table, Tabs | Server-side pagination |
| Runner Pool Health Indicator | FE1 | Backend health endpoint | Visual status |
| Manual Scan Trigger Integration | FE2 | Backend `/scans` POST | Optimistic UI + toast |

**Exit Criteria**: Scan Center fully functional; Can trigger and monitor scans in real-time.

---

### Phase 4: Findings & Reports (Week 7-8)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Findings Stream (Left Pane, Virtualized List) | FE1 | Phase 0 | 107 findings performant |
| Finding Detail Panel (Right Pane, Split View) | FE1 | Phase 3 Terminal | Responsive split |
| Finding Filters (Severity, Category, Status, Fixable) | FE2 | Atomic: Select, Checkbox | URL-synced state |
| CVSS Vector Ribbon (Copy + Decoded Grid) | FE1 | Atomic: CodeBlock, Button | Interactive |
| Threat Intelligence Narrative | FE1 | Atomic: Card | Markdown rendering |
| Component Breakdown Grid | FE1 | Atomic: Card | Responsive grid |
| Automated Remediation Playbook (Code Diff + Generate PR) | FE2 | Phase 1 CodeBlock | Diff view + API call |
| Action Triage Bar (Issue, Snooze, False Positive, Assignee) | FE2 | Atomic: Button, Select | Optimistic updates |
| Executive Report Page | FE1 | Phase 4 components | Complete report view |
| Engine Tabs (Trivy, Secrets, SBOM, Playbook) | FE1 | Atomic: Tabs | Lazy-loaded content |
| Zero States (Secrets Clean, SBOM View) | FE1 | Atomic: EmptyState | Illustrated |
| Compliance Sign-off Panel | FE1 | Atomic: Card, Badge | Status display |
| Finding Status Workflow (New) | FE2 | Backend PATCH | Kanban or inline transition |

**Exit Criteria**: Findings management complete; Report generation works; Remediation flow integrated.

---

### Phase 5: Settings & Team (Week 9)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Settings Layout (Nav Rail + Tab Panels) | FE1 | Phase 0 | Responsive |
| Account Security Tab (Hardware Keys, TOTP, Backup Codes, Session) | FE1 | Atomic: Card, List, Button | CRUD for keys |
| GitHub Integration Tab (Org Status, Scopes, Pipeline Toggles) | FE2 | Phase 2 | Switch integration |
| Notifications Tab (Slack, PagerDuty, Email) | FE1 | Atomic: Card, Switch, Button | Test buttons |
| Scanner Rules Tab (CVSS Slider, Gitleaks Allowlist Editor) | FE2 | Atomic: Slider, Textarea | TOML validation |
| Danger Zone Tab (3 Actions + Confirmation Modals) | FE1 | Atomic: Modal, Input | Type-to-confirm |
| Floating Save Bar (Unsaved Changes) | FE2 | UI Store | Global indicator |
| Team Members Table (Search, Filters, Actions) | FE1 | Phase 2 Table | Role change, revoke |
| Invitations Management (List, Resend, Revoke, Expire) | FE2 | Atomic: List, Button | Real-time updates |
| Audit Trail (Immutable Log Display) | FE1 | Atomic: List, Badge | Paginated |
| Quick Invite Form + Full Invite Modal | FE2 | Phase 0 Modal | Role cards + Hardware 2FA |
| Notification Center (New - Bell Icon) | FE1 | Backend notifications | Dropdown + History |
| User Profile Page (New) | FE2 | Atomic: Form, Avatar | Password, sessions |

**Exit Criteria**: All settings functional; Team management complete; Danger zone protected.

---

### Phase 6: Polish, Integration & Hardening (Week 10)

| Task | Owner | Dependencies | Deliverable |
|------|-------|--------------|-------------|
| Loading Skeletons (All Pages) | FE1 | All Phases | Perceived performance |
| Empty States with CTAs (All Pages) | FE1 | All Phases | Guided UX |
| Error Boundaries + Retry UI | FE2 | All Phases | Graceful degradation |
| Responsive Testing (Mobile/Tablet/Desktop) | Both | All Phases | Breakpoint fixes |
| Accessibility Audit (WCAG AA) | Both | All Phases | aXe + manual testing |
| Keyboard Navigation Audit | Both | All Phases | Focus management |
| Reduced Motion Support | FE1 | Animation tokens | `prefers-reduced-motion` |
| Performance Optimization | Both | All Phases | Code splitting, memoization |
| Bundle Analysis + Optimization | FE Lead | Build | < 200KB initial JS |
| E2E Tests (Playwright) | FE2 | Critical Flows | CI integration |
| Visual Regression Tests (Chromatic) | FE1 | Storybook | Component snapshots |
| Documentation (README, Component Docs) | Both | All Phases | Onboarding ready |
| Design System Handoff | FE Lead | Phase 0-1 | Figma/Tailwind sync |

**Exit Criteria**: Production-ready frontend; All tests pass; Documentation complete.

---

## 4. Recommended Technology Stack Summary

| Category | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| Framework | Next.js (App Router) | 14.x | SSR, RSC, optimal for dashboards |
| Language | TypeScript | 5.3+ | Type safety for API contracts |
| Styling | Tailwind CSS | 3.4+ | Design token integration, responsive |
| State (Client) | Zustand | 4.5+ | Simple, performant, no boilerplate |
| State (Server) | TanStack Query | 5.x | Caching, synchronization, mutations |
| Forms | React Hook Form + Zod | 7.49+ / 3.22+ | Validation, type-safe |
| UI Primitives | Radix UI | 1.x | Accessible, unstyled, composable |
| Icons | Lucide React | 0.300+ | Consistent, tree-shakeable |
| Charts | Recharts | 2.10+ | Composable, responsive |
| Code Highlighting | React Syntax Highlighter | 15.5+ | Prism-based, themable |
| Real-time | Socket.io Client | 4.7+ | WebSocket + fallback |
| Testing | Vitest + Playwright | Latest | Fast unit + reliable E2E |
| Storybook | Storybook 7.x | 7.6+ | Component documentation |
| Mocking | MSW | 2.x | API mocking for dev/test |
| Linting | ESLint + Prettier | Latest | Code quality |

---

## 5. Screen Mapping to Implementation

| Stitch Folder | Screens | Routes | Phase |
|---------------|---------|--------|-------|
| `authentication_suite` | Sign In, Sign Up, Forgot | `/login`, `/register`, `/forgot-password` | 0 |
| `main_dashboard` | Security Operations Center | `/dashboard` | 1 |
| `repository_management` | Repo List, Connect Modal, Detail | `/repositories`, `/repositories/:id` | 2 |
| `scan_center` | Scan Center, History | `/scan-center`, `/scans` | 3 |
| `scan_details_security_reports` | Executive Report, Findings | `/reports/:id`, `/findings`, `/scans/:id/findings` | 4 |
| `settings_security_configuration` | 5 Settings Tabs | `/settings/*` | 5 |
| `team_workspace_management` | Members, Invitations, Audit | `/team/*` | 5 |
| `vulnerability_management` | Findings Stream + Detail | `/findings`, `/findings/:id` | 4 |
| **New (PRD gaps)** | Landing, Org Wizard, GitHub Install, Profile, Notifications | `/`, `/onboarding/*`, `/account`, `/notifications` | 0, 2, 5 |

---

## 6. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebSocket instability | High | High | Implement exponential backoff; fallback to polling; connection health indicator |
| Real-time performance (100+ findings) | Medium | High | Virtualized lists (react-window); pagination; server-side filtering |
| Design token drift | Medium | Medium | Automated visual regression (Chromatic); design token sync script |
| Backend API delays | High | High | MSW for independent development; contract-first API design |
| Scope creep (Stitch has more than MVP) | High | High | Strict phase gates; feature flags for non-MVP |
| Accessibility gaps | Medium | High | Automated aXe in CI; manual audit each phase |
| Bundle size growth | Medium | Medium | Code splitting per route; dynamic imports for heavy components |
| Team coordination (FE/BE) | Medium | High | Weekly sync; shared API contracts (OpenAPI); mock-first |

---

## 7. Unresolved Questions

1. **Authentication Strategy**: JWT in httpOnly cookies vs. localStorage + refresh token rotation?
2. **WebSocket Auth**: How to authenticate WebSocket connections (token in handshake)?
3. **GitHub App Callback**: Where does OAuth callback route? Frontend or backend?
4. **Secret Redaction**: Does frontend need to re-redact, or trust backend?
5. **Scan Comparison**: Defer to post-MVP or build minimal diff view?
6. **Offline Support**: Any PWA requirements for dashboard?
7. **Internationalization**: Any i18n needs for final demo?
8. **Theme Variants**: Dark-only confirmed? Any high-contrast mode?
9. **Data Export**: CSV/JSON export from tables - client-side or server-side?
10. **Real-time Notifications**: WebSocket or Server-Sent Events for notifications?

---

## 8. Definition of Done (Per Phase)

- [ ] All components have Storybook stories with controls
- [ ] Unit tests > 80% coverage for new components
- [ ] E2E tests for critical user flows
- [ ] Visual regression tests pass (Chromatic)
- [ ] Accessibility audit passes (no critical violations)
- [ ] Responsive design verified on 3 breakpoints
- [ ] Bundle size impact < 10KB per new route
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Documentation updated (README + Component docs)
- [ ] Code reviewed and approved
- [ ] Deployed to preview environment

---

## 9. Milestone Dates (Assuming Week 1 Start)

| Milestone | Target Week | Notes |
|-----------|-------------|-------|
| Foundation Complete | Week 2 | All atoms, stores, API client, auth |
| Dashboard + Real-time | Week 4 | Core value demonstration |
| Repo Management + GitHub App | Week 5 | External integration working |
| Scan Center | Week 6 | Orchestration visible |
| Findings + Reports | Week 8 | Primary user value |
| Settings + Team | Week 9 | Admin capabilities |
| Polish + Hardening | Week 10 | Production ready |
| **MVP Demo Ready** | **Week 10** | **End of Month 5** |

---

## 10. Post-MVP Backlog (Prioritized)

1. Scan Comparison View
2. Repository Analytics / Trends
3. Finding Status Workflow (Kanban)
4. Notification Center (Real-time)
5. API Key Management
6. Email Verification Flow
7. High Contrast / Accessibility Themes
8. Internationalization (i18n)
9. PWA / Offline Support
10. Advanced Compliance Reports
11. AI Remediation Explanations
12. GitLab/Bitbucket Integration
13. Billing/Subscription UI
14. Multi-cloud Orchestration Dashboard