const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newProject = new Project({
      title,
      description,
      createdBy: req.user.id,
      teamMembers: [req.user.id] // creator is the first member
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ teamMembers: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const addTeamMember = async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  try {
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { teamMembers: userId } }, // avoids duplicates
      { new: true }
    ).populate('teamMembers', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createProject, getProjects, addTeamMember };