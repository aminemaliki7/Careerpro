'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  MessageCircleQuestion,
  X,
} from 'lucide-react';

const FAQS = [
  {
    q: 'What is Hirely?',
    a: 'Hirely matches candidates to jobs and helps recruiters prioritize applicants.',
  },
  {
    q: 'How does the job match work?',
    a: 'It compares your CV with a role\'s skills, experience, keywords, and education, then explains your score.',
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
    q: 'What happens if I don\'t match all requirements?',
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

export default function FAQChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeWidget = () => {
    setIsOpen(false);
    setSelectedFaq(null);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSelectedFaq(null);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
      <div
        data-faq-chat-widget
        className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="faq-chat-dialog"
              role="dialog"
              aria-modal="false"
              aria-labelledby="faq-chat-title"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-14 right-0 flex h-[min(440px,calc(100dvh-6rem))] w-[calc(100vw-2rem)] max-w-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
            >
              <div className="flex items-center justify-between bg-indigo-700 px-4 py-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="faq-chat-title" className="text-sm font-semibold">
                      Hirely FAQs
                    </h2>
                    <p className="text-xs text-indigo-100">
                      Quick answers about Hirely
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeWidget}
                  aria-label="Close Hirely FAQs"
                  className="rounded-md p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {selectedFaq === null ? (
                  <div className="space-y-4">
                    <p className="max-w-[90%] rounded-xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                      Hi! What would you like to know?
                    </p>
                    <div className="space-y-2">
                      {FAQS.map((item, index) => (
                        <button
                          key={item.q}
                          type="button"
                          onClick={() => setSelectedFaq(index)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <span>{item.q}</span>
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setSelectedFaq(null)}
                      className="inline-flex items-center gap-1.5 rounded-md py-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      All questions
                    </button>
                    <p className="ml-auto max-w-[90%] rounded-xl rounded-tr-sm bg-indigo-600 p-3 text-sm leading-relaxed text-white">
                      {FAQS[selectedFaq].q}
                    </p>
                    <p className="max-w-[90%] rounded-xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                      {FAQS[selectedFaq].a}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 px-4 py-2.5 text-center text-[11px] text-slate-400">
                Answers to common questions about Hirely
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={triggerRef}
          type="button"
          aria-label={isOpen ? 'Close Hirely FAQs' : 'Open Hirely FAQs'}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="faq-chat-dialog"
          onClick={() => (isOpen ? closeWidget() : setIsOpen(true))}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-indigo-700 px-3 text-xs font-semibold text-white shadow-lg shadow-indigo-900/20 transition-colors hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          {isOpen ? (
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <MessageCircleQuestion className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{isOpen ? 'Close' : 'FAQs'}</span>
        </button>
      </div>
  );
}