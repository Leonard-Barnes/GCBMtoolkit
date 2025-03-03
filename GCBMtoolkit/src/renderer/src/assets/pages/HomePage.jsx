import React from "react";

function HomePage() {

  const openPDF = (filePath) => {
    window.electron.ipcRenderer.send("open-pdf", filePath);
  };

  return (
    <div className="flex flex-col p-0">
      <h1 className="text-3xl font-bold text-green-800 mb-4 p-0 text-center">GCBM - Generic Carbon Budget Model</h1>
      
      <p className="text-lg text-gray-700 max-w-2xl mb-6 pt-2 justify-right">
        The Generic Carbon Budget Model (GCBM) is a forest carbon accounting tool designed 
        to estimate carbon stocks and fluxes in managed forests. It supports decision-making 
        in sustainable forest management and climate change mitigation.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-lg justify-center">
        <h2 className="text-xl font-semibold text-green-700 mb-3">Useful Resources</h2>
        <ul className="text-left text-blue-600">
          <li>
            📄{""}
            <button
              onClick={() => openPDF("GCBM-JSON Workflow.pdf")}
              className="hover:underline"
            >
              GCBM-JSON Worlflow
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