import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 ${
        isDark ? 'bg-primary' : 'bg-border'
      }`}
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle Dark Mode"
    >
      <span className="sr-only">Toggle theme</span>
      <motion.span
        className={`pointer-events-none inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-surface-elevated shadow ring-0 transition duration-300 ease-in-out`}
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
        }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-primary" />
        ) : (
          <Sun className="h-4 w-4 text-warning" />
        )}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
