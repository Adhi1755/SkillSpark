'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Upload, Zap, LayoutDashboard } from 'lucide-react';
import { gsap } from 'gsap';
import SpotlightCard from '../components/Card'; // adjust path if needed

export default function DashboardPage() {
  const options = [
    { icon: Zap, title: 'Practice Aptitude & Technical', description: 'Sharpen your skills with aptitude and technical interview practice questions.', buttonText: 'Start Practicing', href: '/Aplitude' },
    { icon: Upload, title: 'Upload PDF & Ask', description: 'Upload your study PDFs and ask any questions. Get instant AI-powered answers.', buttonText: 'Upload PDF', href: '/PdfRAg' },
    { icon: BookOpen, title: 'Generate Flashcards & Quizzes', description: 'Upload a document or type a prompt to instantly generate AI-powered flashcards and quizzes.', buttonText: 'Start Generating', href: '/quizes' },
  ];

  // ===== Refs
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const blobRefs = useRef<HTMLDivElement[]>([]);
  blobRefs.current = [];
  const cardRefs = useRef<HTMLDivElement[]>([]);
  cardRefs.current = [];
  const heroRefs = useRef<HTMLElement[]>([]); // 👈 title + subtitle
  heroRefs.current = [];

  const addBlobRef = (el: HTMLDivElement | null) => {
    if (el && !blobRefs.current.includes(el)) blobRefs.current.push(el);
  };
  const addCardRef = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const addHeroRef = (el: HTMLElement | null) => {
    if (el && !heroRefs.current.includes(el)) heroRefs.current.push(el);
  };

  // Prevent double-run in React 18 dev
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial states
      gsap.set(blobRefs.current, { opacity: 0, scale: 0.95 });
      gsap.set(heroRefs.current, { y: 16, opacity: 0 });               // 👈 text start
      gsap.set(cardRefs.current, { y: 24, rotateX: -6, opacity: 0, transformOrigin: '50% 100%' });
      if (pillRef.current) gsap.set(pillRef.current, { y: 12, opacity: 0 });

      // Animate in
      tl.to(blobRefs.current, { opacity: 0.3, scale: 1, duration: 0.8, stagger: 0.08 }, 0);
      tl.to(heroRefs.current, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.1); // 👈 text animates
      tl.to(cardRefs.current, { y: 0, rotateX: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.25);
      if (pillRef.current) tl.to(pillRef.current, { y: 0, opacity: 1, duration: 0.5 }, 0.35);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Hover lift for cards
  useEffect(() => {
    if (!cardRefs.current.length) return;
    const offs: Array<() => void> = [];

    cardRefs.current.forEach((card) => {
      const onEnter = () =>
        gsap.to(card, { y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', duration: 0.25, ease: 'power2.out' });
      const onLeave = () =>
        gsap.to(card, { y: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.06)', duration: 0.25, ease: 'power2.out' });
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      offs.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => offs.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-[Poppins] text-gray-900"
    >
      {/* 🔵 Glowing blobs */}
      <div ref={addBlobRef} className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div ref={addBlobRef} className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div ref={addBlobRef} className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* Top-right Dashboard Icon */}
      <div className="fixed top-4 right-4 z-20">
        <Link
          href="/profile"
          className="group inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-4 py-2 shadow-md hover:bg-white hover:shadow-lg transition"
          aria-label="Open dashboard"
        >
          <LayoutDashboard className="h-5 w-5 text-gray-800" />
          <span className="text-sm font-semibold text-gray-900">Dashboard</span>
        </Link>
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            ref={addHeroRef} // 👈 animate this
            className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SkillSpark
            </span>
          </h1>
          <p
            ref={addHeroRef} // 👈 and this
            className="text-lg text-gray-700 max-w-2xl mx-auto"
          >
            Choose how you’d like to supercharge your learning today.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map(({ icon: Icon, title, description, buttonText, href }) => (
            <div key={title} ref={addCardRef}>
              <SpotlightCard
                className="custom-spotlight-card flex flex-col justify-between h-full rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-8 shadow-lg transition-all hover:shadow-2xl will-change-transform"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <div className="flex justify-center mb-6">
                  <Icon className="w-12 h-12 text-gray-900" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-center mb-3">{title}</h3>
                <p className="text-gray-700 text-center leading-relaxed mb-8 flex-grow">{description}</p>
                <Link
                  href={href}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors" />
                  <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span>{buttonText}</span>
                </Link>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {/* Bottom pill */}
        <div ref={pillRef} className="text-center mt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-6 py-3 shadow-md">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-800">AI-Powered Learning Assistant Active</span>
          </div>
        </div>
      </div>

      {/* CSS helpers */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(20px,-50px) scale(1.1); }
          50% { transform: translate(-20px,20px) scale(0.9); }
          75% { transform: translate(50px,50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
