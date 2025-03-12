import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Save } from "lucide-react";

export default function ScriptEditor() {
  const [scriptContent, setScriptContent] = useState("");
  const [showCheckMark, setShowCheckMark] = useState(false);

  // Load the script when the component mounts
  useEffect(() => {
    window.electron.ipcRenderer.invoke("load-script").then(setScriptContent);
  }, [])

  // Save script content back to file
  const handleSave = () => {
    window.electron.ipcRenderer.send("save-script", scriptContent);
    setShowCheckMark(true);
    setTimeout(() => {
      setShowCheckMark(false);
    }, 2000);
  }

  const handleOpenInDefaultEditor = () => {
    window.electron.ipcRenderer.invoke('open-in-default-editor')
      .then(() => {
        console.log("File opened in default editor.")
      })
      .catch((error) => {
        console.error("Error opening file:", error)
      })
  }

  return (
    <div className="p-4 bg-gray-700 text-white rounded-lg mt-4 mr-4 h-[600px] flex flex-col">
      <h1 className="text-xl font-bold mb-4">Edit Config File </h1>
      <textarea
        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
        value={scriptContent}
        onChange={(e) => setScriptContent(e.target.value)}
      />
      <div className="flex justify-center">
        <button className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md mt-3 hover:bg-gray-500 transition" onClick={handleSave}>
          Save
        </button>

        {showCheckMark && (
        <div className="absolute top-14 right-6 p-2 bg-green-500 text-white rounded-full">
          <Save size={20} />
        </div>
        )}

        <div className="p-4"></div>
        <button className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md mt-3 hover:bg-gray-500 transition" onClick={handleOpenInDefaultEditor}>
          Open In...
        </button>
        <div className="p-4"></div>
        <NavLink to="/Simulation/Generate">
          <button className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md mt-3 hover:bg-gray-500 transition" onClick={handleSave}>
            Submit
          </button>
        </NavLink>
      </div>
    </div>
  );
}
