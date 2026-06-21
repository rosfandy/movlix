# AGENTS.md — movlix

## Stack

- React 19 + TypeScript + Vite + Tailwind CSS v4
- TanStack Router v1 (file-based, routes in `src/routes/`)
- Package manager: **bun only** (no npm/yarn/pnpm)
- Path alias: `@/*` → `./src/*`

## Structure

```
src/
├── pages/                  # page-level components (one per route)
├── components/             # global components
│   ├── ui/
│   ├── fragment/
│   ├── layout/
│   └── provider/
├── features/               # feature-scoped components and hooks
│   └── home/
│       ├── components/
│       └── hook/
├── routes/                 # TanStack Router file routes
│   ├── __root.tsx
│   └── index.tsx
├── assets/
├── index.css
├── main.tsx
└── routeTree.gen.ts
```

## Commands

```bash
bun run dev      # tsr watch + vite dev server
bun run build    # tsr generate → tsc → vite build (order matters)
bun run lint     # eslint
bun run preview  # vite preview
```

## Router

- Root route: `src/routes/__root.tsx` using `createRootRoute({ component })`
- Page routes: `src/routes/*.tsx` using `createFileRoute('/path')`
- Generated route tree: `src/routeTree.gen.ts` — must run `tsr generate` before build
- Dev watches routes automatically; build regenerates them

## CSS

- Tailwind v4 — `@import "tailwindcss"` in `src/index.css`
- No `tailwind.config.js`; v4 uses CSS-first config
- Remove old `App.css` boilerplate; use Tailwind utilities

## React 19 patterns

- Use `useActionState` + `"use server"` for mutations
- Use `useOptimistic` for instant UI feedback
- Avoid `useEffect` for derived state — compute during render
- See `.agents/skills/react-patterns/SKILL.md` for full ruleset
