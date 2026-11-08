# DESIGN_SYSTEM_ANALYSIS.md
## SecureFlow — Design System Analysis (Stitch "Cyber Command Glass")

---

## 1. Design Language Overview

**Name**: Cyber Command Glass  
**Philosophy**: High-precision, mission-critical DevSecOps control plane. Balances immense data density with immediate cognitive clarity. Dark tactical command center fused with modern enterprise refinement — deliberate, hyper-focused, unyielding.

### Visual Characteristics
- **Atmospheric Depth**: Deep-space dark foundations layered with calibrated glass surfaces and low-noise grid patterns
- **Luminescent Signaling**: Strategic glow effects and saturated status accents (Electric Blue, Cyber Violet, Crimson, Amber, Emerald) against near-black backdrops
- **Engineered Precision**: Crisp hairline dividers, strict monospaced data alignment for cryptographic signatures, technical micro-indicators mimicking radar sweeps and scanning states

---

## 2. Color System Analysis

### 2.1 Material Design 3 Extended Palette (from DESIGN.md)

| Token | Hex | Role |
|-------|-----|------|
| `surface` | `#10131c` | Base canvas |
| `surface-dim` | `#10131c` | Dimmed surface |
| `surface-bright` | `#363943` | Brightened surface |
| `surface-container-lowest` | `#0b0e17` | Lowest elevation |
| `surface-container-low` | `#181b25` | Low elevation |
| `surface-container` | `#1c1f29` | Standard containers |
| `surface-container-high` | `#272a34` | High elevation |
| `surface-container-highest` | `#32343f` | Highest elevation |
| `on-surface` | `#e0e2ef` | Primary text on surface |
| `on-surface-variant` | `#c2c6d6` | Muted text on surface |
| `primary` | `#adc6ff` | Primary brand (Electric Blue) |
| `on-primary` | `#002e6a` | Text on primary |
| `primary-container` | `#4d8eff` | Primary container |
| `secondary` | `#d0bcff` | Secondary (Cyber Violet) |
| `tertiary` | `#4edea3` | Tertiary (Emerald) |
| `error` | `#ffb4ab` | Error/Critical (Crimson) |
| `outline` | `#8c909f` | Standard borders |
| `outline-variant` | `#424754` | Subtle borders |

### 2.2 Functional Color Mapping (from DESIGN.md narrative)

| Semantic Role | Color | Usage |
|---------------|-------|-------|
| Base Canvas | `#080B14` | Root views, reduces eye strain |
| Surface Layer 1 | `#0D1220` | Persistent rails, top nav, toolbars |
| Surface Layer 2 | `#111827` | Elevated cards, metric tiles, inspection panels |
| Primary Brand | `#3B82F6` | Interactive actions, active tabs, focus rings |
| Secondary Accent | `#8B5CF6` | ML recommendations, automated remediations |
| Critical/CVE | `#EF4444` | Immediate blockers, active leaks, severe vulns |
| Warning | `#F59E0B` | Deprecation warnings, policy bypasses |
| Success/Secure | `#10B981` | Compliant branches, green pipelines, resolved |
| Text Primary | `#F8FAFC` | Main content text |
| Text Muted | `#94A3B8` | Secondary text, placeholders |
| Structural Borders | `rgba(255,255,255,0.08)` / `#1E293B` | Dividers, card borders |

### 2.3 Status Color System (with Glow Effects)

| Status | Base Color | Glow Shadow | Pulse Indicator |
|--------|------------|-------------|-----------------|
| Critical | `#EF4444` | `0 0 16px -2px rgba(239,68,68,0.35)` | 6px animated ping dot |
| High | `#F59E0B` (amber) | Subtle | Static dot |
| Medium | `#3B82F6` (blue) | Subtle | Static dot |
| Low | `#94A3B8` (muted) | None | None |
| Secure/Success | `#10B981` | `0 0 14px -2px rgba(16,185,129,0.4)` | Static dot |
| Scanning/Active | `#3B82F6` | `0 0 14px -2px rgba(59,130,246,0.4)` | Animated ping |

---

## 3. Typography System

### 3.1 Font Families

| Family | Purpose | Weights Used |
|--------|---------|--------------|
| **Geist** | Display & Headlines | 100-900 (primarily 600, 700) |
| **Inter** | Body text, UI labels | 100-900 (primarily 400, 600) |
| **JetBrains Mono** | All computational data | 100-900 (primarily 400, 500, 700) |

