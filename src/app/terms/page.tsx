// src/app/terms/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, FileText, Users, Lock, AlertCircle, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using our platform',
  openGraph: {
    title: 'Terms of Service',
    description: 'Terms and conditions for using our platform',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-none">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            <a href="#acceptance" className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-6 transition-all duration-300 hover:shadow-lg">
              <Shield className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Acceptance</h3>
              <p className="text-sm text-gray-600">Terms acceptance</p>
            </a>
            <a href="#services" className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-6 transition-all duration-300 hover:shadow-lg">
              <Users className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Services</h3>
              <p className="text-sm text-gray-600">What we provide</p>
            </a>
            <a href="#rights" className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-6 transition-all duration-300 hover:shadow-lg">
              <Scale className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Rights</h3>
              <p className="text-sm text-gray-600">User obligations</p>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-16">
              <div className="bg-blue-50 rounded-2xl p-8 mb-12">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Important Notice</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Please read these Terms of Service carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Acceptance of Terms */}
            <div id="acceptance" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new terms.
              </p>
            </div>

            {/* 2. Description of Services */}
            <div id="services" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Services</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our platform provides the following services:
              </p>
              <div className="space-y-4 ml-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">Job Listings:</strong> Access to curated tech job opportunities from various companies and locations.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">Career Resources:</strong> Educational content, guides, and articles related to career development.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">Roadmaps:</strong> Structured learning paths and career progression guides.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">Newsletter:</strong> Regular updates and insights delivered via email.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. User Accounts */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Some features of our service may require you to create an account. You agree to:
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <p className="text-gray-600 leading-relaxed">• Provide accurate and complete information</p>
                <p className="text-gray-600 leading-relaxed">• Maintain the security of your account credentials</p>
                <p className="text-gray-600 leading-relaxed">• Accept responsibility for all activities under your account</p>
                <p className="text-gray-600 leading-relaxed">• Notify us immediately of any unauthorized access</p>
              </div>
            </div>

            {/* 4. User Rights and Responsibilities */}
            <div id="rights" className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. User Rights and Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                As a user of our platform, you agree not to:
              </p>
              <div className="space-y-4 ml-6">
                <p className="text-gray-600 leading-relaxed">• Use the service for any illegal or unauthorized purpose</p>
                <p className="text-gray-600 leading-relaxed">• Violate any laws in your jurisdiction</p>
                <p className="text-gray-600 leading-relaxed">• Transmit any viruses, malware, or other malicious code</p>
                <p className="text-gray-600 leading-relaxed">• Attempt to gain unauthorized access to our systems</p>
                <p className="text-gray-600 leading-relaxed">• Scrape or harvest data from the platform without permission</p>
                <p className="text-gray-600 leading-relaxed">• Impersonate any person or entity</p>
              </div>
            </div>

            {/* 5. Intellectual Property */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                All content on this platform, including text, graphics, logos, images, and software, is the property of our company or our content suppliers and is protected by intellectual property laws.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
              </p>
            </div>

            {/* 6. Third-Party Links */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Third-Party Links and Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our platform may contain links to third-party websites or services, including job application sites and company career pages. We are not responsible for:
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <p className="text-gray-600 leading-relaxed">• The content of external sites</p>
                <p className="text-gray-600 leading-relaxed">• The privacy practices of third parties</p>
                <p className="text-gray-600 leading-relaxed">• Any damages or losses from third-party interactions</p>
              </div>
            </div>

            {/* 7. Disclaimers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Disclaimers</h2>
              <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-gray-900">Our services are provided "as is" without warranties of any kind.</strong> We do not guarantee:
                </p>
                <div className="space-y-2 ml-4">
                  <p className="text-gray-700 leading-relaxed">• The accuracy or completeness of job listings</p>
                  <p className="text-gray-700 leading-relaxed">• That you will secure employment through our platform</p>
                  <p className="text-gray-700 leading-relaxed">• Uninterrupted or error-free service</p>
                  <p className="text-gray-700 leading-relaxed">• The quality or legitimacy of listed opportunities</p>
                </div>
              </div>
            </div>

            {/* 8. Limitation of Liability */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
              </p>
              <div className="space-y-3 ml-6">
                <p className="text-gray-600 leading-relaxed">• Your use or inability to use the service</p>
                <p className="text-gray-600 leading-relaxed">• Any unauthorized access to your data</p>
                <p className="text-gray-600 leading-relaxed">• Any interruption or cessation of transmission</p>
                <p className="text-gray-600 leading-relaxed">• Any bugs, viruses, or similar issues</p>
              </div>
            </div>

            {/* 9. Privacy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Privacy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your personal information.
              </p>
            </div>

            {/* 10. Termination */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to terminate or suspend your access to our services at any time, without notice, for conduct that we believe:
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <p className="text-gray-600 leading-relaxed">• Violates these Terms of Service</p>
                <p className="text-gray-600 leading-relaxed">• Is harmful to other users or our business</p>
                <p className="text-gray-600 leading-relaxed">• Exposes us to legal liability</p>
              </div>
            </div>

            {/* 11. Governing Law */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
              </p>
            </div>

            {/* 12. Changes to Terms */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Your continued use of the platform after any changes constitutes acceptance of the new Terms.
              </p>
            </div>

            {/* Contact Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">13. Contact Us</h2>
              <div className="bg-blue-50 rounded-2xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Email:</strong> legal@yourcompany.com
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Address:</strong> [Your Company Address]
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your trust matters to us
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We're committed to transparency and protecting your rights while using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/privacy"
              className="border border-gray-300 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}