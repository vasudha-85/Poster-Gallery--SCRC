import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import Dashboard from './views/Dashboard'
// import Gallery from './views/Gallery'
import AdminLogin from './views/AdminLogin'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Gallery/>} /> */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/admin" element={<AdminLogin/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)

