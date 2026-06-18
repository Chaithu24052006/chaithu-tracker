# ⚡ Chaithu Daily Tracker

A personal daily productivity tracker — mobile-first PWA built with Next.js 15 + TypeScript + Tailwind CSS.

## Features

- ✅ Daily task checklist (Morning / College / Evening / Night)
- 📚 Study session tracker with weekly chart
- 💻 Coding tracker (DSA, GitHub, learning topic)
- 🚀 Project task board (Todo / In Progress / Done)
- 💪 Fitness + 🧴 Skincare + 💧 Water + 😴 Sleep + 🎭 Mood
- 📊 Daily score out of 100
- 📈 7-day stats with bar charts
- ⭐ XP + level system (Beginner → Engineer)
- 🔥 Daily streak tracking
- 🌙 Midnight reset — tasks reset each new day automatically
- 📱 PWA — installable on your phone like a native app
- 💾 All data in localStorage — no backend needed

---

## Setup (5 minutes)

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (free, ~2 mins)

### Option A — GitHub + Vercel (recommended)

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/chaithu-tracker.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo

3. Click **Deploy** — that's it

4. Every time you `git push`, Vercel auto-deploys ✨

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## Install as PWA on your phone

After deploying to Vercel:

1. Open the Vercel URL in **Chrome** on your Android phone
2. Tap the **⋮ menu** (three dots, top right)
3. Tap **"Add to Home screen"**
4. Tap **Add**

Done! It'll appear on your home screen like a real app — full screen, no browser bar, works offline.

**On iPhone (Safari):**
1. Open the URL in Safari
2. Tap the **Share** button (bottom center)
3. Tap **"Add to Home Screen"**

---

## App Icons

The `public/icon-192.png` and `public/icon-512.png` are placeholder icons.

To use a custom icon:
1. Create a 512×512 PNG image
2. Replace both files in `/public/`
3. Redeploy

You can generate icons free at [favicon.io](https://favicon.io)

---

## Folder Structure

```
chaithu-tracker/
├── app/
│   ├── globals.css        # Tailwind + base styles
│   ├── layout.tsx         # Root layout + PWA meta tags
│   └── page.tsx           # Main app shell + tab routing
├── components/
│   ├── ui.tsx             # Shared: Card, Badge, ProgressRing, BarChart
│   ├── Dashboard.tsx      # Home screen
│   ├── Tasks.tsx          # Daily checklist
│   ├── Study.tsx          # Study session logger
│   └── Views.tsx          # Coding, Projects, Health, Review, Stats
├── hooks/
│   └── useStore.ts        # Central state + midnight reset + XP logic
├── lib/
│   ├── constants.ts       # Types, default values, nav config
│   ├── storage.ts         # localStorage helpers
│   └── xp.ts              # XP values, level calculator
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── icon-192.png       # App icon (home screen)
│   └── icon-512.png       # App icon (splash screen)
├── next.config.js         # Next.js + PWA config
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## XP System

| Action             | XP       |
|--------------------|----------|
| Complete a task    | +2 XP    |
| Study (per hour)   | +15 XP   |
| Workout done       | +20 XP   |
| DSA problem solved | +10 XP   |
| Project task done  | +20 XP   |
| Skincare complete  | +5 XP    |

| Level | Name      | XP Range    |
|-------|-----------|-------------|
| 1     | Beginner  | 0–199       |
| 2     | Learner   | 200–499     |
| 3     | Builder   | 500–999     |
| 4     | Developer | 1000–1999   |
| 5     | Engineer  | 2000+       |
