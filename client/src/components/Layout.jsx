import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Bug Tracker</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block hover:text-purple-400">Dashboard</Link>
          <Link to="/projects" className="block hover:text-purple-400">My Projects</Link>
          <Link to="/tickets" className="block hover:text-purple-400">Tickets</Link>
          <Link to="/" className="block text-sm mt-4 text-gray-400 hover:text-white">← Back to Home</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="text-sm text-gray-600">👤 Tanaya</div>
        </header>

        {/* Content */}
        <section className="p-6 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}

export default Layout;