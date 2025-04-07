import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const DEFAULT_AIDB_PATH = "../input_database/cbm_defaults_v1.2.8340.362.db";
const DEFAULT_GCBM_EXECUTABLE = "../tools/gcbm/moja.cli.exe";

export default function SetupPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [files, setFiles] = useState({
    yieldTable: "yield_table_UngRU.csv",
    leadingSpecies: "CA_forest_lead_tree_species.tif",
    age: "CA_forest_age_2019.tif",
    RU: "admin_eco.shp",
    temp: "NAmerica_MAT_1971_2000.tif",
  });

  const FilePaths = {
    inventory: "../layers/raw/Inventory/",
    enviroment: "../layers/raw/Environment/",
    fire: "../layers/raw/Disturbances/Fire/",
    harvest: "../layers/raw/Disturbances/Harvest/",
    inputDatabase: "../input_database/",
  }

  const [disturbances, setDisturbances] = useState([]);
  const [parameters, setParameters] = useState({
    project_name: "Carbon Model",
    start_year: 1990,
    end_year: 2000,
    resolution: 0.01,
    yield_interval: 1,
  });

  const [tileIDs, setTileIDs] = useState(null);

  useEffect(() => {
    console.log("OutputPage rendered");
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

  const handleOpenFolder = async (path) => {
    const cleanpath = path.slice(2)
    await window.electron.ipcRenderer.invoke("open-folder", cleanpath);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const changeFile = async (fileKey, filePath) => {
    try {
        const cleanPath = filePath.slice(2); // Remove "./" or any unwanted prefix
        console.log("Opening directory:", cleanPath);

        const result = await window.electron.ipcRenderer.invoke("select-file", cleanPath);

        if (result.success) {
            setFiles((prevFiles) => ({
                ...prevFiles,
                [fileKey]: result.filePath.split(/[/\\]/).pop(), // Extract just the filename
            }));
        }
    } catch (error) {
        console.error("Error selecting file:", error);
    }
};

  const handleSubmit = async () => {
    const updatedConfig = {
      project_name: parameters.project_name,
      start_year: parameters.start_year,
      end_year: parameters.end_year,
      resolution: parameters.resolution,
      aidb: DEFAULT_AIDB_PATH,
      yield_table: FilePaths.inputDatabase + files.yieldTable,
      yield_interval: parameters.yield_interval,
      bounding_box: {
        layer: "../layers/raw/Inventory/GRID_forested_ecosystems.shp",
        attribute: { Id: tileIDs || [] }, // Ensure TileID is never null
      },
      classifiers: {
        LeadingSpecies: {
          layer: FilePaths.inventory + files.leadingSpecies,
          attribute: "NFI code",
        },
        PROV: {
          layer: FilePaths.inventory + files.RU,
          attribute: "ProvinceNa"
        },
        Ecozone: {
          layer: FilePaths.inventory + files.RU,
          attribute: "EcoBound_1"
        }
      },
      layers: {
        admin_boundary: {
            layer: FilePaths.inventory + files.RU,
            attribute: "ProvinceNa"
        },
        eco_boundary: {
            layer: FilePaths.inventory + files.RU,
            attribute: "EcoBound_1"
        },
        initial_age: { layer: FilePaths.inventory + files.age },
        mean_annual_temperature: FilePaths.enviroment + files.temp,
      },
      disturbances: {
        "../layers/raw/disturbances/harvest/CA_Forest_Harvest_1985-2020.tif": {
          "disturbance_type": "Clearcut harvesting with salvage",
          "year": "year"
        }
      },
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
    <div className="p-6 w-[650px] mx-auto bg-white shadow-lg rounded-lg h-[600px] overflow-y-auto mt-4">
      <h1 className="text-2xl font-bold mb-2">GCBM Setup</h1>
      <p className="mb-4 text-sm">Upload necessary files and input parameters for the GCBM simulation.</p>
  
      {/* Project Name */}
      <div className="mb-3">
        <label className="block text-sm font-semibold">Project Name:</label>
        <input
          type="text"
          name="project_name"
          value={parameters.project_name}
          onChange={handleInputChange}
          className="mt-1 border p-2 rounded w-full text-sm"
        />
      </div>
  
      {/* Start Year & End Year in the same row */}
      <div className="flex space-x-4 mb-3">
        {[
          { label: "Start Year", name: "start_year", type: "number" },
          { label: "End Year", name: "end_year", type: "number" },
        ].map((input) => (
          <div key={input.name} className="w-1/2">
            <label className="block text-sm font-semibold">{input.label}:</label>
            <input
              type={input.type}
              name={input.name}
              value={parameters[input.name]}
              onChange={handleInputChange}
              className="mt-1 border p-2 rounded w-full text-sm"
            />
          </div>
        ))}
      </div>
  
      {/* Resolution & Yield Interval */}
      <div className="flex space-x-4 mb-3">
        {[
          { label: "Resolution", name: "resolution", type: "number", step: "0.1" },
          { label: "Yield Interval", name: "yield_interval", type: "number" },
        ].map((input) => (
          <div key={input.name} className="w-1/2">
            <label className="block text-sm font-semibold">{input.label}:</label>
            <input
              type={input.type}
              name={input.name}
              value={parameters[input.name]}
              step={input.step || "1"}
              onChange={handleInputChange}
              className="mt-1 border p-2 rounded w-full text-sm"
            />
          </div>
        ))}
      </div>
  
      {/* Upload Files Button and Dropdown */}
      <div className="mb-3 relative">
        <button
          className="bg-gray-700 text-white text-sm px-4 py-2 rounded hover:bg-gray-800 w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Upload Files
        </button>
  
        {isDropdownOpen && (
          <div className="absolute w-full bg-white border rounded shadow-md mt-2 z-10">
            {Object.entries(FilePaths).map(([key, path]) => (
              <button
                key={key}
                onClick={() => handleOpenFolder(path)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
  
      {/* Required File Uploads */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        {[
          { label: "Yield Table", name: "yieldTable", dir: FilePaths.inputDatabase },
          { label: "Leading Species", name: "leadingSpecies", dir: FilePaths.inventory },
          { label: "Age", name: "age", dir: FilePaths.inventory },
          { label: "RU", name: "RU", dir: FilePaths.inventory },
          { label: "Temperature", name: "temp", dir: FilePaths.enviroment },
        ].map(({ label, name, dir }) => (
          <div key={name} className="flex items-center space-x-4">
            <label className="text-sm font-semibold">{label}:</label>
            <div className="flex-1">
              <button
                className={`mt-1 border p-3 rounded text-center text-sm cursor-pointer w-full ${
                  files[name] ? "bg-green-100" : "bg-gray-100"
                }`}
                onClick={() => changeFile(name, dir)}
              >
                {files[name] ? `${files[name]}` : "Select file"}
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {/* Submit Button */}
      <NavLink to="/Simulation/ScriptEditor">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 w-full mt-4"
        >
          Next
        </button>
      </NavLink>
    </div>
  );
}    