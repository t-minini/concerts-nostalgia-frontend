# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Concerts Nostalgia — a personal app for logging live concerts attended ("my live concerts journey, revisited"). This is the frontend; the backend (Express + MongoDB) lives in a separate repo, [concerts-nostalgia-backend](https://github.com/t-minini/concerts-nostalgia-backend). Per the README, the project is still under active/early development.

## Commands

Built with Create React App (`react-scripts`) — no custom build tooling.

- `npm start` — run dev server
- `npm run build` — production build
- `npm test` — CRA interactive watch-mode test runner (Jest + React Testing Library)
  - `npm test -- --watchAll=false` — run once, non-interactively
  - `npm test -- -t "test name"` — run tests matching a name pattern
- There is no separate lint script; linting runs via the `react-app` / `react-app/jest` ESLint config as part of CRA's build/test pipeline.

## Architecture

Everything lives under `src/`. `index.js` renders `App.js` wrapped in `BrowserRouter`, but the app is effectively a single page (no route definitions exist) — `App.js` just stacks three sections: `Hero`, `TicketsList`, `Footer`. `Hero` uses `react-scroll`'s `Link` to smooth-scroll down to the `#tickets` section rendered by `TicketsList`.

**Data flow**: `src/api/concerts-nostalgia-api.js` exports a single shared axios instance. Its `baseURL` switches on `process.env.NODE_ENV`: `http://localhost:4000` in development, a Render-hosted URL in production. A global axios request interceptor logs every outgoing request.

**Core feature (`TicketsList`)**: fetches concerts via `GET /concerts/` and renders each as a ticket-styled card. A concert record has: `tour`, `artist`, `year`, `location`, `city`, `country`, `rating` (1-5, rendered as stars), and `background` (one of `background-one` ... `background-five`, a CSS-module class picking one of five ticket visual styles).

- Clicking a ticket opens `ConcertDetails`, a modal that toggles between read-only and edit mode, backed by `PUT /concerts/edit/:id` and `DELETE /concerts/delete/:id`.
- The `+` button next to the "concerts" heading opens `AddConcert`, a modal that creates a concert via `POST /concerts/add`.
- `AddConcert` and `ConcertDetails` are near-duplicate forms (same fields, same Ant Design layout). When changing form fields/validation in one, check whether the other needs the same change. Both also include a disabled/non-functional image `Upload.Dragger` — image upload isn't wired up yet.

**Styling**: CSS Modules colocated with each component (`ComponentName.jsx` + `ComponentName.module.css`), imported as `style` and referenced as `style.foo` or `style['kebab-key']` for hyphenated class names.

**Ant Design theming**: `src/styles/antdesign-themes.js` centralizes all `ConfigProvider` theme objects used across the app (button, modal, input, select, date-picker), including a gradient "rainbow" primary-button theme built with `@ctrl/tinycolor`. Reuse these exports rather than inlining new theme overrides in components.

**Dependency note**: `@ant-design/icons` is imported directly in components (e.g. `AddConcert.jsx`) but is not a direct `package.json` dependency — it's only present transitively via `antd`. Be aware of this if `antd` is ever upgraded or icon imports start failing.
