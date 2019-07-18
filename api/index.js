const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./conf');
const moment = require('moment');
const multer = require('multer');
const sendEmail = require('../api/Utils/mailUtil').sendEmail;
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
// api.use(cors());
api.use(cors({ origin: '*' }));

// rendre les images accessible
api.use('/images', express.static('./images'));

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to MYSQL database');
});


//---------------------------------------------------HOME---------------------------------------------------------

// to request all the future events from today 00:00 ==> EventHome.js
api.get('/api/future-events', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT COUNT(registrations.event_id) as NB_REG, events.id_event, events.name_event, activities.id_activity, activities.name_activity, events.date_b, events.date_e, SUM(IFNULL(registrations.quantity_adult, 0)) as nb_adults, SUM(IFNULL(registrations.quantity_children, 0)) as nb_children, SUM(IFNULL(registrations.quantity_adult + registrations.quantity_children/2, 0)) as nb_persons, events.capacity, COUNT(NULLIF(TRIM(users.email), "")) as nb_emails, COUNT(NULLIF(TRIM(registrations.allergie), "")) as nb_allergies, COUNT(NULLIF(TRIM(registrations.comment), "")) as nb_comments FROM events LEFT JOIN activities ON activities.id_activity=events.activity_id LEFT JOIN registrations ON registrations.event_id=events.id_event LEFT JOIN users ON users.id_user=registrations.user_id WHERE events.date_b >= CURDATE() GROUP BY events.id_event ORDER BY events.date_b ASC;',
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    }
  })
});

// to request all the future registrations from today 00:00 ==> EventHome.js
api.get('/api/future-registrations', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT users.firstname, users.lastname, users.email, users.phone, users.member_id, registrations.id_registration, registrations.quantity_adult, registrations.quantity_children, registrations.event_id, registrations.allergie, registrations.comment, COUNT(NULLIF(TRIM(users.email), "")) as nb_emails, COUNT(NULLIF(TRIM(registrations.allergie), "")) as nb_allergies, COUNT(NULLIF(TRIM(registrations.comment), "")) as nb_comments FROM registrations JOIN users ON users.id_user=registrations.user_id JOIN events ON events.id_event=registrations.event_id JOIN activities ON activities.id_activity=events.activity_id WHERE events.date_b >= CURDATE() GROUP BY registrations.id_registration;',
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    }
  })
});


//-------------------------------------------------------USERS-----------------------------------------
api.get('/api/users', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      connection.query('SELECT id_user, firstname, lastname, email, phone, member_id FROM users WHERE anonym = 0', (err, result) => {
        const data = result.map((user, index) => ({
          idUser: user.id_user,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          memberId: user.member_id,
        }))
        if (err) throw err;
        res.json(data);
      });
    }
  });
});

api.get('/api/user/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      connection.query(`SELECT * FROM users WHERE id_user = ${req.params.id}`, (err, result) => {
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

api.put('/api/user/:id', verifyToken, (req, res) => {
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

api.post('/api/user/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const values = req.body;
      { values.memberId ? values.memberId = parseInt(values.memberId, 10) : values.memberId = null }
      { values.zip ? values.zip = parseInt(values.zip, 10) : values.zip = null }
      { values.birthday ? values.birthday = `'${moment(values.birthday).format("YYYY-MM-DD HH:mm:ss")}'` : values.birthday = null }
      { values.membershipDateLast ? values.membershipDateLast = `'${moment(values.membershipDateLast).format("YYYY-MM-DD HH:mm:ss")}'` : values.membershipDateLast = null }
    
      connection.query(`INSERT INTO users (firstname, lastname, email, phone, birthday, gender, member_id, member_active, membership_date_last, membership_place, address_user, zip, city, neighborhood, image_copyright, mailing_active, anonym) VALUES ('${values.firstname}', '${values.lastname}', '${values.email}', '${values.phone}', ${values.birthday}, '${values.gender}', ${values.memberId}, ${values.memberActive}, ${values.membershipDateLast}, '${values.membershipPlace}', '${values.adress}', ${values.zip}, '${values.city}', ${values.neighborhood}, ${values.imageCopyright}, ${values.mailingActive}, false)`,
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
        })
    }
  });
});

api.put('/api/user/anonym/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idUser = req.params.id;
      console.log(idUser)
      if (idUser) {
        connection.query(`SELECT * FROM users WHERE id_user='${idUser}'`,
          (err, result) => {
            if (err) {
              console.log(err)
              res.sendStatus(403);
            } else {
              const values = result[0]
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
              console.log(data)
              connection.query('UPDATE users SET ? WHERE id_user = ?', [data, idUser], err => {
                if (err) {
                  console.log(err);
                  res.status(500).send("Erreur lors de l'anonymisation");
                } else {
                  res.sendStatus(200);
                }
              });
            }
          })
      }
    }
  });
});

