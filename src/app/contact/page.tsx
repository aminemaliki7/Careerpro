// src/app/contact/page.tsx
import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { Clock, MapPin, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Hirely with questions about startup profiles, opportunities, partnerships, or using the platform.',
  keywords: 'contact Hirely, startup platform, founder support, startup opportunities',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Hirely',
    description: 'Get in touch with Hirely about startup discovery, founder profiles, and opportunities.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="flex items-center justify-center border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#4F46E5]">
            <MessageCircle className="h-6 w-6" />
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Get in touch with us
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600">
            Have a question about discovering startups, showcasing what you are building, or exploring opportunities? Send us a message.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pt-8 pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Send us a message
                </h2>

                <p className="mb-8 text-sm text-slate-500">
                  Share a little context so we can direct your message to the right place.
                </p>
                
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Side Cards */}
            <div className="space-y-4">
              {/* Response Time */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                  <Clock className="h-5 w-5 text-[#4F46E5]" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Fast Support
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  We review messages and follow up when we can.
                </p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                  <MapPin className="h-5 w-5 text-[#4F46E5]" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Headquarters
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Starting in Morocco, with an international outlook.
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