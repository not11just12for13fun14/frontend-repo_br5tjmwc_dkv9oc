import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/dashboard`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['products','customers','suppliers','open_sales_orders','invoices','payments','stock_items'].map(k => (
          <div key={k} className="bg-white rounded-lg shadow p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">{k.replaceAll('_',' ')}</p>
            <p className="text-3xl font-semibold text-gray-800">{data?.totals?.[k] ?? '-'}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Low stock</h3>
          <button onClick={load} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <div className="mt-3 divide-y">
          {(data?.low_stock ?? []).map((row) => (
            <div key={row.id} className="py-2 text-sm flex items-center justify-between">
              <span>{row.product_sku} @ {row.warehouse_code}</span>
              <span className="font-medium">{row.on_hand}</span>
            </div>
          ))}
          {(!data?.low_stock || data.low_stock.length === 0) && (
            <p className="text-gray-500 text-sm">No low stock items.</p>
          )}
        </div>
      </div>
    </div>
  )
}
