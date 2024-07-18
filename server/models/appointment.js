const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
  documentTypePac: { type: String, required: true },
  documentNumberPac: { type: String, required: true },
  role: { type: String, required: true },
  documentType_extra: { type: String },
  documentNumber_extra: { type: String },
  nombres_extra: { type: String },
  apellidoPat_extra: { type: String },
  apellidoMat_extra: { type: String },
  genero_extra: { type: String },
  fechaNacimiento_extra: { type: Date },
  telefono_extra: { type: String },
  especialidad: { type: String, required: true },
  tipoServicio: { type: String, required: true },
  estadoCita: { type: String, required: true },
  diagnostico: {type: String},
  recetaMedica: {type: String},
  doctor: { type: String, required: true },
  fechaCita: { type: String, required: true },
  turno: { type: String, required: true },
  pago: { type: String, required: true },
  estadoPago: { type: String, required: true },
  cuenta: { type: String },
  fechaPago: { type: String },
  monto: { type: String },
  codigoOperacion: { type: String },
  foto: { type: String }
});

module.exports = model('Appointment', appointmentSchema);
