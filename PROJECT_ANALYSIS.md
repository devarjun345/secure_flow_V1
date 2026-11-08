# PROJECT_ANALYSIS.md
## SecureFlow — Complete Project Analysis

---

## 1. Project Overview

**SecureFlow** is an Automated DevSecOps Platform for Continuous Vulnerability Detection. It connects to GitHub repositories, orchestrates security scans (Trivy for dependency vulnerabilities, Gitleaks for secret detection) via a Python FastAPI backend with Celery/Redis queue, and presents findings in a React/TypeScript/Tailwind dashboard.

**Document Version**: 2.0 (Python Backend Edition)  
**Target Schedule**: 6-month implementation  
**Project Type**: B.Tech CSE final-year project / SaaS MVP  

---

## 2. System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Developer  │────▶│    GitHub   │────▶│  GitHub App │────▶│  FastAPI    │
│  (PR/Push)  │     │   Webhook   │     │  (verifies  │     │  (validates,│
└─────────────┘     └─────────────┘     │  signature) │     │  dispatches)│
                                         └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │◀────│   MongoDB   │◀────│  Normalize  │◀────│   Celery    │
│  (React)    │     │  (persist)  │     │  & Redact   │     │  Worker     │
└─────────────┘     └─────────────┘     └─────────────┘     │  (Trivy/    │
                                                             │  Gitleaks)  │
                                                             └─────────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────┐
                                                           │   Redis     │
                                                           │  (broker)   │
                                                           └─────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + TypeScript + Tailwind CSS | Dashboard, findings, repository management |
| Backend API | Python + FastAPI + Pydantic | Auth, workspace, GitHub App, webhook, scan orchestration |
| Queue/Broker | Celery + Redis | Background task dispatch, retries, routing |
| Scanner Worker | Python Celery Worker | Fetch source, run Trivy/Gitleaks, parse output, cleanup |
| Security Tools | Trivy (pinned), Gitleaks (pinned) | Dependency vuln + secret detection |
| Database | MongoDB + PyMongo | Users, workspaces, scans, findings, audit events |
| Runtime | Docker, Docker Compose, GitHub Actions | Repeatable environments, CI/CD |

---

## 3. Complete SecureFlow Workflow

### 3.1 First-Time Setup
1. User registers → creates workspace
2. Installs SecureFlow GitHub App on selected repositories
3. SecureFlow associates installation with workspace
4. Owner selects repositories → enables monitoring
5. Application shows integration & repository connection status

### 3.2 Automated Pull-Request Scan
1. Developer opens/updates PR in monitored repo
2. GitHub sends subscribed webhook event
3. FastAPI verifies HMAC signature against raw body
4. Delivery ID checked for duplicate prevention
5. Backend creates scan record + dispatches Celery task (immutable commit SHA)
6. Restricted worker obtains source snapshot → runs approved scanners
7. Results normalized, redacted, persisted, summarized
8. Temporary source deleted; scan status finalized
9. Dashboard updates + optional GitHub Check publishes summary

### 3.3 Manual Scan
Authorized user selects "Run Scan" → API validates membership → creates scan record → dispatches Celery task → returns scan ID → UI shows Queued/Running/Completed/Failed/Timed Out

### 3.4 Finding Investigation
Developer filters findings → opens detail → reviews severity, category, evidence, location, remediation → updates workflow label (Open/Acknowledged/Resolved/Accepted Risk)

---

## 4. Functional Requirements (MVP)

