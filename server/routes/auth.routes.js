const { Router } = require('express');
const passport = require("passport");
const { signIn, registro, registroSpecialist, updateProfile, 
    getPatients,resetPassword, resetPasswordSpecialist, updatePatients,
    getSpecialist, deleteSpecialist,updateSpecialist} = require('../controllers/user.controller');

const router = Router();

router.post('/cs-san-martin/signin', signIn);
router.post('/cs-san-martin/registro', registro);
router.put('/cs-san-martin/profile', passport.authenticate('jwt', { session: false }), updateProfile);
router.get('/cs-san-martin/patients', passport.authenticate('jwt', { session: false }), getPatients);
router.put('/cs-san-martin/patients/:id', passport.authenticate('jwt', { session: false }), resetPassword);
router.get('/cs-san-martin/specialist', passport.authenticate('jwt', { session: false }), getSpecialist);
router.post('/cs-san-martin/specialist/registro', passport.authenticate('jwt', { session: false }), registroSpecialist);
router.put('/cs-san-martin/specialist/:id', passport.authenticate('jwt', { session: false }), resetPasswordSpecialist);
router.delete('/cs-san-martin/specialist/:id', passport.authenticate('jwt', { session: false }), deleteSpecialist);
router.put('/cs-san-martin/specialist/edit/:id', passport.authenticate('jwt', { session: false }), updateSpecialist);
router.put('/cs-san-martin/update-patients/:id', passport.authenticate('jwt', { session: false }), updatePatients);

module.exports = router;
