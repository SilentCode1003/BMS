var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("requestbudget", { title: process.env._TITLE });
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.ACT());
    let sql = `select * from budget_request_details where not brd_status='${status}'`;

    mysql.Select(sql, "BudgetRequestDetails", (err, result) => {
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
    let requestby = req.body.requestby;
    let requestdate = helper.GetCurrentDate();
    let transactiondate = helper.GetCurrentDatetime();
    let budget = req.body.budget;
    let details = req.body.details;
    let status = dictionary.GetValue(dictionary.REQB());
    let request_budget = [];
    let employee_budget_history = [];

    request_budget.push([requestby, requestdate, budget, details, status]);
    employee_budget_history.push([
      requestdate,
      requestby,
      budget,
      status,
      requestby,
      transactiondate,
    ]);

    mysql.InsertTable(
      "budget_request_details",
      request_budget,
      (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);

        mysql.InsertTable(
          "employee_budget_history",
          employee_budget_history,
          (err, result) => {
            if (err) console.error("Error: ", err);
            console.log(result);

            res.json({
              msg: "success",
            });
          }
        );
      }
    );
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
