'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card as UICard } from '@/components/ui/Card';
import { ShieldIcon, KeyIcon, LayersIcon, FileTextIcon } from 'lucide-react';

export interface SecurityHealthGaugeProps {
  score: number;
  maxScore?: number;
  grade?: string;
  breakdown: {
    dependencies: number;
    secrets: number;
    iac: number;
    policy: number;
  };
  className?: string;
  showGrade?: boolean;
  showSubMetrics?: boolean;
  animate?: boolean;
}

const SUB_METRICS = [
  { key: 'dependencies', label: 'Dependencies', icon: <LayersIcon className="w-4 h-4" />, color: 'primary' },
  { key: 'secrets', label: 'Secrets', icon: <KeyIcon className="w-4 h-4" />, color: 'tertiary' },
  { key: 'iac', label: 'IaC', icon: <FileTextIcon className="w-4 h-4" />, color: 'secondary' },
  { key: 'policy', label: 'Policy', icon: <ShieldIcon className="w-4 h-4" />, color: 'primary' },
] as const;

export function SecurityHealthGauge({
  score,
  maxScore = 100,
  grade = 'A+',
  breakdown,
  className,
  showGrade = true,
  showSubMetrics = true,
  animate = true,
}: SecurityHealthGaugeProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));

  const getGaugeColor = (value: number) => {
    if (value >= 90) return 'success';
    if (value >= 70) return 'warning';
    if (value >= 50) return 'warning';
    return 'critical';
  };

  const gaugeVariant = getGaugeColor(percentage);

  return (
    <UICard className={cn('p-6 lg:p-8 flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-text-muted uppercase tracking-wider">Postural Defense Grade</p>
          <h2 className="text-headline-sm font-display font-semibold text-text-primary mt-1">
            Overall Security Score
          </h2>
        </div>
        {showGrade && (
          <span className="px-3 py-1.5 rounded bg-tertiary/10 text-tertiary font-mono text-code-sm font-bold">
            GRADE {grade}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={percentage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: animate ? 0.5 : 0, ease: 'easeOut' }}
          className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: animate ? 0.8 : 0, delay: 0.2, ease: 'easeOut' }}
            className="relative w-44 h-44 flex items-center justify-center shrink-0"
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                className="text-surface-3"
                cx="80"
                cy="80"
                fill="none"
                opacity="0.3"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
              />
              <motion.circle
                className={cn(
                  'transition-all duration-1000 ease-out',
                  gaugeVariant === 'success' && 'text-success',
                  gaugeVariant === 'warning' && 'text-warning',
                  gaugeVariant === 'critical' && 'text-critical'
                )}
                cx="80"
                cy="80"
                fill="none"
                r="70"
                stroke="currentColor"
                strokeDasharray="439.8"
                strokeDashoffset={439.8 * (1 - percentage / 100)}
                strokeLinecap="round"
                strokeWidth="10"
                initial={{ strokeDashoffset: 439.8 }}
                animate={{ strokeDashoffset: 439.8 * (1 - percentage / 100) }}
                transition={{ duration: animate ? 1.5 : 0, delay: 0.3, ease: 'easeOut' }}
              />
              <circle
                className="text-primary"
                cx="80"
                cy="80"
                fill="none"
                opacity="0.4"
                r="56"
                stroke="currentColor"
                strokeDasharray="4 6"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                className="text-display-xl font-display font-bold text-text-primary leading-none tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: animate ? 0.5 : 0, delay: 0.8 }}
              >
                {percentage}
              </motion.span>
              <span className="text-label-xs text-text-muted uppercase tracking-wider mt-1">
                out of 100
              </span>
            </div>
          </motion.div>

          {showSubMetrics && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: animate ? 0.5 : 0, delay: 0.4 }}
              className="flex flex-col gap-3 w-full sm:w-auto"
            >
              {SUB_METRICS.map((metric) => (
                <motion.div
                  key={metric.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: animate ? 0.3 : 0, delay: 0.5 + SUB_METRICS.indexOf(metric) * 0.1 }}
                  className="p-3 rounded-lg bg-surface-1 flex flex-col gap-0.5"
                >
                  <div className="flex justify-between font-label-xs text-label-xs">
                    <span className="flex items-center gap-1.5 text-text-muted">
                      {metric.icon}
                      {metric.label}
                    </span>
                    <span className={cn(
                      'font-bold',
                      breakdown[metric.key as keyof typeof breakdown] >= 90 ? 'text-success' :
                      breakdown[metric.key as keyof typeof breakdown] >= 70 ? 'text-warning' :
                      'text-text-primary'
                    )}>
                      {breakdown[metric.key as keyof typeof breakdown]}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000 ease-out',
                        metric.color === 'primary' && 'bg-primary',
                        metric.color === 'tertiary' && 'bg-tertiary',
                        metric.color === 'secondary' && 'bg-secondary'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${breakdown[metric.key as keyof typeof breakdown]}%` }}
                      transition={{ duration: animate ? 1 : 0, delay: 0.6 + SUB_METRICS.indexOf(metric) * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </UICard>
  );
}

export interface SecurityHealthGaugeCompactProps {
  score: number;
  breakdown?: {
    dependencies: number;
    secrets: number;
    iac: number;
    policy: number;
  };
  className?: string;
}

export function SecurityHealthGaugeCompact({
  score,
  breakdown,
  className,
}: SecurityHealthGaugeCompactProps) {
  return (
    <UICard className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-label-md text-text-muted">Security Health</p>
          <h3 className="text-headline-sm font-display font-bold text-text-primary">
            Overall Score
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-code-sm font-bold">
          {score}/100
        </span>
      </div>

      <div className="h-4 rounded-full bg-surface-1 overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            score >= 90 && 'bg-success',
            score >= 70 && score < 90 && 'bg-warning',
            score < 70 && 'bg-critical'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {breakdown && (
        <div className="grid grid-cols-2 gap-3 pt-4">
          {[
            { label: 'Dependencies', value: breakdown.dependencies, color: 'primary' },
            { label: 'Secrets', value: breakdown.secrets, color: 'tertiary' },
            { label: 'IaC', value: breakdown.iac, color: 'secondary' },
            { label: 'Policy', value: breakdown.policy, color: 'primary' },
          ].map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex justify-between font-label-xs text-label-xs">
                <span className="text-text-muted">{metric.label}</span>
                <span className="font-mono text-text-primary">{metric.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-1 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 ease-out',
                    metric.color === 'primary' && 'bg-primary',
                    metric.color === 'tertiary' && 'bg-tertiary',
                    metric.color === 'secondary' && 'bg-secondary'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </UICard>
  );
}