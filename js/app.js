// Todo List Life Dashboard - Application Logic

// Storage Manager - Handles all Local Storage operations
class StorageManager {
  /**
   * Retrieve and parse data from Local Storage
   * @param {string} key - Storage key
   * @returns {Array} Parsed data or empty array if not found/error
   */
  static get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse storage data:', e);
      return [];
    }
  }

  /**
   * Stringify and store data in Local Storage
   * @param {string} key - Storage key
   * @param {*} value - Data to store
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
      // Handle quota exceeded or other storage errors
      if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
      }
    }
  }

  /**
   * Remove data from Local Storage
   * @param {string} key - Storage key
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove storage data:', e);
    }
  }

  /**
   * Clear all data from Local Storage
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }
}

// Greeting Display Component - Displays time, date, and time-based greeting
class GreetingDisplay {
  /**
   * Create a GreetingDisplay instance
   * @param {HTMLElement} containerElement - Container element for greeting display
   * @param {string} storageKey - Local Storage key for user name
   */
  constructor(containerElement, storageKey = 'dashboard_userName') {
    this.container = containerElement;
    this.greetingElement = containerElement.querySelector('#greeting-text');
    this.timeElement = containerElement.querySelector('#time-display');
    this.dateElement = containerElement.querySelector('#date-display');
    this.storageKey = storageKey;
    this.userName = '';
    this.intervalId = null;
  }

  /**
   * Initialize and start the clock
   */
  init() {
    this.userName = this.getUserName();
    this.updateDisplay();
    // Update every second
    this.intervalId = setInterval(() => this.updateDisplay(), 1000);
  }

  /**
   * Get user name from Local Storage
   * @returns {string} User name or empty string
   */
  getUserName() {
    try {
      const name = StorageManager.get(this.storageKey);
      return typeof name === 'string' ? name.trim() : '';
    } catch (e) {
      console.error('Failed to load user name:', e);
      return '';
    }
  }

  /**
   * Set user name and update display
   * @param {string} name - User name to set
   */
  setUserName(name) {
    try {
      const trimmedName = (name || '').trim();
      this.userName = trimmedName;
      StorageManager.set(this.storageKey, trimmedName);
      this.updateDisplay();
    } catch (e) {
      console.error('Failed to save user name:', e);
    }
  }

  /**
   * Update time, date, and greeting display
   */
  updateDisplay() {
    const now = new Date();
    const hour = now.getHours();
    
    this.greetingElement.textContent = this.getGreeting(hour);
    this.timeElement.textContent = this.formatTime(now);
    this.dateElement.textContent = this.formatDate(now);
  }

  /**
   * Get greeting based on hour of day
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} Time-based greeting with optional user name
   */
  getGreeting(hour) {
    let timeGreeting = '';
    if (hour >= 5 && hour <= 11) {
      timeGreeting = 'Good Morning';
    } else if (hour >= 12 && hour <= 16) {
      timeGreeting = 'Good Afternoon';
    } else if (hour >= 17 && hour <= 20) {
      timeGreeting = 'Good Evening';
    } else {
      timeGreeting = 'Good Night';
    }

    // Add name if provided
    if (this.userName) {
      return `${timeGreeting}, ${this.userName}`;
    }
    return timeGreeting;
  }

  /**
   * Format time as readable string
   * @param {Date} date - Date object
   * @returns {string} Formatted time string
   */
  formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Convert to 12-hour format
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Pad with zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    
    return `${hour12}:${minutesStr}:${secondsStr} ${ampm}`;
  }

  /**
   * Format date as readable string
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Clean up interval
   */
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}


