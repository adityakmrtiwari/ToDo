//Tasks.js

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  completed: Boolean,
  userId: String, // User's Google profile id
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
