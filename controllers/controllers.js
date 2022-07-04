const models = require("../models/models");

exports.getCategories = (req, res) => {
  models.fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
