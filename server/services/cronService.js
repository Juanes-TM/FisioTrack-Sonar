const cron = require('node-cron');
const Cita = require('../models/cita');
const Notificacion = require('../models/notificacion');

const iniciarCron = () => {
  // console.log('⏰ Sistema de notificaciones internas iniciado.');

  // Se ejecuta cada hora en el minuto 0
  cron.schedule('0 * * * *', async () => {
    try {
      const ahora = new Date();
      // Definimos el rango: Citas que empiezan entre dentro de 23h y 25h (margen de seguridad)
      // Queremos avisar "24 horas antes"
      const mananaInicio = new Date(ahora.getTime() + 23 * 60 * 60 * 1000); 
      const mananaFin = new Date(ahora.getTime() + 25 * 60 * 60 * 1000);

      // Buscar citas pendientes que serán mañana y que NO han sido notificadas
      const citasProximas = await Cita.find({
        startAt: { $gte: mananaInicio, $lt: mananaFin },
        estado: { $in: ['pendiente', 'confirmada'] },
        recordatorioEnviado: { $ne: true } 
      }).populate('paciente');

      if (citasProximas.length > 0) {
        console.log(`🔔 Generando ${citasProximas.length} notificaciones de recordatorio.`);

        for (const cita of citasProximas) {
          if (cita.paciente) {
            // 1. Crear la notificación en BD
            await Notificacion.create({
              usuario: cita.paciente._id,
              mensaje: `⏰ Recordatorio: Tienes una cita mañana a las ${new Date(cita.startAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
              tipo: 'recordatorio',
              citaId: cita._id
            });

            // 2. Marcar cita como notificada para no repetir
            cita.recordatorioEnviado = true;
            await cita.save();
          }
        }
      }
    } catch (error) {
      console.error('Error en cron notificaciones:', error);
    }
  });
};

module.exports = iniciarCron;