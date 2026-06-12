import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  getDashboardStats
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/dashboard', getDashboardStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.delete('/', deleteAllTasks);

export default router;
