import { useEffect, useState } from "react";
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
      const user = await getProfile();
      setForm({
        nombre: user.nombre,
        apellido: user.apellido,
        telephone: user.telephone
      });
    }
    cargar();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await updateProfile(form);
    if (res.ok) {
      alert("Perfil actualizado correctamente");
      navigate("/profile", { replace: true });
    } else {
      setMsg(res.msg || "Error actualizando perfil");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-xl w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-teal-700">
          Editar mi perfil
        </h2>

        <label className="block text-left mb-2">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3"
        />

        <label className="block text-left mb-2">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3"
        />

        <label className="block text-left mb-2">Teléfono</label>
        <input
          type="text"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3"
        />

        {msg && <p className="text-red-500 text-sm mb-3">{msg}</p>}

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md"
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile", { replace: true }) }
          className="w-full mt-3 text-gray-700 underline"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
