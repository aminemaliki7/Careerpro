// src/components/home/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import RecruiterButton from '@/components/RecruiterButton';

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-start justify-center pt-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-50/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Staggered Text Animation */}
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight leading-none"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.9, 
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          Hirely.
        </motion.h1>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.9, 
            delay: 0.3, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          Land your next tech role.{' '}
          <span className="text-[#1E40AF]">Quickly.</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl sm:text-2xl text-gray-500 mb-8 font-light max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.9, 
            delay: 0.5, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          The fastest way to discover opportunities, learn skills, stay updated on tech, and grow your career
        </motion.p>
        
        {/* Animated Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.9, 
            delay: 0.7, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link
              href="/jobs"
              className="group bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-xl"
            >
              <Briefcase className="w-5 h-5" />
              Explore Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link
              href="/roadmaps"
              className="group border border-gray-300 text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-3 text-lg hover:border-gray-400"
            >
              View Roadmaps
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <RecruiterButton />
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 bottom-16 sm:bottom-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;