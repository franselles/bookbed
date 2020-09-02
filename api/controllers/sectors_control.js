'use strict';

const Sectors = require('../models/sectors_model');

function getSectors(req, res) {
  const cityID = req.query.cityID;
  const beachID = req.query.beachID;

  Sectors.find({
    cityID: cityID,
    beachID: beachID,
    blocked: false,
  })
    .sort({ sectorID: 1 })
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (doc.length == 0)
        return res.status(404).send({
          message: 'No existe',
        });

      res.status(200).send(doc);
    });
}

function getSectorFunction(cityID, beachID, sectorID) {
  return new Promise(resolve => {
    Sectors.findOne({
      cityID: cityID,
      beachID: beachID,
      sectorID: sectorID,
    }).exec((err, doc) => {
      resolve(doc);
    });
  });
}

function getSector(req, res) {
  const cityID = req.query.cityID;
  const beachID = req.query.beachID;
  const sectorID = req.query.sectorID;

  Sectors.find({
    cityID: cityID,
    beachID: beachID,
    sectorID: sectorID,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc[0]);
  });
}

function postSectors(req, res) {
  Sectors.insertMany(req.body, function (err, docStored) {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send(docStored._id);
  });
}

module.exports = { postSectors, getSectors, getSector, getSectorFunction };