| ID | Requirement | Description |
|----|-------------|-------------|
| FR-01 | Authentication | Register, login/logout, current profile; hash passwords; protect sessions |
| FR-02 | Authorization | Check identity, workspace membership, role; return 401/403 |
| FR-03 | Workspace | Create/list workspaces; persist owner/membership |
| FR-04 | GitHub App | Install app; associate installation with workspace; keep credentials server-side |
| FR-05 | Repository Selection | List installation-accessible repos; enable/disable monitoring |
| FR-06 | Webhook Intake | Accept events; verify signature; validate type/fields |
| FR-07 | Idempotency | Use delivery IDs + repo/commit context to prevent duplicate scans |
| FR-08 | Scan Scheduling | Manual + webhook triggers create scan records + dispatch async Celery tasks |
| FR-09 | Worker Processing | Validate task; fetch immutable source; run approved commands; enforce limits |
| FR-10 | Dependency Scan | Pinned Trivy version/config for supported manifests/lockfiles |
| FR-11 | Secret Scan | Pinned Gitleaks; redact secret values from ALL persisted/displayed/logged output |
| FR-12 | IaC Scan | Optional MVP extension |
| FR-13 | Result Normalization | Convert scanner outputs to stable finding schema; preserve tool/version/rule IDs |
| FR-14 | Deduplication | Stable fingerprints; preserve scan associations + first/last seen |
| FR-15 | Dashboard | Repo totals, scan totals, severity counts, recent activity, current findings |
| FR-16 | Finding Search | Filter/paginate by repo, severity, category, workflow status |
| FR-17 | Finding Detail | Title, description, severity, location, scanner reference, remediation |
| FR-18 | Scan History | Commit SHA, trigger, status, timestamps, duration, summary |
| FR-19 | GitHub Reporting | Publish/update GitHub Check summary for scanned commit |
| FR-20 | Audit Events | Record installation changes, repo monitoring, membership changes |
| FR-21 | Cleanup | Delete temp source/scanner workspaces after success/failure/timeout/recovery |
| FR-22 | Failure Handling | Record scanner errors, worker failures, timeouts; bounded retry/backoff |

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Security | Authorized workspace access only; protected credentials; isolated scanner execution |
| Performance | Long scans async; dashboard lists paginated |
| Reliability | Explicit task states, bounded retries, timeout handling, failure records |
| Scalability | API and Celery workers scale independently; worker concurrency configurable |
| Maintainability | Modular Python packages, typed interfaces, documented APIs, automated tests |
| Usability | Findings explain severity, location, next steps in understandable language |
| Privacy | Temporary source snapshots removed under defined retention policy |
| Observability | Structured logs, request IDs, queue metrics, worker health, scan metrics |

---

## 6. Data Model (MongoDB Collections)

| Collection | Key Fields | Rules |
|------------|------------|-------|
| `users` | name, email, passwordHash/identityRef, createdAt | Unique normalized email; no plaintext passwords |
| `organizations` | name, ownerId, plan, createdAt | Workspace root |
| `memberships` | organizationId, userId, role, joinedAt | Unique per workspace/user |
| `githubInstallations` | organizationId, installationId, encryptedCredentialRef | No plaintext long-lived tokens/private keys |
| `repositories` | organizationId, githubRepoId, owner/name, defaultBranch, enabled, lastScannedAt | Index repo identity + tenant |
| `scans` | organizationId, repositoryId, commitSha, triggerType, status, timestamps, duration, summary | Index by tenant, repo, status, date |
| `findings` | organizationId, repositoryId, scanId, fingerprint, severity, category, filePath, status | Index for filters + fingerprint lookup |
| `auditEvents` | organizationId, actorId, action, resourceType, resourceId, timestamp | Append-only for important actions |

### Tenant Isolation
- Every org-owned record includes `organizationId`
- Every query includes authorized tenant scope
- Never trust workspace ID from browser without verifying membership
- Automated negative tests for cross-workspace reads/writes

### Retention
- Temporary repo snapshots: delete immediately after scan completion/failure
- Raw scanner output: retain only if needed after redaction; else normalized only
- Scan/finding metadata + audit events: define/document project retention durations
- GitHub credentials: encrypted/secrets manager; support disconnect/revocation/deletion

---

## 7. API Requirements (Base: `/api/v1`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End session |
| POST | `/auth/refresh` | Refresh session |
| GET | `/auth/me` | Current user |
| POST | `/organizations` | Create workspace |
| GET | `/organizations` | List workspaces |
| GET | `/organizations/{id}` | Workspace detail |
| GET | `/organizations/{id}/members` | List members |
| GET | `/github/installations` | List linked installations |
| GET | `/github/repositories` | List accessible repositories |
| POST | `/github/repositories/connect` | Enable selected repository |
| DELETE | `/github/repositories/{id}` | Disable monitoring |
| POST | `/webhooks/github` | Receive GitHub event |
| GET | `/repositories` | List monitored repositories |
| GET | `/repositories/{id}` | Repository detail |
| GET | `/repositories/{id}/scans` | Repository scan history |
| POST | `/scans` | Start manual scan |
| GET | `/scans` | List scans |
| GET | `/scans/{id}` | Scan status/summary |
| GET | `/scans/{id}/findings` | Findings for scan |
| GET | `/findings` | Search/filter findings |
| GET | `/findings/{id}` | Finding detail |
| PATCH | `/findings/{id}/status` | Update workflow status |
| GET | `/dashboard/overview` | Workspace metrics |
| GET | `/dashboard/activity` | Recent activity |

