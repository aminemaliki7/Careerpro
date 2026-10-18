'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, Map, Building2, Headphones, ArrowRight } from 'lucide-react';

const ECOSYSTEM = [
  {
    icon: Briefcase,
    title: 'Jobs',
    detail: 'Tech roles across engineering, data, product, and more.',
    href: '/jobs',
  },
  {
    icon: Map,
    title: 'Career paths',
    detail: 'Roadmaps that show what to learn next when you\u2019re missing a skill.',
    href: '/roadmaps',
  },
  {
    icon: Building2,
    title: 'Companies',
    detail: 'A directory of the companies actually hiring on Hirely.',
    href: '/startups',
  },
  {
    icon: Headphones,
    title: 'Podcast',
    detail: 'Conversations on tech careers, hiring, and startups.',
    href: '/podcast',
  },
];

export default function EcosystemSection() {
  return (
    <section className="bg-white py-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            More than matching, when you need it.
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Explore jobs, career paths, companies, and career conversations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 min-[390px]:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-8">
          {ECOSYSTEM.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full items-start gap-3 rounded-xl border border-slate-200 p-3 sm:flex-col sm:rounded-2xl sm:p-5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="w-8 h-8 shrink-0 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors sm:mb-4">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 sm:contents">
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mb-2 sm:mb-3">
                      {item.detail}
                    </p>
                    <span className="mt-1 sm:mt-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      Explore
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

