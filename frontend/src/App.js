// src/App.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import useAuth from "./hooks/useAuth";
import useTasks from "./hooks/useTasks";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const { user, loading: authLoading, login, logout } = useAuth();
  
  // REFINED: Hook provides all necessary functions now
  const {
    tasks, fetchTasks, addTask, editTask, deleteAllTasks, deleteTask, toggleTaskComplete,
    loading: tasksLoading, editingId, startEdit, cancelEdit, editFields, setEditFields
  } = useTasks(user);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user, fetchTasks]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <span className="text-2xl text-gray-800 dark:text-gray-200">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header
        user={user}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        login={login}
        logout={logout}
      />
      <main className="px-4">
        {user ? (
          <>
            <TaskInput
              onAdd={addTask}
              editingId={editingId}
              editFields={editFields}
              setEditFields={setEditFields}
              onSaveEdit={editTask} // REFINED: Prop name clarifies action
              onCancelEdit={cancelEdit}
            />
            <div className="max-w-2xl mx-auto flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Tasks ({tasks.filter(t => !t.completed).length})</h2>
              {tasks.length > 0 && (
                <button onClick={deleteAllTasks} className="px-4 py-2 rounded-lg bg-red-600/10 text-red-700 dark:bg-red-500/10 dark:text-red-400 font-semibold hover:bg-red-600/20 dark:hover:bg-red-500/20 transition text-sm">Delete All</button>
              )}
            </div>
            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              startEdit={startEdit}
              onDeleteTask={deleteTask}
              onToggleTask={toggleTaskComplete}
            />
          </>
        ) : (
          <div className="text-center pt-20">
              <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Welcome to your To-Do List</h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Please log in to manage your tasks.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;