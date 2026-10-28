# JobSentry (FakeJobScanner) - React Application

Advisory tool that helps a job applicant check a job posting **before applying**, so they can see its risk indicator and know what to verify next.

> **"This is an advisory risk indicator, not proof of fraud."**

---

## Overview

JobSentry has been rewritten into a modern, responsive, high-performance **React + TypeScript + Vite** single-page web application, preserving all specified features, data models, validation requirements, and API contracts.

## Key Features & UI Structure (Strict Single-Page Order)

1. **Hero**: One-line promise and quick paste box.
2. **Analysis Form**:
   - `job_text`: Required job description / posting text.
   - `email`: Recruiter email with format validation.
   - `company`: Company name.
   - `salary`: Numeric salary validation.
   - **Analyze Button**: Includes loading spinner during scan.
3. **Try Example Button**: Pre-loaded scenario selector (Telegram fee scam, WhatsApp task scam, verified tech role).
4. **Result Card**:
   - Colour-coded risk badge: Green (**Low**), Amber/Orange (**Medium**), Red (**High**).
   - Score progress bar with numerical score (0.00 to 1.00).
   - Red flags list with indicator icons.
   - Recommended advice / verification steps list.
5. **How It Works**: 3-step advisory workflow.
6. **Common Scams Section**: Explanations of Upfront fees, Fake cheques, Telegram task ratings, and Phishing.
7. **What To Do If Scammed**: Emergency response featuring **helpline 1930** and **cybercrime.gov.in**, plus a 4-step damage control checklist.
8. **Inspection History Table**:
   - Stores `checks(id, job_text, email, company, salary, risk_level, score, created_at)` in persistent local storage.
   - Every valid analysis is saved immediately.
   - Filter by search keyword or risk level, view detail modals, and export JSON.
9. **Advisory Disclaimer**: Formal disclaimer highlighting the advisory nature of the scanner.

## Frozen MVP Contract & Smart Heuristics

The application supports both:
- **Frozen MVP Mode**: Faithfully returns the specification's frozen dummy output (`risk_level: "High"`, `score: 0.78`, red flags, advice) for viva demo verification.
- **Smart Heuristics Mode**: Dynamically inspects public email domains (e.g. `@gmail.com`), Telegram/WhatsApp contact methods, registration/equipment deposit requests, and compensation anomalies.
- **Simulate Backend Down Toggle**: Tests frontend resilience with HTTP 503 error states and retry handling.

## Running Locally

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:3000`.
Build for production:

```bash
npm run build
```

## Cloudflare & Render Deployment

JobSentry supports decoupled production deployment:
- **Frontend**: [Cloudflare Pages](https://pages.cloudflare.com/) (React 19 + Vite SPA)
- **Backend**: [Render](https://render.com/) (Node.js Express API with Gemini 3.8 Flash Hybrid Engine)

For full step-by-step instructions, see [`RENDER_DEPLOYMENT.md`](RENDER_DEPLOYMENT.md) and [`render.yaml`](render.yaml).
