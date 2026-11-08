import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const organizationNameSchema = z
  .string()
  .min(2, 'Organization name must be at least 2 characters')
  .max(100, 'Organization name must be less than 100 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: nameSchema,
  organizationName: organizationNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const repositoryFilterSchema = z.object({
  search: z.string().optional(),
  language: z.string().optional(),
  status: z.enum(['all', 'enabled', 'disabled', 'scanning', 'vulnerable', 'critical']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'lastScanned', 'vulnerabilities', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const scanFilterSchema = z.object({
  repositoryId: z.string().optional(),
  status: z.enum(['all', 'queued', 'running', 'completed', 'failed', 'timeout', 'flagged']).optional(),
  triggerType: z.enum(['all', 'manual', 'webhook', 'scheduled']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['startedAt', 'completedAt', 'duration', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const findingFilterSchema = z.object({
  repositoryId: z.string().optional(),
  scanId: z.string().optional(),
  severity: z.enum(['all', 'critical', 'high', 'medium', 'low', 'unknown', 'info']).optional(),
  category: z.enum(['all', 'dependency', 'secret', 'iac', 'policy']).optional(),
  status: z.enum(['all', 'open', 'acknowledged', 'resolved', 'accepted_risk', 'false_positive']).optional(),
  fixable: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['severity', 'firstSeen', 'lastSeen', 'package', 'file']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RepositoryFilterInput = z.infer<typeof repositoryFilterSchema>;
export type ScanFilterInput = z.infer<typeof scanFilterSchema>;
export type FindingFilterInput = z.infer<typeof findingFilterSchema>;