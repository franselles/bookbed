'use strict';
require('dotenv').config();

const Carts = require('../models/carts_model');

const {
  secretKey,
  makeParameters,
  CURRENCIES,
  TRANSACTION_TYPES,
} = require('redsys-pay');

secretKey(process.env.REDSYS_API_KEY);

async function getMakeParameters(req, res) {
  const order = req.body.order;
  const amount = req.body.amount;

  try {
    const obj = {
      amount: String(amount), // cents (in euro)
      order: String(order),
      merchantName: process.env.COMMERCE_NAME,
      merchantCode: process.env.COMMERCE_CODE,
      currency: CURRENCIES.EUR,
      transactionType: TRANSACTION_TYPES.AUTHORIZATION, // '0'
      terminal: '1',
      merchantURL: 'https://playasbenidorm.app/api/v1/check/122121',
      successURL: 'https://playasbenidorm.app/#/success',
      errorURL: 'https://playasbenidorm.app/#/error',
    };

    const result = makeParameters(obj);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

function checkPayment(req, res) {
  console.log(req);
  res.status(200).send('ok');
}

function errorPayment(req, res) {
  const e = req.params['id'];
  console.log(e);
  res.status(200).send(e);
}

function successPayment(req, res) {
  const id = req.query.id;
  const update = { payed: true };

  Carts.findByIdAndUpdate(id, update).exec((err, docStored) => {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send(docStored);
  });
}

module.exports = {
  getMakeParameters,
  errorPayment,
  successPayment,
  checkPayment,
};
