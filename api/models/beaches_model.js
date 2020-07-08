'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beachesSchema = new Schema(
  {
    beachID: { type: Number },
    beach: { type: String, uppercase: true },
    cityID: { type: Number },
    city: { type: String, uppercase: true },
    positionX: { type: Number },
    positionY: { type: Number },
    image1: { type: String },
    image2: { type: String },
    blocked: { type: Boolean },
  },
  { collection: 'beaches' }
);

module.exports = mongoose.model('Beaches', beachesSchema);
