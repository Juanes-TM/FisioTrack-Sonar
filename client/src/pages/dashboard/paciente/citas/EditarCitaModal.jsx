// client/src/pages/dashboard/paciente/citas/EditarCitaModal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";

export default function EditarCitaModal({
  visible,
  onClose,
  cita,
  onRequestCancel,
  cancelling,
  onUpdated,        // <- opcional, por si el padre quiere refrescar
}) {
  if (!visible || !cita) return null;

  const navigate = useNavigate();

  // ----- ESTADOS PARA EDITAR -----
  const [motivo, setMotivo] = useState(cita.motivo || "");
  const [observaciones, setObservaciones] = useState(cita.observaciones || "");
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  

  // Si cambia la cita seleccionada, sincronizamos los campos
  useEffect(() => {
    setMotivo(cita.motivo || "");
    setObservaciones(cita.observaciones || "");
    setEditando(false);
    setError("");
  }, [cita]);

  // Comprobaciones de estado
  const isFuture = new Date(cita.startAt) > new Date();
  const puedeCancelar =
    (cita.estado === "pendiente" || cita.estado === "confirmada") && isFuture;

  const puedeValorar = cita.estado === "completada";

  // permitimos editar motivo / observaciones en las mismas condiciones que cancelar
  const puedeEditar = puedeCancelar;

  // Colores de cabecera
  let headerColor = "bg-indigo-600";
  let badgeColor = "bg-indigo-100 text-indigo-800";

  if (cita.estado === "cancelada") {
    headerColor = "bg-gray-400";
    badgeColor = "bg-red-100 text-red-700 line-through";
  } else if (cita.estado === "completada") {
    headerColor = "bg-emerald-600";
    badgeColor = "bg-emerald-100 text-emerald-800";
  }

  const handleCancelar = () => {
    onRequestCancel(cita._id);
  };

  // ---- NAVEGAR A VALORACIÓN / OPINIONES ----
  const irAValorar = () => {
    navigate(`/valorar/${cita.fisioterapeuta?._id || cita.fisioterapeuta}`);
  };

  const verOpiniones = () => {
    navigate(`/valoraciones/${cita.fisioterapeuta?._id || cita.fisioterapeuta}`);
  };

  // ---- GUARDAR CAMBIOS (PATCH /api/citas/:id) ----
  const guardarCambios = async () => {
    if (!motivo.trim()) {
      setError("El motivo no puede estar vacío.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.patch(`/api/citas/${cita._id}`, {
        motivo,
        observaciones,
      });

      // Avisamos al padre (si quiere refrescar lista/calendario)
      if (onUpdated) {
        onUpdated({ ...cita, motivo, observaciones });
      }
      // Cerrar modal automáticamente
      onClose();

      setEditando(false);
    } catch (err) {
      console.error("Error editando cita:", err);
      setError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-96 shadow-2xl overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className={`${headerColor} px-6 py-4 flex justify-between items-center`}>
          <h3 className="text-white font-bold text-lg">Detalles de la Cita</h3>
          <span className="text-white/80 text-xs font-mono uppercase tracking-wider">
            #{cita._id.slice(-6)}
          </span>
        </div>

        <div className="p-6 space-y-4">
          {/* Info principal */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Fisioterapeuta</p>
              <p className="text-gray-900 font-bold text-lg leading-tight">
                {cita.fisioterapeuta?.nombre
                  ? `${cita.fisioterapeuta.nombre} ${cita.fisioterapeuta.apellido}`
                  : "Fisioterapeuta"}
              </p>

              <button
                onClick={verOpiniones}
                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
              >
                Ver opiniones de este fisio
              </button>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColor}`}
            >
              {cita.estado}
            </span>
          </div>

          {/* Fecha y hora */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="text-center border-r border-gray-200 pr-4 w-1/2">
              <p className="text-xs text-gray-500 uppercase font-bold">Fecha</p>
              <p className="text-gray-800 font-bold text-lg">
                {new Date(cita.startAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div className="text-center pl-4 w-1/2">
              <p className="text-xs text-gray-500 uppercase font-bold">Hora</p>
              <p className="text-teal-600 font-bold text-lg">
                {new Date(cita.startAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Motivo + observaciones: modo ver / modo editar */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Motivo</p>
              {puedeEditar && !editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Editar
                </button>
              )}
            </div>

            {!editando ? (
              <>
                <p className="text-sm text-gray-700 italic border-l-4 border-indigo-200 pl-3">
                  {cita.motivo}
                </p>

                {cita.observaciones && (
                  <p className="text-xs text-gray-600 border-l-4 border-gray-200 pl-3 mt-1">
                    <span className="font-semibold">Notas:</span> {cita.observaciones}
                  </p>
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2 focus:ring-2 focus:ring-teal-500"
                  placeholder="Motivo de la consulta"
                />

                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm h-20 focus:ring-2 focus:ring-teal-500"
                  placeholder="Notas adicionales (opcional)"
                />

                {error && (
                  <p className="text-red-600 text-xs mt-1">{error}</p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditando(false);
                      setMotivo(cita.motivo || "");
                      setObservaciones(cita.observaciones || "");
                      setError("");
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200"
                  >
                    Cancelar edición
                  </button>

                  <button
                    onClick={guardarCambios}
                    disabled={saving}
                    className="px-3 py-1 text-xs bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sección de valoración */}
          {puedeValorar && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={irAValorar}
                className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-transform transform active:scale-95"
              >
                <span className="text-lg">★</span> Valorar Servicio
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Tu opinión ayuda a mejorar el servicio.
              </p>
            </div>
          )}
        </div>

        {/* Footer acciones */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cerrar
          </button>

          {puedeCancelar && (
            <button
              onClick={handleCancelar}
              disabled={cancelling}
              className={`px-4 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200 font-semibold hover:bg-red-200 transition-all text-sm ${
                cancelling ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {cancelling ? "Cancelando..." : "Cancelar Cita"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
