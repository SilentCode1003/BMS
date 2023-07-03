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
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from budget_request_details where not brd_status='${status}'`;

    mysql.Select(sql, "BudgetRequestDetails", (err, result) => {
      if (err) console.error("Error: ", err);
      let data = [];

      result.forEach((key, item) => {
        let details = "";
        var detail = key.details;
        detail = JSON.parse(detail);

        detail.forEach((key, item) => {
          details += `${key.ticketid} ${key.concern} ${key.issue} [${key.storename}] <br/>`;
        });

        data.push({
          requestid: key.requestid,
          requestby: key.requestby,
          requestdate: key.requestdate,
          budget: key.budget,
          details: details,
          status: key.status,
        });
      });

      res.json({
        msg: "success",
        data: data,
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
    let sql_check = `select * from master_employee where me_employeeid='${requestby}'`;

    console.log(details);

    mysql
      .isDataExist(sql_check, "MasterEmployee")
      .then((fullname) => {
        console.log(fullname);
        if (fullname) {
          request_budget.push([
            requestby,
            requestdate,
            budget,
            details,
            status,
          ]);
          employee_budget_history.push([
            requestdate,
            requestby,
            budget,
            status,
            fullname,
            transactiondate,
          ]);

          // console.log(request_budget);
          // console.log(employee_budget_history);
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
        } else {
          return res.json({
            msg: "idnotexist",
          });
        }
      })
      .catch((error) => {
        res.json({
          msg: error,
        });
      });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getrequest", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from budget_request_details where not brd_status='${status}' and brd_requestby='${requestby}'`;

    console.log(requestby);

    mysql.Select(sql, "BudgetRequestDetails", (err, result) => {
      if (err) console.error("Error: ", err);
      let data = [];

      console.log(`${requestby} ${status}`);

      result.forEach((key, item) => {
        let details = "";
        var detail = key.details;
        detail = JSON.parse(detail);

        detail.forEach((key, item) => {
          details += `${key.ticketid} ${key.concern} ${key.issue} [${key.storename}], `;
        });

        data.push({
          requestid: key.requestid,
          requestby: key.requestby,
          requestdate: key.requestdate,
          budget: key.budget,
          details: details,
          status: key.status,
        });
      });

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
