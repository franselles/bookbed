'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailSchema = new Schema({
  date: { type: String },
  cityID: { type: Number },
  city: { type: String, uppercase: true },
  beachID: { type: Number },
  beach: { type: String, uppercase: true },
  sectorID: { type: Number },
  sector: { type: String, uppercase: true },
  typeID: { type: Number },
  type: { type: String, uppercase: true },
  itemID: { type: String, uppercase: true },
  col: { type: Number },
  row: { type: Number },
  price: { type: Number },
  codeID: { type: String, uppercase: true },
  used: { type: Boolean },
  dateTimeUsed: { type: String },
  numberItem: { type: Number },
});

const cartsSchema = new Schema(
  {
    date: { type: String },
    userID: { type: String },
    phone: { type: String },
    ticketID: { type: String },
    canceled: { type: Boolean },
    payed: { type: Boolean },
    detail: [detailSchema],
  },
  { collection: 'carts' }
);

module.exports = mongoose.model('Carts', cartsSchema);
