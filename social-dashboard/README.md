# Modern Social Dashboard & Analytics

A high-performance social dashboard built with **React 18**, **Firebase**, and **Tailwind CSS**. This application features a professional-grade architecture centered around real-time data orchestration, authenticated route protection, and a premium Dark Mode experience.

## Key Features

* **Multi-Method Authentication:** Secure session management via Email/Password and Google OAuth powered by Firebase Auth.
* **Real-time Data Layer:** Optimized community feed fetching using **RTK Query** for intelligent caching, polling, and state synchronization.
* **Global Provider Pattern:** * **Theme Context:** Persistent Dark/Light mode syncing with system preferences.
* **Toast System:** Non-intrusive notification engine for real-time user feedback.


* **Dynamic Social Graph:** Real-time profile syncing and local state simulation for high-speed social interactions (Likes, Subscribes).
* **Security-First Routing:** Higher-Order Component (HOC) wrappers for protected routes, ensuring private data remains inaccessible to unauthenticated users.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 18** | Framework with Concurrent Rendering support |
| **Firebase** | Backend-as-a-Service (Auth & Firestore) |
| **Redux Toolkit** | Centralized state & **RTK Query** for API logic |
| **Tailwind CSS** | Utility-first styling with custom Dark Mode variants |
| **Lucide React** | Consistent, accessible iconography |
| **React Router 6** | Declarative navigation and Protected Route logic |

## Architecture & Design Patterns

### 1. Data Orchestration (`src/store/`)

Utilizes **RTK Query** to abstract the "Fetch-Cache-Update" cycle. This ensures the UI remains optimistic and snappy even under fluctuating network conditions.

### 2. Global State & Context (`src/context/`)

We utilize the **Context API** for low-frequency updates (Theme, Auth state, Notifications) to prevent "Prop Drilling" and ensure a clean component hierarchy.

### 3. Component Hierarchy

* **Primitives:** Stateless Shadcn-inspired UI components.
* **Features:** Logic-heavy components (Feed, AuthForm) that consume hooks.
* **Layouts:** Persistent wrappers for Navigation and Sidebar consistency.

## Getting Started

### 1. Installation

```bash
git clone https://github.com/Kwanusu/social-dashboard.git
cd social-dashboard
npm install

```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

```

### 3. Development

```bash
npm run dev

```

## Project Structure

```text
src/
├── components/     # Reusable UI primitives (Buttons, Toasts, Modals)
├── context/        # Global Providers (ThemeContext, AuthContext)
├── hooks/          # Custom logic (useAuth, useSocialActions)
├── pages/          # View-level components (Feed, Profile, Settings)
├── store/          # Redux slices and RTK Query API definitions
└── utils/          # Firebase config and helper functions

```

---

## Technical Rubric (Grading Guidelines)

| Category | Excellent (4 pts) | Satisfactory (3 pts) |
| --- | --- | --- |
| **State Management** | Uses RTK Query for server state and Context for UI state correctly. | Uses Redux but misses out on RTK Query optimizations. |
| **Authentication** | Implements Protected Route wrappers; UI reacts instantly to Auth changes. | Auth works, but private routes are accessible via URL manipulation. |
| **Theming** | Persistent Dark Mode with no "white flash" on reload; uses system defaults. | Dark mode works but resets on page refresh. |
| **Firebase Logic** | Service layer abstraction; clean separation from UI components. | Firebase calls are made directly inside `useEffect` in the UI. |

## 🛤 Roadmap

* [x] Implement Global Provider Pattern (Theme/Toast)
* [x] Integrate RTK Query for Feed Management
* [x] Build Protected Route HOC
* [ ] Connect Firestore for persistent Social Actions
* [ ] Add Real-time Chat via Firebase WebSockets