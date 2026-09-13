import type { JobQualityAnalysis } from '@/lib/job-quality';

interface JobQualityPanelProps {
  analysis: JobQualityAnalysis;
}

const VERDICT_CONFIG: Record<
  JobQualityAnalysis['verdict'],
  { label: string; style: string; barColor: string }
> = {
  strong_opportunity: {
    label: 'Worth applying',
    style: 'border-emerald-200 bg-emerald-50/60',
    barColor: 'bg-emerald-500',
  },
  solid_opportunity: {
    label: 'Good opportunity',
    style: 'border-blue-200 bg-blue-50/60',
    barColor: 'bg-blue-500',
  },
  proceed_with_caution: {
    label: 'Worth considering',
    style: 'border-amber-200 bg-amber-50/60',
    barColor: 'bg-amber-500',
  },
  red_flags_present: {
    label: 'Check before applying',
    style: 'border-rose-200 bg-rose-50/60',
    barColor: 'bg-rose-500',
  },
};

const SEVERITY_DOT: Record<string, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-gray-400',
};

export default function JobQualityPanel({ analysis }: JobQualityPanelProps) {
  const config = VERDICT_CONFIG[analysis.verdict];
  const concerns = analysis.signals.filter((s) => s.type === 'concern');
  const positives = analysis.signals.filter((s) => s.type === 'positive');

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 space-y-3">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        Opportunity Check
      </h2>

      <div className={`rounded-xl border p-3 ${config.style}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-900">
            {config.label}
          </span>

          <span className="text-xs font-bold text-gray-700">
            {analysis.score}/100
          </span>
        </div>

        <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${config.barColor}`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      {analysis.matchedStartup && (
        <p className="text-[11px] text-gray-500">
          Company profile matched:{' '}
          <span className="font-semibold text-gray-700">
            {analysis.matchedStartup.name}
          </span>
        </p>
      )}

      {positives.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Why apply
          </p>

          <ul className="space-y-1.5">
            {positives.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />

                <span className="text-[11px] text-gray-600">
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {concerns.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Before applying
          </p>

          <ul className="space-y-1.5">
            {concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    SEVERITY_DOT[c.severity]
                  }`}
                />

                <span className="text-[11px] text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {c.label}
                  </span>{' '}
                  - {c.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
        Based on the posting details and available company data.
      </p>
    </div>
  );
}
