/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { EnquiryType } from '../types';

interface HeroProps {
  onOpenEnquiry: (type: EnquiryType) => void;
}

export default function Hero({ onOpenEnquiry }: HeroProps) {
  const bullets = [
    'Affordable Fees',
    'Small Batches',
    'Goethe & TELC Prep',
    'Germany Career Guidance',
  ];

  // Subtle container fade-in/slide-up transition settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth ease out
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center bg-gradient-to-b from-[#0a1128] via-[#070c1a] to-[#040710] text-white overflow-hidden pt-28 pb-20 md:py-36 border-b border-white/5"
    >
      {/* 1. Subtle, Quiet Grid Overlay for Professional Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      {/* 2. Soft, Calm Radial Glow Elements to Establish Elegant Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-500/[0.035] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

      {/* 3. Main Content Container - Desktop Centered Precision */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10 max-w-4xl mx-auto"
        >
          {/* A. Premium Architectural Badge */}
          <motion.div variants={itemVariants} className="inline-flex justify-center">
            <div className="inline-flex items-center space-x-2.5 bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-slate-300 uppercase font-bold">
                Premium German Institute
              </span>
            </div>
          </motion.div>

          {/* B. Large Bold Heading & Subtitle */}
          <div className="space-y-6">
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] md:leading-[1.08]"
            >
              Learn German.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-400">
                Move to Germany.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed tracking-wide"
            >
              Your Trusted Partner for German Language & Career Success
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="inline-block py-1.5 px-4.5 rounded-full bg-white/[0.02] border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-400 font-mono tracking-wider"
            >
              German Courses (A1–B2) • Ausbildung • University Placement • Opportunity Card
            </motion.div>
          </div>

          {/* C. Clean Minimal Bullet Highlight Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto pt-2"
          >
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center space-x-2.5 bg-white/[0.015] backdrop-blur-sm border border-white/5 hover:border-white/10 hover:bg-white/[0.03] rounded-xl py-3 px-3 shadow-sm transition-all duration-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-300">{bullet}</span>
              </div>
            ))}
          </motion.div>

          {/* D. Action CTA Buttons with Micro-Interactions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenEnquiry('German Language Course')}
              className="w-full sm:w-auto bg-[#e11d48] hover:bg-red-700 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-rose-600/10 transition-all text-xs sm:text-sm tracking-wider uppercase text-center flex items-center justify-center space-x-2 border border-red-500 cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenEnquiry('General Enquiry')}
              className="w-full sm:w-auto border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all text-xs sm:text-sm tracking-wider uppercase text-center flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Award className="w-4.5 h-4.5 text-amber-400 shrink-0" />
              <span>Book Free Consultation</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
