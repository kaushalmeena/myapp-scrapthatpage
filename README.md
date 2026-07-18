# ScrapThatPage

> A cross-platform desktop app for automating web scraping with simple, visual script actions — no code required.

![License](https://img.shields.io/badge/license-MIT-blue)
![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)

ScrapThatPage lets you build reusable scraping **scripts** by stacking
operations — open a page, click, type, extract data — and run them against a
live browser window. Extracted data lands in a table you can export to CSV or
JSON. Scripts are saved locally, so everything runs on your machine.

## Screenshots

|  |  |
| --- | --- |
| ![Home](./screenshots/Home.png) | ![Create](./screenshots/Create.png) |
| ![Execute](./screenshots/Execute.png) | ![Search](./screenshots/Search.png) |

<details>
<summary>More screenshots</summary>

![Favorites](./screenshots/Favorites.png)
![Update information](./screenshots/UpdateInformation.png)
![Update operations](./screenshots/UpdateOperations.png)
![Settings](./screenshots/Settings.png)
![Delete](./screenshots/Delete.png)

</details>

## Features

- **Visual script builder** — compose a script from operations without writing code.
- **Browser operations** — `open` a URL, `click` an element, `type` into a field, and `extract` values by CSS selector and attribute.
- **Variables & control flow** — `set`/`increase`/`decrease` variables and branch or loop with `if`/`while` (conditions are evaluated with [mathjs](https://mathjs.org/)).
- **Templating** — reference variables inside inputs with `{{variable}}` placeholders.
- **Results table** — extracted data is collected into a table and exported to **CSV** or **JSON**.
- **Library management** — create, update, delete, favorite, and search your saved scripts.
- **Local-first** — scripts are stored on-device in IndexedDB; nothing is sent anywhere.
- **Light & dark themes.**

## How it works

A **script** is an ordered list of **operations**. When you run it, ScrapThatPage
opens a dedicated, sandboxed scraper window and executes each operation in turn:

1. `open` navigates the scraper window to a URL.
2. `click` / `type` interact with elements via CSS selectors.
3. `extract` reads an attribute from every element matching a selector and adds
   it as a column in the results table.
4. `set` / `increase` / `decrease`, `if`, and `while` drive variables and control
   flow so you can page through results or scrape conditionally.

Under the hood each operation is stored in a compact form and run through the
main process over a small, validated IPC bridge — the renderer never talks to
Node.js or the scraped page directly.

## Tech stack

- [Electron](https://www.electronjs.org/) + [Electron Forge](https://www.electronforge.io/) (packaging) with [Vite](https://vite.dev/) (bundling)
- [React](https://react.dev/) + [Material UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) (state) + [Dexie](https://dexie.org/) (IndexedDB)
- [TypeScript](https://www.typescriptlang.org/)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ (or 22.12+)
- [pnpm](https://pnpm.io/) 10+
- [git](https://git-scm.com/) (to clone the repository)

### Installation

```bash
git clone https://github.com/kaushalmeena/myapp-scrapthatpage.git
cd myapp-scrapthatpage
pnpm install
```

### Running in development

```bash
pnpm start
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Launch the app in development with hot reload. |
| `pnpm package` | Bundle the app into a platform-specific executable in `out/`. |
| `pnpm make` | Build distributable installers/archives for the current platform. |
| `pnpm lint` | Run ESLint. |
| `pnpm typecheck` | Type-check the project with `tsc` (no emit). |

## Project structure

```
src/
├── main/       # Electron main process — window, scraper, IPC handlers
├── preload/    # contextBridge API exposed to the renderer
├── common/     # Types and constants shared across processes
└── renderer/   # React UI (screens, components, redux, hooks, database)
```

## Building for distribution

```bash
pnpm make
```

Artifacts are written to `out/`. Forge is configured to produce a Squirrel
installer (Windows), a ZIP (macOS), and `.deb` / `.rpm` packages (Linux); build
on the target OS to produce that platform's package.

## Development notes

Two dev dependencies are intentionally held one major version behind the latest
release because the lint tooling has not caught up yet:

- **TypeScript is pinned to `5.9.x`** (not 7.x). `typescript-eslint` does not yet
  support the TypeScript 7 native compiler (it caps at `<6.1.0`), so ESLint
  crashes when parsing under TS 7. The app itself builds and runs on TS 7 — only
  the linter is the blocker.
- **ESLint is pinned to `9.x`** (not 10.x). `eslint-plugin-react` still calls
  `context.getFilename()`, which ESLint 10 removed.

Bump both once `typescript-eslint` ships TypeScript 7 support and
`eslint-plugin-react` supports ESLint 10.

## License

Licensed under the MIT License — see [LICENSE](LICENSE) for details.
