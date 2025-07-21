// src/hooks/useTasks.js
import { useState, useCallback } from 'react';
import { fetchWithAuth } from '../services/api';

export default function useTasks(user) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', description: '', dueDate: '' });

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetchWithAuth('/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData) => { // REFINED: Pass a single object
    if (!taskData.title.trim()) return;
    await fetchWithAuth('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    fetchTasks();
  };

  const editTask = async () => { // REFINED: Logic is now fully contained here
    await fetchWithAuth(`/tasks/${editingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: editFields.title,
        description: editFields.description,
        dueDate: editFields.dueDate ? new Date(editFields.dueDate) : null,
      }),
    });
    setEditingId(null);
    setEditFields({ title: '', description: '', dueDate: '' });
    fetchTasks();
  };

  const deleteTask = async (taskId) => { // REFINED: Centralized delete logic
    await fetchWithAuth(`/tasks/${taskId}`, { method: 'DELETE' });
    fetchTasks();
  };
  
  const toggleTaskComplete = async (task) => { // REFINED: Centralized toggle logic
    await fetchWithAuth(`/tasks/${task._id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteAllTasks = async () => {
    // REFINED: Added confirmation dialog
    if (!window.confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) return;
    await fetchWithAuth('/tasks', { method: 'DELETE' });
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditFields({
      title: task.title,
      description: task.description || '',
      // REFINED: Handle date formatting correctly for the input
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({ title: '', description: '', dueDate: '' });
  };

  return {
    tasks,
    fetchTasks,
    addTask,
    editTask, // REFINED: Changed from generic 'editTask' to a parameter-less one
    deleteTask,
    toggleTaskComplete,
    deleteAllTasks,
    loading,
    editingId,
    startEdit,
    cancelEdit,
    editFields,
    setEditFields,
  };
}