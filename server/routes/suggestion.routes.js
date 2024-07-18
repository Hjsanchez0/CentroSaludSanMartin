const { Router } = require('express');
const { suggestSpecialty } = require('../controllers/suggestion.controller');

const router = Router();

router.post('/cs-san-martin/suggest-specialty', suggestSpecialty);

module.exports = router;
