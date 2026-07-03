# Ledgr — Financial Ledger System

A full-stack fintech application implementing a **double-entry ledger system** with idempotent transactions, atomic MongoDB sessions, and role-based access control.

> Built to demonstrate production-grade backend architecture patterns used in real financial systems.

## 🔗 Links

- **Live App:** https://ledger-frontend-gamma.vercel.app
- **API Docs (Swagger):** https://ledger-backend-3h87.onrender.com/api/docs
- **Backend Repo:** https://github.com/Akhand-20/Ledger-backend
- **Frontend Repo:** https://github.com/Akhand-20/Ledger-frontend

## ⚡ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, HTTP-only cookies, token blacklisting
**Security:** Helmet, CORS, express-rate-limit
**Email:** Nodemailer (Gmail SMTP)
**Logging:** Morgan, Winston
**Docs:** Swagger UI (OpenAPI 3.0)
**Frontend:** React, Vite, Tailwind CSS, Axios

## 🏗️ Key Engineering Concepts

**Double-Entry Ledger**
Account balances are never stored — always derived by summing immutable ledger entries. Eliminates balance corruption from race conditions and provides a complete audit trail.

**Idempotent Transactions**
Client-generated idempotency keys prevent duplicate processing on network retries — the same transaction is never executed twice regardless of how many times it's submitted.

**Atomic MongoDB Sessions**
Every transaction uses `startSession()` → `commitTransaction()` → `abortTransaction()`. Partial writes never reach the database — it's all or nothing.

**Append-Only Reversals**
Transaction reversals create new counter-entries rather than deleting history. The full audit trail is always preserved — consistent with real banking systems.

**Role-Based Access Control**
System users and regular users are enforced at the middleware level. Admin operations (fund seeding, transaction reversal) are completely inaccessible to regular user tokens.

**JWT Blacklisting**
Tokens are invalidated server-side on logout via a blacklist collection — ensuring stolen tokens cannot be reused after a user logs out.

## 📋 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, receive JWT cookie |
| POST | `/api/auth/logout` | Logout, blacklist token |
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts/balance/:id` | Get derived balance |
| GET | `/api/accounts/find/:username` | Find account by username |
| PATCH | `/api/accounts/:id/status` | Freeze / close account |
| POST | `/api/transactions` | Send money |
| GET | `/api/transactions/:id/history` | Paginated history |
| POST | `/api/transactions/system/initial-fund` | Seed funds (system only) |
| POST | `/api/transactions/:id/reverse` | Reverse transaction (system only) |

## 🚀 Local Setup

```bash
git clone https://github.com/Akhand-20/Ledger-backend.git
cd Ledger-backend
npm install
```

Create `.env`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
EMAIL_USER=your_gmail
EMAIL_PASSWORD=your_app_password
```

```bash
npm run dev
```
