import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar'
import HomePage from './assets/pages/HomePage';
import SimulationPage from './assets/pages/SimulationPage';
import ScriptEditorPage from './assets/pages/ScriptEditorPage';
import ExtraPage from './assets/pages/ExtraPage';

function App() {

  return (
    <Router>
      <TopBar />
      <div className="flex">
        <div className="w-1/4 h-screen bg-green-800 text-white">
          <div className="space-y-4 p-4">
            <div className="cursor-pointer hover:bg-green-700 p-2 rounded-md">
              <a href="/" className="pt-1 pb-1 pl-1 pr-32">Home</a>
            </div>
            <div className="cursor-pointer hover:bg-green-700 p-2 rounded-md">
              <a href="/Simulation" className="pt-1 pb-1 pl-1 pr-24">Simulation</a>
            </div>
            <div className="cursor-pointer hover:bg-green-700 p-2 rounded-md">
              <a href="/ScriptEditor" className="pt-1 pb-1 pl-1 pr-20">Script Editor</a>
            </div>
            <div className="cursor-pointer hover:bg-green-700 p-2 rounded-md">
              <a href="/ExtraPage" className="pt-1 pb-1 pl-1 pr-24">Extra Page</a>
            </div>
          </div>
        </div>

        <div className="w-3/4 h-screen bg-gray-100">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Simulation" element={<SimulationPage />} />
              <Route path="/ScriptEditor" element={<ScriptEditorPage />} />
              <Route path="/ExtraPage" element={<ExtraPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
