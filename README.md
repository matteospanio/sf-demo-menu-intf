# SoundFood — Menu Intake Frontend

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![CI](https://github.com/matteospanio/sf-demo-menu-intf/actions/workflows/ci.yml/badge.svg)](https://github.com/matteospanio/sf-demo-menu-intf/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

This repository contains a **React + TypeScript** web interface used to **collect restaurant menu data** and send it to the **SoundFood API**.

SoundFood creates tailored music experiences for restaurants to enhance the perceived flavors of dishes. This app focuses on *data collection*: menus, dishes, and dish-specific sensory attributes (tastes, colors, textures, shapes, emotions, etc.).

## Features

- **Authentication**
  - Register, login, logout
  - Token persisted in `localStorage` (`auth_token`)
- **Profile management**
  - View profile information (username, member since)
  - Update email address
  - Change password
- **Menu request creation**
  - Create a menu (title required, description optional)
  - Add multiple dishes to the menu
  - Reorder dishes via drag & drop
- **Menu request management**
  - View the list of your created menus
  - Open menu details
  - Update an existing menu request
  - Delete a menu
- **Dish description (modal editor)**
  - Section/category selection (e.g., appetizer, first course, …)
  - Taste sliders (sweet/bitter/sour/salty/umami + piquant/fat/temperature)
  - Colors (up to 3)
  - Select **textures**, **shapes**, **emotions** fetched from the API
  - Edit and delete existing dishes
- **Submission & summary**
  - Submit creates the menu + dishes on the API
  - A full-screen summary drawer shows the submitted menu and dishes
- **Internationalization (i18n)**
  - English and Italian
  - Language switcher in the top bar

## Tech stack

- **React 18**, **TypeScript**, **Vite**
- **Chakra UI** (+ `chakra-react-select`, `chakra-multiselect`)
- **i18next** (`react-i18next` + http backend)
- Testing: **Vitest** (unit) + **Playwright** (E2E)

## Architecture

The codebase is organized by **feature slices** and shared building blocks:

- `src/features/auth` — auth state (context) and the login/register UI
- `src/features/menu` — menu request form, dish editor, and attribute loaders
- `src/api` — API client + typed services
- `src/shared` — reusable UI + utilities

More details in [src/README.md](src/README.md).

## Requirements

- Node.js **20+** (CI uses Node 20)
- A package manager:
  - Recommended: `yarn` (used in CI)
  - Also works: `npm`
- Access to a compatible **SoundFood API** with these endpoints:
  - Auth: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`
  - Menus: `/api/menus`
  - Dishes: `/api/menus/:menuId/dishes`, `/api/dishes/:id`
  - Attributes: `/api/emotions`, `/api/textures`, `/api/shapes`

## Installation

Using Yarn:

```bash
yarn install
yarn dev
```

Using npm:

```bash
npm install
npm run dev
```

Then open the URL printed by Vite.

## Configuration

### Environment variables

This app reads the API base URL from a Vite env var.

- `VITE_API_BASE_URL` — SoundFood API base URL (default: `http://localhost:5000`)

Optional (production build only):

- `VITE_BASE_PATH` — base path where the app is hosted (examples: `/` for Docker, `/sf-demo-menu-intf/` for GitHub Pages)

Create a local `.env` file (starting from `.env.example`):

```bash
cp .env.example .env
```

### GitHub Pages base path

For GitHub Pages deployments, the production build defaults to `VITE_BASE_PATH=/sf-demo-menu-intf/`.
Translations are loaded via i18next from `${BASE_URL}locales/...` (Vite `import.meta.env.BASE_URL`).

To serve the app at the domain root (e.g. Docker), build with `VITE_BASE_PATH=/`.

## Docker

This project builds a static bundle (Vite) and serves it via Nginx.

Build:

```bash
docker build \
  -t sf-demo-menu-intf \
  --build-arg VITE_BASE_PATH=/ \
  --build-arg VITE_API_BASE_URL=http://localhost:5000 \
  .
```

Run:

```bash
docker run --rm -p 8080:80 sf-demo-menu-intf
```

Then open `http://localhost:8080`.

Alternatively, using Compose:

```bash
docker compose up --build
```

## Tests

### Unit tests (Vitest)

```bash
yarn test
# or
yarn test:run
yarn test:coverage
```

### E2E tests (Playwright)

Playwright starts the dev server automatically and runs tests in `e2e/`:

```bash
yarn test:e2e
```

Notes:

- Some E2E tests are marked as `skip` and document expected behavior for a fully authenticated scenario.
- Full E2E coverage typically requires a reachable API (or a mock API).

## CI

The GitHub Actions workflow runs:

- ESLint + TypeScript typecheck
- Unit tests + coverage artifacts
- Playwright E2E across Chromium/Firefox/WebKit

See [.github/workflows/ci.yml](.github/workflows/ci.yml).

## User stories (what you can do in the app)

- As a restaurant user, I can **register** and **log in** to access the menu intake form.
- As a restaurant user, I can **view my profile** with username and registration date.
- As a restaurant user, I can **update my email address** from the profile page.
- As a restaurant user, I can **change my password** by providing the current password and a new one.
- As a restaurant user, I can **create a menu request** with a title and optional description.
- As a restaurant user, I can **add multiple dishes** to the menu.
- As a restaurant user, I can **describe each dish** through:
  - section/category
  - taste intensity sliders
  - temperature/fat/piquant parameters
  - visual cues (up to 3 colors)
  - selectable textures/shapes/emotions loaded from the API
- As a restaurant user, I can **edit** or **delete** dishes before submitting.
- As a restaurant user, I can **reorder dishes** to match the menu order.
- As a restaurant user, I can **save a menu as draft** (only title required, no dishes needed).
- As a restaurant user, I can **submit** the menu request (title and at least one dish required), sending menu + dishes to the SoundFood API.
- As a restaurant user, I can **edit a submitted menu** (menus remain editable after submission).
- As a restaurant user, I can **review a summary** of what was submitted.
- As a restaurant user, I can **see the list of my created menus** with their status (Draft/Submitted) and last modification time.
- As a restaurant user, I can open menu details, **edit**, and **delete** a menu.
- As a user, I can **switch language** (EN/IT) from the top bar.
- As a user, I can **log out**.

## Mermaid UML diagrams

### Component diagram

```mermaid
flowchart LR
  User((Restaurant user)) --> UI[SoundFood Menu Intake UI]

  UI --> Auth[Auth Feature]
  UI --> Profile[Profile Feature]
  UI --> Menu[Menu Feature]
  UI --> MenusMgmt[Menus Management UI]
  UI --> Shared[Shared UI/Lib]

  Auth --> Api[API Client]
  Profile --> Api
  Menu --> Api
  MenusMgmt --> Api
  Menu --> Attr[Attributes Loader]
  Attr --> Api

  Api --> SoundFoodAPI[(SoundFood API)]
  UI --> I18n["i18n (EN/IT)"]
```

### Sequence diagram — submit menu

```mermaid
sequenceDiagram
  autonumber
  actor U as Restaurant user
  participant FE as Frontend
  participant A as API Client
  participant API as SoundFood API

  U->>FE: Fill menu title/description
  U->>FE: Add dish details (tastes, colors, etc.)
  U->>FE: Click Submit

  FE->>A: POST /api/menus (CreateMenuRequest)
  A->>API: POST /api/menus
  API-->>A: { id }
  A-->>FE: menuId

  loop for each dish
    FE->>A: POST /api/menus/{menuId}/dishes (CreateDishRequest)
    A->>API: POST /api/menus/{menuId}/dishes
    API-->>A: { id }
    A-->>FE: dishId
  end

  FE->>A: POST /api/menus/{menuId}/submit
  A->>API: POST /api/menus/{menuId}/submit
  API-->>A: { message }
  A-->>FE: ok
  Note over FE: Menu status changes to 'submitted'

  FE-->>U: Show success toast + open summary drawer
```

### Sequence diagram — save menu as draft

```mermaid
sequenceDiagram
  autonumber
  actor U as Restaurant user
  participant FE as Frontend
  participant A as API Client
  participant API as SoundFood API

  U->>FE: Fill menu title (description optional)
  U->>FE: Optionally add dishes
  U->>FE: Click "Save draft"

  alt Menu not yet created
    FE->>A: POST /api/menus (CreateMenuRequest)
    A->>API: POST /api/menus
    API-->>A: { id }
    A-->>FE: menuId
    Note over FE: Menu created with status='draft'

    opt If dishes present
      loop for each dish
        FE->>A: POST /api/menus/{menuId}/dishes
        A->>API: POST /api/menus/{menuId}/dishes
        API-->>A: { id }
        A-->>FE: dishId
      end
    end
  else Menu already exists
    FE->>A: PUT /api/menus/{menuId} (status='draft')
    A->>API: PUT /api/menus/{menuId}
    API-->>A: { message }
    A-->>FE: ok
  end

  FE-->>U: Show "Draft saved" toast
```

### Sequence diagram — manage menus (list / view / edit / delete)

```mermaid
sequenceDiagram
  autonumber
  actor U as Restaurant user
  participant FE as Frontend
  participant A as API Client
  participant API as SoundFood API

  U->>FE: Open "My menus"
  FE->>A: GET /api/menus
  A->>API: GET /api/menus
  API-->>A: ApiMenu[]
  A-->>FE: menus list

  U->>FE: View menu details
  FE->>A: GET /api/menus/{id}
  A->>API: GET /api/menus/{id}
  API-->>A: ApiMenu
  A-->>FE: menu
  FE->>A: GET /api/menus/{id}/dishes
  A->>API: GET /api/menus/{id}/dishes
  API-->>A: ApiDish[]
  A-->>FE: dishes

  U->>FE: Edit menu request (title/description)
  FE->>A: PUT /api/menus/{id}
  A->>API: PUT /api/menus/{id}
  API-->>A: { message }
  A-->>FE: ok

  U->>FE: Delete menu
  FE->>A: DELETE /api/menus/{id}
  A->>API: DELETE /api/menus/{id}
  API-->>A: { message }
  A-->>FE: ok
```

### Sequence diagram — profile management (update email / password)

```mermaid
sequenceDiagram
  autonumber
  actor U as Restaurant user
  participant FE as Frontend
  participant A as API Client
  participant API as SoundFood API

  U->>FE: Open Profile page
  FE-->>U: Show profile info (username, member since)

  U->>FE: Click "Change email"
  FE-->>U: Show email input form

  U->>FE: Enter new email and confirm
  FE->>A: PATCH /auth/me/email
  A->>API: PATCH /auth/me/email
  API-->>A: { message }
  A-->>FE: ok
  FE-->>U: Show success toast

  U->>FE: Click "Change password"
  FE-->>U: Show password input form

  U->>FE: Enter current + new password and confirm
  FE->>A: PATCH /auth/me/password
  A->>API: PATCH /auth/me/password
  API-->>A: { message }
  A-->>FE: ok
  FE-->>U: Show success toast
```

### Class diagram — API domain types

```mermaid
classDiagram
  class User {
    +number id
    +string username
    +string role
    +string created_at
    +string updated_at
  }

  class ApiMenu {
    +number id
    +string title
    +string description
    +MenuStatus status
    +string created_at
    +string updated_at
  }

  class MenuStatus {
    <<enumeration>>
    draft
    submitted
  }

  class ApiDish {
    +number id
    +string name
    +string description
    +string section
    +number sweet
    +number bitter
    +number sour
    +number salty
    +number umami
    +number piquant
    +number fat
    +number temperature
    +string[] colors
    +string created_at
    +string updated_at
  }

  class ApiEmotion {
    +number id
    +string description
  }
  class ApiTexture {
    +number id
    +string description
  }
  class ApiShape {
    +number id
    +string description
  }

  User "1" --> "many" ApiMenu : owns
  ApiMenu "1" --> "many" ApiDish : dishes
  ApiMenu --> MenuStatus : status
  ApiDish "many" --> "many" ApiEmotion : emotions
  ApiDish "many" --> "many" ApiTexture : textures
  ApiDish "many" --> "many" ApiShape : shapes
```

### State diagram — menu status

```mermaid
stateDiagram-v2
  [*] --> Draft: Create new menu
  Draft --> Draft: Save draft
  Draft --> Submitted: Submit
  Submitted --> Draft: Revert to draft
  Submitted --> Submitted: Update (still editable)

  note right of Draft
    - Only title required
    - No validation on dishes
    - Can be saved anytime
  end note

  note right of Submitted
    - Title + dishes required
    - Menu sent for processing
    - Still editable
  end note
```

### State diagram — auth

```mermaid
stateDiagram-v2
  [*] --> CheckingSession
  CheckingSession --> Unauthenticated: no token / invalid token
  CheckingSession --> Authenticated: token + /auth/me ok
  Unauthenticated --> Authenticating: login/register
  Authenticating --> Authenticated: success
  Authenticating --> Unauthenticated: failure
  Authenticated --> Unauthenticated: logout
```

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