---

## 8. Security & Threat Controls

| Threat | Required Control |
|--------|------------------|
| Forged webhook | Verify HMAC signature against raw body; reject invalid; validate event type |
| Replay/duplicate | Record delivery ID; enforce idempotency |
| Token/private key exposure | Keep credentials server-side; encrypt at rest; restrict access; rotate/revoke |
| Malicious repo content | Never execute project code; isolate scanner; enforce resource limits; cleanup |
| Container/host exposure | Non-root, minimal capabilities, no privileged mode, no host Docker socket |
| Cross-tenant access | Tenant-scope every query; authorize every protected operation |
| Secret leakage | Redact values before logging, storing display evidence, rendering UI |
| Resource exhaustion | Rate limit; cap repo size, file count, duration, concurrency, retries |
| Supply-chain risk | Pin tool/base-image versions; update through reviewed process |
| XSS/injection | Escape untrusted scanner text; validate input; avoid unsafe HTML rendering |

---

## 9. Six-Month Implementation Roadmap

| Month | Workstream | Deliverable |
|-------|------------|-------------|
| 1 | Plan/Design | Approved PRD, architecture, wireframes, API draft |
| 2 | Foundation | Frontend shell/design system, FastAPI foundation, auth, workspace, MongoDB models, protected APIs |
| 3 | GitHub | GitHub App, installation flow, repo selection, webhook validation, idempotency |
| 4 | Scanning | Celery/Redis, Python worker, source retrieval, Trivy, Gitleaks, result normalization |
| 5 | Dashboard | Findings, filters, history, dashboard metrics, GitHub Checks, end-to-end integration |
| 6 | Harden/Deliver | Security/performance tests, tenant isolation, cleanup, deployment, documentation |

### Suggested Team Split
| Member | Ownership | Responsibilities |
|--------|-----------|------------------|
| Student 1 | Frontend | React screens, design system, dashboard, findings, API integration, UI tests |
| Student 2 | Python Backend | FastAPI APIs, auth, workspace, MongoDB, GitHub App, webhook |
| Student 3 | Scanning | Python worker, Trivy/Gitleaks, result normalization, isolation, test fixtures |
| Student 4 (if available) | DevOps/Integration | Docker, Redis/Celery, CI/CD, GitHub Checks, deployment, integration tests |

---

## 10. MVP Scope vs. Post-MVP

### Must Have (MVP)
- Authentication, workspace, GitHub App, repository selection
- Webhook verification, Celery queue
- Dependency scan (Trivy), Secret scan (Gitleaks)
- Findings dashboard, scan history
- Tenant isolation and cleanup

### Should Have (If Core MVP Stable)
- GitHub Checks, scan comparison, activity log
- Finding status workflow, repository analytics

### Future (Post-MVP)
- Container image scanning, broader IaC
- Notifications, compliance reports
- GitLab/Bitbucket, AI explanations/remediation
- Billing, multi-cloud orchestration

---

## 11. Risks & Assumptions

### Key Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| GitHub App permissions/setup take time | Integration delays | Create test app early; request minimum permissions |
| Private repo access mishandled | Source exposure | Use installation-scoped short-lived credentials; strict cleanup |
| Scanner output varies by version/config | Unstable results | Pin versions, store provenance, test fixtures |
| False positives/missed issues | Reduced trust | Document coverage; evaluate controlled fixtures |
| Worker resource exhaustion | Queue delays | Apply limits, concurrency controls, timeout, bounded retry |
| Scope grows beyond 6 months | Incomplete MVP | Freeze Must Have scope; defer AI, multi-provider, advanced compliance |

### Assumptions
- GitHub is initial source-control provider
- Team can create/configure GitHub App for testing
- MVP scanning runs on controlled infrastructure with Docker
- MongoDB, Redis, Python, scanner tools available in dev/deployment
- Initial target: demonstrable academic MVP, not production-certified service

---

## 12. Deliverables
- Complete source code (frontend, FastAPI backend, scanner worker)
- Architecture diagram, data model, API/OpenAPI documentation
- GitHub App setup and configuration guide
- Docker Compose development environment + deployment instructions
- Automated tests + controlled scanner test fixtures
- Security and performance evaluation report
- User guide, known limitations, retention/privacy description
- Final presentation and recorded/live demonstration