export interface SettingsState {
  account: AccountSettings;
  github: GitHubSettings;
  notifications: NotificationSettings;
  scanner: ScannerSettings;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export interface AccountSettings {
  hardwareKeys: HardwareKey[];
  totpEnabled: boolean;
  backupCodes: string[];
  sessionTimeoutMinutes: number;
}

export interface HardwareKey {
  id: string;
  name: string;
  credentialId: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface GitHubSettings {
  installationId?: number;
  organizationName?: string;
  scopes: string[];
  pipelineToggles: {
    autoScanPRs: boolean;
    autoScanPush: boolean;
    publishChecks: boolean;
    failBuildOnCritical: boolean;
  };
}

export interface NotificationSettings {
  slack: SlackIntegration;
  pagerduty: PagerDutyIntegration;
  email: EmailIntegration;
}

export interface SlackIntegration {
  enabled: boolean;
  webhookUrl?: string;
  channel?: string;
  events: string[];
}

export interface PagerDutyIntegration {
  enabled: boolean;
  integrationKey?: string;
  serviceId?: string;
  events: string[];
}

export interface EmailIntegration {
  enabled: boolean;
  recipients: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  events: string[];
}

export interface ScannerSettings {
  cvssThreshold: number;
  gitleaksAllowlist: string;
  enabledEngines: string[];
}