import { useSelector } from "react-redux";
import CitasPage from "./CitasPage";
import CitasCalendar from "./CitasCalendar";

function CitasIndex() {
  const reduxUser = useSelector((state) => state.user.user);

  if (!reduxUser) return <p className="p-6">No autorizado</p>;

  const currentUser = reduxUser.user;  // <-- ACCESO REAL

  if (currentUser.rol === "cliente") {
    return <CitasCalendar modo="paciente" />;
  }

  if (currentUser.rol === "fisioterapeuta") {
    return <CitasCalendar modo="fisio" />;
  }

  return <CitasPage />;
}

export default CitasIndex;
