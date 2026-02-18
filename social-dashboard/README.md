# Modern Social Dashboard & Analytics

A high-performance social dashboard built with React, Firebase, and Tailwind CSS. This application features a real-time global state, authenticated routes, and a responsive design with Dark Mode support.

## Key Features

* Multi-Method Authentication: Secure Login and Registration via Email/Password and Google OAuth.
* Real-time Feed: Fetches community posts using RTK Query for efficient caching and state management.
* Global Toast System: Custom-built notification system using React Context API for non-intrusive user feedback.
* Dynamic User Profiles: Editable profiles with real-time updates across the app using Firebase profile syncing.
* Settings Hub: Integrated theme switching and notification preferences.
* Social Interactions: Local state simulation for liking posts and subscribing to users with instant feedback.
* Secure Routing: Protected routes to prevent unauthorized access to private data.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React 18 | Frontend Framework |
| Firebase Auth | User Security & Session Management |
| Redux Toolkit | State management & API interaction (RTK Query) |
| Tailwind CSS | Modern styling and Dark Mode |
| Lucide React | Consistent iconography |
| React Router v6 | Navigation and Route protection |

## Getting Started

### 1. Prerequisites

* Node.js (v16+)
* A Firebase Project

### 2. Installation

```bash
git clone https://github.com/yourusername/social-dashboard.git
npm install
npm run dev

```

### 3. Environment Setup

Create a .env file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

```

## Component Structure

* src/context/: Global states (Theme, Toast, Auth).
* src/components/: Reusable UI elements (Buttons, Inputs, Modals, Toasts).
* src/pages/: Main views (Feed, Profile, Settings, Login).
* src/store/: Redux logic and API slices.

## Roadmap

* Integrate Firebase Authentication
* Implement Global Toast Notifications
* Add Dark Mode support
* Implement Protected Route Wrapper
* Connect Firestore for persistent likes
* Add real-time chat functionality
