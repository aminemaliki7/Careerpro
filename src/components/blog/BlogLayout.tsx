'use client';

import { ReactNode, useEffect, useState } from "react";
import { CalendarDays, Clock, User } from "lucide-react";
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

  // Track active heading based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll("article h2, article h3");
      let currentId = "";

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          currentId = el.id;
        } else {
          break;
        }
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-snug">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            {post.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500 text-sm sm:text-base">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Article */}
<article className="prose prose-sm sm:prose-base lg:prose-lg prose-blue max-w-none lg:col-span-8 prose-p:text-gray-800 prose-headings:text-gray-900">          {/* Bold h2 and h3 */}
          <style jsx global>{`
            article h2, article h3 {
              font-weight: 800;
            }
          `}</style>

          {/* Mid-article cover image */}
          {post.coverImage && (
            <div className="my-8 sm:my-12">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover rounded-2xl max-h-[250px] sm:max-h-[300px]"
              />
            </div>
          )}

          {children}
        </article>

        {/* Sidebar TOC */}
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
                  className={`block transition-colors ${
                    heading.level === 3 ? "ml-4" : ""
                  } ${
                    activeId === heading.id
                      ? "text-blue-700 font-semibold"
                      : "text-gray-800 hover:text-blue-500"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </main>
    </div>
  );
}
