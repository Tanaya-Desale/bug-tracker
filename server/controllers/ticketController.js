const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignee, projectId } = req.body;
    const newTicket = new Ticket({
      title,
      description,
      priority,
      assignee,
      projectId
    });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getTicketsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tickets = await Ticket.find({ projectId }).populate('assignee', 'name email');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const updated = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  createTicket,
  getTicketsByProject,
  updateTicketStatus
};

