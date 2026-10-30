# TasteBrief 🍷☕

**Cross-border taste intelligence for independent venues.**

When Berliners visit Lisbon, generic advice tells you to serve currywurst, play Kraftwerk, and hang raw industrial steel. In reality, travelers visit Lisbon for sunlit tiled courtyards, natural pet-nats, and batch brews — not stale clichés from back home.

**TasteBrief** removes that tourist stereotype guesswork. It queries **Qloo’s Cultural Taste Graph** in real time, runs mathematical lift comparisons between local baselines and inbound visitor tastes, and uses **Gemini 3.5** to generate an operational, printable 1-page Venue Programming Action Memo.

---

## ⚡ What You Need Before Starting

Before running TasteBrief, grab these two API keys (both have quick access tiers):

1. **Qloo API Key (`QLOO_API_KEY`)**:
   * TasteBrief queries Qloo's `/v2/insights` endpoint to pull real affinity scores for venues (`urn:entity:place`) and artists (`urn:entity:artist`).
   * Get your key via the [Qloo Developer Portal](https://qloo.com).
2. **Google Gemini API Key (`GEMINI_API_KEY`)**:
   * Used to format the statistical divergence data into actionable operational memos and proof comparisons.
   * Grab a free key in seconds from [Google AI Studio](https://aistudio.google.com/).

> **Note:** If you run the project without setting keys in your `.env.local` file, that's completely fine! You can punch them in straight from the dashboard via the **API Keys** button in the header, and they'll save locally in your browser.

---

## 🛠️ Step-by-Step Setup Guide

### Step 1: Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/Philip-Ajayi/tastebrief.git
cd tastebrief
```

### Step 2: Install Dependencies
TasteBrief runs on **Node.js (18+ recommended)** with Next.js 14/15/16 App Router. Install packages via npm:
```bash
npm install
```

### Step 3: Configure Your Environment Variables
Create a local `.env.local` file in the root folder:
```bash
cp .env.example .env.local
```
*(If `.env.example` isn't present, just create a new file named `.env.local`)*

Open `.env.local` in your editor and add your keys:
```env
# Required: Qloo v2 API Key (Passed as x-api-key)
QLOO_API_KEY=your_qloo_api_key_here

# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Set to true if you set server-side keys (updates the status indicator badge in the UI)
NEXT_PUBLIC_HAS_ENV_KEYS=true
```

#### Why are these variables important?
* Without `QLOO_API_KEY`, the server cannot retrieve the baseline vs. inbound affinity rankings from Qloo's taste engine.
* Without `GEMINI_API_KEY`, the app cannot summarize the mathematical deltas into the printable action memo or run the benchmark proof test.
* Keeping them in `.env.local` prevents accidental leakage of your private API credentials to GitHub (it is ignored by git).

### Step 4: Run the Local Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧭 How to Use TasteBrief

1. **Pick a Market Pairing**: Choose one of the preset global travel routes (e.g., *Lisbon ↔ Berlin*, *Tokyo ↔ Paris*) or toggle on **Custom City-Pair** to compare any destination city and origin market in the world.
2. **Review Affinity Lift & Spikes**:
   * **Venue Affinity Table**: See which local places over-index or under-index for the visiting market.
   * **Tag Spikes**: Pinpoints surging sub-categories (e.g., *Pet-Nat*, *Filter Coffee*, *Vinyl Listening Bar*).
3. **Inspect the Music Bridge**: Discover cross-genre artists whose listening graphs overlap between both cities to schedule soundtrack playlists for afternoon, aperitivo, and late-night services.
4. **The Cultural Proof Test**: Directly contrasts lazy ungrounded LLM clichés against verified Qloo cultural graph realities.
5. **Print or Export 1-Page Memo**: Click **"Print 1-Page Memo"** for a clean, paper-ready operational brief styled with custom `@media print` rules, ready to pin up behind the bar or pass to floor staff.
6. **Live Telemetry (Inspector)**: Click **"Inspect API Logs"** in the top navigation at any time to inspect exact round-trip latencies, resolved query parameters, and raw JSON payloads.

---

## 🚢 Deploying to Vercel

The easiest way to get TasteBrief live:

1. Push your repository to GitHub.
2. Import the project in your [Vercel Dashboard](https://vercel.com).
3. In the **Environment Variables** section, paste:
   * `QLOO_API_KEY`
   * `GEMINI_API_KEY`
   * `NEXT_PUBLIC_HAS_ENV_KEYS=true`
4. Hit **Deploy**. Next.js App Router will build and launch immediately.

---

## 🗂️ Project Anatomy

```text
tastebrief/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Multi-query Qloo orchestrator & Gemini pipeline
│   │   └── benchmark/route.ts    # Comparative proof engine
│   ├── globals.css               # Print styles & Tailwind design system
│   ├── layout.tsx                # Metadata & typography fonts
│   └── page.tsx                  # Dashboard state & orchestration
├── components/
│   ├── ActionMemoView.tsx        # Printable 1-page operator memo
│   ├── AffinityLiftTable.tsx     # Percentage divergence & tag lift breakdown
│   ├── ApiKeyModal.tsx           # In-browser key switcher
│   ├── CityPairSelector.tsx      # Curated preset pairs + custom city search
│   ├── Header.tsx                # Status indicators & quick tools
│   ├── MusicBridgeCard.tsx       # Cross-city harmonic mean music overlap
│   ├── NetworkInspectorModal.tsx # Live API telemetry & payload viewer
│   └── ProofTestComparison.tsx   # Cliché vs. TasteBrief benchmark
├── lib/
│   ├── affinity-engine.ts        # Pure math lift & harmonic mean calculation
│   ├── fixtures.ts               # Preset city routes & defaults
│   ├── gemini-client.ts          # Constrained JSON generation
│   └── qloo-client.ts            # Typed Qloo /v2/insights wrapper
└── types/                        # TypeScript domain interfaces
```

---

## 💡 Tech Stack
* **Framework:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS, Lucide Icons
* **Data & Cultural Intelligence:** Qloo REST API (`/v2/insights`)
* **Reasoning & Copywriting:** Google GenAI SDK (`gemini-3.5-flash-lite`)

---

## 📄 License
MIT. Built for independent hospitality innovators and curious cultural cartographers.
