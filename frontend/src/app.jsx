import React, { useState } from 'react';
import GalleryView from './components/GalleryView';
import ExhibitView from './components/ExhibitView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CanvasEditor from './components/CanvasEditor';
import UploadWizard from './components/UploadWizard';

export default function App() {
  const [view, setView] = useState('gallery'); // gallery | exhibit | login | admin | canvas | wizard
  const [selectedExhibit, setSelectedExhibit] = useState(null);

  // Initial Mock Data
  const [exhibits, setExhibits] = useState([
    {
      id: 'smart-city-2045',
      title: 'Smart City Infrastructure 2045',
      description: 'Explore the future of connected urban systems and intelligent transportation networks.',
      zones: 5,
      audioStatus: 'Ready',
      color: 'from-blue-900/40 to-blue-950/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      duration: '3:05',
      sections: [
        { name: 'Transportation Hub', start: '0:00', end: '0:37', type: 'Rect', color: '#3B82F6', x: 10, y: 8, w: 38, h: 20 },
        { name: 'Energy District', start: '0:37', end: '1:14', type: 'Rect', color: '#10B981', x: 55, y: 8, w: 38, h: 20 },
        { name: 'Data Core Node', start: '1:14', end: '1:51', type: 'Circle', color: '#8B5CF6', x: 44, y: 40, w: 12, h: 20 },
        { name: 'Civic Administration', start: '1:51', end: '2:28', type: 'Rect', color: '#F59E0B', x: 10, y: 68, w: 38, h: 20 },
        { name: 'Port & Logistics', start: '2:28', end: '3:05', type: 'Rect', color: '#EF4444', x: 55, y: 68, w: 38, h: 20 },
      ]
    },
    {
      id: 'urban-mobility',
      title: 'Urban Mobility Network',
      description: 'A deep dive into next-generation public transit and autonomous vehicle corridors.',
      zones: 3,
      audioStatus: 'Ready',
      color: 'from-emerald-900/40 to-emerald-950/20',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      duration: '2:22',
      sections: [
        { name: 'Rail Network', start: '0:00', end: '0:47', type: 'Rect', color: '#06B6D4', x: 10, y: 15, w: 80, h: 18 },
        { name: 'Bus Rapid Transit', start: '0:47', end: '1:35', type: 'Rect', color: '#10B981', x: 10, y: 45, w: 60, h: 16 },
        { name: 'Autonomous Zones', start: '1:35', end: '2:22', type: 'Circle', color: '#F59E0B', x: 30, y: 70, w: 25, h: 20 },
      ]
    },
    {
      id: 'energy-grid',
      title: 'Renewable Energy Grid',
      description: 'Distributed solar, wind and battery storage for the modern smart city.',
      zones: 7,
      audioStatus: 'Missing',
      color: 'from-orange-900/30 to-orange-950/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      duration: '0:00',
      sections: []
    }
  ]);

  const handleSelectExhibit = (exhibit) => {
    setSelectedExhibit(exhibit);
    setView('exhibit');
  };

  const handleEditConfig = (exhibit) => {
    setSelectedExhibit(exhibit);
    setView('canvas');
  };

  const handleSaveCanvasConfig = (id, updatedSections) => {
    setExhibits(prev => prev.map(ex => ex.id === id ? { ...ex, sections: updatedSections, zones: updatedSections.length } : ex));
    setView('admin');
  };

  const handleAddNewExhibit = (newExhibit) => {
    setExhibits(prev => [...prev, {
      ...newExhibit,
      zones: 0,
      audioStatus: 'Missing',
      color: 'from-purple-900/40 to-purple-950/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      duration: '0:00',
      sections: []
    }]);
    setView('admin');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex">
      {/* Sidebar Layout Navigation */}
      <aside className="w-16 bg-[#0E1322] border-r border-[#1F293D] flex flex-col items-center py-6 justify-between shrink-0">
        <div className="flex flex-col gap-6 items-center">
          <button onClick={() => setView('gallery')} className={`p-3 rounded-xl transition ${view === 'gallery' || view === 'exhibit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-[#1E293B]'}`}>
            <span className="text-xl font-bold">⚡</span>
          </button>
          <button onClick={() => setView('gallery')} className="p-3 rounded-xl text-gray-400 hover:bg-[#1E293B] transition">
            📂
          </button>
          <button onClick={() => setView('admin')} className={`p-3 rounded-xl transition ${view === 'admin' || view === 'canvas' || view === 'wizard' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-[#1E293B]'}`}>
            📊
          </button>
        </div>
        <button onClick={() => setView('login')} className="p-3 rounded-xl text-gray-400 hover:bg-[#1E293B] transition">
          ⚙️
        </button>
      </aside>

      {/* Primary Dynamic App Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {view === 'gallery' && <GalleryView exhibits={exhibits} onSelect={handleSelectExhibit} onAdminClick={() => setView('login')} />}
        {view === 'exhibit' && <ExhibitView exhibit={selectedExhibit} onBack={() => setView('gallery')} />}
        {view === 'login' && <AdminLogin onLoginSuccess={() => setView('admin')} onBack={() => setView('gallery')} />}
        {view === 'admin' && <AdminDashboard exhibits={exhibits} onEditConfig={handleEditConfig} onCreateNew={() => setView('wizard')} onSignOut={() => setView('gallery')} />}
        {view === 'canvas' && <CanvasEditor exhibit={selectedExhibit} onSave={handleSaveCanvasConfig} onCancel={() => setView('admin')} />}
        {view === 'wizard' && <UploadWizard onSave={handleAddNewExhibit} onCancel={() => setView('admin')} />}
      </main>
    </div>
  );
}