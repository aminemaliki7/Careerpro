'use client';

import { useState } from 'react';

// --- Interfaces for AI Response ---
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
  jobId: string | number; // ADD THIS
  requirements?: string[];
  description?: string;
  contactEmail?: string;
  skills?: string[];
  location?: string; // ADD THIS
  salaryRange?: string; // ADD THIS
}

// --- Icon Components ---
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0013.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function EasyApplyModal({
  isOpen,
  onClose,
  jobTitle,
  company,
  jobId,
  requirements,
  description,
  contactEmail,
  skills,
  location,
  salaryRange,
}: EasyApplyModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string>('');
  const [parsing, setParsing] = useState<boolean>(false);

  // ATS state
  const [atsLoading, setAtsLoading] = useState<boolean>(false);
  const [atsError, setAtsError] = useState<string>('');
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);

  // Save state (NEW)
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  const [savingSuccess, setSavingSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // --- File Extraction Logic (Updated for PDF support via unpdf) ---
  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // TXT files handled directly
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    }
    
    // PDF and DOCX files sent to parse-cv endpoint (now using unpdf for PDFs)
    if (
      fileType === 'application/pdf' ||
      fileName.endsWith('.pdf') ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to read the file. Please try pasting your CV text.');
        }

        return data.text;
      } catch (err) {
        throw err;
      }
    }

    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    setError('');
    setParseError('');
    setParsing(true);
    setAtsResult(null);

    try {
      const text = await extractTextFromFile(file);
      if (text && text.length > 10) {
        setCvText(text);
        setParseError('');
      } else {
        setParseError('The file appears to be empty or could not be read properly.');
      }
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Error reading file. Please try pasting your CV text instead.');
      console.error('File parsing error:', err);
    } finally {
      setParsing(false);
    }
  };

  // Run ATS check
  const handleRunAtsCheck = async () => {
    if (!cvText || cvText.trim().length < 50) {
      setAtsError('Please provide your CV content (at least 50 characters) before running the ATS check.');
      return;
    }

    setAtsLoading(true);
    setAtsError('');
    setAtsResult(null);

    try {
      const response = await fetch('/api/jobs/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvText.trim(),
          jobTitle,
          company,
          requirements: requirements || [],
          description: description || '',
          skills: skills || [],
        }),
      });

      const data: AtsResult & { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ATS check failed');
      }

      setAtsResult({
        matchScore: data.matchScore ?? 0,
        matchedSkills: data.matchedSkills ?? [],
        missingSkills: data.missingSkills ?? [],
        strengths: data.strengths ?? [],
        recommendations: data.recommendations ?? [],
        summary: data.summary ?? 'Analysis complete.',
      });

      setCurrentStep(3);
    } catch (err) {
      setAtsError('Failed to run ATS check. Please try again.');
      console.error('ATS check error:', err);
    } finally {
      setAtsLoading(false);
    }
  };

  // Generate email with AI
  const handleGenerateEmail = async () => {
    if (!cvText || cvText.trim().length < 50) {
      setError('Please provide your CV content (at least 50 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvText.trim(),
          jobTitle,
          company,
          requirements: requirements || [],
          description: description || '',
          skills: skills || [],
          userName: userName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      setGeneratedEmail(data.emailContent);
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to generate email. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save application to database (NEW)
  const handleSaveApplication = async () => {
    if (!generatedEmail || !cvText) {
      setSaveError('Missing required data');
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const response = await fetch('/api/applications/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          job_title: jobTitle,
          company,
          location: location || null,
          salary_range: salaryRange || null,
          cv_text: cvText.trim(),
          generated_email: generatedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save application');
      }

      setSavingSuccess(true);
      // Auto close after 2 seconds
      setTimeout(() => {
        setSavingSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save application');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const handleSendEmail = () => {
    if (!contactEmail) {
      setError('No contact email available for this job');
      return;
    }

    // First save the application
    handleSaveApplication();

    // Then open email client
    const confirmSend = window.confirm(
      `Application saved to your dashboard!\n\nDon't forget to attach your resume/CV to the email before sending!\n\nClick OK to open your email client.`
    );

    if (!confirmSend) return;

    const subject = `Application for ${jobTitle} Position`;
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedEmail)}`;
    window.location.href = mailtoLink;
  };

  const canProceedToStep2 = userName.trim().length >= 2;
  const canProceedToStep3 = cvText.trim().length >= 50;
  const canProceedToStep4 = !!generatedEmail;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 40) return 'Moderate Match';
    return 'Weak Match';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-1 md:p-4 overflow-y-auto">
      {/* MODAL CONTAINER */}
      <div
        className="
          bg-white
          w-full
          max-w-full
          md:max-w-xl
          rounded-lg
          md:rounded-2xl
          overflow-hidden
          flex
          flex-col
          border
          border-gray-200
          shadow-2xl
          relative
          my-2
          md:my-auto
          max-h-[92vh]
          md:max-h-[85vh]
        "
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER - Fixed */}
        <div className="
          bg-gradient-to-r from-purple-600 to-blue-600 
          px-3 py-2 md:px-6 md:py-4
          flex flex-col gap-0.5
          md:flex-row md:items-center md:justify-between
          relative
          flex-shrink-0
        ">
          <div className="text-white">
            <h2 className="text-base md:text-2xl font-light flex items-center">
              <SparklesIcon className="h-4 w-4 md:h-6 md:w-6 mr-2 animate-pulse" />
              Easy Apply with AI
            </h2>
            <p className="text-[10px] md:text-sm mt-0.5 md:mt-2 text-purple-100 font-light">
              {jobTitle} at {company}
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              absolute top-2 right-2 md:static md:p-2
              p-1.5
              text-white/90 hover:text-white hover:bg-white/10
              rounded-full transition
            "
            aria-label="Close modal"
          >
            <CloseIcon className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        </div>

        {/* PROGRESS STEPS - Fixed */}
        <div className="bg-gray-50 px-3 py-2 md:px-6 md:py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 md:gap-4 relative">
            {[
              { num: 1, label: 'Your Info' },
              { num: 2, label: 'Upload CV' },
              { num: 3, label: 'ATS Check' },
              { num: 4, label: 'Review & Send' }
            ].map((step, index) => (
              <div
                key={step.num}
                className="flex flex-col items-center text-center flex-1"
                aria-current={currentStep === step.num ? 'step' : undefined}
              >
                <div
                  className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all flex-shrink-0 ${
                    currentStep > step.num
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : currentStep === step.num
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.num ? (
                    <CheckCircleIcon className="h-4 w-4 md:h-6 md:w-6" />
                  ) : (
                    step.num
                  )}
                </div>

                <span
                  className={`mt-1 text-[10px] md:text-sm font-medium whitespace-nowrap ${
                    currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT AREA - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 pb-20 md:pb-24">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div>
                <h3 className="text-lg md:text-xl font-light text-gray-900 mb-2">Let&quot;s start with your details</h3>
                <p className="text-gray-500 text-sm md:text-sm font-light">This information will be used to personalize your application email.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-xl p-3 md:p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2 font-light">This will appear in the email signature</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="max-w-xl mx-auto space-y-4">
              <div>
                <h3 className="text-lg md:text-xl font-light text-gray-900 mb-2">Upload your CV/Resume</h3>
                <p className="text-gray-500 text-sm md:text-sm font-light">We&quot;ll analyze your experience to create a tailored application and run an ATS check.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-5 space-y-4 shadow-sm">
                {/* FILE UPLOAD BOX - Fixed height to prevent deformation */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 md:p-6 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all min-h-[160px] md:min-h-[180px] flex flex-col items-center justify-center">
                  <DocumentIcon className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400 mb-4" />
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                    disabled={parsing}
                  />
                  <label
                    htmlFor="cv-upload"
                    className={`cursor-pointer text-purple-600 hover:text-purple-700 font-medium text-base md:text-lg ${parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {parsing ? 'Processing...' : 'Click to upload file'}
                  </label>
                  <p className="text-xs text-gray-400 mt-4 font-light">Supported formats: PDF, DOCX, TXT (max 10MB)</p>

                  {cvFile && !parsing && (
                    <div className="mt-4 inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full shadow-sm">
                      <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="font-medium text-sm truncate max-w-[160px]">{cvFile.name}</span>
                    </div>
                  )}

                  {parsing && (
                    <div className="mt-4 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-purple-600 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}

                  {parseError && !parsing && (
                    <div className="mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm inline-block">{parseError}</div>
                  )}
                </div>
              </div>

              {(error || atsError) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-sm">{error || atsError}</div>
              )}
            </div>
          )}

          {/* STEP 3 - ATS RESULTS */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-4">
              
          <div className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm space-y-4">
                {atsLoading && (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-purple-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-gray-700">Analyzing...</span>
                  </div>
                )}

                {!atsLoading && atsResult && (
                  <>
                    <div className={`p-3 rounded-xl border-l-4 ${getScoreColor(atsResult.matchScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {atsResult.matchScore >= 70 ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-700" />
                          ) : (
                            <TrendingUpIcon className="h-5 w-5 text-yellow-700" />
                          )}
                          <h4 className="text-lg md:text-xl font-semibold">Match Score: <span className="font-bold">{atsResult.matchScore}%</span></h4>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(atsResult.matchScore).replace('-100', '-50').replace('border-', 'bg-').replace('text-', 'text-')}`}>
                          {getScoreStatus(atsResult.matchScore)}
                        </div>
                      </div>
                      <p className="text-sm italic mt-2">{atsResult.summary}</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <h5 className="text-base font-medium text-green-700 mb-3 flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" /> Key Strengths</h5>
                      {atsResult.strengths.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-4">
                          {atsResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No specific strengths identified based on the provided job description.</p>
                      )}

                      <h5 className="text-sm font-medium mt-4">Matched Skills:</h5>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {atsResult.matchedSkills.slice(0, 10).map((skill, i) => (
                          <span key={i} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">{skill}</span>
                        ))}
                        {atsResult.matchedSkills.length > 10 && <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">+{atsResult.matchedSkills.length - 10} more</span>}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <h5 className="text-base font-medium text-red-600 mb-3 flex items-center"><XCircleIcon className="h-4 w-4 mr-2" /> Improvement Recommendations</h5>
                      {atsResult.recommendations.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-4">
                          {atsResult.recommendations.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">The CV is highly optimized. No immediate recommendations.</p>
                      )}

                      <h5 className="text-sm font-medium mt-4">Missing Key Skills:</h5>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {atsResult.missingSkills.slice(0, 10).map((skill, i) => (
                          <span key={i} className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">{skill}</span>
                        ))}
                        {atsResult.missingSkills.length > 10 && <span className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full">+{atsResult.missingSkills.length - 10} more</span>}
                        {!atsResult.missingSkills.length && <span className="text-sm text-gray-500 italic">None found.</span>}
                      </div>
                    </div>
                  </>
                )}

                {!atsLoading && !atsResult && (
                  <div className="text-sm text-gray-500 p-3 border border-gray-300 rounded-xl text-center">No ATS data available. Go back to Step 2 and click &quot;Run ATS Check&quot; to see results.</div>
                )}
              </div>

              {atsError && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-sm">{atsError}</div>}
            </div>
          )}

          {/* STEP 4 - REVIEW & SEND */}
          {currentStep === 4 && generatedEmail && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <h3 className="text-lg md:text-xl font-light text-gray-900 mb-2">Your personalized application email</h3>
                <p className="text-gray-500 text-sm md:text-sm font-light">Review and edit your AI-generated email before sending.</p>
              </div>

              {savingSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-green-700 text-sm mb-4 flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Application saved to your dashboard!
                </div>
              )}

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <SparklesIcon className="h-4 w-4 mr-2 text-purple-600 animate-pulse" />
                    AI Generated Application Email
                  </span>
                  <button onClick={handleCopyEmail} className="text-purple-600 hover:text-purple-700 text-sm flex items-center font-medium transition-colors px-3 py-2 rounded-full hover:bg-purple-100">
                    <CopyIcon className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>

                <textarea
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  rows={10}
                  className="w-full border border-gray-300 rounded-2xl p-3 md:p-5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-mono transition-all resize-none"
                />

                <p className="text-xs text-gray-500 mt-4 bg-white rounded-xl px-3 py-2 border border-gray-200 font-light">Feel free to edit the email to add your personal touch before sending</p>
              </div>

              {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-sm">{error}</div>}
              {saveError && <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-red-700 text-sm">{saveError}</div>}
            </div>
          )}
        </div>

        {/* FIXED FOOTER - Always Visible */}
        <div className="bg-white border-t border-gray-200 px-3 py-3 md:px-6 md:py-4 flex-shrink-0 shadow-lg">
          {/* STEP 1 BUTTONS */}
          {currentStep === 1 && (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!canProceedToStep2}
                className="px-6 py-2 md:py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 BUTTONS */}
          {currentStep === 2 && (
            <div className="flex flex-col-reverse md:flex-row justify-between gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={handleRunAtsCheck}
                  disabled={!canProceedToStep3 || atsLoading}
                  className="px-6 py-2 md:py-3 bg-white border border-purple-600 text-purple-600 rounded-full font-medium hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {atsLoading ? 'Running...' : 'ATS Check'}
                </button>
                <button
                  onClick={handleGenerateEmail}
                  disabled={!canProceedToStep3 || loading}
                  className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                      Generate Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 BUTTONS */}
          {currentStep === 3 && (
            <div className="flex flex-col-reverse md:flex-row justify-between gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>

              <button
                onClick={handleGenerateEmail}
                disabled={loading}
                className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </div>
          )}

          {/* STEP 4 BUTTONS */}
          {currentStep === 4 && (
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>

              <div className="flex-1 flex flex-col md:flex-row gap-3">
                {contactEmail ? (
                  <button
                    onClick={handleSendEmail}
                    disabled={saving}
                    className="flex-1 px-6 py-2 md:py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all"
                  >
                    {saving ? 'Saving...' : 'Send Email & Save'}
                  </button>
                ) : (
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    Copy Email
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 md:py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}