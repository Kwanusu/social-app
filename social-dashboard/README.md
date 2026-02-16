# Enterprise Social Media Dashboard

A high-performance, real-time social media dashboard built using the modern React ecosystem. This application features complex data orchestration, secure multi-provider authentication, and a fully responsive, themeable UI.

## Key Features

* **Secure Authentication:** Multi-provider login (Google OAuth & Email/Password) powered by Firebase, including a full password recovery flow.
* **Intelligent Data Management:** Utilizes **Redux Toolkit Query** for server-state management, featuring automatic caching, polling, and optimistic UI updates.
* **Dynamic Analytics:** A dedicated analytics dashboard that derives real-time insights (engagement rates, post-performance) from cached API data.
* **Advanced Filtering:** Real-time client-side search and filtering logic for social feeds.
* **Adaptive Theming:** System-aware Light/Dark mode with persistent user preference storage.
* **Protected Routing:** Robust client-side routing with specialized Layout wrappers and Authentication Guards.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React 18 (Vite) | Core UI Framework |
| **State Management** | Redux Toolkit (RTK Query) | Global State & API Caching |
| **Authentication** | Firebase Auth | Identity Management |
| **Routing** | React Router 6 | SPAs Navigation & Route Guarding |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Icons** | Lucide React | Consistent iconography |
| **Deployment** | Vercel | Production Hosting |

## Project Structure

```text
src/
├── api/            # RTK Query API slices
├── components/     # UI components (Sidebar, ProtectedRoute, Layout)
├── context/        # Theme & Global UI Context
├── pages/          # Dashboard Views (Feed, Analytics, Profile, Auth)
├── store/          # Redux Store configuration
└── firebase.js     # Firebase SDK initialization

```

## Installation & Setup

### 1. Prerequisites

* Node.js (v18+)
* Firebase Project

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

```

### 3. Setup Commands

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

```

## Design Philosophy

### **State Separation**

The app follows a strict state-separation rule:

* **Server State:** Handled by RTK Query to ensure data synchronization and minimize network overhead.
* **Global UI State:** Managed via Context API for lightweight tasks like theme toggling.
* **Local State:** Managed via `useState` for transient form inputs and UI toggles.

### **Client-Side Optimization**

By utilizing `useMemo` for search filtering and RTK Query's caching mechanisms, the application maintains a 60fps UI performance even when processing large API datasets.

## License

This project is open-source and available under the MIT License.
