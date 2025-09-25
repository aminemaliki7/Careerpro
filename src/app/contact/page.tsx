import { Metadata } from 'next'
import { Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Hirely Morocco',
  description: 'Get in touch for career advice, collaborations, or feedback. We personally respond to every message within 24 hours.',
  keywords: 'contact, career advice, tech jobs, collaboration',
  openGraph: {
    title: 'Contact Us | Hirely Morocco',
    description: 'Get in touch for career advice, collaborations, or feedback.',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about your career or want to collaborate? 
            Send us a message via the form below. We personally respond to every message within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send a Message
            </h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  <option value="career-advice">Career Advice</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your situation, question, or proposal..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Location / Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Location
              </h3>
            </div>
            <p className="text-gray-700">
              Based in Morocco 🇲🇦<br />
              Available for remote consultations worldwide
            </p>

            <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <p className="text-gray-700">
                Quick Response: We personally respond to every message within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
