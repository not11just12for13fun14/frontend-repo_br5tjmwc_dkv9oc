import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Field({ label, value, onChange, type='text', placeholder='' }) {
  return (
    <label className="block text-sm mb-3">
      <span className="text-gray-700">{label}</span>
      <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </label>
  )
}

function List({ rows, cols }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {cols.map(c => <th key={c.key} className="text-left px-3 py-2 bg-gray-50 border-b font-medium text-gray-600">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
              {cols.map(c => <td key={c.key} className="px-3 py-2">{r[c.key]}</td>)}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="px-3 py-4 text-gray-500" colSpan={cols.length}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function Inventory() {
  const [stock, setStock] = useState([])
  const [txn, setTxn] = useState({ type: 'in', product_sku: '', quantity: '', warehouse_code: '', reference: '' })

  const load = async () => {
    const res = await fetch(`${baseUrl}/inventory/stock`)
    const json = await res.json()
    setStock(json)
  }

  useEffect(() => { load() }, [])

  const submit = async () => {
    const body = { ...txn, quantity: Number(txn.quantity || 0) }
    const res = await fetch(`${baseUrl}/inventory/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
      const msg = await res.text(); alert(`Error: ${msg}`); return
    }
    setTxn({ type: 'in', product_sku: '', quantity: '', warehouse_code: '', reference: '' })
    load()
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Record Transaction</h3>
        <div className="grid md:grid-cols-5 gap-3 mb-3">
          <label className="block text-sm mb-3">
            <span className="text-gray-700">Type</span>
            <select value={txn.type} onChange={e=>setTxn({...txn, type:e.target.value})} className="mt-1 w-full border rounded px-3 py-2">
              <option value="in">In</option>
              <option value="out">Out</option>
              <option value="adjustment">Adjustment</option>
            </select>
          </label>
          <Field label="Product SKU" value={txn.product_sku} onChange={v=>setTxn({...txn, product_sku:v})} />
          <Field label="Quantity" type="number" value={txn.quantity} onChange={v=>setTxn({...txn, quantity:v})} />
          <Field label="Warehouse Code" value={txn.warehouse_code} onChange={v=>setTxn({...txn, warehouse_code:v})} />
          <div className="flex items-end"><button onClick={submit} className="w-full bg-blue-600 text-white rounded px-3 py-2">Save</button></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Stock Levels</h3>
        <List rows={stock} cols={[{key:'product_sku',label:'SKU'},{key:'warehouse_code',label:'Warehouse'},{key:'on_hand',label:'On Hand'},{key:'reserved',label:'Reserved'}]} />
      </div>
    </div>
  )
}
