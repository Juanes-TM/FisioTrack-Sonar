const express = require('express');
const router = express.Router();
const Cita = require('../models/cita');
const User = require('../models/user');
const auth = require('../middleware/auth'); // tu middleware que fija req.userId y req.userRole

// Helper: comprueba solapamientos para un fisioterapeuta
async function haySolapamiento(fisioId, startAt, endAt) {
  return await Cita.findOne({
    fisioterapeuta: fisioId,
    estado: { $ne: 'cancelada' }, // ignorar citas canceladas
    $or: [
      { startAt: { $lt: endAt }, endAt: { $gt: startAt } } // overlap condition
    ]
  }).lean();
}

// Crear nueva cita
router.post('/', auth, async (req, res) => {
  const { fisioterapeutaId, startAt, durationMinutes, motivo, observaciones, lugar } = req.body;

  if (!fisioterapeutaId || !startAt || !durationMinutes || !motivo) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios (fisioterapeutaId, startAt, durationMinutes, motivo)' });
  }

  // parseo fechas (esperamos ISO 8601 en startAt)
  const start = new Date(startAt);
  if (isNaN(start.getTime())) return res.status(400).json({ msg: 'startAt no es una fecha válida (ISO 8601 esperada)' });

  const duration = Number(durationMinutes);
  if (!Number.isFinite(duration) || duration <= 0) return res.status(400).json({ msg: 'durationMinutes debe ser un número positivo' });

  const end = new Date(start.getTime() + duration * 60 * 1000);

  try {
    // comprobar que fisioterapeuta existe y tiene rol 'fisioterapeuta'
    const fisio = await User.findById(fisioterapeutaId).lean();
    if (!fisio) return res.status(404).json({ msg: 'Fisioterapeuta no encontrado' });
    if (fisio.rol !== 'fisioterapeuta' && req.userRole !== 'admin') {
      // solo admin puede asignar a un usuario que no sea fisio
      return res.status(400).json({ msg: 'El user especificado no es un fisioterapeuta' });
    }

    // comprobar solapamiento
    const overlap = await haySolapamiento(fisioterapeutaId, start, end);
    if (overlap) return res.status(409).json({ msg: 'El fisioterapeuta tiene otra cita en ese intervalo' });

    // crear cita
    const nueva = new Cita({
      paciente: req.userId,               // quien hace la petición (paciente) o admin
      fisioterapeuta: fisioterapeutaId,
      startAt: start,
      durationMinutes: duration,
      endAt: end,
      createdBy: { user: req.userId, role: req.userRole },
      motivo,
      observaciones: observaciones || '',
      lugar: lugar || 'Sala principal'
    });

    await nueva.save();
    return res.status(201).json({ msg: 'Cita creada', cita: nueva });

  } catch (err) {
    console.error('Error creando cita:', err);
    return res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

// Listar citas (filtrado según rol)
router.get('/', auth, async (req, res) => {
  try {
    const filtro = (req.userRole === 'fisioterapeuta')
      ? { fisioterapeuta: req.userId }
      : (req.userRole === 'admin' ? {} : { paciente: req.userId });

    const citas = await Cita.find(filtro)
      .populate('paciente', 'nombre apellido email')
      .populate('fisioterapeuta', 'nombre apellido email')
      .sort({ startAt: 1 });

    res.status(200).json(citas);
  } catch (err) {
    console.error('Error listando citas:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Actualizar observaciones / motivo (paciente puede editar observaciones, admin/fisio editan estado)
router.patch('/:id', auth, async (req, res) => {
  const { motivo, observaciones } = req.body;
  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });

    // solo administrador o creator pueden cambiar motivo; paciente solo observaciones
    if (motivo) {
      if (req.userRole !== 'admin' && String(cita.createdBy.user) !== String(req.userId)) {
        return res.status(403).json({ msg: 'No autorizado a cambiar el motivo' });
      }
      cita.motivo = motivo;
    }

    if (observaciones) {
      // paciente o fisio o admin pueden añadir observaciones
      cita.observaciones = observaciones;
    }

    await cita.save();
    res.status(200).json({ msg: 'Cita actualizada', cita });
  } catch (err) {
    console.error('Error actualizando cita:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

// Cambiar estado (confirmar, cancelar, completar) - ya tenías algo similar
router.put('/:id/estado', auth, async (req, res) => {
  const { estado } = req.body;
  if (!['pendiente','confirmada','cancelada','completada'].includes(estado)) {
    return res.status(400).json({ msg: 'Estado no válido' });
  }

  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });

    // Permisos: fisioterapeuta asignado o admin pueden cambiar estado
    if (req.userRole !== 'fisioterapeuta' && req.userRole !== 'admin') {
      return res.status(403).json({ msg: 'No autorizado para cambiar el estado' });
    }
    if (req.userRole === 'fisioterapeuta' && String(cita.fisioterapeuta) !== String(req.userId)) {
      return res.status(403).json({ msg: 'Solo el fisioterapeuta asignado puede cambiar el estado' });
    }

    cita.estado = estado;
    await cita.save();
    res.status(200).json({ msg: 'Estado actualizado', cita });
  } catch (err) {
    console.error('Error actualizando estado:', err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router;
