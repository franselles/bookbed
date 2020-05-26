'use strict';
require('dotenv').config();

const stripe = require('stripe')(process.env.SECRET_KEY);

async function paymentIntent(req, res, next) {
  const cart = req.body.cart;

  let amount = 0;

  cart.detail.forEach(element => {
    amount += element.price;
  });

  amount *= 100;

  try {
    const currency = 'eur';

    stripe.paymentIntents
      .create({ amount, currency })
      .then(intent => res.status(200).send({ secret: intent['client_secret'] }))
      .catch(next);
  } catch (error) {
    res.status(500).send({
      message: `Error al realizar la petición: ${error}`,
    });
  }
}

module.exports = {
  paymentIntent,
};
