'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ListChecks,
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import SpotlightCard from '../components/Card'; // ← adjust if needed

/** ----------------------------
 * Types
 * -----------------------------*/
type TestCase = {
  id: string;
  input: any;
  expected: any;
};

type Problem = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  description: string;
  examples: Array<{ input: any; output: any; explanation?: string }>;
  constraints: string[];
  approach: string[]; // step-by-step (no full code)
  jsReference: (input: any) => any; // validation for demo
  signature: string;
  testCases: TestCase[];
};

/** ----------------------------
 * Demo problems (static)
 * -----------------------------*/
const PROBLEM_PALINDROME: Problem = {
  id: 'palindrome',
  title: 'Valid Palindrome',
  difficulty: 'Easy',
  topic: 'Strings',
  signature: 'function solve(input) -> boolean, input: string',
  description:
    'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
  examples: [
    { input: 'A man, a plan, a canal: Panama', output: true, explanation: 'Normalized -> "amanaplanacanalpanama".' },
    { input: 'race a car', output: false },
  ],
  constraints: [
    '1 ≤ |s| ≤ 2e5',
    'Only alphanumeric characters are considered',
    'Case-insensitive comparison',
  ],
  approach: [
    'Normalize string: keep alphanumeric, to lowercase.',
    'Use two pointers from both ends.',
    'If mismatch → false; otherwise move inward until done.',
  ],
  jsReference: (input: string) => {
    const norm = (input || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    let i = 0, j = norm.length - 1;
    while (i < j) {
      if (norm[i] !== norm[j]) return false;
      i++; j--;
    }
    return true;
  },
  testCases: [
    { id: 't1', input: 'abba', expected: true },
    { id: 't2', input: 'abc', expected: false },
    { id: 't3', input: 'A man, a plan, a canal: Panama', expected: true },
    { id: 't4', input: 'No lemon, no melon!', expected: true },
  ],
};

const PROBLEM_TWO_SUM: Problem = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  topic: 'Arrays / Hashing',
  signature: 'function solve(input) -> [i, j], input: { nums: number[], target: number }',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  examples: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
    { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
  ],
  constraints: ['2 ≤ n ≤ 1e5', 'Exactly one valid answer exists'],
  approach: [
    'Use a hash map value → index.',
    'For each num at i, check if (target - num) is in map.',
    'If yes, return [map[need], i], else map[num] = i.',
  ],
  jsReference: (input: { nums: number[]; target: number }) => {
    const { nums, target } = input;
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const need = target - nums[i];
      if (map.has(need)) return [map.get(need), i];
      map.set(nums[i], i);
    }
    return [];
  },
  testCases: [
    { id: 't1', input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
    { id: 't2', input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    { id: 't3', input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
  ],
};

const PROBLEM_MAX_SUBARRAY: Problem = {
  id: 'max-subarray',
  title: 'Maximum Subarray',
  difficulty: 'Medium',
  topic: 'Dynamic Programming',
  signature: 'function solve(input) -> number, input: number[]',
  description:
    'Find the contiguous subarray with the largest sum and return its sum.',
  examples: [
    { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], output: 6, explanation: '[4, -1, 2, 1] sums to 6.' },
    { input: [1], output: 1 },
  ],
  constraints: ['1 ≤ n ≤ 1e5', '-1e4 ≤ nums[i] ≤ 1e4'],
  approach: [
    'Kadane’s: cur = max(x, cur + x), best = max(best, cur).',
    'Return best.',
  ],
  jsReference: (input: number[]) => {
    const nums = input;
    let cur = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
      cur = Math.max(nums[i], cur + nums[i]);
      best = Math.max(best, cur);
    }
    return best;
  },
  testCases: [
    { id: 't1', input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
    { id: 't2', input: [1], expected: 1 },
    { id: 't3', input: [5, 4, -1, 7, 8], expected: 23 },
  ],
};

/** ----------------------------
 * Helpers
 * -----------------------------*/
const ALL_PROBLEMS = [PROBLEM_TWO_SUM, PROBLEM_PALINDROME, PROBLEM_MAX_SUBARRAY];

const LANGS = ['JavaScript', 'Python', 'Java'] as const;
type Lang = (typeof LANGS)[number];

function problemsFromPrompt(p: string): Problem[] {
  const s = p.toLowerCase();
  if (s.includes('pal')) return [PROBLEM_PALINDROME, PROBLEM_TWO_SUM, PROBLEM_MAX_SUBARRAY];
  if (s.includes('array')) return [PROBLEM_TWO_SUM, PROBLEM_MAX_SUBARRAY, PROBLEM_PALINDROME];
  return ALL_PROBLEMS;
}

function getStarterCode(prob: Problem, lang: Lang) {
  switch (lang) {
    case 'JavaScript':
      return `// ${prob.title}
// ${prob.signature}
// Implement solve(input) and return the expected result.

function solve(input) {
  // TODO: write your solution here
  return null;
}

// The runner will call solve(input)
`;
    case 'Python':
      return `# ${prob.title}
# ${prob.signature}
# Implement solve(input) and return the expected result.

def solve(input):
    # TODO: write your solution here
    return None

# (Demo) In-browser execution is JS-only here.
`;
    case 'Java':
      return `// ${prob.title}
// ${prob.signature}
// Implement solve(Object input) and return the expected result.
// (Demo) In-browser execution is JS-only here.

class Solution {
    public Object solve(Object input) {
        // TODO
        return null;
    }
}
`;
  }
}

function pretty(v: any) {
  return typeof v === 'string' ? v : JSON.stringify(v);
}
function deepEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** ----------------------------
 * Main
 * -----------------------------*/
export default function PracticePage() {
  // phases
  const [phase, setPhase] = useState<'input' | 'workspace'>('input');

  // input
  const [prompt, setPrompt] = useState('');

  // problems & workspace
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // editor
  const [lang, setLang] = useState<Lang>('JavaScript');
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<
    Array<{ id: string; passed: boolean; expected: any; actual: any }>
  >([]);

  useEffect(() => {
    if (phase === 'workspace' && problems[activeIdx]) {
      setCode(getStarterCode(problems[activeIdx], lang));
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeIdx, lang]);

  function onGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    const gens = problemsFromPrompt(prompt || 'arrays in Java');
    setProblems(gens);
    setActiveIdx(0);
    setLang('JavaScript');
    setCode(getStarterCode(gens[0], 'JavaScript'));
    setResults([]);
    // ⬇️ Switch to full-screen workspace (everything else disappears)
    setPhase('workspace');
  }

  async function runTests(submit = false) {
    const prob = problems[activeIdx];
    if (!prob) return;
    setRunning(true);
    try {
      const caseResults: Array<{ id: string; passed: boolean; expected: any; actual: any }> = [];
      if (lang === 'JavaScript') {
        const fn = new Function(
          'input',
          `${code}\nreturn (typeof solve === 'function') ? solve(input) : undefined;`
        );
        for (const tc of prob.testCases) {
          let actual: any, passed = false;
          try {
            actual = fn(tc.input);
            passed = deepEqual(actual, tc.expected);
          } catch (err) {
            actual = String(err);
            passed = false;
          }
          caseResults.push({ id: tc.id, expected: tc.expected, actual, passed });
        }
      } else {
        // Simulate others using reference (demo)
        for (const tc of prob.testCases) {
          const actual = prob.jsReference(tc.input);
          caseResults.push({ id: tc.id, expected: tc.expected, actual, passed: deepEqual(actual, tc.expected) });
        }
      }
      setResults(caseResults);
      if (submit) {
        // no-op in demo
      }
    } finally {
      setRunning(false);
    }
  }

  const active = problems[activeIdx];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-[Poppins] text-gray-900">
      {/* Glowing blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      {/* ---------------- INPUT PHASE (heading + prompt) ---------------- */}
      {phase === 'input' && (
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Practice • Aptitude & Technical
              </span>
            </h1>
            <p className="text-lg text-gray-700 mt-3">
              Ask for a concept (e.g., “array questions in Java”) or a direct problem (e.g., “palindrome question”).
            </p>
          </div>

          <SpotlightCard
            className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-lg"
            spotlightColor={`rgba(${0}, ${229}, ${255}, ${0.15})`}
          >
            <form onSubmit={onGenerate} className="space-y-4 flex flex-col items-center gap-3 w-full my-20">
              <label htmlFor="prompt" className="text-sm font-semibold">
                What would you like to practice?
              </label>
              <div className="relative w-full max-w-2xl">
                <input
                  id="prompt"
                  placeholder='e.g., "I need array questions in Java"'
                  className="w-full rounded-full bg-gray-50 border border-gray-200 px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onGenerate(e)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg hover:scale-105 transition"
                  aria-label="Generate"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </form>
          </SpotlightCard>
        </div>
      )}

      {/* ---------------- WORKSPACE PHASE (FULL SCREEN GRID ONLY) ---------------- */}
      {phase === 'workspace' && active && (
        <div className="relative z-10 h-screen w-screen px-3 sm:px-4 py-3 sm:py-4">
          {/* Fullscreen 3-pane grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 h-full">
            {/* LEFT: Problem/Approach (takes full left height) */}
            <SpotlightCard
              className="custom-spotlight-card flex flex-col rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-4 sm:p-5 shadow-lg overflow-hidden lg:col-span-2"
              spotlightColor={`rgba(${99}, ${102}, ${241}, ${0.12})`}
            >
              {/* Navigator embedded at top-left panel */}
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur px-3 py-1.5 text-md font-semibold hover:bg-white disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {problems.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveIdx(i)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        i === activeIdx
                          ? 'bg-white text-gray-900 shadow border-white'
                          : 'bg-white/70 backdrop-blur text-gray-700 border-white/60 hover:bg-white'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setActiveIdx((i) => Math.min(problems.length - 1, i + 1))}
                  disabled={activeIdx === problems.length - 1}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-semibold hover:bg-white disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>

                <span className="ml-auto text-[11px] rounded-full border border-white/60 bg-white/70 px-2.5 py-1">
                  {active.topic} • {active.difficulty}
                </span>
              </div>

              <div className="min-h-0 grid grid-rows-[auto_auto_1fr] gap-3 overflow-hidden">
                {/* Description */}
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <h2 className="font-bold text-2xl mb-1">{active.title}</h2>
                  <p className="text-md text-gray-800">{active.description}</p>
                </div>

                {/* Examples & Constraints (scrollable if needed) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <h3 className="font-semibold mb-2 text-xl">Examples</h3>
                    <div className="space-y-2 text-md">
                      {active.examples.map((ex, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 bg-white p-2">
                          <div><span className="font-medium">Input:</span> <code>{pretty(ex.input)}</code></div>
                          <div><span className="font-medium">Output:</span> <code>{pretty(ex.output)}</code></div>
                          {ex.explanation && (
                            <div className="text-gray-600 mt-1">{ex.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <h3 className="font-semibold mb-2 text-xl">Constraints</h3>
                    <ul className="list-disc pl-5 text-md text-gray-700 space-y-2">
                      {active.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Approach (fills remaining space, scrollable) */}
                <div className="rounded-xl border border-gray-200 bg-white p-3 overflow-auto">
                  <h3 className="font-semibold mb-2 text-xl">How to approach (step-by-step)</h3>
                  <ol className="list-decimal pl-5 text-md text-gray-800 space-y-2">
                    {active.approach.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </SpotlightCard>

            {/* RIGHT COLUMN: two stacked cards filling height */}
            <div className="grid grid-rows-2 gap-3 h-full">
              {/* Editor */}
              <EditorCard
                lang={lang}
                setLang={setLang}
                code={code}
                setCode={setCode}
                running={running}
                onRun={() => runTests(false)}
                onSubmit={() => runTests(true)}
              />

              {/* Results */}
              <ResultsCard results={results} />
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/** ----------------------------
 * Editor Card
 * -----------------------------*/
function EditorCard({
  lang,
  setLang,
  code,
  setCode,
  running,
  onRun,
  onSubmit,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  code: string;
  setCode: (s: string) => void;
  running: boolean;
  onRun: () => void;
  onSubmit: () => void;
}) {
  const [showNote, setShowNote] = useState(true);

  return (
    <SpotlightCard
      className="custom-spotlight-card flex flex-col rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-4 sm:p-5 shadow-lg overflow-hidden"
      spotlightColor={`rgba(${0}, ${229}, ${255}, ${0.12})`}
    >
      <div className="mb-3 flex items-center gap-3">
        <Code2 className="h-6 w-6 text-gray-900" />
        <h3 className="text-lg font-bold">Editor</h3>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs"
          >
            {LANGS.map((L) => (
              <option key={L} value={L}>{L}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCode(getStarterCodeForCurrent(lang))}
            className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs hover:bg-white"
          >
            Reset
          </button>
        </div>
      </div>

      {showNote && lang !== 'JavaScript' && (
        <div className="mb-2 text-[11px] text-gray-600">
          (Demo) In-browser execution is supported for JavaScript only.
          <button
            onClick={() => setShowNote(false)}
            className="ml-2 underline hover:no-underline"
          >
            Hide
          </button>
        </div>
      )}

      <div className="min-h-0 flex-1 rounded-xl overflow-hidden border border-gray-200 bg-white">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full min-h-[10rem] p-3 sm:p-4 font-mono text-md sm:text-sm outline-none"
          placeholder="Write your solution here…"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-md text-gray-600">
          {lang !== 'JavaScript' && 'Tip: switch to JavaScript to run tests in-browser.'}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-white"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
    </SpotlightCard>
  );

  function getStarterCodeForCurrent(L: Lang) {
    // Provide a minimal stub when resetting (no access to current problem here;
    // parent will re-initialize on language change anyway)
    return L === 'JavaScript'
      ? `function solve(input) {\n  // TODO\n  return null;\n}\n`
      : L === 'Python'
      ? `def solve(input):\n    # TODO\n    return None\n`
      : `class Solution {\n    public Object solve(Object input) {\n        // TODO\n        return null;\n    }\n}\n`;
  }
}

/** ----------------------------
 * Results Card
 * -----------------------------*/
function ResultsCard({
  results,
}: {
  results: Array<{ id: string; passed: boolean; expected: any; actual: any }>;
}) {
  return (
    <SpotlightCard
      className="custom-spotlight-card flex flex-col rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-4 sm:p-5 shadow-lg overflow-hidden"
      spotlightColor={`rgba(${99}, ${102}, ${241}, ${0.12})`}
    >
      <div className="mb-3 flex items-center gap-3">
        <ListChecks className="h-6 w-6 text-gray-900" />
        <h3 className="text-lg font-bold">Results</h3>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 overflow-auto">
        {results.length === 0 ? (
          <div className="text-sm text-gray-600">
            No runs yet. Click <b>Run</b> or <b>Submit</b> to execute tests.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              {results.every((r) => r.passed) ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-700">
                    All tests passed ({results.length}/{results.length})
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-600" />
                  <span className="font-semibold text-rose-700">
                    Passed {results.filter((r) => r.passed).length}/{results.length} tests
                  </span>
                </>
              )}
            </div>
            <div className="space-y-2">
              {results.map((r) => (
                <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                  <div className="mb-1 font-semibold">Test {r.id}</div>
                  <div className="flex items-center gap-2">
                    {r.passed ? (
                      <span className="text-green-700 font-medium">Passed</span>
                    ) : (
                      <span className="text-rose-700 font-medium">Failed</span>
                    )}
                  </div>
                  {!r.passed && (
                    <div className="mt-1 grid grid-cols-1 gap-1">
                      <div>Expected: <code>{pretty(r.expected)}</code></div>
                      <div>Got: <code>{pretty(r.actual)}</code></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}
