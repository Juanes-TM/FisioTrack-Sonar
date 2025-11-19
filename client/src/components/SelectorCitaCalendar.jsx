// client/src/components/SelectorCitaCalendar.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

// ----------------------
// Helpers
// ----------------------
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=domingo ... 6=sábado
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

// Mapeo fijo para evitar líos con locales / acentos
const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado"
];

// ----------------------
// COMPONENTE
// ----------------------
export default function SelectorCitaCalendar({ fisioId, onSlotSelected }) {
  const [weekStart] = useState(() => startOfWeek(new Date()));
  const [loading, setLoading] = useState(false);

  const [semana, setSemana] = useState(null);       // { fisio, dias: [...] }
  const [citasOcupadas, setCitasOcupadas] = useState([]); // citas DEL PACIENTE

  // Horas 8–19
  const hours = useMemo(() => [...Array(12)].map((_, i) => 8 + i), []);

  // Días de la semana actual
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // ==============================
  // Cargar disponibilidad + citas
  // ==============================
  useEffect(() => {
    if (!fisioId) return;

    const cargar = async () => {
      setLoading(true);

      try {
        // 1) Disponibilidad semanal del fisio
        const res = await api.get(`/api/disponibilidad/semana/${fisioId}`);

        const data = res.data || {};
        data.dias = Array.isArray(data.dias) ? data.dias : [];
        setSemana(data);

        // 2) Citas del paciente (el backend ya filtra por rol = cliente)
        const citasRes = await api.get("/api/citas");
        const citasArr = Array.isArray(citasRes.data) ? citasRes.data : [];

        // Opcional: solo nos interesan las que sean con este fisio
        const soloDeEsteFisio = citasArr.filter(
          (c) =>
            c.fisioterapeuta &&
            (c.fisioterapeuta._id === fisioId ||
              c.fisioterapeuta === fisioId)
        );

        setCitasOcupadas(soloDeEsteFisio);
      } catch (err) {
        console.error("Error cargando disponibilidad / citas:", err);
        setSemana({ dias: [] });
        setCitasOcupadas([]);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [fisioId]);

  // ==============================
  // Lógica de disponibilidad
  // ==============================
  function getNombreDiaFromDate(day) {
    const idx = day.getDay(); // 0–6
    return DIAS_SEMANA[idx];  // "lunes", "martes", ...
  }

  const estaDisponible = (day, hour) => {
    if (!semana || !Array.isArray(semana.dias)) return false;

    const nombreDia = getNombreDiaFromDate(day);
    const dia = semana.dias.find((d) => d.nombre === nombreDia);
    if (!dia || !Array.isArray(dia.horas)) return false;

    // Queremos bloques de 1 hora exacta
    const hInicio = `${hour.toString().padStart(2, "0")}:00`;
    const hFin = `${(hour + 1).toString().padStart(2, "0")}:00`;

    // El bloque debe caber COMPLETO dentro de alguno de los intervalos
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

  const handleClickCelda = (day, hour) => {
    if (!estaDisponible(day, hour)) return;
    if (celdaOcupada(day, hour)) return;

    const d = new Date(day); // copia
    const startAt = new Date(d.setHours(hour, 0, 0, 0));

    const slot = {
      fecha: formatDateISO(startAt),
      hora: formatHour(hour),
      startAt
    };

    onSlotSelected(slot);
  };

  // ==============================
  // Estilos (igual estilo que CitasCalendar)
// ==============================
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

    cellHover:
      "hover:bg-gray-100/60",

    cellAltBackground:
      "bg-gray-50/40",

    celdaDisponible: "bg-teal-100 hover:bg-teal-200",
    celdaOcupada: "bg-red-300 cursor-not-allowed"
  };

  // ==============================
  // Render
  // ==============================
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h3 className="text-xl font-semibold text-teal-700 mb-2">
        Horarios disponibles
      </h3>

      {loading && (
        <p className="text-sm text-gray-500">Cargando disponibilidad...</p>
      )}

      {!loading && (!semana || !Array.isArray(semana.dias) || semana.dias.length === 0) && (
        <p className="text-sm text-gray-500">
          Este fisioterapeuta aún no ha configurado su disponibilidad.
        </p>
      )}

      {!loading && semana && Array.isArray(semana.dias) && semana.dias.length > 0 && (
        <div
          className="grid text-xs mt-4"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          {/* Cabecera vacía */}
          <div />

          {/* Cabeceras de días */}
          {days.map((d, idx) => {
            const isToday = d.toDateString() === new Date().toDateString();
            return (
              <div
                key={idx}
                className={`${styles.dayHeader} ${
                  isToday ? styles.dayToday : ""
                }`}
              >
                {d.toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                })}
              </div>
            );
          })}

          {/* Filas de horas */}
          {hours.map((h) => (
            <div key={h} className="contents">
              {/* Columna de hora */}
              <div className={styles.hourCell}>
                <span className={styles.hourBadge}>{formatHour(h)}</span>
              </div>

              {/* Celdas de días */}
              {days.map((d, idx) => {
                const disponible = estaDisponible(d, h);
                const ocupada = celdaOcupada(d, h);

                return (
                  <div
                    key={idx}
                    onClick={() => handleClickCelda(d, h)}
                    className={`
                      ${styles.cellBase}
                      ${styles.cellHover}
                      ${h % 2 === 0 ? styles.cellAltBackground : ""}
                      ${ocupada ? styles.celdaOcupada : ""}
                      ${!ocupada && disponible ? styles.celdaDisponible : ""}
                      ${
                        !disponible && !ocupada
                          ? "bg-gray-200 cursor-not-allowed"
                          : ""
                      }
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
