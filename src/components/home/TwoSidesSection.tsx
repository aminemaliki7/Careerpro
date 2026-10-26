'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserCheck, Building2, ArrowDown, ArrowRight } from 'lucide-react';
import CircuitLogo from '@/components/ui/CircuitLogo';

export default function TwoSidesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            What Hirely offers
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Matching for candidates and companies.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-7">
            Candidates see fit before they apply. Companies prioritize applicants against the role.
          </p>

          <div className="mt-8 sm:mt-12 grid items-stretch gap-4 sm:gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 text-left shadow-sm sm:rounded-3xl sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 sm:mb-5">
                <UserCheck className="h-5 w-5 text-indigo-600" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                For candidates
              </p>

              <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Know your match before you apply.
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                See how your skills and experience align with a role, understand
                the gaps, and prepare a more relevant application.
              </p>

              <Link
                href="/jobs"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Explore jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="flex items-center justify-center">
              <div className="hidden h-px w-8 bg-slate-200 md:block" />

              <div className="translate-x-[-3px]">
                <CircuitLogo size="sm" color="#ffffff" />
              </div>
              <div className="hidden h-px w-8 bg-slate-200 md:block" />

              <ArrowDown className="h-5 w-5 text-slate-300 md:hidden" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-left shadow-sm sm:rounded-3xl sm:p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 sm:mb-5">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                For companies
              </p>

              <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Spend less time screening. Focus on the right candidates.
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                Use Hirely&apos;s matching capabilities to prioritize applicants
                against the requirements of your open roles.
              </p>

              <Link
                href="/onboarding?role=company"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Explore hiring with Hirely
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
