// client/src/pages/dashboard/paciente/citas/ReservarCitaPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../../services/api";
import SelectorCitaCalendar from "../../../../components/SelectorCitaCalendar";

export default function ReservarCitaPage() {
  // No lo usamos ahora mismo, pero lo dejo por si luego quieres mostrar info del paciente
  const { user } = useSelector((state) => state.user || { user: null });

  const [fisios, setFisios] = useState([]);
  const [fisioId, setFisioId] = useState("");

  // ==============================
  // Cargar lista de fisioterapeutas
  // ==============================
  useEffect(() => {
    const cargarFisioterapeutas = async () => {
      try {
        const res = await api.get("/api/fisioterapeutas");
        const data = Array.isArray(res.data) ? res.data : [];
        setFisios(data);
      } catch (err) {
        console.error("Error cargando fisioterapeutas:", err);
        setFisios([]);
      }
    };

    cargarFisioterapeutas();
  }, []);

  // ==============================
  // Reservar cita (bloques de 60 minutos)
  // ==============================
  const reservar = async (slot) => {
    if (!fisioId) {
      alert("Selecciona un fisioterapeuta primero.");
      return;
    }

    try {
      await api.post("/api/citas", {
        fisioterapeutaId: fisioId,
        startAt: slot.startAt,
        durationMinutes: 60,
        motivo: "Cita reservada por el paciente"
      });

      alert(
        `Cita reservada correctamente el ${slot.fecha} a las ${slot.hora}.`
      );
    } catch (err) {
      console.error("Error al reservar cita:", err);
      alert(
        err?.response?.data?.msg ||
          "No se pudo reservar la cita. Puede que ese hueco ya esté ocupado."
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-teal-700 mb-2">
        Reservar Cita
      </h1>

      <p className="text-gray-600 text-sm mb-6">
        Selecciona tu fisioterapeuta y elige una franja disponible en el
        calendario. Todas las citas son de <b>60 minutos</b>.
      </p>

      {/* SELECT FISIOTERAPEUTA */}
      <div className="mb-4 max-w-md">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Fisioterapeuta
        </label>

        <select
          value={fisioId}
          onChange={(e) => setFisioId(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm"
        >
          <option value="">Selecciona un fisio...</option>
          {fisios.map((f) => (
            <option key={f._id} value={f._id}>
              {f.nombre} {f.apellido}
            </option>
          ))}
        </select>
      </div>

      {/* CALENDARIO DE SELECCIÓN */}
      {fisioId ? (
        <SelectorCitaCalendar fisioId={fisioId} onSlotSelected={reservar} />
      ) : (
        <p className="text-gray-500 text-sm">
          Elige primero un fisioterapeuta para ver sus horarios disponibles.
        </p>
      )}
    </div>
  );
}
