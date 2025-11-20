const express = require("express");
const app = express();

app.use(express.json());

// montamos las mismas rutas que en server.js
app.use("/api/citas", require("../../routes/citas"));
app.use("/api/admin", require("../../routes/admin"));
app.use("/api/profile", require("../../routes/profile"));
app.use("/api/disponibilidad", require("../../routes/disponibilidad"));
app.use("/api/fisioterapeutas", require("../../routes/fisioterapeutas"));
app.use("/api", require("../../routes/auth"));

module.exports = app;
