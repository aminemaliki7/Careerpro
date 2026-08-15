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
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Document: () => (
    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Spinner: () => (
    <svg className="animate-spin w-4 h-4 mr-2 inline" viewBox="0 0 24 24">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Icons.Sparkles /> Easy Apply with AI
            </h2>
            <p className="text-xs text-purple-100 font-light">{jobTitle} at {company}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
            <Icons.Close />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-gray-50 border-b px-4 py-3 flex justify-between">
          {stepsList.map((label, idx) => {
            const num = idx + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                    isDone ? 'bg-green-500 text-white' : isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isDone ? <Icons.CheckCircle /> : num}
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
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">
              {status.error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <h3 className="text-base font-medium">Enter your full name</h3>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Amine"
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-purple-400 transition flex flex-col items-center">
                <Icons.Document />
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={status.parsing}
                />
                <label htmlFor="cv-upload" className="cursor-pointer text-purple-600 font-medium text-sm mt-2">
                  {status.parsing ? 'Processing file...' : 'Click to upload CV (PDF, DOCX, TXT)'}
                </label>
                {cvFile && !status.parsing && (
                  <span className="mt-2 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    {cvFile.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 3 && atsResult && (
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl border-l-4 bg-purple-50 border-purple-600 flex justify-between items-center">
                <span className="font-semibold text-purple-900">Match Score: {atsResult.matchScore}%</span>
                <span className="text-xs text-purple-700">{atsResult.summary}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border space-y-2">
                <p className="font-medium text-xs text-green-700">Matched Skills</p>
                <div className="flex flex-wrap gap-1">
                  {atsResult.matchedSkills.map((s) => (
                    <span key={s} className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              {status.savedSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-2 rounded-xl flex items-center gap-1">
                  <Icons.CheckCircle /> Saved successfully!
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Generated Email Body</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedEmail);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-purple-600 hover:underline font-medium"
                >
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              </div>
              <textarea
                value={generatedEmail}
                onChange={(e) => setGeneratedEmail(e.target.value)}
                rows={8}
                className="w-full border rounded-xl p-3 text-xs bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border text-gray-700 text-xs rounded-full hover:bg-white transition"
            >
              Back
            </button>
          )}

          <div className="ml-auto flex gap-2">
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                disabled={userName.trim().length < 2}
                className="px-5 py-2 bg-black text-white text-xs rounded-full disabled:opacity-40 transition"
              >
                Continue
              </button>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={handleRunAtsCheck}
                  disabled={cvText.length < 50 || status.atsLoading}
                  className="px-4 py-2 border border-purple-600 text-purple-600 text-xs rounded-full hover:bg-purple-50 disabled:opacity-40 transition"
                >
                  {status.atsLoading && <Icons.Spinner />} ATS Check
                </button>
                <button
                  onClick={handleGenerateEmail}
                  disabled={cvText.length < 50 || status.generating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full disabled:opacity-40 transition"
                >
                  {status.generating && <Icons.Spinner />} Generate Email
                </button>
              </>
            )}

            {step === 3 && (
              <button
                onClick={handleGenerateEmail}
                disabled={status.generating}
                className="px-5 py-2 bg-purple-600 text-white text-xs rounded-full transition"
              >
                {status.generating && <Icons.Spinner />} Continue to Email
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleSendEmail}
                disabled={status.saving}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full transition"
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