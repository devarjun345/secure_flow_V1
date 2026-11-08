export const FINDING_CATEGORIES = ['dependency', 'secret', 'iac', 'policy', 'container'] as const;
export type FindingCategory = (typeof FINDING_CATEGORIES)[number];

export const FINDING_CATEGORY_LABELS: Record<FindingCategory, string> = {
  dependency: 'Dependency',
  secret: 'Secret',
  iac: 'IaC',
  policy: 'Policy',
  container: 'Container',
};

export const FINDING_STATUSES = ['open', 'acknowledged', 'resolved', 'accepted_risk', 'false_positive'] as const;
export type FindingStatus = (typeof FINDING_STATUSES)[number];

export const FINDING_STATUS_LABELS: Record<FindingStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
  accepted_risk: 'Accepted Risk',
  false_positive: 'False Positive',
};

export const FINDING_ENGINES = ['trivy', 'gitleaks', 'semgrep', 'checkov'] as const;
export type FindingEngine = (typeof FINDING_ENGINES)[number];