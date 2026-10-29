# TasteBrief — Cross-Border Inbound Taste Intelligence for Independent Hospitality

[![Built for Qloo Hackathon](https://img.shields.io/badge/Qloo_API-v2_Insights-6366f1.svg)](https://qloo.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14_App_Router-black.svg)](https://nextjs.org)
[![Zero-Cost Stack](https://img.shields.io/badge/Stack-100%25_Zero_Cost-emerald.svg)]()

> **TasteBrief** eliminates demographic guesswork and tourist stereotypes for independent café, bar, and boutique hotel operators in global travel hubs. By querying Qloo's Cultural Taste Graph, TasteBrief isolates the mathematical taste divergence between domestic city baselines and inbound visitor cohorts.

---

## ⚡ Instant Live Judge Evaluation (Zero Setup Required)

Judges can test this application **immediately** with zero environment configuration:
1. **High-Fidelity Demo Mode**: If no API keys are present in `.env` or in the interface, TasteBrief automatically engages verified, empirically grounded Qloo fixtures for Lisbon–Berlin, Tokyo–Paris, Mexico City–New York, and London–Austin.
2. **Live Key Injection**: Judges can click **"API Keys"** in the top navigation bar to test their own live Qloo `x-api-key` and Google Gemini Flash keys on the fly.
3. **Live Network Telemetry**: Click **"Inspect API Logs"** in the top header to see live cURL parameters, status codes, round-trip latency, and raw Qloo JSON payloads.

---

## 🚀 One-Click Deployment to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Step-by-Step Vercel Setup:
1. Fork or clone this repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. (Optional) Set the following environment variables:
   * `QLOO_API_KEY`: Your Qloo Hackathon API Key.
   * `GEMINI_API_KEY`: Your Google AI Studio Gemini API Key.
4. Click **Deploy**. The application builds with zero configuration errors.

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tastebrief.git
cd tastebrief

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment keys
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Empirical Taste Divergence Architecture

```text
               ┌──────────────────────────────────────────────┐
               │         Operator Input: City Pair            │
               │         (e.g., Lisbon + Berliners)           │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │         Qloo /v2/insights Orchestrator       │
               │  Query A: Baseline Lisbon Dining & Music     │
               │  Query B: Lisbon Dining + signal.loc=Berlin  │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │        Affinity Lift & Delta Engine          │
               │  Calculates statistical lift % for venues,   │
               │  beverage tags, and cross-domain artists     │
               └──────────────────────┬───────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │     Constrained Action Copywriter (Gemini)   │
               │     Formats delta ledger into a 1-page       │
               │     exportable Venue Programming Action Memo │
               └──────────────────────────────────────────────┘
```

### Mathematical Lift Formula
$$\text{Lift \%} = \left(\frac{\text{Score}_{\text{visitor}} - \text{Score}_{\text{baseline}}}{\text{Score}_{\text{baseline}}}\right) \times 100$$

---

## 🧪 The Cultural Intelligence Proof Test

| Dimension | Generic LLM Baseline (GPT-4 / Claude) | TasteBrief Powered by Qloo v2 |
| :--- | :--- | :--- |
| **Menu Pivots** | Bavarian pretzels, bratwurst, German lagers | Pet-Nat natural wine (+253.8% lift), Nordic batch brew (+80.7% lift) |
| **Music Strategy** | Kraftwerk, generic techno, or traditional Portuguese Fado | Floating Points, Nils Frahm, Branko Kuduro-electronic crossovers |
| **Atmosphere** | Dark industrial concrete & Berghain club steel | Sunlit tiled courtyards; industrial finishes under-index by -67.7% |
| **Flaw/Reality** | Relies on insulting national stereotypes | Uncovers genuine lifestyle affinities between creative hubs |

---

## 📄 Export & Operations

* **1-Page Action Memo**: Click **"Print 1-Page Memo"** in the interface to trigger a clean, formatted physical printout styled specifically via `@media print` for bar managers and head baristas.
* **JSON Export**: Download structured JSON including verified Qloo entity URNs for downstream point-of-sale or digital signage integrations.
