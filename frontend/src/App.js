import React, { useEffect, useState } from "react";
import TaskItem from "./components/TaskItem";
import "./App.css";
import { loginWithGoogle, logout, getUser } from "./services/auth";
import { fetchWithAuth } from "./services/api";

function groupTasksByMonthAndWeek(tasks) {
    // Sort by dueDate ascending
    const sorted = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    const groups = [];
    let lastMonth = null;
    let lastWeek = null;
    sorted.forEach(task => {
        const due = task.dueDate ? new Date(task.dueDate) : null;
        const month = due ? due.toLocaleString('default', { month: 'long', year: 'numeric' }) : 'No Due Date';
        const week = due ? getWeekNumber(due) : 'No Due Date';
        if (month !== lastMonth) {
            groups.push({ type: 'month', label: month });
            lastMonth = month;
            lastWeek = null; // reset week on new month
        }
        if (week !== lastWeek) {
            groups.push({ type: 'week', label: weekLabel(due) });
            lastWeek = week;
        }
        groups.push({ type: 'task', task });
    });
    return groups;
}

function getWeekNumber(date) {
    // ISO week number
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function weekLabel(date) {
    if (!date) return 'No Due Date';
    const now = new Date();
    const thisWeek = getWeekNumber(now);
    const thisYear = now.getFullYear();
    const week = getWeekNumber(date);
    const year = date.getFullYear();
    if (year === thisYear && week === thisWeek) return 'This Week';
    if (year === thisYear && week === thisWeek - 1) return 'Last Week';
    if (year === thisYear) return `Week ${week}`;
    return `Week ${week}, ${year}`;
}

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editFields, setEditFields] = useState({ title: '', description: '', dueDate: '' });

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await fetchWithAuth("/tasks");
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add a new task
    const addTask = async () => {
        if (!newTask.trim()) {
            alert("Task title cannot be empty!");
            return;
        }
        try {
            await fetchWithAuth("/tasks", {
                method: "POST",
                body: JSON.stringify({
                    title: newTask,
                    completed: false,
                    description,
                    dueDate: dueDate ? new Date(dueDate) : null,
                }),
            });
            setNewTask("");
            setDescription("");
            setDueDate("");
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Edit a task
    const startEdit = (task) => {
        setEditingId(task._id);
        setEditFields({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        });
    };
    const cancelEdit = () => {
        setEditingId(null);
        setEditFields({ title: '', description: '', dueDate: '' });
    };
    const saveEdit = async (task) => {
        try {
            await fetchWithAuth(`/tasks/${task._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editFields.title,
                    description: editFields.description,
                    dueDate: editFields.dueDate ? new Date(editFields.dueDate) : null,
                    completed: task.completed,
                }),
            });
            setEditingId(null);
            setEditFields({ title: '', description: '', dueDate: '' });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Delete all tasks for the user
    const deleteAllTasks = async () => {
        if (!window.confirm("Are you sure you want to delete all your tasks?")) return;
        try {
            await fetchWithAuth("/tasks", { method: "DELETE" });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting all tasks:", error);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    };

    // Check user authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            const res = await getUser();
            setUser(res && res.user);
            setLoading(false);
            if (res && res.user) fetchTasks();
        };
        checkAuth();
        document.body.classList.toggle("dark-mode", darkMode);
        // eslint-disable-next-line
    }, [darkMode]);

    // Logout handler
    const handleLogout = () => {
        logout();
        setUser(null);
        setTasks([]);
        window.location.href = '/';
    };

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="app-container">
            {/* Header Bar */}
            <header className="header-bar">
                <h1 className="title">📝 To-Do List</h1>
                <div className="header-actions">
                    <button className="mode-toggle" onClick={toggleDarkMode}>
                        {darkMode ? "Light Theme" : "Dark Theme"}
                    </button>
                    {user ? (
                        <>
                            <span className="user-name">{user.displayName || user.emails?.[0]?.value}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <button onClick={loginWithGoogle} className="login-btn">Login with Google</button>
                    )}
                </div>
            </header>
            {/* Only show tasks if logged in */}
            {user && <>
                {/* Task Input Section */}
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Task title..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="task-input"
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="desc-input"
                    />
                    <div className="date-input-group">
                        <label htmlFor="due-date-input" className="date-label">Due date:</label>
                        <input
                            id="due-date-input"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="date-input"
                            title="Due date"
                        />
                    </div>
                    <button onClick={addTask} className="add-btn">Add Task</button>
                </div>
                {/* Task Count and Delete All */}
                <div className="task-list-header">
                    <h2 className="task-list-title">
                        Your Tasks ({tasks.length})
                    </h2>
                    <button onClick={deleteAllTasks} className="delete-all-btn">Delete All</button>
                </div>
                {/* Task List with grouping */}
                <div className="task-list">
                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <p className="no-tasks">No tasks available</p>
                        </div>
                    ) : (
                        groupTasksByMonthAndWeek(tasks).map((item, idx) => {
                            if (item.type === 'month') {
                                return <div key={"month-"+item.label} className="task-group-label month-label">{item.label}</div>;
                            }
                            if (item.type === 'week') {
                                return <div key={"week-"+item.label+idx} className="task-group-label week-label">{item.label}</div>;
                            }
                            if (item.type === 'task') {
                                const task = item.task;
                                if (editingId === task._id) {
                                    return (
                                        <div className={`task-item editing`} key={task._id}>
                                            <input
                                                type="text"
                                                value={editFields.title}
                                                onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
                                                className="task-input"
                                            />
                                            <input
                                                type="text"
                                                value={editFields.description}
                                                onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                                                className="desc-input"
                                            />
                                            <input
                                                type="date"
                                                value={editFields.dueDate}
                                                onChange={e => setEditFields(f => ({ ...f, dueDate: e.target.value }))}
                                                className="date-input"
                                            />
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                <button className="add-btn" onClick={() => saveEdit(task)}>Save</button>
                                                <button className="delete-btn" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    );
                                }
                                return <TaskItem key={task._id} task={task} refreshTasks={fetchTasks} onEdit={() => startEdit(task)} />;
                            }
                            return null;
                        })
                    )}
                </div>
            </>}
        </div>
    );
};

export default App;
