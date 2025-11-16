// src/components/blog/BlogLayout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Bookmark, Share2, Twitter, Linkedin, Facebook, Link2, ChevronUp, MoreHorizontal } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import AdBanner from '@/components/ads/AdBanner';
import { AD_SLOTS } from '@/config/adSlots';

interface BlogLayoutProps {
  post: BlogPostWithContent;
  children: ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll('article h2, article h3');
      let currentActiveId = '';

      for (let i = 0; i < headingElements.length; i++) {
        const element = headingElements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= 100 && rect.bottom >= 0) {
          currentActiveId = element.id;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Medium-Style Article Container */}
      <article className="max-w-[680px] mx-auto px-6 sm:px-8 pt-12 pb-20">
        {/* Title */}
        <h1 className="text-[42px] sm:text-[52px] font-serif font-bold text-[#242424] mb-2 leading-[1.1] tracking-tight">
          {post.title}
        </h1>

        {/* Subtitle/Description */}
        <h2 className="text-[20px] sm:text-[24px] text-[#6B6B6B] mb-8 leading-[1.4] font-normal">
          {post.description}
        </h2>

        {/* Author & Meta Row */}
        <div className="flex items-center justify-between py-6 mb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
         
            <div>
             
              <div className="flex items-center gap-2 text-[14px] text-[#6B6B6B]">
                <span>{formatDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.readingTime || 5} min read</span>
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button className="text-[#6B6B6B] hover:text-[#242424] transition-colors">
              <Bookmark className="w-6 h-6" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="text-[#6B6B6B] hover:text-[#242424] transition-colors"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
              
