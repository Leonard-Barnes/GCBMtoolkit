import React from "react";
import { NavLink } from 'react-router-dom';

function HomePage() {

  const openPDF = (filePath) => {
    window.electron.ipcRenderer.send("open-pdf", filePath);
  };

  return (
    <div className="flex flex-col p-0">
      <div className="hero bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white py-20">
        <h1 className="text-4xl font-bold text-center">Welcome to GCBM</h1>
        <p className="text-center text-lg mt-4">A powerful tool for forest carbon management and more</p>
        {/*<button className="mt-6 bg-white text-black py-2 px-6 rounded-full shadow-lg hover:bg-gray-100">Get Started</button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div className="card p-6 bg-white shadow-lg hover:scale-105 transform transition">
          <h3 className="text-xl font-semibold">About GCBM</h3>
          <p>Learn how the GCBM tool helps with forest carbon management.</p>
          <a
            href="https://natural-resources.canada.ca/climate-change/climate-change-impacts-forests/generic-carbon-budget-model"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2"
          >
            <button className="mt-2 text-blue-500 hover:underline">Read More</button>
          </a>
        </div>
        <div className="card p-6 bg-white shadow-lg hover:scale-105 transform transition">
          <h3 className="text-xl font-semibold">Carbon Models</h3>
          <p>Start a new simulation and analyze your results.</p>
          <NavLink
            to="/Simulation" className="mt-2 text-blue-500 py-4">
            <button className="mt-2 text-blue-500 hover:underline">Generate Model</button>
          </NavLink>
        </div>
        <div className="card p-6 bg-white shadow-lg hover:scale-105 transform transition">
          <h3 className="text-xl font-semibold">FAQ</h3>
          <p>Read the answers to some of the GCBM's most asked questions</p>
          <button className="mt-2 text-blue-500">Read More</button>
        </div>
        <div className="card p-6 bg-white shadow-lg hover:scale-105 transform transition">
        <h3 className="text-xl font-semibold mb-3">Useful Resources</h3>
        <ul className="text-left text-blue-600">
          <li>
            📄{""}
            <button
              onClick={() => openPDF("GCBM-JSON Workflow.pdf")}
              className="hover:underline"
            >
              GCBM-JSON Workflow
            </button>
          </li>
          <li>
            📄{""}
            <button
              onClick={() => openPDF("GCBM-Installation-Guide.pdf")}
              className="hover:underline"
            >
              GCBM Installation Guide
            </button>
          </li>
          <li>
            📄{""}
            <button
              onClick={() => openPDF("gcbmwalltowall Manual.pdf")}
              className="hover:underline"
            >
              GCBM walltowall Manual
            </button>
          </li>
        </ul>
        </div>
        {/* Repeat for more cards */}
      </div>
    </div>
  );
}

export default HomePage;

/*
import React from 'react';

function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      <p>This is where your content will be displayed.</p>
    </div>
  );
}

export default HomePage;
*/