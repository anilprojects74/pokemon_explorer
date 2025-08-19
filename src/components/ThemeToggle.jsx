const ThemeToggle = ({ isDark, onToggle }) => (
  <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus-ring"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
      {isDark ? '☀️' : '🌙'}
  </button>
);

export default ThemeToggle