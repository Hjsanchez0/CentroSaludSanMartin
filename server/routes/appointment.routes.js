const { Router } = require('express');
const passport = require("passport");
const { createAppointment, getAppointments, checkAppointments, updateStatusAppointmentsPatients, updateAppointmentRegister,
    updateAppointmentPayment, getAppointmentsPatients, getAppointmentsPatientsXSpecialist} = require('../controllers/appointment.controller');

const router = Router();

router.post('/cs-san-martin/appointments', passport.authenticate('jwt', { session: false }), createAppointment);
router.get('/cs-san-martin/appointments', passport.authenticate('jwt', { session: false }), getAppointments);
router.post('/cs-san-martin/check-appointments', passport.authenticate('jwt', { session: false }), checkAppointments);
router.put('/cs-san-martin/appointments/:id', passport.authenticate('jwt', { session: false }), updateAppointmentPayment);
router.get('/cs-san-martin/appointments-patients', passport.authenticate('jwt', { session: false }), getAppointmentsPatients);
router.put('/cs-san-martin/appointments-patients/:id', passport.authenticate('jwt', { session: false }), updateStatusAppointmentsPatients);
router.get('/cs-san-martin/patientsxspecialist', passport.authenticate('jwt', {session: false}), getAppointmentsPatientsXSpecialist);
router.put('/cs-san-martin/appointmentspatientsxspecialist/:id', passport.authenticate('jwt', { session: false }), updateAppointmentRegister);
module.exports = router;
