# Nestora deployment notes

## Repository layout
- `client/`: React + Vite frontend
- `server/`: Express + MongoDB backend

## Before pushing to GitHub
- Keep `server/.env` local only. It is excluded by `.gitignore`.
- `node_modules/` and build output folders are excluded.
- `server/.env.example` contains placeholders only.

## Render backend (Web Service)
- Repository: this repository
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment variables:
  - `MONGO_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: long random secret
  - `CLIENT_URL`: deployed frontend URL (for example, `https://your-frontend.onrender.com`)

## Render frontend (Static Site)
- Repository: this repository
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable:
  - `VITE_API_URL`: backend origin only (for example, `https://your-backend.onrender.com`); do not append `/api`.

Add a Render rewrite for React Router:
- Source: `/*`
- Destination: `/index.html`
- Action: Rewrite

## Local development
- Create `server/.env` using `server/.env.example` as a template.
- Start backend from `server/` with `npm install` then `npm run dev`.
- Start frontend from `client/` with `npm install` then `npm run dev`.
- The frontend defaults to `http://localhost:5000` when `VITE_API_URL` is not set.
