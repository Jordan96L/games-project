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
    .query(
      `
        SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
    `,
      [review_id]
    )
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
      status: 400,
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

exports.fetchUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then((users) => {
      return users.rows;
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
        SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id
        ORDER BY created_at desc;
    
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: `review_id must be a number`,
    });
  }
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1;
    `,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkReviewExists = (review_id) => {
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1;`;
  if (!review_id) return;
  return db.query(queryStr, [review_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "review id does not exist",
      });
    }
  });
};
