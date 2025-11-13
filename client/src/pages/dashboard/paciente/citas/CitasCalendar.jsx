import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import { useFisioterapeutas } from "../../../../hooks/useFisioterapeutas";
import EditarCitaModal from "./EditarCitaModal";
import CrearCitaModal from "./CrearCitaModal";

// ----------------------
// Helpers
// ----------------------
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateISO(d) {
  return d.toISOString().split("T")[0];
}

function formatHour(hourInt) {
  return `${hourInt.toString().padStart(2, "0")}:00`;
}

export default function CitasCalendar({ modo }) {
  // Semana actual
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

  // DATA
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);

  const { fisios, loading: loadingFisios } = useFisioterapeutas();
  const [selectedFisioId, setSelectedFisioId] = useState("mis-citas");
  const [selectedFisioNombre, setSelectedFisioNombre] = useState("");

  // Modales
  const [modalEditar, setModalEditar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  // UI
  const [mensajeError, setMensajeError] = useState("");

  // Horas 8 - 19
  const hours = useMemo(() => [...Array(12)].map((_, i) => 8 + i), []);

  // Días semana
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // ----------------------
  // Fetch citas (solo paciente)
  // ----------------------
  const fetchCitasPaciente = async () => {
    try {
      setLoadingCitas(true);
      const res = await api.get("/api/citas");
      setCitas(res.data);
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setLoadingCitas(false);
    }
  };

  useEffect(() => {
    fetchCitasPaciente();
  }, []);

  // ----------------------
  // Filtrado
  // ----------------------
  const citasVisibles = useMemo(() => {
    if (selectedFisioId === "mis-citas") return citas;
    return citas.filter((c) => c.fisioterapeuta._id === selectedFisioId);
  }, [citas, selectedFisioId]);

  const citasEnCelda = (dayDate, hourInt) => {
    const startStr = formatDateISO(dayDate);
    return citasVisibles.filter((c) => {
      const start = new Date(c.startAt);
      return (
        formatDateISO(start) === startStr && start.getHours() === hourInt
      );
    });
  };

  // ----------------------
  // Crear cita
  // ----------------------
  const handleClickCelda = (dayDate, hourInt) => {
    setMensajeError("");

    if (modo !== "paciente") return;

    const enCelda = citasEnCelda(dayDate, hourInt);
    if (enCelda.length > 0) {
      setMensajeError("Ya existe una cita en este horario.");
      return;
    }

    if (!selectedFisioId || selectedFisioId === "mis-citas") {
      setMensajeError("Selecciona un fisioterapeuta antes de reservar.");
      return;
    }

    const f = fisios.find((x) => x._id === selectedFisioId);

    setSlotSeleccionado({
      fecha: formatDateISO(dayDate),
      hora: formatHour(hourInt),
      fisioterapeutaId: selectedFisioId,
      fisioterapeutaNombre: f ? `${f.nombre} ${f.apellido}` : "",
    });

    setModalCrear(true);
  };

  const onCitaCreada = (nueva) => {
    if (nueva.cita) setCitas((prev) => [...prev, nueva.cita]);
  };

  const onCitaCancelada = (id) => {
    setCitas((prev) => prev.filter((c) => c._id !== id));
  };

  // ----------------------
  // Estilos Compactos Modernos
  // ----------------------
  const styles = {
    grid: "grid text-xs",

    dayHeader:
      "px-3 py-3 text-center font-semibold text-gray-800 border-b border-gray-200 " +
      "bg-gradient-to-b from-white to-gray-100 shadow-sm rounded-t-md",

    dayToday:
      "bg-teal-50 text-teal-700 font-bold shadow-inner border-b border-teal-200",

    hourCell:
      "px-2 py-1 text-right border-r border-gray-100 text-[11px] font-medium text-gray-500",

    hourBadge:
      "inline-block bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-semibold",

    cellBase:
      "border border-gray-100 h-14 relative cursor-pointer transition",

    cellHover:
      "hover:bg-gray-100/60",

    cellAltBackground:
      "bg-gray-50/40",

    evento:
      "absolute inset-1 rounded-md p-1 text-[11px] text-white shadow-md overflow-hidden group",

    tooltip:
      "absolute z-50 hidden group-hover:block bg-black/80 text-white text-[10px] rounded px-2 py-1 " +
      "shadow-xl -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
  };

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Título */}
      <h2 className="text-2xl font-semibold text-teal-700 mb-2">Mis Citas</h2>
      <p className="text-gray-600 text-sm mb-6">
        Semana del {formatDateISO(days[0])} al {formatDateISO(days[6])}
      </p>

      {/* Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mostrar citas de:
        </label>

        <select
          value={selectedFisioId}
          onChange={(e) => setSelectedFisioId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500"
        >
          <option value="mis-citas">Mis citas</option>

          {!loadingFisios &&
            fisios.map((f) => (
              <option key={f._id} value={f._id}>
                {f.nombre} {f.apellido}
              </option>
            ))}
        </select>
      </div>

      {mensajeError && (
        <div className="mb-4 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
          {mensajeError}
        </div>
      )}

      {/* CALENDARIO */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>

          {/* Header vacío izquierda */}
          <div />

          {/* Headers de días */}
          {days.map((d, idx) => {
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div
                key={idx}
                className={`${styles.dayHeader} ${isToday ? styles.dayToday : ""}`}
              >
                {d.toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            );
          })}

          {/* Horas + Celdas */}
          {hours.map((h) => (
            <div key={h} className="contents">

              {/* Hora */}
              <div className={styles.hourCell}>
                <span className={styles.hourBadge}>{formatHour(h)}</span>
              </div>

              {/* Celdas */}
              {days.map((d, idx) => {
                const celdaCitas = citasEnCelda(d, h);
                return (
                  <div
                    key={idx}
                    className={`
                      ${styles.cellBase}
                      ${styles.cellHover}
                      ${h % 2 === 0 ? styles.cellAltBackground : ""}
                    `}
                    onClick={() => handleClickCelda(d, h)}
                  >
                    {!loadingCitas &&
                      celdaCitas.map((c) => (
                        <div
                          key={c._id}
                          className={`
                            ${styles.evento}
                            ${
                              c.estado === "cancelada"
                                ? "bg-gray-400"
                                : c.estado === "confirmada"
                                ? "bg-teal-600"
                                : c.estado === "completada"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalEditar(c);
                          }}
                        >
                          {c.motivo}

                          <div className={styles.tooltip}>
                            <div className="font-semibold">
                              {c.paciente.nombre} {c.paciente.apellido}
                            </div>
                            <div className="opacity-80">{c.motivo}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* MODALES */}
      {modalEditar && (
        <EditarCitaModal
          visible={true}
          cita={modalEditar}
          onClose={() => setModalEditar(null)}
          onCancelada={onCitaCancelada}
        />
      )}

      {modalCrear && (
        <CrearCitaModal
          visible={true}
          onClose={() => setModalCrear(false)}
          slot={slotSeleccionado}
          onCreated={onCitaCreada}
        />
      )}
    </div>
  );
}