//-------------------------------------------------------SIGNIN/SIGNUP-----------------------------------------

// api.post('/api/login/SignUp/', (req, res) => {
api.post('/api/login/SignUp/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const values = req.body;
      console.log(values)
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

api.post('/api/login/', (req, res) => {
  const values = req.body;
  console.log('login')
  connection.query(`SELECT * FROM admins WHERE email='${values.emailSignIn}'`,
    (err, result) => {
      if (result.length === 0) {
        console.log(err)
        res.status(500).send("Erreur dans l'email ou le mot de passe.");
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
              res.status(500).send("Erreur dans l'email ou le mot de passe.");
            }
          });
        }
      }
    });
});

api.post('/api/auth/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      res.sendStatus(200)
    }
  });
});

//-------------------------------------------------------ACTIVITIES-----------------------------------------
api.get('/api/activities', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
    }
  });
});

api.post('/api/activities', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
    }
  });
});

api.put('/api/activities/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
    }
  });
});

api.delete('/api/activities/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idActivity = req.params.id;
      console.log(idActivity);
      
      connection.query('DELETE FROM activities WHERE id_activity = ?', [idActivity], err => {
        if (err) {
          if (err.errno === 1451) {
            res.status(503).send("Erreur lors de la suppression d'une activité");
          } else {
            res.status(500).send("Erreur lors de la suppression d'une activité");
          }
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// to delete a specific event 
api.delete('/api/event/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idEvent = req.params.id;
      console.log(`lancement suppression de l'evenement ${idEvent}: `);
      // controle si l'evenement existe
      connection.query(`SELECT COUNT(id_event) as nb_event FROM events WHERE id_event = ? `, [idEvent], (err, result) => {
        if (err) {
          console.log(`Erreur lors de l'appel a la base de données: ${err}`);
          res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
        };
        if (result[0].nb_event === 0) {
          console.log(`l'évènement n°${idEvent} n'existe pas.`);
          res.status(410).send(`l'évènement n°${idEvent} n'existe pas.`);
        } else {
          // controle si l'evenement contient des inscriptions
          connection.query(`SELECT IFNULL(SUM(registrations.quantity_adult + registrations.quantity_children/2), 0) as nb_persons, events.id_event FROM events LEFT JOIN registrations ON registrations.event_id=events.id_event WHERE events.id_event = ? GROUP BY events.id_event`, [idEvent], (err, result) => {
            if (err) {
              console.log(`Erreur lors de l'appel a la base de données: ${err}`);
              res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
            };

            if (result[0].nb_persons === 0) {
              // supprime l'evenement (si evenement existant et pas d'inscription)
              connection.query('DELETE FROM events WHERE id_event = ?', [idEvent], (err, result) => {
                if (err) {
                  console.log(`Erreur lors de la suppression d'un évènement: ${err}`);
                  res.status(500).send(`Erreur lors de la suppression d'un évènement: ${err}`);
                } else {
                  console.log(`l'évènement n°${idEvent} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
                  res.status(200).send(`l'évènement n°${idEvent} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`)
                }
              });
            } else {
              console.log(`l'évènement n°${idEvent} contient des réservations. il faut supprimer les réservations concernées avant de pouvoir supprimer l'évènement`)
              res.status(304).send(`l'évènement n°${idEvent} contient des réservations. il faut supprimer les réservations concernées avant de pouvoir supprimer l'évènement`)
            };

          });
        }
      });
    }
  })
});

// to delete a specific registration 
  api.delete('/api/registration/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const idRegistration = req.params.id;
      console.log(`lancement suppression de l'inscription ${idRegistration}: `);
      // controle si l'inscription existe
      connection.query(`SELECT COUNT(id_registration) as nb_registration FROM registrations WHERE id_registration = ? `, [idRegistration], (err, result) => {
        if (err) {
          console.log(`Erreur lors de l'appel a la base de données: ${err}`);
          res.status(500).send(`Erreur lors de l'appel a la base de données: ${err}`);
        };
        if (result[0].nb_registration === 0) {
          console.log(`l'inscription n°${idRegistration} n'existe pas.`);
          res.status(410).send(`l'inscription n°${idRegistration} n'existe pas.`);
        } else {
          // supprime l'inscription 
          connection.query('DELETE FROM registrations WHERE id_registration = ?', [idRegistration], (err, result) => {
            if (err) {
              console.log(`Erreur lors de la suppression d'un inscription: ${err}`);
              res.status(500).send(`Erreur lors de la suppression d'un inscription: ${err}`);
            } else {
              console.log(`l'inscription n°${idRegistration} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
              res.status(200).send(`l'inscription n°${idRegistration} vient d'être supprimé (${result.affectedRows} affectedRows, ${result.warningCount} warnings)`);
            }
          });
        }
      });
    }
  })
});

//------------------------------------------------Upload image-------------------------------------------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage })

api.post('/api/uploaddufichier', verifyToken, upload.single('file'), (req, res, next) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const file = req.file
      if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
      }
      res.send(file)
    }
  });
})

//------------------------------------------------delete image------------------------------------------------
api.delete('/api/deletefile/:file', verifyToken, function(req, res) {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      let file = req.params.file;
      console.log(file);
      fs.stat(`./images/${file}`, function(err) {
        if (!err) {
          fs.unlink(`./images/${file}`, function(err) {
            if (err) throw err;
            console.log('file deleted');
          })
        }
        else if (err.code === 'ENOENT') {
          console.log('file or directory does not exist');
          console.log(err);
        }
      })
    }
  });
})


//------------------------------------------------xxxxxxxx------------------------------------------------

api.get('/api/events', (req, res) => {
  connection.query(
    'SELECT * FROM events',
    (err, result) => {
      if (err) throw err;
      res.send(result);
    },
  );
});

//registration post
api.post('/api/zboub/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    const reservation = req.body
    console.log(reservation)
    // console.log(reservation)
    { reservation.memberNumber ? reservation.memberNumber = `'${reservation.memberNumber}'` : reservation.memberNumber = null }
    { reservation.quantityAdult ? reservation.quantityAdult = parseInt(`${reservation.quantityAdult}`, 10) : reservation.quantityAdult = null }
    { reservation.quantityChildren ? reservation.quantityChildren = parseInt(`${reservation.quantityChildren}`, 10) : reservation.quantityChildren = null }
    //  console.log(reservation.quantityAdult)
    if (reservation.existantUser === false) {
      connection.query(`INSERT INTO users (firstname,lastname,email,phone,anonym,member_id) VALUES ("${reservation.firstname}","${reservation.lastname}","${reservation.email}","${reservation.phone}",false, ${reservation.memberNumber})`, reservation, (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send("error while saving")
        } else {
          connection.query(`SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1`, (err, result) => {
            if (err) {
              console.log(err)
            } else {
              connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie,comment , user_id, event_id) VALUES(${reservation.quantityAdult},${reservation.quantityChildren},"${reservation.allergies}","${reservation.comment}",${result[0].id_user},${reservation.eventId})`,
                reservation, (err, result) => {
                  if (err) {
                    console.log(err)
                    res.status(500).send("error while saving")
                  } else {
                    res.sendStatus(200)
                  }
                });
            }
          })
        }
      })
    } else {
      connection.query(`INSERT INTO registrations(quantity_adult , quantity_children, allergie, comment, user_id, event_id) VALUES(${reservation.quantityAdult},${reservation.quantityChildren},"${reservation.allergies}","${reservation.comment}","${reservation.idUser}",${reservation.eventId})`,
        reservation, (err, result) => {
          if (err) {
            console.log(err)
            res.status(500).send("error while saving")
          } else {
            res.sendStatus(200)
          }
        }
      );
    }
  })
});

