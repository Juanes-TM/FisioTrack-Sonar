const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

// Middleware para permitir solo admins
function isAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado. Solo administradores." });
  }
  next();
}

// Listar todos los usuarios
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpires");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ msg: "Error al obtener usuarios", error: err.message });
  }
});

// Cambiar rol de un usuario
router.put("/users/:id/role", auth, isAdmin, async (req, res) => {
  const { rol } = req.body;
  if (!["cliente", "fisioterapeuta", "admin"].includes(rol)) {
    return res.status(400).json({ msg: "Rol no válido" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { rol }, { new: true });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.status(200).json({ msg: "Rol actualizado correctamente", user });
  } catch (err) {
    console.error("Error al cambiar rol:", err);
    res.status(500).json({ msg: "Error al cambiar el rol", error: err.message });
  }
});

// Eliminar un usuario
router.delete("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ msg: "Error al eliminar usuario", error: err.message });
  }
});

// Actualizar datos básicos de un usuario (nombre, email, teléfono)
router.put("/users/:id", auth, isAdmin, async (req, res) => {
  try {
    const { nombre, email, telephone } = req.body;

    if (!nombre || !email || !telephone) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Formato de email no válido" });
    }

    const telRegex = /^[0-9]{9}$/;
    if (!telRegex.test(telephone)) {
      return res.status(400).json({ msg: "El teléfono debe tener 9 dígitos" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email, telephone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({ msg: "Usuario actualizado correctamente", user });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
});

// Estadísticas generales del sistema (para AdminDashboard)
router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ rol: "admin" });
    const totalFisio = await User.countDocuments({ rol: "fisioterapeuta" });
    const totalClientes = await User.countDocuments({ rol: "cliente" });

    res.status(200).json({
      totalUsuarios,
      totalAdmins,
      totalFisio,
      totalClientes,
    });
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ msg: "Error al obtener estadísticas" });
  }
});

module.exports = router;
