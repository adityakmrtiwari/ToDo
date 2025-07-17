import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task for the logged-in user
router.post('/', async (req, res) => {
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
});

// Update a task (only if it belongs to the user)
router.put('/:id', async (req, res) => {
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
});

// Delete a task (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', dueDate: task.dueDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all tasks for the logged-in user
router.delete('/', async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.id });
    res.json({ message: 'All your tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
