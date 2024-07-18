const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

function createToken(user) {
  return jwt.sign({ id: user._id, documentNumber: user.documentNumber }, config.jwtSecret, {
    expiresIn: 10800
  });
}

module.exports.registro = async (req, res) => {
  try {
    const {
      documentType,
      documentNumber,
      role,
      sis,
      historialClinico,
      nombres,
      apellidoPat,
      apellidoMat,
      direccion,
      telefono,
      fechaNacimiento,
      genero,
      region,
      provincia,
      distrito,
      email,
      password,
      fechaRegistro
    } = req.body;

    const existingUser = await User.findOne({ documentNumber, role });
    if (existingUser) {
      return res.status(400).json({ msg: "Usuario ya registrado con el mismo número de documento" });
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ msg: "Correo electrónico ya registrado" });
    }

    const newUser = new User({
      documentType,
      documentNumber,
      role,
      sis,
      historialClinico,
      nombres,
      apellidoPat,
      apellidoMat,
      direccion,
      telefono,
      fechaNacimiento,
      genero,
      region,
      provincia,
      distrito,
      email,
      password,
      fechaRegistro
    });

    await newUser.save();

    return res.status(201).json({ msg: "Registro exitoso" });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.registroSpecialist = async (req, res) => {
  try {
    const {
      documentType,
      documentNumber,
      role,
      nombres,
      apellidoPat,
      apellidoMat,
      direccion,
      telefono,
      fechaNacimiento,
      genero,
      region,
      provincia,
      distrito,
      email,
      password,
      fechaRegistro
    } = req.body;

    const existingUser = await User.findOne({ documentNumber, role });
    if (existingUser) {
      return res.status(400).json({ msg: "Usuario ya registrado con el mismo número de documento" });
    }

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ msg: "Correo electrónico ya registrado" });
    }

    const newUser = new User({
      documentType,
      documentNumber,
      role,
      nombres,
      apellidoPat,
      apellidoMat,
      direccion,
      telefono,
      fechaNacimiento,
      genero,
      region,
      provincia,
      distrito,
      email,
      password,
      fechaRegistro
    });

    await newUser.save();

    return res.status(201).json({ msg: "Registro exitoso" });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const { role, documentNumber, password } = req.body;

    const user = await User.findOne({ role, documentNumber });

    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Las credenciales son incorrectas" });
    }

    return res.status(200).json({ token: createToken(user), role: user.role });
  } catch (error) {
    console.error("Error en la función signIn:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { email, direccion, telefono, region, provincia, distrito, password } = req.body;
    const updatedData = { email, direccion, telefono, region, provincia, distrito };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.json({ msg: "Perfil actualizado exitosamente", user });
  } catch (error) {
    console.error("Error en la función updateProfile:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'paciente' }).select('-password');
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error en getPatients:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Contraseña reestablecida exitosamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.resetPasswordSpecialist = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    return res.status(200).json({ msg: "Contraseña reestablecida exitosamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.getSpecialist = async (req, res) => {
  try {
    const specialists = await User.find({ role: { $ne: 'paciente' } });

    res.status(200).json(specialists);
  } catch (error) {
    console.error('Error en getSpecialist:', error);
    res.status(500).json({ error: 'Error al obtener los especialistas' });
  }
};

module.exports.deleteSpecialist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpecialist = await User.findByIdAndDelete(id);

    if (!deletedSpecialist) {
      return res.status(404).json({ msg: "Especialista no encontrado" });
    }

    return res.status(200).json({ msg: "Especialista eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar especialista:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.updateSpecialist = async (req, res) => {
  try {
    const { documentType, documentNumber, role, nombres, apellidoPat, apellidoMat, direccion, telefono, fechaNacimiento, genero, region, provincia, distrito, email, password } = req.body;

    const updatedData = {
      documentType,
      documentNumber,
      role,
      nombres,
      apellidoPat,
      apellidoMat,
      direccion,
      telefono,
      fechaNacimiento,
      genero,
      region,
      provincia,
      distrito,
      email
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const { id } = req.params;
    const updatedSpecialist = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSpecialist) {
      return res.status(404).json({ msg: "Especialista no encontrado" });
    }

    return res.status(200).json({ msg: "Datos del especialista actualizados correctamente", specialist: updatedSpecialist });
  } catch (error) {
    console.error("Error en la función updateSpecialist:", error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports.updatePatients = async (req, res) => {
  try {
      const { sis, historialClinico } = req.body;
      const { id } = req.params;

      const updatedPatient = await User.findByIdAndUpdate(id, { sis, historialClinico }, { new: true });

      if (!updatedPatient) {
          return res.status(404).json({ msg: "Paciente no encontrado" });
      }

      return res.json(updatedPatient);
  } catch (error) {
      console.error("Error en updatePatients:", error);
      return res.status(500).json({ msg: "Error interno del servidor" });
  }
};