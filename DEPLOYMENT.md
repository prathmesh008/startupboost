# Deployment Guide

This guide describes how to deploy the **StartupBoost** platform used for this assignment.

## 1. Backend Deployment (Render.com)

We will deploy the `backend` (Node.js/Express) to Render.

1.  **Push Code to GitHub**: Ensure this project is pushed to a GitHub repository.
2.  **Create Service on Render**:
    *   Log in to [Render.com](https://render.com).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Service**:
    *   **Root Directory**: `backend` (IMPORTANT)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   Click **Environment**.
    *   Add the following keys (from your local `.env`):
        *   `DATA_STORE_URI`: (Your MongoDB Atlas connection string)
        *   `CORE_SECRET`: (Your secret key)
        *   `PORT`: `4000` (Render might override this, which is handled in code)

## 2. Frontend Deployment (Vercel)

We will deploy the `frontend` (Next.js) to Vercel.

1.  **Create Project on Vercel**:
    *   Log in to [Vercel](https://vercel.com).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.
2.  **Configure Project**:
    *   **Root Directory**: Click the "Edit" button next to "Root Directory" and select `frontend`.
    *   **Framework Preset**: Next.js (should detect automatically).
3.  **Environment Variables**:
    *   Expand **Environment Variables**.
    *   Add:
        *   `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend (e.g., `https://startup-boost-api.onrender.com/api/v1`).
        *   **Note**: Ensure you append `/api/v1` to the URL.
4.  **Deploy**: Click **Deploy**.

## 3. Final Checks

1.  Once both are deployed, go to your **Vercel URL**.
2.  Try to **Sign Up** a new user.
3.  If you get a Network Error:
    *   Check the Vercel logs/console.
    *   Ensure the Backend CORS configuration allows the Vercel domain.
    *   **Quick Fix for CORS**: You might need to update `backend/server.ts` to allow all origins `origin: '*'` temporarily or add your specific Vercel domain.

### Allowing Vercel Domain in Backend
If you face CORS issues, update `server.ts`:
```typescript
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'https://your-vercel-app.vercel.app' // Add your deployed frontend URL here
    ],
    credentials: true
}));
```
Redeploy the backend after making this change.

## 4. Submission

*   Provide the **Vercel URL** as the live demo link.
*   Provide the **GitHub Repository URL** for code review.