api.get('/api/registration/:id',verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    const param = req.params.id
    console.log(param)
    const data= req.body
    console.log(data)
    connection.query(`SELECT registrations.*, users.lastname, users.firstname, users.phone, users.email, users.member_id, events.name_event, events.date_b FROM registrations LEFT JOIN users ON users.id_user=registrations.user_id  LEFT JOIN events ON events.id_event=registrations.event_id WHERE id_registration= '${param}'`,(err,result)=>{
      if (err){
      res.status(500).send("penos")
      }else{
        res.send(result)
      }
    })
  })
})

api.put('/api/zboub/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    const idRegistration = req.params.id
    const changeInfo = req.body
    {changeInfo.quantityAdult ? changeInfo.quantityAdult= parseInt(changeInfo.quantityAdult,10) : changeInfo.quantityAdult=null}
    {changeInfo.quantityChildren ? changeInfo.quantityChildren= parseInt(changeInfo.quantityChildren,10) : changeInfo.quantityChildren=null}
    if (idRegistration>0){
      connection.query(`UPDATE  registrations  SET  quantity_adult =${changeInfo.quantityAdult},quantity_children=${changeInfo.quantityChildren}, allergie="${changeInfo.allergies}", comment="${changeInfo.comment}", user_id=${changeInfo.idUser} WHERE id_registration= ${idRegistration}` , err=>{
        if (err){
          console.log(err)
          res.status(500).send("raté pov tanche")
        }else{
          res.sendStatus(200)
        }
      })  
    }
  })
})

