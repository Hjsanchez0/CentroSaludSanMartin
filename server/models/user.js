const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  documentType: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: true
  },
  sis: {
    type: String
  },
  historialClinico: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  nombres: {
    type: String,
    required: true
  },
  apellidoPat: {
    type: String,
    required: true
  },
  apellidoMat: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  provincia: {
    type: String,
    required: true
  },
  distrito: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  fechaRegistro: {
    type: String,
    required: true
  }

});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
