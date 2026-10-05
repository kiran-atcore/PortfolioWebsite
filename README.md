# Kiran Chand S — Software Engineering Portfolio

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.2-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**A modern, production-grade developer portfolio featuring interactive system architecture case studies, real-time 3D visuals, and deep dives into AI/ML, Full Stack, and Mobile engineering.**

[Explore Live Demo](https://dispatchr-reporter.vercel.app) • [Report Issue](https://github.com/kiran-atcore/PortfolioWebsite/issues) • [Connect on LinkedIn](https://linkedin.com/in/kiranchand-s)

</div>

---

## 📌 Overview

This repository contains the source code for the personal software engineering portfolio of **Kiran Chand S**. Engineered from the ground up to showcase production-grade projects, complex cloud architectures, and applied AI systems, this platform goes beyond a static résumé by delivering interactive engineering case studies with end-to-end architectural blueprints.

### Key Highlights
- 🧠 **Interactive Case Studies**: In-depth breakdowns of real-world projects with system architecture diagrams, engineering challenges, and benchmark metrics.
- ⚡ **Cutting-Edge Stack**: Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4 for optimal performance and SEO.
- 🎨 **Dynamic 3D & Micro-Interactions**: Ambient particle fields and interactive canvas scenes powered by Three.js and Framer Motion.
- 🛡️ **Verified Communication Pipeline**: Direct contact form transmission via Web3Forms paired with real-time email deliverability checks via AbstractAPI.
- 📱 **Responsive & Accessible**: Mobile-first architecture adhering to modern UI/UX principles, high-contrast themes, and fluid glassmorphism aesthetics.

---

## 🛠️ Tech Stack

### Core Platform
| Technology | Description |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing & interfaces) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & [Bootstrap 5](https://getbootstrap.com/) Icons |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) & [Three.js](https://threejs.org/) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup) |
| **Deployment** | [Vercel](https://vercel.com/) |

### External Services & APIs
- **Web3Forms**: Serverless contact message transmission without backend overhead.
- **AbstractAPI**: Automated RFC-compliant email deliverability & MX validation.

---

## 🌟 Featured Engineering Projects

The portfolio showcases several production and research systems architected by Kiran:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                             PROJECT SHOWCASE                               │
├───────────────────────────────┬────────────────────────────────────────────┤
│ Project                       │ Focus & Core Stack                         │
├───────────────────────────────┼────────────────────────────────────────────┤
│ 1. DispatchR Automated Suite  │ Enterprise Reporting, Next.js, Django REST, │
│                               │ PostgreSQL, ReportLab, Cron Schedules      │
├───────────────────────────────┼────────────────────────────────────────────┤
│ 2. DeepFake Detection Engine  │ Applied AI/ML, OpenCV, XceptionNet,        │
│                               │ Neural Verification, Video Chunking        │
├───────────────────────────────┼────────────────────────────────────────────┤
│ 3. AI Interview Platform      │ Low-Latency Conversational AI, Groq LPU,   │
│                               │ Monaco Editor, Piston Code Sandbox         │
├───────────────────────────────┼────────────────────────────────────────────┤
│ 4. Vicinio Local Worker App   │ Mobile, React Native (Expo), PostGIS,      │
│                               │ WebSockets (Django Channels + Redis)       │
└───────────────────────────────┴────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```bash
Portfolio/
├── CASE_STUDY.md           # Engineering specifications & system case study notes
├── GEMINI.md               # Repository rules & token-efficient workflows
└── website/                # Next.js web application
    ├── public/             # Static assets, fonts, icons, CV documents
    │   └── Kiran_Chand_S_CV.pdf
    ├── src/
    │   ├── app/            # Next.js App Router (pages, layout, global CSS)
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/     # Modular React components
    │   │   ├── certs/      # Certifications & credentials showcase
    │   │   ├── contact/    # Contact form & validation workflows
    │   │   ├── experience/ # Timeline & deep-dive architecture case studies
    │   │   ├── hero/       # Hero section, stats counters, 3D canvas
    │   │   ├── navbar/     # Navigation & quick links
    │   │   ├── projects/   # Interactive project cards & modal views
    │   │   └── skills/     # Technical skill matrices
    │   ├── data/           # Centralized strongly-typed data fixtures
    │   │   ├── experienceCaseStudies.ts
    │   │   ├── heroCardsData.ts
    │   │   └── portfolioData.ts
    │   ├── hooks/          # Custom reusable React hooks
    │   └── lib/            # Utility functions & API handlers
    ├── .env.example        # Environment variable definitions
    ├── package.json        # Dependencies & build scripts
    ├── tsconfig.json       # TypeScript compiler configuration
    └── next.config.ts      # Next.js runtime configurations
```

---

## ⚡ Getting Started

Follow these steps to run the portfolio locally on your machine.

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kiran-atcore/PortfolioWebsite.git
   cd PortfolioWebsite/website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your keys:
   ```env
   # Web3Forms Direct Transmission Access Key (Free: https://web3forms.com)
   WEB3FORMS_ACCESS_KEY="your-web3forms-key-here"
   NEXT_PUBLIC_WEB3FORMS_KEY="your-web3forms-key-here"

   # AbstractAPI Email Verification Key (Free: https://app.abstractapi.com)
   ABSTRACT_EMAIL_API_KEY="your-abstractapi-key-here"
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the live site.

---

## 📜 Available Scripts

Inside the `website` directory, you can execute the following commands:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with hot-reloading at `localhost:3000` |
| `npm run build` | Compiles optimized production bundle with type checking |
| `npm run start` | Boots the Next.js production server locally |
| `npm run lint` | Runs ESLint to check for code standards and lint errors |

---

## 🚢 Deployment

The portfolio is optimized for continuous deployment with **Vercel**:

1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. Import the `PortfolioWebsite` repository into [Vercel](https://vercel.com/).
3. Set the **Root Directory** setting to `website`.
4. Add your production environment variables (`WEB3FORMS_ACCESS_KEY`, `ABSTRACT_EMAIL_API_KEY`) in the Vercel Dashboard under **Project Settings > Environment Variables**.
5. Deploy! Vercel handles automated preview builds and production deployments on every push.

---

## 👤 About the Author

**Kiran Chand S** — Software Engineer & Full Stack Developer  
📍 Trivandrum, Kerala  
💼 [LinkedIn](https://linkedin.com/in/kiranchand-s) • 🐙 [GitHub](https://github.com/kiran-atcore) • ✉️ [kiranchand.0987@gmail.com](mailto:kiranchand.0987@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, fork, and use as inspiration for your own projects.
