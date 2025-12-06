// src/components/Header.js
import React from 'react';
import UserAvatar from './UserAvatar';

// REFINED: Icons moved outside for clarity
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>;

const Header = ({ user, darkMode, toggleDarkMode, login, logout }) => (
  <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-zinc-800/50 mb-8 transition-colors duration-300">
    <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl drop-shadow-sm filter animate-pulse">📝</span>
        <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent tracking-tight">
          My To-Do App
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-110 transition-all duration-200"
          onClick={toggleDarkMode}
          title="Toggle theme"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        {user ? (
          <>
            <UserAvatar
              user={user}
              className="w-9 h-9 rounded-full border-2 border-white dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform duration-200"
            />
            <span className="hidden sm:inline text-zinc-700 dark:text-zinc-300 font-medium text-sm">{user.displayName}</span>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:scale-105 transition-all text-sm">Logout</button>
          </>
        ) : (
          <button onClick={login} className="px-6 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200">Login</button>
        )}
      </div>
    </div>
  </header>
);

export default Header;