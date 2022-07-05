const express = require("express");
const controllers = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", controllers.getCategories);
app.get("/api/reviews/:review_id", controllers.getReviewById);

app.patch("/api/reviews/:review_id", controllers.patchReviewById);

app.get("/api/users", controllers.getUsers);
app.get("/api/reviews", controllers.getReviews);

app.get("/api/reviews/:review_id/comments", controllers.getCommentsByReviewId);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "something went wrong" });
});
module.exports = app;
