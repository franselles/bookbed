'use strict';

const Sectors = require('../models/sectors_model');

function getSectors(req, res) {
  const cityID = req.query.cityID;
  const beachID = req.query.beachID;

  Sectors.find({
    cityID: cityID,
    beachID: beachID,
  }).exec((err, doc) => {
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

function getSector(req, res) {
  const cityID = req.query.cityID;
  const sectorID = req.query.sectorID;

  Sectors.find({
    cityID: cityID,
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
  // const data = new Sectors();

  // data.cityID = req.body.cityID;
  // data.city = req.body.city;
  // data.beachID = req.body.beachID;
  // data.beach = req.body.beach;
  // data.sectorID = req.body.sectorID;
  // data.sector = req.body.sector;
  // data.description = req.body.description;
  // data.positionX = req.body.positionX;
  // data.positionY = req.body.positionY;
  // data.image1 = req.body.image1;
  // data.image2 = req.body.image2;
  // data.cols = req.body.cols;
  // data.rows = req.body.rows;
  // data.blocked = req.body.blocked;

  // data.save((err, docStored) => {
  //   if (err)
  //     res.status(500).send({
  //       message: `Error al salvar en la base de datos: ${err} `,
  //     });

  //   res.status(200).send(docStored._id);
  // });

  Sectors.insertMany(req.body, function(err, docStored) {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send(docStored._id);
  });
}

module.exports = { postSectors, getSectors, getSector };
