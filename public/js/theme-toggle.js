// Dark mode toggle functionality
(function() {
  'use strict';

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(theme, false);
  }

  // Set theme and optionally save to localStorage
  function setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (save) {
      localStorage.setItem('theme', theme);
    }

    // Update button icon if it exists
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.textContent = theme === 'dark' ? '☀️' : '🌙';
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Toggle between light and dark themes
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Attach event listener to existing toggle button
  function attachToggleListener() {
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.addEventListener('click', toggleTheme);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      attachToggleListener();
    });
  } else {
    initTheme();
    attachToggleListener();
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light', false);
    }
  });
})();
