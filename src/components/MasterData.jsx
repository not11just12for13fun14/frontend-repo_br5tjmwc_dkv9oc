import { useEffect, useMemo, useState } from 'react'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  )
}

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

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function MasterData() {
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [taxes, setTaxes] = useState([])

  const [p, setP] = useState({ sku: '', name: '', price: '', cost: '' })
  const [c, setC] = useState({ name: '', email: '' })
  const [s, setS] = useState({ name: '', email: '' })
  const [w, setW] = useState({ name: '', code: '' })
  const [t, setT] = useState({ name: '', rate: '' })

  const loadAll = async () => {
    const fetchJson = (url) => fetch(url).then(r=>r.json())
    const [prods, custs, sups, whs, tx] = await Promise.all([
      fetchJson(`${baseUrl}/products`),
      fetchJson(`${baseUrl}/customers`),
      fetchJson(`${baseUrl}/suppliers`),
      fetchJson(`${baseUrl}/warehouses`),
      fetchJson(`${baseUrl}/taxes`),
    ])
    setProducts(prods); setCustomers(custs); setSuppliers(sups); setWarehouses(whs); setTaxes(tx)
  }

  useEffect(() => { loadAll() }, [])

  const submit = async (path, body, onDone) => {
    const res = await fetch(`${baseUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
      const msg = await res.text(); alert(`Error: ${msg}`); return
    }
    onDone && onDone(); loadAll()
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Section title="Products">
        <div className="grid md:grid-cols-5 gap-3 mb-3">
          <Field label="SKU" value={p.sku} onChange={v=>setP({...p, sku:v})} />
          <Field label="Name" value={p.name} onChange={v=>setP({...p, name:v})} />
          <Field label="Price" type="number" value={p.price} onChange={v=>setP({...p, price:parseFloat(v||0)})} />
          <Field label="Cost" type="number" value={p.cost} onChange={v=>setP({...p, cost:parseFloat(v||0)})} />
          <div className="flex items-end"><button onClick={()=>submit('/products', { ...p, price: Number(p.price||0), cost: Number(p.cost||0) }, ()=>setP({ sku:'', name:'', price:'', cost:'' }))} className="w-full bg-blue-600 text-white rounded px-3 py-2">Add</button></div>
        </div>
        <List rows={products} cols={[{key:'sku',label:'SKU'},{key:'name',label:'Name'},{key:'price',label:'Price'},{key:'cost',label:'Cost'}]} />
      </Section>

      <Section title="Customers">
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <Field label="Name" value={c.name} onChange={v=>setC({...c, name:v})} />
          <Field label="Email" value={c.email} onChange={v=>setC({...c, email:v})} />
          <div className="md:col-span-2 flex items-end"><button onClick={()=>submit('/customers', c, ()=>setC({ name:'', email:'' }))} className="w-full bg-blue-600 text-white rounded px-3 py-2">Add</button></div>
        </div>
        <List rows={customers} cols={[{key:'name',label:'Name'},{key:'email',label:'Email'}]} />
      </Section>

      <Section title="Suppliers">
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <Field label="Name" value={s.name} onChange={v=>setS({...s, name:v})} />
          <Field label="Email" value={s.email} onChange={v=>setS({...s, email:v})} />
          <div className="md:col-span-2 flex items-end"><button onClick={()=>submit('/suppliers', s, ()=>setS({ name:'', email:'' }))} className="w-full bg-blue-600 text-white rounded px-3 py-2">Add</button></div>
        </div>
        <List rows={suppliers} cols={[{key:'name',label:'Name'},{key:'email',label:'Email'}]} />
      </Section>

      <Section title="Warehouses">
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <Field label="Name" value={w.name} onChange={v=>setW({...w, name:v})} />
          <Field label="Code" value={w.code} onChange={v=>setW({...w, code:v})} />
          <div className="md:col-span-2 flex items-end"><button onClick={()=>submit('/warehouses', w, ()=>setW({ name:'', code:'' }))} className="w-full bg-blue-600 text-white rounded px-3 py-2">Add</button></div>
        </div>
        <List rows={warehouses} cols={[{key:'name',label:'Name'},{key:'code',label:'Code'}]} />
      </Section>

      <Section title="Taxes">
        <div className="grid md:grid-cols-4 gap-3 mb-3">
          <Field label="Name" value={t.name} onChange={v=>setT({...t, name:v})} />
          <Field label="Rate %" type="number" value={t.rate} onChange={v=>setT({...t, rate:parseFloat(v||0)})} />
          <div className="md:col-span-2 flex items-end"><button onClick={()=>submit('/taxes', { ...t, rate: Number(t.rate||0) }, ()=>setT({ name:'', rate:'' }))} className="w-full bg-blue-600 text-white rounded px-3 py-2">Add</button></div>
        </div>
        <List rows={taxes} cols={[{key:'name',label:'Name'},{key:'rate',label:'Rate %'}]} />
      </Section>
    </div>
  )
}
