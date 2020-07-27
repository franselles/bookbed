'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privacySchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
  },
  { collection: 'privacy' }
);

module.exports = mongoose.model('Privacy', privacySchema);
