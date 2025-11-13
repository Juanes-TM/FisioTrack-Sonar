export default function EditarCitaModal({ visible, onClose, cita, onCancelada }) {
  if (!visible || !cita) return null;

  const estadoColor = {
    pendiente: "text-amber-600",
    confirmada: "text-teal-600",
    completada: "text-emerald-600",
    cancelada: "text-gray-500 line-through"
  };

  const handleCancelar = async () => {
    try {
      const res = await fetch(`/api/citas/${cita._id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ estado: "cancelada" }),
      });

      const data = await res.json();
      if (res.ok) {
        onCancelada(cita._id);
        onClose();
      } else {
        alert(data.msg || "Error al cancelar cita");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la solicitud");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl animate-fadeIn">
        
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Detalles de la cita</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Fisioterapeuta:</strong> {cita.fisioterapeuta.nombre} {cita.fisioterapeuta.apellido}</p>
          <p><strong>Fecha:</strong> {new Date(cita.startAt).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {new Date(cita.startAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</p>
          <p><strong>Motivo:</strong> {cita.motivo}</p>

          <p className={`font-semibold ${estadoColor[cita.estado]}`}>
            Estado: {cita.estado}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
          >
            Cerrar
          </button>

          {cita.estado !== "cancelada" && (
            <button
              onClick={handleCancelar}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow"
            >
              Cancelar cita
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
