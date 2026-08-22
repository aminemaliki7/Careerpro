'use client';

import { useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { StartupSubmission, IndustryType, CompanySize, FundingStage } from '@/types/startup';
import { Loader2, CheckCircle, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

const industries: IndustryType[] = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
  'SaaS', 'Cybersecurity', 'DevTools', 'CleanTech', 'Blockchain', 'Other'
];

const companySizes: CompanySize[] = ['1-10', '11-50', '51-200', '201-500', '500+'];

const fundingStages: FundingStage[] = [
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Acquired', 'Public'
];

export default function StartupSubmissionForm() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<StartupSubmission>({
    name: '',
    description: '',
    fullDescription: '',
    industry: 'AI/ML',
    size: '1-10',
    fundingStage: 'Seed',
    foundedDate: '',
    location: '',
    websiteUrl: '',
    logoUrl: '',
    contactEmail: '',
    contactName: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError(null);
    setLogoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleLogoUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Explicit Professional Email Validation
    if (!validateEmail(formData.contactEmail)) {
      setError('Please provide a valid business email address (e.g., name@company.com).');
      setLoading(false);
      return;
    }

    if (!logoFile) {
      setError('Please attach a company logo before submitting.');
      setLoading(false);
      return;
    }

    try {
      let logoUrl = formData.logoUrl;
      const formDataUpload = new FormData();
      formDataUpload.append('logo', logoFile);

      const uploadResponse = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formDataUpload
      });

      if (!uploadResponse.ok) {
        throw new Error('Logo upload failed. Please verify the file and try again.');
      }

      const uploadData = await uploadResponse.json();
      logoUrl = uploadData.url;

      const response = await fetch('/api/startups/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          contactEmail: formData.contactEmail.trim(),
          logoUrl,
          ownerId: user?.id // Add owner_id from Clerk user
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to complete submission. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setLogoFile(null);
    setLogoPreview(null);
    setError(null);
    setFormData({
      name: '', description: '', fullDescription: '',
      industry: 'AI/ML', size: '1-10', fundingStage: 'Seed',
      foundedDate: '', location: '', websiteUrl: '', logoUrl: '',
      contactEmail: '', contactName: ''
    });
  };

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto text-center py-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="animate-pulse text-slate-600 font-medium text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto text-center py-6">
        <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/80 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">
            Authentication Required
          </h3>
          <p className="text-xs text-slate-600 mb-6 max-w-xs mx-auto leading-relaxed">
            You need to sign in with your account to submit your startup profile.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs rounded-lg font-semibold transition-all duration-200 shadow-md shadow-indigo-600/20"
            >
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-6">
        <div className="bg-gradient-to-br from-indigo-50/50 to-emerald-50/30 border border-emerald-200/80 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">
            Submission Received
          </h3>
          <p className="text-xs text-slate-600 mb-6 max-w-xs mx-auto leading-relaxed">
            Thank you for submitting your startup. Our team will review your details and contact you via <span className="font-semibold text-slate-800">{formData.contactEmail}</span> within 2–3 business days.
          </p>
          <button
            onClick={resetForm}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs rounded-lg font-semibold transition-all duration-200 shadow-md shadow-indigo-600/20"
          >
            Submit Another Startup
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto text-xs">
      {error && (
        <div className="bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs font-medium flex-1 leading-snug">{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Company Information */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <div className="w-6 h-6 bg-indigo-50 rounded-md flex items-center justify-center border border-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Company Information</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Acme Technologies"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-slate-900"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Company Logo <span className="text-red-500">*</span>
            </label>

            {logoPreview ? (
              <div className="relative bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-md border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate text-xs">{logoFile?.name}</p>
                  <p className="text-[10px] text-slate-500">{logoFile && (logoFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                  title="Remove logo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border border-dashed rounded-lg p-3.5 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-600 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none flex items-center justify-center gap-2">
                  {isDragging ? (
                    <Upload className="w-4 h-4 text-indigo-600 animate-bounce" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                  )}
                  <span className="text-slate-700 font-medium">
                    {isDragging ? 'Drop logo image here' : 'Click or drop logo'}
                  </span>
                  <span className="text-[10px] text-slate-400">(PNG, JPG, SVG max 5MB)</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Short Pitch / Tagline <span className="text-red-500">*</span>
              <span className="text-slate-400 font-normal ml-1 text-[10px]">(max 150 chars)</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={150}
              required
              placeholder="A brief one-sentence summary of what your company does"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-slate-900"
            />
            <p className="text-[10px] text-slate-400 mt-0.5 text-right">{formData.description.length}/150</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Overview <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Detail your product offering, key achievements, or mission..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none resize-none bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900 cursor-pointer"
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Team Size <span className="text-red-500">*</span>
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900 cursor-pointer"
              >
                {companySizes.map(s => <option key={s} value={s}>{s} employees</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Funding Stage <span className="text-red-500">*</span>
              </label>
              <select
                name="fundingStage"
                value={formData.fundingStage}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900 cursor-pointer"
              >
                {fundingStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Founded Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="foundedDate"
                value={formData.foundedDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Headquarters Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Primary Point of Contact Section */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <div className="w-6 h-6 bg-indigo-50 rounded-md flex items-center justify-center border border-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="e.g., Sarah Jenkins"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="sarah@yourcompany.com"
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Please enter a valid email address (e.g., name@domain.com)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-xs transition-all duration-200 shadow-md shadow-indigo-600/20 disabled:shadow-none flex items-center justify-center gap-2 group mt-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Startup Profile...
          </>
        ) : (
          <>
            <span>Submit Startup</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}