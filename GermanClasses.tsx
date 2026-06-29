/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GermanClasses from './components/GermanClasses';
import PaymentPlan from './components/PaymentPlan';
import CourseFeatures from './components/CourseFeatures';
import OtherEnquiries from './components/OtherEnquiries';
import HowItWorks from './components/HowItWorks';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import EnquiryModal from './components/EnquiryModal';
import AdminDashboard from './components/AdminDashboard';
import { EnquiryType, GermanLevelType } from './types';

// Subtle, high-performance scroll reveal animation wrapper
function ScrollAnimatedSection({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.21, 1.02, 0.43, 1.01] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiryType, setSelectedEnquiryType] = useState<EnquiryType>('General Enquiry');
  const [selectedGermanLevel, setSelectedGermanLevel] = useState<GermanLevelType>('None');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const isAdminRoute = currentPath === '/admin-login' || currentPath === '/admin-dashboard' || currentPath === '/admin';

  // Trigger modal launch with clean context
  const handleOpenEnquiryModal = (
    type: EnquiryType = 'General Enquiry',
    level: GermanLevelType = 'None'
  ) => {
    setSelectedEnquiryType(type);
    setSelectedGermanLevel(level);
    setIsModalOpen(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // One-time popup after 5 seconds of loading the website
  useEffect(() => {
    if (isAdminRoute) return;
    if (!isLoading) {
      const hasAutoTriggered = sessionStorage.getItem('assam2abroad_popup_auto_triggered');
      if (hasAutoTriggered !== 'true') {
        const timer = setTimeout(() => {
          handleOpenEnquiryModal('General Enquiry', 'None');
          sessionStorage.setItem('assam2abroad_popup_auto_triggered', 'true');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isAdminRoute]);

  // WhatsApp click handler for floating bubble
  const handleFloatingWhatsAppClick = () => {
    const targetWhatsApp = '+919362603585';
    const message = encodeURIComponent(
      'Hello Assam2Abroad, I would like to learn German and explore career pathways (Ausbildung/Degrees) in Germany. Please guide me.'
    );
    window.open(`https://wa.me/${targetWhatsApp.replace('+', '')}?text=${message}`, '_blank');
  };

  if (isAdminRoute) {
    return <AdminDashboard currentPath={currentPath} onNavigate={handleNavigate} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 no-scrollbar">
      
      {/* 1. Loading Screen Session check */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Conditionally render content after load */}
      <div className={`flex flex-col flex-1 transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* 2. Top Header Navigation */}
        <Navbar onOpenEnquiry={handleOpenEnquiryModal} />

        {/* 3. Hero Section Area */}
        <ScrollAnimatedSection>
          <Hero onOpenEnquiry={handleOpenEnquiryModal} />
        </ScrollAnimatedSection>

        {/* 4. German Classes Section */}
        <ScrollAnimatedSection>
          <GermanClasses onOpenEnquiry={handleOpenEnquiryModal} />
        </ScrollAnimatedSection>

        {/* 5. Payment Plan installment board */}
        <ScrollAnimatedSection>
          <PaymentPlan />
        </ScrollAnimatedSection>

        {/* 6. Course Features checklist */}
        <ScrollAnimatedSection>
          <CourseFeatures />
        </ScrollAnimatedSection>

        {/* 7. Other Enquiries (Ausbildung, Bachelor's, Master's, Opportunity Card) */}
        <ScrollAnimatedSection>
          <OtherEnquiries onOpenEnquiry={handleOpenEnquiryModal} />
        </ScrollAnimatedSection>

        {/* 8. How It Works Pipeline */}
        <ScrollAnimatedSection>
          <HowItWorks />
        </ScrollAnimatedSection>

        {/* 9. About Assam2Abroad Block */}
        <ScrollAnimatedSection>
          <AboutUs />
        </ScrollAnimatedSection>

        {/* 10. Student Testimonials */}
        <ScrollAnimatedSection>
          <Testimonials />
        </ScrollAnimatedSection>

        {/* 11. FAQ Accordion Grid */}
        <ScrollAnimatedSection>
          <FAQ />
        </ScrollAnimatedSection>

        {/* 12. Contact Form, Offices, and Maps connection */}
        <ScrollAnimatedSection>
          <ContactSection onOpenEnquiry={handleOpenEnquiryModal} />
        </ScrollAnimatedSection>

        {/* 9. Footer navigation and copyright details */}
        <Footer onOpenEnquiry={handleOpenEnquiryModal} />

        {/* 10. Global Popup Enquiry Form system */}
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialEnquiryType={selectedEnquiryType}
          initialGermanLevel={selectedGermanLevel}
        />

        {/* 11. Floating WhatsApp Floating CTA Button */}
        <button
          onClick={handleFloatingWhatsAppClick}
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 group flex items-center justify-center border border-emerald-400 hidden sm:flex"
          aria-label="WhatsApp Chat Support"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 font-sans whitespace-nowrap">
            WhatsApp
          </span>
        </button>

        {/* 12. Mobile Sticky Bottom Navigation row */}
        <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 bg-slate-900 border-t border-slate-800 p-2 gap-2 sm:hidden">
          {/* Dialer Call Now */}
          <a
            href="tel:+919362603585"
            className="bg-slate-800 hover:bg-slate-800/85 border border-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase active:scale-[0.98] transition hover:text-[#f59e0b]"
          >
            <Phone className="w-4 h-4 text-[#f59e0b]" />
            <span>Call Now</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <button
            onClick={handleFloatingWhatsAppClick}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black py-3 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase active:scale-[0.98] transition"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>WhatsApp Us</span>
          </button>
        </div>

        {/* Padding offset for mobile displays */}
        <div className="h-16 sm:hidden bg-slate-950" />

      </div>
    </div>
  );
}
