'use client';

import React, { useMemo, useRef, useState, useLayoutEffect, useEffect } from 'react';
import {
  Upload as UploadIcon,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { gsap } from 'gsap';
// ⬇️ keep your paths
import SpotlightCard from '../components/Card';
import { FileUpload } from '../components/file-upload';

type QuizItem = { question: string; options: string[]; answer: string };
type FlashcardItem = { front: string; back: string; tag?: string; detail?: string };
type ApiResponse = { quizzes: QuizItem[]; flashcards: FlashcardItem[] };

const FALLBACK: ApiResponse = {
  quizzes: [
    { question: 'Which keyword defines a function in Python?', options: ['func', 'def', 'lambda', 'fn'], answer: 'def' },
    { question: 'Which structure is immutable?', options: ['list', 'dict', 'tuple', 'set'], answer: 'tuple' },
    { question: 'PEP stands for?', options: ['Python Enhancement Proposal', 'Performance Eval Plan', 'Package Exec Protocol', 'Python Extension Pack'], answer: 'Python Enhancement Proposal' },
    { question: 'What does list.append(x) do?', options: ['returns new list', 'adds x in place', 'removes x', 'creates copy'], answer: 'adds x in place' },
    { question: 'How to open a file for reading?', options: ['open("f","a")', 'open("f","w")', 'open("f","r")', 'open("f","x")'], answer: 'open("f","r")' },
    { question: 'What is the output of 3 * "ab"?', options: ['"ab3"', '"ababab"', 'Error', '"ab ab ab"'], answer: '"ababab"' },
    { question: 'Exception handling uses:', options: ['try/except', 'catch/except', 'guard/catch', 'case/except'], answer: 'try/except' },
    { question: 'dict.get("k", d) does:', options: ['KeyError', 'returns default d if missing', 'removes key', 'adds key'], answer: 'returns default d if missing' },
    { question: 'Generators are created with:', options: ['yield', 'return', 'generate', 'yieldfrom only'], answer: 'yield' },
    { question: 'Create venv (py3):', options: ['pip venv', 'python -m venv venv', 'venv create', 'pip init'], answer: 'python -m venv venv' },
  ],
  flashcards: [
    { front: 'List vs Tuple', back: 'List is mutable; Tuple is immutable.', tag: 'Core', detail: 'Use tuple for fixed collections.' },
    { front: 'List Comprehension', back: '[expr for x in it if cond]', tag: 'Syntax', detail: 'Concise list creation.' },
    { front: '*args / **kwargs', back: 'Variable positional/keyword arguments.', tag: 'Functions', detail: 'Flexible function signatures.' },
    { front: 'dict.get', back: 'Safe access with default.', tag: 'Dicts', detail: 'Avoids KeyError.' },
    { front: 'Generator', back: 'Function with yield; lazy.', tag: 'Performance', detail: 'Saves memory for large data.' },
  ],
};

export default function GeneratorPage() {
  // initial inputs
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');

  // app state
  const [view, setView] = useState<'input' | 'results'>('input');
  const [activeTab, setActiveTab] = useState<'quizzes' | 'flashcards'>('quizzes');
  const [loadingApi, setLoadingApi] = useState(false);

  // data + quiz answering state
  const [data, setData] = useState<ApiResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(10).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const apiUrl = useMemo(() => (process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || ''), []);

  function onChoose(option: string) {
    if (!data) return;
    const copy = [...answers];
    copy[currentIndex] = option;
    setAnswers(copy);
  }

  function prevQ() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }
  function nextQ() {
    setCurrentIndex((i) => Math.min((data?.quizzes.length || 10) - 1, i + 1));
  }

  function submitQuiz() {
    if (!data) return;
    let s = 0;
    data.quizzes.slice(0, 10).forEach((q, idx) => {
      if (answers[idx] === q.answer) s += 1;
    });
    setScore(s);
    setSubmitted(true);
  }

  async function onGenerate(e?: React.FormEvent) {
    e?.preventDefault();

    // immediately show results (fallback) per requirement
    setData(FALLBACK);
    setView('results');
    setActiveTab('quizzes');
    setLoadingApi(true);
    setCurrentIndex(0);
    setAnswers(Array(10).fill(null));
    setSubmitted(false);
    setScore(0);

    // try FastAPI; replace fallback if successful
    try {
      const controller = new AbortController();
      const to = setTimeout(() => controller.abort(), 8000);

      let res: Response;
      if (apiUrl) {
        if (file) {
          const form = new FormData();
          form.append('file', file);
          form.append('prompt', prompt || '');
          res = await fetch(`${apiUrl}/generate`, {
            method: 'POST',
            body: form,
            signal: controller.signal,
          });
        } else {
          res = await fetch(`${apiUrl}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
            signal: controller.signal,
          });
        }

        clearTimeout(to);
        if (res.ok) {
          const payload = (await res.json()) as ApiResponse;
          if (payload?.quizzes?.length || payload?.flashcards?.length) {
            const trimmed: ApiResponse = {
              quizzes: (payload.quizzes || []).slice(0, 10),
              flashcards: (payload.flashcards || []).slice(0, 5),
            };
            setData(trimmed);
          }
        }
      }
    } catch {
      // keep fallback
    } finally {
      setLoadingApi(false);
    }
  }

  const currentQuiz = data?.quizzes[currentIndex];

  const canSubmit = !loadingApi && (file || prompt.trim());
  const isGenerating = loadingApi;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter' && canSubmit) {
      onGenerate();
    }
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) onGenerate();
  }

  // ===================== GSAP ANIMATIONS =====================
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

  const inputCardRef = useRef<HTMLDivElement | null>(null);
  const resultsWrapperRef = useRef<HTMLDivElement | null>(null);

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const quizCardRef = useRef<HTMLDivElement | null>(null); // the changing question container
  const afterSubmitRef = useRef<HTMLDivElement | null>(null);
  const flashcardsRef = useRef<HTMLDivElement | null>(null);

  const hasAnimated = useRef(false);

  // Initial entrance animation
  useLayoutEffect(() => {
    if (!rootRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      gsap.set(blobRefs.current, { opacity: 0, scale: 0.95 });
      gsap.set(heroRefs.current, { y: 16, opacity: 0 });
      if (inputCardRef.current) gsap.set(inputCardRef.current, { y: 20, opacity: 0 });

      tl.to(blobRefs.current, { opacity: 0.3, scale: 1, duration: 0.8, stagger: 0.08 }, 0);
      tl.to(heroRefs.current, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.1);
      if (inputCardRef.current) tl.to(inputCardRef.current, { y: 0, opacity: 1, duration: 0.5 }, 0.25);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Transition between input view -> results view
  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      if (view === 'input') {
        if (inputCardRef.current) {
          gsap.fromTo(
            inputCardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
          );
        }
      } else {
        // fade out input (if it exists), then fade in results wrapper
        if (inputCardRef.current) {
          gsap.to(inputCardRef.current, { y: -10, opacity: 0, duration: 0.35, ease: 'power2.out' });
        }
        if (resultsWrapperRef.current) {
          gsap.fromTo(
            resultsWrapperRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.05 }
          );
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, [view]);

  // Animate tab switch (quizzes <-> flashcards)
  useEffect(() => {
    if (!rootRef.current || view !== 'results') return;

    const ctx = gsap.context(() => {
      const target =
        activeTab === 'quizzes' ? quizCardRef.current : flashcardsRef.current;
      if (!target) return;

      gsap.fromTo(
        target,
        { y: 16, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [activeTab, view]);

  // Animate question change (horizontal feel)
  const prevIndexRef = useRef(0);
  useEffect(() => {
    if (!quizCardRef.current || activeTab !== 'quizzes' || view !== 'results') return;

    const dir = currentIndex >= prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = currentIndex;

    const el = quizCardRef.current;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { x: 24 * dir, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
    );
    return () => {
      tl.kill();
    };
  }, [currentIndex, activeTab, view]);

  // Subtle hover for the two big sections in results
  useEffect(() => {
    const nodes: HTMLElement[] = [];
    if (quizCardRef.current) nodes.push(quizCardRef.current);
    if (flashcardsRef.current) nodes.push(flashcardsRef.current);

    const offs: Array<() => void> = [];
    nodes.forEach((n) => {
      const enter = () => gsap.to(n, { y: -3, duration: 0.2, ease: 'power2.out' });
      const leave = () => gsap.to(n, { y: 0, duration: 0.2, ease: 'power2.out' });
      n.addEventListener('mouseenter', enter);
      n.addEventListener('mouseleave', leave);
      offs.push(() => {
        n.removeEventListener('mouseenter', enter);
        n.removeEventListener('mouseleave', leave);
      });
    });
    return () => offs.forEach((fn) => fn());
  }, [view]);

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-[Poppins] text-gray-900">
      {/* 🔵 Glowing blobs — unified with options page */}
      <div ref={addBlobRef} className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div ref={addBlobRef} className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div ref={addBlobRef} className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 ref={addHeroRef} className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quiz & Flashcard Generator
            </span>
          </h1>
          <p ref={addHeroRef} className="text-lg text-gray-700 mt-3">
            Upload a PDF or type a prompt. Generate interactive quizzes and detailed flashcards instantly.
          </p>
        </div>

        {/* ====== INPUT VIEW ====== */}
        {view === 'input' && (
          <div ref={inputCardRef}>
            <SpotlightCard
              className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-lg"
              spotlightColor="rgba(0, 229, 255, 0.15)"
            >
              <FileUpload />
              <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center gap-3 w-full">
                <label htmlFor="prompt" className="text-sm font-semibold">
                  Or type a one-line prompt
                </label>
                <div className="relative w-full max-w-2xl">
                  <input
                    id="prompt"
                    placeholder='e.g., "Generate 10 MCQs and 5 flashcards on Python basics"'
                    className="w-full rounded-full bg-gray-50 border border-gray-200 px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full w-10 h-10 transition 
                      ${canSubmit 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg hover:scale-105' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {isGenerating ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin" width="20" height="20" viewBox="0 0 50 50">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset="60" />
                      </svg>
                    ) : (
                      <ArrowRight className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </form>
            </SpotlightCard>
          </div>
        )}

        {/* ====== RESULTS VIEW (two sections on same page) ====== */}
        {view === 'results' && data && (
          <div ref={resultsWrapperRef}>
            {/* Inline “navbar” tabs */}
            <div ref={tabsRef} className="mx-auto mt-2 mb-8 flex w-full max-w-lg items-center justify-center rounded-full border border-white/60 bg-white/70 backdrop-blur-md p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === 'quizzes'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }`}
              >
                Quizzes
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                }`}
              >
                Flashcards
              </button>
            </div>

            {/* Quizzes (horizontal stack flow) */}
            {activeTab === 'quizzes' && (
              <div className="space-y-8">
                <SpotlightCard
                  className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg"
                  spotlightColor={`rgba(${59}, ${130}, ${246}, ${0.12})`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-gray-900" />
                    <h2 className="text-2xl font-bold">Quizzes</h2>
                    {loadingApi && <Loader2 className="h-5 w-5 animate-spin text-gray-500 ml-auto" />}
                  </div>

                  {/* Progress */}
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-700">
                    <span>
                      Question {currentIndex + 1} / {data.quizzes.slice(0, 10).length}
                    </span>
                    <span>
                      Answered {answers.filter((a) => a !== null).length} / {data.quizzes.slice(0, 10).length}
                    </span>
                  </div>
                  <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                      style={{ width: `${((currentIndex + 1) / data.quizzes.slice(0, 10).length) * 100}%` }}
                    />
                  </div>

                  {/* Horizontal stack: show one rectangular card at a time */}
                  {currentQuiz && (
                    <div ref={quizCardRef} className="relative mx-auto w-full max-w-5xl rounded-2xl border border-gray-200 bg-white p-10">
                      <p className="mb-6 text-lg font-semibold">{currentQuiz.question}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {currentQuiz.options.map((opt) => {
                          const selected = answers[currentIndex] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => onChoose(opt)}
                              className={`rounded-xl border px-4 py-3 text-left transition-all ${
                                selected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Controls */}
                      <div className="mt-6 flex items-center justify-between">
                        <button
                          onClick={prevQ}
                          disabled={currentIndex === 0}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 backdrop-blur px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </button>

                        {currentIndex < data.quizzes.slice(0, 10).length - 1 ? (
                          <button
                            onClick={nextQ}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:shadow-md"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={submitQuiz}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:shadow-md"
                          >
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </SpotlightCard>

                {/* After submit: show detailed correctness + score */}
                {submitted && (
                  <div ref={afterSubmitRef}>
                    <SpotlightCard
                      className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg"
                      spotlightColor="rgba(0, 229, 255, 0.12)"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        {score >= 7 ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-rose-600" />}
                        <h3 className="text-xl font-bold">
                          Your Score: {score} / {data.quizzes.slice(0, 10).length}
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {data.quizzes.slice(0, 10).map((q, idx) => {
                          const isCorrect = answers[idx] === q.answer;
                          return (
                            <div key={idx} className="rounded-xl border border-gray-200 bg-white p-4">
                              <p className="font-semibold mb-2">
                                Q{idx + 1}. {q.question}
                              </p>
                              <p className="text-sm mb-1">
                                <span className="font-medium">Your answer:</span>{' '}
                                {answers[idx] ?? <em className="text-gray-500">Not answered</em>}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Correct:</span> {q.answer}
                              </p>
                              <div className="mt-2 text-sm font-semibold">
                                {isCorrect ? <span className="text-green-700">Correct ✓</span> : <span className="text-rose-700">Incorrect ✗</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </SpotlightCard>
                  </div>
                )}
              </div>
            )}

            {/* Flashcards grid with more details */}
            {activeTab === 'flashcards' && (
              <div ref={flashcardsRef}>
                <SpotlightCard
                  className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg"
                  spotlightColor={`rgba(${99}, ${102}, ${241}, ${0.12})`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-gray-900" />
                    <h2 className="text-2xl font-bold">Flashcards</h2>
                    {loadingApi && <Loader2 className="h-5 w-5 animate-spin text-gray-500 ml-auto" />}
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.flashcards.slice(0, 9).map((f, i) => (
                      <div key={i} className="group relative h-44 [perspective:1000px]">
                        <div className="absolute inset-0 rounded-xl border border-gray-200 bg-white p-4 shadow transition-transform duration-500 group-hover:rotate-y-180 [transform-style:preserve-3d]">
                          {/* Front */}
                          <div className="absolute inset-0 flex flex-col justify-between py-4 items-center [backface-visibility:hidden]">
                            <div className="text-sm text-blue-700 font-semibold">{f.tag || 'Concept'}</div>
                            <div className="text-lg font-bold">{f.front}</div>
                            <div className="text-xs text-gray-600">{f.detail || 'Tap/hover to flip'}</div>
                          </div>
                          {/* Back */}
                          <div className="absolute inset-0 rotate-y-180 [backface-visibility:hidden] flex items-center justify-center">
                            <div className="text-gray-800 text-center px-2">{f.back}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            )}
          </div>
        )}

        {/* Bottom pill */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur-md px-6 py-3 shadow-md">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800">
              {view === 'input' ? 'Ready to generate' : 'Interactive mode'}
            </span>
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
