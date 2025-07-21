// src/components/TaskItem.js
import React from "react";
import { getDueDateColor } from '../utils/dateUtils'; // REFINED: Import color utility

// REFINED: SVG icons for a cleaner look
const CheckIcon = () => <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const CircleIcon = () => <div className="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500 transition-colors"></div>;
const EditIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;


const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const handleDelete = () => {
    // REFINED: Added confirmation dialog here for single delete
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete();
    }
  };

  const dueDateColor = getDueDateColor(task.dueDate, task.completed);
  
  return (
    <div className={`flex flex-col gap-2 bg-white/80 dark:bg-black/60 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700 backdrop-blur-md transition ${task.completed ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleComplete}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          {task.completed ? <CheckIcon /> : <CircleIcon />}
        </button>
        <span className={`flex-1 text-lg font-semibold truncate ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>{task.title}</span>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 dark:hover:bg-gray-700 transition" title="Edit Task" aria-label="Edit Task"><EditIcon /></button>
          <button onClick={handleDelete} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 dark:hover:bg-gray-700 transition" title="Delete Task" aria-label="Delete Task"><DeleteIcon /></button>
        </div>
      </div>
      {(task.description || task.dueDate) && (
        <div className="pl-11 space-y-1">
          {task.description && <p className="text-gray-700 dark:text-gray-300 text-sm">{task.description}</p>}
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${dueDateColor}`}>
              <CalendarIcon />
              <span>Due: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;