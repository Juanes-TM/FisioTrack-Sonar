// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, telephone } = req.body;

  // Validar que todos los campos existan
  if (!nombre || !apellido || !email || !password || !telephone) {
    return res.status(400).json({ msg: 'Faltan datos' });
  }

  try {
    // Verificar que el correo no esté registrado
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      telephone,
      rol: 'cliente'
    });

    // Guardar en la base de datos
    await nuevoUsuario.save();

    // Responder con éxito
    res.status(201).json({ msg: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;

