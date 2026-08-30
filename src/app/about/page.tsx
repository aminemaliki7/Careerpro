import Link from 'next/link';
import { Target, Users, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Our Vision</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Fixing Recruitment Through <span className="text-indigo-600">Precision Matching</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Hirely bridges the gap between hiring teams and job seekers by providing transparent, real-time AI match scores before an application is ever submitted.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">For Candidates</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stop sending resumes into black holes. Hirely analyzes your CV against active job requirements to show your exact skill and context compatibility score before you hit apply.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">For Recruiters</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate manual resume screening. Our intelligent ATS ranks applicants by genuine compatibility, giving you immediate clarity on top-tier candidates instantly.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Why We Built Hirely</h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Transparency</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Candidates deserve to know how well they fit a position prior to spending time applying.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Efficiency</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Recruiters should spend time talking to qualified candidates, not parsing mismatched CVs.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Privacy First</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your data is parsed securely and used strictly for job matching purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Ready to transform your hiring workflow?</h3>
          <div className="flex justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}