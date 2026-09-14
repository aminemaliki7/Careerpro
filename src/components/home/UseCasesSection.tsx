'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  Code2,
  Shuffle,
  TrendingUp,
  Users,
} from 'lucide-react';

const USE_CASES = [
  {
    icon: GraduationCap,
    title: 'Graduate',
    quote: 'Not sure whether you meet enough of the requirements?',
  },
  {
    icon: Code2,
    title: 'Developer',
    quote: 'Want to know if a role is worth 30 minutes of your time before you apply?',
  },
  {
    icon: Shuffle,
    title: 'Career switcher',
    quote: 'Trying to understand where your experience actually fits?',
  },
  {
    icon: TrendingUp,
    title: 'Experienced engineer',
    quote: 'Want to quickly prioritize the opportunities that make sense?',
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Who it&apos;s for
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Built for people navigating tech careers.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;

            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 flex flex-col"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-4">
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {useCase.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {useCase.quote}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

