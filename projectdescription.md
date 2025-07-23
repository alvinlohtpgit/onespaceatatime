# Project Description: One Thing At a Time

## Overview

One Thing At a Time is a focused to-do application built with Vue 3, designed to help users concentrate on a single task at a time. The app is offline-first, using PouchDB for local data storage and synchronization. The UI leverages PrimeVue for a modern, accessible look and feel. Pinia is used for state management, and task reordering is enabled via drag-and-drop using [vue.draggable.next](https://github.com/SortableJS/vue.draggable.next).

## Core Features

1. **Task List with Drag-and-Drop**
    - Users can add, edit, delete, and reorder tasks.
    - The first item in the list is always displayed in a prominent "Doing Now" box at the top of the UI.
    - Drag-and-drop reordering is implemented using vue.draggable.next.

2. **Offline-First Data Storage**
    - All tasks are stored locally using PouchDB.
    - The app should work seamlessly offline, persisting all changes locally.
    - (Optional for future) Support for remote CouchDB sync can be scaffolded but not required for MVP.

3. **PrimeVue UI**
    - Use PrimeVue components for all UI elements (inputs, buttons, dialogs, lists, etc.).
    - Ensure a clean, distraction-free, mobile-friendly layout.
    - The "Doing Now" box should use a larger font and visually stand out.

4. **Pinia State Management**
    - Use Pinia for all application state (task list, Pomodoro settings, timer state, etc.).
    - State should be initialized from PouchDB on app load and kept in sync.

5. **Pomodoro Timer**
    - User can enable/disable a Pomodoro timer for the current task.
    - Timer settings are configurable: work duration, short break, long break, number of cycles before a long break.
    - Timer state is visually prominent when active, with clear start/pause/reset controls.
    - When a Pomodoro session ends, user is notified (visual and/or audio cue). Visual Cue can be a pulsating red box for example. 

6. **Task Completion**
    - User can mark a task as complete (removes it from the list or archives it).
    - Optionally, show completed tasks in a collapsible section.

7. **Accessibility & UX**
    - All interactive elements must be keyboard accessible.
    - Use ARIA roles and labels where appropriate.
    - Responsive design for mobile and desktop.

## Implementation Details

### 1. Project Setup
- Use Vue 3 + Vite as the base.
- Install and configure PrimeVue, Pinia, PouchDB, and vue.draggable.next.
- Set up PrimeVue theme and icons.

### 2. Data Model
- Each task: `{ id, title, notes, createdAt, updatedAt, completed }`
- Store tasks as a list in PouchDB, keyed by unique `id`.
- Pinia store mirrors the PouchDB data and provides actions for CRUD and reordering.

### 3. UI Structure
- **Header**: App title, settings button (for Pomodoro config)
- **Doing Now Box**: Shows the first task in the list, large and prominent
- **Task List**: Draggable list of remaining tasks
- **Add Task**: Input and button to add new tasks
- **Pomodoro Timer**: Shown when enabled, with controls and settings
- **Completed Tasks**: Collapsible section (optional for MVP)

### 4. Drag-and-Drop
- Use `<draggable v-model="tasks" item-key="id">` for the task list
- On drag end, update the order in both Pinia and PouchDB
- The first item in the list is always the "Doing Now" task

### 5. Pomodoro Timer
- Store timer state in Pinia (current phase, time left, cycles completed)
- Allow user to configure durations and cycles (PrimeVue Dialog or Panel)
- Timer should pause/resume/reset, and auto-advance through work/break cycles
- Notify user when a session ends (PrimeVue Toast or similar)

### 6. Offline-First with PouchDB
- On app load, initialize Pinia store from PouchDB
- All CRUD and reorder actions update both Pinia and PouchDB
- Listen for PouchDB changes and update Pinia state accordingly

### 7. State Persistence
- Persist Pomodoro settings and timer state in PouchDB as well
- Ensure all user data survives reloads and offline usage

### 8. Accessibility & Responsiveness
- Use semantic HTML and PrimeVue's accessibility features
- Ensure all controls are keyboard navigable
- Responsive layout for mobile and desktop

## Optional/Future Enhancements
- Remote sync with CouchDB
- User authentication
- Task due dates and reminders
- Analytics on task completion and Pomodoro usage

## References
- [PrimeVue Documentation](https://www.primevue.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [PouchDB Documentation](https://pouchdb.com/)
- [Vue Draggable Next](https://github.com/SortableJS/vue.draggable.next)

---

**This file is intended for AI agent consumption. Follow the above requirements and structure for implementation.** 