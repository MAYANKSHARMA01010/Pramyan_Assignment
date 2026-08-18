# Pramyan HR Management Dashboard

[![Stack](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20Express%205%20%7C%20MongoDB-6366f1.svg)](https://pramyan.com)
[![Package Manager](https://img.shields.io/badge/pnpm-workspace-orange.svg)](https://pnpm.io)
[![Design](https://img.shields.io/badge/Design-Stitch%20Executive%20Slate-emerald.svg)](#uiux-design-system)

An enterprise-grade, high-performance HR Management Dashboard built for the **Pramyan Full Stack Developer Intern Assignment**.

Designed with the **Stitch Executive Slate** design system (inspired by Linear, Supabase, and Stripe) with deep dark mode aesthetics, high-density telemetry, and real-time attendance roll call.

---

## 🌐 Live Deployments & Demo

| Environment | Link / URL | Description |
|---|---|---|
| **Production App (Vercel)** | [https://pramyan-assignment-hr-dashboard.vercel.app](https://pramyan-assignment-hr-dashboard.vercel.app) | Live Next.js 16 Web Dashboard |
| **REST API Server (Render)** | [https://pramyan-assignment.onrender.com](https://pramyan-assignment.onrender.com) | Live Node.js / Express API |
| **Database (Atlas Cloud)** | MongoDB Atlas | 8 Departments, 26 Employees, 500+ Logs |
| **Video Walkthrough** | [`docs/demo-walkthrough.mov`](./docs/demo-walkthrough.mov) | 1-2 min comprehensive screen recording |

---

## ⚡ Master Runner

You can launch the entire project locally with a single command:

```bash
./scripts/dev.sh
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
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js 5, JWT Authentication (jsonwebtoken), bcryptjs, CORS |
| **Database** | MongoDB Community / Atlas, Mongoose 9 ORM |
| **Package Manager** | `pnpm` Monorepo Workspaces |
| **Design System** | Stitch Executive Slate Theme (`Inter` + `JetBrains Mono`) |

---

## ✨ Core Features

1. **Authentication & Session Security**
   - JWT-based authentication with edge route protection (`proxy.js`).
   - Secure token storage in `localStorage` + `cookie` for synchronous server redirects.
   - 1-click demo autofill and password visibility toggle.

2. **Executive Overview & Workforce Analytics**
   - 4 executive metric cards with trend indicators and status telemetry.
   - Interactive Department Distribution Bar Chart (Recharts) with custom dark mode tooltips.
   - Today's Check-In status bar with multi-segmented completion meter and real-time counts.
   - Recent employee roster preview.

3. **Employee Directory & Full CRUD**
   - Add, View, Edit, and Delete employee records with all 8 required fields:
     `Name`, `Employee ID`, `Department`, `Designation`, `Email`, `Phone`, `Date of Joining`, `Status`.
   - Real-time debounced search by name (case-insensitive).
   - Filter by Department (`Engineering`, `HR`, `Finance`, `Sales`, `Marketing`, `Operations`, `Design`, `Legal`).
   - Filter by Account Status (`Active` vs `Inactive`).
   - **Export to CSV**: Client-side one-click CSV export of the full employee roster.
   - Add / Edit Employee Modal with form validation and duplicate ID/email conflict alerts.
   - Delete confirmation modal with destructive safety guard.

4. **Daily Attendance Tracking & Logs**
   - Quick date navigation (`<`, `Today`, `>`) and calendar picker.
   - Daily Check-In Roll Call with 3-state segmented toggles: **Present** (Emerald), **Absent** (Rose), **On Leave** (Amber).
   - Instant atomic upsert — marking status updates the record without creating duplicate entries.
   - Slide-out **Employee Attendance History Drawer** showing individual attendance rates and chronological logs.

---

## 📁 Monorepo Structure

```
Pramyan_ Assignment/
├── package.json              # Monorepo root with pnpm workspace scripts
├── pnpm-workspace.yaml       # Workspace configuration (backend + frontend)
├── run.sh                    # Unified startup runner script
├── .gitignore                # Single unified gitignore for whole project
├── README.md
│
├── docs/                     # Comprehensive documentation suite
│   ├── ARCHITECTURE.md       # Architecture & subsystem design
│   ├── API_DOCUMENTATION.md  # Complete REST API specification
│   ├── DATABASE_SCHEMA.md    # MongoDB schemas, ER diagram & indexes
│   ├── UI_UX_DESIGN_SYSTEM.md# Stitch Executive Slate design tokens
│   ├── SETUP_AND_DEPLOYMENT.md# Setup & cloud deployment guide
│   └── DECISIONS_AND_ASSUMPTIONS.md # Engineering decisions & assumptions
│
├── backend/                  # REST API server (Port 5001)
│   ├── .env                  # Backend environment
│   ├── .env.example          # Environment template
│   ├── server.js
│   ├── seed.js
│   ├── middleware/auth.js
│   ├── models/Employee.js
│   ├── models/Attendance.js
│   └── routes/
│
└── frontend/                 # Next.js 16 Web Application (Port 3000)
    ├── .env.local            # Frontend environment
    ├── .env.example          # Environment template
    ├── next.config.ts        # Next.js config with /api/* proxy rewrite
    ├── proxy.js              # Route guard & cookie verification
    ├── lib/api.js            # Axios client with JWT interceptor
    ├── components/           # Reusable UI components
    └── app/                  # Next.js App Router pages
```

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```ini
PORT=5001
MONGO_URI=mongodb://localhost:27017/hr_dashboard
JWT_SECRET=pramyan_hr_jwt_secret_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```ini
PORT=3000
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
