# Engineering Decisions & Project Assumptions

This document outlines key technical decisions, trade-offs, and assumptions made during development.

---

## 1. Architectural Decisions

### Monorepo Structure with `pnpm`
- **Rationale**: Isolates client-side React code from server-side Express code while allowing single-command workspace installs (`pnpm install`), unified builds (`pnpm build`), and concurrent development (`pnpm dev`).
- **Unified Ignore**: One single `.gitignore` at the monorepo root governs all packages, build artifacts, `.env` secrets, and dependency stores.

### Backend on Port `5001` (Avoiding Port `5000`)
- **Rationale**: On macOS Monterey, Ventura, and Sonoma, Apple's AirPlay Receiver daemon (`AirTunes`) binds to port `5000` by default. Moving the backend to port `5001` eliminates silent 403 Forbidden errors.

### Next.js Proxy Rewrites (`/api/*` → `http://localhost:5001/api/*`)
- **Rationale**: Enables frontend components to communicate with `/api/...` without hardcoding cross-origin URLs in client code, while preserving standard CORS fallback for direct API access.

### Route Guard Middleware (`proxy.js`)
- **Rationale**: Next.js 16 supports proxy-based route inspection. We store the session JWT in both `localStorage` (for Axios interceptors) and `document.cookie` (for server-side middleware route guards), ensuring unauthenticated access to `/dashboard/*` is blocked before page rendering.

---

## 2. Data & Attendance Design Decisions

### Idempotent Attendance Upsert
- **Problem**: Marking attendance multiple times in a single day for the same employee shouldn't create duplicate records.
- **Solution**: A composite unique index on `(employeeId, date)` in MongoDB coupled with `findOneAndUpdate({ employeeId, date }, ..., { upsert: true, returnDocument: 'after' })` ensures atomic, duplicate-free daily tracking.

### Date Formatting (`YYYY-MM-DD`)
- **Rationale**: Storing dates as ISO strings `YYYY-MM-DD` eliminates timezone offset drift when querying attendance records across different client locales.

---

## 3. Assumptions

1. **Single HR Administrator**: The assignment scope requires authentication for an HR admin. Hardcoded credentials (`admin@pramyan.com` / `Admin@123`) are provided with JWT token issuance.
2. **Pre-defined Departments**: 8 standard business units (`Engineering`, `HR`, `Finance`, `Sales`, `Marketing`, `Operations`, `Design`, `Legal`).
3. **Active vs. Inactive Staffing**: Attendance marking focuses on active staff members, while inactive employees remain accessible in the Employee Directory for historical auditing.
