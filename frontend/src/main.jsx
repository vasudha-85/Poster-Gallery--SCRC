import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Gallery from "./views/Gallery"
import PosterView from "./views/PosterView"
import AdminLogin from "./views/AdminLogin"

import "./styles.css"

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery/>} />
        <Route path="/poster/:id" element={<PosterView/>} />
        <Route path="/admin/login" element={<AdminLogin/>} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById("root")).render(<App />)
