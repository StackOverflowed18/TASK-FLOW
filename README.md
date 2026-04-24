<div align="center">

<br/>

**A lightweight, no-build-step Chrome Extension task manager**  
*Vanilla JS · Manifest V3 · chrome.storage · Zero dependencies*

<br/>

![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-MV3-4285F4?style=flat-square&logo=google-chrome&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Build Step](https://img.shields.io/badge/Build_Step-None-10D9A0?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)

<br/>

> ⚡ **No `npm install`. No compilation. No framework.**  
> Just open Chrome, point it at the `dist/` folder, and you're live.

<br/>

</div>

---

## Table of Contents

- [Overview](#overview)
- [Why Only the `dist/` Folder?](#why-only-the-dist-folder)
- [Project Structure](#project-structure)
- [What Each File Does](#what-each-file-does)
- [Features](#features)
- [How to Deploy on Chrome](#how-to-deploy-on-chrome)
- [How to Use](#how-to-use)
- [Storage & Data](#storage--data)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TaskFlow is a **zero-dependency Chrome Extension** built with plain HTML, CSS, and JavaScript. There is no React, no Webpack, no compilation pipeline — what you write is what Chrome runs. All task data persists locally via `chrome.storage` and the background lifecycle is handled by a Manifest V3 service worker.

This makes TaskFlow an ideal reference project for understanding how Chrome Extensions actually work under the hood, without any framework abstractions in the way.

---

## Why Only the `dist/` Folder?

> This is the most important concept to understand about Chrome Extensions.

When you load an extension into Chrome using **"Load unpacked"**, Chrome reads **exactly one folder** and treats everything inside it as the complete extension. It does not care about your `src/`, `node_modules/`, `package.json`, or any other development files. Chrome only needs:

```
dist/
├── manifest.json        ← Chrome reads this first. Always.
├── index.html           ← The popup UI shell
├── popup.js             ← All the UI logic
├── styles.css           ← All the styling
├── service-worker.js    ← Background script
└── icons.svg            ← Extension icon
```

Here is exactly what happens when you click an extension icon in Chrome:

```
User clicks toolbar icon
        │
        ▼
Chrome reads  dist/manifest.json
        │
        ├──▶ "default_popup": "index.html"
        │         └──▶ Loads index.html
        │                   ├── Links styles.css   (styling)
        │                   └── Links popup.js     (all logic)
        │
        └──▶ "service_worker": "service-worker.js"
                  └──▶ Runs in background (handles install/update events)
```

**Chrome never looks outside the folder you loaded.** This is why:

| What Chrome ignores | Why it doesn't matter |
|---|---|
| `src/` source files | Chrome only runs compiled/final output |
| `node_modules/` | No npm packages run inside the extension |
| `package.json` | That's for your dev toolchain, not Chrome |
| `.gitignore`, `eslint.config.js` | Development tooling only |
| `README.md` | Documentation — Chrome has no use for it |

**In a framework-based project** (like React + Vite), the `dist/` folder is *generated* by a build tool that compiles JSX, bundles modules, and minifies everything. In this project, the `dist/` folder *is* the source — you write directly into it. No compilation step exists or is needed.

This is the most direct, transparent way to build a Chrome Extension. There is no magic.

---

## Project Structure

```
your-project/
│
├── dist/                        ← ✅ THE ONLY FOLDER CHROME CARES ABOUT
│   ├── assets/                  ← Static assets (images, fonts if any)
│   ├── src/                     ← (Optional) utility modules imported by popup.js
│   ├── favicon.svg              ← Browser tab icon
│   ├── icons.svg                ← Extension toolbar icon
│   ├── index.html               ← Popup HTML shell (420px wide popup window)
│   ├── manifest.json            ← Extension identity, permissions, entry points
│   ├── popup.js                 ← All UI logic: CRUD, rendering, event listeners
│   ├── service-worker.js        ← Background script: install/update lifecycle
│   └── styles.css               ← All styling: dark theme, animations, layout
│
├── node_modules/                ← Dev tooling only (ESLint, etc.) — Chrome ignores
├── public/                      ← Static files that may be copied into dist/
├── src/                         ← Raw source files (if you use a build step later)
├── .gitignore
├── eslint.config.js             ← Code linting config — Chrome ignores
├── index.html                   ← Root HTML (only relevant if running in browser tab)
├── package-lock.json
├── package.json                 ← Scripts and dev dependencies — Chrome ignores
└── README.md
```

> **Git tip:** You should commit the entire repo but only ever load the `dist/` folder into Chrome. Add `node_modules/` to your `.gitignore` — it doesn't need to be in version control.

---

## What Each File Does

### `dist/manifest.json` — The Extension's Identity Card

This is the **first file Chrome reads**. It tells Chrome everything about the extension:

```json
{
  "manifest_version": 3,
  "name": "TaskFlow",
  "version": "1.0.0",
  "description": "A lightweight task manager that lives in your Chrome toolbar.",
  "action": {
    "default_popup": "index.html",
    "default_icon": "icons.svg"
  },
  "background": {
    "service_worker": "service-worker.js"
  },
  "permissions": ["storage"]
}
```

Every path in `manifest.json` is **relative to the `dist/` folder**. If `index.html` isn't at `dist/index.html`, the popup won't open. If `service-worker.js` isn't at `dist/service-worker.js`, the background script won't run.

---

### `dist/index.html` — The Popup Window

When you click the extension icon, Chrome opens a small popup window and renders this HTML file inside it. It is a completely normal HTML document with two differences:

1. It has a fixed width (typically 380–420px) because Chrome constrains popup dimensions.
2. It cannot load scripts from external CDNs (Content Security Policy blocks it). All JS must be local.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="popup.js"></script>
  </body>
</html>
```

---

### `dist/popup.js` — All the Logic

This is the brain of the extension. It handles:

- **Rendering** the task list to the DOM
- **Event listeners** for adding, editing, deleting, and toggling tasks
- **Reading from and writing to** `chrome.storage` (the persistence layer)
- **Filtering and sorting** tasks based on user selections
- **Search** across task titles and descriptions

Because there is no framework, all DOM manipulation is done with vanilla JavaScript (`document.createElement`, `innerHTML`, `addEventListener`, etc.).

---

### `dist/styles.css` — All the Styling

A single stylesheet that covers:

- The dark-mode colour palette (CSS custom properties / variables)
- Card layouts, form styles, button states
- Animations for task entry, form slide-in, and empty states
- Scrollbar customisation for the popup body

---

### `dist/service-worker.js` — Background Script

Manifest V3 requires background logic to live in a **Service Worker** (not a persistent background page like MV2). This script:

- Runs in the background, separate from the popup
- Handles `chrome.runtime.onInstalled` (fires on first install or extension update)
- Terminates automatically when idle (Chrome restarts it when needed)
- Does **not** have access to the DOM — it is a pure JS execution context

```js
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    console.log('[TaskFlow] Extension installed!');
  }
});
```

> The service worker does **not** need to be running for the popup to work. Chrome wakes it up only when a background event fires.

---

### `dist/icons.svg` — Toolbar Icon

The SVG file Chrome displays as the extension's icon in the toolbar. Manifest V3 supports SVG icons directly — no need to export multiple PNG sizes.

---

## Features

### ✅ Full CRUD Task Management

| Operation | Interaction |
|-----------|------------|
| **Create** | Click `+ Add Task` → fill form → Save |
| **Read** | Tasks render as cards; filter by All / Active / Done |
| **Update** | Hover a card → click pencil icon → edit inline |
| **Delete** | Hover a card → click trash icon; or "Clear completed" |

### 🎯 Task Fields

- **Title** — short label for the task (required)
- **Description** — optional expanded notes, collapsible in-card
- **Priority** — `Low` · `Medium` · `High` · `Critical` with colour coding
- **Status** — `To Do` · `In Progress` · `Done`
- **Due Date** — date picker; overdue tasks are highlighted in red

### 🔍 Filter, Search & Sort

- Filter tabs: `All` / `Active` / `Done` with live counts
- Search bar: filters tasks by title and description in real time
- Sort: by creation date, due date, or priority level

### 📊 Progress Bar

Footer shows a live completion percentage bar and a "Clear completed" button.

### 🌙 Dark Mode

The entire UI uses CSS custom properties for a consistent dark theme — no toggle needed, dark by default.

---

## How to Deploy on Chrome

Because this project has **no build step**, deployment is just pointing Chrome at the `dist/` folder. Here is the full process:

### Step 1 — Download or clone the repository

```bash
git clone https://github.com/your-username/taskflow-extension.git
```

You do not need to run `npm install` to use the extension. The `dist/` folder is self-contained and ready to load. (Run `npm install` only if you want ESLint or other dev tools.)

### Step 2 — Open Chrome's extension manager

In your Chrome address bar, type:

```
chrome://extensions
```

and press Enter.

### Step 3 — Enable Developer Mode

Find the **Developer mode** toggle in the top-right corner of the page and switch it **on**.

```
┌──────────────────────────────────────────────────────┐
│  Extensions                      Developer mode  [●] │
│                                                      │
│  ┌────────────────┐ ┌──────────────────┐             │
│  │  Load unpacked │ │  Pack extension  │             │
│  └────────────────┘ └──────────────────┘             │
└──────────────────────────────────────────────────────┘
```

### Step 4 — Load the `dist/` folder

Click **"Load unpacked"** → a file picker opens → navigate to your project and **select the `dist/` folder** (not the root project folder — specifically `dist/`).

> ⚠️ **Common mistake:** Selecting the root project folder (which contains `package.json`, `src/`, etc.) will fail or behave unexpectedly because Chrome looks for `manifest.json` at the root of whatever folder you select. The `manifest.json` lives inside `dist/`, so select `dist/`.

### Step 5 — Pin the extension

Click the **puzzle piece icon** 🧩 in the Chrome toolbar → find TaskFlow → click the **pin icon** 📌. The ⚡ icon will now appear permanently in your toolbar.

### Step 6 — Click the icon and use it!

That's it. No server. No localhost. No deployment pipeline. It runs entirely inside Chrome.

---

### Making Changes

Since there is no build step, edit the files in `dist/` directly and reload:

```
1. Edit  dist/popup.js  (or styles.css, or index.html)
2. Go to chrome://extensions
3. Click the ↺ reload button on the TaskFlow card
4. Click the extension icon — changes are live
```

---

## Storage & Data

Tasks are saved using `chrome.storage.local` (or `.sync` if configured). This means:

- Data **persists** when you close and reopen Chrome
- Data **survives** extension reloads and Chrome restarts
- Data is stored **privately** on your machine (or synced via your Google account if using `.sync`)
- **No external server** is involved — your tasks never leave your browser

The data shape stored looks like this:

```json
{
  "taskflow_tasks": {
    "task_1714000000000_x7k2m": {
      "id": "task_1714000000000_x7k2m",
      "title": "Read the MV3 migration guide",
      "description": "Focus on service worker limitations",
      "priority": "high",
      "status": "in_progress",
      "dueDate": "2024-12-15",
      "createdAt": "2024-11-20T09:00:00.000Z",
      "updatedAt": "2024-11-20T10:30:00.000Z"
    }
  }
}
```

You can inspect your extension's stored data at any time by going to:

```
chrome://extensions → TaskFlow → "Service Worker" link → Application tab → Storage
```

---

## Contributing

```bash
# Clone the repo
git clone https://github.com/your-username/taskflow-extension.git
cd taskflow-extension

# No install needed to run the extension.
# Install dev tools only if you want linting:
npm install

# Edit files directly in dist/
# Then reload the extension in chrome://extensions
```

**Ideas for contributions:**

- [ ] Drag-and-drop to reorder tasks
- [ ] Due date reminder notifications via `chrome.alarms`
- [ ] Export tasks as a `.json` or `.csv` file
- [ ] Light mode toggle
- [ ] Task categories / labels
- [ ] Options page for user preferences

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

The simplest possible Chrome Extension architecture.  
No magic. No abstractions. Just files Chrome can read.

**If this helped you understand extensions better, drop a ⭐**

</div>