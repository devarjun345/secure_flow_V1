---
name: Cyber Command Glass
colors:
  surface: '#10131c'
  surface-dim: '#10131c'
  surface-bright: '#363943'
  surface-container-lowest: '#0b0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#272a34'
  surface-container-highest: '#32343f'
  on-surface: '#e0e2ef'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e0e2ef'
  inverse-on-surface: '#2d303a'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#10131c'
  on-background: '#e0e2ef'
  surface-variant: '#32343f'
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-precision, mission-critical DevSecOps control plane. Engineered for security engineers, DevSecOps leads, and infrastructure architects, the interface balances immense data density with immediate cognitive clarity. The aesthetic fuses a dark tactical command center with modern enterprise refinement: deliberate, hyper-focused, and unyielding. 

Visual characteristics include:
- **Atmospheric Depth:** Deep-space dark foundations layered with calibrated glass surfaces and low-noise grid patterns.
- **Luminescent Signaling:** Strategic glow effects and saturated status accents (Electric Blue, Cyber Violet, Crimson, Amber, Emerald) against near-black backdrops to instantly expose critical threat vectors without UI fatigue.
- **Engineered Precision:** Crisp hairline dividers, strict monospaced data alignment for cryptographic signatures, and technical micro-indicators mimicking radar sweeps and scanning states.

## Colors

The palette operates in high-contrast dark mode to deliver high legibility under continuous operational monitoring.

### Hierarchy & Functional Roles
- **Base Canvas (`#080B14`):** Canvas floor for all root views, reducing eye strain across prolonged threat-hunting workflows.
- **Surface Layer 1 (`#0D1220`):** Persistent layout rails, top navigation bars, and grouped toolbars.
- **Surface Layer 2 (`#111827`):** Elevated cards, metric tiles, and inspection panels.
- **Primary Brand Accent (`#3B82F6`):** Interactive actions, active selection tabs, and system state focus rings with an ambient glow (`rgba(59, 130, 246, 0.4)`).
- **Secondary Accent (`#8B5CF6`):** Machine intelligence recommendations, automated remediations, and secondary workflow flows.
- **Telemetry & Threat Statuses:**
  - **Critical / CVE (`#EF4444`):** Immediate blockers, active secret leaks, and severe vulnerabilities.
  - **Warning (`#F59E0B`):** Deprecation warnings, policy bypasses, and pending remediation thresholds.
  - **Success / Secure (`#10B981`):** Compliant branches, green pipelines, and resolved findings.
- **Typography & Structure:** Text Primary (`#F8FAFC`), Text Muted (`#94A3B8`), and structural borders calibrated to `rgba(255, 255, 255, 0.08)` or `#1E293B`.

## Typography

The typographic hierarchy distinguishes narrative instruction from technical machine output.

- **Primary Proportional Types (`Geist` / `Inter`):** Deliver neutral readability across dashboards, configuration forms, and vulnerability summaries. Geist provides sharp, geometric authority at display and headline scales, while Inter maintains legibility across tight multi-column grids.
- **Monospace Telemetry (`JetBrains Mono`):** Applied systematically to all computational data: commit SHAs, CVE identifiers (e.g., `CVE-2024-3094`), dependency versions, raw payload traces, and runtime scan duration timers.
- **Case Conventions:** Upper-case transformation is reserved exclusively for `label-xs` tokens within severity badges, posture indicators, and table header categorizations to reinforce tactical legibility.

## Layout & Spacing

The layout is built upon an adaptive 12-column fluid grid configured for high-density information displays.

- **Grid Architecture:** 12 columns on desktop (`>= 1280px`) with `1.5rem` gutters and `2rem` outer margins; collapsing to 8 columns on tablet (`768px - 1279px`) with `1rem` gutters; and a single-column layout on mobile (`< 768px`) with `0.75rem` gutters and `1rem` edge margins.
- **Density Management:** Metrics strips and log panels maintain a compact rhythm using `space-xs` (4px) and `space-sm` (8px) for related node links. Structural cards and overview dashboards utilize `space-md` (16px) internally and `space-lg` (24px) for inter-card relationships.
- **Background Micro-Grid:** Outer canvas sections incorporate an ultra-subtle, non-distracting CSS background grid pattern (`24px x 24px` grid lines rendered with `rgba(255, 255, 255, 0.02)`), establishing a digital drafting-table grounding.

## Elevation & Depth

Visual hierarchy is constructed through luminous glass overlays, physical surface stacking, and specialized accent glows rather than heavy opaque drop shadows.

