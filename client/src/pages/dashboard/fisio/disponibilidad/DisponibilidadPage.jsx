// client/src/pages/dashboard/fisio/disponibilidad/DisponibilidadPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDisponibilidad } from "../../../../hooks/useDisponibilidad";

const DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo"
];

const etiquetasDias = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo"
};

export default function DisponibilidadPage() {
  // EXTRAER DATOS REALES DESDE LOCALSTORAGE
  const fisioLS = JSON.parse(localStorage.getItem("fisioUser"));
  
  // SI FALTA TOKEN O FISIOUSER -> ERROR
  const fisioId = fisioLS?.user?._id;
  const rol = fisioLS?.user?.rol;

  // El hook ahora espera el fisioId.
  const { semana, loading, guardarSemana } = useDisponibilidad(fisioId);
  
  const [horarios, setHorarios] = useState({});
  // Estado para comparar si hay cambios reales (guardamos la versión "string" del objeto)
  const [originalHash, setOriginalHash] = useState(""); 
  
  const [guardando, setGuardando] = useState(false);
  
  // Estados para mensajes de feedback
  const [errorGuardado, setErrorGuardado] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Inicializar horarios a un diccionario vacío de arrays para cada día
  useEffect(() => {
    const inicial = {};
    DIAS.forEach((d) => {
      inicial[d] = [];
    });
    setHorarios(inicial);
    // Guardamos el estado inicial como hash
    setOriginalHash(JSON.stringify(inicial));
  }, []);

  // Cargar datos de la API en el estado local después de que 'semana' se cargue
  useEffect(() => {
    if (semana && semana.dias) {
      const nuevo = {};
      DIAS.forEach((d) => {
        const dia = semana.dias.find((x) => x.nombre === d);
        // Aseguramos que sea un nuevo array para evitar referencias compartidas y clonamos los objetos
        nuevo[d] = dia?.horas ? dia.horas.map(h => ({...h})) : [];
      });
      
      setHorarios(nuevo);
      // Actualizamos la huella original con los datos que vienen de la base de datos
      setOriginalHash(JSON.stringify(nuevo));
    }
  }, [semana]);

  // Calcular si hay cambios comparando el estado actual con el original
  const hayCambios = JSON.stringify(horarios) !== originalHash;

  if (rol !== "fisioterapeuta") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">
          Disponibilidad del fisioterapeuta
        </h2>
        <p className="text-gray-600">
          Esta sección solo está disponible para usuarios con rol de fisioterapeuta.
        </p>
      </div>
    );
  }

  const handleAddInterval = (dia) => {
    setHorarios((prev) => ({
      ...prev,
      [dia]: [...(prev[dia] || []), { inicio: "09:00", fin: "10:00" }]
    }));
    // Limpiamos mensajes al editar
    setErrorGuardado(null);
    setMensajeExito(null);
  };

  const handleChangeInterval = (dia, index, campo, valor) => {
    setHorarios((prev) => {
      const copia = { ...prev };
      const arr = [...copia[dia]];
      arr[index] = { ...arr[index], [campo]: valor };
      copia[dia] = arr;
      return copia;
    });
    setErrorGuardado(null);
    setMensajeExito(null);
  };

  const handleRemoveInterval = (dia, index) => {
    setHorarios((prev) => {
      const copia = { ...prev };
      copia[dia] = copia[dia].filter((_, i) => i !== index);
      return copia;
    });
    setErrorGuardado(null);
    setMensajeExito(null);
  };

  const handleGuardar = async () => {
    // Doble chequeo: si no hay cambios, no hacemos nada
    if (!hayCambios) return;

    setErrorGuardado(null);
    setMensajeExito(null);
    
    try {
      setGuardando(true);
      
      await guardarSemana(horarios); 
      
      // IMPORTANTE: Actualizamos el hash original para que el botón se deshabilite de nuevo
      // ya que ahora "lo actual" es igual a "lo guardado en BD".
      setOriginalHash(JSON.stringify(horarios));

      // Mensaje limpio, sin negritas ni prefijos "Exito"
      setMensajeExito("Disponibilidad guardada correctamente.");
      
      // Ocultar mensaje a los 3 segundos
      setTimeout(() => {
        setMensajeExito(null);
      }, 3000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Error desconocido al guardar la disponibilidad.";
      setErrorGuardado(errorMsg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading && !semana) {
    return <div className="p-8">Cargando disponibilidad...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-teal-700 mb-2">
          Disponibilidad semanal
        </h2>
        <p className="text-gray-600 mb-4">
          Configura los intervalos de horas en los que estás disponible cada día.
        </p>
        
        {/* MENSAJE DE ERROR (ROJO) */}
        {errorGuardado && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{errorGuardado}</span>
            </div>
        )}

        {/* MENSAJE DE ÉXITO (VERDE) - Limpio */}
        {mensajeExito && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 transition-opacity duration-500" role="alert">
                <span className="block sm:inline">{mensajeExito}</span>
            </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIAS.map((dia) => (
              <div key={dia} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {etiquetasDias[dia]}
                  </h3>
                  <button
                    onClick={() => handleAddInterval(dia)}
                    className="text-sm px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    Añadir intervalo
                  </button>
                </div>

                {horarios[dia] && horarios[dia].length > 0 ? (
                  <div className="space-y-2">
                    {horarios[dia].map((h, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="time"
                          value={h.inicio}
                          onChange={(e) =>
                            handleChangeInterval(dia, index, "inicio", e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1 w-24 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={h.fin}
                          onChange={(e) =>
                            handleChangeInterval(dia, index, "fin", e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1 w-24 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                        />
                        <button
                          onClick={() => handleRemoveInterval(dia, index)}
                          className="ml-auto text-xs px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    No hay intervalos definidos para este día.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleGuardar}
              // Se deshabilita si está guardando O si NO hay cambios respecto al original
              disabled={guardando || !hayCambios}
              className={`px-4 py-2 rounded-lg shadow-sm font-medium transition-all duration-200 
                ${guardando || !hayCambios 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
            >
              {guardando ? "Guardando..." : "Guardar disponibilidad"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}