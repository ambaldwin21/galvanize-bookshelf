'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const knex = require('../knex');
const humps = require('humps');

router.get('/', (req, res) => {
  if (req.session.userId) {
    return res.send(true);
  }
  res.send(false);
});

router.post('/', function(req, res, next) {
  knex('users')
  .where({email: req.body.email})
  .then(function(results) {
    if (results.length === 0) {
      // console.log('sdfjklsfdjlksfdkjl');
      res.type('text/plain');
      res.status(400);
      res.send('Bad email or password');
    } else {
      var user = results[0];
      // console.log(user.hashed_password);
      // console.log(req.body.password);
      var passwordMatch = bcrypt.compareSync(req.body.password, user.hashed_password)
      // console.log(passwordMatch);
      if (passwordMatch === false){
        res.type('text/plain');
        res.status(400);
        res.send('Bad email or password')
      } else {
        delete user.hashed_password;
        req.session.userId = user
        res.send(humps.camelizeKeys(user));
      }
    }
  }).catch((err) => {
    next(err)
  })
})

router.delete('/', (req, res) => {
  req.session = null;
  res.send(true);
});


module.exports = router;
