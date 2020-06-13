'use strict';
require('dotenv').config();

// const {
//   secretKey,
//   makeParameters,
//   CURRENCIES,
//   TRANSACTION_TYPES,
// } = require('redsys-pay');

// secretKey(process.env.REDSYS_API_KEY);

// async function paymentIntent(req, res) {
async function pruebapug(req, res) {
  // const cart = req.body.cart;

  // let amount = 50;

  try {
    //   cart.detail.forEach(element => {
    //     amount += element.price;
    //   });

    // amount *= 100;

    // const obj = {
    //   amount: amount, // cents (in euro)
    //   order: '123123',
    //   merchantName: process.env.COMMERCE_NAME,
    //   merchantCode: process.env.COMMERCE_CODE,
    //   currency: CURRENCIES.EUR,
    //   transactionType: TRANSACTION_TYPES.AUTHORIZATION, // '0'
    //   terminal: '1',
    //   merchantURL: 'https://playasbenidorm.app',
    //   successURL: `http:localhost:8080/api/v1/complete/123123`,
    //   errorURL: `http:localhost:8080/api/v1/uncomplete/123123`,
    // };

    // const result = makeParameters(obj);

    const RedsysPayment = require('../modules/payment-redsys');

    const RedsysKey = process.env.REDSYS_API_KEY;
    const Redsys = new RedsysPayment(RedsysKey);
    const orderId = 200000;
    const transaction = Redsys.setCommerceCode(process.env.COMMERCE_CODE)
      .setCommerceName(process.env.COMMERCE_NAME)
      .setTitularEmail(process.env.TITULAR_EMAIL)
      .setAmount(1000)
      .setOrder(orderId)
      .setProductDescription('Productos de venta online')
      .setUrlCompleteTransaction(`http:localhost:8080/api/v1/complete/123123`)
      .setUrlUncompleteTransaction(
        `http:localhost:8080/api/v1/uncomplete/123123`
      )
      .setCreditCard(7745902)
      .setExpiryDate(2407)
      .setCVV2(802)
      .createPayment(true);

    // console.log(transaction);
    let requestArgs = transaction;

    res.status(200).send(requestArgs);
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
