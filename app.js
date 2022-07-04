const express = require("express");
const controllers = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", controllers.getCategories);

module.exports = app;
