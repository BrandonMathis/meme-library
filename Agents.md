# MemeLibrary

Expo React Native application using Expo Router with file-based routing.

## Tech Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19
- **Routing**: Expo Router v6 (file-based, `app/` directory)
- **Language**: TypeScript
- **Desktop**: Electron (wraps web build for desktop distribution)
- **Platforms**: iOS, Web, Desktop (macOS, Windows, Linux)

## Project Structure

- `app/` — Screens and layouts (file-based routing)
- `components/` — Reusable UI components
- `constants/` — App constants and theme
- `hooks/` — Custom React hooks
- `assets/` — Images and static assets
- `scripts/` — Utility scripts
- `electron/` — Electron main process for desktop builds

## Commands

- `npm start` — Start Expo dev server
- `npm run ios` — Start on iOS simulator
- `npm run web` — Start on web browser
- `npm run build:web` — Export web build to `dist/`
- `npm run desktop:dev` — Run desktop app in development (Electron + Expo dev server)
- `npm run desktop:preview` — Build web and preview in Electron
- `npm run desktop:build` — Build distributable desktop app
- `npm run lint` — Run ESLint
