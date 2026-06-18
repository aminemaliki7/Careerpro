'use client';

import { useState } from 'react';
import { StartupSubmission, IndustryType, CompanySize, FundingStage } from '@/types/startup';
import { Loader2, CheckCircle, Upload, X, Image as ImageIcon } from 'lucide-react';

const industries: IndustryType[] = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
  'SaaS', 'Cybersecurity', 'DevTools', 'CleanTech', 'Blockchain', 'Other'
];

const companySizes: CompanySize[] = ['1-10', '11-50', '51-200', '201-500', '500+'];

const fundingStages: FundingStage[] = [
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+', 'Acquired', 'Public'
];

export default function StartupSubmissionForm() {
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

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, SVG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
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

    // Logo is required
    if (!logoFile) {
      setError('Please upload a company logo');
      setLoading(false);
      return;
    }

    try {
      // Upload logo
      let logoUrl = formData.logoUrl;
      const formDataUpload = new FormData();
      formDataUpload.append('logo', logoFile);

      const uploadResponse = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formDataUpload
      });

      if (!uploadResponse.ok) {
        throw new Error('Logo upload failed. Please try again.');
      }

      const uploadData = await uploadResponse.json();
      logoUrl = uploadData.url;

      // Submit startup data
      const response = await fetch('/api/startups/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, logoUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit startup');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({
      name: '', description: '', fullDescription: '',
      industry: 'AI/ML', size: '1-10', fundingStage: 'Seed',
      foundedDate: '', location: '', websiteUrl: '', logoUrl: '',
      contactEmail: '', contactName: ''
    });
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-12">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 sm:p-10 shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2 sm:mb-3">
            Submission Successful!
          </h3>
          <p className="text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
            Thank you for submitting your startup. We&lsquo;ll review it and get back to you within 2-3 business days.
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-3 sm:px-8 sm:py-3.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30 hover:scale-[1.02]"
          >
            Submit Another Startup
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-red-600 text-sm font-medium flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Company Information */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b-2 border-gray-200">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">Company Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your company name"
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
            />
          </div>

          {/* Logo Upload — NOW REQUIRED */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Company Logo <span className="text-red-500">*</span>
            </label>

            {logoPreview ? (
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{logoFile?.name}</p>
                  <p className="text-xs text-gray-500">{logoFile && (logoFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-300"
                  title="Remove logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-[#0A66C2] bg-[#0A66C2]/5 scale-[1.02]'
                    : 'border-gray-300 hover:border-[#0A66C2] hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    {isDragging ? (
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A66C2] animate-bounce" />
                    ) : (
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#0A66C2]" />
                    )}
                  </div>
                  <p className="text-gray-700 font-medium mb-1 text-sm">
                    {isDragging ? 'Drop your logo here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Short Description <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1 text-xs sm:text-sm">(max 150 characters)</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={150}
              required
              placeholder="Brief tagline about your company"
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{formData.description.length}/150</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Full Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us more about your company, mission, and what makes you unique..."
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none appearance-none bg-white cursor-pointer"
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Company Size <span className="text-red-500">*</span>
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none appearance-none bg-white cursor-pointer"
              >
                {companySizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Funding Stage <span className="text-red-500">*</span>
              </label>
              <select
                name="fundingStage"
                value={formData.fundingStage}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none appearance-none bg-white cursor-pointer"
              >
                {fundingStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Founded Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="foundedDate"
                value={formData.foundedDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                required
                className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
              required
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-5 pt-1">
        <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b-2 border-gray-200">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] transition-all duration-300 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 sm:py-4 bg-[#0A66C2] hover:bg-[#004182] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#0A66C2]/30 disabled:shadow-none flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
            Submitting Your Startup...
          </>
        ) : (
          <>
            <span>Submit Startup</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}