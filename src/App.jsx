import { useState, useEffect } from 'react'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const [form, setForm] = useState({
    captain_name: '',
    contact_number: '',
    team_name: '',
    players: Array(8).fill(''),
    fees: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [registrations, setRegistrations] = useState([])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updatePlayer = (index, value) => {
    setForm((prev) => {
      const players = [...prev.players]
      players[index] = value
      return { ...prev, players }
    })
  }

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/registrations`)
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.items || [])
      }
    } catch (e) {
      // ignore list errors silently for now
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

    // Basic front-end validation
    if (!form.captain_name || !form.contact_number || !form.team_name) {
      setError('Please fill in captain name, contact number, and team name.')
      setSubmitting(false)
      return
    }
    const filledPlayers = form.players.filter((p) => p && p.trim() !== '')
    if (filledPlayers.length !== 8) {
      setError('Please provide names for all 8 players.')
      setSubmitting(false)
      return
    }

    const feesNumber = parseFloat(form.fees)
    if (isNaN(feesNumber) || feesNumber < 0) {
      setError('Please enter a valid non-negative fees amount.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`${baseUrl}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captain_name: form.captain_name,
          contact_number: form.contact_number,
          team_name: form.team_name,
          players: form.players,
          fees: feesNumber,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Submission failed')
      }
      await res.json()
      setMessage('Registration submitted successfully!')
      setForm({ captain_name: '', contact_number: '', team_name: '', players: Array(8).fill(''), fees: '' })
      fetchRegistrations()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (val) => {
    if (typeof val !== 'number') return ''
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Cricket Team Registration</h1>
          <p className="text-gray-600 mt-2">Register your squad of 8 players for the tournament</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Captain Name</label>
              <input
                type="text"
                value={form.captain_name}
                onChange={(e) => updateField('captain_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., Virat Kohli"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={form.contact_number}
                onChange={(e) => updateField('contact_number', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., +91 98765 43210"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Team Name</label>
              <input
                type="text"
                value={form.team_name}
                onChange={(e) => updateField('team_name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="e.g., Thunder Strikers"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Fees</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.fees}
                  onChange={(e) => updateField('fees', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="e.g., 25.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.players.map((val, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Player {idx + 1}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => updatePlayer(idx, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder={`Player ${idx + 1} name`}
                    required
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg">{error}</div>
            )}
            {message && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-lg">{message}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
            >
              {submitting ? 'Submitting...' : 'Submit Registration'}
            </button>

            <a href="/test" className="block text-center text-sm text-gray-500 hover:text-gray-700">Check backend connection</a>
          </form>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Registrations</h2>
            {registrations.length === 0 ? (
              <p className="text-gray-500">No registrations yet.</p>
            ) : (
              <ul className="space-y-4 max-h-[540px] overflow-auto pr-2">
                {registrations.map((r) => (
                  <li key={r._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{r.team_name}</p>
                        <p className="text-sm text-gray-600">Captain: {r.captain_name}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">8 Players</span>
                        {typeof r.fees !== 'undefined' && (
                          <span className="block text-xs text-gray-600 mt-1">Fees: {formatCurrency(r.fees)}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="font-medium">Players:</p>
                      <p className="text-gray-600">{Array.isArray(r.players) ? r.players.join(', ') : ''}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Contact: {r.contact_number}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-500">
          Backend: <span className="font-mono">{baseUrl}</span>
        </footer>
      </div>
    </div>
  )
}

export default App
