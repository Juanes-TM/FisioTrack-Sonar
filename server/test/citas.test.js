// test/citas.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken'); 
const fs = require('fs'); // Necesario para leer la config
const app = require('../server'); 
const Cita = require('../models/cita'); 
const User = require('../models/user'); 

// --- LECTURA DE LA CONFIGURACIÓN REAL ---
// El test lee el mismo secreto que usa el servidor para que los tokens sean válidos
const configPath = '/home/usuario/backend_config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const JWT_SECRET = config.JWT_SECRET;

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Helper para crear token usando el SECRETO REAL
const generateToken = (userId, role) => {
  // Estructura del payload: { id, rol } (sin anidar en 'user' para simplificar, o ajusta según prefieras)
  // Lo importante es que coincida con lo que espera auth.js
  return jwt.sign({ id: userId, rol: role }, JWT_SECRET, {
    expiresIn: '1h',
  });
};

describe('Rutas de Citas', () => {
  let pacienteUser;
  let fisioUser;
  let pacienteToken;
  let fisioToken;

  beforeEach(async () => {
    pacienteUser = await User.create({
      nombre: 'Paciente',
      apellido: 'Test',
      email: 'paciente@test.com',
      password: 'password123',
      telephone: '123456789',
      rol: 'cliente'
    });

    fisioUser = await User.create({
      nombre: 'Fisio',
      apellido: 'Test',
      email: 'fisio@test.com',
      password: 'password123',
      telephone: '987654321',
      rol: 'fisioterapeuta'
    });

    pacienteToken = generateToken(pacienteUser._id, 'cliente');
    fisioToken = generateToken(fisioUser._id, 'fisioterapeuta');
  });

  test('Crear cita correctamente (POST /api/citas)', async () => {
    const fechaInicio = new Date();
    fechaInicio.setHours(fechaInicio.getHours() + 24); 

    const res = await request(app)
      .post('/api/citas')
      // Usamos el formato estándar Bearer
      .set('Authorization', `Bearer ${pacienteToken}`) 
      .send({
        fisioterapeutaId: fisioUser._id,
        startAt: fechaInicio.toISOString(),
        durationMinutes: 60,
        motivo: 'Dolor de espalda',
        observaciones: 'Primera visita'
      });

    if (res.statusCode !== 201) console.log("Error creando cita:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('Cita creada correctamente');
  });

  test('No crear cita si falta fisioterapeutaId', async () => {
    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${pacienteToken}`)
      .send({
        startAt: new Date().toISOString(),
        motivo: 'Falta fisio'
      });

    expect(res.statusCode).toBe(400);
  });

  test('No crear cita por solapamiento', async () => {
    const start = new Date();
    start.setHours(start.getHours() + 24);
    const end = new Date(start.getTime() + 60 * 60000); 

    await Cita.create({
      paciente: pacienteUser._id,
      fisioterapeuta: fisioUser._id,
      startAt: start,
      endAt: end,
      durationMinutes: 60,
      motivo: 'Cita existente',
      createdBy: { user: pacienteUser._id, role: 'cliente' },
      estado: 'pendiente'
    });

    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${pacienteToken}`)
      .send({
        fisioterapeutaId: fisioUser._id,
        startAt: start.toISOString(), 
        durationMinutes: 60,
        motivo: 'Intento de solapamiento'
      });

    expect(res.statusCode).toBe(409);
  });

  test('Listar citas como cliente', async () => {
    await Cita.create({
      paciente: pacienteUser._id,
      fisioterapeuta: fisioUser._id,
      startAt: new Date(),
      endAt: new Date(),
      durationMinutes: 30,
      motivo: 'Consulta',
      createdBy: { user: pacienteUser._id, role: 'cliente' }
    });

    const res = await request(app)
      .get('/api/citas')
      .set('Authorization', `Bearer ${pacienteToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
  
  test('Fisio puede cambiar estado de cita', async () => {
    const cita = await Cita.create({
      paciente: pacienteUser._id,
      fisioterapeuta: fisioUser._id,
      startAt: new Date(),
      endAt: new Date(),
      durationMinutes: 30,
      motivo: 'Consulta',
      createdBy: { user: pacienteUser._id, role: 'cliente' },
      estado: 'pendiente'
    });

    const res = await request(app)
        .put(`/api/citas/${cita._id}/estado`)
        .set('Authorization', `Bearer ${fisioToken}`)
        .send({ estado: 'confirmada' });

    expect(res.statusCode).toBe(200);
    expect(res.body.cita.estado).toBe('confirmada');
  });
});
