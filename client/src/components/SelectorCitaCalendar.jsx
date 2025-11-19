import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Toast from "./Toast";

// Helpers
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

function formatHour(h) {
  return `${h.toString().padStart(2, "0")}:00`;
}

export default function SelectorCitaCalendar({ fisioId, onSlotSelected }) {
  const [weekStart] = useState(() => startOfWeek(new Date()));
  const [loading, setLoading] = useState(false);
  const [semana, setSemana] = useState(null);
  const [citasOcupadas, setCitasOcupadas] = useState([]);
  const [toast, setToast] = useState("");

  const hours = [...Array(12)].map((_, i) => 8 + i);

  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // ======================================================
  // 1) Cargar disponibilidad + citas
  // ======================================================
  async function cargarTodo() {
    try {
      setLoading(true);

      const res = await api.get(`/api/disponibilidad/semana/${fisioId}`);
      const data = res.data || {};
      data.dias = Array.isArray(data.dias) ? data.dias : [];
      setSemana(data);

      const citas = await api.get("/api/citas", { params: { fisioId } });
      setCitasOcupadas(Array.isArray(citas.data) ? citas.data : []);
    } catch (err) {
      console.error(err);
      setSemana({ dias: [] });
      setCitasOcupadas([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!fisioId) return;
    cargarTodo();
  }, [fisioId]);

  // ======================================================
  // 2) Recargar citas después de reservar
  // ======================================================
  async function recargarCitas() {
    try {
      const citas = await api.get("/api/citas", { params: { fisioId } });
      setCitasOcupadas(Array.isArray(citas.data) ? citas.data : []);
    } catch (err) {
      console.error("Error recargando citas:", err);
    }
  }

  // ======================================================
  // 3) Lógica de disponibilidad
  // ======================================================
  const estaDisponible = (day, hour) => {
    if (!semana) return false;

    const nombre = day.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();

    const dia = semana.dias.find((d) => d.nombre === nombre);
    if (!dia) return false;

    const hInicio = formatHour(hour);
    const hFin = formatHour(hour + 1);

    return dia.horas.some((b) => hInicio >= b.inicio && hFin <= b.fin);
  };

  const celdaOcupada = (day, hour) => {
    const dateStr = formatDateISO(day);

    return citasOcupadas.some((c) => {
      const s = new Date(c.startAt);
      return (
        formatDateISO(s) === dateStr &&
        s.getHours() === hour &&
        c.estado !== "cancelada"
      );
    });
  };

  // ======================================================
  // 4) Click en celda → reservar
  // ======================================================
  const handleClick = async (day, hour) => {
    if (!estaDisponible(day, hour)) return;
    if (celdaOcupada(day, hour)) return;

    const slot = {
      fecha: formatDateISO(day),
      hora: formatHour(hour),
      startAt: new Date(day.setHours(hour, 0, 0, 0))
    };

    await onSlotSelected(slot);
    setToast("Cita reservada correctamente");

    // recargar citas ocupadas
    recargarCitas();

    setTimeout(() => setToast(""), 2500);
  };

  // ======================================================
  // Estilos copiados del calendario original
  // ======================================================
  const styles = {
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

    cellHover: "hover:bg-gray-100/60",
    cellAlt: "bg-gray-50/40",
    celdaDisponible: "bg-teal-100 hover:bg-teal-200",
    celdaOcupada: "bg-red-300 cursor-not-allowed"
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">

      {toast && <Toast msg={toast} />}

      <h3 className="text-xl font-semibold text-teal-700 mb-4">
        Horarios disponibles
      </h3>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}

      {!loading && semana?.dias?.length === 0 && (
        <p className="text-sm text-gray-500">No hay disponibilidad.</p>
      )}

      {semana && semana.dias.length > 0 && (
        <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
          <div />

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
                  month: "short"
                })}
              </div>
            );
          })}

          {hours.map((h) => (
            <div key={h} className="contents">

              <div className={styles.hourCell}>
                <span className={styles.hourBadge}>{formatHour(h)}</span>
              </div>

              {days.map((d, idx) => {
                const disponible = estaDisponible(d, h);
                const ocupado = celdaOcupada(d, h);

                return (
                  <div
                    key={idx}
                    onClick={() => handleClick(new Date(d), h)}
                    className={`
                      ${styles.cellBase}
                      ${styles.cellHover}
                      ${h % 2 === 0 ? styles.cellAlt : ""}
                      ${ocupado ? styles.celdaOcupada : ""}
                      ${!ocupado && disponible ? styles.celdaDisponible : ""}
                      ${!disponible && !ocupado ? "bg-gray-200 cursor-not-allowed" : ""}
                    `}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
