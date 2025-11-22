// client/src/services/valoracionesService.js
import api from './api';

// Crear valoración
export async function crearValoracion(payload) {
  // payload: { fisioId, puntuacion, comentario, especialidad }
  const res = await api.post('/api/valoraciones', payload);
  return res.data;
}

// Obtener valoraciones de fisio
export async function obtenerValoracionesFisio(fisioId) {
  const res = await api.get(`/api/valoraciones/fisio/${fisioId}`);
  return res.data.valoraciones;
}

// Obtener valoraciones por especialidad
export async function obtenerPorEspecialidad(esp) {
  const res = await api.get(`/api/valoraciones/especialidad/${encodeURIComponent(esp)}`);
  return res.data.valoraciones;
}

// Obtener mis valoraciones (si eres fisio)
export async function obtenerMisValoraciones() {
  const res = await api.get('/api/valoraciones/mis-valoraciones');
  return res.data.valoraciones;
}
