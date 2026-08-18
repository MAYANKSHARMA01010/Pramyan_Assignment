# REST API Documentation — Pramyan HR Management System

- **Local Backend Base URL**: `http://localhost:5001/api` (proxied by Next.js via `/api/*` on `http://localhost:3000`)
- **Hosted Backend Base URL**: `https://pramyan-assignment.onrender.com/api`

All protected endpoints require an `Authorization: Bearer <accessToken>` header or a valid `accessToken` cookie.

---

## 1. Authentication Endpoints (Dual Token Architecture)

The system implements enterprise-grade **Dual Token Authentication**:
1. **Access Token (Short-lived 15m)**: Used for stateless route authorization across API endpoints.
2. **Refresh Token (Long-lived 7d)**: Stored in **MongoDB Atlas** (`refresh_tokens` collection) with TTL indexing; used to rotate and issue new access tokens.

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
    "refreshToken": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "admin_001",
      "name": "HR Admin",
      "email": "admin@pramyan.com",
      "role": "Admin"
    }
  }
  ```
- **Set-Cookie Headers**:
  - `accessToken`: `Max-Age=900; Path=/; SameSite=Lax` (plus `Secure` in production)
  - `refreshToken`: `Max-Age=604800; Path=/; HttpOnly; SameSite=Lax` (plus `Secure` in production)

---

### `POST /api/auth/refresh`
- **Description**: Cryptographically verifies the refresh token, validates existence against MongoDB Atlas, rotates the token in the database, and returns a new access token and rotated refresh token.
- **Request Body / Cookie**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1Ni..."
  }
  ```
  *(Or automatically parsed from `refreshToken` cookie)*
- **Response `200 OK`**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "eyJhbGciOiJIUzI1Ni..."
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Refresh token missing.
  - `403 Forbidden`: Token revoked, expired, or invalid cryptographic signature.

---

### `POST /api/auth/logout`
- **Description**: Revokes the active refresh token from MongoDB Atlas and clears session cookies.
- **Request Body / Cookie**: `{ "refreshToken": "<token>" }` or cookie.
- **Response `200 OK`**:
  ```json
  {
    "message": "Successfully signed out and revoked active session"
  }
  ```

---

### `GET /api/auth/me` *(Protected)*
- **Description**: Retrieves the currently authenticated administrator profile from the access token payload.
- **Headers**: `Authorization: Bearer <accessToken>`
- **Response `200 OK`**:
  ```json
  {
    "user": {
      "userId": "admin_001",
      "email": "admin@pramyan.com",
      "name": "HR Admin",
      "role": "Admin"
    }
  }
  ```

---

## 2. Employee Endpoints *(Protected)*

All employee endpoints are guarded by `auth.middleware.js` and input is validated with Zod schemas.

### `GET /api/employees`
- **Description**: Retrieves the list of employees matching optional query filters, sorted by creation date descending.
- **Query Parameters**:
  - `search` *(string, optional)*: Case-insensitive search on `name`, `employeeId`, or `email`.
  - `department` *(string, optional)*: Exact match filter by department name (`Engineering`, `HR`, `Finance`, `Sales`, `Marketing`, `Operations`, `Design`, `Legal`).
  - `status` *(string, optional)*: Filter by `Active` or `Inactive`.
- **Response `200 OK`**:
  ```json
  [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c001",
      "name": "Arjun Mehta",
      "employeeId": "EMP001",
      "department": "Engineering",
      "designation": "Staff Software Engineer",
      "email": "arjun.mehta@pramyan.com",
      "phone": "+91-9876543210",
      "dateOfJoining": "2021-03-15T00:00:00.000Z",
      "status": "Active",
      "createdAt": "2026-08-17T10:00:00.000Z",
      "updatedAt": "2026-08-17T10:00:00.000Z"
    }
  ]
  ```

---

### `GET /api/employees/:id`
- **Description**: Retrieves single employee profile by MongoDB `_id`.
- **Response `200 OK`**: Single employee object.
- **Response `404 Not Found`**: `{ "message": "Employee not found" }`

