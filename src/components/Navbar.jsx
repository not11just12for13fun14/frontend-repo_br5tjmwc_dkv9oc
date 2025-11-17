import { useState } from 'react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'master', label: 'Master Data' },
  { id: 'inventory', label: 'Inventory' },
]

export default function Navbar({ active, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="w-full bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-indigo-500" />
          <span className="font-semibold text-gray-800">Mini ERP</span>
        </div>
        <nav className="hidden md:flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${active === t.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {t.label}
            </button>
          ))}
          <a href="/test" className="ml-2 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100">Health</a>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <span className="i" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { onChange(t.id); setOpen(false) }}
              className={`block w-full text-left px-4 py-3 ${active === t.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
            >
              {t.label}
            </button>
          ))}
          <a href="/test" className="block px-4 py-3 hover:bg-gray-50">Health</a>
        </div>
      )}
    </header>
  )
}