// Focus Timer Component - Manages 25-minute Pomodoro countdown timer
class FocusTimer {
  /**
   * Create a FocusTimer instance
   * @param {HTMLElement} containerElement - Container element for timer
   */
  constructor(containerElement) {
    this.container = containerElement;
    this.displayElement = containerElement.querySelector('#timer-display');
    this.startButton = containerElement.querySelector('#timer-start');
    this.stopButton = containerElement.querySelector('#timer-stop');
    this.resetButton = containerElement.querySelector('#timer-reset');
    
    // Timer state
    this.remainingSeconds = 1500; // 25 minutes in seconds
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Initialize timer UI and event listeners
   */
  init() {
    this.updateDisplay();
    
    // Set up event listeners
    this.startButton.addEventListener('click', () => this.start());
    this.stopButton.addEventListener('click', () => this.stop());
    this.resetButton.addEventListener('click', () => this.reset());
  }

  /**
   * Start or resume the countdown timer
   */
  start() {
    if (this.isRunning) {
      return; // Already running, do nothing
    }
    
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  /**
   * Pause the countdown timer
   */
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Reset timer to 25 minutes
   */
  reset() {
    this.stop();
    this.remainingSeconds = 1500;
    this.updateDisplay();
  }

  /**
   * Decrement timer by 1 second and check for completion
   */
  tick() {
    if (this.remainingSeconds <= 0) {
      this.stop();
      return;
    }
    
    this.remainingSeconds--;
    this.updateDisplay();
  }

  /**
   * Format seconds as MM:SS
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Pad with zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(secs).padStart(2, '0');
    
    return `${minutesStr}:${secondsStr}`;
  }

  /**
   * Update timer display in DOM
   */
  updateDisplay() {
    this.displayElement.textContent = this.formatTime(this.remainingSeconds);
  }

  /**
   * Clean up interval and event listeners
   */
  destroy() {
    this.stop();
  }
}


// Task List Component - Manages to-do list with CRUD operations
class TaskList {
  /**
   * Create a TaskList instance
   * @param {HTMLElement} containerElement - Container element for task list
   * @param {string} storageKey - Local Storage key for tasks
   */
  constructor(containerElement, storageKey) {
    this.container = containerElement;
    this.storageKey = storageKey;
    this.sortStorageKey = 'dashboard_sortPreference';
    this.taskListElement = containerElement.querySelector('#task-list');
    this.taskForm = containerElement.querySelector('#task-form');
    this.taskInput = containerElement.querySelector('#task-input');
    this.tasks = [];
    this.sortCriteria = 'default';
  }

  /**
   * Initialize task list - load and render tasks
   */
  init() {
    this.sortCriteria = this.getSortCriteria();
    this.loadTasks();
    this.renderTasks();
    
    // Set up form submission
    this.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.taskInput.value;
      if (this.addTask(text)) {
        this.taskInput.value = '';
      }
    });
  }

  /**
   * Load tasks from Local Storage
   */
  loadTasks() {
    this.tasks = StorageManager.get(this.storageKey);
  }

  /**
   * Save tasks to Local Storage
   */
  saveTasks() {
    StorageManager.set(this.storageKey, this.tasks);
  }

  /**
   * Validate task text
   * @param {string} text - Task text to validate
   * @returns {boolean} True if valid (non-empty after trim)
   */
  validateTaskText(text) {
    return text.trim().length > 0;
  }

  /**
   * Get sort criteria from Local Storage
   * @returns {string} Sort criteria ('default', 'newest', 'oldest', 'alpha', 'incomplete', 'completed')
   */
  getSortCriteria() {
    try {
      const criteria = StorageManager.get(this.sortStorageKey);
      const validCriteria = ['default', 'newest', 'oldest', 'alpha', 'incomplete', 'completed'];
      return validCriteria.includes(criteria) ? criteria : 'default';
    } catch (e) {
      console.error('Failed to load sort preference:', e);
      return 'default';
    }
  }

  /**
   * Set sort criteria and re-render tasks
   * @param {string} criteria - Sort criteria to apply
   */
  setSortCriteria(criteria) {
    const validCriteria = ['default', 'newest', 'oldest', 'alpha', 'incomplete', 'completed'];
    if (!validCriteria.includes(criteria)) {
      criteria = 'default';
    }
    this.sortCriteria = criteria;
    StorageManager.set(this.sortStorageKey, criteria);
    this.renderTasks();
  }

  /**
   * Sort tasks based on current sort criteria
   * @param {Array} tasks - Array of task objects
   * @returns {Array} Sorted array of tasks
   */
  sortTasks(tasks) {
    try {
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
    } catch (e) {
      console.error('Failed to sort tasks:', e);
      return tasks; // Return unsorted if error
    }
  }

  /**
   * Add a new task
   * @param {string} text - Task text
   * @returns {boolean} True if task was added successfully
   */
  addTask(text) {
    if (!this.validateTaskText(text)) {
      return false;
    }

    const task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    return true;
  }

