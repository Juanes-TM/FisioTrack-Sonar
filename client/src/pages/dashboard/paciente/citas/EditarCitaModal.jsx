//client/src/pages/dashboard/paciente/citas/EditarCitaModal.jsx
export default function EditarCitaModal({ visible, onClose, cita, onRequestCancel, cancelling }) {
  if (!visible || !cita) return null;

  // Comprobación para permitir cancelar (futuro y no cancelada/completada)
  const isFuture = new Date(cita.startAt) > new Date();
  const puedeCancelar = (cita.estado === "pendiente" || cita.estado === "confirmada") && isFuture;
  
  // Colores consistentes
  let headerColor = "bg-indigo-600";
  let badgeColor = "bg-indigo-100 text-indigo-800";

  if (cita.estado === 'cancelada') {
    headerColor = "bg-gray-400";
    badgeColor = "bg-red-100 text-red-700 line-through";
  } else if (cita.estado === 'completada') {
    headerColor = "bg-emerald-600";
    badgeColor = "bg-emerald-100 text-emerald-800";
  }

  const handleCancelar = () => {
    // Pedimos al componente padre que inicie el flujo de confirmación (Modal dentro de Modal)
    onRequestCancel(cita._id); 
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-96 shadow-2xl animate-fadeIn overflow-hidden">
        
        <div className={`${headerColor} p-5`}>
             <h2 className="text-xl font-semibold text-white">Detalles de la cita</h2>
        </div>


        <div className="p-6 space-y-4 text-gray-700">
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">Cita con {cita.fisioterapeuta?.nombre} {cita.fisioterapeuta?.apellido}</h3>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeColor}`}>
                {cita.estado}
            </span>
          </div>
          
          <div className space-y-2>
             <p className="text-sm">
                <strong className="w-16 inline-block font-semibold text-gray-600">Fecha:</strong>
                {new Date(cita.startAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
             </p>
             <p className="text-sm">
                <strong className="w-16 inline-block font-semibold text-gray-600">Hora:</strong>
                <span className="text-lg font-bold text-teal-600">
                    {new Date(cita.startAt).toLocaleTimeString('es-ES', {hour: "2-digit", minute: "2-digit"})}
                </span>
             </p>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="font-semibold text-gray-600 mb-1">Motivo:</p>
            <p className="bg-gray-50 p-3 rounded-lg text-sm italic border border-gray-100">{cita.motivo}</p>
          </div>
          
        </div>

        {/* Sección de acciones */}
        <div className={`p-6 pt-4 flex ${puedeCancelar ? 'justify-between' : 'justify-end'} border-t border-gray-100`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors text-sm"
          >
            Cerrar
          </button>

          {puedeCancelar && (
            <button
              onClick={handleCancelar}
              disabled={cancelling}
              className={`px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-200 transition-all text-sm 
                        ${cancelling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              {cancelling ? "Cancelando..." : "Cancelar cita"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}