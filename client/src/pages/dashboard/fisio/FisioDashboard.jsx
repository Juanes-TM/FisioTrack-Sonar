import { Link } from "react-router-dom";


export default function FisioDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del Fisioterapeuta</h1>
      <p>Bienvenido al panel del fisioterapeuta. Aquí podrás gestionar tu disponibilidad y tus pacientes.</p>
      <br />
      <Link
          to="/profile"
          className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 text-sm"
        >
          Ver mi perfil
        </Link>
    </div>
  );
}
