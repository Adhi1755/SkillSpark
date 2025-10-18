'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function EduMateLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // ===== Refs for GSAP scoping =====
  const rootRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const inputsRef = useRef<HTMLFormElement | null>(null);
  const socialRef = useRef<HTMLDivElement | null>(null);
  const headerPillRef = useRef<HTMLDivElement | null>(null);
  const blobsRef = useRef<HTMLDivElement | null>(null); // wrapper over glow blobs

  const prefersReduced = useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) || false,
    []
  );

  // ===== Initial page entrance =====
  useLayoutEffect(() => {
    if (!rootRef.current || prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Glow blobs (soft pop-in)
      tl.fromTo(
        '[data-blob]',
        { opacity: 0, scale: 0.9 },
        { opacity: 0.3, scale: 1, duration: 0.8, stagger: 0.08 },
        0
      );

      // Left brand column
      if (leftRef.current) {
        tl.from(leftRef.current.querySelectorAll('[data-brand]'), {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06
        }, 0.1);
      }

      // Card (form container)
      if (cardRef.current) {
        tl.from(cardRef.current, { y: 30, opacity: 0, duration: 0.7 }, 0.15);
      }

      // Tabs + Social + Inputs stagger
      if (tabsRef.current) {
        tl.from(tabsRef.current, { y: 12, opacity: 0, duration: 0.5 }, 0.25);
      }
      if (socialRef.current) {
        tl.from(socialRef.current, { y: 12, opacity: 0, duration: 0.5 }, 0.28);
      }
      if (inputsRef.current) {
        const fields = inputsRef.current.querySelectorAll('[data-field]');
        tl.from(fields, { y: 12, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.32);
        const cta = inputsRef.current.querySelector('[data-cta]');
        if (cta) tl.from(cta, { y: 12, opacity: 0, duration: 0.45 }, 0.42);
      }

      // Top header pill (Back to home)
      if (headerPillRef.current) {
        tl.from(headerPillRef.current, { y: 10, opacity: 0, duration: 0.5 }, 0.35);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // ===== Animate between Sign In / Sign Up tab switches =====
  useEffect(() => {
    if (!inputsRef.current || prefersReduced) return;

    const fields = inputsRef.current.querySelectorAll('[data-field]');
    // quick crossfade + slide for field changes
    gsap.fromTo(
      fields,
      { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
    );
  }, [isLogin, prefersReduced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ===== Optional: subtle mouse parallax on the card =====
  useEffect(() => {
    if (!cardRef.current || prefersReduced) return;

    const el = cardRef.current;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      gsap.to(el, {
        rotateX: dy * 4,
        rotateY: -dx * 4,
        transformPerspective: 800,
        transformOrigin: 'center',
        duration: 0.3,
        ease: 'power2.out'
      });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power3.out' });
    };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [prefersReduced]);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6 py-12 relative overflow-hidden text-gray-900"
    >
      {/* Blue glow effect (UNCHANGED) */}
      <div ref={blobsRef}>
        <div data-blob className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-400/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div data-blob className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div data-blob className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div ref={leftRef} className="hidden md:block">
            <div data-brand className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">SkillSpark</span>
            </div>
            <h1 data-brand className="text-5xl font-extrabold mb-6 leading-tight">
              Welcome back to your<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                learning journey
              </span>
            </h1>
            <p data-brand className="text-xl text-gray-700 mb-8 leading-relaxed">
              Continue mastering engineering interviews with AI-powered tools, personalized coaching, and gamified learning.
            </p>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full">
            <div ref={cardRef} className="bg-white rounded-3xl p-8 md:p-10 border border-black/30 will-change-transform">
              {/* Mobile Logo */}
              <div className="md:hidden flex items-center justify-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EduMate</span>
              </div>

              {/* Tabs (rounded + glassy) */}
              <div ref={tabsRef} className="flex space-x-2 mb-8 bg-gray-100/70 p-1 rounded-full">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all relative overflow-hidden
                    ${isLogin
                      ? 'bg-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}
                  `}
                >
                  <span className="relative z-10">Sign In</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all relative overflow-hidden
                    ${!isLogin
                      ? 'bg-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}
                  `}
                >
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              <h2 className="text-3xl font-extrabold mb-2">
                {isLogin ? 'Welcome back!' : 'Create account'}
              </h2>
              <p className="text-gray-700 mb-8">
                {isLogin
                  ? 'Sign in to continue your learning journey'
                  : 'Start your journey to interview success'}
              </p>

              {/* Social Login (GLASSY rounded) */}
              <div ref={socialRef} className="space-y-3 mb-6">
                <Link
                  href="/options"  // 👈 change this to your actual options page route
                  className="w-full relative overflow-hidden rounded-full border border-gray-200 bg-white/70 backdrop-blur-md px-5 py-3 font-semibold text-gray-900 transition-all hover:bg-white hover:shadow-lg inline-flex items-center justify-center gap-3 group"
                >
                  {/* subtle glossy sweep */}
                  <span className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 bg-white/40 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </Link>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                </div>
              </div>

              {/* Form */}
              <form ref={inputsRef} onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div data-field>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                <div data-field>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div data-field>
                  <label className="block text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div data-field>
                    <label className="block text-sm font-semibold mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div data-field className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-800">Remember me</span>
                    </label>
                    <button type="button" className="text-blue-700 hover:text-blue-800 font-semibold transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Primary CTA (rounded pill + glossy/shine) */}
                <button
                  data-cta
                  type="submit"
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                  {/* glossy highlight */}
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/5 transition-colors"></span>
                  {/* diagonal shine sweep */}
                  <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              {/* Terms */}
              {!isLogin && (
                <p className="text-center text-sm text-gray-600 mt-6">
                  By signing up, you agree to our{' '}
                  <button className="text-blue-700 hover:text-blue-800 font-semibold">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button className="text-blue-700 hover:text-blue-800 font-semibold">
                    Privacy Policy
                  </button>
                </p>
              )}
            </div>

            {/* Back to home (glassy pill) */}
            <div ref={headerPillRef} className="text-center mt-6">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white hover:shadow-md transition-all"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
