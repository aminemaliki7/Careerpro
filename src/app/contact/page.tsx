// src/app/contact/page.tsx
import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Clock, MapPin, Mail, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Hirely',
  description: 'Reach out to Hirely for inquiries about our AI-powered ATS platform, candidate match scoring, or recruitment partnerships.',
  keywords: 'contact, recruitment ATS, AI job matching, hiring solutions, candidate ranking',
  openGraph: {
    title: 'Contact Us | Hirely',
    description: 'Get in touch to learn how Hirely connects candidates and recruiters with AI precision.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-slate-100/50"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles className="w-7 h-7 text-indigo-600" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Get in touch with us
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about our AI matching system or need assistance with your hiring workflow? We&apos;re here to help candidates and recruiters succeed.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-8 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Send us a message
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 mb-8">
                  Whether you are a candidate evaluating match scores or a recruiter setting up an ATS pipeline, we reply within 24 hours.
                </p>
                
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Side Cards */}
            <div className="space-y-4">
              {/* Response Time */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Fast Support
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Our team reviews all inquiries promptly and responds within 24 hours.
                </p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Headquarters
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Based in Morocco 🇲🇦<br />
                  Serving global remote teams & tech talent 🌍
                </p>
              </div>

              {/* Email */}
            
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}