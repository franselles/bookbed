'use strict';

const Items = require('../models/items_model');

function getItemsCitySector(req, res) {
  const cityID = req.query.cityID;
  const sectorID = req.query.sectorID;
  Items.find({
    cityID: cityID,
    sectorID: sectorID,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function getItem(req, res) {
  const cityID = req.query.cityID;
  const sectorID = req.query.sectorID;
  const typeID = req.query.typeID;
  const col = req.query.col;
  const row = req.query.row;
  Items.find({
    cityID: cityID,
    sectorID: sectorID,
    typeID: typeID,
    col: col,
    row: row,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function postItems(req, res) {
  Items.insertMany(req.body, function (err, docStored) {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send({ message: 'OK', docStored: docStored._id });
  });
}

module.exports = {
  getItemsCitySector,
  getItem,
  postItems,
};
