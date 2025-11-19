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
  const token = localStorage.getItem("token");

  // SI FALTA TOKEN O FISIOUSER -> ERROR
  const fisioId = fisioLS?.user?._id;
  const rol = fisioLS?.user?.rol;

  const { semana, loading, guardarSemana } = useDisponibilidad(fisioId);
  const [horarios, setHorarios] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const inicial = {};
    DIAS.forEach((d) => {
      inicial[d] = [];
    });
    setHorarios(inicial);
  }, []);

  useEffect(() => {
    if (semana && semana.dias) {
      const nuevo = {};
      DIAS.forEach((d) => {
        const dia = semana.dias.find((x) => x.nombre === d);
        nuevo[d] = dia?.horas || [];
      });
      setHorarios(nuevo);
    }
  }, [semana]);

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
  };

  const handleChangeInterval = (dia, index, campo, valor) => {
    setHorarios((prev) => {
      const copia = { ...prev };
      const arr = [...copia[dia]];
      arr[index] = { ...arr[index], [campo]: valor };
      copia[dia] = arr;
      return copia;
    });
  };

  const handleRemoveInterval = (dia, index) => {
    setHorarios((prev) => {
      const copia = { ...prev };
      copia[dia] = copia[dia].filter((_, i) => i !== index);
      return copia;
    });
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      await guardarSemana(horarios);
    } catch (err) {
      console.error("Error al guardar disponibilidad:", err);
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
                    className="text-sm px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
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
                          className="border border-gray-300 rounded-lg px-2 py-1 w-24"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={h.fin}
                          onChange={(e) =>
                            handleChangeInterval(dia, index, "fin", e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1 w-24"
                        />
                        <button
                          onClick={() => handleRemoveInterval(dia, index)}
                          className="ml-auto text-xs px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
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
              disabled={guardando}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {guardando ? "Guardando..." : "Guardar disponibilidad"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
