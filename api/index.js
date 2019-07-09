const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');
const moment = require('moment');
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
// api.use(cors());
api.use(cors({ origin: '*' }));

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
api.get('/users', (req, res) => {
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
});

api.put('/user/:id', (req, res) => {
  const idUser = req.params.id;
  const values = req.body;
  {values.firstname ? null : values.firstname = null}
  {values.lastname ? null : values.lastname = null}
  {values.email ? null : values.email = null}
  {values.phone ? null : values.phone = null}
  {values.gender ? null : values.gender = null}
  {values.memberId ? null : values.memberId = null}
  {values.membershipPlace ? null : values.membershipPlace = null}
  {values.adress ? null : values.adress = null}
  {values.zip ? null : values.zip = null}
  {values.city ? null : values.city = null}
  {values.birthday ? values.birthday = `${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}` : values.birthday = null}
  {values.membershipDateLast ? values.membershipDateLast = `${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}` : values.membershipDateLast = null}

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
});

api.put('/user/anonym/:id', (req, res) => {
  const idUser = req.params.id;
  const values = req.body;
  {values.birthday ? values.birthday = `${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}` : values.birthday = null}
  {values.membershipDateLast ? values.membershipDateLast = `${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}` : values.membershipDateLast = null}
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
});

//-------------------------------------------------------ACTIVITIES-----------------------------------------
api.get('/activities', (req, res) => {
  connection.query('SELECT * FROM activities', (err, result) => {
    const data = result.map((activity, index) => ({
      id_activity: activity.id_activity,
      name: activity.name_activity,
      description : activity.description_activity,
      picture: activity.picture_activity
    }))
    if (err) throw err;
    res.send(data);
  });
});

api.post('/activities', (req, res) => {
  const formData = req.body;
  const data = {
    name_activity: formData.name,
    description_activity: formData.description,
    picture_activity: formData.picture
  }
  connection.query('INSERT INTO activities SET ?', data, (err, results) => {
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
  console.log(idActivity);
  const formData = req.body;
  const data = {
    name_activity: formData.name,
    description_activity: formData.description,
    picture_activity: formData.picture
  }
  connection.query('UPDATE activities SET ? WHERE id_activity = ?', [data, idActivity], err => {
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
  console.log(idActivity);
  
  connection.query('DELETE FROM activities WHERE id_activity = ?', [idActivity], err => {
    if (err) {
      console.log(err.errno);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

//-------Upload file------

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
 
var upload = multer({ storage: storage })

api.post('/uploaddufichier', upload.single('file'), (req, res, next) => {
  const file = req.file
  console.log(file);
  console.log(req.headers);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)
})

//-------delete file--------
api.delete('/deletefile/:file', function(req, res) {
  let file = req.params.file;
  fs.stat(`../public/images/${file}`, function(err) {
    if (!err) {
      fs.unlink(`../public/images/${file}`, function(err) {
        if (err) throw err;
        console.log('file deleted');
      })
    }
    else if (err.code === 'ENOENT') {
      console.log('file or directory does not exist');
    }
  })
});

//---------------------------------------------------EVENTS---------------------------------------------------------
api.get('/events', (req, res) => {
  connection.query('SELECT * FROM events', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

api.get('/events/:id', (req, res) => {
  const idEvent = req.params.id;
  // console.log(idEvent);

  connection.query('SELECT * FROM events WHERE id_event = ?', idEvent, (err, result) => {
    if (err) throw err;
    let theEvents = result[0];
    // console.log(theEvents);
    // console.log(theEvents.id_event);
    if (result[0].name_event === '' || result[0].description_event === '' || result[0].picture_event === '') {
      connection.query('SELECT * FROM activities WHERE id_activity = ?', result[0].activity_id, (error, resultat) => {
        if (error) throw error;
        theEvents.name_event = theEvents.name_event !== '' ? theEvents.name_event : resultat[0].name_activity;
        theEvents.description_event = theEvents.description_event !== '' ? theEvents.description_event : resultat[0].description_activity;
        theEvents.picture_event = theEvents.picture_event !== '' ? theEvents.picture_event : resultat[0].picture_activity;
        res.send(result);
      })
    } else {
      res.send(result);
    }
  });
});

api.post('/events', (req, res) => {
  const formData = req.body;
  const data = {
    date_b: formData.dateB,
    date_e: formData.dateE,
    name_event: formData.nameEvent,
    capacity: formData.capacity,
    address_event: formData.addressEvent,
    description_event: formData.descriptionEvent,
    picture_event: formData.pictureEvent,
    activity_id: formData.activityId,
  }
  console.log(data);
  connection.query('INSERT INTO events SET ?', data, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un nouveau evenement");
    } else {
      res.sendStatus(200);
    }    
  });
});

api.put('/events/:id', (req, res) => {
  const idEvent = req.params.id;
  const formData = req.body;
  const data = {
    date_b: formData.dateB,
    date_e: formData.dateE,
    name_event: formData.nameEvent,
    capacity: formData.capacity,
    address_event: formData.addressEvent,
    description_event: formData.descriptionEvent,
    picture_event: formData.pictureEvent,
    activity_id: formData.activityId,
  }
  console.log(data);
  connection.query('UPDATE events SET ? WHERE id_event = ?', [data, idEvent], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un nouveau evenement");
    } else {
      res.sendStatus(200);
    }
  });
});


api.listen(8000, 'localhost', (err) => {
  if (err) throw err;
  console.log('API is running on localhost:8000');
});
