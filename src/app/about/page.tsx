// src/app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Target, TrendingUp, Shield, Globe, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Your Complete Career Advancement Solution',
  description: 'Discover how our comprehensive platform helps tech professionals land dream jobs through proven strategies, expert guidance, and cutting-edge tools.',
  keywords: 'career advancement platform, job search solution, tech career development, professional growth',
  openGraph: {
    title: 'About | Your Complete Career Advancement Solution',
    description: 'Transform your tech career with our proven job search strategies, expert resources, and comprehensive guidance.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Career Success,
              <span className="text-blue-600"> Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
  We&apos;ve built the most comprehensive platform for tech career advancement, 
  combining proven strategies, expert insights, and cutting-edge tools to 
  accelerate your professional growth.
</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Explore Opportunities
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/blog"
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Read Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge Every Tech Professional Faces</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Despite having exceptional skills, talented developers, engineers, and tech professionals 
              struggle to navigate the complex job market effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Overwhelming Competition</h3>
              <p className="text-gray-600">
                Thousands of applications for every position, making it nearly impossible to stand out 
                without the right strategy.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS Systems & Filters</h3>
              <p className="text-gray-600">
                90% of applications never reach human eyes, filtered out by automated systems 
                that most candidates don&apos;t understand.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Salary Negotiation Gaps</h3>
              <p className="text-gray-600">
                Average of $50K+ left on the table due to poor negotiation strategies and 
                lack of market insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Comprehensive Solution</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We&apos;ve reverse-engineered the hiring process and built a complete ecosystem 
              to give you unfair advantages in your job search.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Curated Job Opportunities</h3>
              <p className="text-gray-600 mb-6">
                Access thousands of verified tech positions from startups to Fortune 500 companies. 
                Our intelligent matching system connects you with roles that align with your skills, 
                experience, and career goals.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Direct connections to hiring managers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Salary ranges and company insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Global opportunities across all tech hubs</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                  <div className="text-sm text-gray-600">Active Job Listings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Partner Companies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                  <div className="text-sm text-gray-600">Countries Covered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">New Opportunities</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Expert Knowledge Base</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">CV Optimization Guides</span>
                    <span className="text-green-600 font-semibold">50+ Articles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Interview Preparation</span>
                    <span className="text-green-600 font-semibold">100+ Questions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Salary Negotiation Scripts</span>
                    <span className="text-green-600 font-semibold">25+ Templates</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Company Research Tools</span>
                    <span className="text-green-600 font-semibold">1000+ Profiles</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Knowledge & Strategies</h3>
              <p className="text-gray-600 mb-6">
                Learn from industry insiders with our comprehensive library of proven strategies, 
                templates, and insider knowledge. Every piece of content is battle-tested and 
                updated regularly to reflect current market conditions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">ATS-optimized CV templates and guides</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Company-specific interview preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Salary negotiation frameworks that work</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Career Development Roadmaps</h3>
              <p className="text-gray-600 mb-6">
                Clear, actionable roadmaps for every tech career path. From junior developer to 
                tech lead, from product manager to entrepreneur - we provide step-by-step guidance 
                for your specific career trajectory.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Skill development priorities by role</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Industry-specific career progression maps</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Personalized learning recommendations</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Popular Career Paths</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Frontend Developer</span>
                  <span className="text-purple-600 text-sm">25 steps</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Backend Engineer</span>
                  <span className="text-purple-600 text-sm">30 steps</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">DevOps Engineer</span>
                  <span className="text-purple-600 text-sm">35 steps</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-700">Product Manager</span>
                  <span className="text-purple-600 text-sm">28 steps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Our Approach Works</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our methodology is based on real data from thousands of successful placements 
              and insider knowledge from both sides of the hiring process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data-Driven</h3>
              <p className="text-gray-600 text-sm">
                Every strategy is backed by real hiring data and success metrics, 
                not outdated conventional wisdom.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Opportunities and strategies that work across different markets, 
                cultures, and tech ecosystems worldwide.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Always Updated</h3>
              <p className="text-gray-600 text-sm">
                Our content and job listings are continuously updated to reflect 
                the latest market trends and hiring practices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600 text-sm">
                85% interview success rate and average salary increases of $50K+ 
                for professionals who follow our guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Proven Impact</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our platform has helped thousands of tech professionals accelerate their careers 
              and land their dream roles.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Successful Placements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Interview Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$75K</div>
              <div className="text-blue-100">Average Salary Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3 weeks</div>
              <div className="text-blue-100">Average Job Search Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8">
            To democratize career success by providing every tech professional with the tools, 
            knowledge, and opportunities they need to build exceptional careers - regardless of 
            their background, connections, or starting point.
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Transform Your Career?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who have already accelerated their careers with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Start Your Search
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/roadmaps"
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore Career Paths
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}