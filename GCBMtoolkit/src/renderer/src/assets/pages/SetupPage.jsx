import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const DEFAULT_AIDB_PATH = "../input_database/cbm_defaults_v1.2.8340.362.db";
const DEFAULT_GCBM_EXECUTABLE = "../tools/gcbm/moja.cli.exe";

export default function SetupPage() {
  const [files, setFiles] = useState({
    yieldTable: "../input_database/yield_table_UngRU.csv",
    leadingSpecies: "../layers/raw/Inventory/lead_species_150km.tif",
    age: "../layers/raw/Inventory/forest_age_150km.tif",
  });

  const [disturbances, setDisturbances] = useState([]);
  const [parameters, setParameters] = useState({
    project_name: "Carbon Model",
    start_year: 1990,
    end_year: 2000,
    resolution: 0.01,
    yield_interval: 1,
  });

  const disturbanceOptions = ["Fire", "Harvest", "Insect"];
  const [tileIDs, setTileIDs] = useState(null);

  useEffect(() => {
    const loadTileIDs = async () => {
      try {
        const result = await window.electron.ipcRenderer.invoke("load-tile-data");
        setTileIDs(result);
      } catch (error) {
        console.error("Error reading selectedTiles.json:", error);
      }
    };
    loadTileIDs();
  }, []);

  const handleFileUpload = async (fileType) => {
    const result = await window.electron.ipcRenderer.invoke("select-file");
    if (result.filePath) {
      setFiles((prev) => ({ ...prev, [fileType]: result.filePath }));
    }
  };

  const handleDisturbanceUpload = async (type) => {
    if (disturbances.some((d) => d.type === type)) return; // Prevent duplicate types

    const result = await window.electron.ipcRenderer.invoke("select-file");
    if (result.filePath) {
      setDisturbances((prev) => [...prev, { type, path: result.filePath }]);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const updatedConfig = {
      project_name: parameters.project_name,
      start_year: parameters.start_year,
      end_year: parameters.end_year,
      resolution: parameters.resolution,
      aidb: DEFAULT_AIDB_PATH,
      yield_table: files.yieldTable,
      yield_interval: parameters.yield_interval,
      bounding_box: {
        layer: "../layers/raw/Inventory/GRID_forested_ecosystems.shp",
        attribute: { TileID: tileIDs || [] }, // Ensure TileID is never null
      },
      classifiers: {
        LeadingSpecies: {
          layer: files.leadingSpecies,
          attribute: "NFI code",
        },
        RU: {
          layer: "../layers/raw/Inventory/admin_eco_150km.shp",
        },
      },
      layers: {
        initial_age: { layer: files.age },
        mean_annual_temperature: "../layers/raw/environment/annual_temp.tif",
      },
      disturbances: disturbances.reduce((acc, d) => {
        acc[d.path] = { disturbance_type: d.type };
        return acc;
      }, {}),
      gcbm_exe: DEFAULT_GCBM_EXECUTABLE,
    };

    try {
      await window.electron.ipcRenderer.invoke("save-config", updatedConfig);
      console.log("Updated config saved!");
    } catch (error) {
      console.error("Error saving config:", error);
    }

    const userData = { files, disturbances, parameters };
    try {
      await window.electron.ipcRenderer.invoke("save-user-data", userData);
      console.log("User data saved successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div className="p-6 w-[630px] mx-auto bg-white shadow-lg rounded-lg h-[600px] overflow-y-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">GCBM Setup</h1>
      <p className="mb-4">Upload necessary files and input parameters for the GCBM simulation.</p>

      {/* Input Fields */}
      {[
        { label: "Project Name", name: "project_name", type: "text" },
        { label: "Start Year", name: "start_year", type: "number" },
        { label: "End Year", name: "end_year", type: "number" },
        { label: "Resolution", name: "resolution", type: "number", step: "0.1" },
        { label: "Yield Interval", name: "yield_interval", type: "number" },
      ].map((input) => (
        <div className="mb-4" key={input.name}>
          <label className="block font-semibold">{input.label}:</label>
          <input
            type={input.type}
            name={input.name}
            value={parameters[input.name]}
            step={input.step || "1"}
            onChange={handleInputChange}
            className="mt-2 border p-2 rounded w-full"
          />
        </div>
      ))}

      {/* Required File Uploads */}
      {[
        { label: "Yield Table", name: "yieldTable" },
        { label: "Leading Species", name: "leadingSpecies" },
        { label: "Age", name: "age" },
      ].map((file) => (
        <div className="mb-4" key={file.name}>
          <label className="block font-semibold">{file.label} (Required):</label>
          <div
            className="mt-2 border p-4 rounded w-full text-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleFileUpload(file.name)}
          >
            {files[file.name] ? `✔️ ${files[file.name]}` : "Click to Upload"}
          </div>
        </div>
      ))}

      {/* Disturbance Dropdown and Upload */}
      <div className="mb-4">
        <label className="block font-semibold">Add Disturbance (Optional):</label>
        <select
          className="mt-2 border p-2 rounded w-full"
          onChange={(e) => handleDisturbanceUpload(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select disturbance type...
          </option>
          {disturbanceOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Display added disturbances */}
      {disturbances.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Added Disturbances:</h3>
          <ul className="bg-gray-100 p-4 rounded">
            {disturbances.map((disturbance, index) => (
              <li key={index} className="border-b py-2">
                {disturbance.type} - {disturbance.path}
              </li>
            ))}
          </ul>
        </div>
      )}

      <NavLink to="/Simulation/ScriptEditor">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4"
        >
          Next
        </button>
      </NavLink>
    </div>
  );
}
