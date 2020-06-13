'use strict';

const Carts = require('../models/carts_model');

function postCartFinal(req, res) {
  try {
    const data = new Carts();

    data.date = req.body.date;
    data.userID = req.body.userID;
    data.phone = req.body.phone;
    data.ticketID = req.body.ticketID;
    data.canceled = req.body.canceled;
    data.payed = req.body.payed;
    data.detail = req.body.detail;

    data.save(err => {
      if (err)
        res.status(500).send({
          message: `Error al salvar en la base de datos: ${err} `,
        });

      res.status(200).send(data);
    });
  } catch (error) {
    return res.status(404).send(error);
  }
}

function deleteCartFinal(req, res) {
  const id = req.query.id;

  Carts.deleteOne({
    _id: id,
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

function postCart(req, res) {
  const cart = req.body;

  try {
    getStock(cart).then(result => {
      if (result.length > 0) {
        return res.status(200).send(result);
      }

      const data = new Carts();

      data.date = req.body.date;
      data.userID = req.body.userID;
      data.phone = req.body.phone;
      data.ticketID = req.body.ticketID;
      data.canceled = req.body.canceled;
      data.payed = req.body.payed;
      data.detail = req.body.detail;

      data.save(err => {
        if (err)
          res.status(500).send({
            message: `Error al salvar en la base de datos: ${err} `,
          });

        res.status(200).send(data);
      });
    });
  } catch (error) {
    return res.status(404).send(error);
  }
}

function getStock(cart) {
  let exists = [];

  try {
    return new Promise(function (resolve) {
      cart.detail.forEach((element, index) => {
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
              used: '$detail.used',
              dateTimeUsed: '$detail.dateTimeUsed',
              numberItem: '$detail.numberItem',
            },
          },
        ]).exec((err, doc) => {
          if (err) return { error: 500 };
          if (doc.length > 0) {
            exists.push(doc[0]);
          }

          if (index == cart.detail.length - 1) {
            resolve(exists);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function getCarts(req, res) {
  const userID = req.query.userID;

  Carts.find({
    userID: userID,
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

function getCartsDetail(req, res) {
  const userID = req.query.userID;
  const date = req.query.date;

  Carts.aggregate([
    { $unwind: '$detail' },
    {
      $match: {
        userID: userID,
        // 'detail.date': { $gte: date },
        'detail.date': date,
      },
    },
    { $sort: { 'detail.date': 1, col: 1, row: 1 } },
    {
      $project: {
        _id: '$detail._id',
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
        used: '$detail.used',
        dateTimeUsed: '$detail.dateTimeUsed',
        numberItem: '$detail.numberItem',
      },
    },
  ]).exec((err, doc) => {
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

function getTicketNumber(req, res) {
  // const date = req.query.date;

  Carts.aggregate([
    // {
    //   $match: {
    //     date: date,
    //   },
    // },
    {
      $count: 'tickets',
    },
  ]).exec((err, doc) => {
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

module.exports = {
  postCart,
  getCarts,
  getTicketNumber,
  getCartsDetail,
  postCartFinal,
  deleteCartFinal,
};