- **Layer 0 (Canvas Base):** Solid `#080B14`. Non-elevated.
- **Layer 1 (Panels & Rails):** `#0D1220` with a 1px solid structural border (`rgba(255, 255, 255, 0.06)`).
- **Layer 2 (Standard Containers & Cards):** `#111827` blended with `backdrop-filter: blur(12px)` and a composite border: `1px solid #1E293B` featuring an inset top highlight (`box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.08)`).
- **Layer 3 (Overlays & Slide-outs):** Translucent `#0D1220` with 80% opacity, `backdrop-filter: blur(20px)`, and cast shadow `0 20px 40px -15px rgba(0, 0, 0, 0.8)`.
- **Luminescence & Glow:** Threat statuses and selected states project soft outward glows. An active critical alert carries `box-shadow: 0 0 16px -2px rgba(239, 68, 68, 0.35)`, while primary actions feature `box-shadow: 0 0 14px -2px rgba(59, 130, 246, 0.4)`.

## Shapes

The interface embraces a compact, semi-sharp corner radius (`roundedness: 1`), projecting military-grade precision and enterprise tooling rigor.

- **Base Radius (0.25rem / 4px):** Applied to form fields, nested micro-buttons, tabular tags, and inline code blocks.
- **Container Radius (`rounded-lg` / 0.5rem / 8px):** Standard for cards, code inspection viewports, modals, and metric grouping containers.
- **Surface Radius (`rounded-xl` / 0.75rem / 12px):** Applied exclusively to full-screen flyout panels and global toast notifications.
- **Pill Exception (9999px):** Status badges, live radar scan pills, and severity chips override standard shape constraints with full pill forms to prevent visual confusion with rectangular interactive inputs.

## Components

### Buttons
- **Primary:** Solid `#3B82F6` with `#FFFFFF` text. Micro 1px inset top border of `rgba(255, 255, 255, 0.25)`. Hover triggers an intense glow `box-shadow: 0 0 16px rgba(59, 130, 246, 0.5)`. Active drops brightness by 5%.
- **Secondary / Ghost:** Transparent background with `1px solid #1E293B`, `#F8FAFC` text. Hover transitions background to `rgba(255, 255, 255, 0.05)` and border to `rgba(255, 255, 255, 0.2)`.
- **Destructive / Remediate:** Dark crimson background `rgba(239, 68, 68, 0.12)` with `1px solid rgba(239, 68, 68, 0.4)` and `#EF4444` text.

### Badge Pills & Severity Meters
- Monospaced, high-contrast indicators (`label-xs`).
- **Critical:** Background `rgba(239, 68, 68, 0.15)`, text `#EF4444`, border `1px solid rgba(239, 68, 68, 0.3)`. Includes a pulsating 6px circular dot indicator.
- **Warning / Medium:** Background `rgba(245, 158, 11, 0.15)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.3)`.
- **Secure / Info:** Background `rgba(16, 185, 129, 0.15)`, text `#10B981`, border `1px solid rgba(16, 185, 129, 0.3)`.

### Input Fields
- Filled container style with `#0D1220` background, `1px solid #1E293B`, and `#F8FAFC` input text. Placeholder set to `#94A3B8`.
- Focus state switches border to `#3B82F6` and adds an outer ring `0 0 0 1px #3B82F6, 0 0 10px rgba(59, 130, 246, 0.3)`.
- Monospace variant used for regex vulnerability matching filters and secret exclusion masks.

### Checkboxes & Radio Buttons
- 16px squares (checkbox) or circles (radio) with `#0D1220` fill and `1px solid #1E293B`.
- Checked state transitions to `#3B82F6` with high-contrast white glyph checkmark and a localized 4px glow aura.

### Cards & Container Panels
- Base `#111827` fill, `0.5rem` rounded corners, and perimeter hairline stroke `rgba(255, 255, 255, 0.08)`.
- Features an interior top gradient specular line (`1px height`, fading from transparent to `rgba(255, 255, 255, 0.12)` to transparent).

### Specialized Domain Components
- **Radial Health Gauge:** Concentric SVG rings depicting security posture score (0-100), utilizing color gradients transitioning from `#EF4444` to `#10B981` with an interior illuminated readout.
- **Active Scanning Radar Beam:** Sub-pixel sweeping gradient overlay across repository analysis bars (`conic-gradient(from 0deg, transparent 70%, rgba(59, 130, 246, 0.3) 100%)`) signaling live pipeline checks.
- **Code Diff & Secret Redaction Stream:** Dark monospace viewer featuring line numbers, syntax highlighting, and redacted secret placeholders (`rgba(239, 68, 68, 0.2)` fill with strike-through blur).