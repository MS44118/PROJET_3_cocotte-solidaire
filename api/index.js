const express = require('express');
const mysql = require('mysql');

const api = express(); // initialise une application express appelée api
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'cocotte_booking',
  password: 'kernastellec',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to MYSQL database');
});

api.get('/', (req, res) => {
  res.send('welcome to "la cocotte solidaire" API');
});

api.get('/registrations', (req, res) => {
  connection.query('SELECT * FROM registrations', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.get('/events', (req, res) => {
  connection.query('SELECT * FROM events', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
