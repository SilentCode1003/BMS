var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("route", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_route";

    mysql.Select(sql, "MasterRoute", (err, result) => {
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
    let origin = req.body.origin;
    let destination = req.body.destination;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createdate = helper.GetCurrentDatetime();
    let sql_check = `select * from master_route where mr_origin='${origin}' and mr_destination='${destination}'`;
    let data = [];

    mysql.Select(sql_check, "MasterRoute", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        data.push([origin, destination, status, createdby, createdate]);

        console.log(data);
        mysql.InsertTable("master_route", data, (err, result) => {
          if (err) console.error(err);

          return res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getdestination", (req, res) => {
  try {
    let origin = req.body.origin;
    let sql = `select mr_destination as destination from master_route where mr_origin='${origin}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);

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
