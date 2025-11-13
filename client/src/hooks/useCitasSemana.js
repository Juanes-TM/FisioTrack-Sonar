import { useEffect, useState } from "react";
import api from "../services/api";
import moment from "moment";

export const useCitasSemana = (fisioterapeutaId, semanaInicio) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fisioterapeutaId) return;

    const inicioISO = moment(semanaInicio).startOf("week").toISOString();
    const finISO = moment(semanaInicio).endOf("week").toISOString();

    api.get("/citas", {
      params: {
        fisioterapeuta: fisioterapeutaId,
        inicio: inicioISO,
        fin: finISO
      }
    })
      .then(res => setCitas(res.data))
      .catch(err => console.error("Error cargando citas:", err))
      .finally(() => setLoading(false));
  }, [fisioterapeutaId, semanaInicio]);

  return { citas, loading };
};
