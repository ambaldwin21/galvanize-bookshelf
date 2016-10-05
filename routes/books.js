'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const validate = require('express-validation')
const validation = require('../validations/books')


router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((books) => {
      res.send(humps.camelizeKeys(books));
    });
});

router.get('/:id', (req, res, next) => {
    knex('books')
    .where('books.id', req.params.id)
    .first()
    .then((book) => {
      res.send(humps.camelizeKeys(book));
    })
});

router.post('/', validate(validation), (req, res, next) => {
  // console.log(req.body);
  // console.log(req.params);
  let newBook = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }
  // console.log(newBook);
  knex('books')
    .insert(newBook,'*')
    .then((books) => {
      // console.log(books);
      res.send(humps.camelizeKeys(books[0]));
    })
});


router.patch('/:id', (req, res, next) => {
  knex('books').where('books.id', req.params.id).first().then((book) => {
      if (!book) {
        const err = new Error('body.id does not exist');

        err.status = 400;

        throw err;
      }

      return knex('books')
        .where('id', req.params.id)
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }, '*')

    })
    .then((books) => {
      res.send(humps.camelizeKeys(books[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  let book;

  knex('books').where('id', req.params.id).first().then((row) => {
      if (!row) {
        return next();
      }

      book = humps.camelizeKeys(row);

      return knex('books').del().where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      res.json(book);
    })
    .catch((err) => {
      next(err);
    });
});




module.exports = router;
