const { user } = require("pg/lib/defaults");
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

exports.fetchReviews = (sort_by = "created_at", order = "desc", category) => {
  const validSortOptions = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  const validOrderOptions = ["asc, desc"];

  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by",
    });
  }

  //   if (!validOrderOptions.includes(order)) {
  //     return Promise.reject({
  //       status: 400,
  //       msg: "Invalid order option",
  //     });
  //   }

  const query = {
    text: `SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id`,
  };

  if (category) {
    query.text += ` WHERE reviews.category = $1`;
    query.values = [category];
  }
  query.text += ` GROUP BY reviews.review_id
ORDER BY ${sort_by} ${order};`;
  return db.query(query).then(({ rows }) => {
    if (category) {
      return this.checkCategoryExists(category).then(() => {
        return rows;
      });
    }
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

exports.insertCommentByReviewId = (review_id, username, body) => {
  if (isNaN(+review_id)) {
    return Promise.reject({
      status: 400,
      msg: `review_id must be a number`,
    });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "The information provided was incorrect",
    });
  }
  return db
    .query(
      `
  INSERT INTO comments
  (review_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;
  `,
      [review_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.checkCategoryExists = (category) => {
  const queryStr = `SELECT * FROM reviews WHERE category = $1`;

  if (!category) return;
  return db.query(queryStr, [category]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "Category does not exist",
      });
    }
  });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING comment_id AS deleted
  `,
      [comment_id]
    )
    .then(({ rows, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      } else return rows[0];
    });
};
