import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function SimulationPage() {
  const navigate = useNavigate();

  const handleLoadConfig = async () => {
    try {
      // Replace with actual logic to load config file from saved_configs
      const response = await window.electron.readConfig("saved_configs/config.json");
      if (response) {
        console.log("Loaded config:", response);
        navigate("/Simulation/ScriptEditor", { state: { config: response } });
      } else {
        console.error("Failed to load config");
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="hero bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-12 px-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center">GCBM Simulation</h1>
        <p className="text-center text-lg mt-4">
          Understand how the Generic Carbon Budget Model (GCBM) works and get started with your own simulation.
        </p>
      </div>

      <div className="bg-white p-4 shadow-lg mt-6 rounded-lg">
        <h2 className="text-2xl font-semibold">How GCBM Works</h2>
        <p className="mt-4 text-gray-700">
          The GCBM is a powerful tool for simulating forest carbon dynamics. It integrates forest inventory data, growth
          models, disturbance effects, and decomposition processes to estimate carbon stocks and fluxes over time.
        </p>

        <h3 className="text-xl font-semibold mt-6">Key Features:</h3>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Simulates carbon stocks and fluxes in forest ecosystems.</li>
          <li>Accounts for growth, harvesting, natural disturbances, and decomposition.</li>
          <li>Provides detailed outputs for carbon reporting and decision-making.</li>
        </ul>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <NavLink to="/Simulation/TileSelection">
          <button className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-500 transition">
            Generate
          </button>
        </NavLink>
        <NavLink to="/Simulation/Output">
          <button className="bg-green-600 text-white py-3 ml-6 px-6 rounded-lg shadow-md hover:bg-green-500 transition">
            View Output
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default SimulationPage;
