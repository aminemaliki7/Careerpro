'use client';

import { motion } from 'framer-motion';
import { Check, AlertCircle, Gauge, HelpCircle } from 'lucide-react';

const BREAKDOWN = [
  { label: 'Skills match', value: 92, weight: '35% of score' },
  { label: 'Experience', value: 88, weight: '25% of score' },
  { label: 'Keyword relevance', value: 76, weight: '20% of score' },
  { label: 'Education', value: 100, weight: '10% of score' },
  { label: 'CV depth', value: 80, weight: '10% of score' },
];

const SKILLS = [
  { name: 'Java', status: 'match' as const },
  { name: 'Spring Boot', status: 'match' as const },
  { name: 'PostgreSQL', status: 'match' as const },
  { name: 'Docker', status: 'partial' as const },
  { name: 'Kubernetes', status: 'missing' as const },
];

const QUESTIONS = [
  'What do I already have?',
  'What am I missing?',
  'Where am I strong?',
  'Is this role worth applying to?',
];

export default function MatchSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
              <Gauge className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                The match score
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              The score isn&apos;t the product.
              <br />
              The explanation is.
            </h2>

            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-md">
              A percentage on its own doesn&apos;t help you decide anything.
              Hirely breaks the score down by skills, experience, keyword
              overlap, education, and CV depth , so you can see exactly where
              you stand, not just what number you got.
            </p>

            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Don&apos;t just get a match. Understand it.
                </span>
              </div>

              <ul className="space-y-2">
                {QUESTIONS.map((q) => (
                  <li
                    key={q}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT: breakdown card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Score breakdown
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Senior Backend Engineer
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">87%</div>
                  <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                    Strong match
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3.5">
                {BREAKDOWN.map((row, index) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {row.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {row.weight}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-indigo-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.08 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Skills, matched against the role
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS.map((skill) => (
                      <span
                        key={skill.name}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                          skill.status === 'match'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : skill.status === 'partial'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        {skill.status === 'match' && <Check className="w-3 h-3" />}
                        {skill.status === 'missing' && <AlertCircle className="w-3 h-3" />}
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

