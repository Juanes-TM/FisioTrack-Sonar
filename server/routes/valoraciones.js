// server/routes/valoraciones.js
console.log(">>> CARGANDO RUTA VALORACIONES");

const express = require('express');
const router = express.Router();
const Valoracion = require('../models/valoraciones');
const Cita = require('../models/cita');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Crear una valoración (solo paciente que haya tenido cita completada con el fisio)
router.post('/', auth, async (req, res) => {
  try {
    const { fisioId, puntuacion, comentario, especialidad } = req.body;

    if (!fisioId || !puntuacion || !especialidad) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios' });
    }

    // comprobar que fisio existe
    const fisio = await User.findById(fisioId).lean();
    if (!fisio) return res.status(404).json({ msg: 'Fisioterapeuta no encontrado' });

    // solo pacientes pueden valorar
    if (req.userRole !== 'cliente') {
      return res.status(403).json({ msg: 'Solo pacientes pueden dejar valoraciones' });
    }

    // comprobar que el paciente tuvo al menos una cita completada con ese fisio
    const tuvoCita = await Cita.findOne({
      paciente: req.userId,
      fisioterapeuta: fisioId,
      estado: 'completada'
    }).lean();

    if (!tuvoCita) {
      return res.status(403).json({ msg: 'Solo puedes valorar fisioterapeutas con los que tuviste una cita completada' });
    }

    const nueva = new Valoracion({
      fisio: fisioId,
      paciente: req.userId,
      puntuacion: Number(puntuacion),
      comentario: comentario || '',
      especialidad
    });

    await nueva.save();
    return res.status(201).json({ msg: 'Valoración creada', valoracion: nueva });
  } catch (err) {
    console.error('Error creando valoración:', err);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Listar valoraciones de un fisioterapeuta
router.get('/fisio/:id', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find({ fisio: req.params.id })
      .populate('paciente', 'nombre apellido')
      .sort({ fecha: -1 });

    return res.json({ valoraciones });
  } catch (err) {
    console.error('Error listando valoraciones por fisio:', err);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Listar valoraciones por especialidad (filtrado)
router.get('/especialidad/:esp', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find({ especialidad: req.params.esp })
      .populate('fisio', 'nombre apellido')
      .sort({ fecha: -1 });

    return res.json({ valoraciones });
  } catch (err) {
    console.error('Error listando por especialidad:', err);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Fisioterapeuta: ver sus valoraciones
router.get('/mis-valoraciones', auth, async (req, res) => {
  try {
    if (req.userRole !== 'fisioterapeuta') return res.status(403).json({ msg: 'No autorizado' });

    const valoraciones = await Valoracion.find({ fisio: req.userId })
      .populate('paciente', 'nombre apellido')
      .sort({ fecha: -1 });

    return res.json({ valoraciones });
  } catch (err) {
    console.error('Error mis-valoraciones:', err);
    return res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;
