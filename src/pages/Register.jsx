import { useState, useEffect } from 'react'

export default function Register() {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    setError(null)

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
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Cricket Team Registration</h1>
          <p className="text-gray-600 mt-2">Register your squad of 8 players for the tournament</p>
          <div className="mt-3 text-sm">
            <a href="/host" className="text-emerald-700 hover:underline">Host view</a>
          </div>
        </header>

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

        <footer className="mt-10 text-center text-xs text-gray-500">
          Backend: <span className="font-mono">{baseUrl}</span>
        </footer>
      </div>
    </div>
  )
}
