import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar'
import SideBar from './components/SideBar'
import HomePage from './assets/pages/HomePage';
import SimulationPage from './assets/pages/SimulationPage';
import ScriptEditorPage from './assets/pages/ScriptEditorPage';
import OutputPage from './assets/pages/OutputPage';
import SetupPage from './assets/pages/SetupPage';
import GeneratePage from './assets/pages/GeneratePage';
import FAQPage from './assets/pages/FAQPage';
import SettingsPage from './assets/pages/SettingsPage';
import TileSelectionPage from './assets/pages/TileSelectionPage';
import logo from './assets/Flag_of_Canada.png';



function App() {

  return (
    <Router>
      <TopBar />
      
      <div className="flex">
      <div className="w-64 h-screen bg-gray-200 text-white shadow-lg flex flex-col p-4">
        <SideBar></SideBar>
      </div>
      <div className="w-2 h-screen bg-gray-200"></div>
        <div className="absolute bottom-12 left-24">
          <img src={logo} alt="Logo" className=" w-12 opacity-90 hover:opacity-100 transition" />
        </div>
        <div className="absolute bottom-4 left-8">Natural Resources Canada</div>

        <div className="w-3/4 h-screen bg-gray-200">
          <div className="p-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Simulation" element={<SimulationPage />} />
              <Route path="/Simulation/ScriptEditor" element={<ScriptEditorPage />} />
              <Route path="/Simulation/Output" element={<OutputPage />} />
              <Route path="/Settings" element={<SettingsPage />} />
              <Route path="/Simulation/Generate" element={<GeneratePage />} />
              <Route path="/Simulation/Setup" element={<SetupPage />} />
              <Route path="/Simulation/TileSelection" element={<TileSelectionPage />} />
              <Route path="/FAQ" element={<FAQPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
