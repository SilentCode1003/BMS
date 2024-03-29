var express = require("express");
var router = express.Router();
require('dotenv').config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("accesstype", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_access_type";

    mysql.Select(sql, "MasterAccessType", (err, result) => {
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
    let accessname = req.body.accessname;
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let data = [];

    console.log(`${accessname}, ${createdby} ${createddate}`);

    data.push([accessname, createdby, createddate, status]);

    console.log(data);
    mysql.InsertTable("master_access_type", data, (err, result) => {
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
