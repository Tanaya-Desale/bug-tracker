const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);