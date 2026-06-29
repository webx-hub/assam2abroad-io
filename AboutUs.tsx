/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Coins, CalendarRange, CreditCard, Sparkles } from 'lucide-react';

export default function PaymentPlan() {
  const installments = [
    {
      step: '1st Installment',
      amount: 9000,
      due: 'At the time of admission',
      details: 'Secures your seats, curriculum materials, and live zoom portal credentials.',
      color: 'from-sleek-yellow to-amber-500',
      textColor: 'text-slate-900',
    },
    {
      step: '2nd Installment',
      amount: 8000,
      due: 'After 1 month',
      details: 'Covers mid-level worksheets, interactive vocabulary pools, and live speaking practice.',
      color: 'from-sleek-navy to-sleek-navy-dark',
      textColor: 'text-white',
    },
    {
      step: '3rd Installment',
      amount: 8000,
      due: 'After 2 months',
      details: 'Unlocks intermediate mock-tests, speaking labs, and intensive vocabulary sessions.',
      color: 'from-sleek-navy to-sleek-navy-dark',
      textColor: 'text-white',
    },
    {
      step: '4th Installment',
      amount: 8000,
      due: 'After 3 months',
      details: 'Includes Germany consultancy sessions, resume building, and placement coordination.',
      color: 'from-sleek-navy to-sleek-navy-dark',
      textColor: 'text-white',
    },
  ];

  return (
    <section className="py-20 bg-sleek-navy text-white relative overflow-hidden border-b border-white/10">
      {/* Background blur decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sleek-yellow/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1 bg-white/5 border border-white/5 text-slate-200 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Coins className="w-3.5 h-3.5 text-sleek-yellow" />
            <span>Budget-Friendly Learning</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            Easy 4 Monthly Installments
          </h2>
          <p className="text-slate-300 mt-3 text-sm md:text-base leading-relaxed">
            No massive upfront commitments. Pay progressively as you progress through each phase of your language training with Assam2Abroad.
          </p>
        </div>

        {/* Horizontal/Vertical Connector Timeline layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector line for large screens */}
          <div className="hidden lg:block absolute top-[44px] left-10 right-10 h-0.5 bg-white/10 z-0" />

          {installments.map((inst, idx) => (
            <div
              key={inst.step}
              className="relative z-10 bg-sleek-navy-dark/80 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-white/20 transition duration-300 group"
            >
              {/* Header: Bullet and Number */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${inst.color} flex items-center justify-center font-display font-black text-xs ${inst.textColor} shadow`}>
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                    Installment step
                  </span>
                </div>

                {/* Amount */}
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{inst.step}</h3>
                <div className="text-3xl font-black font-display text-white mt-1.5 mb-2 group-hover:text-sleek-yellow transition">
                  ₹{inst.amount.toLocaleString('en-IN')}
                </div>

                {/* Due Date Indicator */}
                <div className="flex items-center space-x-1.5 text-xs text-sleek-yellow/90 font-semibold mb-3">
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>{inst.due}</span>
                </div>

                <p className="text-slate-350 text-xs leading-relaxed">
                  {inst.details}
                </p>
              </div>

              {/* Installment Badge Footer */}
              <div className="mt-6 pt-3 border-t border-white/5 text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-between">
                <span>Payment Plan</span>
                <span>Active 2026</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card Highlight */}
        <div className="mt-12 max-w-xl mx-auto bg-sleek-navy-dark border border-white/10 rounded-2xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2.5 bg-sleek-yellow/10 rounded-xl text-sleek-yellow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Complete Package Summed</h4>
              <p className="text-xs text-slate-500">All 4 installments combined</p>
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-slate-400 text-xs">Total package fee:</span>
            <span className="text-2xl font-black text-sleek-yellow font-display">₹33,000</span>
          </div>
        </div>

      </div>
    </section>
  );
}
