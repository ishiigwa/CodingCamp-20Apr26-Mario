# Design Document: Todo List Life Dashboard

## Overview

The Todo List Life Dashboard is a client-side web application that provides a personal productivity interface combining time awareness, task management, and quick website access. The application runs entirely in the browser with no backend dependencies, using the Local Storage API for data persistence.

### Key Design Principles

1. **Client-Side Only**: All functionality runs in the browser; no server required
2. **Vanilla JavaScript**: No frameworks or libraries; pure HTML/CSS/JS
3. **Local Storage Persistence**: All user data stored in browser Local Storage
4. **Immediate Feedback**: UI updates synchronously with user actions
5. **Minimal Design**: Clean interface focused on productivity

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with modern layout techniques (Flexbox/Grid)
- **Vanilla JavaScript (ES6+)**: Application logic and DOM manipulation
- **Local Storage API**: Client-side data persistence

## Architecture

### Application Structure

```
todo-list-life-dashboard/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # All styling
└── js/
    └── app.js          # All application logic
```

### Component Architecture

The application follows a modular component-based architecture within a single JavaScript file:

```
┌─────────────────────────────────────┐
│         Dashboard (Main)            │
│  - Initialization                   │
│  - Local Storage Management         │
│  - Component Coordination           │
└─────────────────────────────────────┘
           │
           ├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
           │             │             │             │             │             │
    ┌──────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐ ┌▼───────────┐ ┌▼───────────┐
    │  Greeting   │ │   Timer    │ │  TaskList  │ │ QuickLinks │ │   Theme    │
    │  Display    │ │ Component  │ │ Component  │ │ Component  │ │  Manager   │
    │ (+ Name)    │ │            │ │ (+ Sort)   │ │            │ │            │
    └─────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Data Flow

1. **Initialization**: Load data from Local Storage → Render UI
2. **User Action**: User interaction → Update state → Save to Local Storage → Update UI
3. **Timer Updates**: setInterval → Update timer state → Update UI

## Components and Interfaces

### 1. Greeting Display Component

**Responsibilities**:
- Display current time and date
- Show time-based greeting
- Display custom user name in greeting (if provided)
- Auto-update every second

**Interface**:
```javascript
class GreetingDisplay {
  constructor(containerElement, storageKey)
  init()                    // Initialize and start clock
  updateDisplay()           // Update time, date, and greeting
  getGreeting(hour)         // Return greeting based on hour (5-11: morning, 12-16: afternoon, 17-20: evening, 21-4: night)
  formatTime(date)          // Format time as readable string
  formatDate(date)          // Format date as readable string
  setUserName(name)         // Set custom user name for greeting
  getUserName()             // Get current user name from storage
  destroy()                 // Clean up interval
}
```

**State**:
- `userName`: Custom name for personalized greeting (stored in Local Storage)

### 2. Focus Timer Component

**Responsibilities**:
- Manage 25-minute countdown timer
- Provide start/stop/reset controls
- Update display every second

**Interface**:
```javascript
class FocusTimer {
  constructor(containerElement)
  init()                    // Initialize timer UI
  start()                   // Start/resume countdown
  stop()                    // Pause countdown
  reset()                   // Reset to 25 minutes
  tick()                    // Decrement timer by 1 second
  formatTime(seconds)       // Format seconds as MM:SS
  updateDisplay()           // Update timer display
  destroy()                 // Clean up interval
}
```

**State**:
- `remainingSeconds`: Current countdown value (0-1500)
- `isRunning`: Boolean indicating if timer is active
- `intervalId`: Reference to setInterval for cleanup

### 3. Task List Component

**Responsibilities**:
- Display list of tasks
- Handle task CRUD operations
- Sort tasks by various criteria
- Sync with Local Storage

**Interface**:
```javascript
class TaskList {
  constructor(containerElement, storageKey)
  init()                    // Load tasks and render
  loadTasks()               // Load from Local Storage
  saveTasks()               // Save to Local Storage
  addTask(text)             // Create new task
  editTask(id, newText)     // Update task text
  toggleComplete(id)        // Toggle task completion status
  deleteTask(id)            // Remove task
  setSortCriteria(criteria) // Set sort criteria ('newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default')
  getSortCriteria()         // Get current sort criteria from storage
  sortTasks(tasks)          // Sort tasks array based on current criteria
  renderTasks()             // Render all tasks to DOM
  validateTaskText(text)    // Check if text is non-empty
}
```

**State**:
- `sortCriteria`: Current sort criteria (stored in Local Storage)

**Task Data Model**: See Data Models section

### 4. Quick Links Component

**Responsibilities**:
- Display quick link buttons
- Handle link CRUD operations
- Open URLs in new tabs
- Sync with Local Storage

**Interface**:
```javascript
class QuickLinks {
  constructor(containerElement, storageKey)
  init()                    // Load links and render
  loadLinks()               // Load from Local Storage
  saveLinks()               // Save to Local Storage
  addLink(name, url)        // Create new quick link
  deleteLink(id)            // Remove quick link
  openLink(url)             // Open URL in new tab
  renderLinks()             // Render all links to DOM
  validateUrl(url)          // Check if URL is valid
}
```

**Quick Link Data Model**: See Data Models section

### 5. Storage Manager

**Responsibilities**:
- Abstract Local Storage operations
- Handle serialization/deserialization
- Provide error handling for storage operations

**Interface**:
```javascript
class StorageManager {
  static get(key)           // Retrieve and parse data
  static set(key, value)    // Stringify and store data
  static remove(key)        // Remove data
  static clear()            // Clear all data
}
```

### 6. Theme Manager Component

**Responsibilities**:
- Manage light/dark theme switching
- Apply theme to DOM
- Persist theme preference

**Interface**:
```javascript
class ThemeManager {
  constructor(storageKey)
  init()                    // Load and apply saved theme
  getTheme()                // Get current theme from storage
  setTheme(theme)           // Set theme ('light' or 'dark')
  toggleTheme()             // Switch between light and dark
  applyTheme(theme)         // Apply theme CSS classes to DOM
}
```

**State**:
- `currentTheme`: Current theme ('light' or 'dark', stored in Local Storage)

**Implementation Details**:
- Adds/removes CSS class on document root element (e.g., `<html class="dark-theme">`)
- CSS variables or class-based styling for theme colors
- Default theme: 'light'

## Data Models

### Task Model

```javascript
{
  id: string,              // Unique identifier (timestamp + random)
  text: string,            // Task description (non-empty)
  completed: boolean,      // Completion status
  createdAt: number        // Timestamp (milliseconds since epoch)
}
```

**Validation Rules**:
- `id`: Must be unique, generated automatically
- `text`: Must be non-empty after trimming whitespace
- `completed`: Boolean, defaults to false
- `createdAt`: Timestamp, generated automatically

### Quick Link Model

```javascript
{
  id: string,              // Unique identifier (timestamp + random)
  name: string,            // Display name (non-empty)
  url: string,             // Website URL (valid URL format)
  createdAt: number        // Timestamp (milliseconds since epoch)
}
```

**Validation Rules**:
- `id`: Must be unique, generated automatically
- `name`: Must be non-empty after trimming whitespace
- `url`: Must be valid URL format (http:// or https://)
- `createdAt`: Timestamp, generated automatically

### Theme Preference Model

```javascript
{
  theme: string            // Current theme: 'light' or 'dark'
}
```

**Validation Rules**:
- `theme`: Must be either 'light' or 'dark', defaults to 'light'

### User Name Model

```javascript
{
  userName: string         // User's custom name for greeting (can be empty)
}
```

**Validation Rules**:
- `userName`: String, can be empty (empty means no custom name)
- Trimmed before storage

### Sort Preference Model

```javascript
{
  sortBy: string,          // Sort criteria: 'newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default'
}
```

**Validation Rules**:
- `sortBy`: Must be one of: 'newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default'
- Defaults to 'default' (creation order)

### Local Storage Schema

**Storage Keys**:
- `dashboard_tasks`: Array of Task objects
- `dashboard_quicklinks`: Array of Quick Link objects
- `dashboard_theme`: String representing current theme ('light' or 'dark')
- `dashboard_userName`: String representing user's custom name
- `dashboard_sortPreference`: String representing sort criteria

**Storage Format**:
```javascript
// localStorage.getItem('dashboard_tasks')
"[{\"id\":\"1234567890-abc\",\"text\":\"Buy groceries\",\"completed\":false,\"createdAt\":1234567890000}]"

