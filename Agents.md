# MemeLibrary

Expo React Native application using Expo Router with file-based routing.

## Tech Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19
- **Routing**: Expo Router v6 (file-based, `app/` directory)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: react-native-reusables (shadcn/ui for React Native)

## Project Structure

- `app/` — Screens and layouts (file-based routing)
- `components/` — Reusable UI components
- `components/ui/` — react-native-reusables components (Button, Input, Badge, Card, Text, etc.)
- `context/` — React context providers (MemeLibrary, etc.)
- `lib/` — Utility functions (`cn()` helper, constants)
- `constants/` — App constants and theme
- `hooks/` — Custom React hooks
- `assets/` — Images and static assets
- `scripts/` — Utility scripts

## Commands

- `npm start` — Start Expo dev server
- `npm run lint` — Run ESLint
- `npx @react-native-reusables/cli@latest add <component>` — Add a new RNR component
- `npx prettier --check .` — Check formatting
- `npx prettier --write .` — Fix formatting

## Pre-Commit Rules

Before every git commit, you **must** ensure linting and formatting pass:

1. Run `npm run lint` and fix any errors
2. Run `npx prettier --check .` and fix any issues with `npx prettier --write .`
3. Only commit once both commands pass cleanly

## UI Component Rules

- **Always use react-native-reusables components** (`@/components/ui/*`) when building UI. Prefer `Text`, `Button`, `Input`, `Badge`, `Card`, and other RNR components over raw React Native primitives or custom themed components.
- Use NativeWind `className` for styling instead of `StyleSheet.create()`.
- Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes conditionally.
- Use semantic color tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, etc.) from the theme defined in `global.css` rather than hardcoded colors.
- To add new UI components from react-native-reusables, run: `npx @react-native-reusables/cli@latest add <component-name>`

## Platform Compatibility

All modifications must work on both Expo Web and native (iOS/Android). Do not use libraries or native components that are unsupported on the web platform. When adding new dependencies, verify they have web support.
