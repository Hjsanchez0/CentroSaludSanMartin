const { Router } = require('express');
const passport = require("passport");
const { special } = require("../controllers/special.controller");

const router = Router();

router.get("/cs-san-martin/special", passport.authenticate("jwt", { session: false }), special);

module.exports = router;
