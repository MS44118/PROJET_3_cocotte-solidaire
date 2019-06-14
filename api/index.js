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

api.post('/registrations', (req, res)=> { 
  const reservation = req.body
  console.log(reservation)
  connection.query(
    'INSERT INTO registrations (allergie) VALUES ?',reservation, (err, result)=>{
    if (err){
      console.log(err)
      res.status(500).send("error while saving")
    } else {
      res.sendStatus(200);
    }
  })
})

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
