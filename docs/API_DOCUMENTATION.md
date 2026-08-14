# API Documentation — Pramyan HR Management System

Base URL: `http://localhost:5001/api` (proxied by Next.js via `/api/*` on `http://localhost:3000`)

---

## 1. Authentication Endpoints (Dual Token Architecture)

The system implements enterprise-grade **Dual Token Authentication**:
1. **Access Token (Short-lived 15m)**: Sent in response JSON and `accessToken` cookie for fast stateless verification.
2. **Refresh Token (Long-lived 7d)**: Stored in **MongoDB Atlas** (`refresh_tokens` collection) and sent in secure HTTP-only `refreshToken` cookie.

### `POST /api/auth/login`
- **Description**: Authenticates administrator credentials and returns access token + refresh token.
- **Request Body** *(Zod Validated)*:
  ```json
  {
    "email": "admin@pramyan.com",
    "password": "Admin@123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "message": "Authentication successful",
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "ac651282994f2e4963...",
    "user": {
      "id": "admin_001",
      "name": "HR Admin",
      "email": "admin@pramyan.com",
      "role": "Admin"
    }
  }
  ```
- **Set-Cookie Headers**:
  - `accessToken`: Max-Age 900s, Path `/`, SameSite `Lax`
  - `refreshToken`: Max-Age 604800s, Path `/`, HttpOnly, SameSite `Lax`

### `POST /api/auth/refresh`
- **Description**: Verifies refresh token stored in MongoDB Atlas, rotates tokens, and returns a new Access Token.
- **Request Body / Cookie**: `{ "refreshToken": "<token>" }` or via HTTP-only cookie.
- **Response `200 OK`**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "b3e94118..."
  }
  ```

### `POST /api/auth/logout`
- **Description**: Revokes active refresh token from MongoDB Atlas and clears cookies.
- **Response `200 OK`**:
  ```json
  {
    "message": "Successfully signed out and revoked active session"
  }
  ```

### `GET /api/auth/me` *(Protected)*
- **Description**: Retrieves current administrator profile from access token.
- **Headers**: `Authorization: Bearer <accessToken>`

---

## 2. Employee Endpoints *(Protected)*

All employee endpoints require `Authorization: Bearer <accessToken>` header or valid `accessToken` cookie.

### `GET /api/employees`
- **Query Parameters**:
  - `search` *(optional)*: Case-insensitive search on `name`, `employeeId`, or `email`.
  - `department` *(optional)*: Filter by department (`Engineering`, `HR`, `Finance`, etc.).
  - `status` *(optional)*: Filter by `Active` or `Inactive`.
- **Response `200 OK`**: Array of Employee objects.

### `GET /api/employees/:id`
- **Description**: Get employee by MongoDB ObjectID.

### `POST /api/employees` *(Zod Validated)*
- **Request Body**:
  ```json
  {
    "name": "Arjun Mehta",
    "employeeId": "EMP001",
    "department": "Engineering",
    "designation": "Staff Software Engineer",
    "email": "arjun.mehta@pramyan.com",
    "phone": "+91-9876543210",
    "dateOfJoining": "2021-03-15",
    "status": "Active"
  }
  ```

### `PUT /api/employees/:id` *(Zod Validated)*
- **Description**: Update employee record.

### `DELETE /api/employees/:id`
- **Description**: Delete employee and cascades delete to associated attendance records.

---

## 3. Attendance Endpoints *(Protected)*

### `GET /api/attendance`
- **Query Parameters**:
  - `date` *(optional)*: `YYYY-MM-DD` string.
  - `employeeId` *(optional)*: Employee MongoDB ID.
  - `department` *(optional)*: Department name filter.
- **Response `200 OK`**: Array of attendance records with populated `employeeId`.

### `POST /api/attendance` *(Zod Validated)*
- **Description**: Atomic upsert daily attendance record.
- **Request Body**:
  ```json
  {
    "employeeId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "date": "2026-08-17",
    "status": "Present"
  }
  ```
- **Allowed Statuses**: `Present`, `Absent`, `On Leave`.

---

## 4. Dashboard Analytics & Past 28-Day Endpoints *(Protected)*

### `GET /api/dashboard/stats`
- **Description**: Computes live real-time workforce metrics and past 28-day company trends from MongoDB Atlas aggregations.
- **Response `200 OK`**:
  ```json
  {
    "totalEmployees": 26,
    "activeEmployees": 24,
    "inactiveEmployees": 2,
    "activeRate": 92,
    "inactiveRate": 8,
    "todayAttendanceRate": 81,
    "departmentBreakdown": [
      { "department": "Engineering", "count": 7 },
      { "department": "HR", "count": 3 },
      { "department": "Design", "count": 3 },
      { "department": "Finance", "count": 3 },
      { "department": "Sales", "count": 3 },
      { "marketing": "Marketing", "count": 3 },
      { "department": "Operations", "count": 2 },
      { "department": "Legal", "count": 2 }
    ],
    "todayAttendance": {
      "Present": 17,
      "Absent": 0,
      "On Leave": 4
    },
    "past28DaysData": {
      "trend": [
        { "date": "2026-07-21", "day": "Tue", "label": "Jul 21", "shortLabel": "21 Jul", "Present": 20, "On Leave": 2, "Absent": 2, "total": 24, "rate": 83 }
      ],
      "avgRate28": 81,
      "totalPresent28": 384,
      "totalLeaves28": 57,
      "totalAbsent28": 36,
      "peakDay": "Aug 12 (88%)",
      "daysWithLogs": 20
    },
    "pastWeekData": {
      "trend": [
        { "date": "2026-08-11", "day": "Tue", "label": "Aug 11", "shortLabel": "11 Aug", "Present": 20, "On Leave": 2, "Absent": 2, "total": 24, "rate": 83 }
      ],
      "weeklyAvgRate": 81,
      "totalPresentWeek": 97,
      "totalLeavesWeek": 14,
      "totalAbsentWeek": 9,
      "peakDay": "Wed (88%)",
      "daysWithLogs": 5
    },
    "today": "2026-08-17"
  }
  ```
