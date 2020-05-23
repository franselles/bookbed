'use strict';

const Items = require('../models/items_model');
const Carts = require('../models/carts_model');

async function getItems(querystring) {
  return await Items.find({
    cityID: querystring.cityID,
    beachID: querystring.beachID,
    sectorID: querystring.sectorID,
    typeID: querystring.typeID,
  })
    .sort({ col: 1, row: 1 })
    .exec();
}

// 'detail.cityID': querystring.cityID,
// 'detail.sectorID': querystring.sectorID,
// 'detail.typeID': querystring.typeID,
// 'detail.date': querystring.date,

async function getCarts(querystring) {
  return await Carts.aggregate([
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
    { $sort: { 'detail.col': -1, 'detail.row': 1 } },
    {
      $project: {
        date: '$detail.date',
        cityID: '$detail.cityID',
        city: '$detail.city',
        beachID: '$detail.beachID',
        beach: '$detail.beach',
        sectorID: '$detail.sectorID',
        sector: '$detail.sector',
        typeID: '$detail.typeID',
        type: '$detail.type',
        itemID: '$detail.itemID',
        col: '$detail.col',
        row: '$detail.row',
        price: '$detail.price',
        numberItem: '$detail.numberItem',
      },
    },
  ]).exec();
}

async function getFilled(req, res) {
  const querystring = {
    cityID: req.query.cityID,
    beachID: req.query.beachID,
    sectorID: req.query.sectorID,
    typeID: req.query.typeID,
    date: req.query.date,
  };

  try {
    let i = await getItems(querystring);
    let c = await getCarts(querystring);

    i.forEach(item => {
      item.filled = 0;
      c.forEach(cart => {
        if (cart.col === item.col && cart.row === item.row) {
          item.filled = 1;
        }
      });
    });
    return res.status(200).send(i);
  } catch (err) {
    console.log(err);
  }
}

function getStock(req, res) {
  const cart = req.body.cart;

  let exists = [];
  cart.forEach((element, index) => {
    Carts.aggregate([
      { $unwind: '$detail' },
      {
        $match: {
          'detail.cityID': Number(element.cityID),
          'detail.beachID': Number(element.beachID),
          'detail.sectorID': Number(element.sectorID),
          'detail.typeID': Number(element.typeID),
          'detail.date': element.date,
          'detail.row': element.row,
          'detail.col': element.col,
        },
      },
      {
        $project: {
          date: '$detail.date',
          cityID: '$detail.cityID',
          city: '$detail.city',
          beachID: '$detail.beachID',
          beach: '$detail.beach',
          sectorID: '$detail.sectorID',
          sector: '$detail.sector',
          typeID: '$detail.typeID',
          type: '$detail.type',
          itemID: '$detail.itemID',
          col: '$detail.col',
          row: '$detail.row',
          price: '$detail.price',
          filled: '$detail.filled',
          empty: '$detail.empty',
          numberItem: '$detail.numberItem',
        },
      },
    ]).exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (doc.length > 0) {
        exists.push(doc[0]);
      }

      if (index == cart.length - 1) {
        res.status(200).send(exists);
      }
    });
  });
}

module.exports = {
  getFilled,
  getStock,
};
