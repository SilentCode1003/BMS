var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("reimbursement", { title: process.env._TITLE });
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from reimbursement_details where not rd_status='${status}'`;

    mysql.Select(sql, "ReimbursementDetails", (err, result) => {
      if (err) console.error("Error: ", err);

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
    let reimbursementby = req.body.reimburseby;
    let requestid = req.body.requestid;
    let details = req.body.details;
    let totalreimburse = req.body.totalreimburse;
    let status = dictionary.GetValue(dictionary.RBRD());
    let reimbursementdate = helper.GetCurrentDate();
    let reimbursement_details = [];

    reimbursement_details.push([
      reimbursementby,
      reimbursementdate,
      requestid,
      details,
      totalreimburse,
      status,
    ]);

    mysql.InsertTable(
      "reimbursement_details",
      reimbursement_details,
      (err, result) => {
        if (err) console.error("Error: ", err);

        console.log(result);

        res.json({
          msg: "success",
        });
      }
    );
  } catch (error) {
    res.json({ msg: error });
  }
});
