'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Zap,
  MessageSquare,
  Trophy,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  BarChart3,
  Upload,
  BrainCircuit,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// SpotlightCard Component
const SpotlightCard = ({ children, className, spotlightColor }: { children: React.ReactNode; className?: string; spotlightColor: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;

    if (!card || !spotlight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`;
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [spotlightColor]);

  return (
    <div ref={cardRef} className={`relative overflow-hidden ${className}`}>
      <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default function EduMateLanding() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const communityRef = useRef(null);
  const ctaRef = useRef(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure all ScrollTriggers re-animate every time the element re-enters the viewport
    ScrollTrigger.defaults({ toggleActions: 'restart none none reset' });

    const ctx = gsap.context(() => {
      // Animated glowing effect (ambient)
      gsap.to(glowRef.current ? Array.from(glowRef.current.children) : [], {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.8, 1.2)',
        duration: 'random(8, 12)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { amount: 2, from: 'random' },
      });

      // Hero animations
      gsap.from('.hero-badge', {
        scrollTrigger: { trigger: heroRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-title', {
        scrollTrigger: { trigger: heroRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-description', {
        scrollTrigger: { trigger: heroRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.from('.hero-buttons', {
        scrollTrigger: { trigger: heroRef.current, start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      });

      gsap.from('.hero-dashboard', {
        scrollTrigger: { trigger: heroRef.current, start: 'top 60%' },
        y: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.8,
        ease: 'power3.out',
      });

      // Features section
      gsap.from('.features-title', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.feature-card', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 70%' },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // How it works
      gsap.from('.how-it-works-title', {
        scrollTrigger: { trigger: howItWorksRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.step-card', {
        scrollTrigger: { trigger: howItWorksRef.current, start: 'top 70%' },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      // Community section
      gsap.from('.community-content', {
        scrollTrigger: { trigger: communityRef.current, start: 'top 80%' },
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.community-leaderboard', {
        scrollTrigger: { trigger: communityRef.current, start: 'top 80%' },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // CTA section
      gsap.from('.cta-content', {
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Refresh on resize/orientation change for accurate positions
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert(); // kill all animations & ScrollTriggers created in this context
      ScrollTrigger.clearMatchMedia && ScrollTrigger.clearMatchMedia();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
        <div className="backdrop-blur-md bg-white/20 rounded-full border border-black/10 px-2 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold ml-5">SkillSpark</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-[15px] font-medium">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#demo" className="text-gray-700 hover:text-gray-900 transition-colors">
              Demo
            </a>
            <a href="#community" className="text-gray-700 hover:text-gray-900 transition-colors">
              Community
            </a>
          </div>
          <Link href="/login" className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all hover:shadow-lg text-base font-semibold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated blue glow effect */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-[700px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-4">
            <div className="hero-badge inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">
                Join 10,000+ students preparing for interviews
              </span>
            </div>
          </div>

          <h1 className="hero-title text-5xl md:text-6xl font-extrabold text-center mb-2 leading-tight">
            Learn Smarter. Revise Faster.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Crack Interviews.
            </span>
          </h1>

          <p className="hero-description text-lg md:text-xl text-gray-700 text-center max-w-3xl mx-auto mb-5">
            Master engineering interviews with AI-powered quizzes, flashcards, and personalized coaching. Track your
            progress, build streaks, and compete with peers.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
            <Link href="/login" className="px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all hover:shadow-xl flex items-center space-x-2 group text-base font-semibold">
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-6 py-2.5 bg-white text-gray-900 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg text-base font-semibold">
              Watch Demo
            </Link>
          </div>

          {/* Dashboard Image Placeholder */}
          <div className="hero-dashboard mb-2 max-w-8xl mx-auto">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Replace this with your dashboard image */}
                <img
                  src="./Dashboard.png"
                  alt="Dashboard Preview"
                  className="w-full h-auto"
                  style={{ minHeight: '500px', objectFit: 'cover' }}
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -left-4 top-20 bg-white rounded-xl shadow-xl p-4 border border-gray-200 transform -rotate-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Quiz Complete!</div>
                    <div className="text-xs text-gray-700">+50 XP</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-40 bg-white rounded-xl shadow-xl p-4 border border-gray-200 transform rotate-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Rank #156</div>
                    <div className="text-xs text-gray-700">Top 5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 px-6 bg-white my-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="features-title text-5xl font-bold mb-4">
              Everything you need to <span className="text-blue-600">excel</span>
            </h2>
            <p className="features-title text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Comprehensive tools and features designed to accelerate your interview preparation journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard
              className="feature-card bg-white border border-gray-200 rounded-2xl p-8"
              spotlightColor="rgba(59, 130, 246, 0.15)"
            >
              <BookOpen className="w-10 h-15 text-blue-600 mb-6" />
              <h3 className="text-xl font-bold mb-3">Smart Flashcards</h3>
              <p className="text-gray-700 leading-relaxed">
                AI-generated flashcards that adapt to your learning pace. Spaced repetition ensures long-term retention.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card bg-white border border-gray-200 rounded-2xl p-8"
              spotlightColor="rgba(168, 85, 247, 0.15)"
            >
              <Zap className="w-10 h-15 text-purple-600 mb-6" />
              <h3 className="text-xl font-bold mb-3">Dynamic Quizzes</h3>
              <p className="text-gray-700 leading-relaxed">
                Practice with unlimited quizzes tailored to your weak areas. Real-time feedback and detailed
                explanations.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card bg-white border border-gray-200 rounded-2xl p-8"
              spotlightColor="rgba(34, 197, 94, 0.15)"
            >
              <MessageSquare className="w-10 h-15 text-green-600 mb-6" />
              <h3 className="text-xl font-bold mb-3">BYOQ Coaching</h3>
              <p className="text-gray-700 leading-relaxed">
                Paste any question and get AI-powered hints, step-by-step solutions, and concept breakdowns.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="feature-card bg-white border border-gray-200 rounded-2xl p-8"
              spotlightColor="rgba(251, 146, 60, 0.15)"
            >
              <Trophy className="w-10 h-15 text-orange-600 mb-6" />
              <h3 className="text-xl font-bold mb-3">Gamification</h3>
              <p className="text-gray-700 leading-relaxed">
                Earn XP, maintain streaks, unlock badges, and climb the leaderboard. Make learning addictive.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section ref={howItWorksRef} id="how-it-works" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="how-it-works-title text-4xl md:text-5xl font-bold">
              Simple process, <span className="text-blue-700">powerful results</span>
            </h2>
            <p className="how-it-works-title mx-auto mt-3 max-w-2xl text-gray-700">Get started in three easy steps.</p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent lg:block" />
            <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent lg:hidden" />

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  n: '1',
                  icon: <Upload className="h-6 w-6 text-blue-600" />,
                  title: 'Upload or Ask',
                  body: 'Choose a topic or paste your own questions. Our AI finds key concepts to master.',
                },
                {
                  n: '2',
                  icon: <BrainCircuit className="h-6 w-6 text-purple-600" />,
                  title: 'Learn & Practice',
                  body: 'Personalized flashcards, adaptive quizzes, and instant feedback for every answer.',
                },
                {
                  n: '3',
                  icon: <BarChart3 className="h-6 w-6 text-green-600" />,
                  title: 'Track Progress',
                  body: 'Analytics, streaks, and leaderboards to keep you motivated and improving.',
                },
              ].map((s) => (
                <div key={s.n} className="step-card relative group lg:pt-6">
                  <div className="absolute -top-3 left-1/2 hidden h-6 w-6 -translate-x-1/2 items-center justify-center lg:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300 transition-colors group-hover:bg-blue-500" />
                  </div>
                  <SpotlightCard
                    className="rounded-2xl border border-gray-200 bg-white p-8"
                    spotlightColor="rgba(59,130,246,0.10)"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold">
                        {s.n}
                      </div>
                      {s.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                    <p className="text-gray-700">{s.body}</p>
                    <div className="mt-5 h-px w-0 bg-gradient-to-r from-blue-500/60 to-blue-400/60 transition-all duration-300 group-hover:w-20" />
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section ref={communityRef} id="community" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div className="community-content">
              <h2 className="text-4xl md:text-5xl font-bold">
                Join a thriving <span className="text-blue-700">community</span>
              </h2>
              <p className="mt-3 text-lg text-gray-700">
                Learn together, share insights, and push each other to the next level.
              </p>
              <ul className="mt-6 space-y-3 text-gray-900">
                {[
                  'Weekly challenges and competitions',
                  'Real-time leaderboard rankings',
                  'Share achievements and badges',
                  'Learn from top performers',
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="community-leaderboard rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Top performers</h3>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Sarah Chen', xp: 12450, badge: '🥇' },
                  { rank: 2, name: 'Amit Patel', xp: 11230, badge: '🥈' },
                  { rank: 3, name: 'Jessica Lee', xp: 10890, badge: '🥉' },
                  { rank: 4, name: 'Michael Brown', xp: 9560, badge: '⭐' },
                  { rank: 5, name: 'Priya Sharma', xp: 8920, badge: '⭐' },
                ].map((u) => (
                  <div
                    key={u.rank}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{u.badge}</span>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-700">{u.xp.toLocaleString()} XP</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-400">#{u.rank}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} id="cta">
        <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
          <div className="relative overflow-hidden border-t border-white/20 bg-white/5 p-10 text-center">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-400/40 blur-[120px]" />
              <div className="absolute right-[10%] bottom-[-20%] h-[380px] w-[520px] rounded-full bg-indigo-400/40 blur-[100px]" />
            </div>
            <div className="cta-content">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to transform your prep?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/90">
                Join thousands using SkillSpark to learn efficiently and ace interviews with confidence.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/login" className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-blue-700 font-semibold hover:bg-gray-100 transition-colors">
                  Get started free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-transparent px-8 py-3 text-white hover:bg-white/10 transition-colors">
                  Schedule demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-12 text-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-semibold">SkillSpark</span>
              </div>
              <p className="text-gray-700">Empowering students with AI-powered learning tools.</p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-900">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Legal</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
                <li><a href="#" className="hover:text-gray-900">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 md:flex-row">
            <p className="text-gray-700">© {new Date().getFullYear()} SkillSpark. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-700 hover:text-gray-900">Twitter</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">LinkedIn</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">GitHub</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}