import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import Dashboard from './views/Dashboard'
import Gallery from './views/Gallery' // Un-commented
import AdminLogin from './views/AdminLogin'

// If you have a separate Exhibit player component view, import it like this:
// import ExhibitView from './views/ExhibitView'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* Gallery is now active at the core root index URL */}
        <Route path="/" element={<Gallery />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Optional: Handle deep linking when clicking individual cards */}
        {/* <Route path="/exhibit/:id" element={<ExhibitView />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)