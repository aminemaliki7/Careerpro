'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Bot, BarChart3, Target } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();

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
          <span className="inline-flex items-center gap-x-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs sm:text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            Tech Career Platform
          </span>
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
              Apply to curated tech jobs <span className="text-[#0A66C2]">with AI.</span>
            </h1>
            <div className="text-gray-700 space-y-2 sm:space-y-3 mx-auto max-w-2xl lg:max-w-none text-sm sm:text-base">
              <p>
                Let AI apply to the best-fit opportunities while you track everything in one dashboard.
              </p>
              <p className="hidden sm:block">
                Quality jobs matched to your profile. For candidates and recruiters.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start pt-2">
              {/* For signed-out users: Show sign-up button */}
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="px-5 sm:px-6 h-10 sm:h-11 flex items-center gap-2 rounded-lg bg-[#0A66C2] text-white text-sm transition ease-linear hover:bg-[#004182]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Start Applying with AI
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Go to Dashboard
                </button>
              </SignedIn>
            </div>
            <div className="grid grid-cols-3 w-full gap-2 pt-2">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">5K+</h2>
                <span className="text-xs sm:text-sm text-gray-600">Curated Jobs</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">10K+</h2>
                <span className="text-xs sm:text-sm text-gray-600">AI Applications</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gray-800">95%</h2>
                <span className="text-xs sm:text-sm text-gray-600">Match Rate</span>
              </div>
            </div>
          </motion.div>

          {/* Center Image */}
          <motion.div 
            className="flex justify-center order-2 md:order-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="relative w-full max-w-xs sm:max-w-sm">
              {/* Decorative circles */}
              <div className="absolute -top-4 -left-4 w-60 h-60 sm:w-72 sm:h-72 bg-[#0A66C2]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -right-4 w-60 h-60 sm:w-72 sm:h-72 bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
              
              {/* Image container */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80" 
                  alt="Tech professional" 
                  className="relative w-full h-auto rounded-lg"
                />
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
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">AI-Powered Applications</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Let AI apply to best-fit jobs automatically while you focus on interviews.
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
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">Application Dashboard</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Track all your applications, interviews, and offers in one place.
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
                  <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">Curated Matches</span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-0 sm:pl-11">
                  Quality over quantity. Only jobs matched to your profile and goals.
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