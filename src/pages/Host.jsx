import { useEffect, useState } from 'react'

export default function Host() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const formatCurrency = (val) => {
    if (typeof val !== 'number') return ''
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val)
  }

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/registrations`)
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
      const data = await res.json()
      setRegistrations(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalFees = registrations.reduce((sum, r) => sum + (typeof r.fees === 'number' ? r.fees : 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Host Dashboard</h1>
            <p className="text-gray-600">View all team registrations</p>
          </div>
          <a href="/register" className="text-emerald-700 hover:underline">Open registration page</a>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Registrations</h2>
            <div className="text-sm text-gray-600">Total fees collected: <span className="font-semibold">{formatCurrency(totalFees)}</span></div>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : registrations.length === 0 ? (
            <p className="text-gray-500">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-3">Team</th>
                    <th className="p-3">Captain</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Players (8)</th>
                    <th className="p-3">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r._id} className="border-b last:border-0">
                      <td className="p-3 font-medium text-gray-800">{r.team_name}</td>
                      <td className="p-3">{r.captain_name}</td>
                      <td className="p-3">{r.contact_number}</td>
                      <td className="p-3 text-gray-600">{Array.isArray(r.players) ? r.players.join(', ') : ''}</td>
                      <td className="p-3">{typeof r.fees !== 'undefined' ? formatCurrency(r.fees) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
