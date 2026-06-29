/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Target, GraduationCap, Briefcase, Video, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function CourseFeatures() {
  const choices = [
    {
      title: 'German Courses A1–B2',
      description: 'Structured, beginner-to-professional level training following international standards.',
      icon: BookOpen,
      color: 'text-[#e11d48] bg-red-50 border-red-100',
      emoji: '📚',
    },
    {
      title: 'Goethe & TELC Exam Preparation',
      description: 'Comprehensive preparation with mock tests, speaking practice, regular assessments, and expert guidance for Goethe and TELC examinations.',
      icon: Target,
      color: 'text-amber-600 bg-amber-50 border-amber-150',
      emoji: '🎯',
    },
    {
      title: 'Study in Germany Guidance',
      description: 'End-to-end consulting for admission to prestigious tuition-free public universities.',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      emoji: '🎓',
    },
    {
      title: 'Ausbildung Support',
      description: 'Complete vocational training contracts, documents prep, and stipend program support.',
      icon: Briefcase,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      emoji: '💼',
    },
    {
      title: 'Recorded Classes',
      description: 'Lifetime portal access to recorded webinars so you never miss a lecture or conversation practice.',
      icon: Video,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      emoji: '📹',
    },
    {
      title: 'Personal Mentorship',
      description: 'Small customized batch sizes ensuring direct daily attention and individual speaking feedback.',
      icon: Users,
      color: 'text-[#1e1b4b] bg-slate-100 border-slate-200',
      emoji: '👨‍🏫',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Our Pillars
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mt-4">
            Why Students Choose Assam2Abroad
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Your single platform for complete language learning, university admissions, and career placement in Germany.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {choices.map((choice, idx) => (
            <motion.div
              key={choice.title}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 group flex items-start space-x-4"
            >
              {/* Feature Icon Container */}
              <div className={`p-3.5 rounded-xl border ${choice.color} shrink-0 text-xl flex items-center justify-center h-12 w-12`}>
                <span>{choice.emoji}</span>
              </div>

              {/* Text Content */}
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
                  {choice.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                  {choice.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
