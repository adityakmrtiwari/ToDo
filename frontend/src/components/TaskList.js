// src/components/TaskList.js
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { groupTasks } from '../utils/dateUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';

const FilterTab = ({ active, label, onClick, count }) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 z-10",
      active
        ? "text-blue-700 dark:text-blue-300"
        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
    )}
  >
    {label}
    {count !== undefined && <span className="ml-2 text-xs opacity-70">({count})</span>}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full -z-10"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    )}
  </button>
);

const TaskList = ({ tasks, startEdit, onDeleteTask, onToggleTask, loading }) => {
  const [filter, setFilter] = useState('all'); // all, active, completed

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse px-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const groupedTasks = groupTasks(filteredTasks);

  // Counts for tabs
  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{
            scale: { type: "spring", stiffness: 200, delay: 0.2 },
            rotate: { duration: 0.5, ease: "easeInOut", delay: 0.2 }
          }}
          className="text-6xl mb-6 filter drop-shadow-md"
        >
          ✨
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-zinc-800 dark:text-zinc-200"
        >
          All Clear!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto"
        >
          You have no pending tasks. Enjoy your free time or add a new goal!
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-2 pb-24">
      {/* Filters */}
      <div className="flex items-center justify-center gap-1 mb-8 bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-full backdrop-blur-sm w-fit mx-auto border border-zinc-200 dark:border-zinc-700/50 shadow-inner">
        <FilterTab active={filter === 'all'} label="All" onClick={() => setFilter('all')} count={counts.all} />
        <FilterTab active={filter === 'active'} label="Active" onClick={() => setFilter('active')} count={counts.active} />
        <FilterTab active={filter === 'completed'} label="Done" onClick={() => setFilter('completed')} count={counts.completed} />
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500 animate-fadeIn">
          <span className="text-4xl mb-2 opacity-50">📭</span>
          <p>{filter === 'completed' ? "No completed tasks yet. Keep going!" : "No active tasks in this view."}</p>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
          groupTasks.length > 0 && (
            <div key={groupName}>
              <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">{groupName} ({groupTasks.length})</h3>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {groupTasks.map((task) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      onEdit={() => startEdit(task)}
                      onDelete={() => onDeleteTask(task._id)}
                      onToggleComplete={() => onToggleTask(task)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default TaskList;