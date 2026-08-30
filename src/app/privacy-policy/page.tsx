import Link from 'next/link';
export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: August 2026</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
              <p>We collect information necessary to provide ATS matching features:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
                <li><strong>Candidate Data:</strong> Name, contact details, resume files, skill sets, and work history.</li>
                <li><strong>Recruiter Data:</strong> Work email, company information, and posted job requirements.</li>
                <li><strong>Usage Data:</strong> Application history, interaction logs, and device metadata.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. How We Use Your Data</h2>
              <p>
                Your personal and professional data is processed to generate compatibility match scores, rank applications for recruiters, improve our matching model, and facilitate candidate-recruiter interactions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. AI Processing & Data Protection</h2>
              <p>
                Resumes uploaded to Hirely are parsed electronically to evaluate technical skills, experience alignment, and role context. We do not sell user data or CV contents to third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Sharing Your Information</h2>
              <p>
                Candidate data is shared with recruiters only when an application is initiated or permitted through platform settings. Authentication data is managed securely via Clerk.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Your Data Rights</h2>
              <p>
                You have the right to request access to your stored personal data, correct inaccuracies, or delete your account along with submitted resume files at any time through your account settings.
              </p>
            </section>

           <section className="space-y-2">
  <h2 className="text-base font-bold text-slate-900">6. Contact Us</h2>
  <p>
    If you have questions about this policy or your data privacy, please contact us at{' '}

    <Link href="/contact" className="text-indigo-600 font-medium hover:underline">
      Contact Page
    </Link>.
  </p>
</section>
          </div>

        </div>
      </div>
    </div>
  );
}