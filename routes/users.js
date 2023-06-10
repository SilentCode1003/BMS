var express = require("express");
var router = express.Router();
require('dotenv').config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");
const crypto = require("./repository/cryptography");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("user", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_user";

    mysql.Select(sql, "MasterUser", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(result);

      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/save", (req, res) => {
  try {
    let fullname = req.body.fullname;
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;
    let access = req.body.access;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createdate = helper.GetCurrentDatetime();
    let data = [];

    crypto.Encrypter(password, (err, encrypted) => {
      if (err) console.error("Error: ", err);

      data.push([
        fullname,
        username,
        encrypted,
        role,
        access,
        status,
        createdby,
        createdate,
      ]);

      console.log(data);
      mysql.InsertTable("master_user", data, (err, result) => {
        if (err) console.error(err);

        console.log(result);

        res.json({
          msg: "success",
        });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
