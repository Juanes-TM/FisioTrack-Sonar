import { Home, Calendar, Users, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: "Inicio" },
    { icon: <Calendar size={20} />, label: "Citas" },
    { icon: <Users size={20} />, label: "Pacientes" },
  ];

  const { user } = useSelector((state) => state.user);

  return (
    <aside className="w-60 bg-teal-600 text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">FisioTrack</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 hover:bg-teal-700 p-2 rounded-md cursor-pointer">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Home size={20} />
              <span>Inicio</span>
            </Link>
          </li>

          <li className="flex items-center gap-3 hover:bg-teal-700 p-2 rounded-md cursor-pointer">
            <Link to="/dashboard/paciente/citas" className="flex items-center gap-3">
              <Calendar size={20} />
              <span>Citas</span>
            </Link>
          </li>

          <li className="flex items-center gap-3 hover:bg-teal-700 p-2 rounded-md cursor-pointer">
            <Link to="/dashboard/fisio/pacientes" className="flex items-center gap-3">
              <Users size={20} />
              <span>Pacientes</span>
            </Link>
          </li>

          {/* Solo visible para admins */}
          {user?.rol === "admin" && (
            <li className="flex items-center gap-3 hover:bg-teal-700 p-2 rounded-md cursor-pointer">
              <Link to="/dashboard/admin" className="flex items-center gap-3">
                <Users size={20} />
                <span>Administración</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <button className="flex items-center gap-3 text-sm hover:bg-teal-700 p-2 rounded-md">
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
