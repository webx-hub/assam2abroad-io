/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClipboardCheck, UserCheck, Award, Flame, Plane } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Submit Your Enquiry',
      desc: 'Fill out our modern online enquiry form or tap our floating WhatsApp widgets. Select your preferred course or consult track.',
      icon: ClipboardCheck,
      color: 'bg-neutral-900 border-neutral-900',
      iconColor: 'text-sleek-yellow',
    },
    {
      num: '02',
      title: 'Get Free Consultation',
      desc: 'Our experienced counselors schedule a detailed 1-on-1 audio/video consultation. We map out your qualifications, timelines, and budgets.',
      icon: UserCheck,
      color: 'bg-sleek-red border-sleek-red',
      iconColor: 'text-white',
    },
    {
      num: '03',
      title: 'Choose Your Program',
      desc: 'Enroll in our structured German Language Classes (A1-B2) or sign up for direct university/Ausbildung placement assistance.',
      icon: Award,
      color: 'bg-sleek-yellow border-sleek-yellow',
      iconColor: 'text-slate-950',
    },
    {
      num: '04',
      title: 'Start Your Germany Journey',
      desc: 'Learn, excel in assessments, compile your documents, receive your visa stamp, and confidently board your flight to Germany!',
      icon: Plane,
      color: 'bg-sleek-navy border-sleek-navy',
      iconColor: 'text-white',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex text-xs font-mono font-bold uppercase tracking-widest text-sleek-red bg-red-50 border border-red-100 px-3 py-1 rounded-full">Structured Path</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight mt-4">
            Your Germany Journey in 4 Simple Steps
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Going abroad can be overwhelming. We break down the complex process into simple milestones to ensure you reach Germany smoothly.
          </p>
        </div>

        {/* Timeline Line Connector Wrapper */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical/Horizontal Connector Line */}
          <div className="absolute top-12 bottom-12 left-6 md:left-1/2 w-0.5 bg-slate-200 -translate-x-1/2 hidden md:block" />

          {/* Steps list */}
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={step.num}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Text card box */}
                  <div className="w-full md:w-[45%] bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
                      STEP {step.num}
                    </span>
                    <h3 className="text-lg font-bold font-display text-slate-900 mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Icon Timeline Bubble */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center shrink-0 z-10">
                    <div className={`w-12 h-12 rounded-full ${step.color} border-4 border-white flex items-center justify-center shadow-lg`}>
                      <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                  </div>

                  {/* Empty Spacer column for desktop symmetry */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
