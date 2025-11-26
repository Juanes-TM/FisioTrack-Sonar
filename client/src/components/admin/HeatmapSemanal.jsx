// client/src/components/admin/HeatmapSemanal.jsx
import React from "react";

export default function HeatmapSemanal({ data }) {

  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];

  // Para calcular intensidades normalizadas
  const maxValue = Math.max(...data.flat().map((c) => c.count), 1);

  const getColor = (value) => {
    if (value === 0) return "bg-gray-100";
    const intensity = value / maxValue;

    if (intensity < 0.25) return "bg-teal-100";
    if (intensity < 0.5) return "bg-teal-300";
    if (intensity < 0.75) return "bg-teal-500 text-white";
    return "bg-teal-700 text-white";
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Heatmap Semanal</h2>
      <p className="text-gray-500 text-sm mb-4">
        Intensidad de citas por día y hora.
      </p>

      {/* Cabecera de días */}
      <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-1 text-center text-xs font-semibold text-gray-600">
        <div></div>
        {dias.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Heatmap de horas */}
      <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-1 mt-2 overflow-y-auto">
        {data.map((fila, hora) => (
          <React.Fragment key={hora}>
            {/* Columna con la hora */}
            <div className="text-xs text-gray-500 flex items-center justify-center">
              {String(hora + 8).padStart(2, "0")}:00
            </div>

            {/* Celdas de días */}
            {fila.map((celda, dia) => (
              <div
                key={dia}
                className={`h-6 rounded ${getColor(celda.count)} text-[11px] flex items-center justify-center font-semibold`}
                title={`${dias[dia]} ${String(hora + 8).padStart(2, "0")}:00 — ${celda.count} citas`}

              >
                {celda.count > 0 ? celda.count : ""}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
