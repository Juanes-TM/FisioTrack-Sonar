import api from "./api";

export const obtenerSemana = async (fisioId) => {
  const res = await api.get(`/api/disponibilidad/semana/${fisioId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  return res.data;
};

export const guardarSemanaService = async (fisioId, horarios) => {
  const payload = {
    fisio: fisioId,
    dias: Object.entries(horarios).map(([nombre, horas]) => ({
      nombre,
      horas
    }))
  };

  const res = await api.put(
    `/api/disponibilidad/semana`,
    payload,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
  );

  return res.data;
};
