'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typesSchema = Schema(
  {
    typeID: { type: Number },
    type: { type: String, uppercase: true },
  },
  { collection: 'types' }
);

module.exports = mongoose.model('Types', typesSchema);
