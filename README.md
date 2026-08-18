# Pramyan HR Management Dashboard

[![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20Express%205%20%7C%20MongoDB-6366f1.svg)](https://pramyan.com)
[![Package Manager](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io)
[![Design](https://img.shields.io/badge/Design-Stitch%20Corporate%20Light-emerald.svg)](#uiux-design-system)

An enterprise-grade, high-performance HR Management Dashboard built for the **Pramyan Full Stack Developer Intern Assignment**.

Designed with the **Stitch Corporate Light** design system (inspired by Linear, Deel, and Stripe) with clear typography, high-density workforce telemetry, dual-token security, and real-time attendance roll call.

---

## 🌐 Live Deployments & Demo

| Environment | Link / URL | Description |
|---|---|---|
| **Production App (Vercel)** | [https://pramyan-assignment-hr-dashboard.vercel.app](https://pramyan-assignment-hr-dashboard.vercel.app) | Live Next.js 16 Web Dashboard |
| **REST API Server (Render)** | [https://pramyan-assignment.onrender.com](https://pramyan-assignment.onrender.com) | Live Node.js / Express 5 API |
| **Database (Atlas Cloud)** | Hosted MongoDB Atlas Cluster | 8 Departments, 26 Employees, 500+ Historical Logs (30 Days) |
| **Video Walkthrough** | [`docs/demo-walkthrough.mov`](./docs/demo-walkthrough.mov) | Comprehensive screen recording walkthrough |

---

## ⚡ Master Runner

You can launch the entire full-stack project locally with a single command:

```bash
./scripts/dev.sh
```

### Runner Options & Flags:
```bash
./scripts/dev.sh           # Default: kills port conflicts, verifies dependencies, builds bundle & launches concurrently
./scripts/dev.sh --seed    # Force reset & re-seed MongoDB Atlas with 26 employees & 30-day logs
./scripts/dev.sh --terms   # Open backend and frontend in separate macOS Terminal windows
./scripts/dev.sh --open    # Automatically opens the browser at http://localhost:3000
```

---

## 🔐 Demo Credentials

| Key | Value |
|---|---|
| **Email** | `admin@pramyan.com` |
| **Password** | `Admin@123` |

*(A 1-click **"Auto-fill Demo"** button is built into the login screen).*

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, React Context + `useReducer`, Tailwind CSS v4, Zod Form Validation, Axios Interceptors (Token Auto-Refresh Queue), Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js 5, Dual-Token JWT Authentication (`jsonwebtoken`), MongoDB TTL `RefreshToken` Store, `bcryptjs`, `cookie-parser`, `cors`, Zod Request Validation Middleware |
| **Database** | MongoDB Atlas / Community, Mongoose 9 ORM |
| **Package Manager** | `pnpm` Monorepo Workspaces (`backend` + `frontend`) |
| **Design System** | Stitch Corporate Modern Theme (`Inter` + `JetBrains Mono`) |

---

## ✨ Core Features

1. **Authentication & Dual-Token Session Security**
   - Dual-Token Architecture: Short-lived Access Token (15m) + Long-lived Refresh Token (7d) stored in MongoDB Atlas with TTL auto-expiration.
   - Axios request & response interceptors with 401 automatic token refresh rotation and request replay queue.
   - Next.js edge route protection via `proxy.js` inspecting `accessToken` / `refreshToken` cookies.
   - 1-click demo credential autofill and password visibility toggle.

2. **Executive Overview & Workforce Analytics**
   - 4 executive metric cards with trend indicators and status telemetry.
   - Interactive Department Distribution Bar Chart (Recharts) with custom corporate tooltips.
   - Today's Check-In status bar with multi-segmented completion meter and real-time counts.
   - Past 28-day & 7-day attendance trend analytics computed via MongoDB aggregation pipelines.
   - Recent employee roster preview.

3. **Employee Directory & Full CRUD**
   - Add, View, Edit, and Delete employee records with all 8 required fields:
     `Name`, `Employee ID`, `Department`, `Designation`, `Email`, `Phone`, `Date of Joining`, `Status`.
   - Real-time debounced search by name, employee ID, or email (case-insensitive).
   - Filter by Department (`Engineering`, `HR`, `Finance`, `Sales`, `Marketing`, `Operations`, `Design`, `Legal`).
   - Filter by Account Status (`Active` vs `Inactive`).
   - **Export to CSV**: Client-side one-click CSV export of the full employee roster.
   - Add / Edit Employee Modal with client-side & server-side Zod validation and duplicate ID/email conflict alerts.
   - Delete confirmation modal with cascade cleanup of associated attendance logs.

4. **Daily Attendance Tracking & Logs**
   - Quick date navigation (`<`, `Today`, `>`) and calendar date picker (with weekend guard).
   - Daily Check-In Roll Call with 3-state segmented toggles: **Present** (Emerald), **Absent** (Rose), **On Leave** (Amber).
   - Instant atomic upsert — composite unique index `{ employeeId, date }` updates status without duplicate rows.
   - Slide-out **Employee Attendance History Drawer** showing individual attendance rates, total present/absent/leave counts, and chronological logs.

---

## 📁 Monorepo Structure

```
Pramyan_Assignment/
├── package.json                   # Root package definition & workspace scripts
├── pnpm-workspace.yaml            # Monorepo packages definition (backend + frontend)
├── pnpm-lock.yaml                 # Unified dependency lockfile
├── requirements.pdf               # Original assignment specification
├── .gitignore                     # Single unified gitignore for whole project
├── README.md                      # Primary project overview and setup
│
├── scripts/
│   └── dev.sh                     # Master runner (port cleaning, seed check, pre-build & launcher)
│
├── docs/                          # Comprehensive engineering documentation suite
│   ├── ARCHITECTURE.md            # System architecture, state management & subsystem design
│   ├── API_DOCUMENTATION.md       # Complete REST API specification & Zod schemas
│   ├── DATABASE_SCHEMA.md         # MongoDB schemas, ER diagram & index definitions
│   ├── UI_UX_DESIGN_SYSTEM.md     # Stitch Corporate design tokens & UI components
│   ├── SETUP_AND_DEPLOYMENT.md    # Local setup, environment config & cloud deployment
│   ├── DECISIONS_AND_ASSUMPTIONS.md # Engineering decisions, trade-offs & assumptions
│   └── demo-walkthrough.mov       # Screen recording video walkthrough
│
├── backend/                       # REST API Server (Express.js 5 & Node.js, Port 5001)
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection handler
│   ├── controllers/
│   │   ├── auth.controller.js     # Dual-token auth, cookie handler & token rotation
│   │   ├── employee.controller.js # Employee CRUD + search + filter
│   │   ├── attendance.controller.js# Attendance roll call & history logs
│   │   └── dashboard.controller.js# Workforce telemetry & 28-day aggregation pipelines
│   ├── middleware/
│   │   ├── auth.middleware.js     # Access token verification (Header & Cookie fallback)
│   │   ├── error.middleware.js    # Global centralized error handler
│   │   └── validate.middleware.js # Generic Zod schema validation middleware
│   ├── models/
│   │   ├── User.js                # Administrator schema
│   │   ├── RefreshToken.js        # MongoDB TTL refresh token session schema
│   │   ├── Employee.js            # 8-field employee schema with unique indexes
│   │   └── Attendance.js          # Composite unique index { employeeId, date }
│   ├── routes/
│   │   ├── auth.routes.js         # Auth routes with Zod validation
│   │   ├── employee.routes.js     # Employee routes with Zod validation
│   │   ├── attendance.routes.js   # Attendance routes with Zod validation
│   │   └── dashboard.routes.js    # Dashboard telemetry routes
│   ├── validations/
│   │   ├── auth.validation.js     # Zod login & refresh schemas
│   │   ├── employee.validation.js # Zod employee creation & update schemas
│   │   └── attendance.validation.js# Zod attendance roll call schema
│   ├── seed.js                    # Database seeder (26 employees & 30-day attendance logs)
│   ├── server.js                  # Express application entry point & CORS configuration
│   ├── package.json               # Backend dependencies & scripts
│   ├── .env                       # Backend local environment configuration
│   └── .env.example               # Backend environment template
│
└── frontend/                      # Web Dashboard (Next.js 16 App Router & React 19, Port 3000)
    ├── app/
    │   ├── dashboard/
    │   │   ├── attendance/
    │   │   │   └── page.jsx       # Daily roll call, calendar & attendance history drawer
    │   │   ├── employees/
    │   │   │   └── page.jsx       # Employee directory table, search, filters & CSV export
    │   │   ├── layout.jsx         # Dashboard shell (Sidebar + Topbar wrapper)
    │   │   └── page.jsx           # Executive overview metrics & chart visualizations
    │   ├── login/
    │   │   └── page.jsx           # Login page with 1-click autofill & Zod validation
    │   ├── globals.css            # Corporate light theme styles & Tailwind CSS v4 tokens
    │   ├── layout.js              # Pure JavaScript root HTML layout & metadata
    │   ├── page.js                # Root redirection to /dashboard or /login
    │   └── providers.jsx          # React Context Provider wrapper (Auth + Dashboard)
    ├── components/
    │   ├── EmployeeModal.jsx      # Add / Edit Employee modal with client-side Zod validation
    │   ├── Sidebar.jsx            # Fixed navigation rail & logout action
    │   ├── StatCard.jsx           # Executive metric card with status badges
    │   └── Topbar.jsx             # System status strip & administrator profile badge
    ├── context/
    │   ├── AuthContext.jsx        # Authentication session management & cookies
    │   └── DashboardContext.jsx   # Global shared state for workforce metrics & roster
    ├── reducers/
    │   ├── authReducer.js         # Auth state transitions & action types
    │   └── dashboardReducer.js    # Dashboard state transitions & action types
    ├── lib/
    │   ├── api.js                 # Configured Axios client with automatic 401 token refresh queue
    │   └── validations.js         # Client-side Zod schemas for employee & login forms
    ├── next.config.mjs            # Next.js configuration with /api/* proxy rewrites
    ├── proxy.js                   # Edge route guard checking dual-token cookies
    ├── jsconfig.json              # Path aliases configuration (@/*)
    ├── postcss.config.mjs         # PostCSS configuration with Tailwind v4
    ├── package.json               # Frontend dependencies & scripts
    ├── README.md                  # Frontend package documentation
    ├── .env                       # Frontend local environment configuration
    └── .env.example               # Frontend environment template
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env` & `backend/.env.example`)
```ini
# Environment Mode: development | production
NODE_ENV=development

# Server Port (Default: 5001)
PORT=5001

# MongoDB Connection String (Atlas or Local)
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

### Frontend (`frontend/.env` & `frontend/.env.example`)
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

## 📖 Detailed Engineering Documentation

For in-depth architectural diagrams, API schemas, and deployment guides, refer to the [`docs/`](./docs) directory:
- [System Architecture](./docs/ARCHITECTURE.md)
- [REST API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema & Models](./docs/DATABASE_SCHEMA.md)
- [UI/UX Design System Specification](./docs/UI_UX_DESIGN_SYSTEM.md)
- [Setup & Cloud Deployment Guide](./docs/SETUP_AND_DEPLOYMENT.md)
- [Decisions & Assumptions](./docs/DECISIONS_AND_ASSUMPTIONS.md)
