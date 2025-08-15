// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // manager assigned by admin
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: Number, default: 3 },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }], // manager assigns users
  objectivesText: { type: String, default: '' }, // <-- NEW FIELD
  startDate: { type: Date }, 
  dueDate: { type: Date },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Task', TaskSchema);
