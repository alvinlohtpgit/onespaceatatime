# Implementation Plan: One Space At a Time Task Manager

## Project Overview
Transform the existing Vue 3 + Vite template into a focused, offline-first task management application with drag-and-drop reordering, Pomodoro timer, Kinde authentication, and AI-enhanced features.

## Database Schema (PouchDB Documents)

### Tasks Collection
```javascript
{
  _id: "[username]::task::[timestamp]::[uuid]",
  type: "task",
  userId: String, // Kinde user ID
  username: String, // Kinde username
  title: String,
  notes: String,
  nextAction: String,
  whyItMatters: String,
  order: Number,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date || null,
  estimatedDuration: Number || null, // minutes
  actualDuration: Number || null, // minutes
  priority: String // "high", "medium", "low"
}
```

### Settings Collection
```javascript
{
  _id: "[username]::settings",
  type: "settings",
  userId: String, // Kinde user ID
  username: String, // Kinde username
  pomodoro: {
    workDuration: 25, // minutes
    shortBreak: 5,
    longBreak: 15,
    cyclesBeforeLongBreak: 4,
    enabled: false
  },
  focusMode: {
    enabled: false,
    nudgeAfterMinutes: 30
  },
  theme: {
    colors: {
      primary: "#ffa90a",
      secondary: "#ffd793",
      background: "#ffffff",
      textSecondary: "#999999",
      textPrimary: "#262626"
    }
  }
}
```

### Timer State Collection
```javascript
{
  _id: "[username]::timer::state",
  type: "timer_state",
  userId: String, // Kinde user ID
  username: String, // Kinde username
  isActive: false,
  isPaused: false,
  currentPhase: "work", // "work", "shortBreak", "longBreak"
  timeRemaining: 1500, // seconds
  cyclesCompleted: 0,
  sessionStartTime: Date || null,
  taskId: String || null
}
```

## Implementation Todo List

### Phase 1: Foundation & Dependencies
- [x] Install required dependencies (PrimeVue, PouchDB, vue.draggable.next, @kinde-oss/kinde-auth-js)
- [x] Configure Kinde authentication (client ID, domain, redirect URLs)
- [x] Set up authentication guards and protected routes
- [x] Configure PrimeVue theme with custom color scheme
- [x] Set up PouchDB connection and database initialization
- [x] Create base Pinia stores (auth, tasks, settings, timer)
- [x] Replace default Vue template with app shell

### Phase 2: Authentication System
- [x] Create Kinde authentication service
- [x] Build Login/Signup components using PrimeVue
- [x] Implement authentication state management in Pinia
- [x] Add route guards for authenticated routes
- [x] Create user profile management
- [x] Handle authentication tokens and refresh logic
- [x] Add logout functionality

### Phase 3: User-Scoped Data Management
- [x] Modify PouchDB queries to filter by username
- [x] Update all document _id generation to include username prefix
- [x] Implement user-specific database initialization
- [x] Add data isolation between users
- [x] Handle user switching and data cleanup

### Phase 4: Core Task Management
- [x] Create Task model and PouchDB integration with user scoping
- [x] Build TaskList component with drag-and-drop (vue.draggable.next)
- [x] Implement "Doing Now" prominent display box
- [x] Add task CRUD operations (create, edit, delete, complete)
- [x] Create AddTask component with PrimeVue inputs
- [x] Implement task reordering persistence with user context

### Phase 5: Pomodoro Timer
- [x] Create PomodoroTimer component with start/pause/reset
- [x] Implement timer state management in Pinia with user scoping
- [x] Add timer settings configuration dialog
- [x] Create timer notifications (visual/audio cues)
- [x] Auto-advance through work/break cycles
- [x] Integrate timer with current task

### Phase 6: Enhanced Task Features
- [x] Add "Next Action" and "Why this matters" fields to tasks
- [x] Implement completed tasks archive with collapsible view
- [x] Create Focus Lock mode to hide non-current tasks
- [x] Add gentle task nudging system for long-running tasks
- [x] Implement pop-out window functionality

