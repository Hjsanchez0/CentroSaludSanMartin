const mongoose = require("mongoose");
const config = require("./config/config");

mongoose.connect(config.DB.URI);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Conexión establecida con MongoDB');
});

connection.on('error', err => {
    console.error(err);
    process.exit(0);
});
