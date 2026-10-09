'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Layers,
  Briefcase,
  ScanSearch,
  FileText,
  Scale,
  PieChart,
  CircleCheckBig,
  Mail,
} from 'lucide-react';

const STEPS = [
  {
    icon: Briefcase,
    title: 'Choose a job',
    detail: 'Choose a role you\u2019re considering.',
  },
  {
    icon: ScanSearch,
    title: 'Hirely reads the role',
    detail: 'We identify its key skills and requirements.',
  },
  {
    icon: FileText,
    title: 'Hirely reads your CV',
    detail: 'We extract your skills, experience, and education.',
  },
  {
    icon: Scale,
    title: 'Your profile is compared',
    detail: 'Your profile is compared with the role requirements.',
  },
  {
    icon: PieChart,
    title: 'You see your match',
    detail: 'See your score and what contributes to it.',
  },
  {
    icon: CircleCheckBig,
    title: 'You decide',
    detail: 'Decide whether the role is worth pursuing.',
  },
  {
    icon: Mail,
    title: 'Apply with a personalized pitch',
    detail: 'Review and send a pitch tailored to the role.',
  },
];

export default function CoreProductSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              How it works
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Turn a job description into a decision.
          </h2>
        </motion.div>

        <div className="grid gap-3 sm:hidden">
          {STEPS.filter((step) =>
            ['Choose a job', 'You see your match', 'You decide'].includes(step.title)
          ).map((step) => {
            const Icon = step.icon;

            return (
              <Link
                key={step.title}
                href="/jobs"
                className="group flex items-start gap-3 border-t border-slate-200 py-3 last:border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">{step.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {step.detail}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
                className={`relative rounded-2xl border bg-white p-5 flex flex-col ${
                  index === 6
                    ? 'border-indigo-200 shadow-md shadow-indigo-900/5 sm:col-span-2 lg:col-span-1'
                    : 'border-slate-200'
                }`}
              >
                <Link
                  href="/jobs"
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label={`${step.title}: explore tech jobs`}
                />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

