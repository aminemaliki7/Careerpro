'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Briefcase, Building2, BookOpen } from 'lucide-react';
import type { HeroStats } from './HeroSection';

interface TrustSectionProps {
  stats?: HeroStats;
}

export default function TrustSection({ stats }: TrustSectionProps) {
  const jobCount = stats?.jobCount?.toLocaleString() ?? '—';
  const companyCount = stats?.companyCount?.toLocaleString() ?? '—';
  const postCount = stats?.postCount;

  const metrics = [
    { icon: Briefcase, value: jobCount, label: 'Tech jobs on Hirely', href: '/jobs' },
    { icon: Building2, value: companyCount, label: 'Companies listed', href: '/startups' },
    ...(postCount != null
      ? [{ icon: BookOpen, value: postCount.toLocaleString(), label: 'Career guides & articles', href: '/blog' }]
      : []),
  ];

  return (
    <section className="bg-slate-900 py-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 text-slate-400 mb-4 sm:mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Built on real product data
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6 sm:gap-16">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Link
                  key={metric.label}
                  href={metric.href}
                  className="group flex flex-col items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Icon className="w-4 h-4 text-slate-500 mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums group-hover:text-emerald-300">
                    {metric.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 group-hover:text-white">
                    {metric.label}
                  </div>
                </Link>
              );
            })}
          </div>

          <p className="mt-4 sm:mt-6 max-w-xl text-xs text-slate-500 leading-relaxed">
            Match scores guide review; recruiters make the final decision.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

