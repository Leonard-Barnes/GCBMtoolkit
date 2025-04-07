import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function GeneratePage() {
  const [userData, setUserData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke("load-user-data");
        setUserData(data);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const handleGenerate = async () => {
    const confirmed = window.confirm(
      "This will delete the previous generation. Are you sure you want to continue?"
    );
    if (!confirmed) return;

    setIsGenerating(true);
    setIsFinished(false);

    try {
      await window.electron.ipcRenderer.invoke("start-generation");
      setIsFinished(true);
    } catch (error) {
      console.error("Error during generation:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 w-[630px] mx-auto bg-white shadow-lg rounded-lg h-[600px] overflow-y-auto mt-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <NavLink to="/Simulation/ScriptEditor">
          <button className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600">
            <ArrowLeft size={20} />
          </button>
        </NavLink>
        <h1 className="text-2xl font-bold">GCBM Generate</h1>
        <NavLink to="/Simulation">
          <button className="text-white px-4 py-2 rounded hover:bg-gray-700">
            ✖
          </button>
        </NavLink>
      </div>

      <p className="mb-4 mt-2">Review your inputs and start the generation process.</p>

      {userData ? (
        <>
          <h2 className="text-xl font-semibold mt-4">Project Details</h2>
          <ul className="mt-2">
            {Object.entries(userData.parameters).map(([key, value]) => (
              <li key={key} className="border-b py-2">
                <strong>{key.replace(/_/g, " ")}:</strong> {value}
              </li>
            ))}
          </ul>

          {/* Start Generation Button with Confirmation */}
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4 disabled:opacity-50"
            disabled={isGenerating || isFinished}
          >
            {isGenerating ? "Generating..." : "Start Generation"}
          </button>

          {/* Go to Output Button */}
          <NavLink to="/Simulation/Output">
            <button
              className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4 ${
                !isFinished ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFinished}
            >
              Go to Output
            </button>
          </NavLink>

          {/* Loading Indicator */}
          {isGenerating && (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              <span className="ml-2 text-blue-600">Generating...</span>
            </div>
          )}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
