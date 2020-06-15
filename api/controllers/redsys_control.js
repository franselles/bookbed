'use strict';
require('dotenv').config();

const Carts = require('../models/carts_model');

/* const {
  secretKey,
  makeParameters,
  getResponseParameters,
  CURRENCIES,
  TRANSACTION_TYPES,
} = require('redsys-pay'); */

// secretKey(process.env.REDSYS_API_KEY);

const RedSys = require('redsys-pos');
const { CURRENCIES, TRANSACTION_TYPES } = RedSys;

const MERCHANT_KEY = process.env.REDSYS_API_KEY; // TESTING KEY
const redsys = new RedSys(MERCHANT_KEY);

async function getMakeParameters(req, res) {
  const order = req.body.order;
  const amount = req.body.amount;

  try {
    const obj = {
      amount: String(amount), // cents (in euro)
      orderReference: String(order),
      merchantName: String(process.env.COMMERCE_NAME),
      merchantCode: String(process.env.COMMERCE_CODE),
      currency: String(CURRENCIES.EUR),
      transactionType: String(TRANSACTION_TYPES.AUTHORIZATION), // '0'
      terminal: '1',
      merchantURL: 'http://playasbenidorm.app/api/v1/success',
      successURL: 'http://playasbenidorm.app/api/v1/success',
      errorURL: 'http://playasbenidorm.app/api/v1/error',
    };

    const result = redsys.makePaymentParameters(obj);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

function successPaymentPost(req, res) {
  console.log('post ok', req.body);

  const merchantParams = req.body.Ds_MerchantParameters;
  const signature = req.body.Ds_Signature;
  console.log(req.body.Ds_MerchantParameters);
  console.log(req.body.Ds_Signature);

  const result = redsys.checkResponseParameters(merchantParams, signature);

  console.log(result);

  const update = { payed: true };

  Carts.findOneAndUpdate({ ticketID: 56 }, update).exec((err, docStored) => {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send(docStored);
  });
}

function successPaymentGet(req, res) {
  console.log('get ok', req.query);

  const merchantParams = req.query.Ds_MerchantParameters;
  const signature = req.query.Ds_Signature;
  console.log(req.body.Ds_MerchantParameters);
  console.log(req.body.Ds_Signature);

  const result = redsys.checkResponseParameters(merchantParams, signature);

  console.log(result);

  const update = { payed: true };

  Carts.findOneAndUpdate({ ticketID: result.Ds_Order }, update).exec(
    (err, docStored) => {
      if (err)
        res.status(500).send({
          message: `Error al salvar en la base de datos: ${err} `,
        });

      res.status(200).send(docStored);
    }
  );
}

function errorPaymentGet(req, res) {
  console.log('get ko', req.query);

  const merchantParams = req.query.Ds_MerchantParameters;
  const signature = req.query.Ds_Signature;
  console.log(req.body.Ds_MerchantParameters);
  console.log(req.body.Ds_Signature);

  const result = redsys.checkResponseParameters(merchantParams, signature);

  console.log(result);

  res.status(400).send(result);
}

module.exports = {
  getMakeParameters,
  successPaymentGet,
  successPaymentPost,
  errorPaymentGet,
};
