const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true},
  email:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: {type: String, required: true},
  rol: { type: String, enum: ['cliente', 'fisioterapeuta', 'admin'], default: 'cliente' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
