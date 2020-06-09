'use strict';
require('dotenv').config();

const {
  secretKey,
  makeParameters,
  CURRENCIES,
  TRANSACTION_TYPES,
} = require('redsys-pos');

secretKey('sq7HjrUOBfKmC576ILgskD5srU870gJ7');

async function paymentIntent(req, res) {
  const cart = req.body.cart;

  let amount = 0;

  cart.detail.forEach(element => {
    amount += element.price;
  });

  amount *= 100;

  const obj = {
    amount: amount, // cents (in euro)
    order: '123123',
    merchantName: 'REDSYS PAY SHOP',
    merchantCode: '123123123',
    currency: CURRENCIES.EUR,
    transactionType: TRANSACTION_TYPES.AUTHORIZATION, // '0'
    terminal: '1',
    merchantURL: 'http://shop.js.gl/merchant',
    successURL: 'http://shop.js.gl/success',
    errorURL: 'http://shop.js.gl/error',
  };

  try {
    const result = makeParameters(obj);
    console.log(result);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

module.exports = {
  paymentIntent,
};
