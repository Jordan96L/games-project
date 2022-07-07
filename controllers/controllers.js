const { sort } = require("../db/data/test-data/categories");
const models = require("../models/models");
const myEndpoints = require("../endpoints.json");

exports.getCategories = (req, res) => {
  models.fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  models
    .fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  models
    .updateReviewById(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  models.fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  models
    .fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  return Promise.all([
    models.fetchCommentsByReviewId(review_id),
    models.checkReviewExists(review_id),
  ])
    .then((results) => {
      res.status(200).send({ comments: results[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  models
    .insertCommentByReviewId(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  models
    .removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res) => {
  res.status(200).send(myEndpoints);
};