### 3.2 Type Scale (from DESIGN.md)

| Token | Family | Size | Weight | Line Height | Letter Spacing | Use Case |
|-------|--------|------|--------|-------------|----------------|----------|
| `display-xl` | Geist | 56px | 700 | 64px | -0.03em | Hero headlines |
| `headline-lg` | Geist | 36px | 600 | 44px | -0.02em | Page titles |
| `headline-lg-mobile` | Geist | 28px | 600 | 36px | -0.015em | Mobile page titles |
| `headline-md` | Geist | 24px | 600 | 32px | -0.015em | Section headers |
| `headline-sm` | Geist | 18px | 600 | 26px | -0.01em | Card titles |
| `body-lg` | Inter | 16px | 400 | 24px | -0.005em | Primary body |
| `body-md` | Inter | 14px | 400 | 20px | 0em | Standard body |
| `body-sm` | Inter | 12px | 400 | 18px | 0.01em | Secondary text |
| `code-lg` | JetBrains Mono | 14px | 500 | 20px | -0.01em | Code blocks, SHAs |
| `code-md` | JetBrains Mono | 12px | 400 | 18px | 0em | Inline code, IDs |
| `code-sm` | JetBrains Mono | 11px | 400 | 16px | 0.02em | Terminal output |
| `label-md` | Inter | 12px | 600 | 16px | 0.04em | Form labels |
| `label-xs` | JetBrains Mono | 10px | 700 | 14px | 0.08em | Severity badges, table headers |

### 3.3 Typography Rules

- **Monospace (JetBrains Mono) mandatory for**: Commit SHAs, CVE IDs, dependency versions, raw payload traces, scan duration timers, file paths, line numbers
- **Uppercase transformation reserved for**: `label-xs` tokens in severity badges, posture indicators, table header categorizations
- **Geist for authority**: Display and headline scales
- **Inter for density**: Multi-column grids, dashboard metrics

---

## 4. Layout & Spacing System

### 4.1 Grid Architecture

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Desktop (≥1280px) | 12 | 1.5rem (24px) | 2rem (32px) |
| Tablet (768-1279px) | 8 | 1rem (16px) | 1.5rem (24px) |
| Mobile (<768px) | 1 | 0.75rem (12px) | 1rem (16px) |

### 4.2 Spacing Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| `space-xs` | 0.25rem (4px) | Related node links, icon gaps |
| `space-sm` | 0.5rem (8px) | Compact rhythm, metrics strips, log panels |
| `space-md` | 1rem (16px) | Card internal spacing |
| `space-lg` | 1.5rem (24px) | Inter-card relationships, structural cards |
| `space-xl` | 2.5rem (40px) | Major section separation |
| `gutter` | 1.5rem (24px) | Desktop grid gutters |
| `gutter-mobile` | 0.75rem (12px) | Mobile grid gutters |
| `margin` | 2rem (32px) | Desktop outer margins |
| `margin-mobile` | 1rem (16px) | Mobile outer margins |

### 4.3 Background Micro-Grid

- **Pattern**: 24px × 24px grid lines
- **Color**: `rgba(255, 255, 255, 0.02)`
- **Purpose**: Digital drafting-table grounding on outer canvas sections
- **Implementation**: CSS `background-image` with `linear-gradient`

---

## 5. Elevation & Depth System

### 5.1 Layer Stack

| Layer | Name | Background | Border | Backdrop Filter | Shadow |
|-------|------|------------|--------|-----------------|--------|
| 0 | Canvas Base | `#080B14` | None | None | None |
| 1 | Panels & Rails | `#0D1220` | 1px `rgba(255,255,255,0.06)` | None | None |
| 2 | Standard Containers | `#111827` | 1px `#1E293B` + inset top highlight | `blur(12px)` | None |
| 3 | Overlays & Slide-outs | `#0D1220` @ 80% | None | `blur(20px)` | `0 20px 40px -15px rgba(0,0,0,0.8)` |

### 5.2 Special Effects

- **Inset Top Highlight**: `box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.08)` on Layer 2 cards
- **Ambient Glow Fields**: Large radial gradients (`blur-3xl`) positioned off-screen for atmospheric depth
- **Specular Highlights**: 1px top border gradients (`from-transparent via-primary-container/40 to-transparent`)

---

