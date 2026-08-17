'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Briefcase,
  Map,
  FileText,
  Mic,
  Brain,
  Server,
  Layout,
  Cloud,
  TestTube,
  TrendingUp,
  Network,
  Building,
  Plus,
  ArrowRight,
  RefreshCw,
  Globe,
  Layers,
  CheckCircle2,
} from 'lucide-react';

// ─── Hirely Logo Component ────────────────────────────────────────────────────

interface HirelyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showWordmark?: boolean;
}

function HirelyLogo({
  size = 'md',
  className = '',
  showWordmark = true,
}: HirelyLogoProps) {
  const iconSize = {
    xs: 20,
    sm: 24,
    md: 28,
    lg: 36,
  }[size];

  const textSize = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  const hex =
    '-14.43,-8.33 0,-16.67 14.43,-8.33 14.43,8.33 0,16.67 -14.43,8.33';

  return (
    <div
      className={`inline-flex items-center gap-2 select-none ${className}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-10 -10 120 120"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-colors"
      >
        <g transform="translate(50,50)">
          <polygon points={hex} transform="translate(0,-28.87)" />
          <polygon points={hex} transform="translate(25,-14.43)" />
          <polygon points={hex} transform="translate(25,14.43)" />
          <polygon points={hex} transform="translate(0,28.87)" />
          <polygon points={hex} transform="translate(-25,14.43)" />
          <polygon points={hex} transform="translate(-25,-14.43)" />
        </g>
      </svg>

      {showWordmark && (
        <span
          className={`font-bold tracking-tight leading-none text-current ${textSize}`}
        >
          Hirely
        </span>
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroStats {
  jobCount: number;
  companyCount: number;
  postCount: number;
}

type Choice = {
  label: string;
  icon: React.ReactNode;
  url: string;
};

type FlowKey = 'jobs' | 'companies' | 'roadmaps' | 'resources';

type Flow = {
  userMsg: string;
  q2: string;
  choices2: Choice[];
  finalMsg: string;
  ctaLabel: string;
  ctaUrl: string;
};

type Message =
  | {
      type: 'bot';
      id: string;
      text: string;
    }
  | {
      type: 'user';
      id: string;
      text: string;
    }
  | {
      type: 'choices1';
      id: string;
    }
  | {
      type: 'choices2';
      id: string;
      choices: Choice[];
    }
  | {
      type: 'typing';
      id: string;
    }
  | {
      type: 'cta';
      id: string;
      label: string;
      url: string;
    };

// ─── Flow definitions ─────────────────────────────────────────────────────────

const flows: Record<FlowKey, Flow> = {
  jobs: {
    userMsg: 'Find open tech jobs',
    q2: 'Select your specialization:',
    choices2: [
      {
        label: 'Software Engineering',
        icon: <Layout className="w-3.5 h-3.5" />,
        url: '/jobs?skill=software',
      },
      {
        label: 'DevOps & Cloud',
        icon: <Cloud className="w-3.5 h-3.5" />,
        url: '/jobs?skill=devops',
      },
      {
        label: 'QA & Testing',
        icon: <TestTube className="w-3.5 h-3.5" />,
        url: '/jobs?skill=qa',
      },
      {
        label: 'Backend / Systems',
        icon: <Server className="w-3.5 h-3.5" />,
        url: '/jobs?skill=backend',
      },
      {
        label: 'Remote / Hybrid',
        icon: <Globe className="w-3.5 h-3.5" />,
        url: '/jobs?remote=true',
      },
    ],
    finalMsg:
      'Explore open roles and optimize your application match score before applying.',
    ctaLabel: 'Browse Tech Jobs',
    ctaUrl: '/jobs',
  },

  companies: {
    userMsg: 'Discover tech companies',
    q2: 'What are you looking for in a company?',
    choices2: [
      {
        label: 'Hiring Tech Companies',
        icon: <Briefcase className="w-3.5 h-3.5" />,
        url: '/startups',
      },
      {
        label: 'Directory Index',
        icon: <Building className="w-3.5 h-3.5" />,
        url: '/startups',
      },
      {
        label: 'Submit a Company',
        icon: <Plus className="w-3.5 h-3.5" />,
        url: '/startups/submit',
      },
    ],
    finalMsg:
      'Direct access to top tech hubs, engineering teams, and tech employers.',
    ctaLabel: 'Explore Companies',
    ctaUrl: '/startups',
  },

  roadmaps: {
    userMsg: 'View career roadmaps',
    q2: 'Which path are you targeting?',
    choices2: [
      {
        label: 'AI Engineer',
        icon: <Brain className="w-3.5 h-3.5" />,
        url: '/roadmaps/ai-engineer',
      },
      {
        label: 'DevOps Engineer',
        icon: <Cloud className="w-3.5 h-3.5" />,
        url: '/roadmaps/devops-engineer',
      },
      {
        label: 'QA Engineer',
        icon: <TestTube className="w-3.5 h-3.5" />,
        url: '/roadmaps/qa-engineer',
      },
      {
        label: 'Frontend System',
        icon: <Layout className="w-3.5 h-3.5" />,
        url: '/roadmaps/frontend-developer',
      },
      {
        label: 'Full-Stack Hybrid',
        icon: <Layers className="w-3.5 h-3.5" />,
        url: '/roadmaps/fullstack-devops-qa-hybrid',
      },
    ],
    finalMsg:
      'Step-by-step technical requirements tailored to what top employers expect.',
    ctaLabel: 'Open Roadmaps',
    ctaUrl: '/roadmaps',
  },

  resources: {
    userMsg: 'Explore career resources',
    q2: 'Select a content type:',
    choices2: [
      {
        label: 'Articles & Guides',
        icon: <FileText className="w-3.5 h-3.5" />,
        url: '/blog',
      },
      {
        label: 'Tech Podcast',
        icon: <Mic className="w-3.5 h-3.5" />,
        url: '/podcast',
      },
      {
        label: 'Market Insights',
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        url: '/blog?tag=job-market',
      },
      {
        label: 'System Architecture',
        icon: <Network className="w-3.5 h-3.5" />,
        url: '/blog?tag=architecture',
      },
    ],
    finalMsg:
      'In-depth engineering analyses, podcast conversations, and market reports.',
    ctaLabel: 'View Resources',
    ctaUrl: '/blog',
  },
};

const PILLAR_CHOICES: {
  key: FlowKey;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'jobs',
    label: 'Find Jobs',
    icon: <Briefcase className="w-3.5 h-3.5" />,
  },
  {
    key: 'companies',
    label: 'Discover Companies',
    icon: <Building className="w-3.5 h-3.5" />,
  },
  {
    key: 'roadmaps',
    label: 'Career Roadmaps',
    icon: <Map className="w-3.5 h-3.5" />,
  },
  {
    key: 'resources',
    label: 'Resources',
    icon: <FileText className="w-3.5 h-3.5" />,
  },
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 pl-8">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-400"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bot Bubble ───────────────────────────────────────────────────────────────

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400">
        <HirelyLogo
          size="xs"
          showWordmark={false}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-[88%] whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}

// ─── User Bubble ──────────────────────────────────────────────────────────────

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] font-medium">
        {text}
      </div>
    </div>
  );
}

// ─── Choice Button ────────────────────────────────────────────────────────────

function ChoiceButton({
  icon,
  label,
  selected,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
        ${
          selected
            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
            : disabled
              ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/20 cursor-pointer'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

function ChatHero() {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);

  const INITIAL: Message[] = [
    {
      type: 'bot',
      id: 'intro',
      text: '👋 Hi! I can help you:\n• Find the right tech job\n• Discover companies\n• Generate an AI application\n\nWhat would you like to do?',
    },
    {
      type: 'choices1',
      id: 'c1',
    },
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [step, setStep] = useState<'start' | 'step2' | 'done'>('start');
  const [selectedKey, setSelectedKey] = useState<FlowKey | null>(null);
  const [selectedChoice2, setSelected2] = useState<string | null>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  function push(msgs: Message[], delay = 0) {
    setTimeout(() => {
      setMessages((p) => [...p, ...msgs]);
    }, delay);
  }

  function handlePillarPick(key: FlowKey) {
    if (step !== 'start') return;

    setSelectedKey(key);

    const flow = flows[key];

    push([
      {
        type: 'user',
        id: 'u1',
        text: flow.userMsg,
      },
    ]);

    push(
      [
        {
          type: 'typing',
          id: 'typing1',
        },
      ],
      200
    );

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing1'),
        {
          type: 'bot',
          id: 'q2',
          text: flow.q2,
        },
        {
          type: 'choices2',
          id: 'c2',
          choices: flow.choices2,
        },
      ]);

      setStep('step2');
    }, 600);
  }

  function handleChoice2Pick(choice: Choice) {
    if (step !== 'step2') return;

    setSelected2(choice.label);

    const flow = flows[selectedKey!];

    push([
      {
        type: 'user',
        id: 'u2',
        text: choice.label,
      },
    ]);

    push(
      [
        {
          type: 'typing',
          id: 'typing2',
        },
      ],
      200
    );

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing2'),
        {
          type: 'bot',
          id: 'final',
          text: flow.finalMsg,
        },
        {
          type: 'cta',
          id: 'cta',
          label: flow.ctaLabel,
          url: choice.url,
        },
      ]);

      setStep('done');
    }, 600);
  }

  function restart() {
    setMessages(INITIAL);
    setStep('start');
    setSelectedKey(null);
    setSelected2(null);
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
            AI Assistant
          </span>
        </div>

        <button
          onClick={restart}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          aria-label="Restart conversation"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Chat Body */}
      <div
        ref={bodyRef}
        className="flex flex-col gap-3 px-4 py-4 overflow-y-auto"
        style={{
          minHeight: '310px',
          maxHeight: '370px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
            >
              {msg.type === 'bot' && <BotBubble text={msg.text} />}

              {msg.type === 'user' && <UserBubble text={msg.text} />}

              {msg.type === 'typing' && <TypingIndicator />}

              {msg.type === 'choices1' && (
                <div className="flex flex-wrap gap-2 pl-8 mt-1">
                  {PILLAR_CHOICES.map((p) => (
                    <ChoiceButton
                      key={p.key}
                      icon={p.icon}
                      label={p.label}
                      selected={selectedKey === p.key}
                      disabled={
                        selectedKey !== null && selectedKey !== p.key
                      }
                      onClick={() => handlePillarPick(p.key)}
                    />
                  ))}
                </div>
              )}

              {msg.type === 'choices2' && (
                <div className="flex flex-wrap gap-2 pl-8 mt-1">
                  {msg.choices.map((c) => (
                    <ChoiceButton
                      key={c.label}
                      icon={c.icon}
                      label={c.label}
                      selected={selectedChoice2 === c.label}
                      disabled={
                        selectedChoice2 !== null &&
                        selectedChoice2 !== c.label
                      }
                      onClick={() => handleChoice2Pick(c)}
                    />
                  ))}
                </div>
              )}

              {msg.type === 'cta' && (
                <div className="pl-8 mt-1">
                  <button
                    onClick={() => router.push(msg.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {msg.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {step === 'done'
            ? 'Select the action above to proceed →'
            : 'Choose an option to get started'}
        </p>
      </div>
    </div>
  );
}

// ─── Main Hero Section ────────────────────────────────────────────────────────

interface HeroSectionProps {
  stats?: HeroStats;
}

export default function HeroSection({
  stats,
}: HeroSectionProps) {
  const router = useRouter();

  const jobCountDisplay =
    stats && stats.jobCount > 0
      ? `${stats.jobCount}+`
      : '250+';

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-[#0F172A] transition-colors">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ─────────────────────────────────────────────────────────────── */}
          {/* LEFT COLUMN */}
          {/* ─────────────────────────────────────────────────────────────── */}

          <motion.div
            className="flex flex-col gap-6 text-center lg:text-left"
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Find Tech Jobs.{' '}
              <span className="text-indigo-600 dark:text-indigo-400">
                Apply Smarter with AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover top tech companies, get an ATS match score, generate
              personalized applications with AI, and stand out from other
              candidates.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-1">
              <SignedOut>
                {/* Primary */}
                <button
                  onClick={() => router.push('/jobs')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Find Tech Jobs
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary */}
                <button
                  onClick={() => router.push('/startups')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Explore Companies
                </button>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignedIn>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>AI-powered applications</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>ATS Match Score</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Discover Tech Companies</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{jobCountDisplay} Tech Jobs</span>
              </div>
            </div>
          </motion.div>

          {/* ─────────────────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN — AI ASSISTANT */}
          {/* ─────────────────────────────────────────────────────────────── */}

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: 'easeOut',
            }}
          >
            <ChatHero />
          </motion.div>
        </div>
      </div>
    </section>
  );
}