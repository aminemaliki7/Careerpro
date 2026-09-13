'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Clock, ChevronRight, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface SkillGapStep {
  roadmapId: string;
  roadmapTitle: string;
  step: {
    id: string;
    title: string;
    description: string;
    duration: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  coversSkills: string[];
}

interface UncoveredSkill {
  skill: string;
  severity: 'critical' | 'moderate' | 'minor';
}

interface SkillGapResult {
  primaryRoadmap: { id: string; title: string; totalDuration: string } | null;
  learningPath: SkillGapStep[];
  uncoveredSkills: UncoveredSkill[];
  estimatedTotalDuration: string | null;
}

interface AggregateResponse {
  analyzedApplicationsCount: number;
  basedOnJobTitle?: string;
  skillGap: SkillGapResult;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function SkillGapTab() {
  const [data, setData] = useState<AggregateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSkillGap() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/jobs/skill-gap/aggregate', { method: 'GET' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to build learning path.');
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

    fetchSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 text-xs font-medium">
        Analyzing your application history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      </div>
    );
  }

  if (!data || data.analyzedApplicationsCount === 0) {
    return (
      <div className="py-16 text-center px-4">
        <GraduationCap className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
        <p className="text-slate-800 text-sm font-semibold">No CV data available yet</p>
        <p className="text-slate-400 text-xs mt-1">
          Apply to a job with your CV to unlock a personalized skill gap and learning path.
        </p>
      </div>
    );
  }

  const { skillGap } = data;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Based on {data.analyzedApplicationsCount} past application{data.analyzedApplicationsCount !== 1 ? 's' : ''}
          {data.basedOnJobTitle ? <> • targeting <span className="font-semibold text-slate-700">{data.basedOnJobTitle}</span></> : null}
        </p>
      </div>

      {skillGap.learningPath.length === 0 && skillGap.uncoveredSkills.length === 0 && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
          <p className="text-xs font-semibold text-emerald-800">No recurring skill gaps found across your applications</p>
        </div>
      )}

      {skillGap.primaryRoadmap && (
        <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
              Recommended Roadmap
            </span>
            <span className="text-sm font-bold text-slate-900 block mt-0.5">
              {skillGap.primaryRoadmap.title}
            </span>
          </div>
          <Link
            href={`/roadmaps/${skillGap.primaryRoadmap.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900"
          >
            View Roadmap <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {skillGap.learningPath.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Your Learning Path
          </p>
          {skillGap.learningPath.map((item, i) => (
            <div key={`${item.roadmapId}-${item.step.id}`} className="bg-white border border-slate-200/80 rounded-xl p-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900">{item.step.title}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${DIFFICULTY_STYLES[item.step.difficulty]}`}>
                      {item.step.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.step.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {item.step.duration}
                    {item.roadmapId !== skillGap.primaryRoadmap?.id && (
                      <span className="text-slate-300">• from {item.roadmapTitle}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.coversSkills.map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {skillGap.uncoveredSkills.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
          <p className="font-bold text-[10px] uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Skills Without a Matching Course
          </p>
          <div className="flex flex-wrap gap-1">
            {skillGap.uncoveredSkills.map((u) => (
              <span key={u.skill} className="bg-white text-amber-800 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                {u.skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
