'use client';

import { motion } from 'framer-motion';
import {
  FileQuestion,
  HelpCircle,
  Send,
  Clock,
  FileText,
  UserCircle2,
  Target,
  Lightbulb,
  MessageSquareText,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

const WITHOUT_STEPS = [
  { icon: FileText, label: 'Job description' },
  { icon: HelpCircle, label: 'Guess' },
  { icon: Send, label: 'Apply' },
  { icon: Clock, label: 'Wait' },
];

const WITH_STEPS = [
  { icon: FileText, label: 'Job + your profile' },
  { icon: Target, label: 'Match analysis' },
  { icon: Lightbulb, label: 'Understand your fit' },
  { icon: MessageSquareText, label: 'Apply with context' },
];

function FlowColumn({
  title,
  tone,
  steps,
}: {
  title: string;
  tone: 'muted' | 'active';
  steps: { icon: typeof FileText; label: string }[];
}) {
  const isActive = tone === 'active';

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 h-full ${
        isActive
          ? 'border-indigo-200 bg-white shadow-lg shadow-indigo-900/5'
          : 'border-slate-200 bg-slate-50/70'
      }`}
    >
      <div
        className={`text-[11px] font-bold uppercase tracking-wider mb-5 ${
          isActive ? 'text-indigo-600' : 'text-slate-400'
        }`}
      >
        {title}
      </div>

      <div className="flex flex-col">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-sm font-semibold ${
                    isActive ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div className="pl-4 py-1.5">
                  <ArrowDown
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-indigo-300' : 'text-slate-300'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isActive && (
        <div className="mt-5 pt-4 border-t border-indigo-100 text-xs text-indigo-700/80 leading-relaxed">
          You decide before you spend 30 minutes writing an application.
        </div>
      )}

      {!isActive && (
        <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-400 leading-relaxed">
          Most of the effort happens before you know if it was worth it.
        </div>
      )}
    </div>
  );
}

export default function ProblemSection() {
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
            <FileQuestion className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              The problem
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Not every job deserves an application.
          </h2>

          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Job descriptions list required skills, preferred skills, and years
            of experience. But none of that tells you how well you actually
            fit. So most people see an interesting job, read the description,
            second-guess the requirements, and apply anyway , then wait, and
            often hear nothing back.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <FlowColumn title="Without Hirely" tone="muted" steps={WITHOUT_STEPS} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FlowColumn title="With Hirely" tone="active" steps={WITH_STEPS} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex items-center gap-2 justify-center text-sm text-slate-500"
        >
          <UserCircle2 className="w-4 h-4 text-slate-400" />
          Hirely moves the decision point earlier , before you apply, not after.
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
        </motion.div>
      </div>
    </section>
  );
}

