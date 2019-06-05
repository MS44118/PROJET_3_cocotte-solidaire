const express = require('express');
const connection = require('./conf');

const api = express(); // initialise une application express appelée api

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

api.get('/registrations', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, result) => {
    if (err) throw err;
    res.send(result);
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

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
