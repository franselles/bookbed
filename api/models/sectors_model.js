'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectorsSchema = Schema(
  {
    cityID: { type: Number },
    city: { type: String, uppercase: true },
    beachID: { type: Number },
    beach: { type: String, uppercase: true },
    sectorID: { type: Number },
    sector: { type: String, uppercase: true },
    description: { type: String, uppercase: true },
    positionX: { type: Number },
    positionY: { type: Number },
    image1: { type: String },
    image2: { type: String },
    cols: { type: Number },
    rows: { type: Number },
    blocked: { type: Boolean },
  },
  { collection: 'sectors' }
);

module.exports = mongoose.model('Sectors', sectorsSchema);
