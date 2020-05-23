'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citiesSchema = Schema(
  {
    cityID: { type: Number },
    city: { type: String, uppercase: true },
  },
  { collection: 'cities' }
);

module.exports = mongoose.model('Cities', citiesSchema);
