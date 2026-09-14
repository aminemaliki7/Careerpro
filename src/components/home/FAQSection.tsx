'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CircleHelp } from 'lucide-react';

const FAQS = [
  {
    q: 'What is Hirely?',
    a: 'Hirely is a career and hiring platform that compares jobs with candidates. It helps candidates understand their fit for a job before applying, and helps recruiters identify and prioritize candidates who fit their roles.',
  },
  {
    q: 'How does the job match work?',
    a: 'Hirely compares your CV against a specific job\u2019s required skills, experience level, keywords from the description, education, and CV depth. Each dimension is weighted and combined into a single score, with a breakdown of why you got it.',
  },
  {
    q: 'Do I need to upload my CV?',
    a: 'Yes, to see a match score. You upload it once, in Hirely\u2019s Easy Apply flow, and it\u2019s used to run the comparison against the job you\u2019re viewing.',
  },
  {
    q: 'Does a high match guarantee an interview?',
    a: 'No. The match score reflects how well your CV lines up with a job\u2019s stated requirements. It doesn\u2019t guarantee an interview, an offer, or employment \u2014 hiring decisions are made by the recruiter.',
  },
  {
    q: 'What happens if I don\u2019t match all requirements?',
    a: 'You\u2019ll see exactly which skills are missing or only partially covered, alongside the ones you do have. That\u2019s meant to help you decide whether to apply, strengthen your CV first, or look elsewhere.',
  },
  {
    q: 'Can I use Hirely before applying?',
    a: 'Yes \u2014 that\u2019s the point. You can check your match for a job without committing to an application, so you can decide if it\u2019s worth your time first.',
  },
  {
    q: 'Is Hirely only for software engineers?',
    a: 'Hirely is built primarily around tech roles \u2014 engineering, data, product, and similar \u2014 but the matching approach works for any role with clearly listed skills and requirements.',
  },
  {
    q: 'Can recruiters use Hirely?',
    a: 'Yes. Recruiters can post roles, see applicants ranked by match score, and set rules to auto-shortlist or auto-flag candidates based on score thresholds.',
  },
  {
    q: 'How does candidate ranking work?',
    a: 'Each applicant\u2019s CV is scored against the job\u2019s requirements using the same matching engine candidates see, then sorted so recruiters can review the strongest matches first.',
  },
  {
    q: 'Does Hirely make the hiring decision?',
    a: 'No. Hirely surfaces fit and helps prioritize review. The recruiter remains responsible for every hiring decision.',
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
    <section className="bg-white py-20 sm:py-28">
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
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 text-indigo-600 mb-4">
            <CircleHelp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              FAQ
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
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
                  className="w-full flex items-center justify-between gap-4 py-4 text-left"
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

