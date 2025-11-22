// client/src/pages/ValoracionForm.jsx
import { useState, useEffect } from 'react';
import { crearValoracion } from '../services/valoracionesService';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function ValoracionForm() {
  const [form, setForm] = useState({
    fisioId: '',
    puntuacion: 5,
    comentario: '',
    especialidad: ''
  });
  const [especialidades, setEspecialidades] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // si llamas con /valorar/:fisioId lo recogemos
    if (params.fisioId) setForm(f => ({ ...f, fisioId: params.fisioId }));

    // Opcional: pedir especialidades del backend si lo tienes
    (async () => {
      try {
        // si tienes un endpoint que devuelva especialidades del fisio: /api/fisioterapeutas/:id
        if (params.fisioId) {
          const res = await api.get(`/api/fisioterapeutas/${params.fisioId}`);
          // asumir que devuelve { especialidades: ['deporte','rehab'] } o similar
          setEspecialidades(res.data.especialidades || []);
          if (!form.especialidad && (res.data.especialidades || []).length > 0) {
            setForm(f => ({ ...f, especialidad: res.data.especialidades[0] }));
          }
        }
      } catch (err) {
        // no crítico
      }
    })();
  }, [params.fisioId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearValoracion(form);
      alert('Valoración enviada. Gracias!');
      navigate(-1);
    } catch (err) {
      console.error('Error creando valoración:', err.response || err);
      setMsg(err.response?.data?.msg || 'Error enviando valoración');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Dejar valoración</h2>

      {msg && <p className="text-red-500 mb-3">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" value={form.fisioId} />

        <div>
          <label className="block text-sm">Puntuación (1-5)</label>
          <select
            value={form.puntuacion}
            onChange={e => setForm({ ...form, puntuacion: e.target.value })}
            className="p-2 border rounded"
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm">Especialidad</label>
          <input
            value={form.especialidad}
            onChange={e => setForm({ ...form, especialidad: e.target.value })}
            placeholder="ej: traumatología, deportiva"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm">Comentario (opcional)</label>
          <textarea
            value={form.comentario}
            onChange={e => setForm({ ...form, comentario: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="flex gap-3">
          <button className="bg-teal-600 text-white px-4 py-2 rounded">Enviar</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
