'use client';

import { motion } from 'framer-motion';
import { UserCheck, Building2, ArrowDown } from 'lucide-react';
import CircuitLogo from '@/components/ui/CircuitLogo';

export default function TwoSidesSection() {
return ( <section className="relative overflow-hidden bg-white py-20 sm:py-28"> <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
<motion.div
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-80px' }}
transition={{ duration: 0.6 }}
className="text-center"
> <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-600">
The matching layer </p>


      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        One problem. Two perspectives.
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Hirely connects what candidates are looking for with what companies
        actually need.
      </p>

      <div className="mt-12 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-6 text-left shadow-sm sm:p-7"
        >
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <UserCheck className="h-5 w-5 text-indigo-600" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            For candidates
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Is this job right for me?
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Understand the opportunity before you spend your time applying.
          </p>
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
          className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 text-left shadow-sm sm:p-7"
        >
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            For companies
          </p>

          <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            Is this candidate right for the role?
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Find candidates who actually match the requirements of the role.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10"
      >
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700">
          One matching layer.
        </span>
      </motion.div>
    </motion.div>
  </div>
</section>


);
}