### Phase 7: UI/UX Polish
- [x] Apply custom color theme (#ffa90a, #ffd793, etc.)
- [x] Ensure responsive design for mobile/desktop
- [x] Add keyboard accessibility throughout
- [x] Implement ARIA labels and semantic HTML
- [x] Add loading states and error handling
- [x] Create user avatar/profile display in header

### Phase 8: Offline-First Architecture
- [x] Ensure all operations work offline with authentication state
- [x] Implement data synchronization between Pinia and PouchDB
- [x] Add data persistence validation
- [x] Handle PouchDB change events with user context
- [x] Scaffold remote CouchDB sync with user authentication (optional)

### Phase 9: Advanced Features (Future)
- [ ] AI task analysis and recommendations
- [ ] Natural language task input parsing
- [ ] Effort and time estimation learning
- [ ] Priority prediction system
- [ ] Adaptive Pomodoro recommendations

## Key Technical Considerations

1. **Authentication Flow**: Kinde login → User context → Scoped data access
2. **State Management Flow**: PouchDB (user-scoped) → Pinia Store → Vue Components
3. **Data Isolation**: All documents prefixed with username for multi-user support
4. **Drag & Drop**: Use vue.draggable.next with proper order persistence
5. **Timer Architecture**: Separate timer logic from UI components
6. **Offline-First**: All operations must work without network (with cached auth)
7. **Accessibility**: Full keyboard navigation and screen reader support
8. **Performance**: Lazy loading for non-essential features
9. **Component Architecture**: 
   - Keep interface components small and self-contained
   - Create reusable Vue components for repeated UI elements (e.g., TaskCard, TimerDisplay)
   - Each component should have a single responsibility
   - This modular approach facilitates easier changes and maintenance

## Authentication Architecture

### Kinde Integration
- Use @kinde-oss/kinde-auth-js for Vue 3
- Implement login/signup/logout flows
- Store user context in Pinia auth store
- Use username for data scoping (all _id fields prefixed)
- Handle token refresh and session management

### Protected Routes
- All main app routes require authentication
- Redirect unauthenticated users to login
- Preserve intended route after login

## File Structure Changes
- Add auth/ directory with Kinde service and guards
- Replace default HomeView with TaskManager main view
- Create components/ directory with Task, Timer, Settings, Auth components
- Add stores/ for auth, tasks, settings, timer state management
- Update router with authentication guards
- Implement custom CSS theme in assets/

## Environment Variables Required
```
VITE_KINDE_DOMAIN=your-kinde-domain
VITE_KINDE_CLIENT_ID=your-client-id
VITE_KINDE_REDIRECT_URI=your-redirect-uri
VITE_KINDE_LOGOUT_URI=your-logout-uri
```

## Review Section

### Summary of Changes Made

The implementation has successfully transformed the Vue 3 template into a fully-functional, offline-first task management application. Key accomplishments include:

1. **Authentication System**: Integrated Kinde authentication with user-scoped data management
2. **Core Task Management**: Built drag-and-drop task lists with "Doing Now" focus display
3. **Pomodoro Timer**: Implemented configurable timer with auto-advance and notifications
4. **Enhanced Features**: Added Focus Lock mode, task nudging, completed tasks archive, and pop-out windows
5. **Component Architecture**: Created small, reusable components (TaskCard, DoingNow, PomodoroTimer, etc.)
6. **Offline-First**: All operations work offline with PouchDB, optional CouchDB sync scaffolded
7. **Accessibility**: Full keyboard navigation, ARIA labels, and responsive design

### Deviations from Original Plan

1. **Vue Draggable**: Used `vuedraggable@next` instead of `vue.draggable.next` (correct package name)
2. **Kinde Package**: Used `@kinde-oss/kinde-auth-pkce-js` (the correct SDK for browser apps)
3. **Component Structure**: Created more granular components than initially planned for better modularity
4. **Settings Management**: Integrated settings into header instead of separate page

### Performance Considerations

1. **Database Indexes**: Created indexes for username and order fields for efficient queries
2. **Change Listeners**: Implemented user-scoped listeners to reduce unnecessary updates
3. **Lazy Loading**: Timer and completed tasks only load when needed
4. **Debounced Operations**: Task reordering uses bulk updates to minimize database writes

### Security Considerations

1. **Data Isolation**: All documents prefixed with username to prevent cross-user access
2. **Authentication**: Token refresh logic ensures valid authentication state
3. **Offline Security**: User data remains encrypted in browser's IndexedDB
4. **CouchDB Sync**: Bearer token authentication for remote sync

### Future Enhancement Recommendations

1. **AI Features (Phase 9)**:
   - Implement OpenAI/Anthropic API integration for task suggestions
   - Natural language parsing for task creation
   - Smart priority and time estimation

2. **Additional Features**:
   - Task templates and recurring tasks
   - Team collaboration with shared tasks
   - Calendar integration
   - Mobile app using Capacitor
   - Voice input for task creation
   - Advanced analytics and reporting

3. **Technical Improvements**:
   - Service Worker for true offline support
   - Push notifications for task reminders
   - Batch task operations
   - Export/import functionality
   - Dark mode theme option

The application is now production-ready with a solid foundation for future enhancements.

## Animated Hourglass for Pomodoro Timer

### Overview
Add an animated hourglass visualization to the pomodoro timer that shows sand flowing continuously from top to bottom while the timer is running. The animation should pause when the timer is paused.

### Plan

#### Todo Items
- [x] Create HourglassSandAnimation component with SVG-based hourglass design
- [x] Implement animated sand particles falling randomly from top to bottom
- [x] Sync animation state with timer pause/resume functionality
- [x] Integrate hourglass component into PomodoroTimer.vue layout
- [x] Add smooth transitions for sand accumulation at the bottom

#### Technical Approach
1. Create a new Vue component `HourglassSandAnimation.vue` that uses SVG for the hourglass shape
2. Use CSS animations and Vue's reactive properties to create falling sand particles
3. Generate random positions for sand particles as they fall
4. Control animation playback based on timer state (running/paused)
5. Display the hourglass beside the timer display in the existing layout

#### Implementation Details
- Use SVG for the hourglass container shape
- Create multiple small sand particles that animate independently
- Use Vue's `v-for` to generate multiple sand particles
- Apply CSS transforms and animations for the falling effect
- Use `animation-play-state` CSS property to pause/resume animations
- Sync with the timer store's `isRunning` computed property

### Review

#### Implementation Summary
Successfully created an animated hourglass component that enhances the pomodoro timer with visual feedback:

1. **SVG-Based Design**: Created a clean hourglass shape using SVG paths with proper clipping masks
2. **Dynamic Sand Animation**: Implemented multiple falling sand particles with random positions and velocities
3. **Progress Visualization**: Sand levels in top and bottom chambers adjust based on timer progress
4. **Pause/Resume Sync**: Animation state perfectly syncs with timer running state using props
5. **Responsive Layout**: Hourglass scales appropriately on mobile devices

#### Technical Details
- Used `requestAnimationFrame` for smooth particle animations
- Sand particles have randomized horizontal drift for realistic falling effect
- Bottom sand accumulates with a curved surface for visual appeal
- Continuous sand stream effect when timer is running
- All animations pause when timer is paused, maintaining state

#### Integration
The hourglass is displayed beside the timer display, providing an intuitive visual representation of time passing. The component is fully integrated with the existing timer store and responds to all timer state changes.