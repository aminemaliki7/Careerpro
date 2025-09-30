// src/app/contact/page.tsx
import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Clock, MapPin, Mail, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Hirely',
  description: 'Get in touch for career advice, collaborations, or feedback. We personally respond to every message within 24 hours.',
  keywords: 'contact, career advice, tech jobs, collaboration',
  openGraph: {
    title: 'Contact Us | Hirely',
    description: 'Get in touch for career advice, collaborations, or feedback.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
            Get in touch
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Have a question about your career or want to collaborate? We&aposre here to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-16 pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600 mb-8">
                  We personally respond to every message within 24 hours
                </p>
                
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Response Time */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 hover:border-gray-300 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Response
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We respond to every message within 24 hours
                </p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 hover:border-gray-300 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Location
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Based in Morocco 🇲🇦<br />
                  Remote consultations available 🌍
                </p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-3xl border border-gray-200 p-8 hover:border-gray-300 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email
                </h3>
                <a 
                  href="mailto:contact@hirely.com" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  contact@hirely.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}