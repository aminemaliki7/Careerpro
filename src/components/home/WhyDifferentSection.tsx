'use client';

import { motion } from 'framer-motion';
import {
  Compass,
  Target,
  PieChart,
  MessageSquareText,
  ListFilter,
  Zap,
} from 'lucide-react';

const PRINCIPLES = [
  { icon: Target, title: 'Match before applying', detail: 'See your fit before you spend time on an application.' },
  { icon: PieChart, title: 'Understand the gaps', detail: 'Know exactly which skills are missing, and which are just partial.' },
  { icon: MessageSquareText, title: 'Apply with context', detail: 'Your pitch reflects the actual role, not a generic template.' },
  { icon: ListFilter, title: 'Prioritize what fits', detail: 'Spend time on the opportunities most worth it, not all of them equally.' },
  { icon: Zap, title: 'Focus on fit, not volume', detail: 'One well-matched application beats ten generic ones.' },
];

export default function WhyDifferentSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Why Hirely */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-10"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Why Hirely
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Less guessing. Better decisions.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16 sm:mb-20">
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">
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
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Different from a job board.
            </h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md">
              Job boards and traditional recruiting stop at listing. Hirely
              adds the layer that connects a listing to the person looking at
              it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Traditional job boards
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">
                &ldquo;Here are jobs.&rdquo;
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                &ldquo;Here are candidates.&rdquo;
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-3">
                Hirely
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
                &ldquo;Here&apos;s how this job relates to you.&rdquo;
              </p>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                &ldquo;Here are candidates ranked by fit for this role.&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

