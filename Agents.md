# MemeLibrary

Expo React Native application using Expo Router with file-based routing.

## Tech Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19
- **Routing**: Expo Router v6 (file-based, `app/` directory)
- **Language**: TypeScript

## Project Structure

- `app/` — Screens and layouts (file-based routing)
- `components/` — Reusable UI components
- `constants/` — App constants and theme
- `hooks/` — Custom React hooks
- `assets/` — Images and static assets
- `scripts/` — Utility scripts

## Commands

- `npm start` — Start Expo dev server
- `npm run lint` — Run ESLint
- `npx prettier --check .` — Check formatting
- `npx prettier --write .` — Fix formatting

## Pre-Commit Rules

Before every git commit, you **must** ensure linting and formatting pass:

1. Run `npm run lint` and fix any errors
2. Run `npx prettier --check .` and fix any issues with `npx prettier --write .`
3. Only commit once both commands pass cleanly
