import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

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
      <h1 className="text-2xl font-bold mb-4">GCBM Generation</h1>
      <NavLink to="/Simulation">
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-16 mt-4 top-12 right-8 absolute ">
          Exit
        </button>
      </NavLink>
      <p className="mb-4">Review your inputs and start the generation process.</p>

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


          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4 disabled:opacity-50"
            disabled={isGenerating || isFinished}
          >
            {isGenerating ? "Generating..." : "Start Generation"}
          </button>

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

          {/* Loading Indicator Below Buttons */}
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
