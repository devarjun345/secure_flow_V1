'use client';

import { PageHeader, SectionHeader } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ShieldIcon, KeyIcon, Trash2Icon, PlusIcon, KeyRoundIcon } from 'lucide-react';


export default function SettingsAccountPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Account Security"
        description="Manage your authentication methods, sessions, and security preferences"
        icon={<ShieldIcon className="w-6 h-6" />}
      />

      <Card>
        <SectionHeader title="Hardware Security Keys" description="WebAuthn/FIDO2 security keys for passwordless authentication" />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <KeyIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">YubiKey 5 NFC</p>
                <p className="text-body-sm text-text-muted">Added Jan 15, 2024 • Last used 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" dot>Active</Badge>
              <Button variant="ghost" size="sm" className="text-critical hover:text-critical">
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <KeyIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Google Titan Key</p>
                <p className="text-body-sm text-text-muted">Added Dec 20, 2023 • Last used 3 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm" dot>Active</Badge>
              <Button variant="ghost" size="sm" className="text-critical hover:text-critical">
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button variant="secondary" className="w-full gap-2" size="sm">
            <PlusIcon className="w-4 h-4" />
            Add Security Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader title="Authenticator App (TOTP)" description="Time-based one-time passwords for two-factor authentication" />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Microsoft Authenticator</p>
                <p className="text-body-sm text-text-muted">Enabled Jan 15, 2024</p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>Enabled</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" className="gap-2" size="sm">
              <KeyRoundIcon className="w-4 h-4" />
              Show Backup Codes
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-critical hover:text-critical">
              <Trash2Icon className="w-4 h-4" />
              Disable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader title="Backup Codes" description="One-time use codes for account recovery" />
        <CardContent className="space-y-4">
          <p className="text-body-sm text-text-muted">You have 8 backup codes remaining. Store them securely.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-surface-1 font-mono text-code-sm text-text-primary text-center border border-border">
                {Math.random().toString(36).slice(2, 10).toUpperCase()}
              </div>
            ))}
          </div>
          <Button variant="secondary" className="gap-2" size="sm">
            <KeyRoundIcon className="w-4 h-4" />
            Regenerate Codes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <SectionHeader title="Session Timeout" description="Automatically sign out after inactivity" />
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              label="Timeout (minutes)"
              type="number"
              defaultValue="60"
              className="w-32"
            />
            <p className="text-body-sm text-text-muted">Set to 0 to disable auto-timeout</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}