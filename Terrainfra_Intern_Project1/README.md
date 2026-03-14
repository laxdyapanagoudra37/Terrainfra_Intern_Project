# Terrainfra360 — Task Management Portals (v2)

> **Web Development Internship Assignment**
> Two interconnected portals (Admin + User) sharing a single Firebase Firestore database, built with Next.js.
> This version features a **warm editorial light theme** with a sidebar-based admin layout, split-panel user login, and real-time progress tracking.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Firebase Setup](#firebase-setup)
5. [Local Development Setup](#local-development-setup)
6. [Running the Portals](#running-the-portals)
7. [Login Credentials](#login-credentials)
8. [Features Walkthrough](#features-walkthrough)
9. [How Real-Time Sync Works](#how-real-time-sync-works)
10. [Firestore Security Rules](#firestore-security-rules)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

Two separate Next.js apps sharing one **Firebase Firestore** database:

| Portal | Port | Role |
|---|---|---|
| **Admin Portal** | `3000` | Login with password, create tasks, assign to users, monitor all statuses |
| **User Portal** | `3001` | Login by username, view assigned tasks, update status |

Tasks created in the Admin portal appear instantly in the User portal. Status changes from the User portal reflect immediately in the Admin portal — powered by Firestore real-time listeners.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Firebase Firestore (real-time, NoSQL)
- **Language:** TypeScript
- **Styling:** CSS Variables + Tailwind CSS utility classes
- **Fonts:** Playfair Display (headings) + DM Sans (body) via Google Fonts
- **Notifications:** react-hot-toast
- **Version Control:** Git + GitHub

---

## Project Structure

```
terrainfra360/
├── .gitignore
├── README.md
│
├── admin-portal/                      # Admin Next.js app — port 3000
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             # Root layout + toast provider
│   │   │   ├── page.tsx               # Login screen + sidebar dashboard + task grid
│   │   │   └── globals.css            # CSS variables, fonts, paper texture
│   │   ├── components/
│   │   │   ├── TaskCard.tsx           # Task card with top accent stripe
│   │   │   └── CreateTaskModal.tsx    # Slide-up modal with user dropdown
│   │   └── lib/
│   │       ├── firebase.ts            # Firebase app init + Firestore export
│   │       └── types.ts               # Task interface + TaskStatus type
│   ├── .env.local.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   └── package.json
│
└── user-portal/                       # User Next.js app — port 3001
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx               # Split-panel login + task list + progress
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── TaskRow.tsx            # Horizontal task row with hover slide
    │   │   └── TaskDetailModal.tsx    # Detail modal with status buttons
    │   └── lib/
    │       ├── firebase.ts
    │       └── types.ts
    ├── .env.local.example
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── postcss.config.js
    └── package.json
```

> ⚠️ `node_modules/` folders are excluded from this repository via `.gitignore`. You must install dependencies locally after cloning — see [Local Development Setup](#local-development-setup).

---

## Firebase Setup

### Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Enter a name (e.g. `terrainfra360`) → Click **"Create project"**

### Step 2 — Enable Firestore

1. In the sidebar: **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** → select a region close to you
4. Click **"Enable"**

### Step 3 — Register a Web App

1. On the project overview, click the **Web icon `</>`**
2. Name it (e.g. `terrainfra360-web`) → **"Register app"**
3. Copy the `firebaseConfig` object that appears

### Step 4 — Add Environment Variables

Create a `.env.local` file inside **both** portal directories.

**`admin-portal/.env.local`** and **`user-portal/.env.local`** — use the same values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> ⚠️ `.env.local` is listed in `.gitignore` — it will **never** be committed to GitHub.

### Step 5 — Set Firestore Security Rules

Go to **Firebase Console → Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true;
    }
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

Click **Publish**.

### Step 6 — Create Composite Index

Go to **Firebase Console → Firestore → Indexes → Add index**:

| Field | Value |
|---|---|
| Collection ID | `tasks` |
| Field 1 | `assignedTo` — Ascending |
| Field 2 | `createdAt` — Descending |
| Query scope | Collection |

Click **Create** and wait for status to show ✅ Enabled.

### Step 7 — Add Users to Firestore

The admin task assignment dropdown reads from a `users` collection. Go to **Firebase Console → Firestore → Data → Start collection** → Collection ID: `users`, then add:

| Document | Field | Value |
|---|---|---|
| auto-id | `name` | `john` |
| auto-id | `name` | `Aditya` |

---

## Local Development Setup

### Prerequisites

- **Node.js v18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- **Git Bash** (Windows) or Terminal (Mac/Linux)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/laxdyapanagoudra37/Terrainfra_Intern_Project.git
cd Terrainfra_Intern_Project
```

### Step 2 — Install Dependencies for Admin Portal

```bash
cd admin-portal
npm install
```

> This installs all required packages into `admin-portal/node_modules/`. It may take 1–2 minutes.

After install, go back to the root:

```bash
cd ..
```

### Step 3 — Install Dependencies for User Portal

```bash
cd user-portal
npm install
```

> This installs all required packages into `user-portal/node_modules/`. It may take 1–2 minutes.

After install, go back to the root:

```bash
cd ..
```

### Step 4 — Create Environment Files

Copy the example env files and fill in your Firebase config values:

```bash
# Admin portal
cp admin-portal/.env.local.example admin-portal/.env.local

# User portal
cp user-portal/.env.local.example user-portal/.env.local
```

Then open each `.env.local` file and replace the placeholder values with your actual Firebase credentials from Step 4 of Firebase Setup.

---

## Running the Portals

Open **two terminal windows** simultaneously.

### Terminal 1 — Admin Portal (port 3000)

```bash
cd admin-portal
npm run dev
```

Open: **http://localhost:3000**

### Terminal 2 — User Portal (port 3001)

```bash
cd user-portal
npm run dev
```

Open: **http://localhost:3001**

---

## Login Credentials

### Admin Portal — http://localhost:3000

| Field | Value |
|---|---|
| Password | `admin123` |

> To change the password, edit `admin-portal/src/app/page.tsx`:
> ```tsx
> const ADMIN_PASSWORD = "admin123";
> ```

### User Portal — http://localhost:3001

| Username | Notes |
|---|---|
| `john` | Case-sensitive — type exactly as shown |
| `Aditya` | Case-sensitive — capital A required |

---

## Features Walkthrough

### Admin Portal (http://localhost:3000)

**Login:** Password-protected — enter `admin123` to access the dashboard.

| Feature | Description |
|---|---|
| Password login | Secure entry to admin dashboard |
| Logout button | Bottom of sidebar — returns to login screen |
| Sidebar navigation | Filter tasks by All / Pending / In Progress / Completed with live counts |
| Stat cards | Three summary cards showing counts per status |
| Task grid | Responsive grid showing title, status badge, assignee avatar, and date |
| + New Task button | Modal with title, description, and dropdown to select assignee (john / Aditya) |
| Live updates | Status changes from users reflect instantly without refresh |

### User Portal (http://localhost:3001)

**Login screen:** Split-panel — dark branding panel on left, login form on right.

| Feature | Description |
|---|---|
| Username login | Enter `john` or `Aditya` to view assigned tasks |
| Logout button | Top-right corner — returns to login screen |
| Progress bar | Overall completion percentage across all assigned tasks |
| Task counters | Pending / In Progress / Completed breakdown |
| Filter tabs | Filter task list by status |
| Task detail modal | Click any task to view details and update status |

### Real-Time Sync Test

1. Open Admin at `localhost:3000` → login with `admin123`
2. Open User at `localhost:3001` side by side
3. Admin: Create a task → select `john` from the dropdown
4. User: Enter `john` → task appears immediately ✅
5. User: Click the task → change status to "In Progress"
6. Admin: Status badge updates in real time ✅

---

## How Real-Time Sync Works

Both portals use Firestore's `onSnapshot()` — a persistent WebSocket-based listener:

```typescript
// Admin: listens to ALL tasks
const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

// User: listens only to tasks assigned to logged-in user
const q = query(
  collection(db, "tasks"),
  where("assignedTo", "==", username),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setTasks(tasks);
});
```

**Firestore `tasks` document shape:**
```json
{
  "title": "Build the login page",
  "description": "Design and implement the authentication flow",
  "assignedTo": "john",
  "status": "In Progress",
  "createdAt": 1710000000000,
  "updatedAt": 1710003600000
}
```

**Firestore `users` collection:**
```json
{ "name": "john" }
{ "name": "Aditya" }
```

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true;
    }
    match /users/{userId} {
      allow read, write: if true;
    }
  }
}
```

---

## Deployment

```bash
# Deploy admin portal
cd admin-portal
npx vercel

# Deploy user portal
cd ../user-portal
npx vercel
```

Add all `NEXT_PUBLIC_FIREBASE_*` environment variables in the Vercel dashboard for both deployments.

---

## Troubleshooting

**Tasks not showing / Firebase errors**
- Check `.env.local` exists in both portals with all 6 values filled in
- Restart dev servers after creating `.env.local`

**"Missing or insufficient permissions"**
- Update Firestore Rules as shown above and click Publish

**User dropdown shows "No users found"**
- Add `john` and `Aditya` documents to the `users` collection in Firestore

**User portal shows no tasks**
- Username is case-sensitive: `Aditya` ≠ `aditya`, `john` ≠ `John`

**Tasks stuck on "Creating..."**
- `.env.local` is missing in `admin-portal/` — create it and restart the server

**`npm install` fails or throws errors**
- Make sure you are running Node.js v18 or above: `node -v`
- Delete any existing `node_modules` folder and `package-lock.json`, then re-run `npm install`

**Port conflict**
```bash
npx kill-port 3000
npx kill-port 3001
```

**`node_modules` not found after cloning**
- This is expected — `node_modules` is excluded from the repository via `.gitignore`
- Run `npm install` inside both `admin-portal/` and `user-portal/` as described in [Local Development Setup](#local-development-setup)

---