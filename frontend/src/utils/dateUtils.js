// src/utils/dateUtils.js

/**
 * Groups tasks into human-readable categories:
 * Overdue, Today, Tomorrow, This Week, Next Week, Future, Completed, and No Due Date.
 */
export function groupTasks(tasks) {
  const groups = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    'This Week': [],
    'Next Week': [],
    Future: [],
    Completed: [],
    'No Due Date': [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Set end of current week (Sunday)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

  // Start and end of next week
  const startOfNextWeek = new Date(endOfWeek);
  startOfNextWeek.setDate(endOfWeek.getDate() + 1);
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

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
    if (task.completed) {
      groups.Completed.push(task);
      continue;
    }

    if (!task.dueDate) {
      groups['No Due Date'].push(task);
      continue;
    }

    const dueDate = new Date(task.dueDate);
    const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    if (taskDate < today) {
      groups.Overdue.push(task);
    } else if (taskDate.getTime() === today.getTime()) {
      groups.Today.push(task);
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      groups.Tomorrow.push(task);
    } else if (taskDate > tomorrow && taskDate <= endOfWeek) {
      groups['This Week'].push(task);
    } else if (taskDate >= startOfNextWeek && taskDate <= endOfNextWeek) {
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

  // Strip time from taskDate
  const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

  if (taskDateOnly < today) return 'text-red-600 dark:text-red-500'; // Overdue

  return 'text-gray-500 dark:text-gray-400'; // Upcoming
}
