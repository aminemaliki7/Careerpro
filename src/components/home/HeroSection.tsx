'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Briefcase, Map, FileText, Mic, Rocket, Brain, Server,
  Layout, Cloud, TestTube, TrendingUp, Network, Award,
  Building, Plus, ArrowRight, Sparkles, RefreshCw, Globe,
  Layers, MapPin, Radio,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroStats {
  jobCount: number;
  startupCount: number;
  postCount: number;
}

type Choice = { label: string; icon: React.ReactNode; url: string };
type FlowKey = 'jobs' | 'roadmaps' | 'blog' | 'podcast' | 'startups';

type Flow = {
  userMsg: string;
  q2: string;
  choices2: Choice[];
  finalMsg: string;
  ctaLabel: string;
  ctaUrl: string;
};

type Message =
  | { type: 'bot';      id: string; text: string }
  | { type: 'user';     id: string; text: string }
  | { type: 'choices1'; id: string }
  | { type: 'choices2'; id: string; choices: Choice[] }
  | { type: 'typing';   id: string }
  | { type: 'cta';      id: string; label: string; url: string };

// ─── Flow definitions ─────────────────────────────────────────────────────────

const flows: Record<FlowKey, Flow> = {
  jobs: {
    userMsg: "I'm looking for a job",
    q2: "What's your stack?",
    choices2: [
      { label: 'Frontend / React', icon: <Layout   className="w-3.5 h-3.5" />, url: '/jobs?skill=frontend' },
      { label: 'Backend / Node',   icon: <Server   className="w-3.5 h-3.5" />, url: '/jobs?skill=backend'  },
      { label: 'DevOps / Cloud',   icon: <Cloud    className="w-3.5 h-3.5" />, url: '/jobs?skill=devops'   },
      { label: 'QA / Testing',     icon: <TestTube className="w-3.5 h-3.5" />, url: '/jobs?skill=qa'       },
      { label: 'Remote only',      icon: <Globe    className="w-3.5 h-3.5" />, url: '/jobs?remote=true'    },
    ],
    finalMsg: 'Curated positions from startups that are actually hiring — no noise, no black holes.',
    ctaLabel: 'Browse jobs',
    ctaUrl: '/jobs',
  },
  roadmaps: {
    userMsg: 'I want a career roadmap',
    q2: 'Which role are you targeting?',
    choices2: [
      { label: 'AI Engineer',       icon: <Brain    className="w-3.5 h-3.5" />, url: '/roadmaps/ai-engineer'                },
      { label: 'DevOps Engineer',   icon: <Cloud    className="w-3.5 h-3.5" />, url: '/roadmaps/devops-engineer'            },
      { label: 'QA Engineer',       icon: <TestTube className="w-3.5 h-3.5" />, url: '/roadmaps/qa-engineer'                },
      { label: 'Frontend Dev',      icon: <Layout   className="w-3.5 h-3.5" />, url: '/roadmaps/frontend-developer'         },
      { label: 'Full-Stack Hybrid', icon: <Layers   className="w-3.5 h-3.5" />, url: '/roadmaps/fullstack-devops-qa-hybrid' },
    ],
    finalMsg: 'Step-by-step path for your role — skills, tools and timelines built around what startups expect today.',
    ctaLabel: 'View roadmaps',
    ctaUrl: '/roadmaps',
  },
  blog: {
    userMsg: 'I want to read something',
    q2: 'What topic interests you?',
    choices2: [
      { label: 'AI & LLMs',      icon: <Brain    className="w-3.5 h-3.5" />, url: '/blog?tag=ai'                                        },
      { label: 'Job market',     icon: <TrendingUp className="w-3.5 h-3.5" />, url: '/blog?tag=job-market'                              },
      { label: 'System design',  icon: <Network  className="w-3.5 h-3.5" />, url: '/blog/system-design-concepts-software-engineers'      },
      { label: 'Startup world',  icon: <Rocket   className="w-3.5 h-3.5" />, url: '/blog?tag=startups'                                   },
      { label: 'Career advice',  icon: <Award    className="w-3.5 h-3.5" />, url: '/blog?tag=career-advice'                              },
    ],
    finalMsg: 'Deep dives and practical guides — written for engineers who want to think, not just ship.',
    ctaLabel: 'Read the blog',
    ctaUrl: '/blog',
  },
  podcast: {
    userMsg: 'I want to listen to the podcast',
    q2: 'What are you into?',
    choices2: [
      { label: 'AI trends',       icon: <Brain   className="w-3.5 h-3.5" />, url: '/podcast' },
      { label: 'Morocco tech',    icon: <MapPin  className="w-3.5 h-3.5" />, url: '/podcast' },
      { label: '5G & infra',      icon: <Radio   className="w-3.5 h-3.5" />, url: '/podcast' },
      { label: 'Startup stories', icon: <Rocket  className="w-3.5 h-3.5" />, url: '/podcast' },
    ],
    finalMsg: 'Audio episodes from the global tech scene. Plug in and level up on your commute.',
    ctaLabel: 'Listen now',
    ctaUrl: '/podcast',
  },
  startups: {
    userMsg: 'I want to explore startups',
    q2: 'What are you looking for?',
    choices2: [
      { label: 'Find a job there',    icon: <Briefcase className="w-3.5 h-3.5" />, url: '/startups'        },
      { label: 'Discover companies',  icon: <Building  className="w-3.5 h-3.5" />, url: '/startups'        },
      { label: 'List my startup',     icon: <Plus      className="w-3.5 h-3.5" />, url: '/startups/submit' },
    ],
    finalMsg: 'A curated directory of startups building the future. Find your next opportunity or get discovered.',
    ctaLabel: 'Explore startups',
    ctaUrl: '/startups',
  },
};

