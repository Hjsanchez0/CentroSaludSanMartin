const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const specialRoutes = require('./routes/special.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const suggestionRoutes = require('./routes/suggestion.routes');
const passport = require('passport');
const passportMiddleware = require('./middlewares/passport');

const base = "/cs-san-martin";
const app = express();

app.use(cors());
app.set('port', process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(passport.initialize());
passport.use(passportMiddleware);

app.get(`${base}`, (req, res) => {
    res.send(`La API está en http://192.168.18.79:${app.get('port')}${base}`)
});

app.use(authRoutes);
app.use(specialRoutes);
app.use(appointmentRoutes);
app.use(suggestionRoutes);

module.exports = app;
