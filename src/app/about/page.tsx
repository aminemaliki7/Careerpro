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
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Tech jobs,
              <span className="text-blue-600"> made simple</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Find opportunities. Learn strategies. Land your dream role.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Updated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Jobs</h3>
              <p className="text-gray-600">
                Verified opportunities from startups to Fortune 500. Direct connections to hiring managers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl">
              <Shield className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guides</h3>
              <p className="text-gray-600">
                Battle-tested strategies for resumes, interviews, and salary negotiation.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Paths</h3>
              <p className="text-gray-600">
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