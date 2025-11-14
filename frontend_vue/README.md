# Smart To‑Do (Vue 3 + Vite)

A modern To‑Do List application with an Ocean Professional theme. Core features:
- Add, edit, delete, complete/uncomplete tasks
- Filter by status: All / Active / Completed
- Persistent storage via localStorage (by default)
- Responsive, accessible UI with smooth transitions

## Environment Variables

The app is frontend-only and uses local state unless backend endpoints are provided.

- VITE_API_BASE: Optional backend REST base URL. If set, you can wire API calls to sync tasks.
- VITE_BACKEND_URL: Optional alternative base URL.
- VITE_FRONTEND_URL: Optional public URL of this app.
- VITE_WS_URL: Optional WebSocket URL (unused by default).
- VITE_NODE_ENV: build/runtime environment (development/production).
- VITE_ENABLE_SOURCE_MAPS: enable source maps during build.
- VITE_PORT: dev server port if tooling uses it (vite.config.ts defaults to 3000 with strictPort).
- VITE_TRUST_PROXY, VITE_LOG_LEVEL, VITE_HEALTHCHECK_PATH, VITE_FEATURE_FLAGS, VITE_EXPERIMENTS_ENABLED: optional flags (unused by default).

Create a `.env` (or `.env.local`) if needed. Example:
```
VITE_PORT=3000
VITE_API_BASE=
VITE_BACKEND_URL=
```

If VITE_API_BASE or VITE_BACKEND_URL are set, you can adapt the data layer to call the backend; otherwise, localStorage is used.

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

- No backend calls are made unless VITE_API_BASE or VITE_BACKEND_URL are provided and integrated; by default, data is persisted in localStorage.
- The dev server is configured to run on port 3000 (strictPort). If your tooling uses VITE_PORT, set it accordingly.

