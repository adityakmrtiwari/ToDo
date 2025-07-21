// src/utils/dateUtils.js

/**
 * Groups tasks into human-readable categories:
 * Overdue, Today, Tomorrow, This Week, Next Week, Future, and No Due Date.
 */
export function groupTasks(tasks) {
    const groups = {
      Overdue: [],
      Today: [],
      Tomorrow: [],
      'This Week': [],
      'Next Week': [],
      Future: [],
      'No Due Date': [],
    };
  
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay() + 1)); // End of current week (Sunday)
    const endOfNextWeek = new Date(endOfWeek);
    endOfNextWeek.setDate(endOfWeek.getDate() + 7);
  
    // Sort tasks by completion status first, then due date
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      const dateA = a.dueDate ? new Date(a.dueDate) : null;
      const dateB = b.dueDate ? new Date(b.dueDate) : null;
      if (dateA && dateB) return dateA - dateB;
      return dateA ? -1 : 1;
    });
  
    for (const task of sortedTasks) {
      if (!task.dueDate) {
        groups['No Due Date'].push(task);
        continue;
      }
  
      const dueDate = new Date(task.dueDate);
      const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
      if (task.completed) {
          // Completed tasks can be grouped differently if desired,
          // but for now, we'll group them by their original due date.
      }
      
      if (taskDate < today && !task.completed) {
        groups.Overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        groups.Today.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        groups.Tomorrow.push(task);
      } else if (taskDate > tomorrow && taskDate <= endOfWeek) {
        groups['This Week'].push(task);
      } else if (taskDate > endOfWeek && taskDate <= endOfNextWeek) {
        groups['Next Week'].push(task);
      } else {
        groups.Future.push(task);
      }
    }
  
    return groups;
  }
  
  /**
   * Returns a color class based on the task's due date status.
   */
  export function getDueDateColor(dueDate, completed) {
    if (completed) return 'text-green-600 dark:text-green-500';
    
    if (!dueDate) return 'text-gray-500 dark:text-gray-400';
  
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(dueDate);
  
    if (taskDate < today) return 'text-red-600 dark:text-red-500'; // Overdue
  
    return 'text-gray-500 dark:text-gray-400'; // Upcoming
  }