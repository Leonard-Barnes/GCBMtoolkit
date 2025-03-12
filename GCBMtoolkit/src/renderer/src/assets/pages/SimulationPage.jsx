import React from "react";
import { NavLink } from "react-router-dom";

function SimulationPage() {
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

      <div className="flex justify-center mt-8">
        <NavLink to="/Simulation/TileSelection">
          <button className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-500 transition">
           Generate from Tile
          </button>
        </NavLink>
        <div className="p-8"></div>
        <NavLink to="/Simulation/Setup">
          <button className="bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-500 transition">
           Load your Own Data
          </button>
        </NavLink>
      </div>
    </div>
  );
}

export default SimulationPage;