  /**
   * Edit an existing task
   * @param {string} id - Task ID
   * @param {string} newText - New task text
   * @returns {boolean} True if task was edited successfully
   */
  editTask(id, newText) {
    if (!this.validateTaskText(newText)) {
      return false;
    }

    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.text = newText.trim();
      this.saveTasks();
      this.renderTasks();
      return true;
    }
    return false;
  }

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   */
  toggleComplete(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   */
  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  }

  /**
   * Render all tasks to DOM
   */
  renderTasks() {
    this.taskListElement.innerHTML = '';

    if (this.tasks.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'task-empty';
      emptyMessage.textContent = 'No tasks yet. Add one above!';
      this.taskListElement.appendChild(emptyMessage);
      return;
    }

    // Sort tasks before rendering
    const sortedTasks = this.sortTasks(this.tasks);

    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      // Checkbox for completion
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => this.toggleComplete(task.id));

      // Task text
      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;
      
      // Make text editable on double-click
      textSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-edit-input';
        input.value = task.text;
        
        input.addEventListener('blur', () => {
          const newText = input.value;
          if (this.editTask(task.id, newText)) {
            // Successfully edited
          } else {
            // Invalid text, re-render to restore original
            this.renderTasks();
          }
        });
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          } else if (e.key === 'Escape') {
            this.renderTasks();
          }
        });
        
        textSpan.replaceWith(input);
        input.focus();
        input.select();
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(deleteBtn);
      this.taskListElement.appendChild(li);
    });
  }
}


// Quick Links Component - Manages quick access links to favorite websites
class QuickLinks {
  /**
   * Create a QuickLinks instance
   * @param {HTMLElement} containerElement - Container element for quick links
   * @param {string} storageKey - Local Storage key for links
   */
  constructor(containerElement, storageKey) {
    this.container = containerElement;
    this.storageKey = storageKey;
    this.linksListElement = containerElement.querySelector('#links-list');
    this.linkForm = containerElement.querySelector('#link-form');
    this.linkNameInput = containerElement.querySelector('#link-name-input');
    this.linkUrlInput = containerElement.querySelector('#link-url-input');
    this.links = [];
  }

  /**
   * Initialize quick links - load and render links
   */
  init() {
    this.loadLinks();
    this.renderLinks();
    
    // Set up form submission
    this.linkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.linkNameInput.value;
      const url = this.linkUrlInput.value;
      if (this.addLink(name, url)) {
        this.linkNameInput.value = '';
        this.linkUrlInput.value = '';
      }
    });
  }

  /**
   * Load links from Local Storage
   */
  loadLinks() {
    this.links = StorageManager.get(this.storageKey);
  }

  /**
   * Save links to Local Storage
   */
  saveLinks() {
    StorageManager.set(this.storageKey, this.links);
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid (starts with http:// or https://)
   */
  validateUrl(url) {
    return /^https?:\/\/.+/.test(url);
  }

  /**
   * Add a new quick link
   * @param {string} name - Link display name
   * @param {string} url - Link URL
   * @returns {boolean} True if link was added successfully
   */
  addLink(name, url) {
    // Validate name (non-empty after trim)
    if (name.trim().length === 0) {
      return false;
    }

    // Validate URL format
    if (!this.validateUrl(url)) {
      return false;
    }

    const link = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      url: url.trim(),
      createdAt: Date.now()
    };

    this.links.push(link);
    this.saveLinks();
    this.renderLinks();
    return true;
  }

  /**
   * Delete a quick link
   * @param {string} id - Link ID
   */
  deleteLink(id) {
    this.links = this.links.filter(l => l.id !== id);
    this.saveLinks();
    this.renderLinks();
  }

  /**
   * Open a link in a new tab
   * @param {string} url - URL to open
   */
  openLink(url) {
    try {
      window.open(url, '_blank');
    } catch (e) {
      console.error('Failed to open link:', e);
    }
  }

  /**
   * Render all links to DOM
   */
  renderLinks() {
    this.linksListElement.innerHTML = '';

    if (this.links.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'links-empty';
      emptyMessage.textContent = 'No quick links yet. Add one above!';
      this.linksListElement.appendChild(emptyMessage);
      return;
    }

    this.links.forEach(link => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.dataset.id = link.id;

      // Link button
      const linkButton = document.createElement('button');
      linkButton.className = 'btn-link';
      linkButton.textContent = link.name;
      linkButton.setAttribute('aria-label', `Open ${link.name}`);
      linkButton.addEventListener('click', () => this.openLink(link.url));

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete-link';
      deleteBtn.textContent = '×';
      deleteBtn.setAttribute('aria-label', `Delete ${link.name}`);
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteLink(link.id);
      });

      linkItem.appendChild(linkButton);
      linkItem.appendChild(deleteBtn);
      this.linksListElement.appendChild(linkItem);
    });
  }
}


