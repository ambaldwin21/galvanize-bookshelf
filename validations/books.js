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
