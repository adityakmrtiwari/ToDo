# TODO App

A modern, full-stack To-Do App with Google authentication, built with React (frontend) and Node.js/Express (backend), using MongoDB for storage.

## Features
- Google OAuth login
- User-specific tasks (title, description, due date)
- Black & white theme with dark/light mode toggle
- Responsive, clean UI

## Project Structure
```
backend/   # Node.js/Express API
frontend/  # React app
```

## Setup
1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd <project-root>
   ```
2. **Install dependencies:**
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Environment variables:**
   - Copy `.env.example` to `.env` in both `backend/` and `frontend/` (create if missing).
   - Set your Google OAuth credentials, MongoDB URI, and session secret in `backend/.env`.

## Running Locally
- **Backend:**
  ```sh
  cd backend
  npm run dev
  ```
- **Frontend:**
  ```sh
  cd frontend
  npm start
  ```
- Visit [http://localhost:3000](http://localhost:3000)

## Deployment
- Ready for Vercel (see `vercel.json` and `frontend/vercel.json` for config).
- Set environment variables in your deployment dashboard.

---
MIT License 