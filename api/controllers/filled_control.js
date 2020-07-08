'use strict';

const Sectors = require('../models/sectors_model');
const Carts = require('../models/carts_model');

async function getSector(querystring) {
  return await Sectors.aggregate([
    {
      $match: {
        cityID: Number(querystring.cityID),
        beachID: Number(querystring.beachID),
        sectorID: Number(querystring.sectorID),
      },

      // typeID: querystring.typeID,
    },
    { $unwind: '$items' },
    {
      $match: {
        'items.typeID': Number(querystring.typeID),
      },
    },
    {
      $project: {
        typeID: '$items.typeID',
        type: '$items.type',
        price: '$items.price',
        quantity: '$items.quantity',
      },
    },
  ]).exec();
}

async function getCartsSector(querystring) {
  return await Carts.aggregate([
    {
      $match: {
        payed: true,
      },
    },
    { $unwind: '$detail' },
    {
      $match: {
        'detail.cityID': Number(querystring.cityID),
        'detail.beachID': Number(querystring.beachID),
        'detail.sectorID': Number(querystring.sectorID),
        'detail.typeID': Number(querystring.typeID),
        'detail.date': querystring.date,
      },
    },
    {
      $count: 'quantity_shell',
    },
  ]).exec();
}

async function getFilledSector(req, res) {
  const querystring = {
    cityID: req.query.cityID,
    beachID: req.query.beachID,
    sectorID: req.query.sectorID,
    typeID: req.query.typeID,
    date: req.query.date,
  };

  try {
    let i = await getSector(querystring);
    let c = await getCartsSector(querystring);

    let resp = {
      date: req.query.date,
      cityID: Number(req.query.cityID),
      beachID: Number(req.query.beachID),
      sectorID: Number(req.query.sectorID),
      typeID: i[0].typeID,
      type: i[0].type,
      price: i[0].price,
      quantity: i[0].quantity,
      quantity_shell: c[0].quantity_shell || 0,
      available: i[0].quantity - c[0].quantity_shell || 0,
    };

    console.log(resp);

    return res.status(200).send(resp);
  } catch (err) {
    console.log(err);
  }
}

async function getSector2(querystring) {
  return await Sectors.aggregate([
    {
      $match: {
        cityID: Number(querystring.cityID),
        beachID: Number(querystring.beachID),
        sectorID: Number(querystring.sectorID),
      },

      // typeID: querystring.typeID,
    },
    { $unwind: '$items' },
    {
      $project: {
        typeID: '$items.typeID',
        type: '$items.type',
        price: '$items.price',
        quantity: '$items.quantity',
      },
    },
  ]).exec();
}

async function getCartsSector2(querystring) {
  return await Carts.aggregate([
    {
      $match: {
        payed: true,
      },
    },
    { $unwind: '$detail' },
    {
      $match: {
        'detail.cityID': Number(querystring.cityID),
        'detail.beachID': Number(querystring.beachID),
        'detail.sectorID': Number(querystring.sectorID),
        'detail.date': querystring.date,
      },
    },
    {
      $group: {
        _id: '$detail.typeID',
        quantity_shell: { $sum: '$detail.quantity' },
      },
    },
  ]).exec();
}

async function getFilledSector2(req, res) {
  const querystring = {
    cityID: Number(req.query.cityID),
    beachID: Number(req.query.beachID),
    sectorID: Number(req.query.sectorID),
    date: req.query.date,
    typeID: '',
  };

  try {
    let categories = [];
    let quantity = 0;

    let i = await getSector2(querystring);
    let c = await getCartsSector2(querystring);

    i.forEach(async item => {
      let shelled = c.find(elem => {
        return elem._id == item.typeID;
      });

      if (shelled) {
        quantity = shelled.quantity_shell;
      } else {
        quantity = 0;
      }

      let resp = {
        date: req.query.date,
        cityID: Number(req.query.cityID),
        beachID: Number(req.query.beachID),
        sectorID: Number(req.query.sectorID),
        typeID: item.typeID,
        type: item.type,
        price: item.price,
        quantity: item.quantity,
        quantity_shell: quantity,
        available: item.quantity - quantity || 0,
      };
      categories.push(resp);
    });

    return res.status(200).send(categories);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getFilledSector,
  getFilledSector2,
};