// localStorage.getItem('dashboard_quicklinks')
"[{\"id\":\"1234567891-def\",\"name\":\"GitHub\",\"url\":\"https://github.com\",\"createdAt\":1234567891000}]"

// localStorage.getItem('dashboard_theme')
"\"dark\""

// localStorage.getItem('dashboard_userName')
"\"Alex\""

// localStorage.getItem('dashboard_sortPreference')
"\"newest\""
```

**Storage Operations**:
- Read: `JSON.parse(localStorage.getItem(key)) || defaultValue`
- Write: `localStorage.setItem(key, JSON.stringify(data))`
- Clear: `localStorage.removeItem(key)`


## New Feature Designs

### Feature 1: Light and Dark Mode

**Overview**: Provides users with the ability to switch between light and dark color themes for comfortable viewing in different lighting conditions.

**Architecture**:
```
┌─────────────────────────┐
│    ThemeManager         │
│  - Load saved theme     │
│  - Toggle theme         │
│  - Apply CSS classes    │
│  - Save to storage      │
└─────────────────────────┘
         │
         ├─── Reads/Writes: localStorage['dashboard_theme']
         └─── Modifies: <html> element class attribute
```

**Component Details**:

The `ThemeManager` class manages theme state and applies visual changes:

```javascript
class ThemeManager {
  constructor(storageKey = 'dashboard_theme') {
    this.storageKey = storageKey;
    this.currentTheme = 'light'; // Default
  }

