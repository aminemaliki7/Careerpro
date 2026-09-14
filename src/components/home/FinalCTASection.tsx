'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

export default function FinalCTASection() {
  const router = useRouter();
  const { isCompany } = useUserRole();
  const dashboardHref = isCompany ? '/company/dashboard' : '/dashboard';

  return (
    <section className="bg-indigo-600 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Stop guessing. Know your match.
          </h2>

          <p className="mt-4 text-base text-indigo-100 leading-relaxed max-w-lg mx-auto">
            Find the opportunities that make sense for you, understand your
            fit, and apply with confidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignedOut>
              <button
                type="button"
                onClick={() => router.push('/jobs')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Find Your Match
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push('/onboarding?role=company')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-indigo-300/60 text-white text-sm font-semibold hover:bg-indigo-500/40 transition-colors"
              >
                For Companies
              </button>
            </SignedOut>

            <SignedIn>
              <button
                type="button"
                onClick={() => router.push(dashboardHref)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignedIn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

