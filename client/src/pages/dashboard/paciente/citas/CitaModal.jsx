export default function CitaModal({ cita, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          Detalles de la cita
        </h3>

        <p><strong>Paciente:</strong> {cita.paciente.nombre} {cita.paciente.apellido}</p>
        <p><strong>Motivo:</strong> {cita.motivo}</p>
        <p><strong>Estado:</strong> {cita.estado}</p>
        <p><strong>Fecha:</strong> {new Date(cita.startAt).toLocaleString()}</p>

        <button
          className="mt-6 w-full bg-teal-600 text-white py-2 rounded-lg"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
