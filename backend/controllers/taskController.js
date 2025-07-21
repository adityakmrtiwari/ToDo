import Task from '../models/Task.js';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, completed, description, dueDate } = req.body;
    const task = new Task({
      title,
      completed,
      description,
      dueDate,
      userId: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, completed, description, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, completed, description, dueDate },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', dueDate: task.dueDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAllTasks = async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.id });
    res.json({ message: 'All your tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 