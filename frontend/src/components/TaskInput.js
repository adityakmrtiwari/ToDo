// src/components/TaskInput.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const PriorityBadge = ({ level, selected, onClick }) => {
  const colors = {
    low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/50",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
    high: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50",
  };

  const selectedStyles = "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-zinc-900 scale-105 shadow-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border",
        colors[level],
        selected === level && selectedStyles,
        selected !== level && "opacity-70 hover:opacity-100"
      )}
    >
      {level}
    </button>
  );
};

const TaskInput = ({ onAdd, editingId, editFields, setEditFields, onSaveEdit, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync state when editing or reset when not
  useEffect(() => {
    if (editingId && editFields) {
      setTitle(editFields.title || "");
      setDescription(editFields.description || "");
      setDueDate(editFields.dueDate ? editFields.dueDate.split("T")[0] : "");
      setPriority(editFields.priority || "medium");
      setIsExpanded(true);
    } else {
      // Reset form when not editing
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setIsExpanded(false);
    }
  }, [editingId, editFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      onSaveEdit(editingId, { title, description, dueDate, priority });
      // The parent component should handle setting editingId to null, 
      // which will trigger the useEffect to reset the form.
    } else {
      onAdd({ title, description, dueDate, priority });
      // Reset manually for new task addition
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setIsExpanded(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onSubmit={handleSubmit}
      className="glass-card p-6 mb-8 max-w-2xl mx-auto transition-all bg-white dark:bg-zinc-900 hover:shadow-2xl"
    >
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="What needs to be done?"
          className="text-lg font-medium bg-transparent border-none outline-none placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 w-full focus:placeholder-zinc-500 dark:focus:placeholder-zinc-400 transition-all"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (editingId) setEditFields({ ...editFields, title: e.target.value });
          }}
          onFocus={() => setIsExpanded(true)}
        />

        <AnimatePresence>
          {(isExpanded || title) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <textarea
                placeholder="Description (optional)"
                className="input-field min-h-[80px] resize-none text-sm focus:ring-zinc-500/50 dark:focus:ring-zinc-500/50"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (editingId) setEditFields({ ...editFields, description: e.target.value });
                }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Priority</span>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map(p => (
                      <PriorityBadge
                        key={p}
                        level={p}
                        selected={priority}
                        onClick={() => {
                          setPriority(p);
                          if (editingId) setEditFields({ ...editFields, priority: p });
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    className="input-field py-1.5 px-3 text-sm w-auto cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (editingId) setEditFields({ ...editFields, dueDate: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      onCancelEdit();
                      setTitle("");
                      setDescription("");
                      setDueDate("");
                      setPriority("medium");
                      setIsExpanded(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition hover:scale-105"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-105 active:scale-95"
                >
                  {editingId ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
};

export default TaskInput;