## 6. Shape & Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `rounded-sm` | 0.125rem (2px) | Micro-buttons, nested tags |
| `rounded` / `DEFAULT` | 0.25rem (4px) | **Base** — form fields, micro-buttons, tabular tags, inline code |
| `rounded-md` | 0.375rem (6px) | Standard buttons |
| `rounded-lg` | 0.5rem (8px) | **Container** — cards, code viewports, modals, metric containers |
| `rounded-xl` | 0.75rem (12px) | **Surface** — full-screen flyouts, global toasts |
| `rounded-full` | 9999px | **Pill Exception** — status badges, radar scan pills, severity chips |

**Design Principle**: Compact, semi-sharp corners (`roundedness: 1`) projecting military-grade precision. Pill forms exclusively for status indicators to prevent confusion with rectangular inputs.

---

## 7. Component Specifications

### 7.1 Buttons

| Variant | Background | Text | Border | Hover | Active | Glow |
|---------|------------|------|--------|-------|--------|------|
| **Primary** | `#3B82F6` | `#FFFFFF` | 1px inset top `rgba(255,255,255,0.25)` | Intense glow `0 0 16px rgba(59,130,246,0.5)` | -5% brightness | `0 0 14px -2px rgba(59,130,246,0.4)` |
| **Secondary/Ghost** | Transparent | `#F8FAFC` | 1px `#1E293B` | BG `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.2)` | - | None |
| **Destructive** | `rgba(239,68,68,0.12)` | `#EF4444` | 1px `rgba(239,68,68,0.4)` | - | - | None |

### 7.2 Badge Pills & Severity Meters

- **Font**: `label-xs` (JetBrains Mono, 10px, 700)
- **Format**: Monospaced, high-contrast
- **Critical**: BG `rgba(239,68,68,0.15)`, text `#EF4444`, border `1px solid rgba(239,68,68,0.3)` + 6px pulsating dot
- **Warning**: BG `rgba(245,158,11,0.15)`, text `#F59E0B`, border `1px solid rgba(245,158,11,0.3)`
- **Secure/Info**: BG `rgba(16,185,129,0.15)`, text `#10B981`, border `1px solid rgba(16,185,129,0.3)`

### 7.3 Input Fields

- **Style**: Filled container
- **Background**: `#0D1220`
- **Border**: 1px `#1E293B`
- **Text**: `#F8FAFC`
- **Placeholder**: `#94A3B8`
- **Focus**: Border `#3B82F6` + outer ring `0 0 0 1px #3B82F6, 0 0 10px rgba(59,130,246,0.3)`
- **Monospace Variant**: For regex filters, secret exclusion masks

### 7.4 Checkboxes & Radio Buttons

- **Size**: 16px (checkbox square / radio circle)
- **Background**: `#0D1220`
- **Border**: 1px `#1E293B`
- **Checked**: `#3B82F6` fill + white checkmark + 4px glow aura

### 7.5 Cards & Container Panels

- **Base**: `#111827` fill
- **Radius**: `rounded-lg` (0.5rem / 8px)
- **Border**: Hairline `rgba(255,255,255,0.08)`
- **Interior Specular**: 1px top gradient fading `transparent → rgba(255,255,255,0.12) → transparent`

---

## 8. Specialized Domain Components

### 8.1 Radial Health Gauge
- **Structure**: Concentric SVG rings
- **Score Range**: 0-100
- **Color Gradient**: `#EF4444` (0) → `#10B981` (100)
- **Interior**: Illuminated readout with large numeric display
- **Sub-meters**: Horizontal progress bars for Dependencies, Secrets, IaC, Policy

### 8.2 Active Scanning Radar Beam
- **Visual**: Sub-pixel sweeping gradient overlay
- **CSS**: `conic-gradient(from 0deg, transparent 70%, rgba(59,130,246,0.3) 100%)`
- **Animation**: Continuous rotation signaling live pipeline checks
- **Applied To**: Repository analysis bars, scan progress indicators

### 8.3 Code Diff & Secret Redaction Stream
- **Viewer**: Dark monospace (JetBrains Mono)
- **Features**: Line numbers, syntax highlighting
- **Redaction**: `rgba(239,68,68,0.2)` fill with strike-through blur for secret placeholders
- **Diff Markers**: `-` (red/error) for removed, `+` (green/tertiary) for added

### 8.4 Pipeline Nodes Matrix (Scan Center)
- **Layout**: 4-column grid (Node 1-4)
- **States**: Success (green), Findings (amber/red), Running (blue pulse), Queued (muted)
- **Progress**: Animated gradient bars with percentage
- **Terminal Stream**: Real-time log with color-coded levels

### 8.5 Live Audit Stream (Dashboard)
- **Format**: Vertical list with left border accent (4px)
- **Border Colors**: Primary (webhook), Error (block), Secondary (secret), Outline (sync)
- **Timestamp**: Monospace, right-aligned
- **Content**: Structured narrative with code-formatted entities

---

## 9. Interaction & Animation Patterns

### 9.1 Micro-Interactions (Observed in HTML)

| Interaction | Trigger | Animation |
|-------------|---------|-----------|
| Time Range Toggle | Click button | Background color + text color transition (150ms) |
| Fast Audit Button | Click | Spin icon → "Running Telemetry..." → Checkmark → "14 Repos Audited" → Restore (3.8s total) |
| Scan Now Button | Click | "Queued" with spin → Toast "Triggered scan..." → Restore (4s) |
| Tab Switch | Click | Background + text color + shadow transition |
| Switch Toggle | Click | Handle translateX (0 ↔ 5) + background color |
| Modal Open | Button | Fade backdrop + slide up (200ms) |
| Toast Appear | Event | Slide up + fade in (300ms) |
| Terminal Log Stream | WebSocket | Auto-scroll, new lines fade in |
| Card Selection | Click | Border highlight + shadow elevation |
| Progress Bar | Scan progress | Width transition (500ms) + shimmer |
| Radar Pulse | Active scan | Continuous conic-gradient rotation |

