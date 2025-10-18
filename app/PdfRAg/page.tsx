'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  Upload as UploadIcon,
  ArrowRight,
  Loader2,
  FileText,
  User,
  Bot,
} from 'lucide-react';
import SpotlightCard from '../components/Card'; // ⬅️ adjust path if needed
import { FileUpload } from '../components/file-upload';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function AskFromPdfPage() {
  // UI state
  const [file, setFile] = useState<File | null>(null);
  const [input, setInput] = useState('');
  const [view, setView] = useState<'input' | 'chat'>('input');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const endRef = useRef<HTMLDivElement>(null);

  // ---- Static demo answers (no backend required) ----
  const STATIC_KB: Record<string, string> = useMemo(
    () => ({
      'what is python': `Python is a high-level, interpreted programming language known for its readability and vast ecosystem. It supports multiple paradigms (procedural, OOP, functional), uses dynamic typing, and is commonly used in web development, data science, ML/AI, automation, scripting, and more. Its package manager (pip) and community-maintained libraries (NumPy, Pandas, Django, FastAPI, etc.) make it extremely productive for rapid prototyping and production systems alike.`,
      'what are the data types in python': `Common built-in data types in Python include:
- **Numeric**: int, float, complex
- **Text**: str
- **Boolean**: bool
- **Sequence**: list, tuple, range
- **Mapping**: dict
- **Set**: set, frozenset
- **Binary**: bytes, bytearray, memoryview
Python is dynamically typed, so variables can hold any of these at runtime.`,
      'how to create a virtual environment': `Use Python's built-in venv:
\`python -m venv venv\`
Activate it:
- Windows: \`venv\\Scripts\\activate\`
- macOS/Linux: \`source venv/bin/activate\`
Then install packages with \`pip install <package>\`.`,
      'how to read a file in python': `Basic file read:
\`\`\`python
with open('data.txt', 'r') as f:
    content = f.read()
\`\`\`
Use \`read()\`, \`readline()\`, or iterate for lines. Always prefer \`with\` to auto-close the file.`,
    }),
    []
  );

  function getStaticAnswer(q: string): string {
    const key = q.trim().toLowerCase();
    // match by exact or contains
    if (STATIC_KB[key]) return STATIC_KB[key];

    if (key.includes('what is python')) return STATIC_KB['what is python'];
    if (key.includes('data types') && key.includes('python'))
      return STATIC_KB['what are the data types in python'];
    if (key.includes('virtual environment')) return STATIC_KB['how to create a virtual environment'];
    if (key.includes('read a file')) return STATIC_KB['how to read a file in python'];

    return `This is a static demo reply. I don't have a backend connected yet, but here's a general tip:
- Ask focused questions like "Summarize section 2 about decorators" or "Extract all formulas from the PDF".
- When your RAC backend is connected, I’ll ground answers in your uploaded PDF content.`;
  }

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function sendMessage(content?: string) {
    const text = (content ?? input).trim();
    if (!text || isSending) return;

    setIsSending(true);

    // move to chat view on first send
    if (view !== 'chat') setView('chat');

    // append user message
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // "generate" static answer
    const answer = getStaticAnswer(text);
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: answer };

    // small delay just to feel like a response (but you asked no backend; still instant-ish)
    setTimeout(() => {
      setMessages((prev) => [...prev, aiMsg]);
      setIsSending(false);
      scrollToBottom();
    }, 150);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Upload UI like your previous style (no backend call here)
  function onUploadClick() {
    document.getElementById('pdf-input')?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (f) setFile(f);
  }

  const canSubmit = !!input.trim() && !isSending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-[Poppins] text-gray-900">
      {/* 🔵 Glowing blobs — same vibe */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Upload PDF & Ask Questions
            </span>
          </h1>
          <p className="text-lg text-gray-700 mt-3">
            Upload your study PDF and ask questions. I’ll reply right here in chat.
          </p>
        </div>

        {/* ===== INPUT VIEW (upload + prompt) ===== */}
        {view === 'input' && (
          <SpotlightCard
            className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-lg"
            spotlightColor="rgba(0, 229, 255, 0.15)"
          >
            {/* Upload */}
            <div className="flex flex-col items-center">
              <FileUpload/>
              {file && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-1.5 text-xs border border-white/60">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>

            {/* Prompt + arrow (acts as Generate) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit) sendMessage();
              }}
              className="space-y-4 flex flex-col items-center gap-3 w-full mt-6"
            >
              <label htmlFor="prompt" className="text-sm font-semibold">
                Ask anything from your PDF
              </label>
              <div className="relative w-full max-w-2xl">
                <input
                  id="prompt"
                  placeholder='e.g., "Summarize the introduction" or "What is Python?"'
                  className="w-full rounded-full bg-gray-50 border border-gray-200 px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full w-10 h-10 transition 
                    ${
                      canSubmit
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label="Generate"
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-6 h-6" />
                  )}
                </button>
              </div>
            </form>
          </SpotlightCard>
        )}

        {/* ===== CHAT VIEW (same page) ===== */}
        {view === 'chat' && (
          <SpotlightCard
            className="custom-spotlight-card rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-0 shadow-lg overflow-hidden"
            spotlightColor={`rgba(${99}, ${102}, ${241}, ${0.12})`}
          >
            {/* Header bar */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/50">
              <FileText className="h-5 w-5 text-gray-900" />
              <h2 className="text-lg font-semibold">Chat with your PDF</h2>
              {file && (
                <div className="ml-auto text-xs text-gray-700 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 border border-white/60">
                  <FileText className="h-4 w-4" />
                  {file.name}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="max-h-[60vh] overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-600">
                  Ask a question to start the conversation.
                  <div className="mt-2 text-gray-800">
                    Try: <code className="px-2 py-1 rounded bg-gray-100">What is Python?</code>{' '}
                    or{' '}
                    <code className="px-2 py-1 rounded bg-gray-100">
                      What are the data types in Python?
                    </code>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-4xl border shadow ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent'
                        : 'bg-white/80 backdrop-blur border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-3 px-4 py-3">
                      
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {m.content}
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input at bottom (same arrow UX) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (canSubmit) sendMessage();
              }}
              className="px-4 sm:px-6 py-4"
            >
              <div className="relative w-full">
                <input
                  placeholder="Ask anything from your PDF…"
                  className="w-full rounded-full bg-gray-50 border border-gray-200 px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full w-10 h-10 transition 
                    ${
                      canSubmit
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label="Send"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                </button>
              </div>
            </form>
          </SpotlightCard>
        )}
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
