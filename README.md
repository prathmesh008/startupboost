# StartupBoost - Premium Benefits Platform

> **A full-stack platform providing early-stage startups with access to curated SaaS benefits and exclusive deals.**

## Overview

StartupBoost bridges the gap between SaaS providers and early-stage founders. It solves the problem of affordability by aggregating exclusive discounts. The platform features a **high-performance marketing landing page** with 3D interactions and a **secure, authenticated dashboard** for deal management.

### Key Features
* **3D "Antigravity" Hero Section:** Interactive floating elements using `@react-three/fiber` for a premium aesthetic.
* **Authentication System:** Secure JWT-based signup/login with protected routes.
* **Deal Access Control:** Differentiates between 'Public' and 'Locked' deals based on user verification status.
* **Claim System:** Users can claim deals, which are tracked in their personal dashboard.
* **Modern UI/UX:** Dark-mode "Glassmorphism" design using Tailwind CSS and Framer Motion.

---

## Tech Stack

### Frontend (Client)
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS (Dark Mode & Glassmorphism effects)
* **Animation:** Framer Motion (Page transitions, hover states)
* **3D Graphics:** React Three Fiber (R3F) & Drei
* **State Management:** React Context API

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Auth:** JSON Web Tokens (JWT) & Bcrypt for hashing

---

## Architecture & Design Decisions

### 1. The "Premium" Aesthetic (Frontend)
To meet the requirement of a high-quality visual experience, I avoided standard Bootstrap-like components. Instead, I implemented:
* **React Three Fiber:** Used for the Hero section to create a "weightless" metallic object scene, symbolizing the "boost" startups receive.
* **Glassmorphism:** Used `backdrop-filter: blur()` heavily on cards and navbars to create depth against the dark background.

### 2. Separation of Concerns (Backend)
The backend is structured to separate routing logic from business logic:
* **Models:** Mongoose schemas defining strict data structure.
* **Controllers:** Handles the business logic (e.g., checking if a user is verified before claiming).
* **Middleware:** `verifyToken` middleware acts as a gatekeeper for protected routes.

### 3. Authentication Flow
Authentication is stateless using JWT.
1.  User logs in -> Server returns a generic `token`.
2.  Client stores token in `localStorage` (or HTTPOnly cookie).
3.  Protected API calls include `Authorization: Bearer <token>`.

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/startup-boost.git
cd startup-boost
```

### 2. Backend Setup
```bash
cd platform_engine
npm install
```

Create a `.env` file in the `/platform_engine` folder:
```
PORT=4000
DATA_STORE_URI=your_mongodb_connection_string
CORE_SECRET=your_super_secret_key
```

Run the server:
```bash
npm run ignite
```

### 3. Frontend Setup
```bash
cd webapp_client
npm install
```

Create a `.env` file (if needed for API base URL):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Run the client:
```bash
npm run dev
```

The app should now be running at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | /api/v1/auth/initiate | Register a new user | No |
| POST | /api/v1/auth/identify | Login user & return JWT | No |
| GET | /api/v1/market/opportunities | Fetch all available deals | Yes |
| POST | /api/v1/market/claim/:id | Claim a specific deal | Yes |
| GET | /api/v1/account/status | Get user's claimed history | Yes |

---

## Known Limitations & Future Roadmap

While the core functionality is robust, the following areas are mocked or simplified for the scope of this assignment:

* **Verification Workflow:** Currently, user verification is simulated via a database flag. In production, this would integrate with identity providers (e.g., LinkedIn API or KYB).
* **Pagination:** Fetching all deals works for the current dataset, but server-side pagination would be needed for scaling.
* **Email Notifications:** Sending real emails upon claiming a deal is currently not implemented.

### Planned Improvements
* [ ] Implement Admin Dashboard for adding deals.
* [ ] Add Redis caching for API response optimization.
* [ ] Integration with Stripe for premium membership tiers.

---

**Submitted by:** [Your Name]
**Date:** January 2026
