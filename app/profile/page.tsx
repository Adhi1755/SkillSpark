'use client';

import React, { useMemo, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import SpotlightCard from '../components/Card'; // ⬅️ adjust if your Card path differs

import {
  ArrowLeft,
  User,
  Award,
  Flame,
  Trophy,
  NotebookPen,
  Brain,
  BarChart3,
  Zap,
  BookOpen,
  ChevronRight,
  Star,
  BadgeCheck,
} from 'lucide-react';

import { gsap } from 'gsap';

// --- Recharts ---
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

// ===== Mock user & stats (replace with real data later) =====
const mockUser = {
  name: 'Adithya N',
  year: '3rd Year, CSE - Data Science',
  role: 'Student',
  username: '@aarav.codes',
  xp: 12450,
  rank: 156,
};

const kpis = [
  { label: 'Aptitude Solved', value: 132, icon: Brain },
  { label: 'Technical Solved', value: 98, icon: Zap },
  { label: 'Quizzes Attended', value: 42, icon: NotebookPen },
  { label: 'Flashcards Generated', value: 215, icon: BookOpen },
];

// Weekly activity (last 12 weeks aggregated)
const weeklyActivity = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  count: Math.floor(Math.random() * 35) + 5,
}));

// Topic mastery
const topicMastery = [
  { topic: 'Arrays', pct: 86 },
  { topic: 'Strings', pct: 72 },
  { topic: 'DP', pct: 58 },
  { topic: 'Graphs', pct: 40 },
  { topic: 'OOP', pct: 79 },
  { topic: 'SQL', pct: 65 },
];

// Recent activity feed
const recent = [
  { title: 'Solved: Two Sum', type: 'Technical', when: 'Today, 10:12 AM' },
  { title: 'Quiz: Python Basics (8/10)', type: 'Quiz', when: 'Yesterday, 6:40 PM' },
  { title: 'Generated 20 Flashcards: Trees', type: 'Flashcards', when: 'Yesterday, 5:10 PM' },
  { title: 'Solved: Valid Palindrome', type: 'Technical', when: 'Oct 10, 9:05 PM' },
  { title: 'Aptitude Set: Percentages (9/10)', type: 'Aptitude', when: 'Oct 9, 7:30 PM' },
];

// Badges
const badges = [
  { name: 'Streak 🔥', desc: '7-day streak', icon: Flame },
  { name: 'Top 10%', desc: 'Leaderboard Tier', icon: Trophy },
  { name: 'Quiz Wiz', desc: '40+ quizzes', icon: Award },
  { name: 'Card Crafter', desc: '200+ flashcards', icon: BadgeCheck },
];

// Streak heatmap (last 90 days)
function makeStreak(days = 90) {
  const out: { day: string; score: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({
      day: key,
      score: Math.random() < 0.75 ? Math.floor(Math.random() * 3) : 0, // 0–2 intensity
    });
  }
  return out;
}

