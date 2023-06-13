var express = require("express");
var router = express.Router();
require('dotenv').config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("budget", { title: process.env._TITLE });
});

module.exports = router;