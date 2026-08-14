# System Architecture & Folder Structure

---

## 1. Project Organization (Clean Monorepo)

```
Pramyan_Assignment/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection handler
│   ├── controllers/
│   │   ├── auth.controller.js     # 2-token auth & MongoDB session rotation
│   │   ├── employee.controller.js # Employee CRUD + search + filter
│   │   ├── attendance.controller.js# Attendance roll call & history logs
│   │   └── dashboard.controller.js # Aggregated telemetry & metrics
│   ├── middleware/
│   │   ├── auth.middleware.js     # Access token verification (Header/Cookie)
│   │   ├── validate.middleware.js # Generic Zod schema validation middleware
│   │   └── error.middleware.js    # Global error handler
│   ├── models/
│   │   ├── User.js                # Admin user schema
│   │   ├── RefreshToken.js        # MongoDB-stored refresh token schema (TTL)
│   │   ├── Employee.js            # 8-field employee schema
│   │   └── Attendance.js          # Composite unique index { employeeId, date }
│   ├── routes/
│   │   ├── auth.routes.js         # Auth routing (Zod validated)
│   │   ├── employee.routes.js     # Employee routing (Zod validated)
│   │   ├── attendance.routes.js   # Attendance routing (Zod validated)
│   │   └── dashboard.routes.js    # Dashboard telemetry routing
│   ├── validations/
│   │   ├── auth.validation.js     # Zod login & refresh schemas
│   │   ├── employee.validation.js # Zod employee creation & update schemas
│   │   └── attendance.validation.js# Zod attendance roll call schema
│   ├── .env                       # Environment configuration (Atlas URI, JWT secret)
│   ├── seed.js                    # Seeder populating 12 employees & 14 days of logs
│   ├── server.js                  # Express entry point
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.js              # Pure JavaScript root layout
│   │   ├── page.js                # Root redirection
│   │   ├── globals.css            # Corporate modern light theme tokens
│   │   ├── login/
│   │   │   └── page.jsx           # Clean corporate login (Zod validated)
│   │   └── dashboard/
│   │       ├── layout.jsx         # Sidebar + Topbar layout wrapper
│   │       ├── page.jsx           # Executive overview dashboard
│   │       ├── employees/
│   │       │   └── page.jsx       # Employee directory & CSV export
│   │       └── attendance/
│   │           └── page.jsx       # Daily roll call & history drawer
│   ├── components/
│   │   ├── Sidebar.jsx            # Navigation rail & logout action
│   │   ├── Topbar.jsx             # Status strip & administrator badge
│   │   ├── StatCard.jsx           # High-clarity corporate metric card
│   │   └── EmployeeModal.jsx      # Clean Add/Edit Employee dialog (Zod validated)
│   ├── lib/
│   │   ├── api.js                 # Axios instance with 2-token auto-refresh (no fetch)
│   │   └── validations.js         # Client-side Zod schemas for forms
│   ├── proxy.js                   # Edge route guard checking dual token cookies
│   ├── jsconfig.json              # Pure JavaScript path aliases (@/*)
│   ├── next.config.mjs            # Next.js configuration with API proxy rewrites
│   ├── .env.local
│   ├── .env.example
│   └── package.json
│
├── docs/                          # Architecture & API documentation suite
├── scripts/
│   └── dev.sh                     # Master runner (port cleaning, seeding, launcher)
├── pnpm-workspace.yaml            # Monorepo packages config
├── .gitignore                     # Single root ignore file
├── README.md
└── package.json                   # Monorepo root scripts
```

---

## 2. Validation & HTTP Standards
- **Zod Everywhere**: Request payloads in the backend are parsed and validated with Zod schemas via `validate.middleware.js`. Frontend forms are validated client-side with Zod before network submission for instant feedback.
- **Axios Exclusively**: All HTTP communications use the configured Axios client in `frontend/lib/api.js` with automatic request interceptors (token injection) and response interceptors (token refresh rotation). No native `fetch` is used.
