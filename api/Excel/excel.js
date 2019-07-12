'use strict';
const express = require('express');
const excelToJson = require('convert-excel-to-json');
const moment = require('moment');
const connection = require('../conf');
const api = express();


const result = excelToJson({
  sourceFile: '.adherents_la_cocotte_solidaire.xlsx',
  header: { rows: 1 },
  columnToKey: {
    A: 'member_id',
    B: 'membership_place',
    C: 'membership_date_last',
    D: 'firstname',
    E: 'lastname',
    F: 'birthday',
    G: 'neighborhood',
    H: 'address_user',
    I: 'zip',
    J: 'city',
    K: 'email',
    L: 'phone',
    M: 'null',
    N: 'image_copyright',
    O: 'mailing_active',
  }
});

function getJsDateFromExcel(excelDateValue) {
  let date = new Date((excelDateValue - (25567 + 2)) * 86400 * 1000);
  let localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000);
  return localTime;
}

for (let i = 0; i < result.BDD.length; i++) {


  if (result.BDD[i].neighborhood) {
    if (result.BDD[i].neighborhood === 1) {
      result.BDD[i].neighborhood = true
    } else if (result.BDD[i].neighborhood === 0){
      result.BDD[i].neighborhood = false
    }
  }
  if (!result.BDD[i].neighborhood) {
    result.BDD[i].neighborhood = false
  }
  if (result.BDD[i].image_copyright) {
    if (result.BDD[i].image_copyright === 1) {
      result.BDD[i].image_copyright = true
    } else if (result.BDD[i].image_copyright === 0) {
      result.BDD[i].image_copyright = false
    }
  }
  if (!result.BDD[i].image_copyright) {
    result.BDD[i].image_copyright = false
  }
  if (result.BDD[i].mailing_active) {
    if (result.BDD[i].mailing_active === 1) {
      result.BDD[i].mailing_active = true
    } else if (result.BDD[i].mailing_active === 0){
      result.BDD[i].mailing_active = false
    }
  }
  if (!result.BDD[i].mailing_active){
    result.BDD[i].mailing_active = false
  }

  { result.BDD[i].firstname ? null : result.BDD[i].firstname = null }
  { result.BDD[i].lastname ? null : result.BDD[i].lastname = null }
  { result.BDD[i].email ? JSON.stringify(result.BDD[i].email) : result.BDD[i].email = null }
  { result.BDD[i].phone ? null  : result.BDD[i].phone = null }
  { result.BDD[i].membership_place ? null : result.BDD[i].membership_place = null }
  { result.BDD[i].address_user ? result.BDD[i].address_user : result.BDD[i].address_user = null }
  { result.BDD[i].city ? null : result.BDD[i].city = null }

  { typeof(result.BDD[i].member_id) === 'number' ? null : result.BDD[i].member_id = null }
  { typeof(result.BDD[i].zip) === 'number' ? null : result.BDD[i].zip = 0 }

  { result.BDD[i].birthday ? result.BDD[i].birthday = moment(getJsDateFromExcel(result.BDD[i].birthday)).add(1, 'day').format('YYYY-MM-DD HH:mm:ss') : result.BDD[i].birthday = null }
  { result.BDD[i].membership_date_last ? result.BDD[i].membership_date_last = moment(getJsDateFromExcel(result.BDD[i].membership_date_last)).add(1, 'day').format('YYYY-MM-DD HH:mm:ss') : result.BDD[i].membership_date_last = null }

  if (typeof(result.BDD[i].birthday) !== 'string' || result.BDD[i].birthday === 'Invalid date') {
    result.BDD[i].birthday = null
  } else {
    result.BDD[i].birthday = `'${result.BDD[i].birthday}'`
  }

  if(result.BDD[i].member_id) {
    connection.query(`INSERT INTO users (firstname, lastname, email, phone, birthday, member_id, member_active, membership_date_last, membership_place, address_user, zip, city, neighborhood, image_copyright, mailing_active, anonym) VALUES ('${result.BDD[i].firstname}', '${result.BDD[i].lastname}', '${result.BDD[i].email}', '${result.BDD[i].phone}', ${result.BDD[i].birthday}, ${result.BDD[i].member_id}, true, '${result.BDD[i].membership_date_last}', '${result.BDD[i].membership_place}', "${result.BDD[i].address_user}", ${result.BDD[i].zip}, '${result.BDD[i].city}', ${result.BDD[i].neighborhood}, ${result.BDD[i].image_copyright}, ${result.BDD[i].mailing_active}, false)`,
    (err, res) => {
      if (err) {
        console.log(err)
        res.status(500).send("Erreur lors de l'enregistrement d'un utilisateur.");
      } else {
        console.log("well donne !!!")
      }
    })
  }
}
console.log(result.BDD)