  init() {
    // Load saved theme or use default
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  }

  getTheme() {
    try {
      const theme = StorageManager.get(this.storageKey);
      return theme === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  }

  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light';
    }
    this.currentTheme = theme;
    this.applyTheme(theme);
    StorageManager.set(this.storageKey, theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
    this.currentTheme = theme;
  }
}
```

**CSS Implementation**:

Use CSS custom properties (variables) for theme colors:

```css
:root {
  /* Light theme (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #dddddd;
  --accent-color: #4a90e2;
}

.dark-theme {
  /* Dark theme overrides */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #444444;
  --accent-color: #6ab0f3;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

**UI Elements**:
- Theme toggle button in header/corner of dashboard
- Icon-based toggle (sun/moon icons) or text-based ("Light"/"Dark")
- Visual feedback on click (smooth transition)

**Data Flow**:
1. User clicks theme toggle button
2. `ThemeManager.toggleTheme()` called
3. New theme applied to DOM via CSS class
4. New theme saved to Local Storage
5. Visual transition occurs (CSS transitions)

**Requirements Addressed**: 15.1, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3, 16.4

---

### Feature 2: Custom Name Greeting

**Overview**: Allows users to personalize the greeting display by adding their name, making the dashboard feel more welcoming and personal.

**Architecture**:
```
┌─────────────────────────────┐
│    GreetingDisplay          │
│  - Load saved name          │
│  - Display name in greeting │
│  - Update on name change    │
└─────────────────────────────┘
         │
         └─── Reads/Writes: localStorage['dashboard_userName']
```

**Component Updates**:

The existing `GreetingDisplay` class is extended with name management:

```javascript
class GreetingDisplay {
  constructor(containerElement, storageKey = 'dashboard_userName') {
    this.containerElement = containerElement;
    this.storageKey = storageKey;
    this.userName = '';
    this.intervalId = null;
  }

  init() {
    this.userName = this.getUserName();
    this.updateDisplay();
    this.intervalId = setInterval(() => this.updateDisplay(), 1000);
  }

  getUserName() {
    try {
      const name = StorageManager.get(this.storageKey);
      return typeof name === 'string' ? name.trim() : '';
    } catch (e) {
      return '';
    }
  }

  setUserName(name) {
    const trimmedName = (name || '').trim();
    this.userName = trimmedName;
    StorageManager.set(this.storageKey, trimmedName);
    this.updateDisplay();
  }

  getGreeting(hour) {
    let timeGreeting = '';
    if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
    else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    else if (hour >= 17 && hour < 21) timeGreeting = 'Good evening';
    else timeGreeting = 'Good night';

    // Add name if provided
    if (this.userName) {
      return `${timeGreeting}, ${this.userName}`;
    }
    return timeGreeting;
  }

  updateDisplay() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = this.getGreeting(hour);
    const time = this.formatTime(now);
    const date = this.formatDate(now);

    // Update DOM elements
    this.containerElement.querySelector('.greeting').textContent = greeting;
    this.containerElement.querySelector('.time').textContent = time;
    this.containerElement.querySelector('.date').textContent = date;
  }
}
```

**UI Elements**:
- Input field for user name (text input)
- Positioned near greeting display or in settings area
- Placeholder text: "Enter your name (optional)"
- Updates greeting in real-time as user types (or on blur/enter)
- Clear button to remove name (optional)

**Greeting Format Examples**:
- Without name: "Good morning"
- With name: "Good morning, Alex"
- Empty name after clearing: "Good morning"

**Data Flow**:
1. User enters name in input field
2. On blur/enter, `GreetingDisplay.setUserName(name)` called
3. Name trimmed and validated
4. Name saved to Local Storage
5. Greeting display updated immediately
6. If name is empty, greeting displays without name

**Edge Cases**:
- Empty string: Remove name from greeting
- Whitespace-only: Treated as empty
- Very long names: CSS handles overflow (ellipsis or wrap)

**Requirements Addressed**: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4

---

### Feature 3: Sort Tasks

**Overview**: Provides multiple sorting options for the task list, allowing users to organize tasks by creation date, alphabetically, or by completion status.

**Architecture**:
```
┌─────────────────────────────┐
│    TaskList                 │
│  - Load sort preference     │
│  - Apply sort to tasks      │
│  - Render sorted tasks      │
│  - Save sort preference     │
└─────────────────────────────┘
         │
         └─── Reads/Writes: localStorage['dashboard_sortPreference']
```

**Component Updates**:

The existing `TaskList` class is extended with sorting functionality:

```javascript
class TaskList {
  constructor(containerElement, storageKey = 'dashboard_tasks') {
    this.containerElement = containerElement;
    this.storageKey = storageKey;
    this.sortStorageKey = 'dashboard_sortPreference';
    this.tasks = [];
    this.sortCriteria = 'default';
  }

  init() {
    this.sortCriteria = this.getSortCriteria();
    this.loadTasks();
    this.renderTasks();
  }

  getSortCriteria() {
    try {
      const criteria = StorageManager.get(this.sortStorageKey);
      const validCriteria = ['newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default'];
      return validCriteria.includes(criteria) ? criteria : 'default';
    } catch (e) {
      return 'default';
    }
  }

  setSortCriteria(criteria) {
    const validCriteria = ['newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default'];
    if (!validCriteria.includes(criteria)) {
      criteria = 'default';
    }
    this.sortCriteria = criteria;
    StorageManager.set(this.sortStorageKey, criteria);
    this.renderTasks();
  }

  sortTasks(tasks) {
    const sorted = [...tasks]; // Create copy to avoid mutation

    switch (this.sortCriteria) {
      case 'newest':
        // Descending by createdAt
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;

      case 'oldest':
        // Ascending by createdAt
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;

      case 'alpha':
        // Alphabetical by text (case-insensitive)
        sorted.sort((a, b) => 
          a.text.toLowerCase().localeCompare(b.text.toLowerCase())
        );
        break;

      case 'incomplete':
        // Incomplete tasks first, then completed
        sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
        break;

      case 'completed':
        // Completed tasks first, then incomplete
        sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? -1 : 1;
        });
        break;

      case 'default':
      default:
        // No sorting (creation order as stored)
        break;
    }

    return sorted;
  }

  renderTasks() {
    const sortedTasks = this.sortTasks(this.tasks);
    // Render sortedTasks to DOM
    // ... existing render logic using sortedTasks instead of this.tasks
  }
}
```

**Sort Criteria Options**:

1. **Default** (creation order): Tasks displayed in the order they were added
2. **Newest First**: Most recently created tasks at the top
3. **Oldest First**: Oldest tasks at the top
4. **Alphabetical**: Tasks sorted A-Z by text (case-insensitive)
5. **Incomplete First**: Uncompleted tasks before completed tasks
6. **Completed First**: Completed tasks before uncompleted tasks

**UI Elements**:
- Sort dropdown/select menu or button group
- Options: "Default", "Newest", "Oldest", "A-Z", "Incomplete First", "Completed First"
- Visual indicator showing active sort (highlighted button or selected option)
- Positioned above task list

**Data Flow**:
1. User selects sort option from UI
2. `TaskList.setSortCriteria(criteria)` called
3. Sort criteria validated and saved to Local Storage
4. `renderTasks()` called, which applies sort via `sortTasks()`
5. Task list re-rendered in new order
6. Active sort option visually highlighted

**Sort Stability**:
- When sorting by completion status, maintain creation order within each group
- When sorting alphabetically, stable sort preserves creation order for identical text

**Performance Considerations**:
- Sorting happens on render, not on every task operation
- For small task lists (<100 items), performance is negligible
- Use native Array.sort() for efficiency

**Requirements Addressed**: 19.1, 19.2, 19.3, 19.4, 20.1, 20.2, 20.3, 20.4, 21.1, 21.2, 21.3, 21.4, 22.1, 22.2, 22.3, 22.4, 23.1, 23.2, 23.3

---

## Error Handling

### Local Storage Errors

**Scenario**: Local Storage is unavailable or quota exceeded

**Handling**:
- Wrap all Local Storage operations in try-catch blocks
- Log errors to console for debugging
- Display user-friendly error message: "Unable to save data. Your changes may not persist."
- Allow application to continue functioning with in-memory state only

**Implementation**:
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  console.error('Storage error:', e);
  showErrorMessage('Unable to save data');
}
```

### Invalid URL Handling

**Scenario**: User provides invalid URL for quick link

**Handling**:
- Validate URL format before creating quick link
- Reject URLs not starting with http:// or https://
- Display validation error: "Please enter a valid URL starting with http:// or https://"
- When opening link, wrap in try-catch to handle runtime errors

**Implementation**:
```javascript
function validateUrl(url) {
  return /^https?:\/\/.+/.test(url);
}

