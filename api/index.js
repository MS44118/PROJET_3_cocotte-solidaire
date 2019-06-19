const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');
const multer = require('multer');
// const upload = multer({ dest: 'tmp/' });
const fs = require('fs');

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

api.post('/activities', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO activities SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'une nouvelle activité");
    } else {
      res.sendStatus(200);
    }    
  });
});

api.put('/activities/:id', (req, res) => {
  const idActivity = req.params.id;
  const formData = req.body;
  connection.query('UPDATE activities SET ? WHERE id_activity = ?', [formData, idActivity], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'une activité");
    } else {
      res.sendStatus(200);
    }
  });
});

api.delete('/activities/:id', (req, res) => {
  const idActivity = req.params.id;
  connection.query('DELETE FROM activities WHERE id_activity = ?', [idActivity], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'une activité");
    } else {
      res.sendStatus(200);
    }
  });
});
//------------------------------------------------Upload file-------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

const upload = multer({ storage: storage }).single('file')

api.post('/uploaddufichier',function(req, res) { 
  upload(req, res, function (err) {
         if (err instanceof multer.MulterError) {
             return res.status(500).json(err)
         } else if (err) {
             return res.status(500).json(err)
         }
    return res.status(200).send(req.file)
  })
});

api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
