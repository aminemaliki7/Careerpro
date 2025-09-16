// src/app/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Users, BookOpen, TrendingUp, Award, Coffee, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Tech Career Expert & Job Search Strategist',
  description: 'Learn about my mission to help tech professionals land their dream jobs through proven CV optimization, interview strategies, and career advice.',
  keywords: 'tech career expert, job search strategist, CV optimization specialist, career coach',
  openGraph: {
    title: 'About | Tech Career Expert & Job Search Strategist',
    description: 'Helping tech professionals navigate their career journey with proven strategies and insider insights.',
    type: 'profile',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hi, I'm <span className="text-blue-600">Alex</span> 👋
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                I'm a tech career strategist who's helped over 500+ professionals land roles at 
                companies like Google, Meta, Netflix, and top startups.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                After 8 years in tech recruitment and career coaching, I've decoded what really 
                works in today's competitive job market. Now I share these insider strategies 
                to help you accelerate your career.
              </p>
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Coffee className="w-5 h-5" />
                Let's Connect
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Professionals Helped</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                    <div className="text-sm text-gray-600">Interview Success Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">$50K+</div>
                    <div className="text-sm text-gray-600">Avg. Salary Increase</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">3 weeks</div>
                    <div className="text-sm text-gray-600">Avg. Job Search Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Story</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              My career journey started like many others - with a computer science degree and 
              big dreams of working at a top tech company. But after sending 100+ applications 
              and getting only 3 interviews, I realized something was fundamentally wrong with 
              my approach.
            </p>
            
            <p className="text-gray-700 mb-6">
              That failure became my obsession. I dove deep into recruitment systems, interviewed 
              dozens of hiring managers, and reverse-engineered what actually works in tech hiring. 
              The insights I discovered helped me land my dream role at a unicorn startup.
            </p>
            
            <p className="text-gray-700 mb-6">
              But I didn't stop there. I spent the next 8 years in various recruiting and talent 
              acquisition roles, seeing both sides of the hiring process. I witnessed brilliant 
              engineers get rejected due to poor CVs, while less qualified candidates sailed 
              through with optimized applications.
            </p>
            
            <p className="text-gray-700">
              That's when I decided to level the playing field. This blog represents everything 
              I've learned about navigating tech careers successfully - from ATS optimization 
              to salary negotiation strategies.
            </p>
          </div>
        </div>
      </section>

      {/* What I Believe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What I Believe</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Knowledge Should Be Accessible</h3>
              <p className="text-gray-600">
                Career success shouldn't depend on who you know or expensive coaching. 
                Everyone deserves access to proven strategies.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Beats Opinions</h3>
              <p className="text-gray-600">
                I base my advice on real data, not feel-good platitudes. What I share 
                is tested and proven to work in today's market.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Over Competition</h3>
              <p className="text-gray-600">
                The tech industry is big enough for everyone. I believe in lifting others up 
                and sharing knowledge that helps the entire community grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Credentials */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Experience & Background</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Senior Talent Acquisition Partner | TechCorp (2019-2023)
                </h3>
                <p className="text-gray-600 mb-3">
                  Led hiring for engineering teams at a Series B startup. Reviewed 10,000+ CVs 
                  and interviewed 2,000+ candidates across all levels.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>Reduced time-to-hire by 40% through optimized screening processes</li>
                  <li>Achieved 95% offer acceptance rate with strategic candidate experience</li>
                  <li>Built diverse engineering teams that scaled from 15 to 150 people</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Career Coach | Freelance (2020-Present)
                </h3>
                <p className="text-gray-600 mb-3">
                  One-on-one coaching for tech professionals seeking career advancement, 
                  role transitions, and salary negotiations.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>500+ professionals coached with 85% landing target roles</li>
                  <li>Average salary increase of $50K+ for coached candidates</li>
                  <li>Specialized in FAANG and unicorn startup placements</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Software Engineer | Various Startups (2016-2019)
                </h3>
                <p className="text-gray-600 mb-3">
                  Full-stack development experience at 3 different startups, giving me 
                  firsthand knowledge of what engineering managers actually look for.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>Built scalable web applications used by 100K+ users</li>
                  <li>Led technical interviews and mentored junior developers</li>
                  <li>Experienced the job search process from both sides</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">As Featured In</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-lg font-semibold text-gray-600">TechCrunch</div>
            <div className="text-lg font-semibold text-gray-600">Hacker News</div>
            <div className="text-lg font-semibold text-gray-600">Dev.to</div>
            <div className="text-lg font-semibold text-gray-600">Medium</div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            * Placeholder - Update with actual publications when featured
          </p>
        </div>
      </section>

      {/* Why I Started This Blog */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why I Started This Blog</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              After helping hundreds of people individually, I realized I was solving the same 
              problems over and over. Brilliant engineers were struggling with basic job search 
              fundamentals, while the same myths and bad advice circulated endlessly online.
            </p>
            
            <p className="text-gray-700 mb-6">
              This blog is my way of scaling impact. Instead of helping one person at a time, 
              I can share proven strategies with thousands. Every article is based on real data, 
              tested methods, and insider knowledge from both sides of the hiring process.
            </p>
            
            <p className="text-gray-700">
              My goal is simple: give you the same advantages that well-connected candidates have, 
              level the playing field, and help you build the career you deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Values & Approach */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">My Approach</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">No Fluff, Just Results</h3>
              <p className="text-gray-600">
                I skip the motivational speeches and focus on actionable tactics that 
                directly impact your job search success.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data-Driven Insights</h3>
              <p className="text-gray-600">
                Every recommendation is backed by real hiring data, not personal opinions 
                or outdated conventional wisdom.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Insider Perspective</h3>
              <p className="text-gray-600">
                I share what recruiters and hiring managers actually think, not what 
                they say in public or on their company blogs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Always Current</h3>
              <p className="text-gray-600">
                The job market changes quickly. I continuously update my advice based on 
                the latest trends and hiring practices.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Practical Examples</h3>
              <p className="text-gray-600">
                Every strategy comes with real examples, templates, and step-by-step 
                implementation guides you can use immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Honest Feedback</h3>
              <p className="text-gray-600">
                I'll tell you what you need to hear, not what you want to hear. 
                Success requires honest assessment and targeted improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-600 mb-8">
            Have questions about your career? Want to share your job search success story? 
            Or just want to say hi? I'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Send a Message
            </Link>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Twitter
            </a>
          </div>
          
          <p className="text-gray-500 mt-8 text-sm">
            I read and respond to every message personally. No automated responses, 
            no virtual assistants - just me.
          </p>
        </div>
      </section>
    </div>
  )
}