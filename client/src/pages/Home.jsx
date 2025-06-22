import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white space-y-6 max-w-xl">
        <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">Bug Tracker Pro</h1>
        <p className="text-lg text-gray-200">
          A simple, clean, Project management app. Track bugs, manage tasks, and collaborate with your team.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-purple-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;