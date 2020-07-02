'use strict';

const Items = require('../models/items_model');
const Sectors = require('../models/sectors_model');
const Filled = require('./filled_control');

function getItemsCitySector(req, res) {
  const cityID = req.query.cityID;
  const beachID = req.query.beachID;
  const sectorID = req.query.sectorID;
  Items.find({
    cityID: cityID,
    beachID: beachID,
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
  const beachID = req.query.beachID;
  const sectorID = req.query.sectorID;
  const typeID = req.query.typeID;
  const col = req.query.col;
  const row = req.query.row;
  Items.find({
    cityID: cityID,
    sectorID: sectorID,
    beachID: beachID,
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

async function getStateSectorItems(req, res) {
  const querystring = {
    cityID: req.query.cityID,
    beachID: req.query.beachID,
    sectorID: req.query.sectorID,
    // typeID: req.query.typeID,
    date: req.query.date,
  };

  try {
    let i = await Filled.getItems(querystring);
    let c = await Filled.getCarts(querystring);

    i.forEach(item => {
      item.filled = 0;
      c.forEach(cart => {
        if (cart.col === item.col && cart.row === item.row) {
          item.filled = 1;
        }
      });
    });

    const sectors = await Sectors.findOne({
      cityID: querystring.cityID,
      beachID: querystring.beachID,
      sectorID: querystring.sectorID,
    }).exec();

    let line = [];
    let tempoSector = [];

    for (let c = 0; c < i.length; c++) {
      line.push(i[c]);
      if ((c + 1) % sectors.rows == 0) {
        tempoSector.push(line);
        line = [];
      }
    }

    return res.status(200).send(tempoSector);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getItemsCitySector,
  getItem,
  postItems,
  getStateSectorItems,
};
