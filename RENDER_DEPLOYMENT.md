# JobSentry Decoupled Deployment Guide: Cloudflare Pages + Render

This guide outlines the production deployment for **JobSentry**:
- **Backend (Render)**: Node.js Express API + Gemini 3.8 Flash Hybrid Engine
- **Frontend (Cloudflare Pages)**: React 19 + TypeScript + Vite SPA
- **Smart CI/CD Filters**: Deployments only trigger on the platform whose code actually changed.

---

## Architecture & CD Trigger Isolation

```
                    ┌───────────────────────────────┐
                    │       GitHub Repository       │
                    │   (Monorepo with SSOT /shared)│
                    └───────────────┬───────────────┘
                                    │
             ┌──────────────────────┴──────────────────────┐
             │ Git Push (Watched Paths Filtering)          │
             ▼                                             ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│ Cloudflare Pages (Web)  │               │ Render Web Service (API)│
│ Watched:                │               │ Watched:                │
│ - frontend/**           │               │ - backend/**            │
│ - shared/**             │               │ - shared/**             │
│ - public/**             │               │ - scripts/**            │
│ - index.html            │               │ - server.ts             │
│ - vite.config.ts        │               │ - render.yaml           │
│                         │               │                         │
│ Build: npm run build    │               │ Build: build:backend    │
│ Output: dist/           │               │ Start: npm start        │
└────────────┬────────────┘               └────────────▲────────────┘
             │                                         │
             └───────────── HTTPS / CORS ──────────────┘
                       VITE_API_URL -> Render
```

---

## 1. Setting Up or Changing GitHub Remote

If you created a new repository on your second GitHub account:

```bash
# 1. View your current remote
git remote -v

# 2. Update origin to your new repository URL
git remote set-url origin https://github.com/<YOUR_NEW_ACCOUNT>/JOB-SENTRY.git

# 3. Verify the new remote URL
git remote -v

# 4. Push all branches and tags
git push -u origin main
```

---

## 2. Render Setup (Backend API Only)

Render is configured through [`render.yaml`](render.yaml) to run **only the backend**. It will **never** invoke Vite or build the frontend.

### Option A: Render Blueprint (1-Click)
1. Go to [Render Dashboard](https://dashboard.render.com/) > **New +** > **Blueprint**.
2. Select your GitHub repository.
3. Render automatically reads [`render.yaml`](render.yaml) and applies the build filter and environment configuration.
4. Set your `GEMINI_API_KEY` in the Environment tab.
5. Click **Apply**.

### Option B: Manual Configuration
In your Render Service Settings:
| Setting | Value |
| :--- | :--- |
| **Language / Runtime** | `Node` |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build:backend` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |
| **Auto-Deploy** | `Yes` |

#### Path Filtering on Render (Settings > Build Filters):
Add the following paths so Render **only triggers** when backend files change:
- `backend/**`
- `shared/**`
- `scripts/**`
- `server.ts`
- `package.json`
- `package-lock.json`
- `render.yaml`

#### Environment Variables in Render:
- `NODE_ENV` = `production`
- `PORT` = `10000` *(set automatically)*
- `GEMINI_API_KEY` = `AIzaSy...` *(Google AI Studio key)*

#### Verify Render Backend:
Open `https://<your-render-service>.onrender.com/api/health`.  
Expected: `{"status":"healthy","hasGeminiKey":true}`

---

## 3. Cloudflare Pages Setup (Frontend Only)

Cloudflare Pages compiles and hosts only the client-side SPA.

### Project Settings in Cloudflare Pages:
1. In [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. Configure build settings:
   - **Framework Preset**: `Vite` (or None)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Root Directory**: `/`

### Path Filtering in Cloudflare Pages (Build Watch Paths):
In Cloudflare project > **Settings** > **Builds & deployments** > **Build watch paths**:
- **Include paths**:
  ```
  frontend/**
  shared/**
  public/**
  index.html
  vite.config.ts
  package.json
  package-lock.json
  ```
- **Exclude paths**:
  ```
  backend/**
  ml_service/**
  server.ts
  render.yaml
  *.md
  ```
*Now, pushing backend code will NOT trigger a frontend build.*

### Environment Variables in Cloudflare Pages:
In **Settings** > **Environment variables** > **Production**:
- **Variable**: `VITE_API_URL`
- **Value**: `https://<your-render-service>.onrender.com` *(no trailing slash)*

---

## 4. Verification & Testing

1. **Test Backend**:
   - `GET https://<render-service>.onrender.com/api/health` returns HTTP 200 `healthy`.
   - `GET https://<render-service>.onrender.com/` returns JSON endpoint directory.
2. **Test Frontend**:
   - Visit `https://<cloudflare-project>.pages.dev`.
   - Click **Try Example** (e.g. Telegram fee scam).
   - Click **Analyze Risk Score**: verifies CORS communication to Render.
   - Click **Academic Research**: verifies research metrics and paper display.
