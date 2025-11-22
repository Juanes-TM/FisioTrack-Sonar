//client/src/pages/dashboard/paciente/citas/CitasIndex.jsx
import { useSelector } from "react-redux";
import CitasPage from "./CitasPage"; // Tabla antigua (fisio/admin)
import CitasCalendar from "./CitasCalendar"; // Nuevo calendario mensual (paciente)

function CitasIndex() {
  const reduxUser = useSelector((state) => state.user.user);

  if (!reduxUser) return <p className="p-6">No autorizado</p>;

  const currentUser = reduxUser.user;

  // CAMBIO: Si es paciente, usa la vista de calendario mensual/histórico
  if (currentUser.rol === "cliente") {
    return <CitasCalendar modo="paciente" />; 
  }

  // Si es fisio o admin, usa el calendario antiguo (semanal/tablas)
  if (currentUser.rol === "fisioterapeuta" || currentUser.rol === "admin") {
    return <CitasCalendar modo={currentUser.rol} />; 
  }

  return <CitasPage />; // Fallback
}

export default CitasIndex;
