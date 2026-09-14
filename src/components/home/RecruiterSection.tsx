'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  FileSliders,
  ScanSearch,
  Users,
  ArrowUpDown,
  BadgeCheck,
} from 'lucide-react';

const WORKFLOW = [
  { icon: Building2, title: 'Create a role', detail: 'Post the job with the skills and experience that actually matter.' },
  { icon: FileSliders, title: 'Define what matters', detail: 'Required skills become the criteria candidates are checked against.' },
  { icon: ScanSearch, title: 'Analyze requirements', detail: 'Hirely reads the posting the same way it reads a candidate\u2019s CV.' },
  { icon: Users, title: 'Match candidates', detail: 'Each applicant\u2019s CV is scored against this specific role.' },
  { icon: ArrowUpDown, title: 'Rank candidates', detail: 'Applicants are sorted by match score, highest first.' },
  { icon: BadgeCheck, title: 'Review strongest matches first', detail: 'Auto-shortlist or auto-review rules can act on score thresholds.' },
];

const CANDIDATES = [
  { name: 'Candidate A', role: 'Backend Engineer', score: 94 },
  { name: 'Candidate B', role: 'Software Engineer', score: 87 },
  { name: 'Candidate C', role: 'Java Developer', score: 81 },
];

export default function RecruiterSection() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-emerald-400 mb-4">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              The other side
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Candidates aren&apos;t the only ones trying to find the right match.
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-xl">
            Candidates have too many opportunities to evaluate. Recruiters have
            too many candidates to evaluate. It&apos;s the same problem, seen
            from the other side , &ldquo;Should I apply?&rdquo; becomes
            &ldquo;Who should I review?&rdquo;
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
          {/* LEFT: workflow */}
          <div className="grid sm:grid-cols-2 gap-3.5">
            {WORKFLOW.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: (index % 2) * 0.08 }}
                  className="rounded-xl border border-slate-700/80 bg-slate-800/60 p-4"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: ranking card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-slate-700 bg-slate-800 shadow-xl shadow-black/20 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Senior Backend Engineer
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Candidates ranked by match
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                  <Users className="w-3.5 h-3.5" />
                  12 matches
                </div>
              </div>

              <div className="p-4 space-y-2">
                {CANDIDATES.map((candidate, index) => (
                  <motion.div
                    key={candidate.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-white">
                        {candidate.name}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {candidate.role}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">
                        {candidate.score}%
                      </div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wide">
                        Match
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-5 pb-5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Instead of treating every application equally, Hirely helps
                  recruiters prioritize candidates by fit. The recruiter still
                  makes the hiring decision , ranking isn&apos;t automatic
                  hiring, and it isn&apos;t claimed to be perfect.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

