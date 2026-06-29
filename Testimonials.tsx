/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is Ausbildung in Germany?',
      answer: 'Ausbildung is a highly popular dual vocational training program in Germany. It combines classroom lectures at a professional school (Berufsschule) with practical on-the-job training at a German company. The best part is that it is 100% tuition-free, and you receive a monthly stipend (typically €1,000 to €1,400) to support your living costs.',
    },
    {
      question: 'Do I need German language skills for Ausbildung?',
      answer: 'Yes. Since you will be working with German employees, studying in German schools, and handling German materials, a minimum of B1 level (and ideally B2 level) German language skill is mandatory. We train you from A1 to B2 specifically to ensure you clear these requirements.',
    },
    {
      question: 'What is the fee for A1 to B2 German course?',
      answer: 'Individual levels have distinct fees: A1 is ₹6,000, A2 is ₹8,000, B1 is ₹11,000, and B2 is ₹14,000. However, we highly recommend our "Complete Package A1 to B2" which costs only ₹33,000 (saving you ₹6,000 compared to individual levels).',
    },
    {
      question: 'Are recorded classes available?',
      answer: 'Absolutely. We understand that students and working professionals have busy schedules. All our live lectures are recorded and uploaded to your personal student folder, giving you lifetime access to review or catch up on any missed material.',
    },
    {
      question: 'Can I pay the course fee in installments?',
      answer: 'Yes! We offer a very flexible 4-month installment plan for our Complete Package. You pay ₹9,000 at the time of admission, and ₹8,000 each for the next three consecutive months. There are zero hidden charges or interest fees.',
    },
    {
      question: 'Can you help with Bachelor’s and Master’s admissions in Germany?',
      answer: 'Yes, we provide end-to-end consulting for both Bachelor’s and Master’s programs. This includes public university shortlisting (where tuition is completely free), application review, Statement of Purpose (SOP) drafting guidance, blocked account setup assistance, and visa preparation.',
    },
    {
      question: 'What is the Opportunity Card?',
      answer: 'The Opportunity Card (Chancenkarte) is a modern points-based job seeker visa launched by Germany. It allows qualified professionals to move to Germany for up to 1 year to find a job without needing an initial employment contract. It requires a minimum score of 6 points based on qualifications, age, language skills (German A2 or English B2), and experience.',
    },
    {
      question: 'How can I contact Assam2Abroad?',
      answer: 'You can call or WhatsApp our official numbers: +49 1521 5262381 (Germany Office) or +91 9362603585 (Admissions). You can also email us at assam2abroad@gmail.com or fill out our enquiry forms to get a fast callback.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-1 bg-red-50 border border-red-100 text-sleek-red px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-sleek-red" />
            <span>Answers to your Doubts</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            Need clarifications about your German pathway? Find instant explanations to common student concerns here.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-200"
              >
                {/* Accordion Trigger Head */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-slate-100/50 transition focus:outline-none"
                >
                  <span className="font-semibold text-slate-900 text-sm md:text-base pr-4">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-sleek-red" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {/* Accordion Body Panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-slate-200/60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 py-4.5 text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
