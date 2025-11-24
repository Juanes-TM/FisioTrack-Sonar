// client/src/pages/dashboard/paciente/citas/EditarCitaModal.jsx
import { useNavigate } from 'react-router-dom'; // <--- IMPORTAR useNavigate

export default function EditarCitaModal({ visible, onClose, cita, onRequestCancel, cancelling }) {
  if (!visible || !cita) return null;

  const navigate = useNavigate(); // <--- HOOK PARA NAVEGAR

  // Comprobación para permitir cancelar (futuro y no cancelada/completada)
  const isFuture = new Date(cita.startAt) > new Date();
  const puedeCancelar = (cita.estado === "pendiente" || cita.estado === "confirmada") && isFuture;
  
  // Comprobación para permitir VALORAR (Solo si está completada)
  const puedeValorar = cita.estado === 'completada'; // <--- NUEVO

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
    onRequestCancel(cita._id); 
  };
  
  // FUNCIONES DE NAVEGACIÓN NUEVAS
  const irAValorar = () => {
    // Navegamos al formulario pasando el ID del fisio
    navigate(`/valorar/${cita.fisioterapeuta?._id || cita.fisioterapeuta}`);
  };

  const verOpiniones = () => {
    navigate(`/valoraciones/${cita.fisioterapeuta?._id || cita.fisioterapeuta}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-96 shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header con color dinámico */}
        <div className={`${headerColor} px-6 py-4 flex justify-between items-center`}>
           <h3 className="text-white font-bold text-lg">Detalles de la Cita</h3>
           <span className="text-white/80 text-xs font-mono uppercase tracking-wider">
             #{cita._id.slice(-6)}
           </span>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Info Principal */}
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm text-gray-500 font-medium">Fisioterapeuta</p>
                <p className="text-gray-900 font-bold text-lg leading-tight">
                  {/* Aseguramos que pinte el nombre si viene poblado */}
                  {cita.fisioterapeuta?.nombre ? `${cita.fisioterapeuta.nombre} ${cita.fisioterapeuta.apellido}` : 'Fisioterapeuta'}
                </p>
                
                {/* ENLACE PARA VER OPINIONES (NUEVO) */}
                <button 
                  onClick={verOpiniones}
                  className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                >
                  Ver opiniones de este fisio
                </button>

             </div>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColor}`}>
                {cita.estado}
             </span>
          </div>

          {/* Fecha y Hora */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
             <div className="text-center border-r border-gray-200 pr-4 w-1/2">
                <p className="text-xs text-gray-500 uppercase font-bold">Fecha</p>
                <p className="text-gray-800 font-bold text-lg">
                    {new Date(cita.startAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short'})}
                </p>
             </div>
             <div className="text-center pl-4 w-1/2">
                <p className="text-xs text-gray-500 uppercase font-bold">Hora</p>
                <p className="text-teal-600 font-bold text-lg">
                    {new Date(cita.startAt).toLocaleTimeString('es-ES', {hour: "2-digit", minute: "2-digit"})}
                </p>
             </div>
          </div>
          
          {/* Motivo */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Motivo</p>
            <p className="text-sm text-gray-700 italic border-l-4 border-indigo-200 pl-3">
              {cita.motivo}
            </p>
          </div>

          {/* === SECCIÓN DE VALORACIÓN (NUEVO) === */}
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

        {/* Footer de acciones */}
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
              className={`px-4 py-2 rounded-lg bg-red-100 text-red-700 border border-red-200 font-semibold hover:bg-red-200 transition-all text-sm 
                        ${cancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cancelling ? 'Cancelando...' : 'Cancelar Cita'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}