# Kiran Chand S — Portfolio Web Application

This directory contains the front-end and core web application for Kiran Chand S's developer portfolio, built with Next.js 16 (App Router), React 19, TypeScript, Framer Motion, and Tailwind CSS v4.

For comprehensive architectural documentation and project deep-dives, please see the [Root README](../README.md).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Key Scripts

- `npm run dev`: Starts local development server on port 3000.
- `npm run build`: Generates production build.
- `npm run start`: Starts production server.
- `npm run lint`: Executes Next.js & ESLint checks.

## Environment Variables

See [`.env.example`](.env.example) for required configuration:
- `WEB3FORMS_ACCESS_KEY`: Key for contact form transmission.
- `ABSTRACT_EMAIL_API_KEY`: Key for real-time contact email verification.

