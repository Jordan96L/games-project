const express = require("express");
const controllers = require("./controllers/controllers");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/categories", controllers.getCategories);

app.get("/api/reviews/:review_id", controllers.getReviewById);

app.patch("/api/reviews/:review_id", controllers.patchReviewById);

app.get("/api/users", controllers.getUsers);

app.get("/api/reviews", controllers.getReviews);

app.get("/api/reviews/:review_id/comments", controllers.getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", controllers.postCommentByReviewId);

app.delete("/api/comments/:comment_id", controllers.deleteCommentById);

app.get("/api", controllers.getApi);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({
      msg: "The information provided was incorrect",
    });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "The request provided does not exist" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42601") {
    res.status(400).send({ msg: "Invalid order option" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "something went wrong" });
});
module.exports = app;
