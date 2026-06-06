import React, { useContext, useState, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const { user } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 shadow-sm transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex">
            <button
              className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center space-x-3 gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
             <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 hidden sm:block">Welcome, {user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block capitalize">{user?.role?.replace('_', ' ')}</p>
             </div>
             <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-800/50 ml-2">
               {user?.name?.charAt(0)}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
