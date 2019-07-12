'use strict';
const express = require('express');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const connection = require('../conf');
const api = express();


const result = excelToJson({
    sourceFile: '.adherents_la_cocotte_solidaire.xlsx',
    header:{rows: 1},
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
console.log(result.BDD)

