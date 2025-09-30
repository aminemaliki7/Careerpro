// src/app/privacy-policy/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Hirely.ma',
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
            <strong>Last updated:</strong> September 29, 2025
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-blue-800">
              <strong>Quick Summary:</strong> We respect your privacy. We only collect information necessary 
              to provide our services and improve your experience. We do not sell your personal information.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>Contact Forms:</strong> Name, email, and message content.</li>
            <li><strong>Newsletter Subscription:</strong> Email for weekly job tips.</li>
            <li><strong>Comments:</strong> Name, email (optional), and comment content.</li>
            <li><strong>CV Submissions:</strong> Documents and career information when requested.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information Collected Automatically</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700">
            <li><strong>Analytics Data:</strong> Page views, session duration, referral sources.</li>
            <li><strong>Technical Data:</strong> IP address, browser, device type, OS.</li>
            <li><strong>Cookies:</strong> Small files to improve website functionality and experience.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Respond to inquiries:</strong> Answer questions and provide career advice.</li>
            <li><strong>Deliver newsletters:</strong> Weekly updates and job tips.</li>
            <li><strong>Improve website:</strong> Analyze usage and enhance user experience.</li>
            <li><strong>Compliance & security:</strong> Protect users and meet legal requirements.</li>
          </ul>

          <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
            <p className="text-green-800">
              <strong>We Never:</strong> Sell your personal information or share it with third-party marketers without your consent.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-4">We share your information only in limited circumstances:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>Service Providers:</strong> Hosting, email delivery, analytics providers.</li>
            <li><strong>Legal Requirements:</strong> Compliance with laws or court orders.</li>
            <li><strong>Protection:</strong> To protect our rights or users’ safety.</li>
            <li><strong>With consent:</strong> Only when explicitly permitted by you.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Third-Party Services</h3>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <ul className="space-y-3 text-gray-700">
              <li><strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Mailchimp/ConvertKit:</strong> Email delivery - <a href="https://mailchimp.com/legal/privacy/" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Vercel/Netlify:</strong> Hosting - <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
              <li><strong>Google AdSense:</strong> Advertising - <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">We use cookies to improve functionality and deliver relevant ads. You can manage cookies through your browser settings.</p>

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
                  <td className="px-6 py-4 text-sm text-gray-700">Website functionality and security</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Analytics</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Traffic and performance tracking</td>
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

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">You can request access, correction, or deletion of your personal information. Contact <a href="/contact" className="text-blue-600 hover:underline">Visit our contact page</a></p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Children&apos;s Privacy</h2>
          <p className="text-gray-700 mb-6">We do not knowingly collect information from children under 13. If discovered, such data is deleted immediately.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Policy Updates</h2>
          <p className="text-gray-700 mb-6">We may update this policy and notify users by updating the date above or via email for major changes.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <ul className="text-gray-700 space-y-2">
  <li><strong>Contact Form:</strong> <a href="/contact" className="text-blue-600 hover:underline">Visit our contact page</a></li>
  <li><strong>Email:</strong> Will be provided soon for direct privacy inquiries</li>
  
</ul>

          </div>

          <div className="border-t pt-8">
            <p className="text-sm text-gray-500">
              This privacy policy was last updated on September 29, 2025. We are committed to protecting your privacy and being transparent about our data practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
