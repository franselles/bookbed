'use strict';

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const api = require('./api/routes/routes');
const cors = require('cors');
// const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cookieParser());
app.use(helmet());

// Create link to Angular build directory
const distDir = __dirname + '/dist/';
app.use(express.static(distDir));

// CORS on ExpressJS
// Allow CORS with localhost in Chrome

// app.use(function (req, res, next) {
//   // res.header('Access-Control-Allow-Origin', '*');
//   // res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   // res.header(
//   //   'Access-Control-Allow-Headers',
//   //   'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With'
//   // );

//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
//   );
//   res.header(
//     'Access-Control-Allow-Headers',
//     'authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
//   );

//   next();
// });

app.use('/api/v1/', api);

module.exports = app;