              {/* Share Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 w-48 z-50">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left text-sm text-[#242424] hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Twitter className="w-4 h-4" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-left text-sm text-[#242424] hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Linkedin className="w-4 h-4" />
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-sm text-[#242424] hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Facebook className="w-4 h-4" />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare()}
                    className="w-full px-4 py-2 text-left text-sm text-[#242424] hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Link2 className="w-4 h-4" />
                    Copy link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image with Affiliate Link Support */}
        {post.coverImage && (
          <div className="mb-12 -mx-6 sm:-mx-8">
            {post.affiliateLink ? (
              <a
                href={post.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group"
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-900 shadow-lg">
                    Click to Try →
                  </div>
                </div>
              </a>
            ) : (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[500px] object-cover"
              />
            )}
          </div>
        )}

        {/* Article Content with Medium Typography */}
        <div className="medium-prose">
          <style jsx global>{`
            .medium-prose {
              font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
              color: #242424;
              line-height: 1.58;
            }
            
            .medium-prose > * {
              margin-bottom: 0;
            }
            
            .medium-prose h1,
            .medium-prose h2,
            .medium-prose h3,
            .medium-prose h4 {
              font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-weight: 700;
              color: #242424;
              line-height: 1.2;
              letter-spacing: -0.02em;
            }
            
            .medium-prose h1 {
              font-size: 2.5em;
              margin-top: 2em;
              margin-bottom: 0.25em;
            }
            
            .medium-prose h2 {
              font-size: 2em;
              margin-top: 1.8em;
              margin-bottom: 0.25em;
            }
            
            .medium-prose h3 {
              font-size: 1.5em;
              margin-top: 1.6em;
              margin-bottom: 0.25em;
            }
            
            .medium-prose p {
              font-size: 20px;
              line-height: 1.58;
              letter-spacing: -0.003em;
              margin-top: 0;
              margin-bottom: 1.58em;
              color: #242424;
            }
            
            .medium-prose a {
              color: inherit;
              text-decoration: underline;
              text-decoration-color: rgba(0, 0, 0, 0.3);
              text-underline-offset: 2px;
              transition: text-decoration-color 0.2s;
            }
            
            .medium-prose a:hover {
              text-decoration-color: rgba(0, 0, 0, 0.8);
            }
            
            .medium-prose strong,
            .medium-prose b {
              font-weight: 700;
              color: #242424;
            }
            
            .medium-prose em,
            .medium-prose i {
              font-style: italic;
            }
            
            .medium-prose code {
              background-color: rgba(0, 0, 0, 0.05);
              padding: 3px 6px;
              border-radius: 3px;
              font-size: 16px;
              font-family: Menlo, Monaco, "Courier New", Courier, monospace;
              color: #242424;
            }
            
            .medium-prose pre {
              background-color: #f7f7f7;
              border-radius: 4px;
              padding: 20px;
              overflow-x: auto;
              margin: 1.58em 0;
              font-size: 16px;
              line-height: 1.5;
            }
            
            .medium-prose pre code {
              background: none;
              padding: 0;
              font-size: inherit;
            }
            
            .medium-prose blockquote {
              border-left: 3px solid #242424;
              padding-left: 23px;
              margin-left: -23px;
              margin-right: 0;
              font-style: italic;
              color: #242424;
              font-size: 21px;
              line-height: 1.58;
              margin-top: 1.58em;
              margin-bottom: 1.58em;
            }
            
            .medium-prose ul,
            .medium-prose ol {
              padding-left: 30px;
              margin-top: 1.58em;
              margin-bottom: 1.58em;
            }
            
            .medium-prose li {
              margin-bottom: 14px;
              line-height: 1.58;
              font-size: 20px;
            }
            
            .medium-prose li p {
              margin-bottom: 0;
            }
            
            .medium-prose img {
              width: 100%;
              height: auto;
              margin: 1.58em 0;
            }
            
            .medium-prose hr {
              border: 0;
              border-top: 1px solid rgba(0, 0, 0, 0.1);
              margin: 2.5em 0;
            }
            
            .medium-prose table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.58em 0;
            }
            
            .medium-prose th,
            .medium-prose td {
              border: 1px solid #e6e6e6;
              padding: 12px;
              text-align: left;
              font-size: 18px;
            }
            
            .medium-prose th {
              background-color: #f7f7f7;
              font-weight: 600;
            }
            
            /* Mobile Responsive */
            @media (max-width: 768px) {
              .medium-prose p,
              .medium-prose li {
                font-size: 18px;
              }
              
              .medium-prose h2 {
                font-size: 1.75em;
              }
              
              .medium-prose h3 {
                font-size: 1.375em;
              }
              
              .medium-prose blockquote {
                font-size: 19px;
                padding-left: 20px;
                margin-left: -20px;
              }
              
              .medium-prose code {
                font-size: 14px;
              }
              
              .medium-prose pre {
                font-size: 14px;
                padding: 16px;
              }
            }
          `}</style>
          
          {children}
        </div>

        {/* Ad Banner */}
        <div className="my-12 py-8 border-y border-gray-100">
          <AdBanner 
            dataAdSlot={AD_SLOTS.BLOG_TOP}
            dataAdFormat="auto"
            className="my-8"
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-4 py-2 bg-[#F2F2F2] hover:bg-[#E6E6E6] rounded-full text-[14px] font-normal text-[#242424] transition-colors"
              >
                {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
        )}

     

        {/* Roadmap CTA */}
        <div className="mt-12 p-8 bg-[#F9F9F9] rounded-lg border border-[#E6E6E6]">
          <h3 className="text-[24px] font-bold text-[#242424] mb-3">
             Ready to level up your career?
          </h3>
          <p className="text-[16px] text-[#6B6B6B] mb-6 leading-relaxed">
            Explore our interactive career roadmaps designed to guide you from junior to expert, step by step.
          </p>
          <Link
            href="/roadmaps"
            className="inline-block px-6 py-3 bg-[#242424] text-white rounded-full text-[14px] font-medium hover:bg-[#000000] transition-colors"
          >
            View Roadmaps →
          </Link>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="mt-12 flex items-center gap-2 text-[14px] text-[#6B6B6B] hover:text-[#242424] transition-colors mx-auto"
        >
          <ChevronUp className="w-4 h-4" />
          Back to top
        </button>
      </article>

      {/* Mobile Floating Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-6">
          <button className="text-[#6B6B6B] hover:text-[#242424]">
            <Bookmark className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="text-[#6B6B6B] hover:text-[#242424]"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button 
          onClick={scrollToTop}
          className="text-[#6B6B6B] hover:text-[#242424]"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}