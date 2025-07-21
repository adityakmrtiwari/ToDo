// src/components/TaskInput.js
import React, { useEffect, useRef } from 'react';

const TaskInput = ({ onAdd, editingId, editFields, setEditFields, onSaveEdit, onCancelEdit }) => {
  const isEditing = !!editingId;
  const titleRef = useRef(null);

  // REFINED: Use a single state object for the add form
  const [newTask, setNewTask] = React.useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (isEditing && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape' && isEditing) {
      e.preventDefault();
      onCancelEdit();
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditFields(prev => ({ ...prev, [name]: value }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    if(e) e.preventDefault();
    if (isEditing) {
      onSaveEdit();
    } else {
      onAdd({ ...newTask, completed: false });
      setNewTask({ title: '', description: '', dueDate: '' }); // Reset form
    }
  };

  // REFINED: Use one set of fields and update based on editing mode
  const currentFields = isEditing ? editFields : newTask;

  return (
    <div className={`max-w-2xl mx-auto bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-md transition-all duration-300 ${isEditing ? 'border-2 border-blue-400' : ''}`}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            ref={titleRef}
            type="text"
            name="title"
            placeholder="Task title..."
            value={currentFields.title}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            aria-label={isEditing ? 'Edit task title' : 'New task title'}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <input
            type="text"
            name="description"
            placeholder="Description (optional)"
            value={currentFields.description}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            aria-label={isEditing ? 'Edit task description' : 'New task description'}
          />
          <div className="flex flex-col items-start w-full sm:w-auto">
            <label className="text-xs text-gray-700 dark:text-gray-300 mb-1">Due date:</label>
            <input
              type="date"
              name="dueDate"
              value={currentFields.dueDate}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition w-full"
              aria-label={isEditing ? 'Edit due date' : 'New due date'}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          {isEditing ? (
            <>
              <button type="button" onClick={onCancelEdit} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold shadow hover:scale-105 transition">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:scale-105 transition">Save Changes</button>
            </>
          ) : (
            <button type="submit" className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gradient-to-tr from-black via-gray-800 to-gray-600 text-white font-bold shadow hover:scale-105 transition">Add Task</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskInput;