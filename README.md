# VedaAI – AI Assessment Creator.

An AI-powered assessment platform for educators. Built with Next.js, TypeScript, Zustand, and Groq AI.

---

## 🚀 Features

* **Login / Signup** — Full authentication flow with validation
* **Home Dashboard** — Stats, recent activity, quick tools
* **My Groups** — Create and manage student groups
* **Assignments** — Generate AI-powered question papers
* **AI Teacher's Toolkit** — Smart AI tools for teachers
* **My Library** — Upload and manage study materials
* **Settings** — Full profile, theme, and appearance settings
* **Dark Mode** — Global light/dark theme system
* **Accent Colors** — Dynamic global accent color switching

---

# 🧠 AI Powered by Groq

VedaAI now uses Groq API with ultra-fast inference.

### Supported Models

* `llama-3.3-70b-versatile`
* `llama-3.1-8b-instant`

---

## 🛠 Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Frontend         | Next.js 14 + TypeScript                |
| State Management | Zustand                                |
| AI Provider      | Groq API                               |
| AI Models        | Llama 3.3 / Llama 3.1                  |
| Styling          | Inline styles + Global Theme Variables |
| API Routes       | Next.js API Routes                     |
| Realtime         | Socket.io                              |

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/Manvvv/Veda-ai.git
cd Veda-ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Install Groq SDK

```bash
npm install groq-sdk
```

---

## 4. Create Environment File

Create:

```bash
.env.local
```

Add:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from:

https://console.groq.com/keys

---

## 5. Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 📁 Project Structure

```txt
Veda-ai/
├── src/
│   ├── components/
│   │   ├── UI.tsx
│   │   ├── Sidebar.tsx
│   │   ├── LoginPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── AssignmentsPage.tsx
│   │   ├── ToolkitPage.tsx
│   │   ├── LibraryPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── api/
│   │       ├── generate.ts
│   │       └── toolkit.ts
│   │
│   ├── store/
│   │   └── useAppStore.ts
│   │
│   ├── utils/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   └── types.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── .env.local
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

# 🔑 API Routes

## POST `/api/generate`

Generates structured AI question papers.

### Request

```json
{
  "prompt": "Generate a Class 8 Science paper"
}
```

### Response

```json
{
  "paper": {}
}
```

---

## POST `/api/toolkit`

Runs AI teacher tools.

### Request

```json
{
  "toolTitle": "Question Generator",
  "input": "Generate MCQs on Photosynthesis"
}
```

---

# 🎨 Theme System

VedaAI includes a complete global theme engine:

* 🌞 Light Mode
* 🌙 Dark Mode
* 🎨 Dynamic Accent Colors
* ⚡ Real-time Theme Switching

Theme colors are powered using CSS variables.

---

# ⚡ Performance

Groq inference provides:

* Extremely fast responses
* Low latency AI generation
* Better real-time UX
* Scalable AI architecture

---

# 🔒 Security

* API keys stored securely in `.env.local`
* No API key exposure on frontend
* All AI requests handled via secure Next.js API routes

---

# 🚀 Deployment

Build production app:

```bash
npm run build
npm start
```

Deploy easily on:

* Vercel
* Netlify
* Railway
* Render

---

# 🧑‍💻 Author

Built by Manav Choudhary for the VedaAI project.
