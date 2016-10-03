'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

let authorization = function(req, res, next) {
  if(!req.session.userId) {
    res.type('text/plain');
    res.status(401);
    res.send('Unauthorized');
  } else {
    console.log(req.session);
    next();
  }
}

router.get('/', authorization, (req, res, next) => {
  knex.from('favorites').innerJoin('books', 'favorites.book_id', 'books.id')
  .where('favorites.user_id', req.session.userId)
  .then((results) => {
    // console.log(results);
    let allFaves = [];
      for (var i = 0; i < results.length; i++) {
        let newObj = {
          id: results[i].id,
          book_id: results[i].book_id,
          user_id: results[i].user_id,
          created_at: results[i].created_at,
          updated_at: results[i].updated_at,
          title: results[i].title,
          author: results[i].author,
          genre: results[i].genre,
          description: results[i].description,
          cover_url: results[i].cover_url
        }
          allFaves.push(newObj);
      } //for loop
      res.json(humps.camelizeKeys(allFaves));
    });
});



router.get('/:id', authorization, (req, res, next) => {
  knex.from('favorites')
  .where('book_id', req.query.bookId)
  .then((results) => {
    if (results.length === 0) {
      res.send(false);
    } else {
      res.send(true)
    }
    });
});

router.post('/', authorization, (req, res, next) => {
  let newBook = {
    book_id: req.body.bookId,
    user_id: req.session.userId
  }
  // console.log(newBook);
  knex('favorites')
    .insert(newBook,'*')
    .then((books) => {
      res.json(humps.camelizeKeys(books[0]));
    })
});

router.delete('/', authorization, (req, res) => {
  knex('favorites')
  .returning(['book_id', 'user_id'])
  .where('book_id', req.body.bookId)
  .del().then((favorite) => {
    res.json(humps.camelizeKeys(favorite[0]));
  })
})


module.exports = router;
