import React from "react";
import axios from "axios";
import config from '../config';

const API_URL = config.BACKEND_URL;

export async function fetchWithAuth(url, options = {}) {
  return fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

const TaskItem = ({ task, refreshTasks }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${task._id}`);
            refreshTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div>
            <span>{task.name}</span>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default TaskItem;
