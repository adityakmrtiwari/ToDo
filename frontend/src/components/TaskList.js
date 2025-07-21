// src/components/TaskList.js
import React from 'react';
import TaskItem from './TaskItem';
import { groupTasks } from '../utils/dateUtils'; // REFINED: Import new grouping logic

const TaskList = ({ tasks, startEdit, onDeleteTask, onToggleTask, loading }) => {
  // REFINED: Using the new, more intuitive grouping function
  const groupedTasks = groupTasks(tasks);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl"></div>
        ))}
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <span className="text-5xl mb-4">🎉</span>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">All Clear!</h3>
        <p className="text-gray-600 dark:text-gray-400">You have no tasks. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-2 pb-10">
      {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
        groupTasks.length > 0 && (
          <div key={groupName}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-6 mb-2 px-2 capitalize">{groupName} ({groupTasks.length})</h3>
            <div className="space-y-3">
              {groupTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={() => startEdit(task)}
                  onDelete={() => onDeleteTask(task._id)}
                  onToggleComplete={() => onToggleTask(task)}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default TaskList;