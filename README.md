# 🎓 DecentraLearn

[![License: MIT](https://img.shields.io/github/license/Tech-Spyder/decentra-learn?color=blue)](LICENSE)
![Last Commit](https://img.shields.io/github/last-commit/Tech-Spyder/decentra-learn?color=brightgreen)
![Stars](https://img.shields.io/github/stars/Tech-Spyder/decentra-learn?style=social)
![Forks](https://img.shields.io/github/forks/Tech-Spyder/decentra-learn?style=social)
![Issues](https://img.shields.io/github/issues/Tech-Spyder/decentra-learn?color=yellow)


> A decentralized learning platform where learners earn XP by completing on-chain and off-chain activities — built with **Next.js**, **Supabase**, **Privy Auth**, and **CrossFi integration**.

---

## 🧠 Project Overview

**DecentraLearn** is an open learning platform designed to gamify education through blockchain technology.  
Learners progress through structured **multi-step courses**, earn **XP** for completing lessons, and can **convert XP to MPX tokens** which can be **staked to earn XFI** (CrossFi’s native token).  

It combines the power of **Web3 identity**, **decentralized progress tracking**, and **gamified learning** in one intuitive interface.

### Core Features
- 🧭 **Multi-Level Courses** — Beginner → Intermediate → Advanced  
- 🪙 **XP → MPX → XFI Flow** — Complete → Convert → Stake → Earn  
- 🧩 **Privy Authentication** — Simple email login + auto wallet creation  
- ⚙️ **Supabase Integration** — Store course content and progress  
- 💻 **CrossFi Blockchain** — Real staking simulation for rewards  
- 📊 **Progress Tracking** — Visual XP bars and leaderboard metrics  

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn / pnpm
- Supabase project credentials
- Privy app credentials
- CrossFi wallet setup

---

### Installation

```bash
git clone https://github.com/Techh-Spyder/decentralearn.git
cd decentralearn
npm install
```
---

### Configuration

```bash
Create a .env.local file in the root directory and include:

NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
NEXT_PUBLIC_PRIVY_APP_ID=<your_privy_app_id>
NEXT_PUBLIC_CROSSFI_API=<your_crossfi_api_url>
```

Make sure to replace placeholders with your actual keys.

---
Development
```bash
npm run dev
```

Then visit http://localhost:3000
 in your browser.
The app supports hot reloading, so edits reflect instantly.
---
Build & Deployment

For production:
```bash
npm run build
npm run start
```

You can deploy seamlessly to:

Vercel (recommended)

Netlify

Any Node-compatible host

When deploying to Vercel:

Connect your GitHub repo

Add environment variables in project settings

Click “Deploy” 🚀
---
### 🧰 Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Auth:** Privy (Email + Wallet)
- **Database:** Supabase
- **Blockchain:** CrossFi Network (MPX + XFI integration)
- **UI:** Shadcn/UI, TailwindCSS
- **State & Data:** TanStack Query, Zustand

---
### 🧪 Future Enhancements

🧭 Course creation dashboard for instructors

🎮 Achievement badges & NFT rewards

💬 Community discussions per course

📱 Mobile-friendly adaptive layout

🧱 Cross-chain XP tracking

### 🪪 License

This project is licensed under the MIT License
.

### 💡 Author

Techh Spyder
GitHub
 • X (Twitter)
