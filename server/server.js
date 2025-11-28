// ==================== DEPENDENCIAS ====================
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ==================== IMPORTAR RUTAS ====================
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin");
const citasRoutes = require("./routes/citas");
const fisioRoutes = require("./routes/fisioterapeutas");
const disponibilidadRoutes = require("./routes/disponibilidad");
const valoracionesRoutes = require("./routes/valoraciones");

// ==================== MONTAR RUTAS API ====================
app.use("/api/citas", citasRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/fisioterapeutas", fisioRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/valoraciones", valoracionesRoutes);
app.use("/api", authRoutes);

// ==================== FRONTEND REACT ====================
const CLIENT_DIST_PATH = path.join(__dirname, "../client/dist");
app.use(express.static(CLIENT_DIST_PATH));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(CLIENT_DIST_PATH, "index.html"));
});

// ==================== CONFIGURACIÓN ====================
const getConfig = () => {
  // Primero intenta con la ruta local (para CI y desarrollo)
  const localConfigPath = path.join(__dirname, "backend_config.json");
  if (fs.existsSync(localConfigPath)) {
    return JSON.parse(fs.readFileSync(localConfigPath, "utf-8"));
  }
  
  // Si no existe, usa la ruta absoluta (para producción en tu VM)
  const absoluteConfigPath = "/home/usuario/backend_config.json";
  if (fs.existsSync(absoluteConfigPath)) {
    return JSON.parse(fs.readFileSync(absoluteConfigPath, "utf-8"));
  }
  
  // Si no existe ningún archivo, usar valores por defecto para CI
  console.log("⚠️  No se encontró archivo de configuración, usando valores por defecto");
  return {
    JWT_SECRET: "ci_testing_secret_123",
    MONGO_URI: "mongodb://localhost:27017/testdb"
  };
};

// ==================== CONEXIÓN A MONGODB ====================
const connectDB = async () => {
  try {
    const config = getConfig();
    const MONGO_URI = config.MONGO_URI;

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(">>> CONECTADO A MONGODB <<<");
    return true;
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    return false;
  }
};

// ==================== INICIAR SERVIDOR ====================
if (require.main === module) {
  connectDB().then((connected) => {
    if (!connected) {
      console.log("⚠️  No se pudo conectar a MongoDB");
    }
    
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor BACKEND escuchando en puerto ${PORT}`);
    });

    // Manejo graceful de shutdown
    process.on('SIGTERM', () => {
      console.log('Received SIGTERM, shutting down gracefully');
      server.close(() => {
        mongoose.connection.close();
        process.exit(0);
      });
    });
  });
}

// Exportar solo la app para tests
module.exports = app;