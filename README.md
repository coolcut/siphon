# Siphon

A subscription tracking app for macOS built with Tauri, React, and TypeScript.

## Features

- Track recurring subscriptions with customizable billing cycles
- Organize subscriptions by category
- Pre-populated list of common services (Netflix, Spotify, etc.)
- Native macOS appearance with vibrancy effects

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI prerequisites](https://tauri.app/start/prerequisites/)

### Getting Started

```bash
npm install
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Base UI
- **Backend:** Tauri 2, Rust
- **Database:** SQLite via tauri-plugin-sql

## IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
