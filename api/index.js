const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');
const moment = require('moment');

const api = express();

// Support JSON-encoded bodies
api.use(bodyParser.json());
// Support URL-encoded bodies
api.use(bodyParser.urlencoded({
  extended: true,
}));
// allows cross origin requests (localhost:xxxx)
api.use(cors());

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to MYSQL database');
});

api.get('/', (req, res) => {
  connection.query('SELECT registrations.*, users.*, events.*, activities.* FROM registrations JOIN users ON users.id_user=registrations.user_id JOIN events ON events.id_event=registrations.event_id JOIN activities ON activities.id_activity=events.activity_id ;', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.get('/activities', (req, res) => {
  connection.query('SELECT * FROM activities', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.get('/registrations', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, result) => {
    const data = result.map((user, index) => ({
      idUser: user.id_user,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      birthday: moment(user.birthday).format('YYYY-MM-DD HH:mm:ss'),
      gender: user.gender,
      memberId: user.member_id,
      memberActive: user.member_active,
      membershipDateLast: moment(user.membership_date_last).format('YYYY-MM-DD HH:mm:ss'),
      membershipPlace: user.membership_place,
      adress: user.adress,
      zip: user.zip,
      city: user.city,
      neighborhood: user.neighborhood,
      imageCopyright: user.image_copyright,
      mailingActive: user.mailing_active,
    }))
    if (err) throw err;
    res.json(data);
  });
});

api.get('/events', (req, res) => {
  connection.query(
    'SELECT * FROM events',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    },
  );
});

api.put('/user/:id', (req, res) => {
  const idUser = req.params.id;
  const values = req.body;
  const data = {
    firstname: values.firstname,
    lastname: values.lastname,
    email: values.email,
    phone: values.phone,
    birthday: moment(values.birthday).format('YYYY-MM-DD HH:mm:ss'),
    gender: values.gender,
    member_id: values.memberId,
    member_active: values.memberActive,
    membership_date_last: moment(values.membershipDateLast).format('YYYY-MM-DD HH:mm:ss'),
    membership_place: values.membershipPlace,
    adress: values.adress,
    zip: values.zip,
    city: values.city,
    neighborhood: values.neighborhood,
    image_copyright: values.imageCopyright,
    mailing_active: values.mailingActive,
  }
  if (idUser) {
    connection.query('UPDATE users SET ? WHERE id_user = ?', [data, idUser], err => {
      if (err) {
        console.log(err);
        res.status(500).send("Erreur lors de la modification d'un adhérent");
      } else {
        res.sendStatus(200);
      }
    });
  }
});

api.post('/user/', (req, res) => {
  const values = req.body;
  {values.firstname ? values.firstname = `'${values.firstname}'` : values.firstname = null}
  {values.lastname ? values.lastname = `'${values.lastname}'` : values.lastname = null}
  {values.email ? values.email = `'${values.email}'` : values.email = null}
  {values.phone ? values.phone = `'${values.phone}'` : values.phone = null}
  {values.gender ? values.gender = `'${values.gender}'` : values.gender = null}
  {values.memberId ? values.memberId = `'${values.memberId}'` : values.memberId = null}
  {values.membershipPlace ? values.membershipPlace = `'${values.membershipPlace}'` : values.membershipPlace = null}
  {values.adress ? values.adress = `'${values.adress}'` : values.adress = null}
  {values.zip ? values.zip = `'${values.zip}'` : values.zip = null}
  {values.city ? values.city = `'${values.city}'` : values.city = null}
  {values.birthday ? values.birthday = `'${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}'` : values.birthday = null}
  {values.membershipDateLast ? values.membershipDateLast = `'${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}'` : values.membershipDateLast = null}

  connection.query(`INSERT INTO users (firstname, lastname, email, phone, birthday, gender, member_id, member_active, membership_date_last, membership_place, adress, zip, city, neighborhood, image_copyright, mailing_active) VALUES (${values.firstname}, ${values.lastname}, ${values.email}, ${values.phone}, ${values.birthday}, ${values.gender}, ${values.memberId}, ${values.memberActive}, ${values.membershipDateLast}, ${values.membershipPlace}, ${values.adress}, ${values.zip}, ${values.city}, ${values.neighborhood}, ${values.imageCopyright}, ${values.mailingActive})`, 
  (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send("Erreur lors de l'enregistrement de la réservation");
    } else {
      connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
        if (err) throw err;
        res.send(result);
      })
    }
  });
});

api.delete('/user/:id', (req, res) => {
  const idUser = req.params.id;
  connection.query('DELETE FROM users WHERE id_user = ?', [idUser], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'une réservation");
    } else {
      res.sendStatus(200);
    }
  });
});

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
