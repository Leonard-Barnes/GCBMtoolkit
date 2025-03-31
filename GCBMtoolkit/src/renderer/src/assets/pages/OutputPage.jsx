import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TiffViewer from "../../components/TiffViewer";
import {ArrowLeft} from "lucide-react";

export default function OutputPage() {
  console.log("OutputPage rendered");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupedFiles, setGroupedFiles] = useState({});

  useEffect(() => {
    console.log("Fetching TIFF files...");
    const fetchFiles = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke("get-output-files");
        if (response.success) {
          const fileGroups = {};
          response.files.forEach((file) => {
            const match = file.name.match(/^(.+)_\d{4}\.tif$/);
            if (match) {
              const prefix = match[1];
              if (!fileGroups[prefix]) fileGroups[prefix] = [];
              fileGroups[prefix].push(file.path);
            }
          });
          console.log("Grouped Files:", fileGroups);
          setGroupedFiles(fileGroups);
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

  // Function to open the output folder
  const openOutputFolder = () => {
    window.electron.ipcRenderer.invoke("open-output-folder");
  };

  return (
    <div className="p-6 w-[630px] mx-auto bg-white shadow-lg rounded-lg h-[600px] flex flex-col gap-4">
      {/* Header with Back, Title, and Exit buttons */}
      <div className="flex justify-between items-center">
        <NavLink to="/Simulation/Generate">
          <button className="bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600">
          <ArrowLeft size={20} />
          </button>
        </NavLink>
        <h1 className="text-2xl font-bold">GCBM Output</h1>
        <NavLink to="/Simulation">
          <button className=" text-white px-4 py-2 rounded hover:bg-gray-700">
            ✖
          </button>
        </NavLink>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-md">
        {loading ? (
          <p>Loading output files...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : Object.keys(groupedFiles).length > 0 ? (
          <ul>
            {Object.keys(groupedFiles).map((group) => (
              <li key={group} className="border-b py-1 flex justify-between">
                <span>{group}</span>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setSelectedGroup(groupedFiles[group])}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No TIFF files found.</p>
        )}
      </div>

      {/* TIFF Viewer */}
      <div className="bg-gray-200 rounded-lg flex items-center justify-center min-h-[200px] max-h-[350px]">
        {selectedGroup ? (
          <TiffViewer files={selectedGroup} />
        ) : (
          <p className="text-gray-600">Select a TIFF group to preview.</p>
        )}
      </div>

      {/* Open Folder Button */}
      <button
        onClick={openOutputFolder}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-center mt-2"
      >
        📂 Open Folder
      </button>
    </div>
  );
}
