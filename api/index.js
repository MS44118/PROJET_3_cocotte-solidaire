const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');

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

// to request all the datas from all the tables from the mysql DB cocotte_booking
api.get('/', (req, res) => {
  connection.query(
    'SELECT registrations.*, users.*, events.*, activities.* FROM registrations JOIN users ON users.id_user=registrations.user_id JOIN events ON events.id_event=registrations.event_id JOIN activities ON activities.id_activity=events.activity_id;',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});
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

// for registrations listing in homepage '/' (components ReservationHome.js)
api.get('/registrations', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// here explain what it is for
api.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// here explain what it is for
api.get('/events', (req, res) => {
  connection.query(
    'SELECT * FROM events',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    },
  );
});

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
