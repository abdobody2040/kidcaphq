
import React from 'react';
import { useAppStore } from '../store';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { user, updateUserSettings } = useAppStore();

  if (!user) return null;

  const isDark = user.settings.themeMode === 'dark';

  const toggle = () => {
    updateUserSettings({ themeMode: isDark ? 'light' : 'dark' });
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400 fill-current" />
      ) : (
        <Moon size={20} className="text-gray-600 fill-current" />
      )}
    </button>
  );
};

export default ThemeToggle;
