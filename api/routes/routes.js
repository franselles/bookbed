'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const api = express.Router();

require('dotenv').config();

const citiesControl = require('../controllers/cities_control.js');
const beachesControl = require('../controllers/beaches_control.js');
const itemsControl = require('../controllers/items_control.js');
const usersControl = require('../controllers/users_control.js');
const filledControl = require('../controllers/filled_control.js');
const sectorsControl = require('../controllers/sectors_control.js');
const cartsControl = require('../controllers/carts_control.js');

// const usersControl = require('../controllers/users_control.js');

// Cities
api.get('/cities', citiesControl.getCities);

// Beaches
api.get('/beaches', middlewareRouter, beachesControl.getBeaches);

// Carts
api.post('/cart', middlewareRouter, cartsControl.postCart2);
api.get('/carts', middlewareRouter, cartsControl.getCarts);
api.get('/tickets', middlewareRouter, cartsControl.getTicketNumber);
api.get('/detailday', middlewareRouter, cartsControl.getCartsDetail);

// Users
api.get('/user/email', usersControl.checkEmail);
api.get('/user/id', middlewareRouter, usersControl.getUserID);
api.get('/user', usersControl.getUser);
api.post('/user', usersControl.postUser);
api.post('/recovery', usersControl.checkEmailRecovery);
api.get('/recovery', usersControl.checkTokenPass);
api.post('/updated', usersControl.updatePassword);

// Sold tickest and filled sectors
api.get('/state', middlewareRouter, filledControl.getFilled);
api.post('/checkcart', middlewareRouter, filledControl.getStock);

// Sectors
api.post('/sectors', middlewareRouter, sectorsControl.postSectors);
api.get('/sectors', middlewareRouter, sectorsControl.getSectors);
api.get('/sector', middlewareRouter, sectorsControl.getSector);

// Items
api.get('/items', middlewareRouter, itemsControl.getItemsCitySector);
api.get('/item', middlewareRouter, itemsControl.getItem);
api.post('/items', middlewareRouter, itemsControl.postItems);

//  Users check, token and cookie
// api.post('/login', usersControl.postUsersToken);

api.get('/', function (request, response) {
  response.send('NODE AT WORK!!!');
});

// Check the TOKEN of user
function middlewareRouter(req, res, next) {
  // console.log(req.headers);

  let tokenHeader = req.headers['authorization'].split(' ');
  let token = tokenHeader[1];
  // console.log(tokenHeader, token);

  // let token = req.cookies['csrftoken'];

  jwt.verify(token, process.env.KEY, function (err) {
    if (err) {
      res.status(401).send({
        message: 'Forbidden',
      });
    } else {
      next();
    }
  });
}

module.exports = api;