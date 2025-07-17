import React from "react";
import { fetchWithAuth } from "../services/api";
import "./TaskItem.css";

const TaskItem = ({ task, refreshTasks, onEdit }) => {
    // Handle task deletion
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await fetchWithAuth(`/tasks/${task._id}`, { method: 'DELETE' });
            refreshTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Handle marking task as completed
    const handleToggleComplete = async () => {
        try {
            await fetchWithAuth(`/tasks/${task._id}`, {
                method: 'PUT',
                body: JSON.stringify({ completed: !task.completed }),
            });
            refreshTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <label className="task-label">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    className="task-checkbox"
                />
                <span className="task-name">{task.title}</span>
            </label>
            {task.description && <div className="task-desc">{task.description}</div>}
            {task.dueDate && <div className="task-date">Due: {new Date(task.dueDate).toLocaleDateString()}</div>}
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
                <button onClick={handleDelete} className="delete-btn" title="Delete Task">&#10005;</button>
                {onEdit && <button onClick={onEdit} className="edit-btn" title="Edit Task">&#9998;</button>}
            </div>
        </div>
    );
};

export default TaskItem;
