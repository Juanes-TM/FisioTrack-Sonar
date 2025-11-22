import { Outlet, Link, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const saved = JSON.parse(localStorage.getItem("fisioUser") || "{}");
  const currentUser = saved.user || {};
  const token = saved.token || localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("fisioUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 1. Sidebar - AHORA FIJA */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col shadow-lg fixed h-full top-0 left-0 z-20">
        <div className="p-4 text-2xl font-semibold border-b border-teal-600">
          FisioTrack
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto"> 
          {/* El overflow-y-auto aquí es opcional, permite scroll SÓLO dentro de la barra si hay muchos links */}

          {/* PACIENTE */}
          {currentUser.rol === "cliente" && (
            <>
              <Link
                to="/dashboard/paciente"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Inicio
              </Link>

              <Link
                to="/dashboard/paciente/reservar"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Reservar cita
              </Link>

              <Link
                to="/dashboard/paciente/citas"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Calendario
              </Link>
            </>
          )}

          {/* FISIO */}
          {currentUser.rol === "fisioterapeuta" && (
            <>
              <Link
                to="/dashboard/fisio"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Panel de Información
              </Link>
              <Link
                to="/dashboard/fisio/disponibilidad"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Disponibilidad
              </Link>
            </>
          )}

          {/* ADMIN */}
          {currentUser.rol === "admin" && (
            <>
              <Link
                to="/dashboard/admin"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Panel del Admin
              </Link>
              <Link
                to="/dashboard/admin/usuarios"
                className="block px-3 py-2 rounded hover:bg-teal-600 transition"
              >
                Gestión de Usuarios
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-teal-600 text-sm text-gray-100">
          {currentUser.nombre && (
            <div className="mb-3 text-center bg-teal-800 rounded-lg py-2 shadow-inner">
              <p className="text-gray-300 text-xs uppercase tracking-wide">
                Sesión activa
              </p>
              <p className="font-semibold text-lg">
                {currentUser.nombre} {currentUser.apellido}
              </p>
              <p className="text-xs italic text-gray-400">
                Rol: {currentUser.rol}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* 2. Contenido principal - AHORA COMPENSA EL MARGEN */}
      <div className="w-64 flex-shrink-0" aria-hidden="true">
        {/* Este div vacío simula el espacio que ocupa el sidebar fijo */}
      </div>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
