// src/schemas/index.ts
// Centralized Zod input-validation schemas for API route boundaries.
// Every external input (body, query, route param, uploaded file metadata)
// should be parsed by one of these before use.
import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(3, 'Email is required')
  .email('Invalid email address')
  .max(254, 'Email is too long');

export const jobIdParamSchema = z.object({
  job_id: z
    .string()
    .regex(/^\d+$/, 'Invalid job_id format')
    .transform((v) => Number(v)),
});

export const applicationIdParamSchema = z.object({
  id: z.string().min(1, 'Application id is required'),
});

const jobStatusSchema = z
  .enum(['pending', 'approved', 'rejected'])
  .optional();

export const createJobSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(200),
  company: z.string().trim().min(1, 'Company is required').max(200),
  location: z.string().trim().max(200).nullable().optional(),
  type: z.string().trim().min(1, 'Job type is required').max(50),
  experience_level: z.string().trim().max(50).optional(),
  salary_range: z.string().trim().max(100).nullable().optional(),
  description: z.string().trim().max(20000).optional(),
  requirements: z.array(z.string().trim().max(1000)).default([]),
  benefits: z.array(z.string().trim().max(1000)).default([]),
  skills: z.array(z.string().trim().max(200)).default([]),
  remote: z.boolean().default(false),
  featured: z.boolean().default(false),
  contact_email: emailSchema.optional(),
  application_url: z.string().trim().url('Invalid application URL').optional().or(z.literal('')),
  slug: z.string().trim().min(1, 'Slug is required').max(200),
  status: jobStatusSchema,
  company_size: z.string().trim().max(100).optional(),
  work_authorization: z.array(z.string().trim().max(100)).optional(),
  application_deadline: z.string().trim().optional(),
  company_logo_url: z.string().trim().max(500).url().optional().or(z.literal('')),
  seniority_level: z.string().trim().max(50).optional(),
  employment_status: z.string().trim().max(50).optional(),
  posted_date: z.string().trim().optional(),
  updated_date: z.string().trim().optional(),
  owner_id: z.string().trim().optional(),
});

export const applicationStageSchema = z.object({
  pipeline_stage: z.enum([
    'application',
    'review',
    'shortlisted',
    'interview',
    'offer',
    'hired',
    'rejected',
  ]),
});

export const addNoteSchema = z.object({
  note: z.string().trim().min(1, 'Note is required').max(5000),
});

export const startupSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(150),
  description: z.string().trim().min(10, 'Description is required').max(3000),
  fullDescription: z.string().trim().max(20000).optional().or(z.literal('')),
  industry: z.string().trim().min(1).max(100),
  size: z.string().trim().min(1).max(100),
  fundingStage: z.string().trim().min(1).max(100),
  foundedDate: z.string().trim().min(1, 'Founded date is required').max(50),
  location: z.string().trim().min(1, 'Location is required').max(200),
  websiteUrl: z.string().trim().url('Invalid website URL').max(500),
  logoUrl: z.string().trim().max(500).url().optional().or(z.literal('')),
  contactEmail: emailSchema,
  contactName: z.string().trim().min(1, 'Contact name is required').max(150),
  ownerId: z.string().trim().max(255).optional(),
});

export const subscribeSchema = z.object({
  email: emailSchema,
});

export const startupListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  industry: z.string().trim().optional(),
  size: z.string().trim().optional(),
  fundingStage: z.string().trim().optional(),
  location: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type StartupSubmissionInput = z.infer<typeof startupSubmissionSchema>;
