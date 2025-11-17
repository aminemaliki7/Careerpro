// src/components/home/PodcastSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Headphones, ArrowRight } from 'lucide-react';

const PodcastSection = () => {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
              <span className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Audio Available
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Listen or Read.<br />
              <span className="text-gray-600 font-normal">Your Choice.</span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              We&apos;re the first tech career platform to offer all our insights in audio format. 
              Learn on your commute, during workouts, or whenever reading isn&apos;t convenient.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">30+</div>
                <div className="text-xs sm:text-sm text-gray-600">Audio Episodes</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">5-20</div>
                <div className="text-xs sm:text-sm text-gray-600">Minutes Each</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">1K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Listeners</div>
              </div>
            </div>
            
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Start Listening
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          {/* Right side - Audio Player Visual */}
          <motion.div 
            className="relative order-first lg:order-last"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Episode 30+</div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Career Insights</h4>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-6 leading-snug text-base sm:text-lg">
                Mental Health for High-Performing Professionals
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-gray-900 rounded-full" 
                    initial={{ width: '0%' }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>7:12</span>
                  <span>17:00</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <button 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>
                
                <button 
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Play"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                
                <button 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;