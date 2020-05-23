'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: { type: String, uppercase: true },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    date: { type: String },
    banned: { type: Boolean },
    bannedDate: { type: String },
    userID: { type: String },
    auxID: { type: String },
    tokenRecovery: { type: String },
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Users', usersSchema);
