import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function OutputPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke("get-output-files");
        if (response.success) {
          setFiles(response.files);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError("Failed to fetch files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleOpenFolder = async () => {
    await window.electron.ipcRenderer.invoke("open-output-folder");
  };

  return (
    <div className="p-6 w-[630px] mx-auto bg-white shadow-lg rounded-lg h-[600px] overflow-y-auto mt-4">
      <h1 className="text-2xl font-bold mb-4">GCBM Output</h1>
      <NavLink to="/Simulation">
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-16 mt-4 top-12 right-8 absolute ">
          Exit
        </button>
      </NavLink>

      {loading ? (
        <p>Loading output files...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : files.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Generated Files</h2>
          <button
            onClick={handleOpenFolder}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4"
          >
            Open Output Folder
          </button>
          <ul className="bg-gray-100 p-4 rounded-md">
            {files.map((file, index) => (
              <li key={index} className="border-b py-2 flex justify-between">
                <span>{file.name}</span>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => window.electron.ipcRenderer.invoke("open-folder", file.path)}
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No output files found.</p>
      )}
    </div>
  );
}
