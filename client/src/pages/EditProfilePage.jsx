import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telephone: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function cargar() {
      const data = await getProfile();
      setForm({
        nombre: data.nombre,
        apellido: data.apellido,
        telephone: data.telephone,
      });
    }
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateProfile(form);

    if (!res.ok) {
      setMsg(res.msg);
      return;
    }

    alert("Perfil actualizado correctamente");
    navigate("/profile", { replace: true });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            className="w-full p-2 border rounded"
          />

          {msg && <p className="text-red-500">{msg}</p>}

          <button className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile", { replace: true })}
            className="w-full text-gray-600 underline mt-3"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
