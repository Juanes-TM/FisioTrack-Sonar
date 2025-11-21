import { useState } from "react";
import { useCitas } from "../../../hooks/useCitas";
import { Link } from "react-router-dom"; 

// Componente TarjetaCita para manejar el desplegable de detalles
const TarjetaCita = ({ cita, formatHora }) => {
  const [expandido, setExpandido] = useState(false);
  const estadoClases = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmada: "bg-blue-100 text-blue-800",
    cancelada: "bg-red-100 text-red-800",
    completada: "bg-green-100 text-green-800",
  };

  // Convertir ISO Date a formato DD/MM/AAAA
  const formatDate = (fechaISO) => {
    const date = new Date(fechaISO);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        {/* Información Principal de la Cita */}
        <div>
          <div className="text-xl font-bold text-gray-800">
            {formatHora(cita.startAt)} - {formatHora(cita.endAt)}
          </div>
          <p className="text-gray-600 font-medium mt-1">
            Paciente: <span className="font-bold">{cita.paciente?.nombre} {cita.paciente?.apellido}</span>
          </p>
          <p className="text-teal-600 text-sm mt-1">
            Motivo: <span>{cita.motivo}</span>
          </p>
        </div>

        {/* Estado y Botón de Despliegue */}
        <div className="flex flex-col items-end gap-2">
          <span 
            className={`px-3 py-1 text-xs font-semibold rounded-full ${estadoClases[cita.estado] || 'bg-gray-100 text-gray-800'}`}
          >
            {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
          </span>
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-sm text-teal-500 hover:text-teal-700 font-medium"
          >
            {expandido ? "Ver menos" : "Ver más"}
          </button>
        </div>
      </div>

      {/* Detalles Desplegables */}
      {expandido && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2">
          <p>
            <span className="font-bold">Fecha:</span> {formatDate(cita.startAt)}
          </p>
          {/* Se elimina el campo Duración */}
          <p>
            <span className="font-bold">Email paciente:</span> {cita.paciente?.email}
          </p>
          {cita.observaciones && (
             <p className="bg-gray-50 p-2 rounded italic text-gray-700 border-l-4 border-gray-300">
                <span className="font-bold">Notas:</span> {cita.observaciones}
            </p>
          )}
        </div>
      )}
    </div>
  );
};


// Componente principal del Dashboard
export default function FisioDashboard() {
  // CAMBIO SOLICITADO: Inicializar el filtro en "todas"
  const INITIAL_FILTER = "todas"; 
  
  const { citas, loading } = useCitas();
  const [filtro, setFiltro] = useState(INITIAL_FILTER); // 'hoy', 'semana', 'todas'

  // Lógica de filtrado de fechas
  const getCitasFiltradas = () => {
    if (!citas) return [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return citas.filter((cita) => {
      const fechaCita = new Date(cita.startAt);
      const fechaCitaNorm = new Date(fechaCita);
      fechaCitaNorm.setHours(0, 0, 0, 0);

      if (filtro === "hoy") {
        return fechaCitaNorm.getTime() === hoy.getTime();
      }
      if (filtro === "semana") {
        const finSemana = new Date(hoy);
        finSemana.setDate(hoy.getDate() + 7);
        return fechaCitaNorm >= hoy && fechaCitaNorm <= finSemana;
      }
      return true; // 'todas'
    });
  };

  // Lógica de historial: citas completadas o canceladas y ordenadas inversamente
  const getHistorialCitas = () => {
    return citas
        .filter(c => ['completada', 'cancelada'].includes(c.estado))
        .sort((a, b) => new Date(b.startAt) - new Date(a.startAt)); // Más recientes primero
  };

  // Helper para formateo
  const formatHora = (fechaISO) => {
    const date = new Date(fechaISO);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Estilos de botón activo/inactivo
  const btnClass = (tipo) => 
    `px-4 py-1 rounded-md text-sm font-medium transition-colors ${
      filtro === tipo 
        ? "bg-teal-500 text-white" 
        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
    }`;

  if (loading) return <div className="p-6">Cargando panel...</div>;

  const citasProgramadas = getCitasFiltradas();
  const historialCitas = getHistorialCitas();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabecera y Perfil */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          {/* CAMBIO SOLICITADO: Título grande */}
          <h1 className="text-2xl font-bold text-gray-800">Panel de Información</h1> 
          {/* CAMBIO SOLICITADO: Quitar texto de subtítulo */}
        </div>
        
        {/* Perfil Reubicado en la esquina derecha */}
        <Link
          to="/profile"
          className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 text-sm font-semibold shadow-sm"
        >
          Ver Perfil
        </Link>
      </div>

      {/* CONTENIDO PRINCIPAL: Citas Programadas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Citas Programadas</h2>
        
        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setFiltro("hoy")} className={btnClass("hoy")}>Hoy</button>
          <button onClick={() => setFiltro("semana")} className={btnClass("semana")}>Esta semana</button>
          <button onClick={() => setFiltro("todas")} className={btnClass("todas")}>Todas</button>
        </div>
        
        <div className="space-y-4">
          {citasProgramadas.length === 0 ? (
            <p className="text-gray-500 italic">No tienes citas programadas para este periodo.</p>
          ) : (
            citasProgramadas.map((cita) => (
              <TarjetaCita 
                key={cita._id} 
                cita={cita} 
                formatHora={formatHora} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* --- SEPARADOR --- */}
      <hr className="border-t border-gray-300 my-8" />
      {/* --- SEPARADOR --- */}

      {/* SECCIÓN DE ABAJO: Historial de Citas */}
      <div>
        {/* CAMBIO SOLICITADO: Quitar texto entre paréntesis */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Citas</h2>
        
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
          {historialCitas.length === 0 ? (
            <p className="text-gray-500 italic">No hay citas en el historial.</p>
          ) : (
            historialCitas.slice(0, 10).map((cita) => (
              <div key={cita._id} className="p-2 border-b last:border-b-0">
                <p className="font-medium text-gray-800">
                  <span className="text-sm text-gray-500 mr-2">
                    {new Date(cita.startAt).toLocaleDateString('es-ES')}
                  </span>
                  - Paciente: <span className="font-bold">{cita.paciente?.nombre} {cita.paciente?.apellido}</span>
                </p>
                <p className="text-sm text-gray-600 ml-8">Motivo: {cita.motivo}</p>
                
                {/* Visualización ampliada de estado en historial */}
                <span 
                    className={`ml-8 px-2 py-0.5 text-xs font-semibold rounded ${cita.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                    {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>
        
        {historialCitas.length > 10 && (
            <p className="mt-4 text-sm text-gray-500 italic">Mostrando las últimas 10 citas del historial.</p>
        )}
      </div>
    </div>
  );
}
