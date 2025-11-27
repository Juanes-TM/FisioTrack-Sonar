// client/src/pages/dashboard/paciente/citas/EditarCitaFormModal.jsx
import { useState } from "react";
import api from "../../../../services/api";

export default function EditarCitaFormModal({ cita, onClose, onUpdated }) {
    if (!cita) return null;

    const [motivo, setMotivo] = useState(cita.motivo || "");
    const [observaciones, setObservaciones] = useState(cita.observaciones || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function guardarCambios() {
        if (!motivo.trim()) {
            setError("El motivo no puede estar vacío.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            await api.patch(`/api/citas/${cita._id}`, {
                motivo,
                observaciones
            });

            onUpdated(); // Avisamos a la vista padre
        } catch (err) {
            console.error("Error editando cita:", err);
            setError("Error al guardar los cambios.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">

                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Editar cita
                </h2>

                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Motivo
                </label>
                <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-teal-500"
                />

                <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Observaciones (opcional)
                </label>
                <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 h-24 mb-4 focus:ring-2 focus:ring-teal-500"
                ></textarea>

                {error && (
                    <p className="text-red-600 text-sm mb-3">{error}</p>
                )}

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardarCambios}
                        disabled={saving}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
