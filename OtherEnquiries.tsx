/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Calendar, Clock, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { EnquiryType, GermanLevelType } from '../types';

interface GermanClassesProps {
  onOpenEnquiry: (type: EnquiryType, level?: GermanLevelType) => void;
}

export default function GermanClasses({ onOpenEnquiry }: GermanClassesProps) {
  const courses = [
    {
      id: 'a1',
      level: 'A1 Level',
      subtitle: 'Absolute Beginner',
      fee: 6000,
      duration: '6-8 Weeks',
      hours: '60+ Hrs Training',
      description: 'Learn basic alphabet, simple daily conversations, greetings, and self-introduction structures.',
      outcome: 'Build foundational pronunciation and grammar.',
    },
    {
      id: 'a2',
      level: 'A2 Level',
      subtitle: 'Elementary German',
      fee: 8000,
      duration: '6-8 Weeks',
      hours: '60+ Hrs Training',
      description: 'Express local information, routine shopping requirements, careers, and standard social situations.',
      outcome: 'Participate in casual discussions and normal routines.',
    },
    {
      id: 'b1',
      level: 'B1 Level',
      subtitle: 'Intermediate German',
      fee: 11000,
      duration: '8-10 Weeks',
      hours: '80+ Hrs Training',
      description: 'Acquire intermediate structure. Explain plans, dreams, ambitions, and professional situations.',
      outcome: 'Meet core criteria for Ausbildung & basic jobs.',
    },
    {
      id: 'b2',
      level: 'B2 Level',
      subtitle: 'Upper-Intermediate',
      fee: 14000,
      duration: '8-10 Weeks',
      hours: '80+ Hrs Training',
      description: 'Express professional arguments, complex technical details, and fluent oral narratives.',
      outcome: 'Qualify for universities and specialized roles.',
    },
  ];

  return (
    <section id="classes" className="py-20 bg-white border-b border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Our Syllabus
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mt-4">
            German Language Courses
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Aligned fully with the Common European Framework of Reference for Languages (CEFR) and Goethe standards.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
                    {course.level}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-1">{course.subtitle}</h3>
                
                {/* Price block */}
                <div className="my-4 py-3 border-y border-slate-200/60 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase">Standard Fee</span>
                  <span className="text-2xl font-black text-slate-900 font-display">
                    ₹{course.fee.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 min-h-[64px]">
                  {course.description}
                </p>

                {/* Outcomes */}
                <div className="space-y-1 mb-6">
                  <p className="text-[11px] text-slate-500 font-semibold flex items-center">
                    <span className="text-emerald-500 mr-1.5">✓</span>
                    {course.hours}
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold flex items-center">
                    <span className="text-emerald-500 mr-1.5">✓</span>
                    {course.outcome}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenEnquiry('German Language Course', course.level.split(' ')[0] as GermanLevelType)}
                className="w-full bg-[#1e1b4b] hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition duration-250 flex items-center justify-center space-x-1"
              >
                <span>Enquire {course.level.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Highlighted Complete Package Box */}
        <div className="relative bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-slate-950 rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl overflow-hidden border border-slate-800">
          
          {/* Accent flag corner decoration */}
          <div className="absolute top-0 right-0 h-1.5 w-32 flex">
            <span className="bg-neutral-900 flex-1" />
            <span className="bg-[#e11d48] flex-1" />
            <span className="bg-[#f59e0b] flex-1" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-1.5 bg-[#f59e0b]/20 text-[#f59e0b] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Special Fast-Track Bundle Offer</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                Complete A1–B2 Package
              </h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl font-normal">
                Join the complete A1–B2 German program for just ₹33,000 and save ₹6,000. One affordable package, flexible installments, and everything you need to achieve your German language goals.
              </p>
              
              {/* Features check lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>A1 to B2 Live German Language Classes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>Study Materials, Notes & Worksheets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>Class Recordings for Revision</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>Speaking Practice & Mock Test</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>Goethe & TELC Exam Preparation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[#f59e0b] font-bold">★</span>
                  <span>Expert Trainer Support Throughout the Course</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Action Button */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between text-center items-center backdrop-blur-md">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-mono font-bold">All-Inclusive Savings</span>
                
                {/* Saved comparison */}
                <div className="flex justify-center items-center space-x-4 mt-3 mb-2">
                  <div className="text-slate-400 line-through text-base font-semibold">
                    ₹39,000
                  </div>
                  <div className="bg-[#e11d48] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    Save ₹6,000
                  </div>
                </div>

                {/* Bundle pricing */}
                <div className="text-4xl md:text-5xl font-black text-[#f59e0b] font-display tracking-tight">
                  ₹33,000
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *No hidden costs. Covers all study modules
                </p>
              </div>

              {/* Package Action */}
              <button
                onClick={() => onOpenEnquiry('German Language Course', 'A1 to B2 Package')}
                className="w-full mt-6 bg-white hover:bg-slate-100 text-[#1e1b4b] font-black py-3.5 rounded-xl text-xs tracking-wider uppercase shadow-xl transition-all active:scale-[0.98]"
              >
                Enroll in Complete Package
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
