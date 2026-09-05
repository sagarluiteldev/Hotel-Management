# REST API Specification

This document details all API endpoints exposed by the Grand Haven Hotel Management System.

---

## 1. Authentication Endpoints

### `POST /api/auth/signin`
Authenticates a hotel manager or staff member and issues a signed HTTP-only session cookie.

- **Rate Limit**: 5 requests per minute per IP.
- **Request Body**:
  ```json
  {
    "email": "brenda@example.com",
    "password": "yourpassword"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "user": {
        "id": "cmto6tmse00006islpcy7g2xe",
        "name": "Brenda Clarence",
        "email": "brenda@example.com",
        "role": "MANAGER",
        "membership": "PRO",
        "avatarUrl": "https://..."
      }
    }
    ```
  - `401 Unauthorized`: `{"error": "Email or password is incorrect."}`
  - `429 Too Many Requests`: `{"error": "Too many sign-in attempts. Please wait 45 seconds before trying again."}`

---

### `POST /api/auth/signup`
Registers a new hotel manager account and provisions starter operational data.

- **Rate Limit**: 3 registrations per 10 minutes per IP.
- **Request Body**:
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex.morgan@grandhaven.test",
    "password": "Password123"
  }
  ```
- **Password Rules**: Minimum 8 characters, at least one letter, at least one number.
- **Responses**:
  - `201 Created`: Returns user object and sets signed session cookie.
  - `409 Conflict`: `{"error": "An account already exists with this email address."}`

---

### `POST /api/auth/signout`
Invalidates the current user session server-side by incrementing `tokenVersion` and deleting the session cookie.

- **Responses**:
  - `200 OK`: `{"ok": true, "message": "Signed out successfully."}`

---

## 2. Operations & Inventory Endpoints

### `GET /api/rooms`
Retrieves all hotel suites, rooms, pricing, amenity tags, and current occupancy progress.

- **Authentication**: Required
- **Response**:
  ```json
  {
    "rooms": [
      {
        "title": "Presidential Penthouse 401",
        "tags": ["Penthouse", "Ocean View", "Private Terrace"],
        "progress": 100,
        "icon": "layout",
        "accent": "teal",
        "time": "$650/night"
      }
    ]
  }
  ```

---

### `GET /api/staff`
Retrieves department staff leads, duty statuses, shift times, and ratings.

- **Authentication**: Required
- **Response**:
  ```json
  {
    "staff": [
      {
        "name": "Elena Vance",
        "title": "Chief Concierge & Guest Experience",
        "rating": 4.9,
        "bio": "Coordinates high-touch VIP guest arrivals...",
        "nextSession": "On Duty, Lobby",
        "avatar": "https://...",
        "specialty": "Guest Experience"
      }
    ]
  }
  ```

---

### `GET /api/work-orders`
Retrieves active housekeeping, maintenance, and guest service work orders.

- **Authentication**: Required
- **Response**:
  ```json
  {
    "workOrders": [
      {
        "id": "cmtonuwbm000e6i7fdc1f9yv3",
        "title": "VIP Penthouse 401 Welcome & Champagne Setup",
        "course": "Presidential Penthouse 401",
        "status": "todo",
        "priority": "High",
        "due": "Sep 5",
        "deadline": "Due today"
      }
    ]
  }
  ```

---

### `PATCH /api/work-orders`
Updates the operational status of an existing work order.

- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "id": "cmtonuwbm000e6i7fdc1f9yv3",
    "status": "progress" // "todo" | "progress" | "submitted"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "id": "cmtonuwbm000e6i7fdc1f9yv3",
    "status": "progress"
  }
  ```

---

### `GET /api/occupancy`
Fetches day-by-day occupancy percentage analytics for the week.

- **Authentication**: Required
- **Response**:
  ```json
  {
    "logs": {
      "Mon": 72,
      "Tue": 81,
      "Wed": 86,
      "Thu": 92,
      "Fri": 97,
      "Sat": 98,
      "Sun": 64
    }
  }
  ```

---

### `POST /api/occupancy`
Logs new daily occupancy percentage and updates associated room progress.

- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "hours": 95,
    "courseTitle": "Presidential Penthouse 401"
  }
  ```
- **Response**:
  ```json
  {
    "ok": true,
    "day": "Sat",
    "hours": 95
  }
  ```

---

## 3. System & Monitoring Endpoints

### `GET /api/health`
Public health diagnostic endpoint reporting database connectivity and latency.

- **Authentication**: Public
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-05T19:35:00.000Z",
    "uptimeSeconds": 1420,
    "environment": "production",
    "database": {
      "status": "connected",
      "latencyMs": 3
    },
    "responseTimeMs": 4
  }
  ```
