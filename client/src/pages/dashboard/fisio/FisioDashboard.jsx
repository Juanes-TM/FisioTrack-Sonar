import { useState } from "react";
import { useCitas } from "../../../hooks/useCitas";
import { Link } from "react-router-dom";
import { Calendar, Clock, Users, Pencil } from "lucide-react";

// ======================
// COMPONENTE TARJETA CITA
// ======================
const TarjetaCita = ({ cita, formatHora }) => {
  const [expandido, setExpandido] = useState(false);

  const estadoClases = {
    pendiente: "bg-yellow-100 text-yellow-800",
    confirmada: "bg-blue-100 text-blue-800",
    cancelada: "bg-red-100 text-red-800",
    completada: "bg-green-100 text-green-800",
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 transition hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            {formatHora(cita.startAt)} – {formatHora(cita.endAt)}
          </p>
          <p className="text-gray-600 mt-1">
            Paciente:
            <span className="font-bold">
              {" "}
              {cita.paciente?.nombre} {cita.paciente?.apellido}
            </span>
          </p>
          <p className="text-teal-600 text-sm mt-1">Motivo: {cita.motivo}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              estadoClases[cita.estado] || "bg-gray-200 text-gray-700"
            }`}
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

      {expandido && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm space-y-1">
          <p>
            <strong>Fecha:</strong> {formatDate(cita.startAt)}
          </p>
          <p>
            <strong>Email paciente:</strong> {cita.paciente?.email}
          </p>
          {cita.observaciones && (
            <p className="mt-1 p-2 bg-gray-50 border-l-4 border-gray-300 rounded">
              <strong>Notas:</strong> {cita.observaciones}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ========================
// BLOQUE PRÓXIMA CITA
// ========================
function ProximaCitaBanner({ citas }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const citasHoy = citas.filter((c) => {
    const f = new Date(c.startAt);
    f.setHours(0, 0, 0, 0);
    return f.getTime() === hoy.getTime();
  });

  const proxima = citasHoy[0];

  return (
    <div
      className="
        p-6 rounded-2xl shadow-md 
        bg-gradient-to-br from-teal-600 to-teal-700
        text-white relative overflow-hidden
      "
    >
      {/* ICONO DE FONDO */}
      <div className="absolute right-6 top-6 opacity-20 pointer-events-none z-0">
        <Clock size={90} />
      </div>

      {/* TÍTULO */}
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock size={22} className="opacity-90" />
        Próxima cita
      </h3>

      {!proxima ? (
        <p className="text-teal-100 italic">No tienes más citas hoy.</p>
      ) : (
        <div className="flex flex-row justify-between items-start gap-6 z-10 relative">

          {/* COLUMNA IZQUIERDA */}
          <div className="flex-1">
            <p className="text-4xl font-bold tracking-wide">
              {new Date(proxima.startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="mt-2 text-teal-100 text-sm">
              Paciente:
              <span className="font-semibold text-white ml-1">
                {proxima.paciente?.nombre} {proxima.paciente?.apellido}
              </span>
            </p>
          </div>

          {/* COLUMNA DERECHA (DETALLES) */}
          <div
            className="
              bg-white/10 backdrop-blur-md
              p-5 rounded-xl text-sm 
              flex-1 max-w-[60%]
            "
            style={{ marginRight: "170px" , marginTop: "-45px" }} // evita tapar icono
          >
            <p className="font-bold text-white text-lg mb-1">
              Motivo:
              <span className="text-teal-50 font-medium ml-1">
                {proxima.motivo}
              </span>
            </p>

            <div className="mt-1">
              <p className="font-semibold text-white">Observaciones:</p>
              <p className="text-teal-50 ml-1">
                {proxima.observaciones?.trim()
                  ? proxima.observaciones
                  : "No se detallaron observaciones"}
              </p>
            </div>

            <span
              className={`
                inline-block mt-4 px-3 py-1 rounded-full text-xs font-semibold
                ${
                  proxima.estado === "completada"
                    ? "bg-green-500"
                    : proxima.estado === "pendiente"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
                text-white
              `}
            >
              {proxima.estado.charAt(0).toUpperCase() + proxima.estado.slice(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}



// ========================
// NOTAS RÁPIDAS
// ========================
function NotasRapidas() {
  const [texto, setTexto] = useState(
    localStorage.getItem("notasFisio") || ""
  );

  const guardar = (value) => {
    setTexto(value);
    localStorage.setItem("notasFisio", value);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Pencil size={22} className="opacity-90" />
        Notas rápidas
      </h3>

      <textarea
        value={texto}
        onChange={(e) => guardar(e.target.value)}
        placeholder="Escribe recordatorios..."
        className="w-full h-28 p-3 rounded-lg border border-gray-300 
          focus:ring-2 focus:ring-teal-500 outline-none 
          text-gray-700 resize-none shadow-sm"
      />
      <p className="text-xs text-gray-400 mt-1">
        Guardado automático
      </p>
    </div>
  );
}

// ======================
// PANEL PRINCIPAL
// ======================
export default function FisioDashboard() {
  const { citas, loading } = useCitas();
  const [filtro, setFiltro] = useState("hoy");

  if (loading) return <p className="p-6">Cargando panel...</p>;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // FORMATEO
  const formatHora = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // FILTROS
  const citasHoy = citas.filter((c) => {
    const f = new Date(c.startAt);
    f.setHours(0, 0, 0, 0);
    return f.getTime() === hoy.getTime();
  });

  const citasSemana = citas.filter((c) => {
    const f = new Date(c.startAt);
    return f - hoy <= 7 * 24 * 60 * 60 * 1000;
  });

  const citasFiltradas =
    filtro === "hoy"
      ? citasHoy
      : filtro === "semana"
      ? citasSemana
      : citas;

  // =====================
  // DATOS DE PRÓXIMA CITA
  // =====================
  const proxima = citasHoy[0] || null;

  const proximaCitaHora = proxima
    ? formatHora(proxima.startAt)
    : null;

  const proximaCitaNombre = proxima
    ? `${proxima.paciente?.nombre} ${proxima.paciente?.apellido}`
    : "";

  // MÉTRICAS
  const canceladasHoy = citasHoy.filter((c) => c.estado === "cancelada").length;

  const proximaCita = proximaCitaHora
    ? `${proximaCitaHora} – ${proximaCitaNombre}`
    : "No hay citas hoy";

  const historial = [...citas]
    .filter((c) => ["completada", "cancelada"].includes(c.estado))
    .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));

  return (
    <div className="p-6 space-y-10">
      {/* Próxima cita + Notas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProximaCitaBanner citas={citas} />
        <NotasRapidas />
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ResumenCard title="Citas Hoy" value={citasHoy.length} icon={<Calendar size={28} />} />
        <ResumenCard title="Canceladas Hoy" value={canceladasHoy} icon={<Clock size={28} />} />
        <ResumenCard title="Citas Semana" value={citasSemana.length} icon={<Calendar size={28} />} />
        <ResumenCard title="Próxima Cita" value={proximaCita} icon={<Users size={28} />} />
      </div>

      {/* Agenda del día */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Agenda del día</h2>

        {citasHoy.length === 0 ? (
          <p className="text-gray-500 italic">No tienes citas hoy.</p>
        ) : (
          <div className="space-y-3">
            {citasHoy.map((c) => {
              console.log("CITA COMPLETA →", c);   // 👈 AÑADIR AQUÍ
              return (
                <TarjetaCita key={c._id} cita={c} formatHora={formatHora} />
              );
            })}
          </div>
        )}
      </section>

      {/* Citas Programadas */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Citas Programadas
        </h2>

        <div className="flex gap-2 mb-5">
          {["hoy", "semana", "todas"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-1 rounded-md font-medium ${
                filtro === f
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f === "hoy" && "Hoy"}
              {f === "semana" && "Esta semana"}
              {f === "todas" && "Todas"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {citasFiltradas.length === 0 ? (
            <p className="text-gray-500 italic">
              No tienes citas para este periodo.
            </p>
          ) : (
            citasFiltradas.map((c) => (
              <TarjetaCita key={c._id} cita={c} formatHora={formatHora} />
            ))
          )}
        </div>
      </section>

      {/* Historial */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Citas</h2>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="max-h-[450px] overflow-y-auto pr-4">
            <div className="relative pl-8 border-l-2 border-gray-300 space-y-6">
              {historial.length === 0 ? (
                <p className="text-gray-500 italic">No hay citas en el historial.</p>
              ) : (
                historial.map((cita) => {
                  const fecha = new Date(cita.startAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  const estado = cita.estado;
                  const colores = {
                    completada: "bg-green-500",
                    cancelada: "bg-red-500",
                  };

                  return (
                    <div key={cita._id} className="relative">
                      <div
                        className={`
                          absolute -left-[13px] top-1 w-6 h-6 rounded-full border-4 border-white shadow 
                          ${colores[estado] || "bg-gray-400"}
                        `}
                      />

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {fecha}
                          </span>

                          <span
                            className={`
                              text-xs font-semibold px-2 py-1 rounded-full text-white 
                              ${estado === "completada" ? "bg-green-500" : "bg-red-500"}
                            `}
                          >
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </span>
                        </div>

                        <p className="font-medium text-gray-700">
                          Paciente: {cita.paciente?.nombre} {cita.paciente?.apellido}
                        </p>

                        <p className="text-sm text-gray-600">
                          Motivo: {cita.motivo}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {historial.length > 10 && (
            <p className="mt-4 text-xs text-gray-400 italic text-center">
              El historial completo se muestra en formato línea de tiempo.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

// ======================
// TARJETA DE RESUMEN
// ======================
function ResumenCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 shadow rounded-xl border flex items-center gap-4">
      <div className="p-3 bg-teal-100 rounded-lg text-teal-700">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
