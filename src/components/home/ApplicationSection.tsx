'use client';

import { motion } from 'framer-motion';
import { Mail, Target, ScanSearch, UserCheck, Send } from 'lucide-react';

const SEQUENCE = [
  { icon: Target, label: 'Match first' },
  { icon: ScanSearch, label: 'Understand the role' },
  { icon: UserCheck, label: 'Understand your fit' },
  { icon: Send, label: 'Then apply' },
];

export default function ApplicationSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: copy + sequence */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
              <Mail className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Applying
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Once you know you&apos;re a fit,
              <br />
              apply smarter.
            </h2>

            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-md">
              Hirely isn&apos;t &ldquo;AI writes your application for you.&rdquo; It&apos;s
              understanding the opportunity first, then applying with a
              pitch that&apos;s actually based on your profile and this
              specific role , which you review and send yourself.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {SEQUENCE.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                      <Icon className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-semibold text-slate-700">
                        {step.label}
                      </span>
                    </div>
                    {index < SEQUENCE.length - 1 && (
                      <span className="text-slate-300 text-xs">,</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: pitch email mock */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Draft pitch
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Based on your profile &amp; this job&apos;s requirements
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2.5 font-mono text-[11px] leading-relaxed text-slate-600">
                <p className="text-slate-400">To: hiring@fintechco.com</p>
                <p className="text-slate-400">
                  Subject: Application , Senior Backend Engineer
                </p>
                <div className="pt-2 space-y-2">
                  {[100, 92, 96, 70, 84].map((width, index) => (
                    <motion.div
                      key={index}
                      className="h-2 rounded bg-slate-100 overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full rounded bg-indigo-200"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  Editable before you send it
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold px-3 py-1.5">
                  Review &amp; send
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

