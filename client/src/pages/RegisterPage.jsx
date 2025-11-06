import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telephone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/register", formData);
      alert(res.data.msg || "Usuario registrado correctamente");

      // Tras el registro, redirige al login
      navigate("/login");
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      alert("Error en el registro. Verifica los campos o el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-teal-300">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-2xl font-semibold text-teal-700 mb-6">
          Crear cuenta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <input
            name="apellido"
            type="text"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <input
            name="telephone"
            type="tel"
            placeholder="Teléfono"
            value={formData.telephone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-teal-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
