# JobSentry (FakeJobScanner) — Enterprise System Architecture & Shared Contract Specification

> **Status:** Production Specification  
> **Runtime:** Node.js 22 LTS / Express / TypeScript / React 19 / Python 3.11  
> **Architecture:** Decoupled Services (`/backend`, `/frontend`, `/ml_service`) with Root `/shared` SSOT  
> **Contract Rule:** Zero Fallback Tolerance (Invariant Schemas)  
> **Core Advisory Invariant:** *"This is an advisory risk indicator, not proof of fraud."*

---

## 1. Multi-Service Directory Architecture & SSOT Protocol

To eliminate model drift, conflicting variable names, and inconsistent schemas across frontend, backend, and machine learning services, JobSentry implements a **Single Source of Truth (SSOT)** design.

```
/
├── shared/                       # SINGLE SOURCE OF TRUTH (SSOT)
│   ├── contracts.ts              # Zod schemas & TypeScript definitions
│   ├── models.py                 # Python Pydantic models for ML service
│   └── schema.json               # Canonical Draft-07 JSON Schema
│
├── scripts/
│   └── sync-shared.js            # Node.js sync script (npm run sync:shared)
│
├── backend/                      # BACKEND SERVICE (Node.js / Express)
│   ├── shared/                   # Mirrored contracts (sync:shared)
│   ├── controllers.ts            # Express controllers with zero-fallback rules
│   ├── riskEngine.ts             # Deterministic risk evaluation engine
│   └── storage.ts                # Audit persistence layer
│
├── frontend/                     # FRONTEND SERVICE (React 19 SPA)
│   ├── shared/                   # Mirrored contracts (sync:shared)
│   └── src/
│       ├── components/           # Anti-AI Slop UI components (3-color palette)
│       ├── services/             # API client communicates with /api/*
│       ├── data/                 # Sample scenarios
│       ├── App.tsx               # Root view controller
│       ├── main.tsx              # Application entry point
│       └── index.css             # Animated background grid & text reveal CSS
│
├── ml_service/                   # MACHINE LEARNING SERVICE (Python)
│   ├── shared/                   # Mirrored Pydantic models (sync:shared)
│   └── main.py                   # Python ML inference gateway
│
├── server.ts                     # Root full-stack dev/prod runner (Port 3000)
└── ARCHITECTURE.md               # System specification
```

### 1.1 Synchronization Command & Hooks
Whenever contracts are updated in root `/shared/`, execute:
```bash
npm run sync:shared
```
This automatically runs before every dev server startup (`predev`) and production build (`prebuild`) via `package.json` hooks:
```json
"scripts": {
  "sync:shared": "node scripts/sync-shared.js",
  "predev": "node scripts/sync-shared.js",
  "prebuild": "node scripts/sync-shared.js"
}
```

---

## 2. Invariants & Zero Fallback Tolerance

### 2.1 The "No Legacy" Rule
1. **No Silent Defaults**: Missing required parameters produce an immediate HTTP 400 with field-indexed error messages.
2. **Strict Dual Casing**: Wire payloads accept both `camelCase` (`jobText`, `riskLevel`) and legacy `snake_case` (`job_text`, `risk_level`), normalizing them at the boundary into canonical internal representations.
3. **Type Invariance**: Unexpected or extra fields are stripped or rejected.

---

## 3. Shared Data Contracts

### 3.1 TypeScript Contract (`shared/contracts.ts`)
```typescript
import { z } from 'zod';

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const JobCheckInputSchema = z.object({
  jobText: z.string().trim().min(10).optional(),
  job_text: z.string().trim().min(10).optional(),
  email: z.string().trim().regex(emailRegex).optional(),
  company: z.string().trim().max(120).optional(),
  salary: z.string().trim().optional(),
  stage: z.enum(['staging', 'production']).default('production'),
}).refine(data => Boolean(data.jobText || data.job_text), {
  message: 'Job text is required (supply jobText or job_text)',
  path: ['jobText'],
});
```

### 3.2 Python Pydantic Model (`shared/models.py`)
```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class JobCheckInput(BaseModel):
    job_text: Optional[str] = Field(None, min_length=10, alias="jobText")
    job_text_alt: Optional[str] = Field(None, min_length=10, alias="job_text")
    email: Optional[EmailStr] = None
    company: Optional[str] = Field(None, max_length=120)
    salary: Optional[str] = None
    stage: str = "production"
```

---

## 4. End-to-End Simulation Test Scenarios

1. **Telegram Upfront Deposit (High Risk)**: Detects `@Telegram` and `$150 deposit` triggers (`risk_level: "High"`).
2. **WhatsApp Task Scam (High Risk)**: Detects daily crypto payout and click-farm rating scheme.
3. **Legitimate Role (Low Risk)**: Corporate domain and standard hiring pipeline (`risk_level: "Low"`).
4. **Invalid Input Reject (Zero Fallback)**: Missing `jobText` produces `HTTP 400 VALIDATION_FAILED`.
5. **Sync Verification**: Running `npm run sync:shared` verifies copy integrity across `/backend/shared`, `/frontend/shared`, and `/ml_service/shared`.
