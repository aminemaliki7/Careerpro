'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Sparkles,
  Target,
  AlertCircle,
  Code2,
  Database,
  Cloud,
  Send,
  Loader2,
  Users,
  Building2,
  UserCheck,
  BriefcaseBusiness,
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface HeroStats {
  jobCount: number;
  companyCount: number;
  postCount: number;
}

type DemoRole = 'candidate' | 'recruiter';
type DemoStep = number;
type DemoDirection = 'step' | 'role';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Small UI Components
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Skill({
  icon,
  name,
  status,
}: {
  icon?: React.ReactNode;
  name: string;
  status: 'match' | 'partial' | 'missing';
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5">
        {icon || (
          <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
            <Code2 className="w-3 h-3 text-slate-500" />
          </div>
        )}

        <span className="text-xs font-medium text-slate-700">
          {name}
        </span>
      </div>

      {status === 'match' && (
        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
          <Check className="w-3 h-3" />
          Match
        </div>
      )}

      {status === 'partial' && (
        <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
          <span className="w-3 h-3 rounded-full border-2 border-amber-400" />
          Partial
        </div>
      )}

      {status === 'missing' && (
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
          <AlertCircle className="w-3 h-3" />
          Missing
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Candidate â€” Step 0
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CandidateJobScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Open position
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Senior Backend Engineer
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Fintech Â· Casablanca Â· Hybrid
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Database className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {['Java', 'Spring Boot', 'PostgreSQL', 'Docker'].map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-indigo-600" />

          <span className="text-xs font-semibold text-indigo-900">
            Hirely ATS Match
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-indigo-700/80">
          See how well your profile matches this job before you apply.
        </p>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Candidate â€” Step 1
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CandidateAnalysisScreen() {
  const skills = [
    { name: 'Java', status: 'match' as const },
    { name: 'Spring Boot', status: 'match' as const },
    { name: 'PostgreSQL', status: 'match' as const },
    { name: 'Docker', status: 'partial' as const },
    { name: 'Kubernetes', status: 'missing' as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Candidate profile
          </div>

          <div className="text-sm font-bold text-slate-900">
            CV analyzed
          </div>
        </div>

        <motion.div
          className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI analyzing
        </motion.div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <Skill
              name={skill.name}
              status={skill.status}
              icon={
                skill.name === 'Java' ? (
                  <Code2 className="w-3 h-3 text-slate-500" />
                ) : skill.name === 'PostgreSQL' ? (
                  <Database className="w-3 h-3 text-slate-500" />
                ) : skill.name === 'Docker' ? (
                  <Cloud className="w-3 h-3 text-slate-500" />
                ) : undefined
              }
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Candidate â€” Step 2
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CandidateMatchScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col"
    >
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Your match
          </div>
        </div>

        <div className="relative inline-flex items-center justify-center">
          <svg
            width="130"
            height="130"
            viewBox="0 0 130 130"
            className="-rotate-90"
          >
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />

            <motion.circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="339"
              initial={{ strokeDashoffset: 339 }}
              animate={{ strokeDashoffset: 44 }}
              transition={{
                duration: 1.2,
                ease: 'easeOut',
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold text-slate-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              87%
            </motion.span>

            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">
              Strong match
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        {[
          ['Skills', '92%'],
          ['Experience', '88%'],
          ['Context', '82%'],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center"
          >
            <div className="text-sm font-bold text-slate-900">
              {value}
            </div>

            <div className="text-[9px] text-slate-500 mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-medium text-indigo-600">
        <UserCheck className="w-3 h-3" />
        Know your match before applying
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Candidate â€” Step 3
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CandidateApplicationScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AI application
          </div>

          <div className="text-sm font-bold text-slate-900">
            Personalized for the role
          </div>
        </div>

        <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-700">
              Application generated
            </div>

            <div className="text-[9px] text-slate-400">
              Based on your profile & job requirements
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[80, 95, 68, 88].map((width, index) => (
            <motion.div
              key={index}
              className="h-1.5 rounded-full bg-slate-200 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.12 }}
            >
              <motion.div
                className="h-full rounded-full bg-indigo-300"
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{
                  delay: 0.2 + index * 0.12,
                  duration: 0.5,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />

          <span className="text-[10px] font-semibold text-emerald-700">
            Skills matched
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />

          <span className="text-[10px] font-semibold text-emerald-700">
            Experience matched
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Recruiter â€” Step 0
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RecruiterJobScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Your open position
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Senior Backend Engineer
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Fintech Â· Casablanca Â· Hybrid
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <BriefcaseBusiness className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {['Java', 'Spring Boot', 'PostgreSQL', 'Docker'].map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-indigo-600" />

          <span className="text-xs font-semibold text-indigo-900">
            Hirely ATS
          </span>
        </div>

        <p className="text-[11px] leading-relaxed text-indigo-700/80">
          Define what matters for the role and let Hirely identify candidates who actually fit.
        </p>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Recruiter â€” Step 1
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RecruiterAnalysisScreen() {
  const requirements = [
    { name: 'Java', status: 'match' as const },
    { name: 'Spring Boot', status: 'match' as const },
    { name: 'PostgreSQL', status: 'match' as const },
    { name: 'Docker', status: 'match' as const },
    { name: 'Kubernetes', status: 'partial' as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Target className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Job requirements
          </div>

          <div className="text-sm font-bold text-slate-900">
            Role analyzed
          </div>
        </div>

        <motion.div
          className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI analyzing
        </motion.div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4">
        {requirements.map((requirement, index) => (
          <motion.div
            key={requirement.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.12 }}
          >
            <Skill
              name={requirement.name}
              status={requirement.status}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />

          <span className="text-[10px] font-semibold text-slate-700">
            Requirements ready for candidate matching
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Recruiter â€” Step 2
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RecruiterRankingScreen() {
  const candidates = [
    {
      name: 'Candidate A',
      role: 'Backend Engineer',
      score: '94%',
    },
    {
      name: 'Candidate B',
      role: 'Software Engineer',
      score: '87%',
    },
    {
      name: 'Candidate C',
      role: 'Java Developer',
      score: '81%',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Users className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Candidate pool
          </div>

          <div className="text-sm font-bold text-slate-900">
            Candidates ranked by match
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
          <Users className="w-3.5 h-3.5" />
          12 matches
        </div>
      </div>

      <div className="space-y-2">
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold text-slate-800">
                {candidate.name}
              </div>

              <div className="text-[9px] text-slate-400">
                {candidate.role}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-indigo-600">
                {candidate.score}
              </div>

              <div className="text-[8px] text-slate-400 uppercase tracking-wide">
                Match
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Recruiter â€” Step 3
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function RecruiterReviewScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-indigo-600" />
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Recruiter review
          </div>

          <div className="text-sm font-bold text-slate-900">
            Strongest candidates first
          </div>
        </div>

        <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-semibold text-indigo-900">
              Top candidate
            </div>

            <div className="text-sm font-bold text-slate-900 mt-1">
              Candidate A
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold text-indigo-600">
              94%
            </div>

            <div className="text-[8px] uppercase tracking-wide text-slate-400">
              Match
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            ['Technical skills', '96%'],
            ['Experience', '94%'],
            ['Role context', '91%'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between text-[10px]"
            >
              <span className="text-slate-500">
                {label}
              </span>

              <span className="font-semibold text-emerald-600">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <Target className="w-4 h-4 text-emerald-600" />

        <span className="text-[10px] font-semibold text-emerald-700">
          Review the candidates that fit your role first
        </span>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Product Demo
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STEPS_PER_ROLE = 4;

function ProductDemo() {
  // Single source of truth: a monotonically-increasing counter.
  // role and step are both *derived* from it, so every state update stays
  // pure â€” nothing sets multiple pieces of state inside one updater
  // (which is what caused the role flip to get cancelled out under
  // React 18 Strict Mode's double-invocation of updater functions).
  const [counter, setCounter] = useState(0);

  const role: DemoRole =
    Math.floor(counter / STEPS_PER_ROLE) % 2 === 0 ? 'candidate' : 'recruiter';
  const step: DemoStep = counter % STEPS_PER_ROLE;

  // Track the previous role in a ref so we can tell, after render, whether
  // this update was a plain step change or a full role switch â€” used only
  // to pick which transition animation to play.
  const prevRoleRef = useRef<DemoRole>(role);
  const direction: DemoDirection = prevRoleRef.current !== role ? 'role' : 'step';
  useEffect(() => {
    prevRoleRef.current = role;
  }, [role]);

  const candidateSteps = [
    { label: 'Match the job', icon: <Target className="w-3.5 h-3.5" /> },
    { label: 'Analyze the CV', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'See the match', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Apply smarter', icon: <Send className="w-3.5 h-3.5" /> },
  ];

  const recruiterSteps = [
    { label: 'Create the job', icon: <BriefcaseBusiness className="w-3.5 h-3.5" /> },
    { label: 'Analyze requirements', icon: <Target className="w-3.5 h-3.5" /> },
    { label: 'Rank candidates', icon: <Users className="w-3.5 h-3.5" /> },
    { label: 'Review matches', icon: <UserCheck className="w-3.5 h-3.5" /> },
  ];

  const steps = role === 'candidate' ? candidateSteps : recruiterSteps;

  // Seamless auto-play loop across both roles.
  // Every tick just increments the counter by one â€” role/step naturally
  // roll over (candidate step 4 -> recruiter step 1 -> ... -> back to
  // candidate) purely from the math above, no click required.
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, []); // Run once on mount to maintain continuous loop timing

  const switchRole = (newRole: DemoRole) => {
    if (newRole === role) return;
    const roleIndex = newRole === 'candidate' ? 0 : 1;
    setCounter(roleIndex * STEPS_PER_ROLE); // jump to that role, step 0
  };

  const goToStep = (index: number) => {
    const roleIndex = role === 'candidate' ? 0 : 1;
    setCounter(roleIndex * STEPS_PER_ROLE + index);
  };

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-8 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">

        {/* Browser header */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>

          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ATS active
          </div>
        </div>

        {/* Candidate / Recruiter switch */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-center">
            <div className="relative inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">

              {/* Animated highlight slides under whichever tab is active,
                  including when the switch happens automatically. */}
              <motion.div
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm"
                animate={{ x: role === 'candidate' ? 0 : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              <button
                type="button"
                onClick={() => switchRole('candidate')}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-colors ${
                  role === 'candidate'
                    ? 'text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                Candidate
              </button>

              <button
                type="button"
                onClick={() => switchRole('recruiter')}
                className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-colors ${
                  role === 'recruiter'
                    ? 'text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Building2 className="w-3 h-3" />
                Recruiter
              </button>

            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between gap-1">
            {steps.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center flex-1 min-w-0"
              >
                <div
                  className={`flex items-center gap-1.5 min-w-0 ${
                    index <= step
                      ? 'text-indigo-600'
                      : 'text-slate-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      index < step
                        ? 'bg-indigo-600 text-white'
                        : index === step
                          ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
                          : 'bg-slate-50 text-slate-300'
                    }`}
                  >
                    {index < step ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      item.icon
                    )}
                  </div>

                  <span className="hidden xl:block text-[9px] font-semibold truncate">
                    {item.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-slate-100 mx-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo content */}
        <div className="p-5 sm:p-6 h-[370px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${role}-${step}`}
              className="h-full"
              initial={
                direction === 'role'
                  ? { opacity: 0, y: 16, scale: 0.98 }
                  : { opacity: 0, x: 12 }
              }
              animate={
                direction === 'role'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 1, x: 0 }
              }
              exit={
                direction === 'role'
                  ? { opacity: 0, y: -16, scale: 0.98 }
                  : { opacity: 0, x: -12 }
              }
              transition={{
                duration: direction === 'role' ? 0.45 : 0.3,
                ease: 'easeOut',
              }}
            >
              {role === 'candidate' ? (
                <>
                  {step === 0 && <CandidateJobScreen />}
                  {step === 1 && <CandidateAnalysisScreen />}
                  {step === 2 && <CandidateMatchScreen />}
                  {step === 3 && <CandidateApplicationScreen />}
                </>
              ) : (
                <>
                  {step === 0 && <RecruiterJobScreen />}
                  {step === 1 && <RecruiterAnalysisScreen />}
                  {step === 2 && <RecruiterRankingScreen />}
                  {step === 3 && <RecruiterReviewScreen />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 text-indigo-500 animate-spin" />

            <span className="text-[10px] font-medium text-slate-500">
              {steps[step]?.label}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToStep(index)}
                aria-label={`Go to step ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === step
                    ? 'w-5 bg-indigo-600'
                    : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Main Hero
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface HeroSectionProps {
  stats?: HeroStats;
}

export default function HeroSection({
  stats,
}: HeroSectionProps) {
  const router = useRouter();
  const { isCompany } = useUserRole();

  const jobCountDisplay =
    stats && stats.jobCount > 0
      ? `${stats.jobCount}+`
      : '250+';

  const dashboardHref = isCompany ? '/company/dashboard' : '/dashboard';

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#0F172A] transition-colors">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-3xl" />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center min-h-[calc(100vh-64px)] py-16 sm:py-20 lg:py-24">

          {/* LEFT */}
          <motion.div
            className="flex flex-col text-center lg:text-left"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.7rem] xl:text-[4.1rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.04]">
              Stop applying
              <br />

              <span className="text-indigo-600 dark:text-indigo-400">
                blindly.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Hirely matches candidates to jobs using ATS analysis before they
              apply while helping companies identify the candidates who
              actually fit their requirements.
            </p>

            {/* Two-sided explanation */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    For candidates
                  </div>

                  <div className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 mt-0.5">
                    Know your match before you apply.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    For companies
                  </div>

                  <div className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 mt-0.5">
                    Find and prioritize candidates who fit.
                  </div>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-8">

              <SignedOut>
                <button
                  type="button"
                  onClick={() => router.push('/jobs')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Find Your Match
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/startups')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  For Companies
                </button>
              </SignedOut>

              <SignedIn>
                <button
                  type="button"
                  onClick={() => router.push(dashboardHref)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignedIn>

            </div>

            {/* Trust points */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">

              <div className="grid grid-cols-2 gap-x-5 gap-y-3">

                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Candidate ATS matching</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Recruiter candidate ranking</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI-powered applications</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{jobCountDisplay} tech jobs</span>
                </div>

              </div>

            </div>

          </motion.div>

          {/* RIGHT â€” PRODUCT DEMO */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: 'easeOut',
            }}
          >
            <ProductDemo />
          </motion.div>

        </div>
      </div>
    </section>
  );
}