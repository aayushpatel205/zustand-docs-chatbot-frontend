# Backend API Reference — expo-docs-backend

**Base URL:** `http://localhost:3000`
**Stack:** Express 5 + DataStax Astra DB + Google Gemini (LangChain.js)
**Auth:** JWT (access + refresh tokens) with httpOnly cookie support

---

## 1. Health Check

**`GET /health`** → `{ success: true, message: 'Server is running' }`

---

## 2. Auth Endpoints (`/api/auth`)

### POST /api/auth/register
```json
// Request
{ "email": "user@example.com", "password": "password123" }

// Response 201
{ "success": true, "message": "Registration successful", "data": { "accessToken": "<jwt>", "refreshToken": "<jwt>", "user": { "_id": "<uuid>", "email": "...", "isActive": true, "createdAt": "...", "updatedAt": "..." } } }
```
Also sets `refreshToken` httpOnly cookie.
Errors: `400` (missing/invalid fields), `409` (duplicate email)

### POST /api/auth/login
Same shape as register.
Errors: `400` (missing fields), `401` (invalid credentials), `403` (deactivated account)

### POST /api/auth/refresh
```json
// Request (body or cookie)
{ "refreshToken": "<jwt>" }

// Response 200 — same as login/register shape
```
Priority: body > cookie. Issues new token pair.
Error: `401` (session expired, clears cookie)

### POST /api/auth/logout
Same body as refresh. Revokes token, clears cookie. → `{ success: true, message: "Logged out successfully" }`

### POST /api/auth/logout-all
**Requires:** Bearer token. Revokes all user sessions. → same shape

### GET /api/auth/me
**Requires:** Bearer token. → `{ success: true, data: { user: { ... } } }`

---

## 3. Chat Endpoint (`/api/chat`)

### POST /api/chat/query
```json
// Request
{ "question": "How do I create a Zustand store?" }

// Response 200
{ "success": true, "data": { "answer": "Based on the docs...", "sources": [{ "title": "Getting Started", "heading": "Creating a store", "sourcePath": "getting-started.md" }] } }
```
**RAG pipeline:** embed question → vector search (top-5, cosine, threshold 0.82) → Gemini 3.1 Flash Lite generates answer
Error: `500`

---

## 4. Rate Limits

| Scope | Limit |
|---|---|
| Global `/api/*` | 100 req / 15 min |
| Auth (register, login, logout) | 10 req / 15 min |
| Token refresh | 30 req / 15 min |

---

## 5. Auth Headers

- **Access token:** `Authorization: Bearer <accessToken>`
- **Refresh token:** httpOnly cookie OR `{ refreshToken: "<jwt>" }` in body

Access token TTL: 5 min (default)
Refresh token TTL: 7 days (default)

---

## 6. Error Responses

| Code | Meaning | Common Causes |
|---|---|---|
| 400 | Bad Request | Missing/invalid fields |
| 401 | Unauthorized | Bad creds, expired/invalid token |
| 403 | Forbidden | Deactivated account |
| 404 | Not Found | Unknown route |
| 409 | Conflict | Duplicate email |
| 500 | Server Error | Unhandled exception |

Token-specific error codes in 401 responses: `TOKEN_EXPIRED`, `INVALID_TOKEN`

---

## 7. Frontend Consumption Guide

1. **Register/Login** → receive `accessToken` + `refreshToken`
2. Store `accessToken` in memory/state (not localStorage for security)
3. Attach to all protected requests: `Authorization: Bearer <token>`
4. On 401 `TOKEN_EXPIRED`, call `/api/auth/refresh` with the refresh token
5. On refresh failure, redirect to login
6. For chat queries (`POST /api/chat/query`), no auth token is currently required (temporarily removed during testing — will be re-added)

---

## 8. Tech Notes

- **Auth:** JWT + bcryptjs + AES-256-GCM (emails encrypted at rest)
- **DB:** Two separate DataStax Astra instances — one for user data, one for vector store
- **Embedding:** `gemini-embedding-2` (3072 dimensions)
- **LLM:** `gemini-3.1-flash-lite` (temperature 0.3)
- **Ingestion:** Idempotent, tracks progress via `.ingest_zustand_progress.json`
- **Vector collection:** `zustand_docs` (cosine similarity metric)
