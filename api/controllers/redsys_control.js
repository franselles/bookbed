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
  const amount = req.body.amount * 100;
  try {
    const obj = {
      amount: String(amount), // cents (in euro)
      orderReference: String(order),
      merchantName: String(process.env.COMMERCE_NAME),
      merchantCode: String(process.env.COMMERCE_CODE),
      currency: String(CURRENCIES.EUR),
      transactionType: String(TRANSACTION_TYPES.AUTHORIZATION), // '0'
      terminal: '1',
      merchantURL: 'https://playasbenidorm.app/api/v1/successpost',
      successURL: 'https://playasbenidorm.app/#/success',
      errorURL: 'https://playasbenidorm.app/#/error',
    };
    const result = redsys.makePaymentParameters(obj);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

function paymentPost(req, res) {
  const merchantParams = req.body.Ds_MerchantParameters;
  const signature = req.body.Ds_Signature;
  const result = redsys.checkResponseParameters(merchantParams, signature);

  const ds_response = Number(result.Ds_Response);

  if ((ds_response >= 0 && ds_response < 100) || ds_response == 900) {
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
  } else {
    res.status(200).send(result.Ds_Response);
  }
}

module.exports = {
  getMakeParameters,
  paymentPost,
};
