import { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MasterData from './components/MasterData'
import Inventory from './components/Inventory'

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar active={tab} onChange={setTab} />
      <main className="max-w-6xl mx-auto">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'master' && <MasterData />}
        {tab === 'inventory' && <Inventory />}
      </main>
    </div>
  )
}

export default App
