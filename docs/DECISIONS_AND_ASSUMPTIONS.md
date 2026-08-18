# Engineering Decisions & Project Assumptions

This document outlines key technical decisions, trade-offs, architecture choices, and assumptions made during the development of the Pramyan HR Management System.

---

## 1. Architectural & Subsystem Decisions

### Monorepo Structure with `pnpm` Workspaces
- **Rationale**: Isolates client-side React code (`frontend`) from server-side Express code (`backend`) while enabling unified dependency management, cross-package scripts (`pnpm dev`, `pnpm build`, `pnpm seed`), and fast disk-space-efficient symlinked node modules.
- **Unified Ignore**: A single root `.gitignore` governs build artifacts (`.next/`, `dist/`), environment secrets (`.env`), and OS files.

### Backend on Port `5001` (Avoiding macOS Port `5000` Conflict)
- **Rationale**: On macOS Monterey, Ventura, and Sonoma, Apple's AirPlay Receiver daemon (`AirTunes`) binds to port `5000` by default. Binding the Express backend to port `5001` permanently eliminates silent `403 Forbidden` or `EADDRINUSE` errors on macOS development machines.

### Next.js Proxy Rewrites (`/api/*` → `http://localhost:5001/api/*`)
- **Rationale**: Enables frontend components to issue relative requests to `/api/...` in production or development without hardcoding origin URLs across UI components, while preserving standard CORS support for external clients.

### Dual Token Authentication & MongoDB TTL Session Store
- **Rationale**: Combining a short-lived Access Token (15m) with a long-lived Refresh Token (7d) limits the blast radius of token compromise. Storing refresh tokens in MongoDB Atlas with a native **TTL (Time-To-Live) index** ensures expired sessions are automatically purged by MongoDB without needing cron scripts.

### Axios Interceptors & Automatic 401 Replay Queue
- **Rationale**: Axios is used across the frontend with request/response interceptors. When an access token expires mid-session, Axios catches the `401 Unauthorized`, queues concurrent requests, calls `/api/auth/refresh` to obtain new tokens, and transparently replays all pending calls without disrupting the user experience.

### State Management via React 19 Context + `useReducer`
- **Rationale**: Using React's built-in `createContext` and `useReducer` provides predictable, deterministic state transitions (`authReducer.js`, `dashboardReducer.js`) without introducing heavy external state libraries (e.g. Redux Toolkit or Zustand).

### End-to-End Schema Validation with Zod
- **Rationale**: Zod provides runtime validation on both ends of the wire. In the backend, `validate.middleware.js` ensures that incoming HTTP payloads strictly match schemas before reaching business logic. In the frontend, client forms validate input synchronously for real-time error messaging.

---

## 2. Data & Attendance Design Decisions

### Idempotent Attendance Upsert
- **Problem**: Repeatedly toggling or updating attendance for an employee on the same date should not generate duplicate logs.
- **Solution**: A composite unique index on `(employeeId, date)` in MongoDB coupled with `findOneAndUpdate({ employeeId, date }, ..., { upsert: true, returnDocument: 'after' })` ensures atomic, duplicate-free daily tracking.

### Date Formatting (`YYYY-MM-DD`)
- **Rationale**: Storing attendance dates as canonical ISO strings (`YYYY-MM-DD`) eliminates timezone offset drift when querying attendance records across different client locales and daylight saving shifts.

### Weekend Attendance Guard
- **Rationale**: The business requirements focus on standard workdays (Monday through Friday). The backend and frontend explicitly prevent marking attendance on Saturdays and Sundays.

### Cascading Deletion for Employees
- **Rationale**: Deleting an employee permanently removes their profile from `employees` and immediately triggers a cascade cleanup of all associated attendance logs in `attendances` to prevent orphaned database records.

---

## 3. Assumptions & Seed Data

1. **HR Administrator Profile**: The assignment requires administrative access for HR personnel. Seeded credentials (`admin@pramyan.com` / `Admin@123`) are provided, complemented by a 1-click **"Auto-fill Demo"** button on the login screen.
2. **8 Pre-defined Business Departments**: `Engineering`, `HR`, `Finance`, `Sales`, `Marketing`, `Operations`, `Design`, `Legal`.
3. **Comprehensive Seed Dataset**: The database seeder generates 26 employees across all 8 departments and creates 30 days (~500+ records) of realistic attendance logs with day-of-week weighted probability (e.g. natural variance on Mondays and Fridays).
4. **Active vs. Inactive Staffing**: Attendance roll call focuses on active staff members, while inactive employees remain accessible in the Employee Directory for historical auditing.
