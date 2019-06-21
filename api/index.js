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
 
  if (reservation.existantUser === false){
    connection.query(`INSERT INTO users (firstname,lastname,email,phone,member_id,anonym) VALUES ("${reservation.firstName}","${reservation.lastname}","${reservation.email}","${reservation.phone}","${reservation.idUser}",false)`, reservation, (err, result)=>{
      if (err){
        console.log(err)
        res.status(500).send("error while saving")
      } else{
    connection.query(`SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1` ,(err, result) => {
        if(err){
          console.log(err)
  
        }else{
          console.log(result[0].id_user)
          connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie, comment, user_id) VALUES("${reservation.numberAdultReservation}","${reservation.numberchildrenReservation}","${reservation.reservationAllergie}","${reservation.reservationInfo}","${result[0].id_user}")`, 
            reservation, (err, result)=>{
              if (err) {
                console.log(err)
                res.status(500).send("error while saving")
              }else {
                res.status(200)
              }
            });
        }
      })
      }
    })
  }
});
    
//   connection.query(
 

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