api.get('/api/event/type/:id', (req, res) => {
  const idActivity = req.params.id;
  if (idActivity > 2) {
    connection.query(
      `SELECT events.id_event, events.name_event, events.date_b, events.address_event, events.description_event, events.picture_event, activities.name_activity, activities.id_activity, activities.description_activity, activities.picture_activity, SUM(registrations.quantity_adult + registrations.quantity_children/2) as nb_persons, events.capacity FROM events JOIN activities ON activities.id_activity = events.activity_id AND activities.id_activity!=1 AND activities.id_activity!=2 LEFT JOIN registrations ON registrations.event_id=events.id_event WHERE events.date_b >= CURDATE() GROUP BY events.id_event ORDER BY events.date_b ASC`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } else {
    connection.query(
      `SELECT events.id_event, events.name_event, events.date_b, events.address_event, events.description_event, events.picture_event, activities.name_activity, activities.id_activity, activities.description_activity, activities.picture_activity, SUM(registrations.quantity_adult + registrations.quantity_children/2) as nb_persons, events.capacity FROM events JOIN activities ON activities.id_activity = events.activity_id AND activities.id_activity=${idActivity} LEFT JOIN registrations ON registrations.event_id=events.id_event WHERE events.date_b >= CURDATE() GROUP BY events.id_event ORDER BY events.date_b ASC`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  }
});

api.post('/api/reservation/public/', (req, res) => {
  const values = req.body;
  console.log(values)
  if (values.memberId) {
    connection.query(
      `SELECT id_user, email FROM users WHERE member_id=${values.memberId}`, (err, result) => {
        if (err) {
          console.log(err)
        } else if (result.length === 0) {
          connection.query(
            `INSERT INTO users (firstname, lastname, email, phone, anonym) VALUES('${values.firstname}', '${values.lastname}', '${values.email}', '${values.phone}', false)`,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    connection.query(
                      `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
                      (err, result) => {
                        if (err) {
                          console.log(err)
                        } else {
                          if (values.email) {
                            const data = { email: values.email, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                            const repMail = sendEmail(data);
                            console.log(repMail)
                          }
                          res.sendStatus(200)
                        }
                      }
                    )
                  }
                })
              }
            }
          )
        } else {
          const resultEmail = result[0].email
          connection.query(
            `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                if (resultEmail) {
                  const data = { email: resultEmail, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                  const repMail = sendEmail(data);
                  console.log(repMail)
                }
                res.sendStatus(200);
              }
            }
          )
        }
      }
    )
  } else {
    connection.query(
      `INSERT INTO users (firstname, lastname, email, phone, anonym) VALUES('${values.firstname}', '${values.lastname}', '${values.email}', '${values.phone}', false)`,
      (err, result) => {
        if (err) {
          console.log(err)
        } else {
          connection.query('SELECT id_user FROM users ORDER BY id_user DESC LIMIT 1', (err, result) => {
            if (err) {
              console.log(err)
            } else {
              connection.query(
                `INSERT INTO registrations(quantity_adult, quantity_children, allergie, comment, user_id, event_id) VALUES (${parseInt(values.numberAdults)}, ${parseInt(values.numberChildrens)}, '${values.allergie}', '${values.information}', ${parseInt(result[0].id_user, 10)}, ${parseInt(values.eventId, 10)})`,
                (err, result) => {
                  if (err) {
                    console.log(err)
                  } else {
                    if (values.email) {
                      const data = { email: values.email, eventName: values.eventName, eventDate: values.eventDateB, nbAdults: values.numberAdults, nbChildrens: values.numberChildrens }
                      const repMail = sendEmail(data);
                      console.log(repMail)
                    }
                    res.sendStatus(200)
                  }
                }
              )
            }
          })
        }
      }
    )
  }
});

//---------------------------------------------------EVENTS---------------------------------------------------------
api.get('/api/events/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
    }
  });
});

api.post('/api/events', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
      connection.query('INSERT INTO events SET ?', data, (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("Erreur lors de la sauvegarde d'un nouveau evenement");
        } else {
          res.sendStatus(200);
        }    
      });
    }
  });
});

api.put('/api/events/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
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
      connection.query('UPDATE events SET ? WHERE id_event = ?', [data, idEvent], err => {
        if (err) {
          console.log(err);
          res.status(500).send("Erreur lors de la modification d'un nouveau evenement");
        } else {
          res.sendStatus(200);
        }
      });
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
