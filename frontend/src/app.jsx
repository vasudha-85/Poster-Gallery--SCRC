import React, { useState } from 'react';
import Gallery from './Gallery';         // Make sure path matches your file location
import AdminLogin from './AdminLogin';   // Make sure path matches your file location
import Dashboard from './Dashboard';     // Make sure path matches your file location

export default function App() {
  // Initial state is set to 'login' so you see it first
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const isAuthSaved = localStorage.getItem('isAdminAuthenticated') === 'true';

  // Successfully handles the state shift to dashboard
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100">
      
      {/* 1. PUBLIC VISITOR GALLERY VIEW */}
      {currentView === 'gallery' && (
        <Gallery onAdminClick={() => setCurrentView('login')} />
      )}

      {/* 2. ADMIN PORTAL GATEWAY */}
{currentView === 'login' && (
  <AdminLogin 
    onLoginSuccess={() => {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    }} 
    onBack={() => setCurrentView('gallery')} 
  />
)}

      {/* 3. MANAGEMENT WORKSPACE DASHBOARD */}
      {currentView === 'dashboard' && isAuthenticated && (
        <Dashboard 
          onNewExhibit={() => setCurrentView('new-exhibit')} 
          onSignOut={handleSignOut}
        />
      )}

      {/* 4. EXHIBIT UPLOAD WIZARD STEPPER */}
      {currentView === 'new-exhibit' && isAuthenticated && (
        <div className="p-8">
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl mb-4 text-xs font-semibold transition"
          >
            ← Cancel and Return to Dashboard
          </button>
          <div className="bg-[#131926] p-8 rounded-2xl border border-[#1F293D]">
            <h2 className="text-xl font-bold">New Exhibit Upload Wizard Stage 1</h2>
          </div>
        </div>
      )}

    </div>
  );
}