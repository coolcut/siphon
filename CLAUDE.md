# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Siphon is a subscription tracking desktop application built with Tauri 2, React 19, and TypeScript. It uses SQLite for local data persistence via `tauri-plugin-sql`.

## Development Commands

```bash
# Start development (runs Vite dev server + Tauri app)
npm run tauri dev

# Build for production
npm run tauri build

# Frontend only (Vite dev server at localhost:1420)
npm run dev

# Type check and build frontend
npm run build
```

## Architecture

### Frontend (React + TypeScript)
- `src/App.tsx` - Main app component with sidebar navigation, settings pages, and dialogs
- `src/lib/types.ts` - TypeScript interfaces mirroring Rust models (Category, Service, Subscription, etc.)
- `src/lib/database.ts` - Database access layer using `@tauri-apps/plugin-sql` with raw SQL queries

### Backend (Rust + Tauri)
- `src-tauri/src/lib.rs` - Tauri app initialization with SQLite migrations (schema + seed data)
- `src-tauri/src/models.rs` - Rust data models with serde serialization

### Database Schema
Three main tables with relationships:
- `categories` - Subscription categories (Entertainment, Productivity, etc.)
- `services` - Known subscription services (Netflix, Spotify, etc.) linked to default categories
- `subscriptions` - User subscriptions linked to services and categories

Database migrations are defined in `src-tauri/src/lib.rs` and run automatically on app start.

### UI Framework
Uses `@base-ui/react` for accessible components (Dialog, Tooltip, Switch). Window uses macOS-specific features: transparent background with vibrancy effects, hidden title bar with custom traffic light positioning.

## Key Patterns

- Amounts stored as cents (integer) in database, formatted for display via `formatAmount()` helper
- Billing cycles: weekly, monthly, quarterly, semi_annually, yearly
- Database queries return flattened `SubscriptionView` with JOINed service/category data
- UUIDs generated client-side via `crypto.randomUUID()`
