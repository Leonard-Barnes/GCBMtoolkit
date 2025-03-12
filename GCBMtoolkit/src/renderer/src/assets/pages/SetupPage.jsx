import React, { useState } from "react";
import { NavLink } from 'react-router-dom';

export default function SetupPage() {
  const [files, setFiles] = useState({
    yieldTable: null,
    leadingSpecies: null,
    age: null,
    fire: null,
    harvest: null,
    insect: null,
  });

  const [parameters, setParameters] = useState({
    project_name: "",
    start_year: "",
    end_year: "",
    resolution: "",
    yield_interval: "",
  });

  const handleFileUpload = (event, fileType) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: event.target.files[0], // Store the selected file
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Files:", files);
    console.log("Parameters:", parameters);
    // Navigate to the next step or process the input
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
        { label: "Resolution", name: "resolution", type: "number", step: "0.1"},
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
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, file.name)}
            className="mt-2 border p-2 rounded w-full"
          />
        </div>
      ))}

      {/* Optional Disturbance Files */}
      {[
        { label: "Fire Disturbance", name: "fire" },
        { label: "Harvest Disturbance", name: "harvest" },
        { label: "Insect Disturbance", name: "insect" },
      ].map((file) => (
        <div className="mb-4" key={file.name}>
          <label className="block font-semibold">{file.label} (Optional):</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, file.name)}
            className="mt-2 border p-2 rounded w-full"
          />
        </div>
      ))}

      <NavLink to="/Simulation/ScriptEditor">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
          Next
        </button>
      </NavLink>
    </div>
  );
}
