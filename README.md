# 🌿 Growcabulary (`growcabulary-next`)

An expanded botanical vocabulary-building game and etymology learning platform built on **Next.js (App Router, TypeScript, Tailwind CSS, Turbopack)** and **Supabase (PostgreSQL, Auth, Row-Level Security)**.

## ✨ Key Ecosystem Features

### 1. Multi-Game Botanical Arcade
- **🌱 Seed Sprout (Classic Orthographic Deduction):** Deduce the hidden word from its primary/secondary definitions, language of origin badge, and masked example sentence before your Life Force runs out.
- **✍️ Botanist's Field Notes (Contextual Nuance & Cloze):** Complete 3-blank literary field-note entries by selecting from a 5-specimen candidate tray. Includes optional **Root Clues** (`Inspect Root Clue 🔍`) that reveal a candidate word's ancestral root and origin.
- **💧 Watering the Garden (SM-2 Spaced Repetition):** Keep learned specimens hydrated and thriving through 3 rotating cognitive recall lenses (*Root & Origin Recognition*, *Contextual Recall*, and *Active Lexical Recall*), evolving specimens from `🌰 Seed` → `🌱 Sprout` → `🪴 Budding` → `🌸 In Bloom` → `🌳 Perennial`.

### 2. Interactive 3-Tab Botanical Conservatory
- **🌳 Living Biome View:** Visualizes all learned specimens by Growth Stage and live Hydration percentage (`0–100%`), with 1-click filtering for overdue ("Thirsty 💧") plants.
- **🕸️ Etymology Root Tree View:** Connects words across all 7 decks by shared classical roots (*umbra*, *pathos*, *loqui*, *logos*, *troph*, *bios*, *morphe*, *fenestra*, *acer*, *beatus*, *bellum*, *sanguis*, *fervere*, etc.), showing both **Cultivated Blooms** and **Lexicon Seeds**.
- **📖 Specimen Field Guide:** Searchable, filterable reference guide with **Flashcard Mask Mode** (`? ? ?` tap-to-reveal).

### 3. Curated Lexicon & Curator-in-the-Loop Governance
- Preserves all **619 curated words** in [`utils/data.ts`](./utils/data.ts) intact.
- [`scripts/generate-deck.js`](./scripts/generate-deck.js) drafts new candidate words via the Gemini API into `scripts/staged-decks/` for manual curator approval before anything enters the active lexicon.

---

## 🚀 Getting Started

```bash
cd growcabulary-next
npm install
npm run dev
```

To enable **Supabase Cloud Sync & Auth**:
1. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and Anon Key.
2. Run the SQL schema migration in [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor.
