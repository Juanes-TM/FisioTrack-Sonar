const express = require('express');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware para leer JSON del cuerpo de las peticiones
app.use(express.json());

// Leer config externa (fuera del repo Git)
const configPath = '/home/usuario/backend_config.json'; // Contiene la ip de la interfaz de red de la máquina y la URI de la BD
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const CLIENT_URL = config.CLIENT_URL;
const MONGO_URI = config.MONGO_URI; // credenciales de la base de datos

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1); // sale si no hay conexión
  })

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${CLIENT_URL}/`);
    res.send(response.data);
  } catch (error) {
    console.error('Error al obtener el HTML del cliente:', error.message);
    res.status(500).send('Error al cargar la interfaz del cliente');
  }
});

// Añadimos las rutas de autenticación (registro)
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor BACKEND escuchando en puerto ${PORT}`);
});
