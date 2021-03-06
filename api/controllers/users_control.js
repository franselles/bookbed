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
  const userID = req.query.id;
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

function getUserById(req, res) {
  const id = req.query.id;
  Users.find({
    _id: id,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    return res.status(200).send({
      _id: doc[0]._id,
      name: doc[0].name,
      phone: doc[0].phone,
      userID: doc[0].userID,
      auxID: doc[0].userID,
    });
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

function sendEmail2(params) {
  try {
    const Mailgen = require('mailgen');

    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'playasbenidorm.app',
        link: 'https://playasbenidorm.app/',
        copyright: 'Copyright © 2020 R.A. BENIDORM S.L.',
      },
    });

    // Prepare email contents
    const email = {
      body: {
        greeting: 'Hola',
        signature: 'Atentamente',
        name: params.name,
        intro: `Recibió este correo electrónico porque se recibió
         una solicitud de restablecimiento de contraseña para su cuenta.`,
        action: {
          instructions:
            'Haga clic en el botón de abajo para restablecer su contraseña:',
          button: {
            color: '#DC4D2F',
            text: 'Restablecer su contraseña',
            link: `https://playasbenidorm.app/#/newpass/${params.token}`,
          },
        },
        outro:
          'Si no solicitó un restablecimiento de contraseña, no se requiere ninguna otra acción de su parte.',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const api_key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mailgun = require('mailgun-js')({
      apiKey: api_key,
      domain: domain,
    });

    const data = {
      from: 'playasbenidorm.app <app@playasbenidorm.es>',
      to: params.email,
      subject: `Recuperación de contraseña - playasbenidorm.app`,
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

function sendEmailTest() {
  try {
    const Mailgen = require('mailgen');

    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        // Appears in header & footer of e-mails
        name: 'playasbenidorm.app',
        link: 'https://playasbenidorm.app/',
        copyright: 'Copyright © 2020 R.A. BENIDORM S.L.',
      },
    });

    // Prepare email contents
    const email = {
      body: {
        greeting: 'Hola',
        signature: 'Atentamente',

        intro: `Correo de prueba.`,

        outro: 'No respondas esto es un simple correo de prueba.',
      },
    };

    const emailBody = mailGenerator.generate(email);

    const api_key = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const mailgun = require('mailgun-js')({
      apiKey: api_key,
      domain: domain,
    });

    const data = {
      from: 'playasbenidorm.app <app@playasbenidorm.es>',
      to: 'fran.selles@gmail.com',
      bcc: 'app@playasbenidorm.es',
      subject: `Correo de prueba - playasbenidorm.app`,
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

async function checkEmailTest(req, res) {
  try {
    await sendEmailTest();
    res.status(200).send('Enviado prueba');
  } catch (error) {
    res.status(500).send(error);
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
      await sendEmail2({ email: email, name: user.name, token: token });
      return res.status(200).send({ data: 'ok' });
    } else {
      res.status(200).send({ data: 'error' });
    }
  } catch (error) {
    console.log(error);
  }
}

function updatePassword(req, res) {
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

function checkEmailFunction(data) {
  const email = data;
  return new Promise(resolve => {
    Users.find({
      email: email,
    }).exec((err, doc) => {
      resolve(doc);
    });
  });
}

function checkPhoneFunction(data) {
  const phone = data;
  return new Promise(resolve => {
    Users.find({
      phone: phone,
    }).exec((err, doc) => {
      resolve(doc);
    });
  });
}

async function postUser2(req, res) {
  try {
    const email = await checkEmailFunction(req.body.email);
    const phone = await checkPhoneFunction(req.body.phone);

    if (email.length > 0) {
      return res.status(200).send({
        success: false,
        data: {
          code: 1,
          message: 'Correo ya existe',
        },
      });
    } else if (phone.length > 0) {
      return res.status(200).send({
        success: false,
        data: {
          code: 2,
          message: 'Telefono ya existe',
        },
      });
    } else {
      const data = new Users();

      const date = new Date();

      data.name = req.body.name;
      data.email = req.body.email;
      data.password = req.body.password;
      data.phone = req.body.phone;
      data.date = date.toISOString().split('T')[0];
      data.banned = false;
      data.bannedDate = null;
      // data.userID = req.body.phone.slice(-4) + generateUUID('xxyx');
      data.userID = req.body.phone;
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
              expiresIn: 60 * 60, // expires in 60 minutes
            });

            return res.status(200).send({
              success: true,
              data: {
                id: docStored._id,
                name: docStored.name,
                phone: docStored.phone,
                userID: docStored.userID,
                auxID: docStored.userID,
                token: token,
              },
            });
          });
        })
        .catch(function (err) {
          return res.status(500).send({
            message: `Error al realizar la petición: ${err}`,
          });
        });
    }
  } catch (error) {
    return res.status(404).send(error);
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
  // data.userID = req.body.phone.slice(-4) + generateUUID('xxyx');
  data.userID = req.body.phone;
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
          expiresIn: 60 * 60, // expires in 60 minutes
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
  const email = req.body.email;
  const password = req.body.password;

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
            expiresIn: 60 * 60, // expires in 60 minutes
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
        expiresIn: 60 * 30, // expires in 60 minutes
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
  getUserById,
  postUser2,
  checkEmailTest,
};
