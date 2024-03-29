var express = require("express");
var router = express.Router();
require('dotenv').config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("position", {  title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_position";

    mysql.Select(sql, "MasterPosition", (err, result) => {
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
    let positionname = req.body.positionname;
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let data = [];

    console.log(`${positionname}, ${createdby} ${createddate}`);

    data.push([positionname, createdby, createddate, status]);

    console.log(data);
    mysql.InsertTable("master_position", data, (err, result) => {
      if (err) console.error(err);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
