'use client';

import { motion } from 'framer-motion';
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
    detail: 'Pick any listing on Hirely you\u2019re considering.',
  },
  {
    icon: ScanSearch,
    title: 'Hirely reads the role',
    detail: 'Required skills, experience level, and key requirements are pulled from the posting.',
  },
  {
    icon: FileText,
    title: 'Hirely reads your CV',
    detail: 'Upload your CV once. It\u2019s parsed for skills, experience, and education.',
  },
  {
    icon: Scale,
    title: 'Your profile is compared',
    detail: 'Skills, years of experience, keyword overlap, and education are checked against the role.',
  },
  {
    icon: PieChart,
    title: 'You see your match',
    detail: 'A score with a breakdown , not just a number, but why it\u2019s that number.',
  },
  {
    icon: CircleCheckBig,
    title: 'You decide',
    detail: 'Strong fit, partial fit, or not yet. You choose whether it\u2019s worth your time.',
  },
  {
    icon: Mail,
    title: 'Apply with a personalized pitch',
    detail: 'If you go ahead, Hirely drafts an email pitch based on your profile and the role, for you to review and send.',
  },
];

export default function CoreProductSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              How it works
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Turn a job description into a decision.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

