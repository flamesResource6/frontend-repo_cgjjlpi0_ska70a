import { Link } from 'react-router-dom'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Cricket Tournament Portal</h1>
        <p className="text-gray-600 mt-3">Choose your path below</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/register" className="block group">
            <div className="h-full bg-white rounded-xl shadow-lg p-8 border border-transparent group-hover:border-emerald-300 transition">
              <h2 className="text-2xl font-bold text-gray-800">Player Registration</h2>
              <p className="text-gray-600 mt-2">Register a team with 8 players and fees</p>
              <div className="mt-6 inline-flex items-center gap-2 text-emerald-700 font-semibold">
                Go to registration
                <span aria-hidden>→</span>
              </div>
            </div>
          </Link>

          <Link to="/host" className="block group">
            <div className="h-full bg-white rounded-xl shadow-lg p-8 border border-transparent group-hover:border-blue-300 transition">
              <h2 className="text-2xl font-bold text-gray-800">Host Dashboard</h2>
              <p className="text-gray-600 mt-2">View all registrations and total fees</p>
              <div className="mt-6 inline-flex items-center gap-2 text-blue-700 font-semibold">
                Open host view
                <span aria-hidden>→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 text-sm text-gray-500">
          <p>
            Need to verify the backend connection? <a href="/test" className="text-gray-700 underline">Open the test page</a>
          </p>
          <p className="mt-2">Backend: <span className="font-mono">{baseUrl}</span></p>
        </div>
      </div>
    </div>
  )
}

export default App
