'use strict';

const express = require('express');
// const jwt = require('jsonwebtoken');
const api = express.Router();

require('dotenv').config();

const citiesControl = require('../controllers/cities_control.js');
const beachesControl = require('../controllers/beaches_control.js');
const usersControl = require('../controllers/users_control.js');
const filledControl = require('../controllers/filled_control.js');
const sectorsControl = require('../controllers/sectors_control.js');
const cartsControl = require('../controllers/carts_control.js');
const redsysControl = require('../controllers/redsys_control.js');

// const usersControl = require('../controllers/users_control.js');

// Redsys
api.post('/make', redsysControl.getMakeParameters);
api.post('/successpost', redsysControl.paymentPost);

// Cities
api.get('/cities', citiesControl.getCities);

// Beaches
api.get('/beaches', beachesControl.getBeaches);

// Carts
api.post('/cart', cartsControl.postCart);
api.post('/check', cartsControl.checkAvaiability);
api.get('/carts', cartsControl.getCarts);
api.get('/tickets', cartsControl.getTicketNumber);
api.get('/detailday', cartsControl.getCartsDetail);

// Users
api.get('/user/email', usersControl.checkEmail);
api.get('/user/id', usersControl.getUserID);
api.post('/userreg', usersControl.getUser);
api.get('/userid', usersControl.getUserById);
api.post('/user', usersControl.postUser);
api.post('/recovery', usersControl.checkEmailRecovery);
api.get('/recovery', usersControl.checkTokenPass);
api.post('/updated', usersControl.updatePassword);

// Sold tickest and filled sectors
api.get('/available', filledControl.getFilledSector);
api.get('/categories', filledControl.getFilledSector2);

// Sectors
api.post('/sectors', sectorsControl.postSectors);
api.get('/sectors', sectorsControl.getSectors);
api.get('/sector', sectorsControl.getSector);

//  Users check, token and cookie
// api.post('/login', usersControl.postUsersToken);

api.get('/', function (request, response) {
  response.send('NODE AT WORK!!!');
});

// Check the TOKEN of user
// function middlewareRouter(req, res, next) {
//   let tokenHeader = req.headers['authorization'].split(' ');
//   let token = tokenHeader[1];

//   jwt.verify(token, process.env.KEY, function (err) {
//     if (err) {
//       res.status(401).send({
//         message: 'Forbidden',
//       });
//     } else {
//       next();
//     }
//   });
// }

module.exports = api;
