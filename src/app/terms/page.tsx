export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-400 mt-2">Last Updated: March 2026</p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By creating an account or accessing Hirely, you agree to comply with these Terms of Service. Hirely provides an AI-powered applicant tracking and job matching platform connecting candidates and recruiters.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. User Accounts & Roles</h2>
              <p>
                When creating an account, you select a role (Candidate or Recruiter). You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your profile.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Candidate CV Analysis & AI Matching</h2>
              <p>
                Candidates consent to the processing of submitted CVs and profiles by our automated matching algorithms. Match scores and skill breakdowns are informational metrics designed to evaluate compatibility and do not guarantee employment or hiring outcomes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Recruiter Responsibilities</h2>
              <p>
                Recruiters must post genuine open positions and ensure job descriptions accurately represent the role. Recruiters agree to use candidate data exclusively for legitimate hiring purposes and in compliance with applicable employment laws.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Acceptable Use</h2>
              <p>
                You agree not to submit fraudulent profile information, scrape platform data, or bypass platform security measures. We reserve the right to suspend accounts violating these conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">6. Limitation of Liability</h2>
              <p>
                Hirely provides automated matching analysis `&quot;as is.`&quot; We are not liable for hiring decisions made by employers or application choices made by candidates.
              </p>
            </section>
          </div>
          

        </div>
      </div>
    </div>
  );
}