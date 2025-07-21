// src/components/Header.js
import React from 'react';
import UserAvatar from './UserAvatar';

// REFINED: Icons moved outside for clarity
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>;

const Header = ({ user, darkMode, toggleDarkMode, login, logout }) => (
  <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm mb-8">
    <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl drop-shadow-sm">📝</span>
        <h1 className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-400 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
          My To-Do App
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={toggleDarkMode}
          title="Toggle theme"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        {user ? (
          <>
            <UserAvatar 
              user={user} 
              className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-600 shadow-sm" 
            />
            <span className="hidden sm:inline text-gray-800 dark:text-gray-200 font-semibold">{user.displayName}</span>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">Logout</button>
          </>
        ) : (
          <button onClick={login} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Login</button>
        )}
      </div>
    </div>
  </header>
);

export default Header;