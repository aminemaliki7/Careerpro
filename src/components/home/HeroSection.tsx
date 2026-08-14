'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Briefcase, Map, FileText, Mic, Brain, Server,
  Layout, Cloud, TestTube, TrendingUp, Network,
  Building, Plus, ArrowRight, RefreshCw, Globe,
  Layers, CheckCircle2,
} from 'lucide-react';

// ─── Hirely Logo Component ────────────────────────────────────────────────────

interface HirelyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

function HirelyLogo({
  size = 'md',
  className = '',
  color = '#0A66C2',
}: HirelyLogoProps) {
  const iconSize = { xs: 20, sm: 24, md: 28, lg: 36 }[size];
  const textSize = { xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size];
  const hex = '-14.43,-8.33 0,-16.67 14.43,-8.33 14.43,8.33 0,16.67 -14.43,8.33';

  return (
    <div className={`flex items-center gap-2 cursor-pointer ${className}`}>
      {/* Hexagon icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(50,50)">
          <polygon points={hex} fill={color} transform="translate(0,-28.87)" />
          <polygon points={hex} fill={color} transform="translate(25,-14.43)" />
          <polygon points={hex} fill={color} transform="translate(25,14.43)" />
          <polygon points={hex} fill={color} transform="translate(0,28.87)" />
          <polygon points={hex} fill={color} transform="translate(-25,14.43)" />
          <polygon points={hex} fill={color} transform="translate(-25,-14.43)" />
        </g>
      </svg>

      {/* Wordmark */}
      <span
        className={`font-bold tracking-tight leading-none ${textSize}`}
        style={{ color }}
      >
    
      </span>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroStats {
  jobCount: number;
  companyCount: number;
  postCount: number;
}

type Choice = { label: string; icon: React.ReactNode; url: string };
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
  | { type: 'bot';      id: string; text: string }
  | { type: 'user';     id: string; text: string }
  | { type: 'choices1'; id: string }
  | { type: 'choices2'; id: string; choices: Choice[] }
  | { type: 'typing';   id: string }
  | { type: 'cta';      id: string; label: string; url: string };

// ─── Flow definitions ─────────────────────────────────────────────────────────

const flows: Record<FlowKey, Flow> = {
  jobs: {
    userMsg: 'Find open tech jobs',
    q2: 'Select your specialization:',
    choices2: [
      { label: 'Software Engineering', icon: <Layout className="w-3.5 h-3.5" />, url: '/jobs?skill=software' },
      { label: 'DevOps & Cloud',       icon: <Cloud className="w-3.5 h-3.5" />, url: '/jobs?skill=devops' },
      { label: 'QA & Testing',         icon: <TestTube className="w-3.5 h-3.5" />, url: '/jobs?skill=qa' },
      { label: 'Backend / Systems',    icon: <Server className="w-3.5 h-3.5" />, url: '/jobs?skill=backend' },
      { label: 'Remote / Hybrid',      icon: <Globe className="w-3.5 h-3.5" />, url: '/jobs?remote=true' },
    ],
    finalMsg: 'Explore open roles and optimize your application match score before applying.',
    ctaLabel: 'Browse Tech Jobs',
    ctaUrl: '/jobs',
  },
  companies: {
    userMsg: 'Discover tech companies',
    q2: 'What are you looking for in a company?',
    choices2: [
      { label: 'Hiring Tech Companies', icon: <Briefcase className="w-3.5 h-3.5" />, url: '/startups' },
      { label: 'Directory Index',       icon: <Building className="w-3.5 h-3.5" />, url: '/startups' },
      { label: 'Submit a Company',      icon: <Plus className="w-3.5 h-3.5" />, url: '/startups/submit' },
    ],
    finalMsg: 'Direct access to top tech hubs, engineering teams, and tech employers.',
    ctaLabel: 'Explore Companies',
    ctaUrl: '/startups',
  },
  roadmaps: {
    userMsg: 'View career roadmaps',
    q2: 'Which path are you targeting?',
    choices2: [
      { label: 'AI Engineer',       icon: <Brain className="w-3.5 h-3.5" />, url: '/roadmaps/ai-engineer' },
      { label: 'DevOps Engineer',   icon: <Cloud className="w-3.5 h-3.5" />, url: '/roadmaps/devops-engineer' },
      { label: 'QA Engineer',       icon: <TestTube className="w-3.5 h-3.5" />, url: '/roadmaps/qa-engineer' },
      { label: 'Frontend System',   icon: <Layout className="w-3.5 h-3.5" />, url: '/roadmaps/frontend-developer' },
      { label: 'Full-Stack Hybrid', icon: <Layers className="w-3.5 h-3.5" />, url: '/roadmaps/fullstack-devops-qa-hybrid' },
    ],
    finalMsg: 'Step-by-step technical requirements tailored to what top employers expect.',
    ctaLabel: 'Open Roadmaps',
    ctaUrl: '/roadmaps',
  },
  resources: {
    userMsg: 'Explore career resources',
    q2: 'Select a content type:',
    choices2: [
      { label: 'Articles & Guides',   icon: <FileText className="w-3.5 h-3.5" />, url: '/blog' },
      { label: 'Tech Podcast',       icon: <Mic className="w-3.5 h-3.5" />, url: '/podcast' },
      { label: 'Market Insights',     icon: <TrendingUp className="w-3.5 h-3.5" />, url: '/blog?tag=job-market' },
      { label: 'System Architecture', icon: <Network className="w-3.5 h-3.5" />, url: '/blog?tag=architecture' },
    ],
    finalMsg: 'In-depth engineering analyses, podcast conversations, and market reports.',
    ctaLabel: 'View Resources',
    ctaUrl: '/blog',
  },
};

const PILLAR_CHOICES: { key: FlowKey; label: string; icon: React.ReactNode }[] = [
  { key: 'jobs',      label: 'Find Jobs',          icon: <Briefcase className="w-3.5 h-3.5" /> },
  { key: 'companies', label: 'Discover Companies', icon: <Building className="w-3.5 h-3.5" /> },
  { key: 'roadmaps',  label: 'Career Roadmaps',    icon: <Map className="w-3.5 h-3.5" /> },
  { key: 'resources', label: 'Resources',          icon: <FileText className="w-3.5 h-3.5" /> },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 pl-8">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-300"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5">
        <HirelyLogo size="xs" />
      </div>
      <div className="bg-gray-50 border border-gray-200/80 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed max-w-[88%] whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-[#0A66C2] text-white rounded-xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%] font-medium">
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
        ${selected
          ? 'bg-gray-900 border-gray-900 text-white'
          : disabled
          ? 'border-gray-100 text-gray-300 cursor-not-allowed'
          : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
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
    {
      type: 'bot',
      id: 'intro',
      text: '👋 Hi! I can help you:\n• Find the right tech job\n• Discover companies\n• Generate an AI application\n\nWhat would you like to do?',
    },
    { type: 'choices1', id: 'c1' },
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [step, setStep] = useState<'start' | 'step2' | 'done'>('start');
  const [selectedKey, setSelectedKey] = useState<FlowKey | null>(null);
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
    push([{ type: 'typing', id: 'typing1' }], 200);

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing1'),
        { type: 'bot', id: 'q2', text: flow.q2 },
        { type: 'choices2', id: 'c2', choices: flow.choices2 },
      ]);
      setStep('step2');
    }, 600);
  }

  function handleChoice2Pick(choice: Choice) {
    if (step !== 'step2') return;
    setSelected2(choice.label);
    const flow = flows[selectedKey!];

    push([{ type: 'user', id: 'u2', text: choice.label }]);
    push([{ type: 'typing', id: 'typing2' }], 200);

    setTimeout(() => {
      setMessages((p) => [
        ...p.filter((m) => m.id !== 'typing2'),
        { type: 'bot', id: 'final', text: flow.finalMsg },
        { type: 'cta', id: 'cta', label: flow.ctaLabel, url: choice.url },
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
    <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-gray-500 tracking-tight">AI Assistant</span>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Restart conversation"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Chat body */}
      <div
        ref={bodyRef}
        className="flex flex-col gap-3 px-4 py-4 overflow-y-auto"
        style={{ minHeight: '310px', maxHeight: '370px' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
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
                      disabled={selectedKey !== null && selectedKey !== p.key}
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
                      disabled={selectedChoice2 !== null && selectedChoice2 !== c.label}
                      onClick={() => handleChoice2Pick(c)}
                    />
                  ))}
                </div>
              )}

              {msg.type === 'cta' && (
                <div className="pl-8 mt-1">
                  <button
                    onClick={() => router.push(msg.url)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
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
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/30">
        <p className="text-[11px] text-gray-500 font-medium">
          {step === 'done' ? 'Select the action above to proceed →' : 'Choose an option to get started'}
        </p>
      </div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────

interface HeroSectionProps {
  stats?: HeroStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const router = useRouter();

  const jobCountDisplay = stats && stats.jobCount > 0 ? `${stats.jobCount}+` : '250+';

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Core Messaging & SEO */}
          <motion.div
            className="flex flex-col gap-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Badge */}
 

            {/* H1 SEO Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Find Tech Jobs.{' '}
              <span className="text-[#0A66C2]">Apply Smarter with AI.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover top tech companies, get an ATS match score, generate personalized applications with AI, and stand out from other candidates.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-1">
              <SignedOut>
                <button
                  onClick={() => router.push('/jobs')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors shadow-sm"
                >
                  Find Tech Jobs
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push('/startups')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Explore Companies
                </button>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors shadow-sm"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignedIn>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-medium text-gray-700 pt-2 border-t border-gray-100 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>AI-powered applications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>ATS Match Score</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Discover Tech Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{jobCountDisplay} Tech Jobs</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Assistant Chatbot */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <ChatHero />
          </motion.div>

        </div>
      </div>
    </section>
  );
}