import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../../services/api";

// ==========================================
// COMPONENTE: Modal de Confirmación (RESERVAR - Color TEAL)
// ==========================================
const ConfirmacionModal = ({ isOpen, onClose, onConfirm, datos, loading }) => {
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMotivo("");
      setObservaciones("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!motivo.trim()) {
      setError("Por favor, indica el motivo de la consulta.");
      return;
    }
    onConfirm({ motivo, observaciones });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 animate-fade-in">
        {/* Header TEAL (Original) */}
        <div className="bg-teal-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Confirmar Reserva</h3>
          <button onClick={onClose} className="text-teal-200 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-2">
            <p className="text-sm text-teal-800"><strong>Fisioterapeuta:</strong> {datos.fisioNombre}</p>
            <p className="text-sm text-teal-800"><strong>Fecha:</strong> {datos.fechaLegible}</p>
            <p className="text-sm text-teal-800"><strong>Hora:</strong> {datos.hora}</p>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800 text-sm">
            <span className="text-xl">⏱</span>
            <p className="mt-0.5">La sesión tiene una duración de <strong>60 minutos</strong>.</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                className={`w-full border rounded-lg px-3 py-2 outline-none ${error ? "border-red-300 bg-red-50" : "border-gray-300 focus:border-teal-500"}`} 
                value={motivo} 
                onChange={(e) => { setMotivo(e.target.value); setError(""); }}
                placeholder="Ej. Dolor lumbar, revisión..."
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
              <textarea 
                rows="2" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 resize-none" 
                value={observaciones} 
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Información adicional..."
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium" disabled={loading}>Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className={`px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-md ${loading ? "opacity-70" : ""}`}>
            {loading ? "Reservando..." : "Confirmar Cita"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE: Modal de Cancelación (NUEVO - ALERTA ROJA)
// ==========================================
const CancelarModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200 transform scale-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-bold text-gray-900">¿Cancelar Cita?</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              ¿Seguro que quieres cancelar tu cita? <br></br>
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm transition-colors ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? 'Cancelando...' : 'Sí, Cancelar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
          >
            No, volver
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE: Modal de Información (VER / CANCELAR - Color INDIGO)
// ==========================================
const InfoCitaModal = ({ isOpen, onClose, cita, onRequestCancel }) => {
  if (!isOpen || !cita) return null;

  // Formateo de fecha y hora
  const fechaStr = new Date(cita.startAt).toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
  const horaStr = new Date(cita.startAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header INDIGO (Original) */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Mi Cita Reservada</h3>
          <button onClick={onClose} className="text-indigo-200 hover:text-white text-2xl leading-none transition-colors">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Fecha y Hora Grande (Sin etiqueta "Fecha y Hora") */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800">{new Date(cita.startAt).toLocaleDateString()} a las {new Date(cita.startAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>

          <div className="space-y-4">
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Motivo</p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700 text-sm">
                    {cita.motivo}
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Observaciones</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[3rem] text-sm">
                    {cita.observaciones || "Sin observaciones"}
                </p>
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Estado</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                cita.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {cita.estado}
                </span>
            </div>
          </div>
        </div>

        {/* Footer con Botón de Cancelar */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Cerrar</button>
            
            {cita.estado !== 'cancelada' && (
                <button 
                    onClick={() => onRequestCancel(cita._id)} // Llama a la función que abre el modal
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-lg text-sm font-medium transition-all"
                >
                    Cancelar Cita
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export default function ReservarCitaPage() {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("fisioUser") || "{}").user || {};

  const [fisios, setFisios] = useState([]);
  const [fisioId, setFisioId] = useState("");
  
  const [lunesSemana, setLunesSemana] = useState(getLunesActual());
  
  const [datosSemana, setDatosSemana] = useState({ 
    misCitas: [], 
    horarioBase: [],
    intervalosLibresMap: {} 
  });
  
  const [loadingData, setLoadingData] = useState(false);

  // --- MODALES ---
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [modalInfoOpen, setModalInfoOpen] = useState(false);
  const [modalCancelOpen, setModalCancelOpen] = useState(false); // Nuevo estado
  
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [citaACancelarId, setCitaACancelarId] = useState(null); // ID temporal para cancelar
  
  const [reserving, setReserving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const horasDia = Array.from({ length: 13 }, (_, i) => {
    const h = i + 8; 
    return `${h.toString().padStart(2, '0')}:00`;
  });

  // 1. Cargar Fisioterapeutas
  useEffect(() => {
    const cargarFisios = async () => {
      try {
        const res = await api.get("/api/fisioterapeutas", {
           headers: { Authorization: `Bearer ${token}` }
        }); 
        setFisios(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando fisios", err);
        try {
             const res2 = await api.get("/api/users?rol=fisioterapeuta", {
                headers: { Authorization: `Bearer ${token}` }
             });
             setFisios(Array.isArray(res2.data) ? res2.data : []);
        } catch(e) { console.error(e); }
      }
    };
    cargarFisios();
  }, [token]);

  // 2. Cargar Datos Completos
  useEffect(() => {
    if (!fisioId) return;
    recargarDatos();
  }, [fisioId, lunesSemana, token]);

  const recargarDatos = async () => {
    setLoadingData(true);
    try {
      const finSemana = new Date(lunesSemana);
      finSemana.setDate(finSemana.getDate() + 6);
      
      const resCitas = await api.get(`/api/citas?fisioterapeuta=${fisioId}`, {
         headers: { Authorization: `Bearer ${token}` }
      }); 
      
      // CORRECCIÓN: Filtrar las citas devueltas por el backend para que solo contengan
      // las citas del fisio seleccionado, manejando el ID del fisio (string vs object).
      const citasFiltradas = resCitas.data.filter(c => {
        const d = new Date(c.startAt);
        
        // Extraemos el ID del fisioterapeuta de la cita.
        const idFisioCita = (c.fisioterapeuta?._id || c.fisioterapeuta || '').toString();

        const esDelFisioActual = idFisioCita === fisioId; 
        
        return esDelFisioActual && d >= lunesSemana && d <= finSemana && c.estado !== 'cancelada';
      });

      const resHorario = await api.get(`/api/disponibilidad/semana/${fisioId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });

      const diasSemana = Array.from({ length: 5 }, (_, i) => {
          const d = new Date(lunesSemana);
          d.setDate(d.getDate() + i);
          return d.toISOString().split('T')[0];
      });

      const promesasIntervalos = diasSemana.map(async (fechaStr) => {
          try {
              const res = await api.get("/api/disponibilidad/intervalos", {
                  params: { fisioId, fecha: fechaStr, duracion: 60 },
                  headers: { Authorization: `Bearer ${token}` }
              });
              return { fecha: fechaStr, slots: res.data.intervalosLibres || [] };
          } catch (e) {
              return { fecha: fechaStr, slots: [] };
          }
      });

      const resultadosIntervalos = await Promise.all(promesasIntervalos);
      const mapaIntervalos = {};
      resultadosIntervalos.forEach(r => {
          mapaIntervalos[r.fecha] = r.slots.map(s => s.inicio);
      });
      
      setDatosSemana({
        misCitas: citasFiltradas, // Lista FILTRADA (solo las mías Y del fisio X)
        horarioBase: resHorario.data.dias || [],
        intervalosLibresMap: mapaIntervalos
      });

    } catch (err) {
      console.error("Error cargando datos semana:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // --- HELPERS ---
  function getLunesActual() {
    const d = new Date();
    const dia = d.getDay();
    const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
    d.setHours(0,0,0,0);
    d.setDate(diff);
    return d;
  }

  function cambiarSemana(dir) {
    const nueva = new Date(lunesSemana);
    nueva.setDate(nueva.getDate() + (dir * 7));
    const lunesActual = getLunesActual();
    if (nueva < lunesActual) return;
    setLunesSemana(nueva);
  }

  function esPasado(fecha, horaStr) {
    const ahora = new Date();
    const [h, m] = horaStr.split(':');
    const fechaSlot = new Date(fecha);
    fechaSlot.setHours(parseInt(h), parseInt(m));
    return fechaSlot < ahora;
  }

  function esSemanaFutura() {
    return lunesSemana > getLunesActual();
  }

  // LÓGICA MAESTRA DE ESTADO
  function getEstadoSlot(diaObj, horaStr) {
    const fechaStr = diaObj.toISOString().split('T')[0];
    const nombreDia = diaObj.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (esPasado(diaObj, horaStr)) return { estado: 'pasado' };

    const diaConfig = datosSemana.horarioBase.find(d => d.nombre === nombreDia);
    if (!diaConfig || !diaConfig.horas || diaConfig.horas.length === 0) return { estado: 'cerrado' }; 
    
    const minutosSlot = parseInt(horaStr.split(':')[0]) * 60 + parseInt(horaStr.split(':')[1]);
    const trabaja = diaConfig.horas.some(intervalo => {
      const [hIni, mIni] = intervalo.inicio.split(':').map(Number);
      const [hFin, mFin] = intervalo.fin.split(':').map(Number);
      const inicioMin = hIni * 60 + mIni;
      const finMin = hFin * 60 + mFin;
      return minutosSlot >= inicioMin && (minutosSlot + 60) <= finMin;
    });

    if (!trabaja) return { estado: 'cerrado' };

    const miCita = datosSemana.misCitas.find(c => {
      const inicioCita = new Date(c.startAt);
      return inicioCita.getDate() === diaObj.getDate() && 
             inicioCita.getMonth() === diaObj.getMonth() &&
             inicioCita.getHours() === parseInt(horaStr.split(':')[0]);
    });

    if (miCita) return { estado: 'mio', cita: miCita };

    const libresHoy = datosSemana.intervalosLibresMap[fechaStr] || [];
    if (libresHoy.includes(horaStr)) {
        return { estado: 'libre' };
    }

    return { estado: 'ocupado' };
  }

  const handleCellClick = (diaObj, horaStr, status) => {
    if (status.estado === 'libre') {
      const fisio = fisios.find(f => f._id === fisioId);
      const fechaSlot = new Date(diaObj);
      const [h, m] = horaStr.split(':');
      fechaSlot.setHours(parseInt(h), parseInt(m));

      setSlotSeleccionado({
        startAt: fechaSlot,
        hora: horaStr,
        fechaLegible: fechaSlot.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long'}),
        fisioNombre: fisio ? `${fisio.nombre} ${fisio.apellido}` : "Fisioterapeuta"
      });
      setModalReservaOpen(true);
    } else if (status.estado === 'mio') {
      setCitaSeleccionada(status.cita);
      setModalInfoOpen(true);
    }
  };

  const handleConfirmarReserva = async (formData) => {
    if (!slotSeleccionado) return;
    setReserving(true);
    try {
      await api.post("/api/citas", {
        fisioterapeutaId: fisioId,
        startAt: slotSeleccionado.startAt,
        durationMinutes: 60,
        motivo: formData.motivo,
        observaciones: formData.observaciones
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setModalReservaOpen(false);
      recargarDatos();

    } catch (err) {
      alert(err.response?.data?.msg || "Error al reservar");
    } finally {
      setReserving(false);
    }
  };

  // 1. Abre el modal en lugar de window.confirm
  const handleRequestCancel = (citaId) => {
    setCitaACancelarId(citaId);
    setModalCancelOpen(true);
  };

  // 2. Ejecuta la cancelación real
  const handleConfirmarCancelacion = async () => {
    if (!citaACancelarId) return;
    setCancelling(true);
    try {
        await api.put(`/api/citas/${citaACancelarId}/estado`, { estado: 'cancelada' }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Cerrar ambos modales y refrescar
        setModalCancelOpen(false);
        setModalInfoOpen(false);
        recargarDatos(); 
    } catch (err) {
        alert("No se pudo cancelar la cita");
    } finally {
        setCancelling(false);
        setCitaACancelarId(null);
    }
  };

  const diasRender = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(lunesSemana);
    d.setDate(d.getDate() + i);
    return d;
  });

  const esSemanaActual = lunesSemana.getTime() === getLunesActual().getTime();
  const mesActualStr = lunesSemana.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-700 mb-2">Reservar Cita</h1>
        <p className="text-gray-600 text-sm">Selecciona tu fisioterapeuta y elige una franja disponible en el calendario. Todas las citas son de <b>60 minutos</b>.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 max-w-3xl">
        <label className="block mb-1 text-sm font-medium text-gray-700">Fisioterapeuta</label>
        <select value={fisioId} onChange={(e) => setFisioId(e.target.value)} className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm focus:ring-2 focus:ring-teal-500 outline-none">
          <option value="">-- Elige un fisioterapeuta --</option>
          {fisios.map((f) => <option key={f._id} value={f._id}>{f.nombre} {f.apellido}</option>)}
        </select>
      </div>

      {esSemanaFutura() && (
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Aviso:</strong> Estás visualizando una semana futura. Ten en cuenta que la disponibilidad del profesional podría cambiar y tu cita podría ser reubicada.
              </p>
            </div>
          </div>
        </div>
      )}

      {fisioId ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 bg-teal-50 border-b border-teal-100">
             <button onClick={() => cambiarSemana(-1)} disabled={esSemanaActual} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${esSemanaActual ? "text-gray-300 cursor-not-allowed" : "text-teal-700 bg-white hover:bg-teal-600 hover:text-white shadow-sm"}`}>
                ← Anterior
             </button>
             <h2 className="text-xl font-bold text-teal-900 capitalize">{mesActualStr}</h2>
             <button onClick={() => cambiarSemana(1)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-white rounded-full shadow-sm hover:bg-teal-600 hover:text-white transition-all">
                Siguiente →
             </button>
          </div>

          <div className="p-6 overflow-x-auto">
            {loadingData ? (
               <div className="py-20 text-center text-gray-500">Cargando agenda...</div>
            ) : (
              <div className="min-w-[800px]">
                 <div className="grid grid-cols-6 gap-2 mb-2">
                    <div className="col-span-1"></div>
                    {diasRender.map((d, i) => (
                      <div key={i} className="text-center p-2 bg-teal-50/50 rounded-lg">
                        <p className="text-xs font-bold text-teal-600 uppercase">{d.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                        <p className="text-lg font-bold text-gray-700">{d.getDate()}</p>
                      </div>
                    ))}
                 </div>

                 {horasDia.map((hora) => (
                   <div key={hora} className="grid grid-cols-6 gap-2 mb-2">
                      <div className="col-span-1 flex items-center justify-center text-xs font-semibold text-gray-400">{hora}</div>
                      {diasRender.map((diaObj, i) => {
                        const status = getEstadoSlot(diaObj, hora);
                        let cellClass = "border transition-all duration-200 rounded-md h-12 flex items-center justify-center text-xs font-medium ";
                        let contenido = "";

                        switch(status.estado) {
                          case 'libre':
                            // LIBRE = TEAL (Original)
                            cellClass += "bg-white border-teal-200 text-teal-700 hover:bg-teal-500 hover:text-white cursor-pointer hover:shadow-md";
                            contenido = "Libre";
                            break;
                          case 'ocupado':
                            // OCUPADO = AMBAR
                            cellClass += "bg-amber-50 border-amber-100 text-amber-400 cursor-default";
                            contenido = "Ocupado";
                            break;
                          case 'mio':
                            // MIO = INDIGO (Original)
                            cellClass += "bg-indigo-100 border-indigo-200 text-indigo-700 cursor-pointer hover:bg-indigo-200 ring-2 ring-indigo-400 ring-inset";
                            contenido = "Tu Cita";
                            break;
                          case 'cerrado':
                            cellClass += "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed";
                            contenido = "-";
                            break;
                          case 'pasado':
                            cellClass += "bg-gray-50 border-transparent text-gray-300 cursor-not-allowed";
                            contenido = "-";
                            break;
                        }

                        return (
                          <div key={i} onClick={() => handleCellClick(diaObj, hora, status)} className={cellClass}>
                            {contenido}
                          </div>
                        );
                      })}
                   </div>
                 ))}
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-teal-200 rounded"></div> Disponible</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div> Ocupado</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-100 border border-indigo-200 ring-1 ring-indigo-400 rounded"></div> Tu cita</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-50 rounded"></div> No disponible / Pasado</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200 opacity-60">
           <p className="text-gray-500 text-lg">Selecciona un fisioterapeuta para ver su agenda.</p>
        </div>
      )}

      {/* MODALES */}
      <ConfirmacionModal isOpen={modalReservaOpen} onClose={() => setModalReservaOpen(false)} onConfirm={handleConfirmarReserva} datos={slotSeleccionado || {}} loading={reserving} />
      
      {/* Modal de info con props para cancelar */}
      <InfoCitaModal 
        isOpen={modalInfoOpen} 
        onClose={() => setModalInfoOpen(false)} 
        cita={citaSeleccionada} 
        onRequestCancel={handleRequestCancel} 
      />

      {/* Nuevo Modal de Cancelación */}
      <CancelarModal 
        isOpen={modalCancelOpen} 
        onClose={() => setModalCancelOpen(false)} 
        onConfirm={handleConfirmarCancelacion} 
        loading={cancelling} 
      />
    </div>
  );
}