import { Home, BarChart, CheckCircle, FileEdit, PlayCircle, FileText, ArrowDown, Settings, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-54 h-5/6 bg-gray-700 rounded-3xl text-white shadow-lg flex flex-col">
      {/* Home */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center space-x-3 p-6 rounded-t-3xl rounded-lg transition text-xl ${
            isActive ? "bg-gray-600" : "hover:bg-gray-600"
          }`
        }
      >
        <Home size={20} />
        <span>GCBM Home</span>
      </NavLink>

      {/* Simulation */}
      <NavLink
        to="/Simulation"
        className={({ isActive }) =>
          `flex items-center space-x-3 p-3 rounded-lg transition ${
            isActive ? "bg-gray-600" : "hover:bg-gray-600"
          }`
        }
      >
        <BarChart size={20} />
        <span>Simulation</span>
      </NavLink>

      {/* Steps Flow  */}
      <div className="w-52 top-44 ml-2 h-[307px] absolute bg-transparent "></div>
      <div className="mt-2 mb-1  space-y-1 pl-6 border-l-8 border-gray-500">
        {/* Step 1: Setup */}
        <NavLink
          to="/Simulation/Setup"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition ${
              isActive ? "bg-gray-600" : "hover:bg-gray-600"
            }`
          }
        >
          <CheckCircle size={18} />
          <span>Setup</span>
        </NavLink>

        <div className="flex items-center text-gray-400 pl-3">
          <ArrowDown size={16} />
        </div>

        {/* Step 2: Tile Selection */}
        <NavLink
          to="/Simulation/TileSelection"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition ${
              isActive ? "bg-gray-600" : "hover:bg-gray-600"
            }`
          }
        >
          <BarChart size={18} />
          <span className="text-white">Tile Selection</span>
        </NavLink>

        <div className="flex items-center text-gray-400 pl-3">
          <ArrowDown size={16} />
        </div>

        {/* Script Editor */}
        <NavLink
          to="/Simulation/ScriptEditor"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition ${
              isActive ? "bg-gray-600" : "hover:bg-gray-600"
            }`
          }
        >
          <FileEdit size={18} />
          <span>Script Editor</span>
        </NavLink>

        <div className="flex items-center text-gray-400 pl-3">
          <ArrowDown size={16} />
        </div>

        {/* Generate */}
        <NavLink
          to="/Simulation/Generate"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition ${
              isActive ? "bg-gray-600" : "hover:bg-gray-600"
            }`
          }
        >
          <PlayCircle size={18} />
          <span>Generate</span>
        </NavLink>

        <div className="flex items-center text-gray-400 pl-3">
          <ArrowDown size={16} />
        </div>

        {/* Output */}
        <NavLink
          to="/Simulation/Output"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 pb-3 rounded-lg transition ${
              isActive ? "bg-gray-600" : "hover:bg-gray-600"
            }`
          }
        >
          <FileText size={18} />
          <span>Output</span>
        </NavLink>
      </div>

      {/* FAQ */}
      <NavLink
        to="/FAQ"
        className={({ isActive }) =>
          `flex items-center space-x-3 p-3 rounded-lg transition ${
            isActive ? "bg-gray-600" : "hover:bg-gray-600"
          }`
        }
      >
        <HelpCircle size={20} />
        <span>FAQ</span>
      </NavLink>

      {/* Settings */}
      <NavLink
        to="/Settings"
        className={({ isActive }) =>
          `flex items-center space-x-3 p-3 rounded-b-3xl rounded-lg transition ${
            isActive ? "bg-gray-600" : "hover:bg-gray-600"
          }`
        }
      >
        <Settings size={20} />
        <span>Settings</span>
      </NavLink>
    </div>
  );
}
