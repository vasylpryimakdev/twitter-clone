# Twitter Clone

Production-ready Twitter-style social feed application implemented as a split frontend/backend repository.

## 🚀 Live Demo

👉 [https://twitter-like-app-ddb7b.web.app](https://twitter-like-app-ddb7b.web.app)

## Overview

This repository contains:

- `client/`: React + Vite frontend with TypeScript, Firebase Auth, Firebase Storage, React Router, React Query, and Zustand.
- `functions/`: NestJS API deployed as Firebase Cloud Functions, with Firestore integration, request validation, authentication guards, and throttling.
- Firebase hosting and Firestore configuration in `firebase.json`.
- Firestore security rules and index definitions in `firestore.rules` and `firestore.indexes.json`.

The architecture is designed for fast client-side UX while keeping backend logic and security rules centralized in Firebase-hosted APIs.

## Key Capabilities

- Firebase Auth user registration and login
- Auth-protected CRUD for posts, comments, replies, and reactions
- Image upload via Firebase Storage
- Client-side routing with SPA rewrites
- Throttling and content-type validation on the API layer
- Firestore-based persistence with backend domain services

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, React Query, Zustand, MUI, Firebase SDK
- Backend: NestJS, Firebase Admin, Firebase Functions, Firestore, Express, Helmet
- Deployment: Firebase Hosting + Cloud Functions

## Architecture

### Frontend

- `client/src/router`: route definitions and protected route handling
- `client/src/hooks`: data-fetching and mutation hooks using React Query
- `client/src/components`: UI and feature components
- `client/src/firebase`: Firebase client initialization and auth token retrieval
- `client/src/api/api.ts`: Axios instance feeding authenticated requests to the backend

### Backend

- `functions/src/bootstrap.ts`: Nest app bootstrap with CORS configuration
- `functions/src/app.module.ts`: global modules, guards, validation pipe, and throttling configuration
- `functions/src/{posts,comments,users,reactions}`: domain modules with controllers, services, repositories, and DTO validation
- `functions/src/common/firebase`: shared Firestore and auth wiring

## Prerequisites

- Node.js 20+
- npm
- Firebase CLI
- Firebase project with Firestore and Storage enabled

## Environment

### Client

Create `client/.env` or `client/.env.local` with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_BASE_API_URL=http://localhost:5001/<your-firebase-project>/europe-west3/default
```

`VITE_BASE_API_URL` should point to the local emulator endpoint or production function URL.

### Backend

The functions runtime requires `CORS_ORIGIN` to allow browser requests from the frontend origin.

Example:

```bash
export CORS_ORIGIN=http://localhost:5173
```

For multiple origins:

```bash
export CORS_ORIGIN=http://localhost:5173,https://your-app.web.app
```

## Installation

Install dependencies for both workspace parts.

```bash
cd client
npm install
```

```bash
cd functions
npm install
```

## Local development

### Run frontend

```bash
cd client
npm run dev
```

### Run backend emulator

```bash
cd functions
npm run serve
```

### Recommended workflow

1. Start the functions emulator first so `VITE_BASE_API_URL` is reachable.
2. Start the client and verify auth flows.
3. Use browser devtools and function logs to trace API requests.

## Build

```bash
cd client
npm run build
```

```bash
cd functions
npm run build
```

## Deploy

### Deploy hosting and functions together

```bash
firebase deploy
```

### Deploy functions only

```bash
cd functions
npm run deploy
```

## Scripts

### Frontend scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run lint` — lint source code
- `npm run preview` — preview built output

### Backend scripts

- `npm run build` — compile TypeScript and NestJS sources
- `npm run serve` — build and launch Firebase functions emulator
- `npm run shell` — run Firebase functions shell
- `npm run deploy` — deploy functions to Firebase
- `npm run logs` — inspect function logs

## Firebase configuration

- Hosting serves `client/dist`
- Rewrites route all requests to `index.html` for SPA support
- Functions are deployed from `functions/`

Alias configured in `.firebaserc`:

- `twitter-like-app-ddb7b`

## Notes

- Backend auth is enforced via Firebase Auth token validation and NestJS guards.
- The app uses Firestore for persistence and Storage for media assets.
- The frontend does not bundle backend secrets: all Firebase config is injected through environment variables.

---

For architecture changes or production hardening, update guard behavior in `functions/src/common/firebase/auth/firebase-auth.guard.ts` and CORS settings in `functions/src/bootstrap.ts`.
