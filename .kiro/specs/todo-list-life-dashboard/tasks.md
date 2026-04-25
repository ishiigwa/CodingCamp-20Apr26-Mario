# Implementation Plan: Todo List Life Dashboard

## Overview

This implementation plan breaks down the Todo List Life Dashboard into discrete coding tasks. The application is a client-side web app using vanilla JavaScript, HTML5, and CSS3 with Local Storage for persistence. Tasks are organized to build incrementally: first the HTML structure and CSS foundation, then each JavaScript component, and finally integration and wiring.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create directory structure: `css/` and `js/` folders
  - Create `index.html` with semantic HTML5 structure
  - Add container elements for: greeting display, focus timer, task list, and quick links sections
  - Include references to `css/style.css` and `js/app.js`
  - _Requirements: 14.1, 14.2, 14.3_

- [x] 2. Implement base CSS styling
  - Create `css/style.css` with reset and base styles
  - Implement clean, minimal design with clear visual hierarchy
  - Style all sections: greeting, timer, task list, quick links
  - Add responsive layout using Flexbox/Grid
  - Style interactive elements with hover and active states
  - Ensure readable typography throughout
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 3. Implement Storage Manager
  - Create StorageManager class in `js/app.js`
  - Implement `get(key)` method with JSON parsing and error handling
  - Implement `set(key, value)` method with JSON stringification and error handling
  - Implement `remove(key)` and `clear()` methods
  - Wrap all Local Storage operations in try-catch blocks
  - _Requirements: 9.1, 12.1_

- [x] 4. Implement Greeting Display Component
  - Create GreetingDisplay class
  - Implement constructor and init() method
  - Implement getGreeting(hour) method with time-based logic (5-11: morning, 12-16: afternoon, 17-20: evening, 21-4: night)
  - Implement formatTime(date) and formatDate(date) methods
  - Implement updateDisplay() method to update DOM
  - Set up setInterval to update every second
  - Implement destroy() method for cleanup
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_

- [x] 5. Implement Focus Timer Component
  - Create FocusTimer class
  - Implement constructor with state: remainingSeconds (1500), isRunning (false), intervalId
  - Implement init() method to set up UI
  - Implement start() method to begin/resume countdown
  - Implement stop() method to pause countdown
  - Implement reset() method to return to 25 minutes
  - Implement tick() method to decrement by 1 second with zero-check
  - Implement formatTime(seconds) method to format as MM:SS
  - Implement updateDisplay() method to update DOM
  - Implement destroy() method for cleanup
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

- [x] 6. Checkpoint - Verify timer and greeting components work
  - Ensure timer and greeting display correctly, ask the user if questions arise.

- [x] 7. Implement Task List Component
  - [x] 7.1 Create TaskList class with task data model
    - Implement constructor with containerElement and storageKey ('dashboard_tasks')
    - Define task model: { id, text, completed, createdAt }
    - Implement init() method to load and render tasks
    - Implement loadTasks() method using StorageManager
    - Implement saveTasks() method using StorageManager
    - Implement validateTaskText(text) method (non-empty after trim)
    - _Requirements: 5.1, 5.3, 9.1, 9.2, 9.3_
  
  - [x] 7.2 Implement task CRUD operations
    - Implement addTask(text) method with validation and ID generation
    - Implement editTask(id, newText) method with validation
    - Implement toggleComplete(id) method
    - Implement deleteTask(id) method
    - Implement renderTasks() method to update DOM
    - Each operation should call saveTasks() and renderTasks()
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3_

