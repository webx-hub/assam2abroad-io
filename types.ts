/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { EnquiryType } from '../types';

interface OtherEnquiriesProps {
  onOpenEnquiry: (type: EnquiryType) => void;
}

export default function OtherEnquiries({ onOpenEnquiry }: OtherEnquiriesProps) {
  const pathways = [
    {
      id: 'ausbildung',
      title: 'Ausbildung',
      emoji: '🇩🇪',
      description: 'Earn a monthly stipend of €1,000+ while completing professional practical vocational training.',
    },
    {
      id: 'bachelors',
      title: "Bachelor's",
      emoji: '🎓',
      description: 'Study tuition-free in top-tier German Public Universities with world-renowned technical degrees.',
    },
    {
      id: 'masters',
      title: "Master's",
      emoji: '🎓',
      description: 'Secure advanced degrees in cutting-edge programs coupled with an 18-month job search visa.',
    },
    {
      id: 'opportunity-card',
      title: 'Opportunity Card',
      emoji: '💼',
      description: 'Relocate directly to Germany using the points-based Chancenkarte job-seeker system.',
    },
  ];

  return (
    <section id="pathways" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e11d48] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            German Gateways
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mt-4">
            Germany Pathways
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Choose your ideal gateway to move, study, or work in Germany. We handle the advisory process start to finish.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((path) => (
            <motion.div
              key={path.id}
              id={path.id}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col justify-between scroll-mt-24"
            >
              <div className="space-y-4">
                {/* Pathway Emoji Accent */}
                <div className="text-3xl bg-white border border-slate-100 shadow-sm rounded-xl w-12 h-12 flex items-center justify-center">
                  <span>{path.emoji}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {path.title}
                  </h3>
                  {/* Exactly 1-line description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal line-clamp-2">
                    {path.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenEnquiry(path.title.includes('Opportunity') ? 'Opportunity Card' : path.title as EnquiryType)}
                className="w-full mt-6 bg-slate-100 hover:bg-[#e11d48] text-slate-700 hover:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 flex items-center justify-center space-x-1 border border-slate-200/50 hover:border-red-500"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
