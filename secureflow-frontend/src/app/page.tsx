'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { ShieldIcon, GitBranchIcon, PlayCircleIcon, AlertTriangleIcon, FileTextIcon, UsersIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: GitBranchIcon,
      title: 'GitHub Integration',
      description: 'Connect your GitHub repositories in minutes. SecureFlow installs as a GitHub App with minimal permissions.',
    },
    {
      icon: PlayCircleIcon,
      title: 'Automated Scanning',
      description: 'Trigger scans on every pull request, push, or schedule. Powered by Trivy and Gitleaks for comprehensive coverage.',
    },
    {
      icon: AlertTriangleIcon,
      title: 'Vulnerability Management',
      description: 'Centralized findings dashboard with severity classification, CVSS scoring, and remediation guidance.',
    },
    {
      icon: ShieldIcon,
      title: 'Secret Detection',
      description: 'Detect leaked API keys, passwords, tokens, and other secrets before they reach production.',
    },
    {
      icon: FileTextIcon,
      title: 'Executive Reports',
      description: 'Generate compliance-ready security reports with executive summaries, trend analysis, and remediation tracking.',
    },
    {
      icon: UsersIcon,
      title: 'Team Collaboration',
      description: 'Role-based access control, audit trails, and workspace management for secure team collaboration.',
    },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <nav className="top-nav fixed top-0 left-0 right-0 z-30 h-16 glass-panel border-b border-border flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-8 w-full max-w-screen-2xl mx-auto">
          <Link href="/" className="flex items-center gap-2" aria-label="SecureFlow Home">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-headline-sm text-text-primary">SecureFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-body-md text-text-muted hover:text-text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-body-md text-text-muted hover:text-text-primary transition-colors">Pricing</Link>
            <Link href="/docs" className="text-body-md text-text-muted hover:text-text-primary transition-colors">Docs</Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col pt-16">
        <section className="relative flex-1 flex items-center justify-center px-4 lg:px-6 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-micro-grid bg-grid-24 opacity-50" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" aria-hidden="true" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-body-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span>Now with GitHub App integration & real-time scanning</span>
            </div>
            <h1 className="text-display-xl font-display font-bold text-text-primary mb-6">
              Automated DevSecOps for{' '}
              <span className="text-primary">Continuous Vulnerability Detection</span>
            </h1>
            <p className="text-body-lg text-text-muted mb-10 max-w-2xl mx-auto">
              SecureFlow connects to your GitHub repositories, orchestrates security scans via Trivy and Gitleaks,
              and presents findings in a mission-control dashboard. Ship secure code faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="secondary" size="lg">View Documentation</Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 text-body-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 lg:py-32 px-4 lg:px-6 bg-surface-1/30">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-display font-bold text-text-primary mb-4">
                Everything you need for{' '}
                <span className="text-primary">DevSecOps</span>
              </h2>
              <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
                Comprehensive security scanning integrated into your development workflow
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <article
                  key={index}
                  className="card rounded-lg p-6 hover:border-primary/50 hover:shadow-glow-primary transition-all duration-normal"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-headline-sm font-display font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-md text-text-muted">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32 px-4 lg:px-6">
          <div className="max-w-screen-2xl mx-auto">
            <div className="card rounded-lg p-8 lg:p-12 bg-gradient-to-br from-surface-2 to-surface-3">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-headline-lg font-display font-bold text-text-primary mb-4">
                    Ready to secure your codebase?
                  </h2>
                  <p className="text-body-lg text-text-muted mb-8">
                    Join hundreds of teams using SecureFlow to automate vulnerability detection
                    and ship secure code with confidence.
                  </p>
                  <Link href="/register">
                    <Button size="lg" className="gap-2 w-full sm:w-auto">
                      Start Free Trial
                      <ArrowRightIcon className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-surface-1">
                    <div className="text-display-xl font-display font-bold text-primary">500+</div>
                    <div className="text-body-sm text-text-muted">Repositories Scanned</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-1">
                    <div className="text-display-xl font-display font-bold text-primary">12K+</div>
                    <div className="text-body-sm text-text-muted">Vulnerabilities Found</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-1">
                    <div className="text-display-xl font-display font-bold text-primary">99.9%</div>
                    <div className="text-body-sm text-text-muted">Uptime SLA</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-1">
                    <div className="text-display-xl font-display font-bold text-primary">2min</div>
                    <div className="text-body-sm text-text-muted">Average Scan Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-4 lg:px-6 bg-surface-1/30">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4" aria-label="SecureFlow Home">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-headline-sm text-text-primary">SecureFlow</span>
              </Link>
              <p className="text-body-sm text-text-muted">
                Automated DevSecOps platform for continuous vulnerability detection.
              </p>
            </div>
            <div>
              <h4 className="text-label-md text-text-primary mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-body-sm text-text-muted hover:text-text-primary">Features</Link></li>
                <li><Link href="#pricing" className="text-body-sm text-text-muted hover:text-text-primary">Pricing</Link></li>
                <li><Link href="/docs" className="text-body-sm text-text-muted hover:text-text-primary">Documentation</Link></li>
                <li><Link href="/changelog" className="text-body-sm text-text-muted hover:text-text-primary">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-label-md text-text-primary mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-body-sm text-text-muted hover:text-text-primary">About</Link></li>
                <li><Link href="/blog" className="text-body-sm text-text-muted hover:text-text-primary">Blog</Link></li>
                <li><Link href="/careers" className="text-body-sm text-text-muted hover:text-text-primary">Careers</Link></li>
                <li><Link href="/contact" className="text-body-sm text-text-muted hover:text-text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-label-md text-text-primary mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-body-sm text-text-muted hover:text-text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-body-sm text-text-muted hover:text-text-primary">Terms of Service</Link></li>
                <li><Link href="/security" className="text-body-sm text-text-muted hover:text-text-primary">Security</Link></li>
                <li><Link href="/cookies" className="text-body-sm text-text-muted hover:text-text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-text-muted">
              &copy; {new Date().getFullYear()} SecureFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/secureflow" className="text-text-muted hover:text-text-primary transition-colors" aria-label="GitHub">
                <GitBranchIcon className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/secureflow" className="text-text-muted hover:text-text-primary transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="https://linkedin.com/company/secureflow" className="text-text-muted hover:text-text-primary transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}