import React, { useState } from "react";

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const resetSettings = () => {
    setDarkMode(false);
    // Add more reset logic if needed
    alert("Settings have been reset to default.");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-gray-600 mb-6">Manage your application preferences here.</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
          <span className="font-medium">Dark Mode</span>
          <button 
            onClick={toggleDarkMode} 
            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 text-white' : 'bg-gray-300 text-black'}`}
          >
            {darkMode ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      <button 
        onClick={resetSettings} 
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Reset to Default
      </button>
    </div>
  );
}

export default SettingsPage;
