
// src/components/TaskItem.js
import React from "react";
import { motion } from "framer-motion";
import { getDueDateColor } from '../utils/dateUtils';
import { clsx } from 'clsx';

const CheckIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;

const PriorityIndicator = ({ priority }) => {
  const colors = {
    low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800",
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 border border-red-200 dark:border-red-800",
  };

  if (!priority) return null;

  return (
    <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full select-none", colors[priority])}>
      {priority}
    </span>
  );
};

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete();
    }
  };

  const dueDateColor = getDueDateColor(task.dueDate, task.completed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className={clsx(
        "group flex flex-col gap-3 rounded-xl shadow-sm hover:shadow-lg p-4 border transition-all relative overflow-hidden",
        "glass-card hover:bg-white dark:hover:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800",
        task.completed && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1", {
        'bg-indigo-500 dark:bg-indigo-400': task.priority === 'low',
        'bg-amber-500 dark:bg-amber-400': task.priority === 'medium',
        'bg-rose-500 dark:bg-rose-400': task.priority === 'high' || !task.priority,
      })} />

      <div className="flex items-start gap-4 pl-3">
        <button
          onClick={onToggleComplete}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          className={clsx(
            "mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border-2 transition-all duration-300",
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white scale-110"
              : "bg-transparent border-zinc-300 dark:border-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-400"
          )}
        >
          {task.completed && <CheckIcon />}
        </button>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <span className={clsx(
              "text-lg font-semibold truncate transition-all decoration-2 decoration-zinc-400 dark:decoration-zinc-600",
              task.completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100"
            )}>
              {task.title}
            </span>
            <PriorityIndicator priority={task.priority} />
          </div>

          {(task.description || task.dueDate) && (
            <div className="space-y-2">
              {task.description && (
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed text-wrap break-words line-clamp-2 group-hover:line-clamp-none transition-all">
                  {task.description}
                </p>
              )}
              {task.dueDate && (
                <div className={clsx("flex items-center gap-1.5 text-xs font-medium w-fit px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800", dueDateColor)}>
                  <CalendarIcon />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={onEdit} className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 transition" title="Edit"><EditIcon /></button>
          <button onClick={handleDelete} className="p-2 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition" title="Delete"><DeleteIcon /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;