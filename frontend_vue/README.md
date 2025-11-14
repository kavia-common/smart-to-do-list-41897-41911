# Smart To‑Do (Vue 3 + Vite)

A modern To‑Do List application with an Ocean Professional theme. Core features:
- Add, edit, delete, complete/uncomplete tasks
- Filter by status: All / Active / Completed
- Persistent storage via localStorage (by default)
- Responsive, accessible UI with smooth transitions

## Environment Variables

The app is frontend-first and uses local state unless backend endpoints are provided.

- VITE_API_BASE: Optional backend REST base URL (preferred). When set, the app syncs with the backend API.
- VITE_BACKEND_URL: Optional alternative base URL (used only if VITE_API_BASE is not set).
- VITE_FRONTEND_URL: Optional public URL of this app.
- VITE_WS_URL: Optional WebSocket URL (unused by default).
- VITE_NODE_ENV: build/runtime environment (development/production).
- VITE_ENABLE_SOURCE_MAPS: enable source maps during build.
- VITE_PORT: dev server port if tooling uses it (vite.config.ts defaults to 3000 with strictPort).
- VITE_TRUST_PROXY, VITE_LOG_LEVEL, VITE_HEALTHCHECK_PATH, VITE_FEATURE_FLAGS, VITE_EXPERIMENTS_ENABLED: optional flags (unused by default).

Create a `.env` (or `.env.local`) if needed, or start from `.env.example`.

Example for local development with backend-node on port 4000:
```
VITE_PORT=3000
VITE_API_BASE=http://localhost:4000
# VITE_BACKEND_URL=   # only used if VITE_API_BASE is not set
```

If neither VITE_API_BASE nor VITE_BACKEND_URL are set, the app persists tasks in localStorage only.

## Running Frontend + Backend Together

Assuming you have the backend-node running on port 4000:

1) Start the backend
- Ensure the backend server is listening on http://localhost:4000
- Typical command: npm run dev (in the backend repository), or follow backend-node README.
- CORS: The frontend dev server runs on http://localhost:3000. Backend should allow CORS from http://localhost:3000 (or use wildcard for development).

2) Configure the frontend to point to the backend
- Copy `.env.example` to `.env`
- Set:
```
VITE_API_BASE=http://localhost:4000
```

3) Install dependencies and run the frontend
```
npm install
npm run dev
```
The app will be available at http://localhost:3000

Notes on CORS:
- This frontend sends credentials: 'include' on requests. Ensure backend CORS allows:
  - Access-Control-Allow-Origin: http://localhost:3000 (or *)
  - Access-Control-Allow-Credentials: true (if cookies/sessions are used)
  - Access-Control-Allow-Headers includes 'Content-Type'
- For simple setups, enabling permissive CORS in development is sufficient.

## Data Layer Behavior

- src/utils/env.ts reads VITE_API_BASE (preferred) or VITE_BACKEND_URL.
- src/services/http.ts builds absolute URLs using the selected base and performs fetch with JSON handling.
- src/services/tasks.api.ts uses isBackendEnabled() to decide:
  - If enabled: call /tasks endpoints (GET /tasks, POST /tasks, PATCH /tasks/:id, DELETE /tasks/:id)
  - If disabled: operate on localStorage (key: todo.tasks.v1)

This allows switching between local-only and API-backed modes via environment variables without code changes.

## Getting Started

1) Install dependencies
```
npm install
```

2) Run in development (served on port 3000 by default)
```
npm run dev
```

3) Build for production
```
npm run build
```

4) Preview production build
```
npm run preview
```

## Project Structure

- src/App.vue: App shell and task state + persistence
- src/components/todo/*: UI components (HeaderBar, TaskInput, FiltersBar, TaskList, TaskItem, EmptyState)
- src/views/HomeView.vue: SPA view shell
- src/router/index.ts: routes (single page)

## Styling

Ocean Professional theme
- primary #2563EB
- secondary #F59E0B
- success uses primary (#2563EB)
- error #EF4444
- background #f9fafb
- surface #ffffff
- text #111827

Subtle gradient accents and smooth transitions are applied across components.

## Accessibility

- Semantic landmarks and roles
- Keyboard interactions for editing/adding
- Sufficient color contrast and focus styles

## Notes

- No backend calls are made unless VITE_API_BASE or VITE_BACKEND_URL are set.
- The dev server is configured to run on port 3000 (strictPort). If your tooling uses VITE_PORT, set it accordingly.
