const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: 'essalud611@outlook.com',
        pass: 'Essalud2023'
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'essalud611@outlook.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar correo:', error);
        } else {
            console.log('Correo enviado:', info.response);
        }
    });
};

module.exports = sendEmail;

