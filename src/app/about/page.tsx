// src/app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Target, Heart, Lightbulb, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Hirely',
  description: 'Learn about our mission to simplify tech hiring and connect talent with opportunities.',
  openGraph: {
    title: 'About Us | Hirely',
    description: 'Learn about our mission to simplify tech hiring and connect talent with opportunities.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            About Hirely
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            We&apos;re building a better way to connect tech talent with opportunities. No noise, no spam—just real jobs, clear guidance, and tools that actually help.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              Job hunting in tech shouldn&apos;t feel like a full-time job. Yet for too many people, it does. Endless applications that go nowhere. Job boards cluttered with outdated listings. Career advice that&apos;s either too generic or just plain wrong.
            </p>
            <p>
              We started Hirely because we&apos;ve been there. We know what it&apos;s like to send out hundreds of applications and hear nothing back. We know the frustration of finding a &quot;perfect&quot; job posting only to discover it was filled months ago.
            </p>
            <p>
              So we built something different. A platform where jobs are actually verified. Where career guidance comes from people who&apos;ve done the work, not just written about it. Where you can map your path forward without paying for expensive bootcamps or courses.
            </p>
          </div>
        </div>
      </section>

     {/* Mission, Vision, Values */}
<section className="py-20 bg-gray-50 flex items-center justify-center">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-12">Mission, Vision & Values</h2>

    <div className="grid md:grid-cols-3 gap-12 justify-items-center">
      {/* Mission */}
      <div className="max-w-sm">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed">
          Make tech careers accessible to everyone by providing honest job listings, practical guidance, and clear learning paths, all in one place.
        </p>
      </div>

      {/* Vision */}
      <div className="max-w-sm">
        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
        <p className="text-gray-600 leading-relaxed">
          A world where finding your next tech role is straightforward, transparent, and doesn&apos;t require gaming algorithms or paying gatekeepers.
        </p>
      </div>

      {/* Values */}
      <div className="max-w-sm">
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
        <ul className="text-gray-600 leading-relaxed space-y-2 text-left inline-block">
          <li>• Transparency over hype</li>
          <li>• Quality over quantity</li>
          <li>• People over profit</li>
        </ul>
      </div>
    </div>
  </div>
</section>


      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What We Do</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Curate Real Opportunities</h3>
                <p className="text-gray-600">
                  Every job on our platform is verified. We review each posting before it goes live to ensure it&apos;s legitimate, current, and detailed enough to be useful.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Provide Clear Guidance</h3>
                <p className="text-gray-600">
                  Our blog features practical advice from people who&apos;ve actually hired (or been hired) in tech. No fluff, no outdated wisdom—just what works right now.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Map Career Paths</h3>
                <p className="text-gray-600">
                  Our roadmaps show you exactly what skills you need for different tech roles, with realistic timelines and resources to get there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-12">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">For Recruiters</h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We&apos;re building a high-quality talent pool. If you&apos;re hiring for a legitimate tech role, we want to help you find the right people—without the noise of unqualified applicants.
            </p>
            <Link
              href="/recruiter/add-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Post a Job
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to find your next opportunity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse verified tech jobs or explore career roadmaps to level up your skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/roadmaps"
              className="px-8 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              View Roadmaps
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
