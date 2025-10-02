// src/components/jobs/EasyApplyModal.tsx
'use client';

import { useState } from 'react';

interface EasyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  requirements?: string[];
  description?: string;
  contactEmail?: string;
  skills?: string[];
}

const CloseIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SparklesIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const DocumentIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CopyIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function EasyApplyModal({
  isOpen,
  onClose,
  jobTitle,
  company,
  requirements,
  description,
  contactEmail,
  skills
}: EasyApplyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsing, setParsing] = useState(false);

  if (!isOpen) return null;

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // Only allow DOCX and TXT
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else if (fileName.endsWith('.docx')) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to parse DOCX file');
        }

        return data.text;
      } catch (err) {
        console.error('File parsing error:', err);
        throw err;
      }
    } else {
      throw new Error('Unsupported file type. Only DOCX or TXT files are allowed.');
    }
  };

 const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);
    setError('');
    setParseError('');
    setParsing(true);

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
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(data.error || 'Failed to generate email');
      }

      setGeneratedEmail(data.emailContent);
      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
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
    
    // Show reminder about attaching resume
    const confirmSend = window.confirm(
      `Quick reminder: Don't forget to attach your resume/CV to the email before sending!\n\nClick OK to open your email client.`
    );
    
    if (!confirmSend) {
      return;
    }
    
    const subject = `Application for ${jobTitle} Position`;
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generatedEmail)}`;
    window.location.href = mailtoLink;
  };

  const canProceedToStep2 = userName.trim().length >= 2;
  const canProceedToStep3 = cvText.trim().length >= 50;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-2xl font-light flex items-center">
              <SparklesIcon className="h-6 w-6 mr-3 animate-pulse" />
              Easy Apply with AI
            </h2>
            <p className="text-purple-100 text-sm mt-2 font-light">
              {jobTitle} at {company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Close modal"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Your Info' },
              { num: 2, label: 'Upload CV' },
              { num: 3, label: 'Review & Send' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                    currentStep > step.num
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : currentStep === step.num
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span className={`ml-3 text-sm font-medium ${
                    currentStep >= step.num ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">Let&apos;s start with your details</h3>
                <p className="text-gray-500 text-sm font-light">This information will be used to personalize your application email.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4 shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-2 font-light">
                    This will appear in the email signature
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                  className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  Continue to CV Upload
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload CV */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">Upload your CV/Resume</h3>
                <p className="text-gray-500 text-sm font-light">We&apos;ll analyze your experience to create a tailored application.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-sm">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                  <DocumentIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
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
                    className={`cursor-pointer text-purple-600 hover:text-purple-700 font-medium text-lg ${parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {parsing ? 'Processing...' : 'Click to upload file'}
                  </label>
                  <p className="text-gray-400 mt-2 font-light">or paste your CV text below</p>
                  <p className="text-xs text-gray-400 mt-4 font-light">
                    Supported formats: DOCX, TXT (max 10MB)
                  </p>
                  {cvFile && !parsing && (
                    <div className="mt-6 inline-flex items-center bg-green-50 text-green-700 px-5 py-3 rounded-full shadow-sm">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">{cvFile.name}</span>
                    </div>
                  )}
                  {parsing && (
                    <div className="mt-6 flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 text-purple-600 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-purple-600 font-medium">Extracting text...</span>
                    </div>
                  )}
                  {parseError && (
                    <div className="mt-6 bg-red-50 text-red-600 px-5 py-3 rounded-full text-sm inline-block">
                      {parseError}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400 font-light">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Paste your CV text here
                  </label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={10}
                    className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Paste your complete CV/Resume here including work experience, education, skills, and achievements..."
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-400 font-light">
                      {cvText.length} characters {cvText.length >= 50 ? '(Ready)' : '(minimum 50 required)'}
                    </p>
                    {cvText.length >= 50 && (
                      <span className="text-green-600 text-xs font-medium flex items-center bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Ready
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateEmail}
                  disabled={!canProceedToStep3 || loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2 animate-pulse" />
                      Generate Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {currentStep === 3 && generatedEmail && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">Your personalized application email</h3>
                <p className="text-gray-500 text-sm font-light">Review and edit your AI-generated email before sending.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-600 animate-pulse" />
                    AI Generated Application Email
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-purple-600 hover:text-purple-700 text-sm flex items-center font-medium transition-colors px-4 py-2 rounded-full hover:bg-purple-100"
                  >
                    <CopyIcon className="h-4 w-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
                <textarea
                  value={generatedEmail}
                  onChange={(e) => setGeneratedEmail(e.target.value)}
                  rows={16}
                  className="w-full border border-gray-300 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-mono transition-all"
                />
                <p className="text-xs text-gray-500 mt-4 bg-white rounded-xl px-4 py-3 border border-gray-200 font-light">
                  Feel free to edit the email to add your personal touch before sending
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <div className="flex-1 flex gap-3">
                  {contactEmail ? (
                    <button
                      onClick={handleSendEmail}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Send via Email Client
                    </button>
                  ) : (
                    <button
                      onClick={handleCopyEmail}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Copy Email
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}