---

### `POST /api/employees` *(Zod Validated)*
- **Description**: Creates a new employee record.
- **Request Body**:
  ```json
  {
    "name": "Rohan Gupta",
    "employeeId": "EMP003",
    "department": "Engineering",
    "designation": "Senior Frontend Architect",
    "email": "rohan.gupta@pramyan.com",
    "phone": "+91-9876543212",
    "dateOfJoining": "2023-04-10",
    "status": "Active"
  }
  ```
- **Validation Rules**:
  - `name`: String, minimum 2 characters (required)
  - `employeeId`: Alphanumeric string, minimum 2 characters (required, unique)
  - `department`: Enum of 8 departments (required)
  - `designation`: String, minimum 2 characters (required)
  - `email`: Valid email format (required, unique, case-insensitive)
  - `phone`: String, minimum 7 characters (required)
  - `dateOfJoining`: Valid ISO date string (required)
  - `status`: Enum `Active` | `Inactive` (default: `Active`)
- **Response `201 Created`**: Newly created employee document.
- **Error Responses**:
  - `400 Bad Request`: Field validation error or duplicate `employeeId` / `email`.

---

### `PUT /api/employees/:id` *(Zod Validated)*
- **Description**: Updates an existing employee profile by `_id`. Validates unique constraints if `employeeId` or `email` are modified.
- **Response `200 OK`**: Updated employee document.
- **Response `404 Not Found`**: `{ "message": "Employee not found" }`

---

### `DELETE /api/employees/:id`
- **Description**: Permanently deletes an employee record and automatically cascades deletion to all associated attendance logs in `attendances`.
- **Response `200 OK`**:
  ```json
  {
    "message": "Employee Rohan Gupta deleted successfully"
  }
  ```

---

## 3. Attendance Endpoints *(Protected)*

### `GET /api/attendance`
- **Description**: Retrieves attendance records with populated employee profile fields (`name`, `employeeId`, `department`, `designation`, `status`).
- **Query Parameters**:
  - `date` *(string, optional)*: `YYYY-MM-DD` date filter.
  - `employeeId` *(string, optional)*: MongoDB `_id` filter to fetch history for a specific employee.
  - `department` *(string, optional)*: Department name filter.
- **Response `200 OK`**:
  ```json
  [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c099",
      "employeeId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c001",
        "name": "Arjun Mehta",
        "employeeId": "EMP001",
        "department": "Engineering",
        "designation": "Staff Software Engineer",
        "status": "Active"
      },
      "date": "2026-08-17",
      "status": "Present",
      "createdAt": "2026-08-17T09:00:00.000Z",
      "updatedAt": "2026-08-17T09:00:00.000Z"
    }
  ]
  ```

---

### `POST /api/attendance` *(Zod Validated)*
- **Description**: Atomic upsert daily attendance record. If a record already exists for the given `(employeeId, date)`, it updates the status; otherwise it creates a new log.
- **Weekend Guard**: Rejects marking on Saturdays or Sundays (`400 Bad Request`).
- **Request Body**:
  ```json
  {
    "employeeId": "64f1a2b3c4d5e6f7a8b9c001",
    "date": "2026-08-17",
    "status": "Present"
  }
  ```
- **Allowed Status Values**: `Present`, `Absent`, `On Leave`.
- **Response `200 OK`**: Upserted attendance document with populated employee profile.

---

## 4. Dashboard Analytics & Telemetry Endpoint *(Protected)*

### `GET /api/dashboard/stats`
- **Description**: Computes live real-time workforce metrics, department distributions, today's roll call counts, and past 28-day & 7-day trend analytics using MongoDB aggregation pipelines.
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
      { "department": "Marketing", "count": 3 },
      { "department": "Operations", "count": 2 },
      { "department": "Legal", "count": 2 }
    ],
    "todayAttendance": {
      "Present": 17,
      "Absent": 2,
      "On Leave": 4
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
    "today": "2026-08-17"
  }
  ```
