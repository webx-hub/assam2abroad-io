/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const loadingTexts = ['Learn German', 'Study in Germany', 'Build Your Future'];

  useEffect(() => {
    // Check if already loaded in this session
    const hasLoaded = sessionStorage.getItem('assam2abroad_loaded');
    if (hasLoaded === 'true') {
      onComplete();
      return;
    }

    // Progress counter (0 to 100 in 2.6 seconds)
    const duration = 2600;
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    // Text sequence timer (every ~850ms)
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 850);

    // Fade out and finish after 2.9 seconds
    const timeout = setTimeout(() => {
      setFadeOut(true);
      const finishTimeout = setTimeout(() => {
        sessionStorage.setItem('assam2abroad_loaded', 'true');
        onComplete();
      }, 400); // fade out duration
      return () => clearTimeout(finishTimeout);
    }, 2900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  // If already loaded, we won't render anything while waiting for trigger
  const hasLoadedBefore = sessionStorage.getItem('assam2abroad_loaded') === 'true';
  if (hasLoadedBefore) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-sleek-navy-dark text-white transition-opacity duration-500 ease-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,35,55,0.7)_0%,rgba(10,15,30,1)_80%)]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        
        {/* Airplane Travel Path (Subtle Arch) */}
        <div className="relative w-64 h-24 mb-6 flex items-center justify-center overflow-hidden">
          {/* Animated Wave representing German Flag (Black, Red, Gold) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 opacity-80">
            <span className="w-4 h-4 rounded-full bg-neutral-900 animate-ping" style={{ animationDuration: '2s' }} />
            <span className="w-4 h-4 rounded-full bg-sleek-red animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <span className="w-4 h-4 rounded-full bg-sleek-yellow animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
          </div>

          {/* Dotted Arch Line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 96" fill="none">
            <path
              d="M10 80 Q128 -20 246 80"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Smooth flying Airplane */}
          <div
            className="absolute left-0 bottom-0 text-sleek-yellow"
            style={{
              transform: `translate(${progress * 2.3}px, ${-Math.sin((progress / 100) * Math.PI) * 70}px) rotate(${45 - (progress / 100) * 90}deg)`,
              transition: 'transform 30ms linear',
            }}
          >
            <svg
              className="w-8 h-8 fill-current drop-shadow-[0_0_8px_rgba(244,196,48,0.6)]"
              viewBox="0 0 24 24"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z" />
            </svg>
          </div>

          {/* Map of Germany Silhouette or stylized emblem in the center */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-25">
            <svg className="w-16 h-16 text-slate-400 fill-current" viewBox="0 0 100 100">
              {/* Simplified Germany Outline SVG */}
              <path d="M40,15 L55,15 L62,22 L72,25 L75,32 L68,45 L74,55 L70,68 L58,82 L52,85 L42,80 L35,82 L28,75 L25,65 L32,55 L28,45 L34,35 L32,25 L40,15 Z" />
            </svg>
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
          Assam<span className="text-sleek-yellow">2</span>Abroad
        </h1>
        <p className="font-sans text-sm tracking-widest text-slate-400 uppercase font-medium mb-8">
          Dream <span className="text-sleek-red">|</span> Learn <span className="text-sleek-yellow">|</span> Succeed
        </p>

        {/* Text Sequence Animation */}
        <div className="h-8 mb-6 overflow-hidden relative w-full flex items-center justify-center">
          <div
            className="flex flex-col transition-transform duration-500 ease-in-out items-center justify-center"
            style={{ transform: `translateY(-${textIndex * 32}px)` }}
          >
            {loadingTexts.map((text, idx) => (
              <span
                key={idx}
                className={`h-8 leading-8 text-lg font-semibold tracking-wide block transition-colors duration-300 ${
                  idx === textIndex ? 'text-sleek-yellow' : 'text-slate-600'
                }`}
              >
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Elegant Progress Bar using German Flag Colors */}
        <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden mb-3 p-[1px] border border-slate-800">
          <div className="h-full rounded-full flex overflow-hidden">
            {/* Split progress bar into Black, Red, Yellow segments dynamically */}
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${Math.min(progress, 33.33)}%` }}
            />
            <div
              className="h-full bg-sleek-red transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(progress - 33.33, 33.33))}%` }}
            />
            <div
              className="h-full bg-sleek-yellow transition-all duration-300 animate-pulse"
              style={{ width: `${Math.max(0, Math.min(progress - 66.66, 33.34))}%` }}
            />
          </div>
        </div>

        {/* Percentage Counter and Status Indicator */}
        <div className="flex justify-between items-center w-64 text-xs font-mono text-slate-400">
          <span className="animate-pulse">Preparing Your Germany Journey...</span>
          <span className="text-white font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
