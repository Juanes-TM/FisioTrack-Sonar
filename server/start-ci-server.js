const app = require('./server');
const mongoose = require('mongoose');

// Configuración específica para CI
const config = {
  JWT_SECRET: "ci_testing_secret_123",
  MONGO_URI: "mongodb://localhost:27017/testdb"
};

const startServer = async () => {
  try {
    console.log('Conectando a MongoDB...');
    
    // Conexión simplificada sin opciones deprecated
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const PORT = 3000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
    });

    // Manejar cierre graceful
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully');
      server.close(() => {
        mongoose.connection.close();
        console.log('Server stopped');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();