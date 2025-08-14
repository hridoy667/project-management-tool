const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    priority: { type: Number, default: 3 },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    startDate: { type: Date }, 
    dueDate: { type: Date },   
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Task', TaskSchema);
