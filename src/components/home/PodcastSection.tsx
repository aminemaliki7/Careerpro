// src/components/home/PodcastSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Volume2, Headphones, Play, Clock, ArrowRight } from 'lucide-react';

const PodcastSection = () => {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">Audio Available</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Listen or Read.
              <br />
              <span className="text-gray-500 font-light">Your Choice.</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              We&apos;re the first tech career platform to offer all our insights in audio format. Learn on your commute, during workouts, or whenever reading isn&apos;t convenient.
            </motion.p>
            
            <motion.div 
              className="space-y-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Headphones, title: "30+ Audio Episodes", desc: "Expert career advice you can listen to anywhere" },
                { icon: Play, title: "Instant Format Switch", desc: "Toggle between audio and text with one click" },
                { icon: Clock, title: "Learn on Your Schedule", desc: "5-20 minute episodes that fit your day" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              whileHover={{ x: 5 }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
              >
                <Headphones className="w-5 h-5" />
                Start Listening
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Right side - Audio Player Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-200">
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center"
                    animate={{ 
                      boxShadow: [
                        "0 0 0 0 rgba(37, 99, 235, 0)",
                        "0 0 0 10px rgba(37, 99, 235, 0.1)",
                        "0 0 0 0 rgba(37, 99, 235, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Headphones className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">EPISODE 30</div>
                    <h4 className="font-bold text-gray-900">Career Insights</h4>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-6 leading-snug">
                  Mental Health for High-Performing Professionals
                </h3>
                
                <div className="mb-6">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600 rounded-full" 
                      initial={{ width: '0%' }}
                      whileInView={{ width: '40%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>7:12</span>
                    <span>17:00</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  <motion.button 
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button 
                    className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ 
                      boxShadow: [
                        "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                        "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
                        "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </motion.button>
                  
                  <motion.button 
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z"/>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;