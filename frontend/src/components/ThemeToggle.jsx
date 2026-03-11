import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 
                bg-slate-200 hover:bg-slate-300 text-amber-500
                dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                flex items-center justify-center ${className}`}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {theme === 'dark' ? (
                    <Sun size={20} />
                ) : (
                    <Moon size={20} />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
