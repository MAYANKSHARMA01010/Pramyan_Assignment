# Setup and Deployment Guide

## 1. Environment Configuration

### Backend `.env` (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hr_dashboard?retryWrites=true&w=majority

# Application URLs (Local & Hosted)
LOCAL_FRONTEND_URL=http://localhost:3000
HOSTED_FRONTEND_URL=https://pramyan-assignment-hr-dashboard.vercel.app
LOCAL_BACKEND_URL=http://localhost:5001
HOSTED_BACKEND_URL=https://pramyan-assignment.onrender.com

# CORS Configuration (comma-separated origins allowed)
CORS_ORIGIN=http://localhost:3000,https://pramyan-assignment-hr-dashboard.vercel.app

# Dual Token Authentication (Configurable Secrets & Expirations via ENV)
JWT_ACCESS_SECRET=pramyan_access_token_secret_auth_2026_x89a1b2c3
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=pramyan_refresh_token_vault_secret_2026_z98y7x6w5
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend `.env` (`frontend/.env`)
```env
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

## 2. Quick Start

### Start Full Stack (Backend + Frontend)
```bash
./scripts/dev.sh
```

### Seed MongoDB Atlas Database
```bash
pnpm seed
```

---

## 3. Architecture Overview
- **Frontend**: Next.js 16 (Turbopack, Pure JavaScript `.js`/`.jsx`, React Context + `useReducer`, Zod validation, Axios with 401 token refresh rotation).
- **Backend**: Express.js REST API on Port `5001` (Dual Token Authentication with distinct `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`, Zod request validation middleware).
- **Database**: Hosted MongoDB Atlas (`pramyanassignment.igzfs1s.mongodb.net`).
