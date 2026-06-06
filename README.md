<div align="center">

# SkillSpark

### AI-Powered Learning Platform for Interview & Exam Prep

Built at **Hackverse** — adaptive quizzes, smart flashcards, BYOQ coaching, and gamified progress tracking in a single platform.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://skill-spark-seven.vercel.app)

[**Live Demo →**](https://skill-spark-seven.vercel.app)

</div>

---

## Overview

**SkillSpark** is a full-stack web application that helps students prepare for coding interviews and exams through AI-assisted tools. The platform combines adaptive flashcards, dynamic quiz generation, a BYOQ (Bring Your Own Questions) coaching mode, and a gamified leaderboard system — all in one cohesive workflow.

Built end-to-end during the **Hackverse hackathon**, the project demonstrates a production-grade Next.js 15 frontend with scroll-driven animations, real-time feedback loops, and a Recharts-powered analytics dashboard.

---

## Features

### 🃏 Smart Flashcards
Adaptive flashcards surface the concepts you're weakest on first, helping you memorize more in less time.

### ⚡ Dynamic Quizzes
Unlimited practice quizzes tailored to your chosen topic, with instant per-answer feedback so you learn from every attempt.

### 💬 BYOQ Coaching (Bring Your Own Questions)
Paste or upload your own questions and receive step-by-step AI-powered explanations — useful for mock interview prep or working through unfamiliar material.

### 🏆 Gamification & Leaderboard
Earn XP on every quiz, maintain daily streaks, unlock rank badges, and compete on a real-time leaderboard with weekly challenges and community rankings.

### 📊 Progress Analytics
A personal dashboard tracks your quiz history, accuracy trends, streak count, and XP gains over time using Recharts visualizations.

---

## How It Works

```
1. Upload or Ask   →  Select a topic or paste your own questions
2. Learn & Practice →  Personalized flashcards + adaptive quizzes + instant feedback  
3. Track Progress   →  Analytics dashboard, streaks, and leaderboard rankings
```

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | GSAP 3.13 + ScrollTrigger, Framer Motion 12 |
| **Charts** | Recharts 3 |
| **File Input** | React Dropzone |
| **Icons** | Lucide React, Tabler Icons |
| **Deployment** | Vercel |

---

## Project Structure

```
SkillSpark/
├── app/
│   ├── components/
│   │   └── Landing.tsx        # Main landing page (GSAP scroll animations)
│   ├── layout.tsx             # Root layout with Geist font
│   ├── page.tsx               # Entry point
│   └── globals.css            # Global styles
├── public/
│   └── Dashboard.png          # Dashboard preview image
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Adhi1755/SkillSpark.git
cd SkillSpark

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Create production build
npm run start    # Start production server
```

---

## Demo

🌐 **Live:** [skill-spark-seven.vercel.app](https://skill-spark-seven.vercel.app)

---

## Built At

**Hackverse Hackathon** — developed as a full-stack demonstration of AI-integrated learning tools for students preparing for technical interviews and exams.

---

## Author

**Adithya Nagamuneendran**  
B.Tech CSE (Data Science) — Dayananda Sagar University, Bangalore  
[GitHub](https://github.com/Adhi1755) · [LinkedIn](https://linkedin.com/in/adithyanagamuneendran)
