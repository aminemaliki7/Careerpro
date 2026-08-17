'use client';

import { useState, ChangeEvent } from 'react';

// --- Types & Interfaces ---
interface AtsResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendations: string[];
  summary: string;
}

interface EasyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  jobId: string | number;
  requirements?: string[];
  description?: string;
  contactEmail?: string;
  skills?: string[];
  location?: string;
  salaryRange?: string;
}

// --- Icons Component Map ---
const Icons = {
  Close: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Document: ({ className = "w-8 h-8 text-gray-400" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Spinner: ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

export default function EasyApplyModal({
  isOpen,
  onClose,
  jobTitle,
  company,
  jobId,
  requirements = [],
  description = '',
  contactEmail = '',
  skills = [],
  location,
  salaryRange,
}: EasyApplyModalProps) {
  const [step, setStep] = useState<number>(1);
  const [userName, setUserName] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [copied, setCopied] = useState(false);

  // Status flags grouped logically
  const [status, setStatus] = useState({
    parsing: false,
    atsLoading: false,
    generating: false,
    saving: false,
    savedSuccess: false,
    error: '',
  });

  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);

  if (!isOpen) return null;

  // --- Helpers ---
  const updateStatus = (patch: Partial<typeof status>) =>
    setStatus((prev) => ({ ...prev, ...patch }));

  const extractTextFromFile = async (file: File): Promise<string> => {
    const isTxt = file.type === 'text/plain' || file.name.endsWith('.txt');
    if (isTxt) return await file.text();

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/parse-cv', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to read file.');
    return data.text;
  };

  // --- Event Handlers ---
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    updateStatus({ parsing: true, error: '' });
    setAtsResult(null);

    try {
      const text = await extractTextFromFile(file);
      if (text && text.length > 10) {
        setCvText(text);
      } else {
        updateStatus({ error: 'File is empty or unreadable.' });
      }
    } catch (err) {
      updateStatus({ error: err instanceof Error ? err.message : 'Error processing file.' });
    } finally {
      updateStatus({ parsing: false });
    }
  };

  const handleRunAtsCheck = async () => {
    if (cvText.trim().length < 50) return;

    updateStatus({ atsLoading: true, error: '' });
    try {
      const res = await fetch('/api/jobs/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: cvText.trim(), jobTitle, company, requirements, description, skills }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ATS evaluation failed.');

      setAtsResult(data);
      setStep(3);
    } catch (err) {
      updateStatus({ error: err instanceof Error ? err.message : 'ATS Check failed.' });
    } finally {
      updateStatus({ atsLoading: false });
    }
  };

  const handleGenerateEmail = async () => {
    if (cvText.trim().length < 50) return;

    updateStatus({ generating: true, error: '' });
    try {
      const res = await fetch('/api/jobs/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: cvText.trim(), jobTitle, company, requirements, description, skills, userName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Email generation failed.');

      setGeneratedEmail(data.emailContent);
      setStep(4);
    } catch (err) {
      updateStatus({ error: 'Failed to generate application email.' });
    } finally {
      updateStatus({ generating: false });
    }
  };

  const handleSaveApplication = async () => {
    updateStatus({ saving: true, error: '' });
    try {
      let cvFileUrl, cvFileName;
      if (cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        const uploadRes = await fetch('/api/applications/upload-cv', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        cvFileUrl = uploadData.url;
        cvFileName = uploadData.filename;
      }

      const res = await fetch('/api/applications/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          job_title: jobTitle,
          company,
          location,
          salary_range: salaryRange,
          cv_text: cvText.trim(),
          cv_url: cvFileUrl,
          cv_file_name: cvFileName,
          generated_email: generatedEmail,
        }),
      });

      if (!res.ok) throw new Error('Failed to save record.');

      updateStatus({ savedSuccess: true });
      setTimeout(() => {
        updateStatus({ savedSuccess: false });
        onClose();
      }, 2000);
    } catch (err) {
      updateStatus({ error: err instanceof Error ? err.message : 'Error saving application.' });
    } finally {
      updateStatus({ saving: false });
    }
  };

  const handleSendEmail = () => {
    if (!contactEmail) {
      updateStatus({ error: 'No contact email provided for this listing.' });
      return;
    }
    handleSaveApplication();
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(`Application for ${jobTitle}`)}&body=${encodeURIComponent(generatedEmail)}`;
    window.location.href = mailto;
  };

  const stepsList = ['Info', 'CV Upload', 'ATS Check', 'Review & Send'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Icons.Sparkles className="w-4 h-4 text-purple-600" /> 
              Easy Apply with AI
            </h2>
            <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{jobTitle} • {company}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200/80 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Close modal"
          >
            <Icons.Close className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-gray-50/60 border-b border-gray-100 px-4 py-2.5 flex justify-between">
          {stepsList.map((label, idx) => {
            const num = idx + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition ${
                    isDone 
                      ? 'bg-emerald-600 text-white' 
                      : isActive 
                        ? 'bg-purple-600 text-white shadow-2xs' 
                        : 'bg-gray-200/80 text-gray-500'
                  }`}
                >
                  {isDone ? <Icons.CheckCircle className="w-3.5 h-3.5" /> : num}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {status.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
              {status.error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <label htmlFor="applicant-name" className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
                Full Name
              </label>
              <input
                id="applicant-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Amine m"
                className="w-full border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 transition-colors shadow-2xs"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 hover:border-purple-400 transition-colors flex flex-col items-center">
                <Icons.Document className="w-8 h-8 text-gray-400 mb-1" />
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={status.parsing}
                />
                <label htmlFor="cv-upload" className="cursor-pointer text-purple-600 font-semibold text-xs mt-1 hover:underline">
                  {status.parsing ? 'Processing file...' : 'Upload CV (PDF, DOCX, TXT)'}
                </label>
                {cvFile && !status.parsing && (
                  <span className="mt-2.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                    {cvFile.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 3 && atsResult && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 flex justify-between items-center">
                <div>
                  <span className="font-bold text-purple-900 block text-xs">Match Score: {atsResult.matchScore}%</span>
                  <span className="text-[11px] text-purple-700 mt-0.5 block">{atsResult.summary}</span>
                </div>
              </div>
              <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-200/80 space-y-2">
                <p className="font-bold text-[10px] uppercase tracking-wider text-emerald-700">Matched Skills</p>
                <div className="flex flex-wrap gap-1">
                  {atsResult.matchedSkills.map((s) => (
                    <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {status.savedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-2.5 rounded-xl font-medium flex items-center gap-1.5">
                  <Icons.CheckCircle className="w-4 h-4" /> Application record saved!
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">Generated Pitch</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedEmail);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-purple-600 hover:underline font-semibold"
                >
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              </div>
              <textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                rows={8}
                className="w-full border border-gray-200/80 rounded-xl p-3 text-xs bg-gray-50/50 text-gray-800 focus:bg-white focus:border-purple-600 outline-none resize-none font-mono leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50/60 border-t border-gray-100 flex justify-between items-center">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3 py-1.5 border border-gray-200/80 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
            >
              Back
            </button>
          )}

          <div className="ml-auto flex gap-2">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                disabled={userName.trim().length < 2}
                className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black disabled:opacity-40 transition-colors shadow-2xs"
              >
                Continue
              </button>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={handleRunAtsCheck}
                  disabled={cvText.length < 50 || status.atsLoading}
                  className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg hover:bg-purple-100/80 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {status.atsLoading && <Icons.Spinner />} ATS Check
                </button>
                <button
                  onClick={handleGenerateEmail}
                  disabled={cvText.length < 50 || status.generating}
                  className="px-4 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {status.generating && <Icons.Spinner />} Generate Email
                </button>
              </>
            )}

            {step === 3 && (
              <button
                onClick={handleGenerateEmail}
                disabled={status.generating}
                className="px-4 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {status.generating && <Icons.Spinner />} Continue to Email
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleSendEmail}
                disabled={status.saving}
                className="px-4 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                {status.saving && <Icons.Spinner />} Apply via Email
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}