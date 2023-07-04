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
    let approve = dictionary.GetValue(dictionary.APD());
    let request_budget = [];
    let employee_budget_history = [];
    let sql_check = `select * from budget_request_details where brd_requestby='${requestby}' and brd_status='${approve}'`;

    console.log(details);

    mysql
      .isDataExist(sql_check, "BudgetRequestDetails")
      .then((fullname) => {
        console.log(fullname);
        if (fullname) {
          return res.json({
            msg: "notreimburse",
          });
        } else {
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

router.post("/approve", (req, res) => {
  try {
    let requestid = req.body.requestid;
    let requestby = req.body.requestby;
    let budget = req.body.budget;
    let approve = dictionary.GetValue(dictionary.APD());

    let sql_budget_request_detail = `update budget_request_details 
                  set brd_status=? 
                  where brd_requestid=?`;
    let update_budget_request_detail = [approve, requestid];

    let sql_employee_budget = `update employee_budget set eb_balance=? where eb_employeeid=?`;
    let sql_check_employee_budget = `select eb_balance as balance from employee_budget where eb_employeeid='${requestby}'`;

    mysql.SelectResult(sql_check_employee_budget, (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result[0].balance);

      let current_balance = parseFloat(result[0].balance);
      let total_balance = parseFloat(budget) + current_balance;
      let update_employee_budget = [`${total_balance}`, requestby];

      mysql.UpdateMultiple(
        //employee_budget
        sql_employee_budget,
        update_employee_budget,
        (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);

          mysql.UpdateMultiple(
            //budget_request_detail
            sql_budget_request_detail,
            update_budget_request_detail,
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
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
