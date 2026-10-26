'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Compass,
  Target,
  PieChart,
  MessageSquareText,
  ListFilter,
  Zap,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

const PRINCIPLES = [
  { icon: Target, title: 'Match before applying', detail: 'Check your fit before you apply.' },
  { icon: PieChart, title: 'Understand the gaps', detail: 'See which skills match or are missing.' },
  { icon: MessageSquareText, title: 'Apply with context', detail: 'Tailor your pitch to each role.' },
  { icon: ListFilter, title: 'Prioritize what fits', detail: 'Focus on roles worth your time.' },
  { icon: Zap, title: 'Focus on fit, not volume', detail: 'Make each application count.' },
];

export default function WhyDifferentSection() {
  return (
    <section className="bg-slate-50 py-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Why Hirely */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-6 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Why Hirely
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Less guessing. Better decisions.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4 mb-8 sm:mb-20">
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="group relative rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-4 transition-colors hover:border-indigo-300"
              >
                <Link
                  href="/jobs"
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label={`${principle.title}: explore tech jobs`}
                />
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2 sm:mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-indigo-700">
                  {principle.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {principle.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Job board comparison */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Different from a job board.
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-xl">
            Hirely connects job listings with candidate fit and recruiter needs.
          </p>

          <div className="mt-5 max-w-3xl">
            <div className="mb-2 hidden grid-cols-[1fr_auto_1fr] gap-3 sm:grid">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Traditional job boards
              </span>
              <span />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Hirely
              </span>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              <div className="grid items-center gap-2 py-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
                <div className="flex items-start gap-2.5">
                  <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">
                      Traditional job boards
                    </p>
                    <p className="text-sm text-slate-500">
                      Here are jobs.
                    </p>
                  </div>
                </div>
                <ArrowRight className="hidden h-3.5 w-3.5 text-slate-300 sm:block" />
                <div className="flex items-start gap-2.5">
                  <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-800">
                    Here&apos;s how this job relates to you.
                  </p>
                </div>
              </div>

              <div className="grid items-center gap-2 py-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
                <div className="flex items-start gap-2.5">
                  <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">
                      Traditional job boards
                    </p>
                    <p className="text-sm text-slate-500">
                      Here are candidates.
                    </p>
                  </div>
                </div>
                <ArrowRight className="hidden h-3.5 w-3.5 text-slate-300 sm:block" />
                <div className="flex items-start gap-2.5">
                  <ListFilter className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-800">
                    Here are candidates ranked by fit for this role.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