export default function ProfileDashboardPage() {
  const streak = useMemo(() => makeStreak(90), []);
  const streakCols = 18; // 18 cols x 5 rows ~ 90 cells

  // ===== GSAP Refs
  const rootRef = useRef<HTMLDivElement | null>(null);
  const blobRefs = useRef<HTMLDivElement[]>([]);
  blobRefs.current = [];
  const addBlobRef = (el: HTMLDivElement | null) => {
    if (el && !blobRefs.current.includes(el)) blobRefs.current.push(el);
  };

  const heroRefs = useRef<HTMLElement[]>([]);
  heroRefs.current = [];
  const addHeroRef = (el: HTMLElement | null) => {
    if (el && !heroRefs.current.includes(el)) heroRefs.current.push(el);
  };

  const cardRefs = useRef<HTMLDivElement[]>([]);
  cardRefs.current = [];
  const addCardRef = (el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      // Set initial
      gsap.set(blobRefs.current, { opacity: 0, scale: 0.95 });
      gsap.set(heroRefs.current, { y: 16, opacity: 0 });
      gsap.set(cardRefs.current, { y: 24, opacity: 0, rotateX: -4, transformOrigin: '50% 100%' });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(blobRefs.current, { opacity: 0.3, scale: 1, duration: 0.8, stagger: 0.08 }, 0);
      tl.to(heroRefs.current, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 }, 0.1);
      tl.to(cardRefs.current, { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.06 }, 0.2);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-[Poppins] text-gray-900"
    >
      {/* 🟦 Glowing blobs */}
      <div ref={addBlobRef} className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div ref={addBlobRef} className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div ref={addBlobRef} className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Top bar (Back) */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pt-6">
          <div className="flex items-center justify-between">
            <Link
              href="/options" // ⬅️ change to the page you want to go back to
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-semibold hover:bg-white shadow-sm transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <span className="text-xs text-gray-600">Profile • Insights</span>
          </div>
        </div>
      </div>

      {/* Edge-to-edge but centered like LeetCode (max width + side paddings) */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 md:px-8 pb-10">
        {/* Header / Hero */}
        <div className="pt-6">
          <div ref={addCardRef}>
            <SpotlightCard
              className="custom-spotlight-card w-full rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg shadow-lg p-6 sm:p-8"
              spotlightColor="rgba(0, 229, 255, 0.12)"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4">
                  {/* No icon background */}
                  <User className="w-10 h-10" />
                  <div>
                    <div ref={addHeroRef} className="text-2xl sm:text-3xl font-extrabold">{mockUser.name}</div>
                    <div ref={addHeroRef} className="text-sm text-gray-700">
                      {mockUser.year} • {mockUser.role} • <span className="text-gray-600">{mockUser.username}</span>
                    </div>
                  </div>
                </div>

                {/* Quick stats pills (no icon backgrounds) */}
                <div className="md:ml-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-center">
                    <div className="text-xs text-gray-600">Rank</div>
                    <div className="text-xl font-bold">#{mockUser.rank}</div>
                  </div>
                  <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-center">
                    <div className="text-xs text-gray-600">XP</div>
                    <div className="text-xl font-bold">{mockUser.xp.toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-center">
                    <div className="text-xs text-gray-600">Streak</div>
                    <div className="text-xl font-bold flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5 text-orange-500" /> 7
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-center">
                    <div className="text-xs text-gray-600">Badges</div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* KPI Row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} ref={addCardRef}>
                <SpotlightCard
                  className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-5 shadow-lg"
                  spotlightColor="rgba(99, 102, 241, 0.12)"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">{k.label}</div>
                      <div className="text-2xl font-bold mt-1">{k.value}</div>
                    </div>
                    {/* No background for icon */}
                    <Icon className="w-6 h-6" />
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* Main grid like LeetCode: big charts + side cards */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Streak Heatmap */}
          <div ref={addCardRef} className="xl:col-span-1">
            <SpotlightCard
              className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg"
              spotlightColor="rgba(0, 229, 255, 0.12)"
            >
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-bold">Day-to-day Streak</h3>
              </div>
              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${streakCols}, minmax(0, 1fr))`, gap: '6px' }}
              >
                {streak.map((d, idx) => {
                  const c =
                    d.score === 0
                      ? 'bg-gray-200'
                      : d.score === 1
                      ? 'bg-blue-200'
                      : d.score === 2
                      ? 'bg-blue-400'
                      : 'bg-blue-600';
                  return (
                    <div
                      key={d.day}
                      className={`h-5 rounded ${c} border border-white/50`}
                      title={`${d.day}: ${d.score ? 'active' : 'rest'}`}
                    />
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-gray-600">Last 90 days</div>
            </SpotlightCard>
          </div>

          {/* Weekly Activity (Area) */}
          <div ref={addCardRef} className="xl:col-span-2">
            <SpotlightCard
              className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg w-full"
              spotlightColor="rgba(99, 102, 241, 0.12)"
            >
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <h3 className="text-lg font-bold">Weekly Activity</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyActivity} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorA)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </div>

          {/* Aptitude vs Technical (Bar stacked) - placed below as full-width card on xl */}
          <div ref={addCardRef} className="xl:col-span-3">
            <SpotlightCard
              className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg w-full"
              spotlightColor="rgba(99, 102, 241, 0.12)"
            >
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <h3 className="text-lg font-bold">Aptitude vs Technical (Last 12 Weeks)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyActivity.map((w) => ({
                      ...w,
                      aptitude: Math.floor(w.count * (0.5 + Math.random() * 0.4)),
                      technical: Math.floor(w.count * (0.3 + Math.random() * 0.5)),
                    }))}
                  >
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                    <Bar dataKey="aptitude" stackId="a" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="technical" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Bottom pill */}
        <div className="py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-6 py-3 shadow-md">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-800">Profile insights are up to date</span>
          </div>
        </div>
      </div>

      {/* Animations + font */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
