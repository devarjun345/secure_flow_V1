'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={cn('min-h-screen bg-canvas flex flex-col')}>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="border-t border-border py-6 px-4">
        <p className="text-center text-body-sm text-text-muted">
          SecureFlow &copy; {new Date().getFullYear()} - DevSecOps Platform
        </p>
      </footer>
    </div>
  );
}