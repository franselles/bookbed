'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Users = require('../models/users_model');

function generateUUID(s) {
  let d = new Date().getTime();
  const uuid = s.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function getUserID(req, res) {
  const userID = req.query.userID;
  Users.find({
    userID: userID,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function checkEmail(req, res) {
  const email = req.query.email;
  Users.find({
    email: email,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0) return res.status(404).send(false);

    res.status(200).send(true);
  });
}

function sendEmail(params) {
  const api_key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
  try {
    const data = {
      from: 'app@playasbenidorm.es',
      to: params.email,
      subject: 'Recuperación de contraseña - playasbenidorm 2020',
      html: `<html><head></head><body>Pulse el siguiente enlace para crear nuevas contraseñas
      <a href="https://plotbed-tops-80256.herokuapp.com/#/newpass/${params.token}">RECUPERAR CONTRASEÑA</a>
      <p>Si tiene dudas o necesita información diríjase a app@playasbenidorm.es</p>
      </body></html>`,
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

async function checkEmailRecovery(req, res) {
  const email = req.body.email;
  const token = generateUUID('xxxxyxxxxx');

  try {
    let user = await Users.findOneAndUpdate(
      {
        email: email,
      },
      { tokenRecovery: token }
    ).exec();

    if (user) {
      await sendEmail({ email: email, token: token });
      return res.status(200).send({ data: 'ok' });
    }
    res.status(200).send({ data: '' });
  } catch (error) {
    console.log(error);
  }
}

function updatePassword(req, res) {
  console.log(req.body);

  let password = req.body.password;
  const tokenRecovery = req.body.tokenRecovery;

  bcrypt
    .hash(password, Number(process.env.BCRYPT_SALT_ROUNDS))
    .then(function (hashedPassword) {
      password = hashedPassword;

      Users.findOneAndUpdate(
        {
          tokenRecovery: tokenRecovery,
        },
        { password: password, tokenRecovery: '' }
      ).exec((err, doc) => {
        if (err)
          return res.status(500).send({
            message: `Error al realizar la petición: ${err}`,
          });
        if (!doc) return res.status(404).send(false);

        res.status(200).send({ data: 'ok' });
      });
    });
}

function checkTokenPass(req, res) {
  const tokenRecovery = req.query.tokenRecovery;

  try {
    Users.find({
      tokenRecovery: tokenRecovery,
    }).exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (!doc) return res.status(404).send(false);

      if (doc.length > 0) {
        return res.status(200).send({ data: 'ok' });
      }
      res.status(200).send({ data: '' });
    });
  } catch (error) {
    console.log(error);
  }
}

function postUser(req, res) {
  const data = new Users();

  const date = new Date();

  data.name = req.body.name;
  data.email = req.body.email;
  data.password = req.body.password;
  data.phone = req.body.phone;
  data.date = date.toISOString().split('T')[0];
  data.banned = false;
  data.bannedDate = null;
  data.userID = req.body.phone.slice(-4) + generateUUID('xxyx');
  data.auxID = req.body.auxID;
  data.tokenRecovery = null;

  bcrypt
    .hash(data.password, Number(process.env.BCRYPT_SALT_ROUNDS))
    .then(function (hashedPassword) {
      data.password = hashedPassword;
      data.save((err, docStored) => {
        if (err)
          res.status(500).send({
            message: `Error al salvar en la base de datos: ${err} `,
          });

        const tokenData = {
          name: docStored.toObject().name,
          password: docStored.toObject().password,
          date: Date.now(),
          // ANY DATA
        };

        // Create TOKEN
        const token = jwt.sign(tokenData, process.env.KEY, {
          expiresIn: 60 * 10, // expires in 60 minutes
        });

        return res.status(200).send({
          _id: docStored._id,
          name: docStored.name,
          phone: docStored.phone,
          userID: docStored.userID,
          auxID: docStored.userID,
          token: token,
        });
      });
    })
    .catch(function (err) {
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    });
}

function getUser(req, res) {
  const email = req.query.email;
  const password = req.query.password;

  Users.find({
    email: email,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    bcrypt
      .compare(password, doc[0].password)
      .then(function (result) {
        if (result) {
          const tokenData = {
            name: doc[0].toObject().name,
            password: doc[0].toObject().password,
            date: Date.now(),
            // ANY DATA
          };

          // Create TOKEN
          const token = jwt.sign(tokenData, process.env.KEY, {
            expiresIn: 60 * 10, // expires in 60 minutes
          });

          return res.status(200).send({
            _id: doc[0]._id,
            name: doc[0].name,
            phone: doc[0].phone,
            userID: doc[0].userID,
            auxID: doc[0].userID,
            token: token,
          });
        } else {
          return res.status(404).send({
            message: 'No existe',
          });
        }
      })
      .catch(function (err) {
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      });
  });
}

function postUserOld(req, res) {
  const data = new Users();

  const date = new Date();

  data.name = req.body.name;
  data.email = req.body.email;
  data.password = req.body.password;
  data.phone = req.body.phone;
  data.date = date.toISOString().split('T')[0];
  data.banned = false;
  data.bannedDate = null;
  data.userID = req.body.phone.slice(-4) + generateUUID('xxyx');
  data.auxID = req.body.auxID;

  data
    .save((err, docStored) => {
      if (err)
        res.status(500).send({
          message: `Error al salvar en la base de datos: ${err} `,
        });

      const tokenData = {
        name: docStored.toObject().name,
        password: docStored.toObject().password,
        date: Date.now(),
        // ANY DATA
      };

      // Create TOKEN
      const token = jwt.sign(tokenData, process.env.KEY, {
        expiresIn: 60 * 10, // expires in 60 minutes
      });

      return res.status(200).send({
        _id: docStored._id,
        name: docStored.name,
        phone: docStored.phone,
        userID: docStored.userID,
        auxID: docStored.userID,
        token: token,
      });
    })
    .catch(function (err) {
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    });
}

function getUserOld(req, res) {
  const email = req.query.email;
  const password = req.query.password;

  Users.find({
    email: email,
    password: password,
  })
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (!doc)
        return res.status(404).send({
          message: 'No existe',
        });

      const tokenData = {
        name: doc[0].toObject().name,
        password: doc[0].toObject().password,
        date: Date.now(),
        // ANY DATA
      };

      // Create TOKEN
      const token = jwt.sign(tokenData, process.env.KEY, {
        expiresIn: 60 * 10, // expires in 60 minutes
      });

      return res.status(200).send({
        _id: doc[0]._id,
        name: doc[0].name,
        phone: doc[0].phone,
        userID: doc[0].userID,
        auxID: doc[0].userID,
        token: token,
      });
    })

    .catch(function (err) {
      return res.status(404).send({
        message: err,
      });
    });
}

module.exports = {
  getUserID,
  postUser,
  getUser,
  checkEmail,
  getUserOld,
  postUserOld,
  checkTokenPass,
  checkEmailRecovery,
  updatePassword,
};
