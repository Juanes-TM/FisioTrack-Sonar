// client/src/pages/dashboard/paciente/citas/ListaCitasDiaModal.jsx
import { useState } from "react";
import EditarCitaFormModal from "./EditarCitaFormModal";


export default function ListaCitasDiaModal({ isOpen, onClose, citas, onCitaSelect }) {
    if (!isOpen || citas.length === 0) return null;

    const [citaEditar, setCitaEditar] = useState(null);
    const fecha = new Date(citas[0].startAt).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const handleCitaClick = (e, cita) => {
        onClose();
        onCitaSelect(e, cita);
    };

    const getColorClass = (estado) => {
        if (estado === 'cancelada') return "bg-red-50 text-red-700 border-red-200 line-through";
        if (estado === 'completada') return "bg-emerald-100 text-emerald-700 border-emerald-200";
        return "bg-teal-100 text-teal-700 border-teal-200";
    };

    return (
        <>
            {/* ===== MODAL LISTA DE CITAS ===== */}
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-fadeIn">

                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Citas del {fecha}
                        </h2>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {citas.map((cita) => (
                            <div key={cita._id} className="space-y-1">
                                <button
                                    onClick={(e) => handleCitaClick(e, cita)}
                                    className={`w-full text-left p-3 rounded-lg border shadow-sm transition-all flex justify-between items-center ${getColorClass(cita.estado)}`}
                                >
                                    <div>
                                        <p className="text-sm font-bold">
                                            {new Date(cita.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {cita.motivo}
                                        </p>
                                        <p className="text-xs font-medium mt-0.5 opacity-80">
                                            {cita.fisioterapeuta?.nombre} {cita.fisioterapeuta?.apellido}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-white/80 border">
                                        {cita.estado}
                                    </span>
                                </button>

                                {/* Botón editar */}
                                <button
                                    onClick={() => setCitaEditar(cita)}
                                    className="text-blue-600 text-sm underline ml-2 hover:text-blue-800"
                                >
                                    Editar cita
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Cerrar lista
                        </button>
                    </div>

                </div>
            </div>

            {/* ===== MODAL EDITAR CITA ===== */}
            {citaEditar && (
                <EditarCitaFormModal
                    cita={citaEditar}
                    onClose={() => setCitaEditar(null)}
                    onUpdated={() => setCitaEditar(null)}
                />
            )}
        </>
    );
}
