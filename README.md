# VedaAI – AI Assessment Creator

An AI-powered assessment platform for educators. Built with Next.js, TypeScript, Zustand, and Anthropic Claude.

---

## 🚀 Features

- **Login / Signup** — Full auth flow with validation
- **Home Dashboard** — Stats, recent activity, quick tools
- **My Groups** — Create and manage student groups
- **Assignments** — Create assignments, generate AI question papers, view structured output
- **AI Teacher's Toolkit** — 6 AI-powered tools (Question Generator, Auto Grader, Rubric Builder, etc.)
- **My Library** — Upload, search, and manage reference documents
- **Settings** — Profile editing, notifications, security, appearance

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript |
| State Management | Zustand |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Styling | Inline styles + Tailwind CSS |
| API Routes | Next.js API Routes |

---

## ⚙️ Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd vedaai
npm install
```

### 2. Environment Variables

Copy the example env file and add your Anthropic API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from: https://console.anthropic.com

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
vedaai/
├── src/
│   ├── components/
│   │   ├── UI.tsx              # Shared UI components (Avatar, Badge, TopBar, etc.)
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── LoginPage.tsx       # Login & Signup
│   │   ├── HomePage.tsx        # Dashboard home
│   │   ├── GroupsPage.tsx      # Student groups management
│   │   ├── AssignmentsPage.tsx # Assignment creation & AI generation
│   │   ├── ToolkitPage.tsx     # AI Teacher's Toolkit
│   │   ├── LibraryPage.tsx     # File library
│   │   └── SettingsPage.tsx    # User settings
│   ├── pages/
│   │   ├── _app.tsx            # Next.js App wrapper
│   │   ├── index.tsx           # Main entry point
│   │   └── api/
│   │       ├── generate.ts     # AI paper generation endpoint
│   │       └── toolkit.ts      # AI toolkit endpoint
│   ├── store/
│   │   └── useAppStore.ts      # Zustand global state
│   ├── utils/
│   │   ├── api.ts              # API helper functions
│   │   ├── constants.ts        # Colors, mock data, constants
│   │   └── types.ts            # TypeScript interfaces
│   └── styles/
│       └── globals.css         # Global styles & animations
├── public/
├── .env.local.example
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 🔑 API Routes

### `POST /api/generate`
Generates a structured question paper using Claude AI.

**Body:** `{ prompt: string }`  
**Response:** `{ paper: GeneratedPaper }`

### `POST /api/toolkit`
Runs an AI Teacher's Toolkit tool.

**Body:** `{ toolTitle: string, input: string }`  
**Response:** `{ result: string }`

---

## 🏗 Architecture

```
User Action → Zustand Store → Next.js API Route → Anthropic Claude API
                   ↓
            React Component re-render
```

The frontend never exposes the API key — all Anthropic calls go through Next.js API routes on the server side.

---

## 📦 Bonus Features

- PDF Download button (hookup jspdf for full implementation)
- WebSocket-ready architecture (socket.io-client included)
- BullMQ background job queue ready (add Redis + BullMQ for production)
- MongoDB connection ready (add mongoose for database persistence)

---

## 🧑‍💻 Author

Built for VedaAI internship assessment.
