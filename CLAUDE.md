# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + Vite project using Bun as the package manager. It follows the standard Vue 3 template structure with Vue Router for routing and Pinia for state management. The application uses PouchDB for the local data store as it adopts a offline-first design. There should also be a optional environment variable which points to a remote CouchDB for a sync. This project uses PrimeVue as the UI component library for the front end. 

## Project Guidelines
1. First think through the problem, read the codebase for relevant files, and create a plan and write the plan to projectplan.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. In the plan, please also include the proposed database schema.  
4. Before you begin working, check in with me and I will verify the plan
5. Then, begin working on the todo items, marking them as complete as you go.
6. At every step of the way just give me a high level explanation of what changes you made.
7. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
8. Finally, add a review section to the projectplan.md file with a summary of the change you made and any other relevant information.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Architecture

### Technology Stack
- **Vue 3** with Composition API
- **Vite 7** as build tool and dev server
- **Vue Router 4** with HTML5 history mode
- **Pinia** for state management
- **Bun** as JavaScript runtime and package manager
- **PouchDB** as the local data store for offline-first design
- **CouchDB** as the optional remote data store for sync
- **PrimeVue** as the frontend UI components
-

### Project Structure
- `/src/main.js` - Application entry point that creates Vue app, initializes Pinia and Router
- `/src/App.vue` - Root component
- `/src/views/` - Page components (HomeView, AboutView)
- `/src/components/` - Reusable Vue components
- `/src/router/index.js` - Route definitions with lazy loading for About page
- `/src/stores/` - Pinia stores using Composition API pattern (e.g., counter.js)
- `/src/assets/` - Static assets including CSS files

### Key Configuration
- **Path Alias**: `@` resolves to `/src` directory (configured in vite.config.js)
- **Vue DevTools**: Enabled via vite-plugin-vue-devtools
- **Module Type**: ES6 modules (type: "module" in package.json)

### Routing
Routes are defined in `/src/router/index.js`:
- `/` - Home page (HomeView component)
- `/about` - About page (lazy-loaded AboutView component)

### State Management
Pinia stores in `/src/stores/` follow the Composition API pattern with:
- `ref()` for reactive state
- `computed()` for derived state
- Functions for actions

## Important Notes

- No testing framework is currently configured
- No linting or code formatting tools are set up
- The project uses Vue 3's Composition API style throughout