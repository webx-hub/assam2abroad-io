/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EnquiryFormData, EnquiryType, GermanLevelType } from '../types';
import { addEnquiryToDb } from '../firebase';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEnquiryType?: EnquiryType;
  initialGermanLevel?: GermanLevelType;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  initialEnquiryType = 'General Enquiry',
  initialGermanLevel = 'None',
}: EnquiryModalProps) {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    country: '',
    enquiryType: 'General Enquiry',
    germanLevel: 'None',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasCourseEnquiry, setWasCourseEnquiry] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Auto-close success state after 4 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitted) {
      timer = setTimeout(() => {
        onClose();
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [submitted, onClose]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        country: '',
        enquiryType: initialEnquiryType,
        germanLevel: initialGermanLevel,
        message: '',
      });
      setErrors({});
      setSubmitted(false);
      setSubmissionError('');
      setWasCourseEnquiry(false);
      // Disable background scrolling when open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialEnquiryType, initialGermanLevel]);

  // Remove direct null return to allow exit transitions via AnimatePresence

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EnquiryFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset level if type is not language course
      ...(name === 'enquiryType' && value !== 'German Language Course'
        ? { germanLevel: 'None' }
        : {}),
      // Auto set level if language course is picked and level is None
      ...(name === 'enquiryType' && value === 'German Language Course' && prev.germanLevel === 'None'
        ? { germanLevel: 'A1' }
        : {}),
    }));

    if (errors[name as keyof EnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError('');

    const interestedProgram =
      formData.enquiryType === 'German Language Course' && formData.germanLevel !== 'None'
        ? `${formData.enquiryType} (${formData.germanLevel})`
        : formData.enquiryType;

    const isCourse = formData.enquiryType === 'German Language Course';
    setWasCourseEnquiry(isCourse);

    let category = 'general';
    if (formData.enquiryType === 'Ausbildung') {
      category = 'ausbildung';
    } else if (formData.enquiryType === 'Bachelor’s') {
      category = 'bachelors';
    } else if (formData.enquiryType === 'Master’s') {
      category = 'masters';
    } else if (formData.enquiryType === 'Opportunity Card') {
      category = 'opportunity_card';
    } else if (formData.enquiryType === 'German Language Course') {
      if (formData.germanLevel === 'A1') category = 'a1';
      else if (formData.germanLevel === 'A2') category = 'a2';
      else if (formData.germanLevel === 'B1') category = 'b1';
      else if (formData.germanLevel === 'B2') category = 'b2';
      else if (formData.germanLevel === 'A1 to B1 Package') category = 'a1_b1_package';
      else if (formData.germanLevel === 'A1 to B2 Package') category = 'package';
      else category = 'package';
    }

    const startTime = Date.now();

    try {
      // Save to Firestore
      const res = await addEnquiryToDb({
        fullName: formData.fullName.trim(),
        emailAddress: formData.emailAddress.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        country: formData.country.trim(),
        interestedProgram: interestedProgram,
        category: category,
        message: formData.message.trim() || 'No custom message.'
      });

      if (!res.success) {
        throw res.error || new Error('Database save failed');
      }

      // Guarantee smooth loading feedback for at least 1.5 seconds
      const elapsed = Date.now() - startTime;
      const minDuration = 1500;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      setIsSubmitting(false);
      setSubmitted(true);

      // Clear all form fields on success
      setFormData({
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        country: '',
        enquiryType: 'General Enquiry',
        germanLevel: 'None',
        message: '',
      });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setSubmissionError('Something went wrong. Please try again in a few moments.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay with smooth dim fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Card with crisp spring entry & exit scale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] z-10"
          >
            {submitted ? (
              /* GORGEOUS PREMIUM SUCCESS SCREEN */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-10 text-center flex flex-col items-center justify-center my-auto min-h-[400px] relative overflow-hidden"
              >
                {/* Header decoration inspired by Germany colors */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex w-full">
                  <div className="bg-neutral-900 flex-1" />
                  <div className="bg-sleek-red flex-1" />
                  <div className="bg-sleek-yellow flex-1" />
                </div>

                {/* Soft ambient glow behind checkmark */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-emerald-500/[0.08] rounded-full blur-2xl pointer-events-none" />

                {/* Green circular success icon with animated checkmark */}
                <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        d="M20 6L9 17L4 12"
                      />
                    </svg>
                  </div>
                </div>

                <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 leading-tight">
                  Enquiry Submitted Successfully
                </h4>
                
                <p className="text-slate-500 text-sm max-w-sm mt-3.5 leading-relaxed font-medium">
                  Thank you for contacting Assam2Abroad. Our team will review your details and contact you shortly.
                </p>

                {/* Success action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-8 relative z-10">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-sm"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (!wasCourseEnquiry) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex-1 bg-sleek-navy hover:bg-sleek-navy-light text-white font-bold py-3 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-sm"
                  >
                    {wasCourseEnquiry ? 'Continue Browsing' : 'Go Back to Home'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Header decoration inspired by Germany colors */}
                <div className="h-1.5 flex w-full">
                  <div className="bg-neutral-900 flex-1" />
                  <div className="bg-sleek-red flex-1" />
                  <div className="bg-sleek-yellow flex-1" />
                </div>

                {/* Modal Header */}
                <div className="flex justify-between items-start px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="pr-4">
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      Get Complete Support
                    </h3>
                    <p className="text-xs text-slate-600 font-sans mt-1.5 leading-relaxed font-medium">
                      (Get expert guidance for Ausbildung, studying, working, and building a successful career in Germany)
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 active:scale-90 transition duration-150 shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 no-scrollbar">
                  {submissionError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold">
                      {submissionError}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g., Jitu Saikia"
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-sleek-navy/15 focus:border-sleek-navy'
                      } focus:outline-none focus:ring-4 transition text-sm text-slate-950 bg-slate-50/50`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Grid: Mobile and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mobile */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="e.g., +91 93626 03585"
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.mobileNumber ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-sleek-navy/15 focus:border-sleek-navy'
                        } focus:outline-none focus:ring-4 transition text-sm text-slate-950 bg-slate-50/50`}
                      />
                      {errors.mobileNumber && <p className="text-xs text-red-500 mt-1 font-medium">{errors.mobileNumber}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="e.g., student@gmail.com"
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.emailAddress ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-sleek-navy/15 focus:border-sleek-navy'
                        } focus:outline-none focus:ring-4 transition text-sm text-slate-950 bg-slate-50/50`}
                      />
                      {errors.emailAddress && <p className="text-xs text-red-500 mt-1 font-medium">{errors.emailAddress}</p>}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      COUNTRY <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., India"
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.country ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-sleek-navy/15 focus:border-sleek-navy'
                      } focus:outline-none focus:ring-4 transition text-sm text-slate-950 bg-slate-50/50`}
                    />
                    {errors.country && <p className="text-xs text-red-500 mt-1 font-medium">{errors.country}</p>}
                  </div>

                  {/* Enquiry Type Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Enquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sleek-navy/15 focus:border-sleek-navy transition text-sm text-slate-950 bg-slate-50/50"
                    >
                      <option value="German Language Course">German Language Course (A1 to B2)</option>
                      <option value="Ausbildung">Ausbildung in Germany (Vocational)</option>
                      <option value="Bachelor’s">Bachelor’s in Germany</option>
                      <option value="Master’s">Master’s in Germany</option>
                      <option value="Opportunity Card">Opportunity Card / Chancenkarte</option>
                      <option value="General Enquiry">General Study Abroad Enquiry</option>
                    </select>
                  </div>

                  {/* German Level Selector (conditional) */}
                  {formData.enquiryType === 'German Language Course' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Target German Level
                      </label>
                      <select
                        name="germanLevel"
                        value={formData.germanLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sleek-navy/15 focus:border-sleek-navy transition text-sm text-slate-950 bg-slate-50/50"
                      >
                        <option value="A1">A1 Level (Beginner - ₹6,000)</option>
                        <option value="A2">A2 Level (Elementary - ₹8,000)</option>
                        <option value="B1">B1 Level (Intermediate - ₹11,000)</option>
                        <option value="B2">B2 Level (Upper-Intermediate - ₹14,000)</option>
                        <option value="A1 to B1 Package">Complete Package A1 to B1 (Special Offer - ₹21,000)</option>
                        <option value="A1 to B2 Package">Complete Package A1 to B2 (Best Offer - ₹33,000)</option>
                      </select>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ask about intake sessions, eligibility, job possibilities, or timeline..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sleek-navy/15 focus:border-sleek-navy transition text-sm text-slate-950 bg-slate-50/50"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-sleek-navy hover:bg-sleek-navy-light text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2 border border-transparent hover:border-white/10 hover:text-sleek-yellow"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-sleek-yellow" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                    Our educational experts will securely receive your enquiry and coordinate your profiling session.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
