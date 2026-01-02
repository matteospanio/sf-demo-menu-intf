# `src/` Architecture Notes

This project is organized around **feature slices** + **shared** building blocks.

## High-level structure

- `src/features/` – domain-oriented modules (UI + state + feature logic)
  - `auth/`
    - `model/` – auth state (context + hook) and feature domain logic
    - `ui/` – feature screens/components (e.g. `LoginPage`)
  - `menu/`
    - `model/` – menu domain types/helpers (e.g. `Dish`, list helpers)
    - `hooks/` – feature-specific hooks (e.g. `useAttributes`)
    - `ui/` – feature UI (form, cards, selectors)

- `src/shared/` – reusable primitives (kept generic)
  - `ui/` – reusable UI components (e.g. `Loader`, `MenuBar`, `ColorSelector`)
  - `lib/` – shared utilities/types (e.g. `utils.ts` enums + helpers)
  - `config/` – shared constants/config (e.g. `constants.ts`)

- `src/api/` – API client, config, services, and types (used by features)
- `src/i18n.ts` – i18next setup
- `src/App.tsx` / `src/main.tsx` – app composition + providers

## Import boundaries (guidelines)

- Feature modules should prefer importing:
  - from their own feature (`src/features/<feature>/...`), and
  - from `src/shared/...` and `src/api/...`.

- Avoid importing **deep internals** across features.
  - Prefer feature public exports via `src/features/<feature>/index.ts`.

- Keep `shared/` free of feature-specific concepts.
  - If something becomes domain-specific, move it into the relevant feature.

## Public entrypoints (“barrels”)

These folders expose a small public API via `index.ts` barrels:

- `src/features/auth/index.ts`
- `src/features/menu/index.ts`
- `src/shared/ui/index.ts`
- `src/shared/lib/index.ts`
- `src/shared/config/index.ts`

Use these where it improves clarity and helps avoid fragile relative paths.

## Adding a new feature

1. Create `src/features/<new-feature>/{model,ui}` (and `hooks/` if needed)
2. Keep feature state/logic in `model/` (context/reducer/hooks)
3. Keep pages/components in `ui/`
4. Export the feature’s public surface from `src/features/<new-feature>/index.ts`
