// client/src/components/admin/EventosTimeline.jsx
import { useState, useMemo } from "react";
import {
  CalendarIcon,
  PencilSquareIcon,
  XCircleIcon,
  UserPlusIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  { key: "all", label: "Todos" },
  { key: "cita", label: "Citas" },
  { key: "disponibilidad", label: "Disponibilidad" },
  { key: "usuario", label: "Usuarios" },
];

const ICONS = {
  cita_creada: <CalendarIcon className="w-6 h-6 text-green-500" />,
  cita_editada: <PencilSquareIcon className="w-6 h-6 text-blue-500" />,
  cita_cancelada: <XCircleIcon className="w-6 h-6 text-red-500" />,
  disponibilidad_modificada: <ClockIcon className="w-6 h-6 text-amber-500" />,
  usuario_registrado: <UserPlusIcon className="w-6 h-6 text-teal-500" />,
};

// Helpers para agrupar fechas
function formatearBloque(fecha) {
  const hoy = new Date();
  const f = new Date(fecha);

  const diff = (hoy - f) / (1000 * 60 * 60 * 24);

  if (diff < 1) return "Hoy";
  if (diff < 2) return "Ayer";
  if (diff < 7) return "Esta semana";
  return f.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });
}

export default function EventosTimeline({ eventos }) {
  const [tab, setTab] = useState("all");

  const filtrados = useMemo(() => {
    return eventos.filter((ev) => {
      if (tab === "all") return true;
      if (tab === "cita") return ev.tipo.includes("cita");
      if (tab === "disponibilidad") return ev.tipo.includes("disponibilidad");
      if (tab === "usuario") return ev.tipo.includes("usuario");
      return true;
    });
  }, [tab, eventos]);

  // Agrupa por fecha usando formatearBloque
  const agrupados = useMemo(() => {
    const map = {};
    filtrados.forEach((ev) => {
      const grupo = formatearBloque(ev.fecha);
      if (!map[grupo]) map[grupo] = [];
      map[grupo].push(ev);
    });
    return map;
  }, [filtrados]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              tab === t.key
                ? "bg-teal-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Timeline con scroll */}
      <div className="custom-scrollbar max-h-[420px] overflow-y-auto pr-2">

        {Object.keys(agrupados).map((grupo) => (
          <div key={grupo} className="relative pl-8 mb-8">

            {/* Título del grupo */}
            <h3 className="text-gray-700 font-bold mb-4 text-sm uppercase tracking-wide">
              {grupo}
            </h3>

            {/* Línea vertical */}
            <div className="absolute top-0 left-3 w-1 bg-gray-200 h-full rounded-full"></div>

            {/* Eventos */}
            {agrupados[grupo].map((ev, idx) => (
              <div
                key={idx}
                className="relative flex items-start gap-4 mb-5 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow transition-transform hover:-translate-y-0.5 border border-gray-100"
              >
                {/* Icono */}
                <div className="absolute -left-6 bg-white p-2 rounded-full shadow border">
                  {ICONS[ev.tipo] ?? <CalendarIcon className="w-6 h-6 text-gray-400" />}
                </div>

                {/* Contenido */}
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">{ev.descripcion}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ev.fecha).toLocaleString("es-ES")}
                  </p>

                  {ev.detalles && (
                    <p className="text-xs mt-2 bg-white p-2 rounded border text-gray-600">
                      {ev.detalles}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {filtrados.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No hay eventos en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
}
