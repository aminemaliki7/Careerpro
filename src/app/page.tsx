// src/app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import NewsletterCTA from '@/components/NewsletterCTA';

export const metadata = {
  title: "Hirely – AI, Startups & Global Tech Careers",
  description:
    "Hirely is your hub for AI trends, startup insights, tech career roadmaps, and global job opportunities.",
};

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <HeroSection />

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center px-6">

          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
            Join Our Newsletter
          </h2>

          <p className="text-lg text-gray-600 mb-10">
            Receive weekly insights about AI, emerging tech, job trends, and exclusive updates.
          </p>

          {/* Re-using your existing reusable CTA */}
          <NewsletterCTA />

          <p className="text-sm text-gray-400 mt-6">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

    </div>
  );
}
