/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    fbid: {
      type: 'string',
      unique: true,
    },
    provider: {
      type: 'string'
    },
    email: {
      type: 'email',
      unique: true
    },
    first_name: {
      type: 'string'
    },
    last_name:{
      type: 'string'
    } 
  },

};