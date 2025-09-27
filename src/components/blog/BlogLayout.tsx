'use client';

import { ReactNode, useEffect, useState } from "react";
import { CalendarDays, User } from "lucide-react";
import type { BlogPostWithContent } from "@/types/blog";

interface BlogLayoutProps {
  post: BlogPostWithContent;
  children: ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Collect headings from the article
  useEffect(() => {
    const contentHeadings = Array.from(
      document.querySelectorAll("article h2, article h3")
    ).map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: el.tagName === "H2" ? 2 : 3,
    }));
    setHeadings(contentHeadings);
  }, []);

  // Track active heading based on scroll - OnSaas style
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll("article h2, article h3");
      let currentActiveId = "";

      for (let i = 0; i < headingElements.length; i++) {
        const element = headingElements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        // Check if element is in viewport with some offset for better UX
        if (rect.top <= 100 && rect.bottom >= 0) {
          currentActiveId = element.id;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Handle affiliate link click with tracking
  const handleAffiliateClick = () => {
    // Add analytics tracking here if needed
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'engagement',
        event_label: 'cover_image',
        value: 1
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            {post.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-12">
          {/* Article Content */}
          <main className="lg:col-span-8">
            <article className="onsaas-prose prose prose-lg max-w-none">
              {/* Enhanced mobile styles with animations */}
              <style jsx global>{`
                .mobile-optimized-prose {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                  color: #1a202c;
                  line-height: 1.8;
                }
                
                .animate-fade-in {
                  animation: fadeIn 0.5s ease-in-out;
                }
                
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                /* Subtle clickable image styles */
                .clickable-cover-image {
                  position: relative;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: block;
                  overflow: hidden;
                  border-radius: 0.75rem;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }

                .clickable-cover-image:hover {
                  transform: scale(1.02);
                  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
                }

                .clickable-cover-image::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0, 0, 0, 0.03);
                  opacity: 0;
                  transition: opacity 0.2s ease;
                }

                .clickable-cover-image:hover::after {
                  opacity: 1;
                }
                
                .onsaas-prose h1,
                .onsaas-prose h2,
                .onsaas-prose h3,
                .onsaas-prose h4 {
                  color: #1a202c;
                  font-weight: 700;
                  line-height: 1.3;
                  margin-top: 3rem;
                  margin-bottom: 1.5rem;
                  scroll-margin-top: 120px;
                }
                
                .onsaas-prose h1 {
                  font-size: 2.5rem;
                  margin-top: 0;
                }
                
                .onsaas-prose h2 {
                  font-size: 2rem;
                  color: #2d3748;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 0.5rem;
                }
                
                .onsaas-prose h3 {
                  font-size: 1.5rem;
                  color: #2d3748;
                }
                
                .onsaas-prose p {
                  margin-bottom: 1.75rem;
                  color: #4a5568;
                  font-size: 1.125rem;
                  line-height: 1.8;
                }
                
                .onsaas-prose ul,
                .onsaas-prose ol {
                  margin-bottom: 2rem;
                  padding-left: 2rem;
                }
                
                .onsaas-prose li {
                  margin-bottom: 0.75rem;
                  color: #4a5568;
                  line-height: 1.7;
                }
                
                .onsaas-prose li::marker {
                  color: #667eea;
                }
                
                .onsaas-prose a {
                  color: #667eea;
                  text-decoration: underline;
                  text-decoration-color: rgba(102, 126, 234, 0.4);
                  text-underline-offset: 0.25rem;
                  transition: all 0.2s ease;
                }
                
                .onsaas-prose a:hover {
                  color: #5a67d8;
                  text-decoration-color: rgba(90, 103, 216, 0.8);
                }
                
                .onsaas-prose blockquote {
                  border-left: 4px solid #667eea;
                  padding-left: 1.5rem;
                  margin: 2rem 0;
                  color: #2d3748;
                  font-style: italic;
                  background: #f7fafc;
                  padding: 1.5rem;
                  border-radius: 0.5rem;
                }
                
                .onsaas-prose code {
                  background-color: #edf2f7;
                  color: #d53f8c;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.375rem;
                  font-size: 0.875rem;
                  font-weight: 600;
                }
                
                .onsaas-prose pre {
                  background: #2d3748;
                  color: #e2e8f0;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  overflow-x: auto;
                  margin: 2rem 0;
                  font-size: 0.875rem;
                  line-height: 1.6;
                }
                
                .onsaas-prose pre code {
                  background: transparent;
                  color: inherit;
                  padding: 0;
                  border-radius: 0;
                  font-size: inherit;
                  font-weight: normal;
                }
                
                .onsaas-prose img {
                  border-radius: 0.75rem;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                  margin: 2.5rem 0;
                  width: 100%;
                }
                
                .onsaas-prose table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 2rem 0;
                  border-radius: 0.5rem;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                
                .onsaas-prose th,
                .onsaas-prose td {
                  border: 1px solid #e2e8f0;
                  padding: 1rem;
                  text-align: left;
                }
                
                .onsaas-prose th {
                  background: #f7fafc;
                  font-weight: 600;
                  color: #2d3748;
                }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                  .onsaas-prose h1 {
                    font-size: 2rem;
                  }
                  
                  .onsaas-prose h2 {
                    font-size: 1.75rem;
                  }
                  
                  .onsaas-prose h3 {
                    font-size: 1.375rem;
                  }
                  
                  .onsaas-prose p {
                    font-size: 1.1rem;
                  }
                  
                  .onsaas-prose pre {
                    padding: 1rem;
                    font-size: 0.8rem;
                  }
                  
                  .onsaas-prose table {
                    font-size: 0.875rem;
                  }
                  
                  .onsaas-prose th,
                  .onsaas-prose td {
                    padding: 0.75rem;
                  }

                  .image-overlay {
                    font-size: 0.75rem;
                    padding: 0.5rem 1rem;
                  }
                }
              `}</style>

              {/* Cover Image - Subtly Clickable */}
              {post.coverImage && (
                <div className="mb-8">
                  {post.affiliateLink ? (
                    <a
                      href={post.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clickable-cover-image"
                      onClick={handleAffiliateClick}
                      aria-label={post.title}
                    >
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                    </a>
                  ) : (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg"
                    />
                  )}
                </div>
              )}

              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}