// Theme Manager Component - Manages light and dark theme switching
class ThemeManager {
  /**
   * Create a ThemeManager instance
   * @param {string} storageKey - Local Storage key for theme preference
   */
  constructor(storageKey = 'dashboard_theme') {
    this.storageKey = storageKey;
    this.currentTheme = 'light'; // Default theme
  }

  /**
   * Initialize theme manager - load and apply saved theme
   */
  init() {
    const savedTheme = this.getTheme();
    this.applyTheme(savedTheme);
  }

  /**
   * Get theme preference from Local Storage
   * @returns {string} Theme ('light' or 'dark')
   */
  getTheme() {
    try {
      const data = localStorage.getItem(this.storageKey);
      const theme = data ? JSON.parse(data) : 'light';
      return theme === 'dark' ? 'dark' : 'light';
    } catch (e) {
      console.error('Failed to load theme:', e);
      return 'light';
    }
  }

  /**
   * Set and apply theme
   * @param {string} theme - Theme to apply ('light' or 'dark')
   */
  setTheme(theme) {
    // Validate theme
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light';
    }
    
    this.currentTheme = theme;
    this.applyTheme(theme);
    
    // Save to Local Storage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(theme));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme by adding/removing CSS classes on document root
   * @param {string} theme - Theme to apply
   */
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


// Global error handler for Local Storage errors
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('localStorage')) {
    console.error('Local Storage error detected:', event.message);
    // Optionally show user-friendly message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'storage-error-message';
    errorMsg.textContent = 'Unable to save data. Your changes may not persist.';
    errorMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #f44336; color: white; padding: 12px 20px; border-radius: 4px; z-index: 1000;';
    document.body.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 5000);
  }
});

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize Theme Manager (apply theme before rendering components)
    const themeManager = new ThemeManager('dashboard_theme');
    themeManager.init();
    
    // Set up theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Update icon based on current theme
    const updateThemeIcon = () => {
      themeIcon.textContent = themeManager.currentTheme === 'light' ? '🌙' : '☀️';
    };
    
    // Initialize icon
    updateThemeIcon();
    
    // Wire toggle button to ThemeManager
    themeToggleBtn.addEventListener('click', () => {
      themeManager.toggleTheme();
      updateThemeIcon();
      
      // Visual feedback - add a brief animation
      themeToggleBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeToggleBtn.style.transform = '';
      }, 300);
    });
    
    // Initialize Greeting Display
    const greetingContainer = document.getElementById('greeting-container');
    const greetingDisplay = new GreetingDisplay(greetingContainer, 'dashboard_userName');
    greetingDisplay.init();
    
    // Wire up name input field
    const nameInput = document.getElementById('name-input');
    
    // Set initial value from storage
    nameInput.value = greetingDisplay.userName;
    
    // Update greeting on blur
    nameInput.addEventListener('blur', () => {
      greetingDisplay.setUserName(nameInput.value);
    });
    
    // Update greeting on Enter key
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        nameInput.blur();
      }
    });
    
    // Initialize Focus Timer
    const timerContainer = document.getElementById('timer-container');
    const focusTimer = new FocusTimer(timerContainer);
    focusTimer.init();
    
    // Initialize Task List
    const taskContainer = document.getElementById('task-container');
    const taskList = new TaskList(taskContainer, 'dashboard_tasks');
    taskList.init();
    
    // Wire up sort control
    const taskSortSelect = document.getElementById('task-sort-select');
    
    // Set initial value from storage
    taskSortSelect.value = taskList.sortCriteria;
    
    // Update sort criteria on change
    taskSortSelect.addEventListener('change', () => {
      taskList.setSortCriteria(taskSortSelect.value);
    });
    
    // Initialize Quick Links
    const linksContainer = document.getElementById('links-container');
    const quickLinks = new QuickLinks(linksContainer, 'dashboard_quicklinks');
    quickLinks.init();
    
    // Make themeManager globally accessible for toggle button
    window.dashboardThemeManager = themeManager;
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    // Show error message to user
    const errorMsg = document.createElement('div');
    errorMsg.className = 'init-error-message';
    errorMsg.textContent = 'Failed to initialize dashboard. Please refresh the page.';
    errorMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f44336; color: white; padding: 20px 40px; border-radius: 8px; z-index: 1000; font-size: 16px;';
    document.body.appendChild(errorMsg);
  }
});
