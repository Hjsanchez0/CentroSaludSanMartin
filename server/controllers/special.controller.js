const User = require('../models/user');

exports.special = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: 'Usuario no autenticado' });
    }

    let userData;

    if (user.role === 'Administrador') {
      userData = await User.findOne({ documentNumber: user.documentNumber, role: 'Administrador' });
    } else if (user.role === 'Admision') {
      userData = await User.findOne({ documentNumber: user.documentNumber, role: 'Admision' });
    } else if (user.role === "Medicina General" || user.role === "Enfermeria" || user.role === "Nutricion" ||
      user.role === "Obstetricia" || user.role === "Odontologia" || user.role === "Psicologia") {
      userData = await User.findOne({
        documentNumber: user.documentNumber,
        role: { $in: ["Medicina General", "Enfermeria", "Nutricion", "Obstetricia", "Odontologia", "Psicologia"] }
      });
    }
    else {
      userData = await User.findOne({ documentNumber: user.documentNumber, role: 'paciente' });
    }

    if (!userData) {
      return res.status(404).json({ msg: 'Datos del usuario no encontrados' });
    }

    return res.json(userData);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};
