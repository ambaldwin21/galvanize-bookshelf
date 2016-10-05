var Joi = require('joi')

module.exports = {
    body: {
      title: Joi.string().required().min(2),
      author: Joi.string().required().min(2),
      genre: Joi.string().required().min(2),
      description: Joi.string().required().min(2),
      coverUrl: Joi.string().required().min(2)
    }
  }






// return knex('users')
//   .insert({
//     first_name: req.body.firstName,
//     last_name: req.body.lastName,
//     email: req.body.email,
//     hashed_password: hashed_password
//   }, '*');
