# SiteHub — Universal AI Website & Web Application Creation Platform

SiteHub is a production-grade, developer-first AI website and web application creation platform inspired by Google AI Studio, Lovable, Bolt, and modern visual IDEs.

SiteHub allows users to describe any web application or website in natural language and produces a fully functional, editable, responsive, and deployable codebase with bi-directional AST synchronization, live multi-viewport preview, and 1-click GitHub repository synchronization.

---

## Architecture Overview

- **Frontend Studio:** React 18, TypeScript, Tailwind CSS, Lucide icons, Vite.
- **Visual Canvas:** Responsive live preview across Desktop, Tablet (768px frame), and Mobile (375px frame) with zoom controls, section reordering, real-time prop inspection, and inline AST synchronization.
- **Bi-Directional Code Studio:** In-browser syntax editor with live tree explorer, component source inspection, direct AST mutation, and AI automated error repair.
- **AI Routing Engine:** Specialized multi-model routing table with automatic fallback chains across planning, coding, review, micro-edits, vision, and image generation.
- **Backend API & Server:** Express.js mounted with Vite middleware for local development and standalone production hosting.
- **Enterprise GitHub Integration:**
  - Real GitHub OAuth with cryptographically secure CSRF state verification.
  - Server-side AES-256-GCM encryption for stored user tokens (no client-side token exposure).
  - Automated GitHub repository creation and Git Tree/Commit push engine.
  - Zero mock responses: real verification against GitHub API with strict rate limiting and SSRF protection.
- **Secrets Manager:** Google AI Studio-style credentials management for AI provider keys and service tokens with client masking and scoped storage.

---

## Core Capabilities

1. **Universal Project Engine:**
   - Supports SaaS landing pages, e-commerce storefronts, portfolios, restaurant reservation engines, multilingual platforms, booking platforms, and full-stack web apps.
   - Preserves working functionality, state, and styling during iterative AI prompt orders.
2. **Bi-Directional Editing:**
   - Any visual change made in the Visual Canvas instantly reflects in the Code Studio AST and vice versa.
3. **Multilingual Localization:**
   - Native support for English, Hindi (हिन्दी), and Punjabi (ਪੰਜਾਬੀ) with dedicated Devanagari and Gurmukhi typography.
4. **Security & Secrets Discipline:**
   - Zero sensitive tokens in client bundles.
   - HttpOnly session cookies, state nonce expiration, and encrypted credentials storage.
   - Strict input validation, repository name sanitization, and path traversal defenses.
5. **Universal Export & Deployment:**
   - 1-Click push to GitHub (new repository or updates to existing branches).
   - Standalone Presentation Mode with full-screen live interactive preview.
   - Static HTML, AST JSON, and source bundle export.

---

## Development Setup

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run automated security and GitHub integration test suite
npx tsx --test tests/github.test.ts

# Production build
npm run build
```

---

## License & Attribution

Copyright © 2026 SiteHub Platform Inc. All rights reserved.
