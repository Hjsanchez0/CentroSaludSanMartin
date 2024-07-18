const Appointment = require('../models/appointment');
const sendEmail = require('../utils/email');

exports.createAppointment = async (req, res) => {
    const {
        role, especialidad, tipoServicio, estadoCita, doctor, fechaCita, turno,
        documentTypePac, documentNumberPac, pago, estadoPago, diagnostico, recetaMedica,
        documentType_extra, documentNumber_extra, nombres_extra,
        apellidoPat_extra, apellidoMat_extra, genero_extra,
        fechaNacimiento_extra, telefono_extra, enableEditing,
        cuenta, fechaPago, monto, codigoOperacion, foto
    } = req.body;

    try {
        let newAppointmentData = {
            documentTypePac,
            documentNumberPac,
            role,
            especialidad,
            tipoServicio,
            estadoCita,
            diagnostico,
            recetaMedica,
            doctor,
            fechaCita,
            turno,
            pago,
            estadoPago,
            cuenta,
            fechaPago,
            monto,
            codigoOperacion,
            foto
        };

        if (enableEditing) {
            newAppointmentData = {
                ...newAppointmentData,
                documentType_extra: documentType_extra,
                documentNumber_extra: documentNumber_extra,
                nombres_extra: nombres_extra,
                apellidoPat_extra: apellidoPat_extra,
                apellidoMat_extra: apellidoMat_extra,
                genero_extra: genero_extra,
                fechaNacimiento_extra: fechaNacimiento_extra,
                telefono_extra: telefono_extra,
                cuenta: cuenta,
                fechaPago: fechaPago,
                monto: monto,
                codigoOperacion: codigoOperacion,
                foto: foto
            };
        }

        const newAppointment = new Appointment(newAppointmentData);
        await newAppointment.save();

        const emailContent = `Su cita ha sido registrada correctamente\nDetalles de la cita:\nSu cita para la Especialidad de ${especialidad} con el Doctor(a) ${doctor} es el día ${fechaCita} a la hora ${turno}.\nSe recomienda llegar 20' minutos antes de la hora de la cita y portar su DNI.`;
        sendEmail(req.user.email, 'Registro de Cita Exitoso', emailContent);

        return res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error en la función createAppointment:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.getAppointments = async (req, res) => {
    const { documentTypePac, documentNumberPac, role } = req.query;

    try {
        const appointments = await Appointment.find({ documentTypePac, documentNumberPac, role });
        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Error en la función getAppointments:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.updateAppointmentPayment = async (req, res) => {
    const { id } = req.params;
    const { cuenta, fechaPago, monto, codigoOperacion, foto } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
            cuenta,
            fechaPago,
            monto,
            codigoOperacion,
            foto,
            estadoPago: 'Recepcionado'
        }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ msg: 'Cita no encontrada' });
        }

        return res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error en updateAppointmentPayment:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.checkAppointments = async (req, res) => {
    const { especialidad, doctor, fechaCita } = req.body;

    try {
        const citasRegistradas = await Appointment.find({ especialidad, doctor, fechaCita });
        return res.status(200).json(citasRegistradas);
    } catch (error) {
        console.error('Error en la función checkAppointments:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.getAppointmentsPatients = async (req, res) => {

    try {
        const appointments = await Appointment.find({});
        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Error en la función getAppointmentsPatients:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.updateStatusAppointmentsPatients = async (req, res) => {
    const { id } = req.params;
    const { estadoPago, estadoCita, diagnostico, recetaMedica } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, { estadoPago, estadoCita, diagnostico, recetaMedica }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ msg: 'Cita no encontrada' });
        }

        return res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error en updateStatusAppointmentsPatients:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.getAppointmentsPatients = async (req, res) => {

    try {
        const appointments = await Appointment.find({});
        return res.status(200).json(appointments);
    } catch (error) {
        console.error('Error en la función getAppointmentsPatients:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports.getAppointmentsPatientsXSpecialist = async (req, res) => {
    try {
        const { especialidad, doctor } = req.query;
        const appointments = await Appointment.find({ especialidad: especialidad, doctor: doctor });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pacientes' });
    }
};

exports.updateAppointmentRegister = async (req, res) => {
    const { id } = req.params;
    const { estadoCita, diagnostico, recetaMedica } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
            estadoCita,
            diagnostico,
            recetaMedica
        }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ msg: 'Cita no encontrada' });
        }

        return res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error('Error en updateAppointmentRegister:', error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};