- [x] 8. Implement Quick Links Component
  - [x] 8.1 Create QuickLinks class with link data model
    - Implement constructor with containerElement and storageKey ('dashboard_quicklinks')
    - Define link model: { id, name, url, createdAt }
    - Implement init() method to load and render links
    - Implement loadLinks() method using StorageManager
    - Implement saveLinks() method using StorageManager
    - Implement validateUrl(url) method (must start with http:// or https://)
    - _Requirements: 10.1, 10.3, 12.1, 12.2, 12.3_
  
  - [x] 8.2 Implement quick link CRUD operations
    - Implement addLink(name, url) method with validation and ID generation
    - Implement deleteLink(id) method
    - Implement openLink(url) method with window.open() and error handling
    - Implement renderLinks() method to update DOM
    - Each operation should call saveLinks() and renderLinks()
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 13.1, 13.2, 13.3_

- [x] 9. Checkpoint - Verify task list and quick links work
  - Ensure task list and quick links function correctly, ask the user if questions arise.

- [x] 10. Wire components together and initialize dashboard
  - Create main Dashboard initialization
  - Instantiate all components (GreetingDisplay, FocusTimer, TaskList, QuickLinks)
  - Call init() on each component
  - Set up DOMContentLoaded event listener
  - Add global error handling for Local Storage errors
  - _Requirements: 14.3, 14.4_

- [x] 11. Final checkpoint - Verify complete application
  - Test all features work together, ask the user if questions arise.

- [x] 12. Implement Theme Manager Component
  - [x] 12.1 Create ThemeManager class with theme state management
    - Implement constructor with storageKey ('dashboard_theme')
    - Implement init() method to load and apply saved theme
    - Implement getTheme() method to retrieve theme from storage with validation
    - Implement setTheme(theme) method to validate, apply, and save theme
    - Implement toggleTheme() method to switch between light and dark
    - Implement applyTheme(theme) method to add/remove CSS classes on document root
    - Default theme should be 'light'
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 16.1, 16.2, 16.3, 16.4_
  
  - [x] 12.2 Add CSS variables and theme styles
    - Define CSS custom properties for light theme colors (--bg-primary, --bg-secondary, --text-primary, --text-secondary, --border-color, --accent-color)
    - Define dark theme overrides in .dark-theme class
    - Update existing CSS to use CSS variables instead of hardcoded colors
    - Add smooth transitions for theme changes
    - _Requirements: 15.3, 15.4_
  
  - [x] 12.3 Add theme toggle UI control
    - Add theme toggle button to HTML (in header or corner)
    - Style toggle button with appropriate icons or text
    - Wire toggle button to ThemeManager.toggleTheme() method
    - Provide visual feedback on click
    - _Requirements: 15.1, 15.2_

- [x] 13. Implement Custom Name Greeting Feature
  - [x] 13.1 Extend GreetingDisplay class with name management
    - Add userName property and storageKey parameter to constructor
    - Implement getUserName() method to retrieve name from storage
    - Implement setUserName(name) method to trim, validate, save, and update display
    - Update getGreeting(hour) method to include name if provided (format: "Good morning, Alex")
    - Handle empty name case (display greeting without name)
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2, 18.3, 18.4_
  
  - [x] 13.2 Add name input UI control
    - Add text input field for user name to HTML (near greeting display)
    - Add placeholder text: "Enter your name (optional)"
    - Wire input field to GreetingDisplay.setUserName() on blur or Enter key
    - Update greeting display in real-time when name changes
    - Style input field to match dashboard design
    - _Requirements: 17.1, 17.2_

- [x] 14. Implement Task Sorting Feature
  - [x] 14.1 Extend TaskList class with sorting functionality
    - Add sortCriteria property and sortStorageKey to constructor
    - Implement getSortCriteria() method to retrieve and validate sort preference from storage
    - Implement setSortCriteria(criteria) method to validate, save, and re-render tasks
    - Implement sortTasks(tasks) method with switch statement for all sort criteria
    - Support sort options: 'default', 'newest', 'oldest', 'alpha', 'incomplete', 'completed'
    - Update renderTasks() to call sortTasks() before rendering
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 20.1, 20.2, 20.3, 20.4, 21.1, 21.2, 21.3, 21.4, 22.1, 22.2, 22.3, 22.4_
  
  - [x] 14.2 Implement sort logic for each criteria
    - Newest first: Sort descending by createdAt timestamp
    - Oldest first: Sort ascending by createdAt timestamp
    - Alphabetical: Sort A-Z by text (case-insensitive using localeCompare)
    - Incomplete first: Sort with completed=false before completed=true
    - Completed first: Sort with completed=true before completed=false
    - Default: No sorting (original creation order)
    - _Requirements: 19.2, 19.3, 20.2, 20.3, 21.2, 21.3_
  
  - [x] 14.3 Add sort control UI
    - Add sort dropdown/select menu or button group to HTML (above task list)
    - Add options: "Default", "Newest", "Oldest", "A-Z", "Incomplete First", "Completed First"
    - Wire sort control to TaskList.setSortCriteria() method
    - Add visual indicator for active sort option (highlight or selected state)
    - Style sort control to match dashboard design
    - _Requirements: 19.1, 23.1, 23.2, 23.3_

- [x] 15. Wire new components and update initialization
  - Instantiate ThemeManager in main initialization
  - Call ThemeManager.init() to apply saved theme on load
  - Update GreetingDisplay initialization to pass userName storage key
  - Update TaskList initialization to load sort preference
  - Ensure all new features integrate smoothly with existing components
  - _Requirements: 15.4, 16.3, 18.2, 22.2_

- [x] 16. Final checkpoint - Verify all new features
  - Test theme toggle switches between light and dark modes correctly
  - Test theme preference persists across page reloads
  - Test custom name appears in greeting and persists
  - Test all sort options work correctly and persist
  - Test visual indicators for active theme and sort options
  - Ensure all features work together, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- All components use vanilla JavaScript (ES6+) with no frameworks or libraries
- Local Storage operations include error handling for quota exceeded and corrupted data
- The application follows a modular component-based architecture within a single JavaScript file
- Checkpoints ensure incremental validation of functionality
- New features (12-16) extend existing components and add new functionality while maintaining the same architecture
