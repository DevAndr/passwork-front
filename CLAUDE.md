# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `yarn dev` (runs on port 3000)
- **Build:** `yarn build` (runs `tsc -b && vite build`, output in `dist/`)
- **Lint:** `yarn lint` (ESLint with TypeScript and React plugins)
- **Preview production build:** `yarn preview`

Package manager is **yarn**.

## Tech Stack

- React 19 with TypeScript (strict mode enabled)
- Vite 7 with `@vitejs/plugin-react`
- ESLint 9 flat config with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins

## TypeScript Configuration

- Target: ES2022, module: ESNext, JSX: react-jsx
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Bundler module resolution (`allowImportingTsExtensions`, `verbatimModuleSyntax`)
- Source files in `src/`, separate tsconfigs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)

## Project Structure

- `src/main.tsx` — App entry point (renders into `#root` with StrictMode)
- `src/App.tsx` — Root component
- `public/` — Static assets served at root
- `index.html` — Vite HTML entry point


## Функции
* регистрация / авторизация
* импорт паролей из браузеров
* хранение паролей (шифрование)
* генератор паролей
* папки
* теги
* поиск
* shared passwords
* история изменений

## Технологии
### Frontend:
* React
* axios
* Zustand
* TanStack Query
* shadcn/ui