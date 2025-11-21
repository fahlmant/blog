// Dark mode toggle functionality
(function() {
  'use strict';

  // Update button icon based on current theme
  function updateButton() {
    const button = document.querySelector('.theme-toggle');
    if (button) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      button.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
      button.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Set theme and optionally save to localStorage
  function setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (save) {
      localStorage.setItem('theme', theme);
    }

    updateButton();
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

  // Initialize on DOM ready - just update the button, theme is already set in head
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      updateButton();
      attachToggleListener();
    });
  } else {
    updateButton();
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
