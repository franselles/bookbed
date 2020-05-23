'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemsSchema = new Schema(
  {
    cityID: { type: Number },
    city: { type: String, uppercase: true },
    beachID: { type: Number },
    beach: { type: String, uppercase: true },
    sectorID: { type: Number },
    sector: { type: String, uppercase: true },
    typeID: { type: Number },
    type: { type: String, uppercase: true },
    price: { type: Number },
    itemID: { type: String },
    col: { type: Number },
    row: { type: Number },
    filled: { type: Number },
    empty: { type: Number },
    numberItem: { type: Number },
  },
  { collection: 'items' }
);

module.exports = mongoose.model('Items', itemsSchema);
