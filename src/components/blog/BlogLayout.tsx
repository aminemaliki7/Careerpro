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

  // Track active heading based on scroll with improved accuracy
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll("article h2, article h3");
      let currentId = "";

      // Get current scroll position
      const scrollPosition = window.scrollY + 150;

      // Find the heading that's currently in view
      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;

        if (scrollPosition >= elementTop) {
          currentId = el.id;
        } else {
          break;
        }
      }

      // If we're at the very top, don't highlight anything
      if (window.scrollY < 100) {
        currentId = "";
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeId]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight sm:leading-snug">
            {post.title}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed">
            {post.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-gray-500 text-xs sm:text-sm lg:text-base">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content + TOC */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* Mobile TOC - Collapsible */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-6 col-span-1">
            <div className="bg-white rounded-lg border shadow-sm">
              <details className="group">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    On this page
                  </h3>
                  <svg 
                    className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <nav className="px-4 pb-4 space-y-2 text-sm border-t border-gray-100 pt-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={`block py-1 px-2 rounded transition-all duration-200 ${
                        heading.level === 3 ? "ml-4" : ""
                      } ${
                        activeId === heading.id
                          ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500 pl-3"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </details>
            </div>
          </div>
        )}

        {/* Article */}
        <article className="mobile-optimized-prose prose prose-gray max-w-none lg:col-span-8">
          {/* Enhanced mobile styles */}
          <style jsx global>{`
            .mobile-optimized-prose {
              font-size: 16px;
              line-height: 1.7;
              color: #1f2937;
            }
            
            .mobile-optimized-prose p {
              margin-bottom: 1.25rem;
              font-size: 16px;
              line-height: 1.7;
              color: #374151;
              text-align: left;
            }
            
            .mobile-optimized-prose h1,
            .mobile-optimized-prose h2,
            .mobile-optimized-prose h3,
            .mobile-optimized-prose h4 {
              font-weight: 700;
              color: #111827;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.3;
              scroll-margin-top: 120px;
            }
            
            .mobile-optimized-prose h2 {
              font-size: 1.5rem;
              margin-top: 2.5rem;
            }
            
            .mobile-optimized-prose h3 {
              font-size: 1.25rem;
              margin-top: 2rem;
            }
            
            .mobile-optimized-prose ul,
            .mobile-optimized-prose ol {
              margin-bottom: 1.25rem;
              padding-left: 1.5rem;
            }
            
            .mobile-optimized-prose li {
              margin-bottom: 0.5rem;
              line-height: 1.6;
              color: #374151;
            }
            
            .mobile-optimized-prose blockquote {
              border-left: 4px solid #3b82f6;
              padding-left: 1rem;
              margin: 1.5rem 0;
              font-style: italic;
              color: #4b5563;
              background-color: #f8fafc;
              padding: 1rem;
              border-radius: 0.375rem;
            }
            
            .mobile-optimized-prose pre {
              background-color: #1f2937;
              color: #f9fafb;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              font-size: 14px;
              line-height: 1.5;
              margin: 1.5rem 0;
            }
            
            .mobile-optimized-prose code {
              background-color: #f3f4f6;
              color: #dc2626;
              padding: 0.2rem 0.4rem;
              border-radius: 0.25rem;
              font-size: 0.875rem;
              font-weight: 500;
            }
            
            .mobile-optimized-prose pre code {
              background-color: transparent;
              color: inherit;
              padding: 0;
              border-radius: 0;
              font-size: inherit;
              font-weight: normal;
            }
            
            .mobile-optimized-prose a {
              color: #2563eb;
              text-decoration: underline;
              text-decoration-color: rgba(37, 99, 235, 0.3);
              text-underline-offset: 0.2rem;
              transition: all 0.2s;
            }
            
            .mobile-optimized-prose a:hover {
              color: #1d4ed8;
              text-decoration-color: rgba(29, 78, 216, 0.6);
            }
            
            .mobile-optimized-prose img {
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              margin: 1.5rem 0;
            }
            
            .mobile-optimized-prose table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5rem 0;
              font-size: 0.9rem;
              overflow-x: auto;
              display: block;
              white-space: nowrap;
            }
            
            .mobile-optimized-prose th,
            .mobile-optimized-prose td {
              border: 1px solid #e5e7eb;
              padding: 0.75rem;
              text-align: left;
            }
            
            .mobile-optimized-prose th {
              background-color: #f9fafb;
              font-weight: 600;
              color: #374151;
            }
            
            @media (max-width: 640px) {
              .mobile-optimized-prose {
                font-size: 17px;
                line-height: 1.8;
              }
              
              .mobile-optimized-prose p {
                font-size: 17px;
                line-height: 1.8;
                margin-bottom: 1.5rem;
              }
              
              .mobile-optimized-prose h2 {
                font-size: 1.375rem;
                line-height: 1.2;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              
              .mobile-optimized-prose h3 {
                font-size: 1.125rem;
                line-height: 1.3;
                margin-top: 1.75rem;
                margin-bottom: 0.75rem;
              }
              
              .mobile-optimized-prose pre {
                font-size: 13px;
                padding: 0.75rem;
                margin: 1rem 0;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
              }
              
              .mobile-optimized-prose table {
                font-size: 0.8rem;
                display: block;
                overflow-x: auto;
                white-space: nowrap;
                -webkit-overflow-scrolling: touch;
              }
              
              .mobile-optimized-prose th,
              .mobile-optimized-prose td {
                padding: 0.5rem;
                min-width: 100px;
              }
            }
            
            @media (max-width: 480px) {
              .mobile-optimized-prose {
                font-size: 18px;
                line-height: 1.8;
              }
              
              .mobile-optimized-prose p {
                font-size: 18px;
                line-height: 1.8;
              }
            }
          `}</style>

          {/* Mid-article cover image */}
          {post.coverImage && (
            <div className="my-6 sm:my-8 lg:my-12">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover rounded-lg sm:rounded-xl lg:rounded-2xl max-h-[200px] sm:max-h-[250px] lg:max-h-[300px]"
              />
            </div>
          )}

          {children}
        </article>

        {/* Desktop Sidebar TOC */}
        {headings.length > 0 && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                On this page
              </h3>
              <nav className="space-y-2 text-sm">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block py-2 px-3 rounded transition-all duration-200 ${
                      heading.level === 3 ? "ml-4" : ""
                    } ${
                      activeId === heading.id
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}