const nodemailer = require("nodemailer");
const moment = require('moment');
const emailAuth = require('../.emailAuth');

const smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: emailAuth.user,
    pass: emailAuth.pass
  }
});

module.exports = {
  sendEmail: (data) => {
    console.log(data)
    smtpTransport.sendMail({
      from: "Aure Wild <aurelia.roumesy@gmail.com>", // Expediteur
      to: data.email, // Destinataires
      subject: "Reservation pour La Cocotte Solidaire !", // Sujet
      text: `Votre réservation pour l'évennement ${data.eventName} organisé le ${moment(data.eventDate).locale('fr').format('LLL')} a bien été enregistrée.
        Rappel: ${data.nbAdults} adulte(s) et ${data.nbChildrens} enfant(s)`, // plaintext body
      html: `Votre réservation pour l'évennement ${data.eventName} organisé le ${moment(data.eventDate).locale('fr').format('LLL')} a bien été enregistrée.
        Rappel: ${data.nbAdults} adulte(s) et ${data.nbChildrens} enfant(s)` // html body
    }, (error, response) => {
      if (error) {
        return error;
      } else {
        return "Message sent: " + response.message;
      }
    });
  }
} 