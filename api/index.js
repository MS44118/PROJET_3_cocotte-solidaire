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
    if (err) throw err;
    res.json(result);
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

api.post('/zboub/', (req,res)=>{
  const reservation = req.body
 
  connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie, comment) VALUES("${reservation.numberAdultReservation}","${reservation.numberchildrenReservation}","${reservation.reservationAllergie}","${reservation.reservationInfo}")`, reservation, (err, result)=>{
    if (err) {
      console.log(err)
      res.status(500).send("error while saving")
    }else {
      res.status(200)
    }
  });
  if (reservation.existantUser === false){
  connection.query(`INSERT INTO users (firstname,lastname,email,phone,member_id) VALUES ("${reservation.newReservationFirstName}","${reservation.newReservationName}","${reservation.newReservationMail}","${reservation.phoneNumber}","${reservation.newReservationUserId}")`, reservation, (err, result)=>{
    if (err){
      console.log(err)
      res.status(500).send("error while saving")
    } else {
      res.sendStatus(200)
    }
  });
};
});

// api.post('/newReservation/', (req,res)=>{
//   const reservation= req.body
//   console.log(req.body)

// });

// api.put('/changeUser', (req,res)=>{
//   const reservationData = req.body

// })

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
