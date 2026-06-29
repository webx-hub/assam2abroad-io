/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, MessageCircle, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: '1',
      name: 'Rahul Borah',
      location: 'Guwahati, Assam',
      program: 'German A1-B1 + Ausbildung Prep',
      reviewText: 'Passed my B1 exam in first attempt. The mock practice worksheets were extremely helpful, and Assam2Abroad assisted with my Ausbildung resume structure. Highly recommended!',
      rating: 5,
      initials: 'RB',
      bgColor: 'bg-sleek-navy',
    },
    {
      id: '2',
      name: 'Priyakshi Sarma',
      location: 'Dibrugarh, Assam',
      program: 'German B2 Complete Package',
      reviewText: 'Live classes are highly interactive. The recorded videos helped me catch up on classes I missed. Best institute for German language in Northeast India without a doubt.',
      rating: 5,
      initials: 'PS',
      bgColor: 'bg-sleek-red',
    },
    {
      id: '3',
      name: 'Kunal Deka',
      location: 'Jorhat, Assam',
      program: 'Master’s Admission Consulting',
      reviewText: 'Got full guidance on shortlisting public universities for my Master’s. The course fee is highly affordable with easy monthly installment options. Very transparent!',
      rating: 5,
      initials: 'KD',
      bgColor: 'bg-sleek-navy-light',
    },
    {
      id: '4',
      name: 'Ananya Barua',
      location: 'Tezpur, Assam',
      program: 'German A2 + Opportunity Card Prep',
      reviewText: 'Extremely professional counseling. They analyzed my points matrix for Germany’s Chancenkarte perfectly and trained me up to A2 level. They handle everything smoothly.',
      rating: 5,
      initials: 'AB',
      bgColor: 'bg-slate-800',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 bg-red-50 border border-red-100 text-sleek-red px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5 text-sleek-red" />
            <span>Student Success Records</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Join hundreds of students learning German online from the comfort of their homes. Discover how Assam2Abroad helps learners worldwide achieve their language goals, prepare for Goethe & TELC exams, and build successful study and career pathways in Germany.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Quote Decorative Icon */}
              <div className="absolute top-4 right-4 text-slate-100 pointer-events-none">
                <Quote className="w-8 h-8 rotate-180 fill-current" />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-sleek-yellow fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 font-normal italic">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Student Metadata */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                {/* Initial Avatar */}
                <div className={`w-9 h-9 rounded-xl ${rev.bgColor} text-white flex items-center justify-center font-bold text-xs shadow-sm font-display`}>
                  {rev.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    {rev.program}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {rev.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
