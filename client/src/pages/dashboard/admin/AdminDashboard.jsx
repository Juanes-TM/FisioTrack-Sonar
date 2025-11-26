import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useSelector } from "react-redux";
import EventosTimeline from "../../../components/admin/EventosTimeline";


export default function AdminDashboard() {
  const { user } = useSelector((state) => state.user);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fechaActualizacion, setFechaActualizacion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setMensaje("");

      // El token ahora se inyecta automáticamente por api.js
      const res = await api.get("/api/admin/stats");

      setStats(res.data);
      setFechaActualizacion(new Date().toLocaleString());
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
      setMensaje("Error al cargar estadísticas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventos = async () => {                        // NUEVO
    try {
      setLoadingEventos(true);
      const res = await api.get("/api/admin/eventos-recientes");
      setEventos(res.data || []);
    } catch (err) {
      console.error("Error al obtener eventos recientes:", err);
    } finally {
      setLoadingEventos(false);
    }
  };


  useEffect(() => {
    fetchStats();
    fetchEventos();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Panel del Administrador
      </h1>

      <p className="text-gray-600 mb-6">
        Desde aquí puedes gestionar usuarios y supervisar la actividad general del sistema.
      </p>

      {mensaje && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 shadow">
          {mensaje}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <p className="text-sm text-gray-500">
          Última actualización: {fechaActualizacion || "Cargando..."}
        </p>

        <button
          onClick={fetchStats}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm transition shadow-sm"
        >
          Actualizar estadísticas
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm uppercase font-semibold opacity-80">Usuarios Totales</h2>
            <p className="text-4xl font-bold mt-2">{stats?.totalUsuarios ?? "-"}</p>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm uppercase font-semibold opacity-80">Fisioterapeutas</h2>
            <p className="text-4xl font-bold mt-2">{stats?.totalFisio ?? "-"}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm uppercase font-semibold opacity-80">Clientes</h2>
            <p className="text-4xl font-bold mt-2">{stats?.totalClientes ?? "-"}</p>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm uppercase font-semibold opacity-80">Administradores</h2>
            <p className="text-4xl font-bold mt-2">{stats?.totalAdmins ?? "-"}</p>
          </div>

        </div>
      )}
  

      
      {/* Sección de eventos recientes */}   {/* NUEVO */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Eventos recientes</h2>

        {loadingEventos ? (
          <p className="text-gray-500">Cargando eventos...</p>
        ) : (
          <EventosTimeline eventos={eventos} />
        )}
      </div>




      <div className="mt-10">
        <a
          href="/dashboard/admin/usuarios"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-3 rounded-lg shadow transition"
        >
          Ir a gestión de usuarios
        </a>
      </div>
    </div>
  );
}
