'use strict';

const Beaches = require('../models/beaches_model');

function getBeaches(req, res) {
  const cityID = req.query.cityID;
  Beaches.find({ cityID: cityID, blocked: false }).exec((err, doc) => {
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

module.exports = {
  getBeaches,
};
