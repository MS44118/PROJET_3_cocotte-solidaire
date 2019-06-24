const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const api = express();

const privateKEY = fs.readFileSync('./.private.key', 'utf8');
const publicKEY = fs.readFileSync('./.public.key', 'utf8');

const signOptions = {
  expiresIn: "12h",
  algorithm: "RS256"
};

const verifyOptions = {
  expiresIn: "12h",
  algorithm: ["RS256"]
};

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

// to request all the datas from all the tables from the mysql DB cocotte_booking
// api.get('/', (req, res) => {
//   connection.query(
//     'SELECT registrations.*, users.*, events.*, activities.* FROM registrations JOIN users ON users.id_user=registrations.user_id JOIN events ON events.id_event=registrations.event_id JOIN activities ON activities.id_activity=events.activity_id;',
//     (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     }
//   );
// });
// SELECT registrations.*, users.*, events.*, activities.* 
// FROM registrations 
// JOIN users ON users.id_user=registrations.user_id 
//   JOIN events ON events.id_event=registrations.event_id 
//     JOIN activities ON activities.id_activity=events.activity_id
// ;

// to request all the future events from now() ==> EventHome.js
api.get('/api/future-events', (req, res) => {
  connection.query(
    'SELECT COUNT(registrations.event_id) as NB_REG, events.id_event, events.name_event, events.date_b, IFNULL(SUM(registrations.quantity_adult), 0) as nb_adults, IFNULL(SUM(registrations.quantity_children), 0) as nb_children, IFNULL(SUM(registrations.quantity_adult + registrations.quantity_children/2), 0) as nb_persons, events.capacity, COUNT(NULLIF(TRIM(users.email),"")) as nb_emails, COUNT(NULLIF(TRIM(registrations.allergie), "")) as nb_allergies,  COUNT(NULLIF(TRIM(registrations.comment), "")) as nb_comments  FROM events LEFT JOIN registrations ON registrations.event_id=events.id_event  LEFT JOIN users ON users.id_user=registrations.user_id GROUP BY events.id_event;',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});
// SELECT 
//   COUNT(registrations.event_id) as NB_REG,
//   events.id_event, 
//   events.name_event, 
//   events.date_b, 
//   IFNULL(SUM(registrations.quantity_adult), 0) as nb_adults, 
//   IFNULL(SUM(registrations.quantity_children), 0) as nb_children,
//   IFNULL(SUM(registrations.quantity_adult + registrations.quantity_children/2), 0) as nb_persons,
//   events.capacity,
//   COUNT(NULLIF(TRIM(users.email), "")) as nb_emails,
//   COUNT(NULLIF(TRIM(registrations.allergie), "")) as nb_allergies,
//   COUNT(NULLIF(TRIM(registrations.comment), "")) as nb_comments
//   FROM events 
// LEFT JOIN registrations ON registrations.event_id=events.id_event
//   LEFT JOIN users ON users.id_user=registrations.user_id
// ---------- CONDIITON WERE date_b > now() A RAJOUTER -----------------------
// GROUP BY events.id_event
// ;

// ---------- CONDIITON WERE date_b >  -----------------------
// WHERE events.date_b > NOW()
// WHERE events.date_b > "2019-06-13 09:00:00"
// WHERE events.date_b > "2019-06-14 09:00:00"

// to request all the future registrations from now() ==> ReservationHome.js
api.get('/api/future-registrations', (req, res) => {
  connection.query(
    'SELECT registrations.id_registration, users.firstname, users.lastname, users.email, users.phone, users.member_id, registrations.quantity_adult, registrations.quantity_children, registrations.event_id, registrations.allergie, registrations.comment FROM registrations JOIN users ON users.id_user=registrations.user_id JOIN events ON events.id_event=registrations.event_id JOIN activities ON activities.id_activity=events.activity_id GROUP BY registrations.id_registration;',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// here explain what it is for
api.get('/activities', (req, res) => {
  connection.query('SELECT * FROM activities', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// here explain what it is for
api.get('/users', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      connection.query('SELECT * FROM users WHERE anonym = 0', (err, result) => {
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
          adress: user.address_user,
          zip: user.zip,
          city: user.city,
          neighborhood: user.neighborhood,
          imageCopyright: user.image_copyright,
          mailingActive: user.mailing_active,
          anonym: user.anonym,
        }))
        if (err) throw err;
        res.json(data);
      });
    }
  });
});

api.put('/user/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idUser = req.params.id;
      const values = req.body;
      { values.firstname ? null : values.firstname = null }
      { values.lastname ? null : values.lastname = null }
      { values.email ? null : values.email = null }
      { values.phone ? null : values.phone = null }
      { values.gender ? null : values.gender = null }
      { values.memberId ? null : values.memberId = null }
      { values.membershipPlace ? null : values.membershipPlace = null }
      { values.adress ? null : values.adress = null }
      { values.zip ? null : values.zip = null }
      { values.city ? null : values.city = null }
      { values.birthday ? values.birthday = `${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}` : values.birthday = null }
      { values.membershipDateLast ? values.membershipDateLast = `${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}` : values.membershipDateLast = null }

      const data = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        phone: values.phone,
        birthday: values.birthday,
        gender: values.gender,
        member_id: values.memberId,
        member_active: values.memberActive,
        membership_date_last: values.membershipDateLast,
        membership_place: values.membershipPlace,
        address_user: values.adress,
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
    }
  });
});

