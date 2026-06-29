/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Users, GraduationCap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutUs() {
  const stats = [
    {
      value: '500+',
      label: 'Students Trained',
      description: 'Guiding aspirants from Northeast India to International students attain Goethe and TELC proficiency.',
      icon: Users,
      color: 'from-rose-500 to-red-600',
    },
    {
      value: '95%',
      label: 'Student Satisfaction',
      description: 'Excellent reviews in learning speed, mentorship, and support.',
      icon: Award,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      value: 'A1–B2',
      label: 'German Training',
      description: 'Complete CEFR curriculum taught by industry-leading instructors.',
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      value: 'Germany Guidance',
      label: 'Support & Advisory',
      description: 'End-to-end processing for university placements & vocational programs.',
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Milestones
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mt-4">
            Our Success
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Delivering high-quality language standards and trusted counseling outcomes to help you reach Germany seamlessly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Metric Icon with dynamic backdrop */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  {/* Huge bold number/metric */}
                  <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-display">
                    {stat.value}
                  </div>
                  {/* Metric Label */}
                  <div className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* description line */}
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-4 pt-4 border-t border-slate-100">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
