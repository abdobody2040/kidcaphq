# KidCap HQ

## Overview
KidCap HQ is an educational financial literacy game for kids. It's a React/Vite application with TypeScript and Tailwind CSS.

## Project Structure
- `/components` - React components including game templates, UI elements, and pages
- `/data` - Static data files (curriculum, games, library books)
- `/hooks` - Custom React hooks
- `/locales` - Internationalization files (English and Arabic)
- `/services` - External services (Gemini AI, Sound, Stripe)
- `/tests` - Test files using Vitest

## Tech Stack
- React 19 with TypeScript
- Vite for build/dev server
- Tailwind CSS for styling
- Zustand for state management
- Phaser for game engine
- Framer Motion for animations
- i18next for internationalization
- Google Gemini AI integration

## Running the Project
- Development: `npm run dev` (runs on port 5000)
- Build: `npm run build`
- Preview: `npm run preview`

## Deployment
Configured for static deployment. Build output goes to `dist/` directory.