api.post('/user/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const values = req.body;
      { values.firstname ? values.firstname = `'${values.firstname}'` : values.firstname = null }
      { values.lastname ? values.lastname = `'${values.lastname}'` : values.lastname = null }
      { values.email ? values.email = `'${values.email}'` : values.email = null }
      { values.phone ? values.phone = `'${values.phone}'` : values.phone = null }
      { values.gender ? values.gender = `'${values.gender}'` : values.gender = null }
      { values.memberId ? values.memberId = `'${values.memberId}'` : values.memberId = null }
      { values.membershipPlace ? values.membershipPlace = `'${values.membershipPlace}'` : values.membershipPlace = null }
      { values.adress ? values.adress = `'${values.adress}'` : values.adress = null }
      { values.zip ? values.zip = `'${values.zip}'` : values.zip = null }
      { values.city ? values.city = `'${values.city}'` : values.city = null }
      { values.birthday ? values.birthday = `'${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}'` : values.birthday = null }
      { values.membershipDateLast ? values.membershipDateLast = `'${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}'` : values.membershipDateLast = null }

      connection.query(`INSERT INTO users (firstname, lastname, email, phone, birthday, gender, member_id, member_active, membership_date_last, membership_place, address_user, zip, city, neighborhood, image_copyright, mailing_active, anonym) VALUES (${values.firstname}, ${values.lastname}, ${values.email}, ${values.phone}, ${values.birthday}, ${values.gender}, ${values.memberId}, ${values.memberActive}, ${values.membershipDateLast}, ${values.membershipPlace}, ${values.adress}, ${values.zip}, ${values.city}, ${values.neighborhood}, ${values.imageCopyright}, ${values.mailingActive}, false)`,
        (err, results) => {
          if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de l'enregistrement d'un utilisateur.");
          } else {
            connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
              if (err) throw err;
              res.send(result);
            })
          }
        });
    }
  });
});

api.put('/user/anonym/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idUser = req.params.id;
      const values = req.body;
      { values.birthday ? values.birthday = `${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}` : values.birthday = null }
      { values.membershipDateLast ? values.membershipDateLast = `${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}` : values.membershipDateLast = null }
      const data = {
        firstname: 'firstname',
        lastname: 'lastname',
        email: 'email@toto.com',
        phone: 'phone',
        birthday: values.birthday,
        gender: values.gender,
        member_id: values.memberId,
        member_active: values.memberActive,
        membership_date_last: values.membershipDateLast,
        membership_place: values.membershipPlace,
        address_user: 'address',
        zip: '00000',
        city: values.city,
        neighborhood: values.neighborhood,
        image_copyright: values.imageCopyright,
        mailing_active: values.mailingActive,
        anonym: true,
      }
      if (idUser) {
        connection.query('UPDATE users SET ? WHERE id_user = ?', [data, idUser], err => {
          if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de l'anonymisation");
          } else {
            res.sendStatus(200);
          }
        });
      }
    }
  });
});

api.post('/login/SignUp/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const values = req.body;
      bcrypt.hash(values.passwordSignUp, 10, (err, hash) => {
        connection.query(`INSERT INTO admins (email, password, name) VALUES ('${values.emailSignUp}', '${hash}', '${values.nameSignUp}')`,
          (err, results) => {
            if (err) {
              console.log(err)
              res.status(500).send("Erreur lors de l'enregistrement d'un nouvel admin.");
            } else {
              console.log('signUp OK')
              res.sendStatus(200);
            }
          });
      })
    }
  });
});

api.post('/login/', (req, res) => {
  const values = req.body;
  console.log('login')
  connection.query(`SELECT * FROM admins WHERE email='${values.emailSignIn}'`,
    (err, result) => {
      if (result.length === 0) {
        console.log(err)
        res.status(500).send("Erreur dans l'email.");
      } else {
        if (result.length > 0) {
          bcrypt.compare(values.passwordSignIn, result[0].password, (err, result) => {
            if (result === true) {
              console.log('signIn OK')
              const payload = { email: values.emailSignIn };
              const token = jwt.sign(payload, privateKEY, signOptions);
              res.send(token);
            } else {
              console.log('mauvais mot de passe')
              res.status(500).send("Erreur dans le mot de passe.");
            }
          });
        }
      }
    });
});

api.post('/auth/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      res.sendStatus(200)
    }
  });
});

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    console.log("ERROR VERIFY TOKEN")
    res.sendStatus(403);
  }
};
