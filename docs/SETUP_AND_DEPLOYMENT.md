# Setup and Deployment Guide

This guide provides instructions for setting up the Pramyan HR Management System locally, configuring environment variables, running database seeds, and deploying to cloud infrastructure.

---

## 1. Environment Configuration

The monorepo contains dedicated `.env` and `.env.example` templates for both the backend REST API server and the frontend Next.js application.

### Backend Environment Configuration (`backend/.env`)

Create `backend/.env` (or copy from `backend/.env.example`):

```ini
# Environment Mode: development | production
NODE_ENV=development

# Express Server Port (Default: 5001 to avoid macOS AirPlay port 5000 conflicts)
PORT=5001

# MongoDB Connection String (Atlas Cloud or Local MongoDB)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hr_dashboard?retryWrites=true&w=majority

# Application URLs (Local & Hosted)
LOCAL_FRONTEND_URL=http://localhost:3000
HOSTED_FRONTEND_URL=https://pramyan-assignment-hr-dashboard.vercel.app
LOCAL_BACKEND_URL=http://localhost:5001
HOSTED_BACKEND_URL=https://pramyan-assignment.onrender.com

# CORS Configuration (comma-separated origins allowed)
CORS_ORIGIN=http://localhost:3000,https://pramyan-assignment-hr-dashboard.vercel.app

# Dual Token Authentication (Configurable Secrets & Expirations via ENV)
JWT_ACCESS_SECRET=your_access_token_super_secret_key_change_me
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_super_secret_key_change_me
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend Environment Configuration (`frontend/.env`)

Create `frontend/.env` (or copy from `frontend/.env.example`):

```ini
# Environment Mode: development | production
NODE_ENV=development
NEXT_PUBLIC_NODE_ENV=development

# Next.js Frontend Port (Default: 3000)
PORT=3000

# Application URLs (Local & Hosted)
NEXT_PUBLIC_LOCAL_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_HOSTED_FRONTEND_URL=https://pramyan-assignment-hr-dashboard.vercel.app
NEXT_PUBLIC_LOCAL_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_HOSTED_BACKEND_URL=https://pramyan-assignment.onrender.com

# Active Backend API URL for Server-Side and Client Proxies
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

---

## 2. Quick Start & Local Execution

### Master Runner (`scripts/dev.sh`)

The repository includes an automated master runner script that:
1. Verifies and copies missing `.env` files from `.env.example` templates.
2. Identifies and terminates any stale processes occupying ports `3000` or `5001`.
3. Validates and installs `pnpm` workspace dependencies.
4. Pre-builds the Next.js application bundle to verify compilation.
5. Verifies database connectivity and automatically seeds initial records if the database is empty.
6. Launches both backend and frontend concurrently with prefixed console output.

```bash
# Run Master Launcher
./scripts/dev.sh

# Optional Flags:
./scripts/dev.sh --seed    # Force reset and re-seed MongoDB database
./scripts/dev.sh --terms   # Open backend and frontend in separate macOS Terminal tabs
./scripts/dev.sh --open    # Automatically launch default browser at http://localhost:3000
```

---

## 3. Monorepo Scripts Reference

All commands can be executed from the root of the monorepo:

| Command | Description |
|---|---|
| `pnpm dev` | Executes `./scripts/dev.sh` full-stack runner |
| `pnpm dev:backend` | Starts the Express REST API server in development mode |
| `pnpm dev:frontend` | Starts the Next.js frontend development server |
| `pnpm build` | Builds the Next.js production application bundle |
| `pnpm seed` | Executes `backend/seed.js` to seed 26 employees & 30-day logs |
| `pnpm start` | Concurrently starts production server instances |

---

## 4. Database Seeding

To manually reset and populate the database with realistic demonstration data:

```bash
pnpm seed
```

This populates:
- **Default HR Admin**: `admin@pramyan.com` / `Admin@123`
- **26 Employees**: Distributed across 8 business departments (`Engineering`, `HR`, `Design`, `Finance`, `Sales`, `Marketing`, `Operations`, `Legal`).
- **30 Days (1 Full Month) Attendance History**: ~500+ realistic attendance logs with day-of-week weighted variance (higher leave probability on Fridays/Mondays).

---

## 5. Cloud Deployment Architecture

| Tier | Provider | Configuration |
|---|---|---|
| **Frontend** | **Vercel** | Next.js 16 App Router, Root directory: `frontend`, Build command: `pnpm build` |
| **Backend** | **Render** | Node.js Web Service, Root directory: `backend`, Build command: `pnpm install`, Start command: `node server.js` |
| **Database** | **MongoDB Atlas** | M0/M10 Cluster with automated TTL indexing on `refresh_tokens` and composite unique index on `attendances` |

### Production Environment Variables on Cloud Providers:

- **On Vercel (Frontend Settings)**:
  - `NEXT_PUBLIC_NODE_ENV`: `production`
  - `NEXT_PUBLIC_BACKEND_URL`: `https://pramyan-assignment.onrender.com`
  - `NEXT_PUBLIC_HOSTED_FRONTEND_URL`: `https://pramyan-assignment-hr-dashboard.vercel.app`
  - `NEXT_PUBLIC_HOSTED_BACKEND_URL`: `https://pramyan-assignment.onrender.com`

- **On Render (Backend Settings)**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render default) or `5001`
  - `MONGO_URI`: `mongodb+srv://<username>:<password>@...`
  - `CORS_ORIGIN`: `https://pramyan-assignment-hr-dashboard.vercel.app`
  - `HOSTED_FRONTEND_URL`: `https://pramyan-assignment-hr-dashboard.vercel.app`
  - `HOSTED_BACKEND_URL`: `https://pramyan-assignment.onrender.com`
  - `JWT_ACCESS_SECRET`: `<secure-random-string>`
  - `JWT_ACCESS_EXPIRES_IN`: `15m`
  - `JWT_REFRESH_SECRET`: `<secure-random-string>`
  - `JWT_REFRESH_EXPIRES_IN`: `7d`
