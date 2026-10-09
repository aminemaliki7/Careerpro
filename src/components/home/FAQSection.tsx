'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CircleHelp } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Hirely?',
    a: 'Hirely matches candidates to jobs and helps recruiters prioritize applicants.',
  },
  {
    q: 'How does the job match work?',
    a: 'It compares your CV with a role\u2019s skills, experience, keywords, and education, then explains your score.',
  },
  {
    q: 'Do I need to upload my CV?',
    a: 'Yes. Upload it once to see match scores for jobs.',
  },
  {
    q: 'Does a high match guarantee an interview?',
    a: 'No. The score supports decisions; recruiters make the final call.',
  },
  {
    q: 'What happens if I don\u2019t match all requirements?',
    a: 'Review matched and missing skills, then decide whether to apply or build your experience.',
  },
  {
    q: 'Can I use Hirely before applying?',
    a: 'Yes. Check your fit before deciding to apply.',
  },
  {
    q: 'Is Hirely only for software engineers?',
    a: 'Hirely focuses on tech, product, and data roles with clearly listed requirements.',
  },
  {
    q: 'Can recruiters use Hirely?',
    a: 'Yes. Recruiters can post roles and review applicants ranked by role fit.',
  },
  {
    q: 'How does candidate ranking work?',
    a: 'Applicants are scored against the job requirements and sorted by match.',
  },
  {
    q: 'Does Hirely make the hiring decision?',
    a: 'No. Recruiters make every hiring decision.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <CircleHelp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              FAQ
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Questions, answered plainly.
          </h2>
        </motion.div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-3.5 sm:py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-slate-600 leading-relaxed pb-4 pr-8"
                  >
                    {item.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