function openLink(url) {
  try {
    window.open(url, '_blank');
  } catch (e) {
    console.error('Failed to open link:', e);
    showErrorMessage('Unable to open link');
  }
}
```

### Empty Input Handling

**Scenario**: User submits empty or whitespace-only text

**Handling**:
- Trim input before validation
- Reject empty strings after trimming
- Provide visual feedback (e.g., shake animation, border color change)
- Do not modify existing data

**Implementation**:
```javascript
function validateTaskText(text) {
  return text.trim().length > 0;
}
```

### Timer Edge Cases

**Scenario**: Timer reaches zero or goes negative

**Handling**:
- Check if remainingSeconds <= 0 before each tick
- Stop timer automatically when reaching zero
- Prevent negative values
- Optional: Play sound or show notification when timer completes

**Implementation**:
```javascript
tick() {
  if (this.remainingSeconds <= 0) {
    this.stop();
    this.onComplete(); // Optional callback
    return;
  }
  this.remainingSeconds--;
  this.updateDisplay();
}
```

### Data Corruption Handling

**Scenario**: Local Storage contains invalid JSON or corrupted data

**Handling**:
- Wrap JSON.parse in try-catch
- If parsing fails, log error and return empty array
- Do not crash the application
- Allow user to start fresh

**Implementation**:
```javascript
static get(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse storage data:', e);
    return [];
  }
}
```

### Theme Preference Errors

**Scenario**: Invalid theme value in Local Storage or theme application fails

**Handling**:
- Validate theme value before applying (must be 'light' or 'dark')
- Default to 'light' theme if invalid value found
- Wrap DOM manipulation in try-catch
- Log errors but continue with default theme

**Implementation**:
```javascript
getTheme() {
  try {
    const theme = StorageManager.get(this.storageKey);
    return theme === 'dark' ? 'dark' : 'light';
  } catch (e) {
    console.error('Failed to load theme:', e);
    return 'light';
  }
}
```

### User Name Validation

**Scenario**: Invalid user name data or excessive length

**Handling**:
- Trim whitespace before validation
- Treat empty/whitespace-only as "no name"
- Limit name length in UI (CSS or maxlength attribute)
- Handle special characters gracefully (allow Unicode)
- Default to empty string if data is corrupted

**Implementation**:
```javascript
setUserName(name) {
  try {
    const trimmedName = (name || '').trim();
    this.userName = trimmedName;
    StorageManager.set(this.storageKey, trimmedName);
    this.updateDisplay();
  } catch (e) {
    console.error('Failed to save user name:', e);
    showErrorMessage('Unable to save name');
  }
}
```

### Sort Criteria Validation

**Scenario**: Invalid sort criteria in Local Storage

**Handling**:
- Validate sort criteria against allowed values
- Default to 'default' if invalid value found
- Handle missing sort preference gracefully
- Continue with default sort if error occurs

**Implementation**:
```javascript
getSortCriteria() {
  try {
    const criteria = StorageManager.get(this.sortStorageKey);
    const validCriteria = ['newest', 'oldest', 'alpha', 'incomplete', 'completed', 'default'];
    return validCriteria.includes(criteria) ? criteria : 'default';
  } catch (e) {
    console.error('Failed to load sort preference:', e);
    return 'default';
  }
}
```

### Sort Operation Errors

**Scenario**: Sorting fails due to corrupted task data

**Handling**:
- Wrap sort operations in try-catch
- If sort fails, display tasks unsorted
- Log error for debugging
- Ensure app remains functional

**Implementation**:
```javascript
sortTasks(tasks) {
  try {
    const sorted = [...tasks];
    // ... sorting logic
    return sorted;
  } catch (e) {
    console.error('Failed to sort tasks:', e);
    return tasks; // Return unsorted if error
  }
}
```
