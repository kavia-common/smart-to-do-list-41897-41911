# Smart To‑Do List

This repository contains the Vue 3 frontend for a modern To‑Do application.

- Container: frontend_vue
- Tech: Vue 3, Vite, TypeScript, Pinia (available), Vue Router
- UI: Ocean Professional theme (success standardized to primary blue #2563EB)

## Running Frontend with Backend

If you have a backend-node service available (default port 4000), you can wire the frontend to it:

1) Start backend-node
- Ensure it runs on http://localhost:4000
- Enable CORS for http://localhost:3000 (frontend dev) or use wildcard in development.

2) Configure the frontend
- cd frontend_vue
- Copy .env.example to .env
- Set:
```
VITE_API_BASE=http://localhost:4000
```

3) Run the frontend
```
npm install
npm run dev
```
The app will be available at http://localhost:3000

Notes:
- tasks.api.ts respects VITE_API_BASE (preferred) and VITE_BACKEND_URL. If none are set, it uses localStorage.
- For CORS, if the backend uses cookies/sessions, allow credentials and set Access-Control-Allow-Origin to http://localhost:3000.

For more details, see frontend_vue/README.md.