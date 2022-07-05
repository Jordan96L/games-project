const db = require("../db/connection");

exports.fetchCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories`
    )
    .then((categories) => {
      return categories.rows;
    });
};

exports.fetchReviewById = (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: `review_id must be a number`,
    });
  }
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((review) => {
      if (!review.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `review id does not exist`,
        });
      }
      return review.rows[0];
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: `review_id must be a number`,
    });
  }

  if (isNaN(+inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: "The information provided is not correct",
    });
  }

  return db
    .query(
      `
    UPDATE reviews
    SET votes = votes + $2
    WHERE review_id = $1
    RETURNING *;
    `,
      [review_id, inc_votes]
    )
    .then((review) => {
      if (!review.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `review id does not exist`,
        });
      } else return review.rows[0];
    });
};
