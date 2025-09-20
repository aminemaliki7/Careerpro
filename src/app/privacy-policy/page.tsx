// src/app/privacy-policy/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tech Job Career Advice',
  description: 'Learn how we collect, use, and protect your personal information. Your privacy is our priority.',
  robots: 'index, follow',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            <strong>Last updated:</strong> January 15, 2025
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-blue-800">
              <strong>Quick Summary:</strong> We respect your privacy. We only collect essential information 
              to provide you with career advice and blog content. We never sell your data, and you can 
              request deletion at any time.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information You Provide Directly</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>Contact Forms:</strong> Name, email address, and message content when you contact us</li>
            <li><strong>Newsletter Subscription:</strong> Email address for our weekly job tips newsletter</li>
            <li><strong>Comments:</strong> Name, email (optional), and comment content on blog posts</li>
            <li><strong>CV Reviews:</strong> CV documents and related career information (when requested)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>Analytics Data:</strong> Page views, time on site, referral sources (via Google Analytics)</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system</li>
            <li><strong>Cookies:</strong> Small files to improve website functionality and user experience</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Respond to Inquiries:</strong> Answer your questions and provide career advice</li>
            <li><strong>Newsletter Delivery:</strong> Send weekly job search tips and career updates</li>
            <li><strong>Website Improvement:</strong> Analyze usage patterns to create better content</li>
            <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights</li>
            <li><strong>Security:</strong> Prevent spam, abuse, and fraudulent activity</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
            <p className="text-green-800">
              <strong>We Never:</strong> Sell your personal information, share your data with third-party marketers, 
              or use your information for purposes beyond what&apos;s stated in this policy.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
          
          <p className="text-gray-700 mb-4">We only share your information in these limited circumstances:</p>
          
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Service Providers:</strong> Third-party services that help us operate our website (email delivery, analytics, hosting)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
            <li><strong>Business Protection:</strong> To protect our rights, property, or safety, and that of our users</li>
            <li><strong>With Your Consent:</strong> Any other sharing only with your explicit permission</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-Party Services We Use</h3>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Google Analytics:</strong> Website traffic analysis - <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Mailchimp/ConvertKit:</strong> Email newsletter delivery - <a href="https://mailchimp.com/legal/privacy/" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Vercel/Netlify:</strong> Website hosting - <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Google AdSense:</strong> Advertising (once approved) - <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
          
          <p className="text-gray-700 mb-4">We implement appropriate security measures to protect your information:</p>
          
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>SSL encryption for all data transmission</li>
            <li>Secure hosting with reputable providers</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal information</li>
            <li>Data backup and recovery procedures</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
            <p className="text-yellow-800">
              <strong>Important:</strong> No internet transmission is 100% secure. While we strive to protect 
              your information, we cannot guarantee absolute security.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Privacy Rights</h2>
          
          <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
          
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Ask us to correct any inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Receive your information in a portable format</li>
            <li><strong>Objection:</strong> Object to certain uses of your information</li>
            <li><strong>Unsubscribe:</strong> Opt out of newsletters and marketing communications</li>
          </ul>

          <p className="text-gray-700 mb-6">
            To exercise any of these rights, contact us at <a href="mailto:privacy@yourdomain.com" className="text-blue-600 hover:underline">privacy@yourdomain.com</a>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Cookies and Tracking</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of Cookies We Use</h3>
          
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Essential</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Website functionality, security</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Analytics</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Traffic analysis, performance monitoring</td>
                  <td className="px-6 py-4 text-sm text-gray-700">2 years</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Advertising</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Ad personalization (AdSense)</td>
                  <td className="px-6 py-4 text-sm text-gray-700">2 years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mb-6">
            You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. International Users</h2>
          
          <p className="text-gray-700 mb-6">
            Our website is hosted in the United States. If you&apos;re visiting from another country, 
            your information may be transferred to, stored, and processed in the US. By using our 
            website, you consent to this transfer.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
          
          <p className="text-gray-700 mb-6">
            Our website is not intended for children under 13. We do not knowingly collect 
            personal information from children under 13. If we discover we have collected 
            such information, we will delete it immediately.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Policy Updates</h2>
          
          <p className="text-gray-700 mb-6">
            We may update this privacy policy periodically. We&apos;ll notify you of significant 
            changes by posting the updated policy on this page and updating the &apos;Last updated&apos; 
            date. For major changes, we may also send email notifications.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Information</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700 mb-4">
              If you have questions about this privacy policy or our privacy practices, contact us:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:privacy@yourdomain.com" className="text-blue-600 hover:underline">privacy@yourdomain.com</a></li>
              <li><strong>Contact Form:</strong> <a href="/contact" className="text-blue-600 hover:underline">Visit our contact page</a></li>
              <li><strong>Mail:</strong> [Your Business Address]</li>
            </ul>
          </div>

          <div className="border-t pt-8">
            <p className="text-sm text-gray-500">
              This privacy policy was last updated on January 15, 2025. We are committed to 
              protecting your privacy and being transparent about our data practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}