const PILLAR_CHOICES: { key: FlowKey; label: string; icon: React.ReactNode }[] = [
  { key: 'jobs',     label: 'Jobs',     icon: <Briefcase className="w-3.5 h-3.5" /> },
  { key: 'roadmaps', label: 'Roadmaps', icon: <Map       className="w-3.5 h-3.5" /> },
  { key: 'blog',     label: 'Blog',     icon: <FileText  className="w-3.5 h-3.5" /> },
  { key: 'podcast',  label: 'Podcast',  icon: <Mic       className="w-3.5 h-3.5" /> },
  { key: 'startups', label: 'Startups', icon: <Rocket    className="w-3.5 h-3.5" /> },
];

// ─── Stat formatting helper ───────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}K+`;
  if (n > 0) return `${n}+`;
  return '—';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 pl-8">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-400"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed max-w-[85%]">
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-[#0A66C2] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]">
        {text}
      </div>
    </div>
  );
}

function ChoiceButton({
  icon, label, selected, disabled, onClick,
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all duration-150
        ${selected
          ? 'bg-[#0A66C2] border-[#0A66C2] text-white'
          : disabled
          ? 'border-gray-100 text-gray-300 cursor-not-allowed'
          : 'border-gray-200 text-gray-700 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-blue-50 cursor-pointer'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Chatbot component ────────────────────────────────────────────────────────

function ChatHero() {
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);

  const INITIAL: Message[] = [
    { type: 'bot',      id: 'intro', text: 'Hey! What are you looking for today?' },
    { type: 'choices1', id: 'c1' },
  ];

  const [messages, setMessages]         = useState<Message[]>(INITIAL);
  const [step, setStep]                 = useState<'start' | 'step2' | 'done'>('start');
  const [selectedKey, setSelectedKey]   = useState<FlowKey | null>(null);
  const [selectedChoice2, setSelected2] = useState<string | null>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  function push(msgs: Message[], delay = 0) {
    setTimeout(() => setMessages((p) => [...p, ...msgs]), delay);
  }

  function handlePillarPick(key: FlowKey) {
    if (step !== 'start') return;
    setSelectedKey(key);
    const flow = flows[key];

    push([{ type: 'user', id: `u1`, text: flow.userMsg }]);
    push([{ type: 'typing', id: 'typing1' }], 300);

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing1'),
        { type: 'bot',      id: 'q2', text: flow.q2 },
        { type: 'choices2', id: 'c2', choices: flow.choices2 },
      ]);
      setStep('step2');
    }, 1100);
  }

  function handleChoice2Pick(choice: Choice) {
    if (step !== 'step2') return;
    setSelected2(choice.label);
    const flow = flows[selectedKey!];

    push([{ type: 'user', id: 'u2', text: choice.label }]);
    push([{ type: 'typing', id: 'typing2' }], 300);

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing2'),
        { type: 'bot', id: 'final', text: flow.finalMsg },
        { type: 'cta', id: 'cta',  label: flow.ctaLabel, url: choice.url },
      ]);
      setStep('done');
    }, 1100);
  }

  function restart() {
    setMessages(INITIAL);
    setStep('start');
    setSelectedKey(null);
    setSelected2(null);
  }

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 leading-none">Hirely Assistant</p>
            <p className="text-[10px] text-green-600 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Restart conversation"
        >
          <RefreshCw className="w-3 h-3" />
          Restart
        </button>
      </div>

      {/* Chat body */}
      <div
        ref={bodyRef}
        className="flex flex-col gap-3 px-4 py-4 overflow-y-auto"
        style={{ minHeight: '300px', maxHeight: '380px' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {msg.type === 'bot'  && <BotBubble  text={msg.text} />}
              {msg.type === 'user' && <UserBubble text={msg.text} />}
              {msg.type === 'typing' && <TypingIndicator />}

              {msg.type === 'choices1' && (
                <div className="flex flex-wrap gap-2 pl-8">
                  {PILLAR_CHOICES.map((p) => (
                    <ChoiceButton
                      key={p.key}
                      icon={p.icon}
                      label={p.label}
                      selected={selectedKey === p.key}
                      disabled={selectedKey !== null && selectedKey !== p.key}
                      onClick={() => handlePillarPick(p.key)}
                    />
                  ))}
                </div>
              )}

              {msg.type === 'choices2' && (
                <div className="flex flex-wrap gap-2 pl-8">
                  {msg.choices.map((c) => (
                    <ChoiceButton
                      key={c.label}
                      icon={c.icon}
                      label={c.label}
                      selected={selectedChoice2 === c.label}
                      disabled={selectedChoice2 !== null && selectedChoice2 !== c.label}
                      onClick={() => handleChoice2Pick(c)}
                    />
                  ))}
                </div>
              )}

              {msg.type === 'cta' && (
                <div className="pl-8">
                  <button
                    onClick={() => router.push(msg.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white text-xs font-medium hover:bg-[#004182] transition-colors"
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
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
        <p className="text-[11px] text-gray-400">
          {step === 'done' ? 'Click the button above to continue →' : 'Choose an option to get started'}
        </p>
      </div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────

interface HeroSectionProps {
  stats?: HeroStats;
}

const HeroSection = ({ stats }: HeroSectionProps) => {
  const router = useRouter();

  const displayStats = [
    {
      num: stats ? formatCount(stats.jobCount) : '—',
      label: 'Tech jobs',
    },
    {
      num: stats ? formatCount(stats.startupCount) : '—',
      label: 'Startups',
    },
    {
      num: stats ? formatCount(stats.postCount) : '—',
      label: 'Resources',
    },
  ];

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: copy */}
          <motion.div
            className="flex flex-col gap-5 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#0A66C2] border border-[#0A66C2]/20 bg-[#0A66C2]/5 rounded-full px-3 py-1.5 font-medium">
                <Sparkles className="w-3 h-3" />
                Your tech career, guided
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight tracking-tight">
              Don&apos;t just find a job.{' '}
              <span className="text-[#0A66C2]">
                Become the candidate startups want.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Curated jobs, structured roadmaps, and insider content — built for
              developers, QA, and DevOps who want to stand out.
            </p>

            <div className="flex justify-center lg:justify-start">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Build your tech profile
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to dashboard
                </button>
              </SignedIn>
            </div>

            {/* Stats — real data from Supabase + MDX count */}
            <div className="flex justify-center lg:justify-start gap-8 pt-2 border-t border-gray-100">
              {displayStats.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <motion.span
                    className="text-xl font-semibold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {s.num}
                  </motion.span>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <ChatHero />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;