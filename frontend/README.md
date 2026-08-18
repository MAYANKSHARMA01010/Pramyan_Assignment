# Pramyan HR Management — Frontend Web Application

The frontend client for the Pramyan HR Management System, built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 (`react`, `react-dom`)
- **State Management**: React 19 Context API + `useReducer` (`AuthContext`, `DashboardContext`)
- **Styling**: Tailwind CSS v4 (PostCSS)
- **Validation**: Zod client-side form validation schemas
- **HTTP Client**: Axios with automatic 401 token refresh queue & cookie credentials
- **Visuals & Charts**: Recharts & Lucide React Icons

---

## 📁 File Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── attendance/
│   │   │   └── page.jsx       # Daily roll call, date picker & history drawer
│   │   ├── employees/
│   │   │   └── page.jsx       # Employee directory table, filters & CSV export
│   │   ├── layout.jsx         # Dashboard shell (Sidebar + Topbar wrapper)
│   │   └── page.jsx           # Executive overview & department charts
│   ├── login/
│   │   └── page.jsx           # Login screen with 1-click demo autofill
│   ├── globals.css            # Corporate theme variables & base styles
│   ├── layout.js              # Root layout & font configurations
│   ├── page.js                # Root redirection
│   └── providers.jsx          # Context providers wrapper (Auth + Dashboard)
├── components/
│   ├── EmployeeModal.jsx      # Add / Edit Employee modal with Zod validation
│   ├── Sidebar.jsx            # Fixed navigation rail
│   ├── StatCard.jsx           # Executive metric cards
│   └── Topbar.jsx             # System status & user profile banner
├── context/
│   ├── AuthContext.jsx        # Authentication session management
│   └── DashboardContext.jsx   # Global workforce state & roster actions
├── reducers/
│   ├── authReducer.js         # Auth state actions & transitions
│   └── dashboardReducer.js    # Dashboard data actions & transitions
├── lib/
│   ├── api.js                 # Axios instance with 401 refresh token interceptor
│   └── validations.js         # Zod schemas for forms
├── next.config.mjs            # Next.js config with /api/* proxy rewrites
├── proxy.js                   # Edge route guard checking dual-token cookies
├── jsconfig.json              # Path aliases configuration (@/*)
├── package.json
├── .env                       # Local environment variables
└── .env.example               # Environment variables template
```

---

## ⚙️ Environment Variables (`frontend/.env`)

```ini
# Environment Mode: development | production
NODE_ENV=development
NEXT_PUBLIC_NODE_ENV=development

# Frontend Port
PORT=3000

# Application URLs (Local & Hosted)
NEXT_PUBLIC_LOCAL_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_HOSTED_FRONTEND_URL=https://pramyan-assignment-hr-dashboard.vercel.app
NEXT_PUBLIC_LOCAL_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_HOSTED_BACKEND_URL=https://pramyan-assignment.onrender.com

# Active Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

---

## 🚀 Development Scripts

From the repository root or inside the `frontend` directory:

```bash
# Start frontend development server
pnpm --filter frontend dev

# Build production bundle
pnpm --filter frontend build

# Start production server
pnpm --filter frontend start

# Run ESLint check
pnpm --filter frontend lint
```
