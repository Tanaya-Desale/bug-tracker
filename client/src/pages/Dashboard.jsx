import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import Layout from '../components/Layout';

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [ticketForm, setTicketForm] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error loading projects');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (projectId, field, value) => {
    setTicketForm({
      ...ticketForm,
      [projectId]: { ...ticketForm[projectId], [field]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5050/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([...projects, res.data]);
      setFormData({ title: '', description: '' });
      setMessage('✅ Project created!');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Project creation failed');
    }
  };

  const submitTicket = async (projectId) => {
    const data = ticketForm[projectId];
    try {
      await axios.post(
        'http://localhost:5050/api/tickets',
        { ...data, status: 'To Do', projectId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTicketForm({ ...ticketForm, [projectId]: {} });
      setMessage('✅ Ticket created!');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Ticket creation failed');
    }
  };

  const addMember = async (projectId) => {
    const userId = ticketForm[projectId]?.newMemberId;
    if (!userId) {
      setMessage('❌ Please enter a User ID');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5050/api/projects/${projectId}/add-member`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage('✅ Team member added');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Could not add member');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Projects</h2>

        {message && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded shadow-sm text-sm">
            {message}
          </div>
        )}

        {/* Project Creation Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold">Create New Project</h3>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create Project
          </button>
        </form>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-white p-6 rounded shadow space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{proj.title}</h3>
                <p className="text-gray-600">{proj.description}</p>
              </div>

              {/* Ticket Creation */}
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ticket Title"
                  value={ticketForm[proj._id]?.title || ''}
                  onChange={(e) => handleTicketChange(proj._id, 'title', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Priority (Low/Medium/High)"
                  value={ticketForm[proj._id]?.priority || ''}
                  onChange={(e) => handleTicketChange(proj._id, 'priority', e.target.value)}
                  className="w-40 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Assignee User ID"
                  value={ticketForm[proj._id]?.assignee || ''}
                  onChange={(e) => handleTicketChange(proj._id, 'assignee', e.target.value)}
                  className="w-40 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => submitTicket(proj._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create Ticket
                </button>
              </div>

              {/* Add Team Member */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="New Team Member ID"
                  value={ticketForm[proj._id]?.newMemberId || ''}
                  onChange={(e) => handleTicketChange(proj._id, 'newMemberId', e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => addMember(proj._id)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                >
                  Add Member
                </button>
              </div>

              {/* Kanban Board */}
              <KanbanBoard projectId={proj._id} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;