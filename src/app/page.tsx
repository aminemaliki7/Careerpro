// src/app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Target, TrendingUp, Globe, Users, Zap, CheckCircle, ArrowRight, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Tech Jobs Made Simple',
  description: 'Find opportunities. Learn strategies. Land your dream tech role.',
  keywords: 'tech jobs, career platform, job search, tech careers',
  openGraph: {
    title: 'About | Tech Jobs Made Simple',
    description: 'Find opportunities. Learn strategies. Land your dream tech role.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
            Tech jobs,
            <br />
            <span className="font-medium text-blue-700">made simple</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Find opportunities. Learn strategies. Land your dream role.
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute left-1/2 transform -translate-x-1/2 animate-bounce bottom-16 sm:bottom-8">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-16 pb-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-sm text-gray-500 font-light">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-500 font-light">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-sm text-gray-500 font-light">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-500 font-light">Updated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pt-16 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
              What we offer
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Curated Jobs</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Verified opportunities from startups to Fortune 500. Direct connections to hiring managers.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Expert Guides</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Battle-tested strategies for resumes, interviews, and salary negotiation.
              </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Career Paths</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clear roadmaps for every tech role. From junior dev to tech lead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why it works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Data-Driven</h3>
              <p className="text-sm text-gray-600">
                Real hiring data, not outdated advice
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Global</h3>
              <p className="text-sm text-gray-600">
                Works across markets and cultures
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Updated</h3>
              <p className="text-sm text-gray-600">
                Fresh content and opportunities daily
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Proven</h3>
              <p className="text-sm text-gray-600">
                85% interview success rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to level up?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of tech professionals finding their dream roles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/roadmaps"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Explore Roadmaps
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}