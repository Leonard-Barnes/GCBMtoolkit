import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-1/4 h-screen bg-green-800 text-white">
      <div className="p-4 text-xl font-bold">GCBM</div>
      <div className="space-y-4 p-4">
        <NavLink
          to="/"
          className="cursor-pointer p-2 rounded-md"
          activeClassName="bg-green-700"
          exact
        >
          Home
        </NavLink>
        <NavLink
          to="/page-one"
          className="cursor-pointer p-2 rounded-md border"
          activeClassName="bg-green-700"
        >
          Simulation
        </NavLink>
        <NavLink
          to="/page-two"
          className="cursor-pointer p-2 rounded-md"
          activeClassName="bg-green-700"
        >
          Script Editor
        </NavLink>
        <NavLink
          to="/page-three"
          className="cursor-pointer p-2 rounded-md"
          activeClassName="bg-green-700"
        >
          EXtra
        </NavLink>
      </div>
    </div>
  );
}
