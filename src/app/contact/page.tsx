// src/app/contact/page.tsx
import { Metadata } from 'next'
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | Tech Job Career Advice',
  description: 'Get in touch for career advice, collaboration opportunities, or feedback. I respond to every email personally within 24 hours.',
  keywords: 'contact, career advice, tech jobs, collaboration',
  openGraph: {
    title: 'Contact Us | Tech Job Career Advice',
    description: 'Get in touch for career advice, collaboration opportunities, or feedback.',
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
            Have a question about your career? Want to collaborate? Or just want to say hi? 
            I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
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
                  <option value="cv-review">CV Review Request</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="guest-post">Guest Post Proposal</option>
                  <option value="feedback">Website Feedback</option>
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
                  placeholder="Tell me about your situation, question, or proposal..."
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

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Response Time */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Response
                </h3>
              </div>
              <p className="text-gray-700">
                I personally read and respond to every email within 24 hours 
                (usually much faster!). Your message won't get lost in a corporate inbox.
              </p>
            </div>

            {/* Email Direct */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Directly
                </h3>
              </div>
              <p className="text-gray-700 mb-3">
                Prefer to email directly? No problem.
              </p>
              <a 
                href="mailto:hello@yourdomain.com"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                hello@yourdomain.com
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect on Social
                </h3>
              </div>
              <div className="space-y-3">
                <a 
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  LinkedIn - Best for professional questions
                </a>
                <a 
                  href="https://twitter.com/yourhandle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Twitter - Quick questions and updates
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Location
                </h3>
              </div>
              <p className="text-gray-700">
                Based in San Francisco, CA<br />
                Available for remote consultations worldwide
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer 1-on-1 career coaching?
              </h3>
              <p className="text-gray-700 mb-4">
                Currently, I provide career advice through email and blog content. 
                For urgent CV reviews or specific guidance, please use the contact form above.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can you review my CV?
              </h3>
              <p className="text-gray-700">
                I offer brief CV feedback via email. Please include your CV, 
                target role, and specific questions when contacting me.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Are you available for speaking/podcasts?
              </h3>
              <p className="text-gray-700 mb-4">
                Yes! I love discussing career topics, job market trends, and tech hiring. 
                Please include event details and audience information.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you accept guest posts?
              </h3>
              <p className="text-gray-700">
                I consider high-quality guest posts that add value to my readers. 
                Please include your topic idea, outline, and writing samples.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}