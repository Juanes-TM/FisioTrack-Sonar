// client/src/pages/MisValoraciones.jsx
import { useEffect, useState } from 'react';
import { obtenerMisValoraciones } from '../services/valoracionesService';

export default function MisValoraciones() {
  const [valoraciones, setValoraciones] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const datos = await obtenerMisValoraciones();
        setValoraciones(datos);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Mis valoraciones</h2>
      {valoraciones.length === 0 ? (
        <p>No tienes valoraciones todavía.</p>
      ) : (
        <ul className="space-y-3">
          {valoraciones.map(v => (
            <li key={v._id} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{v.paciente?.nombre} {v.paciente?.apellido}</strong>
                  <div className="text-sm text-gray-600">Especialidad: {v.especialidad}</div>
                </div>
                <div className="text-lg">{v.puntuacion} ★</div>
              </div>
              {v.comentario && <p className="mt-2">{v.comentario}</p>}
              <div className="text-xs text-gray-500 mt-2">{new Date(v.fecha).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
