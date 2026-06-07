'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Bot, BarChart3, Target } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Curated images representing each pillar of Hirely platform
  const images = [
    {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      alt: "Tech Jobs - Professional interview",
      category: "Jobs",
      link: "/jobs"
    },
    {
      url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80",
      alt: "Podcast - Professional studio microphone setup",
      category: "Podcast",
      link: "/podcast"
    },
    {
      url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&auto=format&fit=crop&q=80",
      alt: "Blog - Writing and content creation on laptop",
      category: "Blogs",
      link: "/blog"
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
      alt: "Startups - Team collaboration",
      category: "Startups",
      link: "/startups"
    },
    {
      url: "https://images.unsplash.com/photo-1646617747563-4f080bddf282?w=600&auto=format&fit=crop&q=80",
      alt: "Tech Roadmap - Flow chart and planning board",
      category: "Roadmaps",
      link: "/roadmaps"
    }
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="mx-auto lg:max-w-7xl w-full px-4 sm:px-6 md:px-10 lg:px-5">
        {/* Badge */}
        <motion.div 
          className="flex justify-center mb-4 sm:mb-6 lg:mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
         
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-x-6 lg:gap-x-14 sm:gap-y-8 md:items-start">
          {/* Left Content */}
          <motion.div 
            className="space-y-1 sm:space-y-4 md:space-y-6 md:col-span-2 lg:col-span-1 w-full max-w-3xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-gray-900 leading-tight">
              Don't just find a job. Become the candidate{' '}
              <span className="text-[#0A66C2]">startups want.</span>
            </h1>
            <div className="text-gray-700 space-y-2 sm:space-y-3 mx-auto max-w-2xl lg:max-w-none text-sm sm:text-base">
              <p>
                Curated jobs, structured roadmaps, and insider content — built for developers, QA, and DevOps who want to stand out.
              </p>
              <p className="hidden sm:block">
                Stop sending CVs into the void. Start building the profile that gets callbacks.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start pt-2">
              {/* For signed-out users: Show sign-up button */}
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-5 sm:px-6 h-10 sm:h-11 flex items-center gap-2 rounded-lg bg-[#0A66C2] text-white text-sm transition ease-linear hover:bg-[#004182]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Build Your Tech Profile
                  </button>
                </SignUpButton>
              </SignedOut>

              {/* For signed-in users: Go to dashboard */}
              <SignedIn>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="px-5 sm:px-6 h-10 sm:h-11 flex items-center gap-2 rounded-lg bg-[#0A66C2] text-white text-sm transition ease-linear hover:bg-[#004182]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09 3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Go to Dashboard
                </button>
              </SignedIn>
            </div>
            <div className="grid grid-cols-3 w-full gap-2 pt-2">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">5K+</h2>
                <span className="text-xs sm:text-sm text-gray-600">Tech Jobs</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">50+</h2>
                <span className="text-xs sm:text-sm text-gray-600">Startups</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">100+</h2>
                <span className="text-xs sm:text-sm text-gray-600">Resources</span>
              </div>
            </div>
          </motion.div>

          {/* Center Image Carousel */}
          <motion.div 
            className="flex justify-center order-2 md:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div 
              className="relative w-full max-w-xs sm:max-w-sm"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Decorative circles with pulsing animation */}
              <motion.div 
                className="absolute -top-4 -left-4 w-60 h-60 sm:w-72 sm:h-72 bg-[#0A66C2]/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-4 -right-4 w-60 h-60 sm:w-72 sm:h-72 bg-[#0A66C2]/5 rounded-full blur-3xl"
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              ></motion.div>
              
              {/* Image carousel container */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
                <div 
                  className="relative w-full aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group/image"
                  onClick={() => router.push(images[currentImageIndex].link)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex].url}
                      alt={images[currentImageIndex].alt}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      initial={{ opacity: 0, y: 20, scale: 1.02 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 1.02 }}
                      transition={{
                        duration: 0.55,
                        ease: "easeOut"
                      }}
                    />
                  </AnimatePresence>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0A66C2]/0 group-hover/image:bg-[#0A66C2]/10 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <motion.div 
                      className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-sm font-semibold text-[#0A66C2] flex items-center gap-2">
                          View {images[currentImageIndex].category}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Category label overlay */}
                  <motion.div 
                    className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                    key={`label-${currentImageIndex}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="text-xs font-semibold text-[#0A66C2]">
                      {images[currentImageIndex].category}
                    </span>
                  </motion.div>
                </div>

                {/* Navigation dots */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentImageIndex 
                          ? 'w-8 h-2 bg-[#0A66C2]' 
                          : 'w-2 h-2 bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Features */}
          <motion.div 
            className="space-y-2 sm:space-y-3 lg:space-y-4 order-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.div 
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="min-w-max text-white p-2 sm:p-2.5 rounded-lg bg-[#0A66C2] group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">Curated Tech Jobs</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Curated offers for tech profiles — no noise, only relevant positions from startups that are actually hiring.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="min-w-max text-white p-2 sm:p-2.5 rounded-lg bg-[#0A66C2] group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">Career Roadmaps</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Know exactly what to learn next. Role-based roadmaps designed around what startups are looking for today.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-3 sm:p-4 lg:p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="min-w-max text-white p-2 sm:p-2.5 rounded-lg bg-[#0A66C2] group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">Insights & Community</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Podcast, blog, and startup network — understand what recruiters really want before you even apply.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;