# MediBase

> **A secure healthcare record-sharing platform that enables authorized healthcare providers to access and contribute to a patient's longitudinal medical history.**

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── supabase/   # Supabase health verification endpoint
│   │   ├── globals.css         # Tailwind & theme variables
│   │   ├── layout.tsx          # Root layout with Inter font
│   │   └── page.tsx            # Landing status page
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser Supabase client
│   │   │   └── server.ts       # Server Supabase client (async cookies)
│   │   └── utils.ts            # Utility functions (cn helper)
│   └── types/
│       └── index.ts            # Base TypeScript type definitions
├── .env.example                # Template for environment variables
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ (Node.js 22 recommended)
- npm

### 2. Environment Setup
Copy the template environment file:
```bash
cp .env.example .env.local
```
Add your Supabase project credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔒 Security
- Row Level Security (RLS) enabled on all tables.
- No service-role or secret keys are exposed to client-side bundles.
- Environment variable files (`.env*.local`, `.env`) are ignored by Git.
