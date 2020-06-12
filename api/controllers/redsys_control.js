'use strict';
require('dotenv').config();

const {
  secretKey,
  makeParameters,
  CURRENCIES,
  TRANSACTION_TYPES,
} = require('redsys-pay');

secretKey(process.env.REDSYS_API_KEY);

// async function paymentIntent(req, res) {
async function pruebapug(req, res) {
  // const cart = req.body.cart;

  let amount = 50;

  try {
    //   cart.detail.forEach(element => {
    //     amount += element.price;
    //   });

    amount *= 100;

    const obj = {
      amount: amount, // cents (in euro)
      order: '123123',
      merchantName: process.env.COMMERCE_NAME,
      merchantCode: process.env.COMMERCE_CODE,
      currency: CURRENCIES.EUR,
      transactionType: TRANSACTION_TYPES.AUTHORIZATION, // '0'
      terminal: '1',
      merchantURL: 'https://playasbenidorm.app',
      successURL: `https://playasbenidorm.app/api/v1/complete/123123`,
      errorURL: `https://playasbenidorm.app/api/v1/uncomplete/123123`,
    };

    const result = makeParameters(obj);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

function errorDevuelto(req, res) {
  const e = req.params['id'];
  console.log(e);
  res.status(200).send(e);
}

module.exports = {
  // paymentIntent,
  pruebapug,
  errorDevuelto,
};
