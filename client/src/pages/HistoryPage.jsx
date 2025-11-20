import { useEffect, useState } from "react";
import { getHistory } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargar() {
      const data = await getHistory();
      setCitas(data);
    }
    cargar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">
          Historial de Citas
        </h2>

        {/* Botón volver */}
        <button
          onClick={() => navigate("/dashboard/paciente")}
          className="text-teal-600 underline mb-4"
        >
          Volver al panel
        </button>

        {citas.length === 0 ? (
          <p>No tienes citas registradas.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Fisioterapeuta</th>
                <th className="p-2 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => (
                <tr key={cita._id} className="text-center border">
                  <td className="p-2">{new Date(cita.fecha).toLocaleString()}</td>
                  <td className="p-2">
                    {cita.fisioterapeuta?.nombre} {cita.fisioterapeuta?.apellido}
                  </td>
                  <td className="p-2 capitalize">{cita.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
