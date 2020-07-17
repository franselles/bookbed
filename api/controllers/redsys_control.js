'use strict';

require('dotenv').config();

const Carts = require('../models/carts_model');
const Users = require('../models/users_model');

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

        Users.findOne({ userID: docStored.userID }).exec((err, doc) => {
          if (err)
            res.status(500).send({
              message: `Error al salvar en la base de datos: ${err} `,
            });
          sendEmail(doc, docStored);
        });

        res.status(200).send(docStored);
      }
    );
  } else {
    res.status(200).send(result.Ds_Response);
  }
}

function paymentPost2(req, res) {
  const order = req.body.order;

  const update = { payed: true };

  Carts.findOneAndUpdate({ ticketID: order }, update).exec((err, docStored) => {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    Users.findOne({ userID: docStored.userID }).exec((err, doc) => {
      if (err)
        res.status(500).send({
          message: `Error al salvar en la base de datos: ${err} `,
        });
      sendEmail(doc, docStored);
    });

    res.status(200).send(docStored);
  });
}

function sendEmail(params, cart) {
  try {
    const Mailgen = require('mailgen');

    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'PLAYASBENIDORM.APP',
        link: 'https://playasbenidorm.app/',
        copyright: 'Copyright © 2020 R.A. BENIDORM S.L.',
      },
    });

    const email = {
      body: {
        title: `HOLA ${params.name}, GRACIAS POR ALQUILAR NUESTRAS HAMACAS.`,
        intro: [
          'Ticket de compra.',
          `Fecha ${cart.date}. Ticket Número ${cart.ticketID}.`,
          'R.A. BENIDORM S.L. - N.I.F.: B.03831021',
          'C/ Mallorca. Ed. Provima. local 15. 03503. Benidorm',
        ],

        table: {
          data: [],
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              ITEM: '20%',
              CDAD: '15%',
              PRECIO: '15%',
              TOTAL: '15%',
            },
            // Optionally, change column text alignment
            customAlignment: {
              CDAD: 'right',
              PRECIO: 'right',
              TOTAL: 'right',
            },
          },
        },
        outro: [
          'Para cualquier consulta ',
          'Responda a este correo. Le atenderemos en breve. Gracias',
        ],
      },
    };

    let total = 0;

    cart.detail.forEach(item => {
      let data = {
        ITEM: item.date,
        DESCRIPCION:
          item.city + ' ' + item.beach + ' ' + item.sector + ' ' + item.type,
        CDAD: item.quantity,
        PRECIO: item.price + ' €',
        TOTAL: item.quantity * item.price + ' €',
      };

      total += item.quantity * item.price;

      email.body.table.data.push(data);
    });

    email.body.table.data.push({
      ITEM: '',
      DESCRIPCION: 'TOTAL:',
      PRECIO: total + ' €',
    });

    email.body.table.data.push({
      ITEM: '',
      DESCRIPCION: 'TODOS LOS PRECIOS INCLUYEN EL I.V.A. (21 %)',
      PRECIO: '',
    });

    const emailBody = mailGenerator.generate(email);

    const api_key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

    const data = {
      from: 'app@playasbenidorm.es',
      to: params.email,
      subject: `Ticket de compra ${cart.ticketID} - playasbenidorm.app`,
      html: emailBody,
    };

    //const result = await mailgun.messages().send(data);
    return new Promise(function (resolve) {
      mailgun.messages().send(data, function (error, body) {
        // console.log(body);
        resolve(body);
      });
    });

    // return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getMakeParameters,
  paymentPost,
  sendEmail,
  paymentPost2,
};
