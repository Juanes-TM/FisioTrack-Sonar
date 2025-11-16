// client/src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  // Extrae TOKEN desde resetLink del backend
  const extractTokenFromResetLink = (resetLink) => {
    try {
      const url = new URL(resetLink);
      const params = new URLSearchParams(url.search);
      return params.get("token") || "";
    } catch (e) {
      const m = resetLink?.match(/token=([^&]+)/);
      return m ? decodeURIComponent(m[1]) : "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setToken("");

    try {
      const res = await api.post("/api/forgot-password", { email });

      // Extraer token
      let returnedToken = res.data?.token || "";
      if (!returnedToken && res.data?.resetLink) {
        returnedToken = extractTokenFromResetLink(res.data.resetLink);
      }

      setMsg(res.data?.msg || "Token generado correctamente.");
      setToken(returnedToken);
    } catch (err) {
      console.error("ForgotPassword error:", err);
      const apiMsg = err.response?.data?.msg;
      setError(apiMsg || "Ocurrió un error inesperado");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1 font-medium text-gray-700">
            Correo electrónico
          </label>

          <input
            type="email"
            className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Generar Token
          </button>
        </form>

        {msg && (
          <p className="text-green-600 mt-4 font-semibold">{msg}</p>
        )}

        {error && (
          <p className="text-red-600 mt-4 font-semibold">{error}</p>
        )}

        {/* BLOQUE DEL TOKEN */}
        {token && (
          <div className="mt-5 p-4 bg-gray-50 border rounded">
            <p className="font-semibold mb-2">Tu token de recuperación:</p>

            <textarea
              readOnly
              className="w-full p-2 border rounded bg-white"
              value={token}
              rows={3}
            />

            {/* Copiar token */}
            <button
              type="button"
              className="mt-2 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(token);
                  alert("¡Token copiado al portapapeles!");
                } catch (e) {
                  const hidden = document.createElement("textarea");
                  hidden.value = token;
                  hidden.style.position = "fixed";
                  hidden.style.opacity = "0";
                  document.body.appendChild(hidden);
                  hidden.select();
                  document.execCommand("copy");
                  document.body.removeChild(hidden);
                  alert("¡Token copiado!");
                }
              }}
            >
              Copiar Token
            </button>

            {/* Ir a reset password */}
            <button
              type="button"
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() =>
                navigate("/reset-password", {
                  state: { token: token, email: email },
                })
              }
            >
              Ir a restablecer contraseña
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