### 9.2 Animation Tokens

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-emphasized: cubic-bezier(0.4, 0, 0, 1);
```

### 9.3 Reduced Motion
- All animations respect `prefers-reduced-motion: reduce`
- Instant transitions for critical state changes
- Disable pulse/radar animations

---

## 10. Data Visualization Patterns

### 10.1 Severity Distribution
- **Horizontal Stacked Bar**: 4 segments (Critical/High/Medium/Low) with percentage widths
- **Color-coded**: Error, Warning, Primary, Outline
- **Labels**: Count + severity name + context (SLA, backlog, info)

### 10.2 Trend Charts
- **Type**: Area + Line (SVG)
- **Dual Series**: Ingested (Blue) vs Mitigated (Green)
- **Time Range**: 30-day with D-30, D-20, D-10, Current markers
- **Gradients**: Vertical fade for area fills

### 10.3 Radial Gauges
- **Structure**: Outer track (muted) + Progress arc (colored) + Inner target ring (dashed primary)
- **Animation**: Stroke-dashoffset transition (1000ms ease-out)
- **Center**: Large numeric value + "/100" label

### 10.4 Progress Indicators
- **Linear**: Gradient bar (primary→tertiary→primary-container) with shimmer overlay
- **Circular**: SVG stroke-dasharray with rotate animation
- **Scan Nodes**: Stage-based with percentage + ETA

---

## 11. Responsive Behavior (Observed)

| Component | Desktop (≥1280px) | Tablet (768-1279px) | Mobile (<768px) |
|-----------|-------------------|---------------------|-----------------|
| Dashboard KPI | 4-col grid | 2-col grid | 1-col stack |
| Main Viz | 5/7 col split | Stacked | Stacked |
| Scan Table | Full width | Horizontal scroll | Horizontal scroll |
| Repository Cards | 2-col grid | 2-col grid | 1-col |
| Settings | 3-col nav + 9-col content | Stacked tabs | Stacked tabs |
| Findings | 5/7 col split | Stacked | Stacked |
| Modals | Centered max-w-2xl | Centered max-w-2xl | Full screen |
| Terminal | Fixed height | Fixed height | Fixed height |
| Typography | Full scale | Headline-lg-mobile | Headline-lg-mobile |

---

## 12. Accessibility Considerations

### 12.1 Color Contrast
- All text on surfaces meets WCAG AA (≥4.5:1)
- Status colors have text labels/icons (not color-only)
- Focus rings visible on all interactive elements

### 12.2 Keyboard Navigation
- Tab order follows visual hierarchy
- Focus visible on all interactive elements
- Skip links for main content
- Modal trap focus

### 12.3 Screen Readers
- Semantic HTML (table headers, landmarks)
- ARIA labels on icon-only buttons
- Live regions for toast notifications
- Status announcements for scan progress

### 12.4 Reduced Motion
- `prefers-reduced-motion` disables:
  - Radar sweep animation
  - Pulse indicators
  - Shimmer effects
  - Staggered entrances

---

## 13. Design Token Implementation (CSS Custom Properties)

```css
:root {
  /* Colors */
  --color-canvas: #080B14;
  --color-surface-1: #0D1220;
  --color-surface-2: #111827;
  --color-surface-3: #1C1F29;
  --color-primary: #3B82F6;
  --color-primary-glow: rgba(59, 130, 246, 0.4);
  --color-secondary: #8B5CF6;
  --color-tertiary: #10B981;
  --color-critical: #EF4444;
  --color-warning: #F59E0B;
  --color-success: #10B981;
  --color-text-primary: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-border: rgba(255,255,255,0.08);
  --color-border-strong: #1E293B;
  --color-focus-ring: #3B82F6;
  --color-focus-glow: rgba(59,130,246,0.3);

  /* Typography */
  --font-display: 'Geist', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-display-xl: clamp(2.5rem, 5vw, 3.5rem);
  --text-headline-lg: clamp(1.75rem, 3vw, 2.25rem);
  --text-headline-md: 1.5rem;
  --text-headline-sm: 1.125rem;
  --text-body-lg: 1rem;
  --text-body-md: 0.875rem;
  --text-body-sm: 0.75rem;
  --text-code-lg: 0.875rem;
  --text-code-md: 0.75rem;
  --text-code-sm: 0.6875rem;
  --text-label-md: 0.75rem;
  --text-label-xs: 0.625rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --gutter: 1.5rem;
  --gutter-mobile: 0.75rem;
  --margin: 2rem;
  --margin-mobile: 1rem;

  /* Radius */
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-elevated: 0 10px 40px -15px rgba(0,0,0,0.8);
  --shadow-glow-primary: 0 0 14px -2px rgba(59,130,246,0.4);
  --shadow-glow-critical: 0 0 16px -2px rgba(239,68,68,0.35);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 14. Component Inventory from Stitch Screens

### 14.1 Authentication Suite
- [x] Sign In Form (Email/Password + Show/Hide)
- [x] Sign Up Form (Name, Org, Email, Password + Strength Meter)
- [x] Forgot Password Form
- [x] GitHub Enterprise SSO Button
- [x] Tab Selector (Sign In / Sign Up / Forgot)
- [x] Password Visibility Toggle
- [x] Session Persistence Checkbox
- [x] MFA Toast Notification

### 14.2 Main Dashboard (Security Operations Center)
- [x] Top Context Ribbon (Telemetry status, sync latency)
- [x] SOC Header (Title, DEFCON level, Engine status badges)
- [x] Action Panel (Time Range Toggle, Env Filter Dropdown, Fast Audit CTA, Export PDF)
- [x] 4 KPI Strips (Monitored Repos, Total Scans, Critical CVEs, Leaked Secrets)
- [x] Security Health Gauge (Radial + Sub-meters)
- [x] Vulnerability Matrix (Severity cards + 30-day Trend Chart)
- [x] Active Scans Table (with inline progress for running scans)
- [x] Live Audit Stream (Color-coded left borders, timestamps)
- [x] CVE Spotlight with Code Diff Drawer
- [x] Remediation Action Buttons

### 14.3 Repository Management
- [x] Ambient Glow Header
- [x] Connect Repository Button + Bulk Sync Button
- [x] Filter Toolbar (Search, Language Select, Status Select)
- [x] Summary Counter Strip (4 Metric Cards)
- [x] Repository Cards (6 variants: Vulnerable, Scanning, Healthy, Critical Leak, Minor Notice, Secure Rust)
- [x] Card States: Header (icon, name, visibility, language/branch), Status Badge, Diagnostics, Diff Preview, Actions
- [x] Connect Repository Modal (Org selector, Repo list with toggles, Save/Cancel)
- [x] Toast Notifications

### 14.4 Scan Center
- [x] Strategic Control Strip (Runner cluster, Title, Description)
- [x] Quick Orchestration Bar (Repo Select, Branch Select, Profile Select, Initiate Scan)
- [x] Active Scan Hero (Target info, Status Meter, Global Progress Bar with Glow Sweep)
- [x] Pipeline Nodes Matrix (4 nodes: Clone, Trivy, Gitleaks, SBOM)
- [x] Telemetry Terminal (Color-coded logs, Tail mode, Clear button)
- [x] Scan Metrics Strip (4 Metric Cards: Active, Completed, Failed, Avg Latency)
- [x] Scan History Table (Tabs: All/Active/Completed/Flagged/Failed)
- [x] Pagination + Runner Pool Health

### 14.5 Scan Details / Security Reports
- [x] Simulation Notice Pill
- [x] Report Header (Breadcrumb, Title, Description, Actions: Export JSON, Re-run, PDF)
- [x] Scan Target Meta Panel (4-col: Repo, Runner, Timestamp, Engines)
- [x] Executive Security Score (Radial Gauge + Sub-meters)
- [x] Severity Distribution Matrix (4-col cards + Segmented Bar)
- [x] Micro Cards: Secrets (Clean), SBOM Summary
- [x] Engine Tabs (All, Trivy, Secrets, SBOM, Playbook)
- [x] Findings Table (Severity, Advisory, Package, Version, Fixed, CVSS, Status, Action)
- [x] Zero States: Secrets Clean, SBOM View
- [x] Remediation Playbook (Code Diff + Generate PR Button)
- [x] Compliance Sign-off (SOC2, PCI-DSS, CycloneDX)

### 14.6 Settings & Security Configuration
- [x] Mission Control Banner (Demo env, Workspace ID, Policy Sync status)
- [x] Left Nav Rail (5 Tabs: Account, GitHub, Notifications, Scanner, Danger)
- [x] Account Security: Hardware Keys (WebAuthn), Authenticator TOTP, Backup Codes, Session Timeout
- [x] GitHub Integration: Org Status, Scope Permissions, Pipeline Toggles (4 switches)
- [x] Notifications: Slack Card, PagerDuty Card, Email Briefing Toggle
- [x] Scanner Rules: CVSS Threshold Slider, Gitleaks Allowlist Editor (TOML)
- [x] Danger Zone: 3 Destructive Actions with Confirmation Modals
- [x] Floating Save Bar (Unsaved changes indicator)
- [x] Confirmation Modals (Type-to-confirm)

### 14.7 Team & Workspace Management
- [x] Top Banner (Demo env, Tenant ID)
- [x] Summary Cards (Members, Roles, MFA, Pending Invites)
- [x] Members Table (Search, Role Filter, MFA Filter, Toggle Empty State)
- [x] Member Rows (Avatar, Name/Handle, Role Badge, 2FA Status, Last Active, Actions)
- [x] Empty State + Pagination
- [x] Workspace Audit Trail (Color-coded dots, Immutable log)
- [x] Pending Invitations (Expire timers, Resend/Revoke)
- [x] Quick Invite Form (Email, GitHub Handle, Role Radio)
- [x] Full Invite Modal (Role cards with descriptions, Hardware 2FA Enforcement)
- [x] Toast Notifications

### 14.8 Vulnerability Management
- [x] Command Ribbon (Threat Surface Active, Severity Counter Buttons, View Toggle)
- [x] Filter Toolbar (Search, Engine Select, Status Select, More Filters)
- [x] Findings Stream (Left Pane, 5 cards with Active Selection State)
- [x] Deep Investigation Panel (Right Pane)
  - [x] Detail Header (CVE, Severity Badge, CWE, Target)
  - [x] Radial CVSS Gauge
  - [x] CVSS Vector Ribbon (Copy button + Decoded Grid)
  - [x] Threat Intelligence Narrative
  - [x] Component Breakdown Grid
  - [x] Automated Remediation (Code Diff + Generate PR)
  - [x] Action Triage Bar (Issue, Snooze, False Positive, Assignee)
- [x] Simulated States: Empty (Zero CVEs), Error (Engine Timeout)
- [x] Card Selection Interaction

---

## 15. Design System Gaps & Extensions Needed

### 15.1 Missing from Stitch but Required by PRD
| Component | PRD Reference | Notes |
|-----------|---------------|-------|
| Landing Page | §8.1 Public Screens | Marketing + feature overview |
| Password Recovery Flow | FR-01 | Email sent → Token validate → New password |
| Email Verification | FR-01 | Post-registration flow |
| Organization Creation Wizard | FR-03 | Multi-step: Name → Plan → Invite Members |
| GitHub App Installation Flow | FR-04 | Redirect to GitHub → Callback → Success |
| Repository Selection UI | FR-05 | Checklist with search, bulk select |
| Scan Comparison View | Should Have | Side-by-side scan diff |
| Finding Status Workflow UI | Should Have | Kanban or detailed status transition |
| Repository Analytics | Should Have | Trends, historical comparisons |
| Notification Center | FR-20 | Bell icon + dropdown + history |
| User Profile/Settings | §8.1 Account | Avatar, name, email, password, sessions |
| API Key Management | Not in Stitch | For CI/CD integrations |
| Dark/Light Toggle | Not in Stitch | Currently dark-only |

### 15.2 Components Needing Variants
| Component | Additional Variants Needed |
|-----------|---------------------------|
| Button | Icon-only (compact), Loading with progress, Disabled with tooltip |
| Table | Column resizing, Row expansion, Multi-sort, Column visibility |
| Modal | Confirmation (destructive), Form (multi-step), Full-screen |
| Toast | Actionable (undo), Progress (long operations), Persistent |
| Select | Multi-select, Searchable, Grouped options, Async load |
| Input | Masked (secrets), Regex validation, Async validation |
| Card | Expandable, Draggable, Selectable (multi), Loading skeleton |

### 15.3 New Components for MVP
- **Webhook Events Log**: Table with signature verification status
- **Scan Queue Visualization**: Real-time Celery queue depth
- **Worker Health Monitor**: Heartbeat, capacity, assigned tasks
- **Tenant Isolation Test UI**: Admin-only cross-tenant access verification
- **Retention Policy Manager**: Configure cleanup schedules
- **Audit Export**: JSON/CSV with cryptographic signature

---

## 16. Design Consistency Checklist

### 16.1 Verified Consistent
- [x] Color tokens used across all screens
- [x] Typography scale applied consistently
- [x] Spacing tokens (space-xs through space-xl) used throughout
- [x] Border radius system (sm → xl → full) followed
- [x] Elevation layers (0-3) correctly implemented
- [x] Glass morphism backdrop filters on Layer 2/3
- [x] Luminescent glow on critical/primary actions
- [x] Monospace for all technical data (SHAs, CVEs, versions)
- [x] Uppercase label-xs for severity/status badges
- [x] Pill shape exclusively for status indicators
- [x] 12-col grid with responsive breakpoints
- [x] Micro-interaction patterns (toggle, tab, modal, toast)

### 16.2 Minor Inconsistencies Noted
| Issue | Location | Recommendation |
|-------|----------|----------------|
| Some buttons use `rounded-lg` others `rounded` | Various | Standardize: `rounded-lg` for primary actions, `rounded` for secondary |
| Toast implementations vary slightly | Auth, Team, Settings, Vuln Mgmt | Create single `Toast` component with variants |
| Modal backdrop blur values differ | Connect Repo (blur-md), Invite (blur-md), Danger (blur-sm) | Standardize to `backdrop-blur-xl` for all |
| Focus ring styles inconsistent | Some use outline, others box-shadow | Use consistent `focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface` |
| Empty state illustrations missing | Repo Management, Team, Findings | Add consistent empty state illustrations |

---

## 17. Implementation Priority for Design System

### Phase 1 (Foundation)
1. CSS Custom Properties (all tokens)
2. Tailwind config extending design tokens
3. Atomic components: Button, Input, Badge, Card, Avatar, Checkbox, Radio, Switch
4. Typography utility classes
5. Layout primitives: Grid, Flex, Container

### Phase 2 (Molecules)
1. Form components: Select, Textarea, SearchInput, FilterToolbar
2. Data display: Table, Progress, RadialGauge, CodeBlock, ScanProgressBar
3. Feedback: Toast, Modal, Tooltip, Skeleton, EmptyState
4. Navigation: Tabs, Dropdown, Breadcrumb, Pagination

### Phase 3 (Organisms)
1. Domain components per screen mapping
2. Real-time components: TelemetryTerminal, LiveAuditStream
3. Complex forms: GitleaksAllowlistEditor, InviteModal
4. Data visualization: SeverityDistribution, TrendChart, VulnerabilityMatrix

### Phase 4 (Polish)
1. Animation library (Framer Motion integration)
2. Reduced motion support
3. Accessibility audit + fixes
4. Storybook documentation
5. Visual regression testing